# Guia dos presets do OrcaSlicer — Frank Pro

Como achar o valor efetivo de qualquer configuração nos arquivos JSON deste projeto.

## Conjunto
Uma impressão usa 3 presets selecionados juntos no Orca: impressora (machine) + filamento + processo.
Conjunto de velocidade atual: `Frank Pro 0.4 nozzle Speed` + `0.20mm Standard @Taurus <material> Speed` + `Creality Taurus <material> Speed`.

## Mapa preset → base
Cada preset personalizado tem só os campos alterados e aponta a base pelo campo `inherits` (pelo `name` da base, que é igual ao nome do arquivo sem `.json`).

| Preset (arquivo) | Tipo | Base (arquivo) | Estado |
|---|---|---|---|
| Frank Pro 0.4 nozzle.json | machine | Creality Ender-3 S1 Pro 0.4 nozzle.json | original |
| Frank Pro 0.4 nozzle Speed.json | machine | Creality Ender-3 S1 Pro 0.4 nozzle.json | em uso |
| 0.20mm Standard @Taurus.json | process | 0.20mm Standard @Creality Ender3S1Pro.json | original |
| 0.20mm Standard @Taurus PETG XT Speed.json | process | 0.20mm Standard @Creality Ender3S1Pro.json | em uso |
| 0.20mm Standard @Taurus PLA Speed.json | process | 0.20mm Standard @Creality Ender3S1Pro.json | em uso |
| Creality Taurus PETG XT Speed.json | filament | Creality Generic PETG.json | VALIDADO |
| Creality Taurus PLA Speed.json | filament | Creality Generic PLA.json | parcial |
| Creality Taurus PETG XT.json | filament | Creality Generic PETG.json | baseline |
| Creality Taurus PETG.json | filament | Creality Generic PETG.json | baseline |
| Creality Taurus PLA.json | filament | Creality Generic PLA.json | baseline |
| Creality Taurus ABS.json | filament | Creality Generic ABS.json | baseline |
| Creality Taurus TPU.json | filament | Creality Generic TPU.json | baseline |

As 6 bases são unificadas: a cadeia de herança do Orca (ex.: fdm_filament_common → fdm_filament_pla → Creality Generic PLA) já foi resolvida dentro do arquivo, que não tem mais `inherits`. Geradas a partir da instalação local do OrcaSlicer; conferidas iguais à instalação em 2026-10-18.

## Regra de resolução
1. Procurar a chave exata no preset personalizado. Se existir, esse é o valor.
2. Se não existir, usar o valor da base indicada em `inherits`.
3. Se também não existir na base, é default interno do Orca: dizer isso e não inventar valor.
4. Override é por chave inteira: um array no preset substitui o array da base, sem mescla.
5. Preservar tipos e formato: strings numéricas (`"0.125"`), arrays (posição = extrusor), `"0"`/`"1"` como booleano, `nil`, percentuais, placeholders e G-code com `\n`.

Entre categorias, o Orca aplica overrides próprios. Exemplo: retração vem da impressora; campos `filament_retraction_*` do filamento, quando definidos, substituem para aquele material.

Ao responder sobre uma configuração: citar conjunto, chave, valor efetivo, arquivo de origem (preset ou base) e se é valor explícito, herdado ou calibrado na máquina.

## Materiais
- PETG XT = Tritan HT da 3D Fila (copoliéster, não PETG); herda de Creality Generic PETG por proximidade de processo.
  - etiqueta: bico 250–270 °C, mesa 110–120 °C; mesa roda a 105 °C porque o Klipper limita a 110
  - `Creality Taurus PETG XT Speed`: 270 °C, faixa 250–270, PA 0.125, mesa 105; VALIDADO
  - `Creality Taurus PETG XT`: 265 °C, faixa 250–255 copiada do preset PETG; não validado
- PLA da 3D Fila: etiqueta até 230 °C.
  - `Creality Taurus PLA Speed`: 225 °C, faixa 190–230, PA 0.038; vazão validada, impressão real pendente
  - `Creality Taurus PLA`: 210 °C (215 na 1ª camada); baseline
- fan: percentuais calibrados para o Taurus dual 5015, que sopra muito mais que o cooling stock; não comparar com perfis stock.
- Pressure Advance: definido só nos filamentos Speed calibrados; o `filament_end_gcode` zera com `SET_PRESSURE_ADVANCE ADVANCE=0`. printer.cfg tem PA 0.

## Onde procurar
| Pergunta | Primeiro | Depois |
|---|---|---|
| temperatura, fan, flow, PA, vazão máxima | filamento Taurus | base Creality Generic |
| retração | impressora + filamento | bases, regra de override |
| volume, bico, flavor, limites do slicer, start/end G-code | impressora Frank Pro | base S1 Pro |
| camada, velocidade, aceleração, paredes, infill, suporte | processo Taurus | base 0.20mm Standard |
| limites e valores reais do firmware | frank-pro-klipper.cfg.txt | frank-pro.md |
| valor medido/calibrado | frank-pro-calibracao.md | frank-pro.md |

## Alterações
- Recomendar sempre: preset personalizado + chave + valor proposto.
- Nunca alterar presets de sistema nem bases; mudanças vão em presets personalizados (overrides), de preferência nos Speed.
- Prioridade das fontes: informação nova do usuário > medição na máquina > preset personalizado > base > documentação oficial do Orca.
