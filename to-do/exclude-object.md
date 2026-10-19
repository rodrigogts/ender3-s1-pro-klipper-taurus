# Exclude object: cancelar só a peça que falhou
- status: configurado; falta o teste de exclusão
- máquina: Frank Pro
- prioridade: alta (pedido do usuário)
- atualizado: 2026-10-19

## Fatos
- 2026-10-19: job 000069 (6 clips em ABS) cancelado com 2h39m de impressão porque o clip do meio empenou. Com exclude object, os outros 5 seguiriam.
- `[exclude_object]` no printer.cfg, carregado (2026-10-19).
- No Orca, `exclude_object` é opção do preset de processo (Others → Exclude objects), não da impressora. `gcode_label_objects` já vem 1.
- 2026-10-19: `"exclude_object": "1"` gravado no `0.20mm Standard @Taurus Speed` (Orca e repo). O Orca só aplica depois de reiniciar.
- `[exclude_object]` é módulo só do host (Klipper v0.13); a versão da MCU não importa.
- `"exclude_object": "1"` também no `0.20mm Standard @Taurus` original, a pedido do usuário (2026-10-19).

## Próximos passos
1. Fatiar 2 peças e conferir no G-code `EXCLUDE_OBJECT_DEFINE` no cabeçalho e `EXCLUDE_OBJECT_START`/`END` em volta de cada peça.
2. Testar numa impressão de 2 peças pequenas: excluir uma pelo Mainsail (painel de status → Exclude objects) ou no console com `EXCLUDE_OBJECT NAME=<nome>`; a outra deve terminar normal.

## Riscos
- G-code com `EXCLUDE_OBJECT_DEFINE` numa impressora sem `[exclude_object]` para com comando desconhecido: não tirar a seção do printer.cfg.

## Fecha quando
- Uma peça excluída no meio da impressão e as outras terminando sem defeito. Resultado vai para `printers/frank-pro/README.md` e uma linha sobre o uso em `resources/utils/klipper.md`.
