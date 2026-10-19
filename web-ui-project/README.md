# Projeto web — regras de criação

Este diretório gera o projeto web (LLM no navegador) sobre impressão 3D da Frank Pro e da Frank Mini.
Leitor dos arquivos daqui: uma LLM. Escrever para ela, não para humanos.

## Partes
- `instructions.md`: colar no campo de instruções do projeto web. Diz COMO agir.
- `web-files/`: enviar como arquivos do projeto. Contêm os FATOS.
- `knowledge/`: fontes de docs que existem só para o projeto web (hoje `guia-presets.md`).

## Limites duros
- `instructions.md`: no máximo 8000 caracteres, contando tudo (espaços, quebras de linha, markdown). Contar code points (`wc -m`), não bytes.
- `web-files/`: no máximo 25 arquivos.
- `node scripts/web-files.mjs` valida os dois e falha se passar.

## Regras de escrita (instructions.md e todo doc que vai para web-files)
- Imperativo e direto: "Fazer X", "Nunca Y". Sem introdução, sem prosa, sem explicar o óbvio.
- Bullets curtos; `chave: valor`; uma informação por linha.
- Unidades sempre explícitas (°C, mm, mm/s, mm³/s, mm/s²). Datas absolutas (AAAA-MM-DD), nunca "ontem" ou "semana passada".
- Termos estáveis: mesmo nome para a mesma coisa em todos os arquivos (nomes exatos de presets, seções do Klipper, comandos).
- Marcar o status: VALIDADO, PENDENTE, HIPÓTESE, NÃO VALIDADO, planejado/comprado/instalado.
- Instruções não repetem fatos dos arquivos; apontam o arquivo. Um fato mora em um arquivo só.
- Comandos, G-code e valores prontos para copiar, em bloco de código.
- Português BR.

## Fonte de cada arquivo de web-files/
Nunca editar `web-files/` à mão: o script apaga e recria. Editar a fonte.

| Arquivo no web | Fonte |
|---|---|
| presets `*.json` (12) | `printers/frank-pro/orca/{machine,filament,process}/` |
| bases `Creality Generic *.json`, `Creality Ender-3 S1 Pro 0.4 nozzle.json`, `0.20mm Standard @Creality Ender3S1Pro.json` (6) | geradas pelo script a partir de `resources/orca-defaults/` |
| `frank-pro.md` | `printers/frank-pro/README.md` |
| `frank-pro-calibracao.md` | `printers/frank-pro/calibracao.md` |
| `frank-pro-klipper.cfg.txt` | `printers/frank-pro/klipper/printer.cfg` + `macros.cfg` + `mainsail.cfg`, concatenados (snapshot via `scripts/frank-pro.mjs --param cfg`) |
| `to-do.md` | `to-do/README.md` + todos os `to-do/*.md`, concatenados |
| `frank-mini.md` | `printers/frank-mini/README.md` |
| `guia-presets.md` | `knowledge/guia-presets.md` |

## Fluxo de atualização
1. Editar a fonte (preset, doc ou snapshot).
2. `node scripts/web-files.mjs`: gera e lista o que mudou desde o último envio registrado.
3. No projeto web: substituir os arquivos de "Subir de novo", apagar os de "Remover do projeto web" e, se avisado, colar de novo o `instructions.md`.
4. `node scripts/web-files.mjs --enviado`: registra o novo estado do projeto web em `web-enviado.json` (commitar junto).
5. `node scripts/web-files.mjs --check` deve dizer "Projeto web em dia com o último envio".

Atualizar o snapshot do Klipper (somente leitura, GET no Moonraker):
```sh
node scripts/frank-pro.mjs --host 192.168.0.150 --param cfg --file printer.cfg > printers/frank-pro/klipper/printer.cfg
node scripts/frank-pro.mjs --host 192.168.0.150 --param cfg --file mainsail.cfg > printers/frank-pro/klipper/mainsail.cfg
node scripts/frank-pro.mjs --host 192.168.0.150 --param cfg --file macros.cfg > printers/frank-pro/klipper/macros.cfg
```

## Fora do projeto web, e por quê
- `resources/orca-defaults/` (cadeia crua de herança): as bases unificadas já resolvem tudo.
- `Frank Pro 0.4 nozzle.orca_printer`: ZIP e snapshot antigo (2026-10-05).
- `start-n-end-gcode.gcode`: repete o G-code que já está nos presets de impressora.
- `moonraker.conf`: pode ter credenciais.
- Legados Cura/Marlin (`cura-*.curaprofile`, `ender3-s1-pro-*-code.md`, `bed-*.gcode`): histórico pré-Klipper, removido.
- `AGENTS.md`, scripts: exclusivos da CLI local.
- `resources/utils/` (comandos de Klipper, Pi e Orca): referência para o usuário e para a CLI. É candidato à vaga livre, se o projeto web precisar.

## Economia de vagas
Uma fonte com lista de arquivos (ou uma pasta) vira um arquivo só no web, com um comentário `fonte:` marcando cada parte. Usar isso antes de estourar o limite de 25.

## Ao adicionar um arquivo
Conferir a vaga (limite 25), incluir em `DOCS` em `scripts/web-files.mjs` (nome no web → fonte), atualizar a tabela acima e o mapa de arquivos em `instructions.md`.
