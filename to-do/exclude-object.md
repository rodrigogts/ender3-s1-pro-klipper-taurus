# Exclude object: cancelar só a peça que falhou
- status: em andamento (Orca feito; falta o Klipper)
- máquina: Frank Pro
- prioridade: alta (pedido do usuário)
- atualizado: 2026-10-19

## Fatos
- 2026-10-19: job 000069 (6 clips em ABS) cancelado com 2h39m de impressão porque o clip do meio empenou. Com exclude object, os outros 5 seguiriam.
- `printer.cfg` não tem `[exclude_object]`.
- No Orca, `exclude_object` é opção do preset de processo (Others → Exclude objects), não da impressora. `gcode_label_objects` já vem 1.
- 2026-10-19: `"exclude_object": "1"` gravado no `0.20mm Standard @Taurus Speed` (Orca e repo). O Orca só aplica depois de reiniciar.
- `[exclude_object]` é módulo só do host (Klipper v0.13); a versão da MCU não importa.
- Só o processo `0.20mm Standard @Taurus Speed` pode receber a opção; o `0.20mm Standard @Taurus` original não se edita.

## Próximos passos
1. Usuário, pelo Mainsail, com a impressora parada: acrescentar ao `printer.cfg`, fora do bloco do SAVE_CONFIG, e dar `RESTART`:
   ```ini
   [exclude_object]
   ```
2. Agente: atualizar o snapshot (`node scripts/frank-pro.mjs --host 192.168.0.150 --param cfg --file printer.cfg > printers/frank-pro/klipper/printer.cfg`) e conferir a seção.
3. Usuário reinicia o Orca (feche sem salvar o processo, senão o GUI sobrescreve).
4. Fatiar 2 peças e conferir no G-code `EXCLUDE_OBJECT_DEFINE` no cabeçalho e `EXCLUDE_OBJECT_START`/`END` em volta de cada peça.
5. Testar numa impressão de 2 peças pequenas: excluir uma pelo Mainsail (painel de status → Exclude objects) ou no console com `EXCLUDE_OBJECT NAME=<nome>`; a outra deve terminar normal.

## Riscos
- G-code com `EXCLUDE_OBJECT_DEFINE` numa impressora sem `[exclude_object]` para com comando desconhecido: não mandar G-code do processo Speed antes do passo 1.
- `RESTART` derruba a impressão em andamento.

## Fecha quando
- Uma peça excluída no meio da impressão e as outras terminando sem defeito. Resultado vai para `printers/frank-pro/README.md` e uma linha sobre o uso em `resources/utils/klipper.md`.
