# Scripts

## `frank-pro.mjs` — painel e consultas da Frank Pro

Consulta a Frank Pro pela API do Moonraker. Requer Node 18 ou superior e não tem dependências.

**Somente leitura:** o script faz apenas requisições GET. Ele não envia G-code, não inicia, pausa ou cancela impressões e não altera configurações.

```sh
node scripts/frank-pro.mjs --host 192.168.0.150                      # painel
node scripts/frank-pro.mjs --host 192.168.0.150 --watch 5            # painel atualizado a cada 5 s
node scripts/frank-pro.mjs --host 192.168.0.150 --param historico --limit 5
node scripts/frank-pro.mjs --host 192.168.0.150 --param arquivo --file Voron_Design_Cube_v7_PETG_50m19s.gcode
node scripts/frank-pro.mjs --host 192.168.0.150 --param limites --json
```

O endereço é sempre passado em `--host`. Aceita IP, `IP:porta` (ex.: `:7125`, acesso direto ao Moonraker) ou URL completa.

| `--param` | Mostra |
|---|---|
| `painel` (padrão) | Estado, arquivo, progresso, camada, tempos (decorrido, estimativa do slicer, restante), temperaturas, fans, posição, velocidade, fatores de velocidade e fluxo, `max_accel` ativo |
| `status` | Resumo em uma linha |
| `temps` | Bico e mesa (atual, alvo, potência), temperatura e carga do Raspberry, histórico de subtensão e throttling |
| `limites` | `max_accel`, `max_velocity`, `minimum_cruise_ratio` e `square_corner_velocity` ativos comparados ao `printer.cfg`. Destaca valores alterados por `SET_VELOCITY_LIMIT` |
| `versoes` | Klipper host, MCU (com aviso de divergência), toolchain do MCU, Moonraker, sistema e hardware |
| `historico` | Últimos trabalhos (`--limit`, `--file`): duração real, estimativa do slicer e diferença nos trabalhos concluídos |
| `arquivo` | Metadados de um G-code (`--file`) e seu histórico. Usa o histórico se o arquivo já foi removido da impressora |
| `arquivos` | G-codes mais recentes na impressora (`--limit`) |
| `mesh` | Perfil ativo, perfis salvos, grade e amplitude |
| `sensores` | Sensor de filamento, probe, endstops (última consulta), eixos referenciados e idle |
| `config` | Seções do `printer.cfg` parseadas pelo Klipper. Com `--section printer`, mostra uma seção |
| `avisos` | Depreciações e avisos do Klipper e do Moonraker |

A diferença entre o Klipper do host (v0.13) e o da MCU (v0.11 com GCC 10.3.1) é intencional. Quando a MCU está na build validada, `versoes` mostra a divergência como esperada e `avisos` lista o `deprecated_mcu_code` à parte, como aviso esperado. Uma MCU diferente da validada, o Klipper fora do `ready` ou qualquer outro aviso continuam aparecendo como problema. Veja [docs/frank-pro-klipper-host-mcu.md](../docs/frank-pro-klipper-host-mcu.md).

Opções gerais: `--json` (saída para processamento), `--watch <s>` (repete a consulta) e `--help`. As cores são desativadas com `NO_COLOR` ou quando a saída não é um terminal.
