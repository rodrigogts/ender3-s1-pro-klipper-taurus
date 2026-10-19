# Calibrar ABS (temperatura, vazão e PA) e criar o ABS Speed
- status: pendente, sem data
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- existe só o baseline `Creality Taurus ABS`: 245 °C (250 na primeira camada), faixa até 250, fan 20%, overhang 35%, herda de `Creality Generic ABS` (mesa 100 °C, max volumetric 12)
- nada de ABS foi calibrado no Klipper
- marca e etiqueta do ABS em uso: não informadas
- a mesa tem limite de 110 °C (`max_temp`)
- regra do projeto: não ativar PA no ABS antes da torre no próprio ABS

## Hipóteses
- O ABS pede cooling baixo e é sensível a corrente de ar. Gabinete: não informado se existe.
- Pela tendência PLA 0.038 × PETG 0.125, o PA do ABS deve ficar em torno do do PLA, mas isso não é base para pular a torre.

## Próximos passos
1. Anotar a faixa de temperatura da etiqueta do ABS.
2. Criar `Creality Taurus ABS Speed` como cópia do baseline e um processo `0.20mm Standard @Taurus ABS Speed`, com PA desligado e `SET_PRESSURE_ADVANCE ADVANCE=0` no end gcode, igual aos outros Speed.
3. Fazer a vazão no ar (procedimento em `printers/frank-pro/calibracao.md`) e escolher a temperatura.
4. Fazer a torre de PA com o filamento ABS Speed.
5. Imprimir um Benchy e conferir empeno e delaminação.

## Fecha quando
- ABS Speed com temperatura e PA medidos e um Benchy aprovado.
