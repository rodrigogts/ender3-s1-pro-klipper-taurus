#!/usr/bin/env node
// Frank Pro — painel e consultas via Moonraker. Somente leitura (apenas GET).
// Uso: node scripts/frank-pro.mjs --host <ip> [--param <nome>] [--json] [--watch <s>]

import { parseArgs } from 'node:util';

const PARAMS = {
  painel: 'Painel completo da impressão (padrão)',
  status: 'Uma linha: estado, progresso, camada, temperaturas, restante',
  temps: 'Temperaturas, potência dos heaters e saúde do Raspberry',
  limites: 'Limites de movimento ativos × printer.cfg',
  versoes: 'Versões de Klipper host, MCU, Moonraker e sistema',
  historico: 'Últimos trabalhos: tempo real × estimativa do slicer (--limit)',
  arquivo: 'Metadados e histórico de um G-code (--file)',
  arquivos: 'G-codes mais recentes na impressora (--limit)',
  mesh: 'Perfis de bed mesh e grade',
  sensores: 'Filamento, probe, endstops e idle',
  config: 'Seção do printer.cfg parseada pelo Klipper (--section)',
  avisos: 'Avisos e depreciações do Klipper/Moonraker',
};

const USAGE = `Uso: node scripts/frank-pro.mjs --host <ip> [--param <nome>] [opções]

Consultas (--param):
${Object.entries(PARAMS).map(([k, v]) => `  ${k.padEnd(10)} ${v}`).join('\n')}

Opções:
  --host <ip>       Endereço do Moonraker (obrigatório), ex.: 192.168.0.150 ou 192.168.0.150:7125
  --param <nome>    Consulta a executar (padrão: painel)
  --json            Saída em JSON
  --watch <s>       Repete a consulta a cada <s> segundos
  --limit <n>       Quantidade de itens (historico, arquivos)
  --file <nome>     Arquivo G-code (arquivo, historico)
  --section <nome>  Seção do printer.cfg (config)
  --help            Mostra esta ajuda

Somente leitura: o script não envia G-code nem comandos à impressora.`;

let args;
try {
  ({ values: args } = parseArgs({
    options: {
      host: { type: 'string' },
      param: { type: 'string', default: 'painel' },
      json: { type: 'boolean', default: false },
      watch: { type: 'string' },
      limit: { type: 'string' },
      file: { type: 'string' },
      section: { type: 'string' },
      help: { type: 'boolean', default: false },
    },
  }));
} catch (e) {
  console.error(`${e.message}\n\n${USAGE}`);
  process.exit(2);
}
if (args.help) { console.log(USAGE); process.exit(0); }
if (!args.host) { console.error(USAGE); process.exit(2); }
if (!PARAMS[args.param]) { console.error(`--param desconhecido: ${args.param}\n\n${USAGE}`); process.exit(2); }

// Build da MCU validada na Frank Pro. A divergência com o host é intencional:
// ver docs/frank-pro-klipper-host-mcu.md antes de alterar.
const MCU_VALIDADA = { version: 'v0.11.0-0-ge02b725', toolchain: 'GNU Arm Embedded Toolchain 10.3-2021.10' };
const mcuValidada = (version, build) => version === MCU_VALIDADA.version && String(build ?? '').includes(MCU_VALIDADA.toolchain);

const BASE = /^https?:\/\//.test(args.host) ? args.host.replace(/\/$/, '') : `http://${args.host}`;
const LIMIT = Math.max(1, parseInt(args.limit ?? '10', 10) || 10);

// ---------- saída ----------
const COLOR = process.stdout.isTTY && !process.env.NO_COLOR && !args.json;
const paint = (code) => (s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const c = { bold: paint(1), dim: paint(2), red: paint(31), green: paint(32), yellow: paint(33), blue: paint(34), cyan: paint(36) };

const fmtDur = (s) => {
  if (s == null || !isFinite(s)) return '—';
  s = Math.max(0, Math.round(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}h${String(m).padStart(2, '0')}m${String(r).padStart(2, '0')}s` : `${m}m${String(r).padStart(2, '0')}s`;
};
const fmtDate = (ts) => (ts ? new Date(ts * 1000).toLocaleString('pt-BR') : '—');
const n = (v, d = 1) => (v == null || !isFinite(v) ? '—' : Number(v).toFixed(d));
const pct = (v) => `${n(v * 100, 1)}%`;
const bar = (p, w = 30) => {
  const f = Math.round(Math.min(1, Math.max(0, p)) * w);
  return c.green('█'.repeat(f)) + c.dim('░'.repeat(w - f));
};
const stateColor = (s) => ({ printing: c.green, paused: c.yellow, complete: c.cyan, error: c.red, cancelled: c.red }[s] ?? c.dim)(s);
const heater = (h) => `${n(h?.temperature)}°C / ${n(h?.target, 0)}°C ${c.dim(`(${pct(h?.power ?? 0)})`)}`;
const table = (rows, head) => {
  const all = head ? [head, ...rows] : rows;
  const w = all[0].map((_, i) => Math.max(...all.map((r) => String(r[i] ?? '').replace(/\x1b\[[0-9;]*m/g, '').length)));
  const line = (r) => r.map((v, i) => {
    const s = String(v ?? '');
    return s + ' '.repeat(w[i] - s.replace(/\x1b\[[0-9;]*m/g, '').length);
  }).join('  ');
  return [head && c.bold(line(head)), ...rows.map(line)].filter(Boolean).join('\n');
};

// ---------- API (somente GET) ----------
async function get(path) {
  let res;
  try {
    res = await fetch(`${BASE}/${path}`, { signal: AbortSignal.timeout(5000) });
  } catch (e) {
    throw new Error(`sem resposta de ${BASE} (${e.cause?.code ?? e.name}: ${e.cause?.message ?? e.message})`);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HTTP ${res.status} em /${path}: ${body?.error?.message ?? res.statusText}`);
  return body.result;
}
const query = async (objs) => {
  const qs = Object.entries(objs).map(([k, v]) => encodeURIComponent(k) + (v ? `=${v}` : '')).join('&');
  return (await get(`printer/objects/query?${qs}`)).status;
};
const metadata = (file) => get(`server/files/metadata?filename=${encodeURIComponent(file)}`).catch(() => null);

// ---------- consultas ----------
const Q = {};

Q.painel = async () => {
  const s = await query({
    webhooks: '', print_stats: '', virtual_sdcard: '', display_status: '', extruder: '', heater_bed: '',
    fan: '', 'heater_fan hotend_fan': '', toolhead: '', gcode_move: '', motion_report: '', idle_timeout: '',
  });
  const ps = s.print_stats;
  const meta = ps.filename ? await metadata(ps.filename) : null;
  const progress = s.virtual_sdcard.progress ?? 0;
  const est = meta?.estimated_time ?? null;
  const restanteSlicer = est != null ? est - ps.print_duration : null;
  const restanteProg = progress > 0.01 ? ps.print_duration / progress - ps.print_duration : null;
  return {
    klippy: s.webhooks, estado: ps.state, mensagem: ps.message || s.display_status.message || '',
    arquivo: ps.filename || null, progresso: progress,
    camada: ps.info?.current_layer ?? null, camadas: ps.info?.total_layer ?? meta?.layer_count ?? null,
    tempo: { impressao: ps.print_duration, total: ps.total_duration, estimativa_slicer: est,
      restante_slicer: restanteSlicer, restante_por_progresso: restanteProg },
    filamento_mm: ps.filament_used,
    bico: s.extruder, mesa: s.heater_bed, fan_peca: s.fan.speed, fan_hotend: s['heater_fan hotend_fan'].speed,
    posicao: s.motion_report.live_position, velocidade: s.motion_report.live_velocity,
    speed_factor: s.gcode_move.speed_factor, extrude_factor: s.gcode_move.extrude_factor,
    max_accel: s.toolhead.max_accel, max_velocity: s.toolhead.max_velocity,
    homed: s.toolhead.homed_axes, idle: s.idle_timeout.state,
  };
};
Q.painel.print = (d) => {
  const L = [];
  L.push(c.bold('FRANK PRO') + c.dim(` — ${BASE} — ${new Date().toLocaleTimeString('pt-BR')}`));
  if (d.klippy.state !== 'ready') L.push(c.red(`Klipper: ${d.klippy.state} — ${d.klippy.state_message}`));
  L.push(`Estado     ${stateColor(d.estado)}${d.mensagem ? c.dim(`  ${d.mensagem}`) : ''}   ${c.dim(`idle: ${d.idle}, homed: ${d.homed || '—'}`)}`);
  if (d.arquivo) {
    L.push(`Arquivo    ${d.arquivo}`);
    L.push(`Progresso  ${bar(d.progresso)} ${pct(d.progresso)}   camada ${d.camada ?? '—'}/${d.camadas ?? '—'}`);
    const t = d.tempo;
    L.push(`Tempo      impressão ${fmtDur(t.impressao)}  total ${fmtDur(t.total)}  slicer ${fmtDur(t.estimativa_slicer)}`);
    L.push(`Restante   pelo slicer ${fmtDur(t.restante_slicer)}  pelo progresso ${fmtDur(t.restante_por_progresso)}`);
    L.push(`Filamento  ${n(d.filamento_mm / 1000, 2)} m`);
  }
  L.push(`Bico       ${heater(d.bico)}`);
  L.push(`Mesa       ${heater(d.mesa)}`);
  L.push(`Fans       peça ${pct(d.fan_peca)}  hotend ${pct(d.fan_hotend)}`);
  L.push(`Posição    X${n(d.posicao[0], 2)} Y${n(d.posicao[1], 2)} Z${n(d.posicao[2], 2)}   vel ${n(d.velocidade)} mm/s`);
  L.push(`Fatores    speed ${pct(d.speed_factor)}  flow ${pct(d.extrude_factor)}`);
  L.push(`Limites    max_accel ${n(d.max_accel, 0)}  max_velocity ${n(d.max_velocity, 0)}`);
  return L.join('\n');
};

Q.status = async () => Q.painel();
Q.status.print = (d) => {
  const parts = [stateColor(d.estado)];
  if (d.arquivo) parts.push(pct(d.progresso), `camada ${d.camada ?? '—'}/${d.camadas ?? '—'}`,
    `restante ${fmtDur(d.tempo.restante_slicer ?? d.tempo.restante_por_progresso)}`);
  parts.push(`bico ${n(d.bico.temperature, 0)}/${n(d.bico.target, 0)}`, `mesa ${n(d.mesa.temperature, 0)}/${n(d.mesa.target, 0)}`);
  if (d.arquivo) parts.push(d.arquivo);
  return parts.join(' | ');
};

Q.temps = async () => {
  const [s, proc] = await Promise.all([
    query({ extruder: 'temperature,target,power', heater_bed: 'temperature,target,power', 'heater_fan hotend_fan': 'speed', system_stats: '' }),
    get('machine/proc_stats'),
  ]);
  return { bico: s.extruder, mesa: s.heater_bed, fan_hotend: s['heater_fan hotend_fan'].speed, system_stats: s.system_stats,
    cpu_temp: proc.cpu_temp, throttled: proc.throttled_state, moonraker: proc.moonraker_stats?.at(-1), system_uptime: proc.system_uptime,
    rede: proc.network };
};
Q.temps.print = (d) => {
  const thr = d.throttled?.flags ?? [];
  return [
    `Bico          ${heater(d.bico)}   fan hotend ${pct(d.fan_hotend)}`,
    `Mesa          ${heater(d.mesa)}`,
    `CPU do Pi     ${n(d.cpu_temp)}°C   load ${n(d.system_stats.sysload, 2)}   memória livre ${n(d.system_stats.memavail / 1024, 0)} MB`,
    `Throttling    ${thr.length ? c.red(thr.join(', ')) : c.green('nenhum')}`,
    `Moonraker     CPU ${n(d.moonraker?.cpu_usage)}%   uptime do sistema ${fmtDur(d.system_uptime)}`,
  ].join('\n');
};

Q.limites = async () => {
  const s = await query({ toolhead: 'max_accel,max_velocity,minimum_cruise_ratio,square_corner_velocity', configfile: 'settings' });
  const cfg = s.configfile.settings.printer ?? {};
  const keys = ['max_accel', 'max_velocity', 'minimum_cruise_ratio', 'square_corner_velocity'];
  return { itens: keys.map((k) => ({ chave: k, ativo: s.toolhead[k], printer_cfg: cfg[k] ?? null })),
    printer_cfg: cfg };
};
Q.limites.print = (d) => {
  const rows = d.itens.map((i) => {
    const diff = i.printer_cfg != null && Math.abs(i.ativo - i.printer_cfg) > 1e-9;
    return [i.chave, n(i.ativo, 3).replace(/\.?0+$/, ''), i.printer_cfg == null ? c.dim('padrão') : String(i.printer_cfg),
      diff ? c.yellow('DIFERENTE (SET_VELOCITY_LIMIT ativo)') : c.green('ok')];
  });
  const extra = ['kinematics', 'max_z_velocity', 'max_z_accel'].filter((k) => k in d.printer_cfg)
    .map((k) => `${k}: ${d.printer_cfg[k]}`).join('   ');
  return `${table(rows, ['Limite', 'Ativo', 'printer.cfg', ''])}\n${c.dim(extra)}`;
};

Q.versoes = async () => {
  const [pi, si, sys, s] = await Promise.all([get('printer/info'), get('server/info'), get('machine/system_info'), query({ mcu: 'mcu_version,mcu_build_versions,mcu_constants' })]);
  const dist = sys.system_info.distribution;
  return { klipper_host: pi.software_version, mcu: s.mcu.mcu_version, mcu_build: s.mcu.mcu_build_versions,
    mcu_validada: mcuValidada(s.mcu.mcu_version, s.mcu.mcu_build_versions),
    mcu_chip: s.mcu.mcu_constants?.MCU, moonraker: si.moonraker_version, api: si.api_version_string,
    os: `${dist.name}${dist.release_info?.name ? ` — ${dist.release_info.name} ${dist.release_info.version_id}` : ''}`,
    kernel: dist.kernel_version, hardware: sys.system_info.cpu_info.model, python: sys.system_info.python.version_string.split(' ')[0] };
};
Q.versoes.print = (d) => {
  const base = (v) => String(v).split('-')[0];
  const diverge = base(d.klipper_host) !== base(d.mcu);
  const situacao = d.mcu_validada
    ? c.green(diverge ? 'build validada (divergência do host esperada)' : 'build validada')
    : c.yellow(`DIFERENTE da build validada (${MCU_VALIDADA.version}, GCC 10.3.1)`);
  return [
    `Klipper host  ${d.klipper_host}`,
    `MCU           ${d.mcu}  ${c.dim(d.mcu_chip ?? '')}  ${situacao}`,
    `MCU build     ${c.dim(d.mcu_build)}`,
    `Moonraker     ${d.moonraker}  ${c.dim(`API ${d.api}`)}`,
    `Sistema       ${d.os}  ${c.dim(`kernel ${d.kernel}`)}`,
    `Hardware      ${d.hardware}  ${c.dim(`Python ${d.python}`)}`,
  ].join('\n');
};

const jobRow = (j) => {
  const est = j.metadata?.estimated_time ?? null;
  // Comparar com a estimativa só faz sentido em trabalho concluído
  const delta = est && j.status === 'completed' ? j.print_duration - est : null;
  return { id: j.job_id, arquivo: j.filename, status: j.status, inicio: j.start_time,
    impressao_s: j.print_duration, total_s: j.total_duration, estimativa_s: est,
    delta_s: delta, delta_pct: est ? delta / est : null, filamento_mm: j.filament_used,
    filamento_g: j.metadata?.filament_weight_total ?? null };
};
Q.historico = async () => {
  const r = await get(`server/history/list?limit=${args.file ? 200 : LIMIT}&order=desc`);
  let jobs = r.jobs.map(jobRow);
  if (args.file) jobs = jobs.filter((j) => j.arquivo === args.file).slice(0, LIMIT);
  return { total_no_servidor: r.count, trabalhos: jobs };
};
Q.historico.print = (d) => {
  if (!d.trabalhos.length) return c.dim('Nenhum trabalho no histórico.');
  const rows = d.trabalhos.map((j) => [
    j.id, fmtDate(j.inicio), stateColor(j.status), fmtDur(j.impressao_s), fmtDur(j.total_s), fmtDur(j.estimativa_s),
    j.delta_s == null ? '—' : `${j.delta_s >= 0 ? '+' : '−'}${fmtDur(Math.abs(j.delta_s))} (${j.delta_pct >= 0 ? '+' : '−'}${n(Math.abs(j.delta_pct) * 100, 1)}%)`,
    j.arquivo,
  ]);
  return `${table(rows, ['ID', 'Início', 'Status', 'Impressão', 'Total', 'Slicer', 'Real − slicer', 'Arquivo'])}\n` +
    c.dim('Real − slicer: tempo de impressão contra a estimativa, só para trabalhos concluídos.');
};

Q.arquivo = async () => {
  if (!args.file) throw new Error('--param arquivo exige --file <nome.gcode>');
  const [meta, hist] = await Promise.all([metadata(args.file), get('server/history/list?limit=200&order=desc')]);
  const jobs = hist.jobs.filter((j) => j.filename === args.file);
  // Arquivo apagado da impressora: usa os metadados guardados no histórico
  const m = meta ?? jobs[0]?.metadata;
  if (!m) throw new Error(`"${args.file}" não está na impressora nem no histórico. Veja --param arquivos.`);
  return { arquivo: args.file, na_impressora: !!meta, metadata: m, historico: jobs.map(jobRow) };
};
Q.arquivo.print = (d) => {
  const m = d.metadata;
  const L = [
    c.bold(d.arquivo) + (d.na_impressora ? '' : c.yellow('  (removido da impressora; dados do histórico)')),
    `Slicer       ${m.slicer ?? '—'} ${m.slicer_version ?? ''}   modificado ${fmtDate(m.modified)}`,
    `Estimativa   ${fmtDur(m.estimated_time)}   camadas ${m.layer_count ?? '—'}   altura ${n(m.object_height, 2)} mm   layer ${m.layer_height ?? '—'}`,
    `Filamento    ${m.filament_name ?? '—'} (${m.filament_type ?? '—'})   ${n(m.filament_weight_total, 2)} g   ${n((m.filament_total ?? 0) / 1000, 2)} m`,
    `1ª camada    bico ${m.first_layer_extr_temp ?? '—'}°C   mesa ${m.first_layer_bed_temp ?? '—'}°C`,
  ];
  L.push(d.historico.length ? `\n${Q.historico.print({ trabalhos: d.historico })}` : c.dim('\nAinda não impresso nesta máquina.'));
  return L.join('\n');
};

Q.arquivos = async () => {
  const files = await get('server/files/list?root=gcodes');
  return files.sort((a, b) => b.modified - a.modified).slice(0, LIMIT);
};
Q.arquivos.print = (d) => table(d.map((f) => [fmtDate(f.modified), `${n(f.size / 1048576, 2)} MB`, f.path]), ['Modificado', 'Tamanho', 'Arquivo']);

Q.mesh = async () => {
  const s = await query({ bed_mesh: '' });
  return s.bed_mesh;
};
Q.mesh.print = (d) => {
  const L = [`Perfil ativo  ${d.profile_name || c.yellow('nenhum carregado agora (o start G-code carrega o default)')}`];
  for (const [name, p] of Object.entries(d.profiles ?? {})) {
    const flat = p.points.flat();
    const min = Math.min(...flat), max = Math.max(...flat);
    const mp = p.mesh_params;
    L.push('', c.bold(`Perfil "${name}"`) + c.dim(`  ${mp.x_count}x${mp.y_count}  X ${mp.min_x}–${mp.max_x}  Y ${mp.min_y}–${mp.max_y}  ${mp.algo}`));
    const rows = [...p.points].reverse().map((r, i) => [c.dim(`Y${p.points.length - 1 - i}`), ...r.map((v) => (v >= 0 ? ' ' : '') + v.toFixed(3))]);
    L.push(table(rows));
    L.push(`mín ${min.toFixed(3)}  máx ${max.toFixed(3)}  amplitude ${c.bold((max - min).toFixed(3))} mm`);
  }
  return L.join('\n');
};

Q.sensores = async () => {
  const objs = (await get('printer/objects/list')).objects;
  const want = Object.fromEntries(objs.filter((o) => /^(filament_switch_sensor|filament_motion_sensor) /.test(o)).map((o) => [o, '']));
  const s = await query({ ...want, probe: '', query_endstops: '', idle_timeout: '', toolhead: 'homed_axes' });
  return s;
};
Q.sensores.print = (d) => {
  const L = [];
  for (const [k, v] of Object.entries(d).filter(([k]) => k.startsWith('filament_'))) {
    L.push(`${k.split(' ')[1].padEnd(12)} ${v.enabled ? '' : c.yellow('[desabilitado] ')}${v.filament_detected ? c.green('filamento presente') : c.red('SEM filamento')}`);
  }
  L.push(`Probe        ${d.probe.name}   última consulta: ${d.probe.last_query ? 'acionado' : 'livre'}   último Z ${n(d.probe.last_z_result, 3)}`);
  const eq = Object.entries(d.query_endstops.last_query ?? {});
  L.push(`Endstops     ${eq.length ? eq.map(([k, v]) => `${k}: ${v ? 'acionado' : 'livre'}`).join('  ') : c.dim('sem consulta recente (rode QUERY_ENDSTOPS no Mainsail)')}`);
  L.push(`Homed        ${d.toolhead.homed_axes || '—'}   idle: ${d.idle_timeout.state}`);
  return L.join('\n');
};

Q.config = async () => {
  const s = await query({ configfile: 'settings' });
  const st = s.configfile.settings;
  if (!args.section) return { secoes: Object.keys(st) };
  const key = args.section.toLowerCase();
  if (!(key in st)) throw new Error(`seção "${args.section}" não existe. Use --param config sem --section para listar.`);
  return { secao: key, valores: st[key] };
};
Q.config.print = (d) => {
  if (d.secoes) return `Seções:\n${d.secoes.map((s) => `  ${s}`).join('\n')}`;
  const fmt = (v) => (typeof v === 'string' && v.includes('\n') ? `\n${v.split('\n').map((l) => `    ${l}`).join('\n')}` : JSON.stringify(v));
  return `${c.bold(`[${d.secao}]`)}\n${Object.entries(d.valores).map(([k, v]) => `${k}: ${fmt(v)}`).join('\n')}`;
};

Q.avisos = async () => {
  const [s, si] = await Promise.all([
    query({ configfile: 'warnings', webhooks: '', mcu: 'mcu_version,mcu_build_versions' }), get('server/info')]);
  const validada = mcuValidada(s.mcu.mcu_version, s.mcu.mcu_build_versions);
  // deprecated_mcu_code só é esperado para a MCU principal na build validada; o resto é aviso real
  const klipper = s.configfile.warnings.map((w) => ({ ...w,
    esperado: w.type === 'deprecated_mcu_code' && (w.mcu ?? 'mcu') === 'mcu' && validada }));
  return { klipper, klippy_state: s.webhooks, mcu_validada: validada, moonraker: si.warnings,
    componentes_falhos: si.failed_components, requisitos_faltando: si.missing_klippy_requirements };
};
Q.avisos.print = (d) => {
  const L = [];
  if (d.klippy_state.state !== 'ready') L.push(c.red(`Klipper ${d.klippy_state.state}: ${d.klippy_state.state_message}`));
  for (const w of d.klipper.filter((w) => !w.esperado)) L.push(`${c.yellow('Klipper')}   [${w.type}] ${w.message}`);
  for (const w of d.moonraker) L.push(`${c.yellow('Moonraker')} ${w}`);
  if (d.componentes_falhos.length) L.push(`${c.red('Componentes com falha')} ${d.componentes_falhos.join(', ')}`);
  if (d.requisitos_faltando.length) L.push(`${c.red('Requisitos faltando')} ${d.requisitos_faltando.join(', ')}`);
  if (!L.length) L.push(c.green('Nenhum aviso real.'));
  const esperados = d.klipper.filter((w) => w.esperado);
  if (esperados.length) {
    L.push('', c.dim(`Esperados (MCU na build validada ${MCU_VALIDADA.version}; ver docs/frank-pro-klipper-host-mcu.md):`));
    for (const w of esperados) L.push(c.dim(`  [${w.type}] ${w.message}`));
  }
  return L.join('\n');
};

// ---------- execução ----------
async function runOnce() {
  const data = await Q[args.param]();
  return args.json ? JSON.stringify(data, null, 2) : Q[args.param].print(data);
}

async function main() {
  const watch = args.watch ? Math.max(1, Number(args.watch)) : 0;
  if (!watch) { console.log(await runOnce()); return; }
  for (;;) {
    let out;
    try { out = await runOnce(); } catch (e) { out = c.red(`erro: ${e.message}`); }
    if (process.stdout.isTTY && !args.json) process.stdout.write('\x1b[2J\x1b[H');
    console.log(out);
    await new Promise((r) => setTimeout(r, watch * 1000));
  }
}

main().catch((e) => { console.error(c.red(`erro: ${e.message}`)); process.exit(1); });
