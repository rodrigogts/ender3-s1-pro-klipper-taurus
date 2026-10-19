#!/usr/bin/env node
// Monta web-ui-project/web-files/ para o projeto web: presets da Frank Pro, bases do Orca
// unificadas e docs. Valida os limites do projeto web e lista o que reenviar.
// Uso: node scripts/web-files.mjs [--check]

import { parseArgs } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const USAGE = `Uso: node scripts/web-files.mjs [--check]

Gera web-ui-project/web-files/ a partir das fontes do repo:
  - presets de printers/frank-pro/orca/{machine,filament,process}/, copiados sem alteração;
  - bases herdadas por esses presets, unificadas a partir de resources/orca-defaults/;
  - docs e snapshots do Klipper, com nome plano.

Opções:
  --check   Não escreve nada; sai com 1 se algo mudaria ou se um limite estoura
  --help    Mostra esta ajuda`;

let args;
try {
  ({ values: args } = parseArgs({
    options: { check: { type: 'boolean', default: false }, help: { type: 'boolean', default: false } },
  }));
} catch (e) {
  console.error(`${e.message}\n\n${USAGE}`);
  process.exit(2);
}
if (args.help) { console.log(USAGE); process.exit(0); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'web-ui-project/web-files');
const INSTRUCOES = path.join(ROOT, 'web-ui-project/instructions.md');
const DEFAULTS = path.join(ROOT, 'resources/orca-defaults');
const PRESETS = path.join(ROOT, 'printers/frank-pro/orca');
const ORCA_USER = path.join(os.homedir(), '.config/OrcaSlicer/user/default');
const TIPOS = ['machine', 'filament', 'process'];

// Limites do projeto web (web-ui-project/README.md)
const LIMITE_ARQUIVOS = 25;
const LIMITE_INSTRUCOES = 8000;

// Docs com nome plano: nome no projeto web → fonte relativa à raiz. Uma lista de fontes
// vira um arquivo só (economiza vagas do limite); pasta terminada em "/" entra inteira,
// README.md primeiro e o resto em ordem alfabética
const DOCS = {
  'frank-pro.md': 'printers/frank-pro/README.md',
  'frank-pro-calibracao.md': 'printers/frank-pro/calibracao.md',
  'frank-mini.md': 'printers/frank-mini/README.md',
  'guia-presets.md': 'web-ui-project/knowledge/guia-presets.md',
  'to-do.md': 'to-do/',
  // .txt para o upload não recusar a extensão .cfg
  'frank-pro-klipper.cfg.txt': ['printers/frank-pro/klipper/printer.cfg', 'printers/frank-pro/klipper/mainsail.cfg'],
};

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code) => (s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const c = { bold: paint(1), dim: paint(2), red: paint(31), green: paint(32), yellow: paint(33) };

const erros = [];
const avisos = [];
const rel = (p) => path.relative(ROOT, p);
const hash = (buf) => createHash('sha256').update(buf).digest('hex');
const listJson = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    erros.push(`JSON inválido em ${rel(file)}: ${e.message}`);
    return null;
  }
}

// ---------- presets ----------
const presets = [];
for (const tipo of TIPOS) {
  const dir = path.join(PRESETS, tipo);
  for (const nome of listJson(dir)) {
    const file = path.join(dir, nome);
    const dados = readJson(file);
    if (dados) presets.push({ tipo, nome, file, dados });
  }
}

// ---------- bases unificadas ----------
// Índice por "name": o inherits do Orca referencia o nome do perfil, não o arquivo
const defaults = new Map();
for (const nome of listJson(DEFAULTS)) {
  const file = path.join(DEFAULTS, nome);
  const dados = readJson(file);
  if (!dados?.name) continue;
  if (defaults.has(dados.name)) erros.push(`nome duplicado em resources/orca-defaults: "${dados.name}"`);
  defaults.set(dados.name, dados);
}

// Mesma regra do resources/orca-defaults/README.md: cada chave do descendente substitui
// a do ancestral inteira (arrays não são mesclados) e o inherits sai do resultado
function resolve(nome, cadeia = []) {
  if (cadeia.includes(nome)) throw new Error(`ciclo de herança: ${[...cadeia, nome].join(' → ')}`);
  const perfil = defaults.get(nome);
  if (!perfil) throw new Error(`ancestral ausente em resources/orca-defaults: "${nome}"`);
  const pai = perfil.inherits ? resolve(perfil.inherits, [...cadeia, nome]) : {};
  const r = { ...pai, ...perfil };
  delete r.inherits;
  return r;
}

const saida = new Map(); // nome no projeto web → conteúdo
const add = (nome, buf, origem) => {
  if (saida.has(nome)) erros.push(`dois arquivos geram "${nome}" (${origem})`);
  else if (!buf.length) erros.push(`arquivo vazio: ${origem}`);
  else saida.set(nome, buf);
};

for (const p of presets) add(p.nome, fs.readFileSync(p.file), rel(p.file));
for (const base of [...new Set(presets.map((p) => p.dados.inherits).filter(Boolean))].sort()) {
  try {
    add(`${base}.json`, Buffer.from(`${JSON.stringify(resolve(base), null, 2)}\n`), `base ${base}`);
  } catch (e) {
    erros.push(e.message);
  }
}
for (const p of presets.filter((p) => !p.dados.inherits)) avisos.push(`${rel(p.file)} não tem inherits`);

const fontes = (spec) => [spec].flat().flatMap((f) => {
  if (!f.endsWith('/')) return [f];
  const dir = path.join(ROOT, f);
  if (!fs.existsSync(dir)) return [f];
  const mds = fs.readdirSync(dir).filter((n) => n.endsWith('.md')).sort();
  return [...mds.filter((n) => n === 'README.md'), ...mds.filter((n) => n !== 'README.md')].map((n) => f + n);
});
// Cabeçalho de cada parte no formato de comentário do tipo de arquivo
const marca = (nome, origem) => (nome.endsWith('.md') ? `<!-- fonte: ${origem} -->` : `# ===== fonte: ${origem} =====`);

for (const [nome, spec] of Object.entries(DOCS)) {
  const lista = fontes(spec);
  const ausentes = lista.filter((f) => !fs.existsSync(path.join(ROOT, f)));
  if (ausentes.length) { erros.push(`fonte ausente: ${ausentes.join(', ')}`); continue; }
  if (lista.length === 1) { add(nome, fs.readFileSync(path.join(ROOT, lista[0])), lista[0]); continue; }
  const partes = lista.map((f) => `${marca(nome, f)}\n${fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\s+$/, '')}\n`);
  add(nome, Buffer.from(partes.join('\n')), lista.join(' + '));
}

// ---------- limites ----------
if (saida.size > LIMITE_ARQUIVOS) erros.push(`${saida.size} arquivos, acima do limite de ${LIMITE_ARQUIVOS}`);
const instrucoes = fs.existsSync(INSTRUCOES) ? fs.readFileSync(INSTRUCOES, 'utf8') : '';
// Code points, como o wc -m: acentos contam 1
const chars = [...instrucoes].length;
if (!chars) erros.push(`${rel(INSTRUCOES)} vazio ou ausente`);
if (chars > LIMITE_INSTRUCOES) erros.push(`${rel(INSTRUCOES)} com ${chars} caracteres, acima do limite de ${LIMITE_INSTRUCOES}`);

// ---------- cópia do repo × presets vivos do Orca ----------
// Só aviso: o Orca é a fonte viva e o repo precisa ser atualizado à mão
if (fs.existsSync(ORCA_USER)) {
  for (const p of presets) {
    const vivo = path.join(ORCA_USER, p.tipo, p.nome);
    if (!fs.existsSync(vivo)) avisos.push(`${rel(p.file)} não existe no Orca (${p.tipo}/)`);
    else if (hash(fs.readFileSync(vivo)) !== hash(fs.readFileSync(p.file))) avisos.push(`${rel(p.file)} difere do Orca`);
  }
  for (const tipo of TIPOS) {
    const dir = path.join(ORCA_USER, tipo);
    if (!fs.existsSync(dir)) continue;
    for (const nome of listJson(dir)) {
      if (!presets.some((p) => p.tipo === tipo && p.nome === nome)) avisos.push(`${tipo}/${nome} existe no Orca e não no repo`);
    }
  }
}

// ---------- diferença com o web-files atual ----------
const atuais = new Map();
if (fs.existsSync(OUT)) {
  for (const nome of fs.readdirSync(OUT)) {
    const file = path.join(OUT, nome);
    if (fs.statSync(file).isFile()) atuais.set(nome, hash(fs.readFileSync(file)));
  }
}
const reenviar = [...saida].filter(([nome, buf]) => atuais.get(nome) !== hash(buf)).map(([nome]) => nome).sort();
const remover = [...atuais.keys()].filter((nome) => !saida.has(nome)).sort();

// ---------- relatório ----------
for (const e of erros) console.error(c.red(`erro: ${e}`));
for (const a of avisos) console.log(c.yellow(`aviso: ${a}`));
if (erros.length) process.exit(1);

console.log(`${c.bold('web-files')}  ${saida.size}/${LIMITE_ARQUIVOS} arquivos   ${c.bold('instructions.md')}  ${chars}/${LIMITE_INSTRUCOES} caracteres`);
if (!reenviar.length && !remover.length) {
  console.log(c.green('web-files em dia com as fontes; nada a reenviar.'));
  process.exit(0);
}
if (reenviar.length) console.log(`${args.check ? 'Mudaria' : 'Reenviar'} (${reenviar.length}):\n${reenviar.map((n) => `  ${n}`).join('\n')}`);
if (remover.length) console.log(`${args.check ? 'Sairia' : 'Remover do projeto web'} (${remover.length}):\n${remover.map((n) => `  ${n}`).join('\n')}`);
if (args.check) {
  console.log(c.yellow('web-files desatualizado: rode sem --check.'));
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
for (const nome of reenviar) fs.writeFileSync(path.join(OUT, nome), saida.get(nome));
for (const nome of remover) fs.unlinkSync(path.join(OUT, nome));
console.log(c.dim(`Gravado em ${rel(OUT)}/`));
