# Frank Pro — calibração

Resultados medidos na Frank Pro e como refazer cada teste. Bico 0.4 original em todos.
Quando o bico CHT for instalado, refazer vazão no ar e torre de PA.

## Resultados

### Mecânica
- rotation_distance 26.359: VALIDADO 2026-10-17 (100 mm pedidos a F60, 100.0 mm entraram; medido com a haste do paquímetro)
- cubos xyz A/B, 2026-10-16: aceleração 650–2000 mm/s² × 500 mm/s² saíram iguais, logo a aceleração não causava o arredondamento das arestas verticais. Faces 20.00 mm, cantos 20.20 mm com PA 0: o canto saltado era falta de PA.

### PETG XT / Tritan HT 3D Fila (filamento `Creality Taurus PETG XT Speed`)
- etiqueta: bico 250–270 °C, mesa 110–120 °C; a mesa roda a 105 °C (heater_bed max_temp 110)
- temperatura 270 °C: VALIDADO 2026-10-17
  - vazão no ar a 265 °C: F150 1.5% de perda, F250 (10 mm³/s) 4.3%
  - vazão no ar a 270 °C: F250 ~2% (sobras 22.70 e 21.32 mm)
  - Benchy a 265 °C: casco fosco e com linhas falhando (limite de fusão); a 270 °C: casco brilhante
  - Benchy sem o tubo PTFE: igual, então arrasto do filamento foi descartado
- PA 0.125: VALIDADO 2026-10-18
  - torre: melhor canto a 24 mm (0.12); bordas do sulco retas a 22 mm (0.11); releitura com luz rasante: 25 mm → 0.125
  - Benchy com 270 °C + PA 0.12: sem as linhas em "S" do casco nem os furinhos da costura. As linhas em "S" vinham do slowdown de overhang do Orca (parede externa de 10 a 60 mm/s) sem PA.
- impressão real: suporte de celular em árvore, 3h26m15s contra 4h18m45s no perfil original (−20%), com cantos vivos; slicer estimou 3h13m49s (+6.4%)
- PENDENTE: max flowrate no Orca; `filament_max_volumetric_speed` segue 10, não medido

### PLA 3D Fila (filamento `Creality Taurus PLA Speed`)
- etiqueta: bico até 230 °C
- temperatura 225 °C: vazão no ar VALIDADA 2026-10-18; perda 0.6% a F200 (8 mm³/s), 0.6% a F250 (10 mm³/s) e 0.2% a F300 (12 mm³/s)
- `filament_max_volumetric_speed` 12 (herdado do Creality Generic PLA): coberto pelo teste a 12 mm³/s
- dimensional: faces da torre 60.00 mm (modelo 60.00); fluxo sem ajuste
- PA 0.038: torre 2026-10-18, melhor altura 7.62 mm (uma leitura, sem a do sulco)
- PENDENTE: impressão real com PA 0.038

## Procedimento — vazão no ar
Mede se o hotend derrete o volume pedido. Sem mesa, bico na temperatura do teste.
1. Marcar o filamento a 120.0 mm da entrada do extrusor.
2. Esperar ~30 s depois que o bico chegar na temperatura.
3. Extrudar 100 mm em dois comandos (o Klipper limita a 50 mm por extrusão avulsa, `max_extrude_only_distance`):
   ```gcode
   M109 S<temp>
   G91
   G1 E50 F<vel>
   G1 E50 F<vel>
   G90
   ```
4. Medir a sobra até a marca com a haste do paquímetro. Perda = sobra − 20 mm (em mm = % de 100 mm).
5. Repetir cada ponto 2 vezes; o ruído é de alguns mm. Critério: perda ≤ ~2%.

Conversão para filamento 1.75 mm (2.405 mm²): F150 = 6 mm³/s, F200 = 8, F250 = 10, F300 = 12. Os processos Speed puxam ~8 mm³/s a 90 mm/s.

## Procedimento — torre de PA (TUNING_TOWER)
- modelo: `square_tower.stl` oficial do Klipper (em `../projects/calibracao/` na máquina local)
- processo de teste (override só para a torre, não salvo como preset): camada 0.3 mm, 2 paredes, paredes a 60 mm/s, infill 0%, topo 0, base 3, todas as acelerações 0 (o G-code não manda SET_VELOCITY_LIMIT)
- filamento: o preset Speed do material, com PA desligado; G-codes prontos em `../projects/#gcodes/square_tower_PA_{PETG,PLA}_53m.gcode`
- ANTES de iniciar a impressão, no console:
  ```gcode
  SET_VELOCITY_LIMIT SQUARE_CORNER_VELOCITY=1 ACCEL=500
  TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=0 FACTOR=.005
  ```
- conferir logo no início: `--param limites` mostra accel 500 e SCV 1 com SET_VELOCITY_LIMIT ativo; PA ≈ Z × 0.005. Em 2026-10-18 os comandos foram esquecidos e a torre saiu com PA 0 até ser cancelada.
- depois de terminar ou cancelar: `RESTART` (cancelar não roda o end gcode; PA e limites ficam ativos). Em 2026-10-18 o Benchy PLA seguinte saiu com SCV 1 residual: +23% de tempo e calombos no vinco da proa (ver `to-do/pla-speed-validacao.md`). Conferir com `--param limites` antes de imprimir.
- leitura: PA = altura × 0.005
  - olhar os 4 cantos externos e as bordas do sulco vertical no meio de cada face interna (é do modelo); os cantos do furo são arredondados no modelo e não servem
  - luz rasante (lanterna quase paralela à face) e unha passando no canto de baixo para cima
  - abaixo do ideal: excesso/ombro depois da curva; acima: falha ou afundado depois da curva e canto arredondado
  - em dúvida entre duas alturas, o Klipper recomenda a menor
- aplicar: `enable_pressure_advance` ["1"] e `pressure_advance` no preset Speed do filamento (repo e Orca)
