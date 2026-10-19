# Klipper — comandos úteis (Frank Pro)

Comandos de console do Mainsail para a Frank Pro (Klipper host v0.13, MCU v0.11). Os valores entre `< >` mudam conforme o caso.
Quem roda os comandos é o usuário. O agente da CLI só consulta, por GET.

## Estado e diagnóstico
```gcode
STATUS                                  ; estado do Klipper
GET_POSITION                            ; posição em todas as camadas (toolhead, gcode, mcu)
M114                                    ; posição G-code
QUERY_ENDSTOPS
QUERY_PROBE
QUERY_FILAMENT_SENSOR SENSOR=e0_sensor
SET_FILAMENT_SENSOR SENSOR=e0_sensor ENABLE=0   ; desliga o sensor de filamento até o próximo RESTART
```

## Reiniciar
```gcode
RESTART            ; recarrega o printer.cfg e limpa SET_VELOCITY_LIMIT, PA, TUNING_TOWER e SET_IDLE_TIMEOUT
FIRMWARE_RESTART   ; reinicia também a MCU (depois de shutdown ou erro de MCU)
M112               ; parada de emergência
```
- Cancelar uma impressão não roda o end gcode. O PA e os limites ficam ativos até o `RESTART`.
- `RESTART`, `FIRMWARE_RESTART` e `SAVE_CONFIG` derrubam a impressão em andamento. Rode só com a máquina parada.

## Temperatura
```gcode
M104 S<°C>                     ; bico, sem esperar
M109 S<°C>                     ; bico, espera ESTABILIZAR (±1 °C e < 0,1 °C/s): com o pico do PID, ~40 s a mais
M140 S<°C>                     ; mesa, sem esperar
M190 S<°C>                     ; mesa, espera chegar
SET_HEATER_TEMPERATURE HEATER=heater_bed TARGET=105
TEMPERATURE_WAIT SENSOR=heater_bed MINIMUM=100           ; espera só chegar; aceita MAXIMUM=
TURN_OFF_HEATERS
```
- A mesa tem `max_temp` 110, então o máximo prático é ~105 °C.
- `M109`/`M190` só liberam com a temperatura estável (±1 °C e < 0,1 °C/s). Na Frank Pro, o bico 170 → 225 passa a ~229 °C e só libera ~40 s depois de chegar; a mesa → 65 passa a ~66 °C e libera ~50 s depois. O start G-code da Speed usa `TEMPERATURE_WAIT`, que libera ao chegar.
- O idle_timeout é de 600 s. Quando dispara, desliga os heaters e roda M84. Pra pausa longa: `SET_IDLE_TIMEOUT TIMEOUT=1800`.

## PID (repetir se trocar bico, heater, termistor ou cooling)
```gcode
PID_CALIBRATE HEATER=extruder TARGET=<temp de uso>
PID_CALIBRATE HEATER=heater_bed TARGET=105
SAVE_CONFIG
```

## Movimento e limites
```gcode
SET_VELOCITY_LIMIT ACCEL=<mm/s²> SQUARE_CORNER_VELOCITY=<mm/s> VELOCITY=<mm/s> MINIMUM_CRUISE_RATIO=<0–1>
G28
M84                                     ; desliga os motores
```
- Valores do printer.cfg: accel 2000, SCV 5, velocity 300, minimum_cruise_ratio 0.5.
- `node scripts/frank-pro.mjs --host 192.168.0.150 --param limites` mostra se há algum SET_VELOCITY_LIMIT ativo.

## Extrusão e Pressure Advance
```gcode
M83                                     ; E relativo
G1 E50 F<mm/min>                        ; máximo de 50 mm por comando (max_extrude_only_distance)
SET_PRESSURE_ADVANCE ADVANCE=<valor>    ; PETG XT 0.125, PLA 0.038 (já vêm no preset de filamento)
SET_PRESSURE_ADVANCE ADVANCE=0
TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=0 FACTOR=.005
```
O procedimento completo de vazão no ar e da torre de PA está em `printers/frank-pro/calibracao.md`.

## Z-offset e probe (CR Touch, seção [bltouch])
```gcode
PROBE_CALIBRATE            ; depois ajustar com TESTZ Z=-0.05 ... e ACCEPT
SAVE_CONFIG
SET_GCODE_OFFSET Z_ADJUST=-0.02 MOVE=1  ; babystep durante a impressão
Z_OFFSET_APPLY_PROBE       ; grava o babystep no z_offset do probe
SAVE_CONFIG
PROBE_ACCURACY
BLTOUCH_DEBUG COMMAND=reset             ; pino travado ou piscando
```
- O z_offset atual é 0.990, do SAVE_CONFIG de 2026-10-18.
- Trocar o bico muda o z_offset, então refaça depois da troca.

## Mesh e nivelamento
```gcode
G28
BED_MESH_CALIBRATE PROFILE=default
SAVE_CONFIG
BED_MESH_PROFILE LOAD=default           ; o start G-code já faz isso
BED_MESH_CLEAR
BED_SCREWS_ADJUST                       ; parafusos da mesa, método do papel ([bed_screws])
```
O `SCREWS_TILT_CALCULATE` exige a seção `[screws_tilt_adjust]`, que não está configurada.

## Posicionar o bico (centro e 4 cantos)
Área do slicer: 220 × 220 mm, com o centro em X110 Y110. Os cantos usam as coordenadas da seção `[bed_screws]` do printer.cfg, que já são o bico sobre cada parafuso.
```gcode
G28                          ; só se não estiver referenciado
G90
G1 Z5 F600                   ; sobe antes de andar
G1 X110 Y110 F6000           ; centro
G1 X20  Y29  F6000           ; canto 1: frente-esquerda
G1 X195 Y29  F6000           ; canto 2: frente-direita
G1 X195 Y198 F6000           ; canto 3: trás-direita
G1 X20  Y198 F6000           ; canto 4: trás-esquerda
G1 Z0.1 F300                 ; teste do papel (Z0 = bico encostando, pelo z_offset do probe)
```
- `BED_SCREWS_ADJUST` faz o mesmo roteiro dos 4 parafusos sozinho. Em cada parafuso, responda `ACCEPT` (ok) ou `ADJUSTED` (mexeu, repete a volta).
- Sempre suba o Z antes de mover em XY. Se o z_offset estiver errado, `Z0.1` pode encostar o bico na mesa.
- Atalhos (`macros.cfg`): `CENTRO` e `CANTO N=1..4` sobem a 5 mm e levam o bico ao centro ou ao parafuso N.

## Troca de filamento (cor por camada, Klipper)
Com a impressora Speed, o "Add color change" da barra de camadas do Orca gera `M600`, a troca estilo Marlin do `macros.cfg`. Outros jeitos de chamar: `SET_PAUSE_AT_LAYER LAYER=<n> MACRO=M600` no console, ou `M600` no G-code depois de `SET_PRINT_STATS_INFO CURRENT_LAYER=<n>`. Daí em diante, seguir a janela do Mainsail (Carregar e purgar → Retomar). Detalhes em `to-do/macros-klipper.md`.

Troca manual, sem o `M600` (alternativa):

Inserir a pausa na camada n (a primeira camada da cor nova, numerada como no preview do Orca):
- Pelo console, com a impressão rodando, sem editar o G-code:
  ```gcode
  SET_PAUSE_AT_LAYER LAYER=<n> MACRO="PAUSE X=0 Y=220 Z_MIN=20"
  ```
  Se o Klipper recusar as aspas, use `SET_PAUSE_AT_LAYER LAYER=<n>` (pausa simples, estaciona atrás à direita) ou o G-code custom abaixo.
  Funciona porque a impressora Speed emite `SET_PRINT_STATS_INFO CURRENT_LAYER=<n>` antes de subir para a camada n. Vale uma vez; repita para a próxima troca.
- Ou G-code custom (como no Marlin): inserir `PAUSE X=0 Y=220 Z_MIN=20` na linha depois de `SET_PRINT_STATS_INFO CURRENT_LAYER=<n>`:
  ```sh
  sed -i '/^SET_PRINT_STATS_INFO CURRENT_LAYER=<n>$/a PAUSE X=0 Y=220 Z_MIN=20' arquivo.gcode
  ```
- O `PAUSE` do mainsail.cfg salva posição e estado, retrai 1 mm e estaciona em X0 Y220 (canto superior esquerdo), a pelo menos 20 mm de altura.

Na impressora, quando pausar:
```gcode
SET_IDLE_TIMEOUT TIMEOUT=1800   ; já na pausa (ou antes, com a impressão rodando): 600 s desligam heaters e motores e o home se perde
M109 S<temp>                    ; garante o bico quente (a pausa mantém o alvo, mas confira)
M83
G1 E10 F300                     ; amolece a ponta
G1 E-50 F1800                   ; descarrega; termine puxando à mão, com a alavanca do Sprite pressionada
```
Trocar o carretel e carregar:
```gcode
M83
G1 E50 F180                     ; empurra e purga (~7 mm³/s); repita G1 E20 F180 até a cor sair limpa
```
Depois:
1. Tirar a purga e o fio pendurado do bico com pinça, sem encostar na peça.
2. Se a cor nova for outro material ou outra temperatura, rodar `M109 S<temp nova>`.
3. Rodar `RESUME`.
4. Rodar `SET_IDLE_TIMEOUT TIMEOUT=600` para voltar ao padrão (ou deixar até o `RESTART`).

Por que funciona:
- O `PAUSE` salva a posição. Sem parâmetros, ele estaciona atrás à direita, 2 mm acima da peça; com `X= Y= Z_MIN=`, vai para onde for pedido.
- O `RESUME` faz unretract de 1 mm e volta ao ponto salvo. A extrusão manual durante a pausa não bagunça a posição do E.
- Em Z: o `PAUSE` sobe primeiro e depois anda em XY. O `RESUME` volta em diagonal, descendo enquanto anda: nunca fica abaixo do topo da peça, mas chega rente a ele. A macro `RETOMA_TROCA` (proposta) volta como o Marlin, com XY no alto e depois descida vertical.

Cuidados:
- O `RESUME` só espera o bico reaquecer se o idle_timeout disparou durante a pausa. Mas se ele disparou, o `M84` já desligou os motores e o `RESUME` falha por falta de home. Por isso o `SET_IDLE_TIMEOUT` vai antes da troca.
- O PA e o fan continuam os do filamento fatiado. Material diferente no meio da peça exige fatiar pensando nisso.
- `RESTART` derruba a impressão pausada.
- `SET_PAUSE_NEXT_LAYER` pausa na próxima camada, sem precisar do número.

## Pausa e cancelamento
```gcode
PAUSE
RESUME
CANCEL_PRINT
```

## Input Shaper (precisa de ADXL e de config que ainda não existem)
```gcode
ACCELEROMETER_QUERY
MEASURE_AXES_NOISE
SHAPER_CALIBRATE
SAVE_CONFIG
```
Requer `[adxl345]` e `[resonance_tester]`. Ver `to-do/input-shaper-adxl.md`.

## Leitura pela rede (GET, sem efeito na impressora)
```sh
node scripts/frank-pro.mjs --host 192.168.0.150                         # painel
node scripts/frank-pro.mjs --host 192.168.0.150 --param avisos
node scripts/frank-pro.mjs --host 192.168.0.150 --param cfg --file printer.cfg
curl -s http://192.168.0.150/server/files/logs/klippy.log -o klippy.log
curl -s http://192.168.0.150/server/files/logs/moonraker.log -o moonraker.log
curl -s "http://192.168.0.150/printer/objects/query?extruder&heater_bed"
```
No `klippy.log`, procure por `Lost communication`, `Got EOF`, `not heating at expected rate`, `Timer too close` e `shutdown`.
