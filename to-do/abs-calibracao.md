# Calibrar ABS (temperatura, vazão e PA) e criar o ABS Speed
- status: pendente, sem data
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-19

## Fatos
- existe só o baseline `Creality Taurus ABS`: 260 °C (265 na primeira camada, escolha do usuário em 2026-10-19), faixa até 265, fan 20%, overhang 35%, herda de `Creality Generic ABS` (mesa 100 °C, max volumetric 12)
- nada de ABS foi calibrado no Klipper
- marca e etiqueta do ABS em uso: não informadas
- a mesa tem limite de 110 °C (`max_temp`)
- regra do projeto: não ativar PA no ABS antes da torre no próprio ABS
- 2026-10-19: clips de saco de 12 cm em ABS (job 000069, 84 g, 6h38m pelo slicer) fatiados com `Frank Pro 0.4 nozzle` + `0.20mm Standard @Taurus Speed` + `Creality Taurus PETG XT Speed` sem alteração: bico 270 °C, mesa 105 °C, fan 10–15%, overhang 25%, PA 0,125 (do PETG XT), sem brim. Parcial, camada ~4/50 às 13:22: pontas sem empenar e impressão boa (relato do usuário, sem gabinete informado). Às 13:29, camada ~4/50 (12,5%), o usuário baixou o bico para 245 °C pelo Mainsail; o G-code não redefine a temperatura depois do start. Resultado: cancelado às 2h39m de impressão; dos 6 clips, o do meio empenou (relato do usuário).
- 2026-10-19 15:07 (job 00006A): 1 clip, `Frank Pro 0.4 nozzle` + `0.20mm Standard @Taurus` + `Creality Taurus ABS`: bico 250/245 °C, mesa 105 °C, PA desligado, fan 20%, aceleração 500 mm/s², sem brim. Resultado: pendente.
- 245 °C: o usuário já usou neste ABS e funcionou (sem vazão no ar nem torre).
- 2026-10-19 18:14 (job 00006E): 9 quadrados de nivelamento 11 × 11 × 2,2 mm em ABS (presets originais) saíram perfeitos; com a mesa ainda a 105 °C, soltaram com muita facilidade (relato do usuário).
- 2026-10-19 18:42 (job 00006F): 1 quadrado, presets originais com a primeira camada 0,25 mm a 260 °C e o resto a 250 °C; o usuário achou que funcionou. Duas variáveis mudadas juntas. Com o z_offset 1.095 (medido com o bico esfriando), o bico fica ~0,1 mm mais perto que o Klipper calcula: a camada de 0,25 compensa parte disso no slicer.
- Este clip saiu bem 6 vezes no baseline `Creality Taurus ABS`, sem brim (relato do usuário). Brim dispensado para ele.
- 270 °C: as camadas 1–4 do job 000069 saíram sem defeito visível (relato do usuário), a 500 mm/s² e vazão baixa.

## Hipóteses
- Aderência fraca do ABS na placa explicaria os empenos e as peças arrastadas de 2026-10-19. Gordura de dedo descartada: no nivelamento só o papel toca a mesa. Os quadrados de 11 mm são um teste fraco: área pequena solta fácil de qualquer jeito. Placa: PEI texturizado, sem adesivo.
- O ABS pede cooling baixo e é sensível a corrente de ar. Gabinete: não informado se existe.
- Pela tendência PLA 0.038 × PETG 0.125, o PA do ABS deve ficar em torno do do PLA, mas isso não é base para pular a torre.
- Referência (padrão de fábrica, não medição): nos perfis de sistema Creality do Orca, o PA do ABS fica abaixo do PETG em 8 de 9 máquinas (0,5–0,86× o do PETG; ex.: K1C ABS 0,06 × PETG 0,08; Ender-3 V4 0,026 × 0,05) e perto do PLA (0,04).
- O usuário aposta que o PA do ABS a 270 °C fica perto do PETG XT (0,125).

## Próximos passos
1. Anotar a faixa de temperatura da etiqueta do ABS.
2. Criar `Creality Taurus ABS Speed` como cópia do baseline (o processo é o `0.20mm Standard @Taurus Speed`, comum a todos), com PA desligado e `SET_PRESSURE_ADVANCE ADVANCE=0` no end gcode, igual aos outros Speed.
3. Vazão no ar (procedimento em `printers/frank-pro/calibracao.md`) em F250 (10 mm³/s) e F300 (12 mm³/s), começando no máximo da etiqueta −5 °C. Perda ≤ ~2% nos dois → fica nessa temperatura. Senão, testar no máximo da etiqueta. Base: PETG XT terminou no máximo (270 de 270; 265 perdeu 4,3%) e PLA a 5 °C do máximo (225 de 230, único ponto testado, com folga de 0,2–0,6%).
4. Fazer a torre de PA com o filamento ABS Speed.
5. Imprimir um Benchy e conferir empeno e delaminação.

## Fecha quando
- ABS Speed com temperatura e PA medidos e um Benchy aprovado.
