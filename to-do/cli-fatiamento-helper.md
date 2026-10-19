# Script de fatiamento pelo CLI do Orca
- status: ideia; nada feito
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- os helpers que achatam presets e fatiam pelo CLI (flatten.py e slice.sh) viviam no scratchpad e sumiram no reboot de 2026-10-18
- foram usados para: torres de PA, Benchy de comparação e conferência de G-code sem abrir o GUI
- as pegadinhas do CLI estão documentadas em `resources/utils/orca-slicer.md`
- `scripts/web-files.mjs` já tem a função de resolução de herança (`resolve`)

## Proposta
- `scripts/orca-slice.mjs`:
  - achata impressora, processo e filamento a partir de `~/.config/OrcaSlicer/` (pais em `system/Creality/`);
  - aplica as correções do CLI (`type`, `compatible_printers`, `curr_bed_type`, `initial_layer_speed`);
  - aceita overrides de processo (ex.: torre de PA);
  - fatia em diretório temporário e copia o G-code para `../projects/#gcodes/`.

## Fecha quando
- Script feito e validado contra um G-code do GUI, ou descartado.
