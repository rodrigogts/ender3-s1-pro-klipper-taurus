# Frank Mini: diagnóstico da mesa que aquece sozinha e do encoder
- status: pendente (medições não feitas)
- máquina: Frank Mini (Ender 3 Neo)
- prioridade: média (a mesa aquece sem comando, então há risco térmico)
- atualizado: 2026-10-18

O estado completo, as hipóteses e o plano estão em `printers/frank-mini/README.md`.

## Próximos passos
1. Medir com multímetro a tensão da saída BED com target 0.
2. Se houver tensão: seguir MOSFET, gate e trilhas antes de condenar a placa.
3. Diagnosticar o encoder separadamente.
4. Não deixar o Raspberry no USB com a impressora desligada (backfeed de 5 V).

## Riscos
- Mesa aquecendo sem comando: não deixar ligada sem supervisão até medir.

## Fecha quando
- A causa da mesa foi identificada e corrigida (ou a placa foi trocada) e o encoder funciona.
