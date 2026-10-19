# Medir o max flowrate do PETG XT e limitar a vazão no preset
- status: pendente
- máquina: Frank Pro
- prioridade: média
- atualizado: 2026-10-18

## Fatos
- `Creality Taurus PETG XT Speed`: 270 °C, PA 0.125, VALIDADO em qualidade
- `filament_max_volumetric_speed` 10 mm³/s, herdado e não medido
- vazão no ar a 270 °C: ~2% de perda a 10 mm³/s (F250). Acima disso não foi testado.
- os processos Speed puxam ~8 mm³/s (paredes internas e infill a 90 mm/s)

## Próximos passos
1. Rodar o teste de Max flowrate do Orca (menu Calibração) com o filamento PETG XT Speed a 270 °C.
2. Pegar a maior vazão sem falha de superfície.
3. Gravar `filament_max_volumetric_speed` = ~85% desse valor, só no `Creality Taurus PETG XT Speed`, no repo e no Orca.
4. `node scripts/web-files.mjs`.

## Fecha quando
- Valor medido registrado em `printers/frank-pro/calibracao.md` e aplicado no preset.

## Observação
- Com o bico CHT (`bico-cht.md`) o limite muda. Se o CHT chegar antes, medir direto com ele.
