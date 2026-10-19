# Frank Pro — estado da máquina

Fonte única do estado da Frank Pro. Atualizado em 2026-10-18.
Legenda: VALIDADO = medido ou testado na máquina; PENDENTE = ainda não feito; HIPÓTESE = suspeita sem prova.

## Hardware
- base: Creality Ender-3 S1 Pro, modificada; tratar como plataforma própria, não stock
- extrusor: Sprite Pro (direct drive, gear_ratio 42:12)
- bico: 0.4 mm original; bico CHT MK8 0.4 latão + núcleo CuCrZr pedido, vindo da China, não instalado (`to-do/bico-cht.md`)
- cooling: Taurus dual 5015; sopra muito mais que o stock, percentuais de fan não equivalem aos de perfis stock
- probe: CR Touch (seção [bltouch]), x_offset -31.8, y_offset -40.5
- host: Raspberry Pi 3B, MainsailOS 3.0.0, Mainsail, Moonraker v0.11.0-3
- MCU: STM32F401RCT6, ligada ao Pi por USB (`/dev/serial/by-id/usb-1a86_USB_Serial-if00-port0`)
- display original: desconectado
- sensor de filamento: e0_sensor, pause_on_runout true

## Firmware
- Klipper host: v0.13.0-786-g461c4e372 (lido 2026-10-16)
- Klipper MCU: v0.11.0-0-ge02b725, toolchain GNU Arm Embedded 10.3-2021.10 (GCC 10.3.1)
- build da MCU: STM32F401, bootloader 64 KiB, cristal 8 MHz, USART1 PA10/PA9, 250000, app em 0x08010000
- divergência host × MCU: INTENCIONAL. O bootloader Creality não aceitou Klipper compilado com toolchain moderna; a v0.11.0 com GCC 10.3.1 foi a solução validada.
- NÃO recomendar atualizar a MCU por causa da divergência. Mexer na base só com motivo concreto e teste controlado.
- aviso esperado em `configfile.warnings`: `deprecated_mcu_code ... missing feature 'STEPPER_STEP_BOTH_EDGE'`. Com a MCU na build validada, não exige ação.
- problemas reais (investigar): MCU ≠ v0.11.0-0-ge02b725 ou toolchain ≠ GCC 10.3.1; Klipper fora de `ready`; qualquer outro aviso; `Lost communication with MCU` ou timeouts no klippy.log.
- `scripts/frank-pro.mjs` guarda a build validada na constante `MCU_VALIDADA`; se a build mudar após teste controlado, atualizar a constante e este arquivo juntos.

## Klipper — valores efetivos (snapshot de 2026-10-18 em `klipper/`; no projeto web: `frank-pro-klipper.cfg.txt`)
- printer: max_velocity 300, max_accel 2000, minimum_cruise_ratio 0.5, square_corner_velocity 5, max_z_velocity 5, max_z_accel 100
- área: X -15..235, Y -13..238, Z -4..270
- extruder: rotation_distance 26.359 (VALIDADO 2026-10-17), pressure_advance 0, max_extrude_only_distance 50, max_temp 300
- heater_bed: max_temp 110; por isso a mesa roda no máximo a ~105 °C
- PID hotend: 21.897 / 1.043 / 114.961; PID mesa: 73.604 / 1.478 / 916.366
- bltouch z_offset: 0.990 (SAVE_CONFIG)
- bed_mesh: perfil `default`, 4x4, bicubic, área 10,10 a 200,194
- idle_timeout: 600 s (padrão); ao disparar roda TURN_OFF_HEATERS e M84
- macros: as do `mainsail.cfg`; não há `_CLIENT_VARIABLE`, então vale idle_timeout 0 nas macros
  - PAUSE: salva o alvo do bico e estaciona
  - RESUME: só restaura a temperatura do bico (M109) se o idle_timeout disparou durante a pausa; se não disparou, retoma direto, sem esperar temperatura
  - troca de cor com M104 + PAUSE: trocar em < 10 min ou rodar `SET_IDLE_TIMEOUT TIMEOUT=1800` antes
- M600: não existe macro; troca de filamento usa PAUSE
- firmware retraction: não configurado
- Input Shaper: não configurado (PENDENTE, medir com ADXL na própria máquina)
- quem altera o Klipper: o usuário, manualmente, pelo Mainsail. Os snapshots em `klipper/` são só leitura.

## Orca — presets (`orca/`)
- impressora `Frank Pro 0.4 nozzle`: perfil original; limites de máquina herdados da S1 Pro
- impressora `Frank Pro 0.4 nozzle Speed`: limites 2000 mm/s² e 300 mm/s alinhados ao printer.cfg; `SET_PRINT_STATS_INFO` (camada atual e total); PAUSE na troca de filamento
- processo `0.20mm Standard @Taurus`: perfil original
- processos `… PETG XT Speed` e `… PLA Speed` (iguais por enquanto): acelerações por tipo (parede externa e topo 1000, internas e sólido 1600, sparse 1800, travel 2000, primeira camada 650/900); paredes internas e infill a 90 mm/s, parede externa 60, topo 40
- filamento `Creality Taurus PETG XT Speed`: VALIDADO (PETG XT/Tritan HT 3D Fila, 270 °C, PA 0.125)
- filamento `Creality Taurus PLA Speed`: PLA 3D Fila, 225 °C e PA 0.038 medidos; impressão completa ainda PENDENTE
- demais filamentos (`Creality Taurus PLA/PETG/PETG XT/ABS/TPU`): baseline, não calibrados no Klipper
- PA mora no preset de filamento (`enable_pressure_advance` + `pressure_advance`); o `filament_end_gcode` zera com `SET_PRESSURE_ADVANCE ADVANCE=0`. O printer.cfg fica com PA 0.
- cancelar uma impressão não roda o end gcode: o PA e qualquer SET_VELOCITY_LIMIT ficam ativos até `RESTART`
- resultados e procedimentos de calibração: `calibracao.md`

## Em aberto
Detalhes, hipóteses e próximos passos ficam em `to-do/` (um arquivo por item). Resumo:
- termistor da mesa com leitura errática entre 95 e 97 °C, que desarmou o verify_heater 2× em 2026-10-17 → `to-do/mesa-termistor.md`
- Pi com "Previously Under-Volted" e queda do USB da MCU em 2026-10-17; fonte nova comprada, ainda não testada → `to-do/pi-fonte.md`
- PLA Speed sem impressão real → `to-do/pla-speed-validacao.md`
- max flowrate do PETG XT → `to-do/petg-max-flowrate.md`
- bico CHT → `to-do/bico-cht.md`; Input Shaper → `to-do/input-shaper-adxl.md`; ABS → `to-do/abs-calibracao.md`
- só depois de IS e CHT: elevar velocidade/aceleração
