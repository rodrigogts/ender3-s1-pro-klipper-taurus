# Frank Pro — Klipper e Taurus

Configurações do OrcaSlicer, estado das máquinas e ferramentas da **Frank Pro**, uma Creality Ender-3 S1 Pro modificada com Klipper, extrusor Sprite Pro e cooling Taurus dual 5015. Inclui também o diagnóstico da **Frank Mini** (Ender 3 Neo).

## Conteúdo

| Caminho | Finalidade |
|---|---|
| [`printers/frank-pro/`](printers/frank-pro/README.md) | Estado da máquina, [calibração](printers/frank-pro/calibracao.md), snapshot do Klipper (`klipper/`) e presets do Orca (`orca/`) |
| [`printers/frank-mini/`](printers/frank-mini/README.md) | Estado e diagnóstico da Frank Mini |
| [`scripts/`](scripts/README.md) | Painel e consultas somente leitura da Frank Pro via Moonraker; montagem do projeto web |
| [`web-ui-project/`](web-ui-project/README.md) | Projeto web: instruções, guia de presets e arquivos para upload |
| [`to-do/`](to-do/README.md) | Itens em andamento, pendentes ou sem decisão, um arquivo por ação |
| [`resources/`](resources/README.md) | Perfis de sistema do Orca usados como base, comandos úteis (`utils/`) e atalho do Orca no desktop |
| `AGENTS.md` | Instruções do agente da CLI local e contexto técnico do projeto |

### Presets do Orca (`printers/frank-pro/orca/`)

| Tipo | Presets |
|---|---|
| `machine/` | `Frank Pro 0.4 nozzle`, `Frank Pro 0.4 nozzle Speed` |
| `process/` | `0.20mm Standard @Taurus`, `… @Taurus PETG XT Speed`, `… @Taurus PLA Speed` |
| `filament/` | `Creality Taurus PLA/PETG/ABS/TPU`, `Creality Taurus PETG XT` (Tritan HT 3D Fila), `Creality Taurus PETG XT Speed`, `Creality Taurus PLA Speed` |

Os presets Speed são os calibrados (temperatura, vazão e Pressure Advance por material); os demais são o baseline. Cada preset guarda só os campos alterados e herda o resto da base indicada em `inherits`. O [guia de presets](web-ui-project/knowledge/guia-presets.md) explica a herança e onde procurar cada valor.

A pasta também guarda `start-n-end-gcode.gcode`, a versão legível das rotinas da impressora original, e `Frank Pro 0.4 nozzle.orca_printer`, um bundle exportado do Orca em 2026-10-05, anterior aos presets Speed e ao PETG XT.

## Projeto web

O projeto web recebe as instruções de `web-ui-project/instructions.md` e os arquivos de `web-ui-project/web-files/`, gerados por `node scripts/web-files.mjs`. Esses arquivos incluem os presets, as bases já unificadas e os docs das máquinas. Regras, limites e fluxo de atualização estão em [`web-ui-project/README.md`](web-ui-project/README.md).

## Aplicação em outras impressoras

Estas configurações representam uma máquina modificada. Ao adaptar, confira volume e limites de movimento, extrusor, retração, aquecimento, cooling, macros e rotinas de G-code da sua impressora. Ajustes de filamento e calibrações devem ser verificados na máquina e no material utilizados.

## Uso e permissões

O conteúdo autoral deste repositório é disponibilizado sob a **CC0 1.0 Universal**, na medida permitida por lei. Consulte o [texto oficial em inglês](LICENSE) e a [tradução não oficial para português brasileiro](LICENSE.pt-BR.md).

Você pode usar, copiar, modificar, redistribuir e utilizar comercialmente o conteúdo autoral deste repositório, sem restrições e sem obrigação de atribuição. Pode adaptar os arquivos para sua impressora e publicar suas próprias versões.

Os presets de terceiros incluídos como referência mantêm as licenças e os direitos de seus respectivos autores. A permissão acima se aplica ao conteúdo que o autor deste repositório tem direito de licenciar.

O conteúdo é fornecido como está, sem garantia.
