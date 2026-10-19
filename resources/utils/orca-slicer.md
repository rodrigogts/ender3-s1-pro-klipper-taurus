# OrcaSlicer — comandos úteis e pegadinhas

OrcaSlicer 2.4.2, rodando como AppImage nesta máquina.

## Caminhos
- AppImage: `../tools/orca-slicer/OrcaSlicer.AppImage` (relativo à raiz do repo)
- config: `~/.config/OrcaSlicer/`
  - `user/default/{machine,filament,process}/`: presets do usuário (fonte viva). A cópia fica em `printers/frank-pro/orca/`.
  - `system/`: perfis de vendor. Nunca editar. As cópias de referência ficam em `resources/orca-defaults/`.
  - `log/debug_*.log.0`: logs
- G-code exportado: `../projects/#gcodes/`
- atalho do desktop: `resources/desktop/`

## Editar presets fora do GUI
1. Editar o JSON em `~/.config/OrcaSlicer/user/default/<tipo>/` e na cópia do repo. As duas têm que ficar idênticas.
2. Reiniciar o Orca, porque ele só relê os presets ao abrir.
3. Se o GUI que já estava aberto salvar o preset antes de reiniciar, ele sobrescreve a mudança.
4. `node scripts/web-files.mjs --check` avisa quando o repo diverge do Orca.

Um preset novo precisa também do `.info` ao lado. Copie o do preset de origem: `base_id` igual, `sync_info = create`.

## Sintoma "sumiram as impressoras/presets"
- Causa vista em 2026-10-11: um arquivo de base do vendor ausente ou corrompido em `system/Creality/` faz o bundle Creality inteiro falhar. Os presets que herdam dele somem do GUI, mas `user/default/` continua intacto.
- Diagnóstico: procurar `can not find parent` no log.
- Correção:
  1. Comparar `~/.config/OrcaSlicer/system/Creality/` com `resources/profiles/Creality/` do AppImage montado (`/tmp/.mount_OrcaSl*`).
  2. Copiar o que faltar.
  3. Reselecionar a impressora, porque o `OrcaSlicer.conf` volta para `Default Printer`.

## Fatiar pela linha de comando
```sh
A=../tools/orca-slicer/OrcaSlicer.AppImage
"$A" --datadir <cópia de ~/.config/OrcaSlicer> \
  --load-settings "mach.json;proc.json" --load-filaments fil.json \
  --slice 0 --arrange 0 --orient 0 --outputdir <saída> modelo.stl
```
Pegadinhas (validado em 2026-10-16, com o G-code saindo igual ao do GUI):
- O CLI não resolve `inherits` direito: preenche o que falta com defaults sem avisar. Achate a cadeia antes (mesma regra de `resources/orca-defaults/README.md`), procurando os pais em `system/Creality/<tipo>/`.
- O preset achatado precisa da chave `"type"` (machine, process ou filament). Sem ela, dá `unknown config type`.
- Processo e filamento precisam de `compatible_printers: ["Creality Ender-3 S1 Pro 0.4 nozzle"]` (o nome do pai da impressora). Lista vazia falha.
- Fixe `curr_bed_type: "High Temp Plate"` no processo, senão a mesa sai com a temperatura errada.
- O GUI ignora o `initial_layer_speed: "35%"` (inválido) do processo S1 Pro e usa 15. No achatado, fixe 15.
- `--rotate` dá segfault, e `--arrange 1` gira o modelo. Pra reproduzir o GUI, translade o STL pra (110,110) e use `--arrange 0 --orient 0`.
- `--help` grava `result.json` no diretório atual. Rode fora do repo.
- Pra validar, compare o bloco `; CONFIG_BLOCK_START` do G-code do CLI com o do GUI.

## Conferir um G-code
```sh
grep -E "^; (estimated printing time|filament_settings_id|print_settings_id|nozzle_temperature|pressure_advance|enable_pressure_advance) " arquivo.gcode
grep -nE "^(SET_PRESSURE_ADVANCE|SET_VELOCITY_LIMIT|M104|M109|M140|M190)" arquivo.gcode | head
```
