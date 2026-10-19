# Validar o PLA Speed numa impressão real
- status: PAUSADO por decisão do usuário (2026-10-18: "chega de benchy"). Benchy oco reproduz o defeito; o teste de PA 0.025 ficou pronto e não foi impresso
- máquina: Frank Pro
- prioridade: alta
- atualizado: 2026-10-18

## Fatos
- filamento `Creality Taurus PLA Speed` (PLA 3D Fila, vermelho): 225 °C (etiqueta máx. 230), PA 0.038, max volumetric 12 mm³/s; fan 30–40%, overhang fan 80% com `overhang_fan_threshold` 50% (copiados do `Creality Taurus PLA`)
- vazão no ar a 225 °C: perda de 0.6% a 8 e 10 mm³/s, 0.2% a 12 mm³/s
- torre de PA: melhor altura 7.62 mm, só a leitura dos cantos
- faces da torre: 60.00 mm
- processo `0.20mm Standard @Taurus PLA Speed` = cópia do processo PETG XT Speed

### Benchy 00005D (`3DBenchy_PLA_1h5m.gcode`), 2026-10-18 — com estado errado na impressora
- impresso sem `RESTART` depois da torre: SCV 1 em vez de 5 durante a impressão inteira. A accel veio do G-code e o PA 0.038 do G-code; o TUNING_TOWER já tinha encerrado sozinho.
- tempo: 1h20m14s contra 1h05m09s do slicer (+23%). Os Benchy PETG com o mesmo processo deram +5.5%. A diferença é o SCV 1: a cabeça quase para em cada canto.
- defeito: calombos brilhantes e saltados no vinco da proa, de Z ~5 a ~10 mm, além de um "volume" na lateral do casco (local exato não descrito).
- G-code na faixa do defeito:
  - costura na popa (X ~82), então não é costura;
  - a ponta da proa (X 126–134, Y 110) é overhang de ~45°;
  - o fan de overhang de 80% vale até Z 4.8; de Z 5.0 em diante fica 39%;
  - parede externa na ponta entre 20 e 50 mm/s (slowdown de overhang).
- referência: um Benchy PLA vermelho mais antigo, com o vinco perfeito. Não está no histórico do Klipper; perfil não identificado (perguntado ao usuário).

- medição pela foto (régua: altura da proa 26.26 mm medida pelo usuário, 132.6 camadas contadas × 131.3 esperadas): calombos da camada 26–27 (Z 5.2–5.4) à 46–48 (Z 9.1–9.6), começando 1–2 camadas depois da queda do fan da ponta (Z 5.0)

### Benchy 00005E, 2026-10-18 — mesmo G-code, depois do `RESTART` (SCV 5)
- ritmo normal: camada 55 (Z 11) aos 24m11s de impressão; cancelado aos 50m20s
- resultado PIOR: faixa de calombos e linhas enroladas na lateral do casco e na proa, Z ~5–10
- defeito de UM lado só: o lado que ficou virado para a frente da impressora (Y baixo, proa em +X). O outro lado saiu limpo. A geometria abre igual dos dois lados (G-code: Y 98.8→96.1 e 121.2→123.9 entre Z 5 e 10).
- conclusão: o SCV 1 não causava o defeito; atenuava, porque deixava as camadas mais lentas (mais tempo para esfriar). Hipótese 1 descartada.
- as duas 5015 conferidas pelo usuário: refrigeração normal, sem diferença entre os lados. O PETG impresso no dia anterior saiu bom.

## Hipóteses (ordem, atualizada)
1. Calor/refrigeração no overhang do PLA a 225 °C com fan de 30–40%: o defeito piora com camada mais rápida e aparece onde o casco abre. O lado único segue sem explicação (as ventoinhas estão normais).
2. Direção/ordem dos caminhos (lado, sentido da parede ou costura em relação ao movimento): explicaria o lado único. O teste de duas cópias separa isso.
3. PA 0.038 um pouco alto: menos provável, porque o defeito é material sobrando, não faltando.

## Teste em andamento: casco curto em vez do Benchy
- STL `../projects/calibracao/teste-casco-overhang-duplo.stl`: dois cascos com proa em V de ponta arredondada (raio 2.5 mm; no Benchy o G-code dá 2.4–2.7 mm) e overhang de 45°, laterais abrindo ~32°, popa reta com quinas vivas; base 0–1 mm, abertura 1–6 mm, topo 6–7 mm. A cópia de baixo (Y menor) tem a proa em +X; a de cima é a mesma peça girada 180°.
- 1ª versão (proa em V viva) cancelada: a costura `aligned` foi para a ponta da proa. Na versão arredondada, a costura vai para uma quina da popa nas duas cópias, como no Benchy (conferido no fatiamento pelo CLI).
- fatiado no Orca pelo usuário: ~14m50s, 35 camadas, PLA Speed 225 °C, PA 0.038, mesa 65/60 °C, fan 30–40% (overhang 80% acima de 50%); na abertura, parede externa a 53–60 mm/s e fan de 39%, como na faixa do defeito do Benchy.
- variante do usuário (2026-10-18): `teste-casco-overhang-simples.stl`, modelo novo feito por ele, uma cópia só, com o trecho reto do casco mais longo (41.3 × 20.25 × 7 mm; base ~35 mm). No G-code: proa avança ~1.06 mm/mm (~47°), laterais abrem ~0.62 mm/mm por lado (~32°), como no original; proa para −X; G-code `teste-casco-overhang-simples_PLA_10m52s.gcode` (10m52s, já com `PREAQUECE_BICO`). Com uma cópia a camada fica em ~8 s e o slowdown de refrigeração baixa paredes internas e infill de 90 para 64 mm/s; a parede externa segue a 56–60 mm/s. Depois, repetir com a peça girada 180°.
- leitura:
  - defeito no lado virado para a frente nas DUAS cópias → causa ligada à máquina/posição (ar, movimento);
  - defeito no MESMO lado da peça nas duas → causa ligada ao fatiamento (ordem/sentido dos caminhos);
  - defeito dos dois lados → refrigeração geral;
  - sem defeito → o teste não reproduz o Benchy (camada de ~9 s contra ~31 s); voltar ao Benchy cortado.

### Teste casco diagonal (`teste-casco-diagonal-overhang-simples_PLA_17m36s.gcode`), 2026-10-18 — LIMPO
- modelo do usuário: proa arredondada em overhang de Z ~2 a 10.8 (~0.87 mm/mm, ~41°), laterais abrindo ~0.37 mm/mm por lado (~20°), topo em diagonal; proa para −X; costura na quina da popa
- mesmas condições de material: 225 °C, PA 0.038, fan de 38–39% na ponta o overhang inteiro, ponta a 37–60 mm/s, SCV 5; tempo real de camada 16–34 s entre as camadas 30 e 50 (Benchy 00005E: ~31 s entre 25 e 48). Correção: a comparação "~31 s × ~8 s" feita antes misturava tempo real com estimativa sem aceleração (estimativas: Benchy 9–15 s, teste ~8 s); o tempo de camada não é uma diferença grande.
- 18m32s; resultado "excelente", sem calombos na proa nem nas laterais
- descartado no klippy.log: `print_stall` ficou em 0 em todas as impressões desde o RESTART de 2026-10-18 20:20 (Benchy 00005E incluído). Não houve micro-paradas por fila vazia.
- conclusão: PA 0.038 + 225 °C + fan 39% num overhang de proa arredondada a ~41° não bastam para causar o defeito.

### O que ainda diferencia o Benchy do teste
- abertura das laterais: Benchy ~31° (0.6 mm/mm por lado) × teste ~20°
- sentido de impressão em relação à peça: no Benchy (proa +X) a face da frente, a defeituosa, é impressa no sentido +X, da popa para a proa (G-code: 100% dos segmentos +X em Z 3–8); a face de trás vai −X, da proa para a popa. No teste (proa −X), a face da frente vai da proa para a popa. Velocidade (47–60 mm/s) e fan (39%) são iguais nas duas faces do Benchy.
- curvatura composta do casco

### Benchy oco (`3dbenchy-overhang-only.stl`, `3dbenchy-overhang-only_PLA_30m13s.gcode`), 2026-10-18 — preparado pelo usuário
- só o casco do Benchy, sem nada dentro; Z até 27.4 mm, 137 camadas, 30m13s; mesmos presets (PREAQUECE_BICO, 225 °C, PA 0.038, fan 30–40%)
- contorno externo idêntico ao Benchy 00005E em Z 3–9 (caixa igual com diferença ≤ 0.1 mm); proa para +X, como no Benchy
- face da frente igual ao Benchy: fan 39%, 49–60 mm/s, impressa no sentido +X (popa → proa)
- diferença: com a parede fina, o Orca aplica o fan de overhang de 80% na ponta da proa em Z 3–7 (no Benchy, 39% a partir de Z 5). Se a proa sair limpa, isso não absolve a refrigeração na proa; a comparação válida é a face da frente.
- diferença: a ordem/costura muda (há também o contorno interno do casco oco)
- resultado (job 000063, cancelado na camada 65, Z 13, aos 20m54s): REPRODUZIU, "mesmo defeito" do Benchy segundo o usuário. O defeito depende da geometria externa do casco do Benchy, não do que há dentro. Como a ponta teve fan de 80% em Z 3–7 e o defeito veio mesmo assim, a refrigeração perde força como causa.

### Teste PA 0.025 no Benchy oco — próximo (uma variável)
- hipótese do usuário: PA 0.038 alto
- G-code `3dbenchy-overhang-only_PLA_30m13s_PA0025.gcode`: cópia exata do teste anterior com uma linha trocada (`SET_PRESSURE_ADVANCE ADVANCE=0.038` → `0.025`, linha 529); o preset não foi alterado
- comparar a mesma faixa (Z 3–10) e a mesma face; se melhorar, refazer a leitura da torre (sulco) e só então mudar o preset


## Próximos passos
1. Reproduzir antes de isolar: mesmo modelo diagonal, com a proa para +X (como no Benchy) e laterais abrindo ~31°. Se reproduzir, voltar a mudar uma coisa por vez (ângulo × sentido); se não, o próximo suspeito é o tempo de camada/curvatura do Benchy.
2. Conforme a leitura, uma variável por vez no PLA Speed: fan (30–40% → mais alto) ou temperatura (225 → 215, refazendo a vazão no ar a 8 mm³/s).
3. Sempre `RESTART` depois de torre ou teste com `SET_VELOCITY_LIMIT`, e conferir com `--param limites` antes de imprimir.

## Fecha quando
- Benchy sem defeito atribuível a PA, temperatura, vazão ou refrigeração. Registrar em `printers/frank-pro/calibracao.md` e marcar o PLA Speed como VALIDADO em `printers/frank-pro/README.md`.

## Referências
- `printers/frank-pro/calibracao.md`
- `../projects/#gcodes/square_tower_PA_PLA_53m.gcode`, `../projects/#gcodes/3DBenchy_PLA_1h5m.gcode`
