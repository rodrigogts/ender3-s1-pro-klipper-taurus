# Validar o PLA Speed numa impressão real
- status: em andamento; teste curto do casco (2026-10-18)
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
- leitura:
  - defeito no lado virado para a frente nas DUAS cópias → causa ligada à máquina/posição (ar, movimento);
  - defeito no MESMO lado da peça nas duas → causa ligada ao fatiamento (ordem/sentido dos caminhos);
  - defeito dos dois lados → refrigeração geral;
  - sem defeito → o teste não reproduz o Benchy (camada de ~9 s contra ~31 s); voltar ao Benchy cortado.

## Próximos passos
1. Imprimir o casco curto (`RESTART` antes e conferir `--param limites`). Foto das quatro faces das duas cópias.
2. Conforme a leitura, uma variável por vez no PLA Speed: fan (30–40% → mais alto) ou temperatura (225 → 215, refazendo a vazão no ar a 8 mm³/s).
3. Sempre `RESTART` depois de torre ou teste com `SET_VELOCITY_LIMIT`, e conferir com `--param limites` antes de imprimir.

## Fecha quando
- Benchy sem defeito atribuível a PA, temperatura, vazão ou refrigeração. Registrar em `printers/frank-pro/calibracao.md` e marcar o PLA Speed como VALIDADO em `printers/frank-pro/README.md`.

## Referências
- `printers/frank-pro/calibracao.md`
- `../projects/#gcodes/square_tower_PA_PLA_53m.gcode`, `../projects/#gcodes/3DBenchy_PLA_1h5m.gcode`
