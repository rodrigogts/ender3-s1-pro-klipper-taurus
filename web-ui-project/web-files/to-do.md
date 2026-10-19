<!-- fonte: to-do/README.md -->
# to-do

Um arquivo por ação em andamento, pendente ou ainda sem decisão. Cada arquivo traz status, fatos, hipóteses, próximos passos e o critério de fechamento.

Regras:
- Ação fechada: o resultado vai para o doc da máquina (`printers/<máquina>/README.md` ou `calibracao.md`) e o arquivo daqui é apagado. O histórico fica no git.
- Fato novo: atualizar o campo `atualizado` e o status.
- Status possíveis: em andamento, pendente, pedido/comprado, aberto, decisão pendente, decisão tomada, ideia.

| Arquivo | Máquina | Status | Prioridade | Resumo |
|---|---|---|---|---|
| [exclude-object.md](exclude-object.md) | Frank Pro | em andamento | alta | Ligar `[exclude_object]` no Klipper e no processo Speed do Orca para cancelar só a peça que falhou. Klipper primeiro, Orca depois |
| [mesa-termistor.md](mesa-termistor.md) | Frank Pro | aberto | alta | Termistor da mesa com leitura errática entre 95 e 97 °C que desarmou o verify_heater duas vezes. Suspeita no lado quente; medir ~100 kΩ mexendo o cabo |
| [pi-fonte.md](pi-fonte.md) | Frank Pro | comprada, teste pendente | alta | Fonte nova do Pi: confirmar que somem o "Previously Under-Volted" e a queda do USB da MCU |
| [pla-speed-validacao.md](pla-speed-validacao.md) | Frank Pro | pausado | média | Calombos no overhang do casco do Benchy em PLA Speed (Z 5–10). O casco oco reproduz em ~12 min; o teste com PA 0.025 está pronto (G-code editado) e não foi impresso. Peças sem overhang daquele tipo imprimem bem |
| [petg-max-flowrate.md](petg-max-flowrate.md) | Frank Pro | pendente | média | Max flowrate do PETG XT a 270 °C e limite de ~85% no `filament_max_volumetric_speed` |
| [bico-cht.md](bico-cht.md) | Frank Pro | pedido, em trânsito | média | Bico CHT 0.4 latão + CuCrZr para mais vazão; depois de instalar, refazer z_offset, vazão e PA |
| [input-shaper-adxl.md](input-shaper-adxl.md) | Frank Pro | pendente | média | ADXL345 + Input Shaper medido na própria máquina antes de subir acelerações |
| [frank-mini-diagnostico.md](frank-mini-diagnostico.md) | Frank Mini | pendente | média | Mesa que aquece sem comando (MOSFET?) e encoder que não gira o menu |
| [abs-calibracao.md](abs-calibracao.md) | Frank Pro | pendente | baixa | Criar o ABS Speed e calibrar temperatura, vazão e PA do ABS |
| [speed-como-padrao.md](speed-como-padrao.md) | Frank Pro | decisão pendente | baixa | Tornar o Speed o perfil padrão: por material, conforme for validado, ou renomear tudo no fim |
| [trilhos-lineares.md](trilhos-lineares.md) | Frank Pro | decisão tomada: não agora | baixa | Trilhos lineares XYZ: sem ganho comprovado na S1 Pro; reabrir só com evidência de folga ou ringing |
| [macros-klipper.md](macros-klipper.md) | Frank Pro | validado; falta 1 teste | baixa | `macros.cfg`: `M600` estilo Marlin e v2 (sem gotinha) validados em 2026-10-18/19. Falta só testar `PREAQUECE_BICO` com o bico já quente |
| [stray-kids-logo.md](stray-kids-logo.md) | Frank Pro | impressão pendente | baixa | Logo em 3 cores montado no Tinkercad; procedimento de troca de cor com PAUSE |
| [orca-bundle-export.md](orca-bundle-export.md) | Frank Pro | pendente | baixa | Reexportar o `.orca_printer` (o atual é de 2026-10-05, sem os Speed) |
| [armazenamento-filamento.md](armazenamento-filamento.md) | geral | sacos a caminho; sílica em teste | baixa | 20 sacos a vácuo PA+PE 32 × 34 cm (chegam até 24/10; os atuais perdem vácuo) e sílica laranja regenerável (testando 65 °C no secador; o usual é ~100–120 °C) |
| [cli-fatiamento-helper.md](cli-fatiamento-helper.md) | Frank Pro | ideia | baixa | Script para fatiar pelo CLI do Orca (torres, comparações) com as correções já conhecidas |

Ordem sugerida na Frank Pro: exclude-object (pedido do usuário; rápido) → mesa-termistor e pi-fonte (confiabilidade) → pla-speed-validacao → petg-max-flowrate → bico-cht → input-shaper-adxl. O bico CHT, quando chegar, vem antes do max flowrate, porque o limite muda com ele.

<!-- fonte: to-do/abs-calibracao.md -->
# Calibrar ABS (temperatura, vazão e PA) e criar o ABS Speed
- status: pendente, sem data
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-19

## Fatos
- existe só o baseline `Creality Taurus ABS`: 245 °C (250 na primeira camada), faixa até 250, fan 20%, overhang 35%, herda de `Creality Generic ABS` (mesa 100 °C, max volumetric 12)
- nada de ABS foi calibrado no Klipper
- marca e etiqueta do ABS em uso: não informadas
- a mesa tem limite de 110 °C (`max_temp`)
- regra do projeto: não ativar PA no ABS antes da torre no próprio ABS
- 2026-10-19: clips de saco de 12 cm em ABS (job 000069, 84 g, 6h38m pelo slicer) fatiados com `Frank Pro 0.4 nozzle` + `0.20mm Standard @Taurus Speed` + `Creality Taurus PETG XT Speed` sem alteração: bico 270 °C, mesa 105 °C, fan 10–15%, overhang 25%, PA 0,125 (do PETG XT), sem brim. Parcial, camada ~4/50 às 13:22: pontas sem empenar e impressão boa (relato do usuário, sem gabinete informado). Às 13:29, camada ~4/50 (12,5%), o usuário baixou o bico para 245 °C pelo Mainsail; o G-code não redefine a temperatura depois do start. Resultado: cancelado às 2h39m de impressão; dos 6 clips, o do meio empenou (relato do usuário).
- 2026-10-19 15:07 (job 00006A): 1 clip, `Frank Pro 0.4 nozzle` + `0.20mm Standard @Taurus` + `Creality Taurus ABS`: bico 250/245 °C, mesa 105 °C, PA desligado, fan 20%, aceleração 500 mm/s², sem brim. Resultado: pendente.
- 245 °C: o usuário já usou neste ABS e funcionou (sem vazão no ar nem torre).
- Este clip saiu bem 6 vezes no baseline `Creality Taurus ABS`, sem brim (relato do usuário). Brim dispensado para ele.
- 270 °C: as camadas 1–4 do job 000069 saíram sem defeito visível (relato do usuário), a 500 mm/s² e vazão baixa.

## Hipóteses
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

<!-- fonte: to-do/armazenamento-filamento.md -->
# Armazenamento de filamento: sacos a vácuo novos e sílica regenerável
- status: sacos comprados, a caminho; sílica comprada, regeneração em teste
- máquina: geral (todos os filamentos)
- prioridade: baixa
- atualizado: 2026-10-19

## Fatos
- sacos atuais perdem o vácuo; causa não identificada
- comprados (Mercado Livre, internacional): 20 sacos a vácuo para filamento, 32 × 34 cm (cabem carretéis de 1 kg), material PA+PE, lado preto opaco à luz e lado transparente com etiqueta para material e data
  - entrega prevista entre 2026-10-05 e 2026-10-24; em 2026-10-17 saiu do centro de distribuição de Campinas (J&T)
- sílica gel regenerável laranja comprada; alguns saquinhos ficaram escuros (verde-escuro/preto = saturada; laranja = seca)
- regeneração usual da sílica: ~100–120 °C por 1–3 h (conferir na embalagem). Os secadores de filamento chegam a ~55–70 °C, o que regenera devagar e só em parte.
- teste em andamento (2026-10-19): saquinhos no secador a 65 °C por várias horas, para não arriscar o material do saquinho no forno

## Hipóteses (sacos perdendo vácuo)
- vazamento na válvula ou no zíper (sujeira/pó de filamento na vedação, zíper não fechado de ponta a ponta)
- furo pela ponta solta do filamento ou pela borda do carretel
- saco só de PE é mais permeável e fura mais fácil; o PA+PE (nylon + PE) é barreira melhor e mais resistente a perfuração

## Próximos passos
1. Ver a cor da sílica depois do secador: voltou a laranja → resolvido; só clareou → regenerar os grãos fora do saquinho no forno a ~100 °C.
2. Quando os sacos chegarem: prender a ponta do filamento no carretel antes de ensacar, limpar o zíper, fechar de ponta a ponta, sílica seca dentro e etiqueta com material e data.
3. Conferir depois de alguns dias se o vácuo se mantém. Mesmo sem vácuo, saco PA+PE bem fechado com sílica seca já protege da umidade.

## Fecha quando
- Filamentos guardados nos sacos novos com sílica regenerada, e o vácuo se mantendo (ou decidido que não importa).

<!-- fonte: to-do/bico-cht.md -->
# Trocar para o bico CHT (maior vazão)
- status: pedido feito, vindo da China (não chegou); não instalado
- máquina: Frank Pro
- prioridade: média
- atualizado: 2026-10-18

## Fatos
- peça: kit de 2 bicos CHT MK8 0.4 mm, latão com núcleo CuCrZr, sem garantia
- objetivo: mais vazão no Sprite Pro, para ter folga acima dos ~8 mm³/s dos processos Speed
- escolha: latão/cobre em vez de aço endurecido, porque conduz melhor o calor. Os filamentos em uso não são abrasivos.
- hoje, bico original 0.4: PETG XT a 270 °C perde ~2% a 10 mm³/s; PLA a 225 °C perde 0.2% a 12 mm³/s

## Próximos passos (depois de instalar)
1. Apertar a quente, conforme o procedimento do hotend.
2. Refazer o z_offset (`PROBE_CALIBRATE`, `SAVE_CONFIG`).
3. Opcional: PID do hotend, porque a massa térmica muda.
4. Refazer a vazão no ar no PETG XT e no PLA (ver `printers/frank-pro/calibracao.md`).
5. Medir o max flowrate (ver `petg-max-flowrate.md`) e ajustar `filament_max_volumetric_speed`.
6. Refazer a torre de PA dos dois materiais. O PA depende do bico.
7. Só depois disso pensar em subir as velocidades dos processos Speed.

## Fecha quando
- Bico instalado, com z_offset, vazão e PA novos registrados e um Benchy aprovado.

<!-- fonte: to-do/cli-fatiamento-helper.md -->
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

<!-- fonte: to-do/exclude-object.md -->
# Exclude object: cancelar só a peça que falhou
- status: em andamento (Orca feito; falta o Klipper)
- máquina: Frank Pro
- prioridade: alta (pedido do usuário)
- atualizado: 2026-10-19

## Fatos
- 2026-10-19: job 000069 (6 clips em ABS) cancelado com 2h39m de impressão porque o clip do meio empenou. Com exclude object, os outros 5 seguiriam.
- `printer.cfg` não tem `[exclude_object]`.
- No Orca, `exclude_object` é opção do preset de processo (Others → Exclude objects), não da impressora. `gcode_label_objects` já vem 1.
- 2026-10-19: `"exclude_object": "1"` gravado no `0.20mm Standard @Taurus Speed` (Orca e repo). O Orca só aplica depois de reiniciar.
- `[exclude_object]` é módulo só do host (Klipper v0.13); a versão da MCU não importa.
- Só o processo `0.20mm Standard @Taurus Speed` pode receber a opção; o `0.20mm Standard @Taurus` original não se edita.

## Próximos passos
1. Usuário, pelo Mainsail, com a impressora parada: acrescentar ao `printer.cfg`, fora do bloco do SAVE_CONFIG, e dar `RESTART`:
   ```ini
   [exclude_object]
   ```
2. Agente: atualizar o snapshot (`node scripts/frank-pro.mjs --host 192.168.0.150 --param cfg --file printer.cfg > printers/frank-pro/klipper/printer.cfg`) e conferir a seção.
3. Usuário reinicia o Orca (feche sem salvar o processo, senão o GUI sobrescreve).
4. Fatiar 2 peças e conferir no G-code `EXCLUDE_OBJECT_DEFINE` no cabeçalho e `EXCLUDE_OBJECT_START`/`END` em volta de cada peça.
5. Testar numa impressão de 2 peças pequenas: excluir uma pelo Mainsail (painel de status → Exclude objects) ou no console com `EXCLUDE_OBJECT NAME=<nome>`; a outra deve terminar normal.

## Riscos
- G-code com `EXCLUDE_OBJECT_DEFINE` numa impressora sem `[exclude_object]` para com comando desconhecido: não mandar G-code do processo Speed antes do passo 1.
- `RESTART` derruba a impressão em andamento.

## Fecha quando
- Uma peça excluída no meio da impressão e as outras terminando sem defeito. Resultado vai para `printers/frank-pro/README.md` e uma linha sobre o uso em `resources/utils/klipper.md`.

<!-- fonte: to-do/frank-mini-diagnostico.md -->
# Frank Mini: diagnóstico da mesa que aquece sozinha e do encoder
- status: pendente (medições não feitas)
- máquina: Frank Mini (Ender 3 Neo)
- prioridade: média (a mesa aquece sem comando, então há risco térmico)
- atualizado: 2026-10-18

O estado completo, as hipóteses e o plano estão em `printers/frank-mini/README.md`.

## Próximos passos
1. Medir com multímetro a tensão da saída BED com target 0.
2. Se houver tensão: seguir MOSFET, gate e trilhas antes de condenar a placa.
3. Diagnosticar o encoder separadamente.
4. Não deixar o Raspberry no USB com a impressora desligada (backfeed de 5 V).

## Riscos
- Mesa aquecendo sem comando: não deixar ligada sem supervisão até medir.

## Fecha quando
- A causa da mesa foi identificada e corrigida (ou a placa foi trocada) e o encoder funciona.

<!-- fonte: to-do/input-shaper-adxl.md -->
# Input Shaper com ADXL345
- status: pendente; compra do ADXL não informada
- máquina: Frank Pro
- prioridade: média
- atualizado: 2026-10-18

## Fatos
- Input Shaper não está configurado. Regra: medir na própria Frank Pro, sem copiar valor de outra máquina.
- mesa móvel no Y (cartesiana bed-slinger): medir X no cabeçote e Y na mesa
- o ADXL mede uma vez: salva o resultado e depois pode ser removido
- hoje, accel máx. 2000 e SCV 5; os processos Speed usam de 650 a 2000 mm/s²
- os cubos A/B (2026-10-16) mostraram que a aceleração não causava os defeitos vistos. Ringing ainda não foi avaliado.

## Hipóteses
- Ligar o ADXL nos pinos SPI do Pi exige instalar o "Klipper host MCU" (processo Linux no Pi). Isso não mexe na MCU STM32 nem na build validada.

## Próximos passos
1. Comprar o ADXL345 e o cabo, se ainda não tiver.
2. Montar o suporte no cabeçote (X) e na mesa (Y).
3. O usuário aplica no Mainsail as seções `[mcu rpi]`, `[adxl345]` e `[resonance_tester]` (com `probe_points`). O agente entrega o trecho pronto.
4. Rodar `ACCELEROMETER_QUERY`, `MEASURE_AXES_NOISE`, `SHAPER_CALIBRATE` e `SAVE_CONFIG`.
5. Revisar `max_accel` com base na aceleração máxima recomendada pelo shaper.
6. Só então subir as acelerações dos processos Speed.

## Fecha quando
- `[input_shaper]` salvo, com shaper e frequência medidos, e as acelerações revisadas.

<!-- fonte: to-do/macros-klipper.md -->
# Macros: troca de filamento estilo Marlin (M600), posicionamento do bico e pré-aquecimento
- status: M600 e v2 VALIDADOS (v2 em 2026-10-19: retomada sem gotinha, sem console); falta só testar `PREAQUECE_BICO` com bico quente

## Teste real, 2026-10-18 (job da placa do R, `teste-placa-20x20-letra-R_PLA_3m37s.gcode`)
- `M600` inserido no Orca como custom G-code na camada 6: no G-code, logo depois de `SET_PRINT_STATS_INFO CURRENT_LAYER=6` e antes da subida para a camada
- 23:30:38 pausa; idle_timeout 1800 s; Z subiu para 20 (peça em Z 1.0) e foi a X0 Y220; descarga +10/−50 mm; janela aberta às 23:30:49
- 23:31:59 `CARREGA_TROCA` (botão); purga em X0 Y0; janela "Purga feita" às 23:32:21
- 23:32:32 `RETOMA_TROCA` (botão); idle_timeout volta a 600 s; continuou a camada 6 → 10
- resultado: "a troca ficou linda", mensagens do Mainsail orientando cada passo
- `PREAQUECE_BICO` no mesmo job: bico frio → foi a 170 enquanto a mesa aquecia (comportamento esperado)

## Pendências pequenas
- gotinha na retomada: CONFIRMADA pelo usuário em 2026-10-19 (Stray Kids, troca da camada 16). Causas:
  1. sobra de 0.8 mm: o Orca retrai 0.8 mm antes do `M600` e devolve 0.8 mm (`G1 E.8`) logo depois da retomada, mas a purga já deixou o bico cheio; o `RESUME` devolve só o 1 mm do `CARREGA_TROCA`. Sobram ~0.8 mm (~1.9 mm³) no primeiro ponto. Conferido nos dois `M600` do G-code do Stray Kids (retração total 0.8 antes, `G1 E.8` depois).
  2. escorrimento: só 1 mm de retração enquanto o bico quente espera a limpeza e o clique.
- correção (v2) instalada em 2026-10-19; antes ficava em `to-do/macros-v2-PARA-INSTALAR.cfg` (v2, só ASCII, diferença mínima para o snapshot): `ret_espera` 2 mm depois da purga (o mesmo do `PAUSE_PARK_RETRACT_LENGTH` padrão do Marlin; 3 mm foi descartado por cautela com plástico derretido subindo para a zona fria durante a espera); no `RETOMA_TROCA`, já no ponto, devolve `ret_espera − 1 − ret_slicer` (0.2 mm) antes do `RESUME`. Com o `RESUME` (+1) e o `G1 E.8` do G-code, a conta fecha em zero. Instalar sem impressão rodando: upload por cima do `macros.cfg` e Salvar e reiniciar; depois atualizar o snapshot e apagar `to-do/macros-v2-PARA-INSTALAR.cfg`. Atenção: `printers/frank-pro/klipper/macros.cfg` é o snapshot do que já está na impressora (v1); colar ele não muda nada (aconteceu em 2026-10-19 00:54).
- contorno manual enquanto a v2 não entra: depois de limpar o bico e antes de clicar Retomar, `M83` e `G1 E-0.8 F2100` no console (tira a sobra de 0.8 mm).
- testar `PREAQUECE_BICO` com o bico já quente (o alvo deve continuar no valor atual)

- máquina: Frank Pro
- prioridade: média
- atualizado: 2026-10-18

## Contexto
- O usuário troca de cor por camada com um G-code custom, como fazia no Marlin. Não usa o "color change" do Orca.
- Fluxo do Marlin que ele quer repetir:
  1. guarda a camada e a posição;
  2. retrai 1 mm;
  3. estaciona no canto superior esquerdo (X mín., Y máx.) e pausa;
  4. tira o filamento, coloca o novo e confirma no visor;
  5. o bico vai ao canto inferior esquerdo, purga e volta ao superior esquerdo;
  6. resume: volta ao ponto da impressão e desfaz a retração.
- No Klipper não há visor. A confirmação vira janela com botões no Mainsail (`action:prompt_*`, o mesmo recurso que o RESUME do mainsail.cfg já usa).
- Hoje não existe macro M600. As macros abaixo ficam num arquivo próprio (`macros.cfg`) incluído pelo printer.cfg; não mexem na MCU nem na build validada.
- `PREAQUECE_BICO`: o start G-code faz `M104 S170` enquanto a mesa aquece. Se o bico já está quente (ex.: 225 °C depois de um teste), isso o derruba para 170 e o `M109` espera reaquecer; o usuário removeu a linha à mão duas vezes em 2026-10-18. A macro só pré-aquece se o alvo atual estiver abaixo do valor pedido.

## Fluxo com as macros
1. A impressão chega no `M600` (G-code custom na camada, ou `SET_PAUSE_AT_LAYER LAYER=<n> MACRO=M600` no console).
2. O `M600`:
   - guarda o idle_timeout atual e põe 1800 s;
   - roda o `PAUSE` do mainsail.cfg, que salva posição e estado, retrai 1 mm e estaciona em X0 Y220, ≥10 mm acima da peça;
   - descarrega 50 mm (ponta: +10 mm, depois −50 mm);
   - abre a janela "Troca de filamento".
3. Tirar o filamento, colocar o novo até o extrusor pegar e clicar **Carregar e purgar** (`CARREGA_TROCA`): vai a X0 Y0, empurra e purga 50 mm, retrai 1 mm, espera 2 s e volta a X0 Y220.
4. Na janela seguinte: **Purgar mais** (`CARREGA_TROCA L=20`) ou **Retomar** (`RETOMA_TROCA`).
5. O `RETOMA_TROCA` fecha a janela, anda em XY até em cima do ponto da pausa (ainda alto), desce na vertical e roda o `RESUME`. O `RESUME` desfaz a retração de 1 mm no próprio ponto e restaura o idle_timeout; o movimento de volta dele fica nulo, porque o bico já está na posição salva.

Movimento em Z (sem risco de bater na peça):
- ida (`PAUSE`): sobe o Z primeiro, depois anda em XY;
- purga (`CARREGA_TROCA`): anda só em XY, na altura de estacionamento;
- volta (`RETOMA_TROCA`): XY no alto, depois desce na vertical. Não usar o `RESUME` direto nesta troca: ele volta em diagonal, descendo enquanto anda, e chega rente ao topo da peça.

## Instalação (feita em 2026-10-18; registro para reinstalar)
1. Máquina (Machine) → lista de arquivos de config (onde estão `printer.cfg` e `mainsail.cfg`) → upload do `macros.cfg` (feito em 2026-10-18; fonte atual: `printers/frank-pro/klipper/macros.cfg`).
2. Abrir o `printer.cfg` e, logo abaixo de `[include mainsail.cfg]`, acrescentar a linha `[include macros.cfg]`.
3. "Salvar e reiniciar". Isso reinicia o Klipper: fazer só sem impressão rodando.
4. Avisar o agente, que confere por GET se as macros carregaram e então:
   - troca no start G-code do preset `Frank Pro 0.4 nozzle Speed` (repo e Orca) o `M104 S170` por `PREAQUECE_BICO S=170` (FEITO em 2026-10-18, conferido num fatiamento). Sem a macro, o Klipper para a impressão com comando desconhecido;
   - atualiza os snapshots em `printers/frank-pro/klipper/` (incluindo `macros.cfg`) e o projeto web.

## Arquivo `macros.cfg`
Instalado na impressora; o snapshot fica em `printers/frank-pro/klipper/macros.cfg` (conferido idêntico ao enviado). Contém `PREAQUECE_BICO`, `M600`, `CARREGA_TROCA`, `RETOMA_TROCA`, `CENTRO` e `CANTO`. Mudanças futuras: o usuário edita no Mainsail e o snapshot é atualizado com `--param cfg --file macros.cfg`.

## Como inserir a troca na impressão
- **Pelo console, sem editar o G-code** (preferido): com a impressão rodando, `SET_PAUSE_AT_LAYER LAYER=<n> MACRO=M600`, onde n é a primeira camada da cor nova, como no preview do Orca. Funciona porque a impressora Speed emite `SET_PRINT_STATS_INFO CURRENT_LAYER=<n>` antes de subir para a camada n. É uma troca por comando; repita depois de cada troca.
- **G-code custom**: inserir `M600` na linha seguinte a `SET_PRINT_STATS_INFO CURRENT_LAYER=<n>`. Pelo Orca: "Add custom G-code" na camada. Pelo terminal:
  ```sh
  sed -i '/^SET_PRINT_STATS_INFO CURRENT_LAYER=<n>$/a M600' arquivo.gcode
  grep -n -A1 "CURRENT_LAYER=<n>$" arquivo.gcode   # conferir
  ```

## Riscos e limites
- **Coordenadas:**
  - Y alto = bico na parte de trás da mesa (bed-slinger: a mesa vem para a frente).
  - X0/Y0/Y220 são a borda da área de impressão. Se a peça ocupar um canto, mude `purge_*`/`park_*` antes.
  - Fora da área (X até −15, Y até 238) a mesa pode não estar embaixo; não confirmado.
- **Temperatura:** a pausa mantém o alvo do bico. Para outro material, `M109 S<nova>` antes de "Carregar e purgar". O PA e o fan continuam os do filamento fatiado.
- **Descarga:** 50 mm podem não tirar todo o filamento do Sprite; termine puxando com a alavanca pressionada.
- **Janela:** os botões dependem do suporte do Mainsail a `action:prompt_*`, que o RESUME do mainsail.cfg já usa. Se a janela não aparecer, rodar `CARREGA_TROCA` e `RETOMA_TROCA` pelo console.
- **idle_timeout:** o M600 põe 30 min. Passou disso, o Klipper desliga heaters e motores (M84), o home se perde e a impressão não retoma.
- **Testar sem impressão:** depois do "Salvar e reiniciar", `CENTRO`, `CANTO N=1` e um G-code curto de teste com `M600` no meio (não testar o M600 parado, porque o PAUSE fora de impressão não tem o que retomar).
- **PREAQUECE_BICO:** testar com `M104 S225`, depois `PREAQUECE_BICO S=170` (o alvo deve continuar 225) e com o bico em 0 (o alvo deve ir a 170).

## Fecha quando
- O usuário instalar e testar uma troca real. Registrar em `printers/frank-pro/README.md` (seção Klipper → macros), atualizar a regra "não existe M600" no AGENTS.md, nas instruções web e nos docs, e incluir `macros.cfg` no `frank-pro-klipper.cfg.txt` do projeto web (`DOCS` em `scripts/web-files.mjs`).

<!-- fonte: to-do/mesa-termistor.md -->
# Leitura errática do termistor da mesa (desarme do verify_heater)
- status: aberto; contornado, porque a mesa a 105 °C fica estável
- máquina: Frank Pro
- prioridade: alta (segurança térmica)
- atualizado: 2026-10-19

## Fatos
- 2026-10-17: duas impressões abortadas no aquecimento com `Heater heater_bed not heating at expected rate`
- leitura entre 95 e 97 °C com potência 100%: quedas de ~7 °C em 7 s e saltos de +3.8 a +6.2 °C em 1 s. Fisicamente impossível, então é falha de medição. Saltos menores já apareciam em sessões anteriores.
- o borne parafusado foi aberto: sem solda solta, tudo normal. Num aquecimento só da mesa depois disso, os saltos voltaram entre 95 e 97 °C, mas passou e ficou estável a 105 °C.
- impressão de 3h26m a 105 °C: estável (±0.02 °C), zero saltos acima de 1.5 °C/s
- 2026-10-19 (job 000069): aquecimento de 45 a 105 °C em ~4 min, amostrado a cada ~2 s, sem salto nem queda; 95→97 °C a ~0,2 °C/s, com potência de 100%. Defeito intermitente: um aquecimento limpo não fecha o item.
- 2026-10-19 ~16h: `MCU shutdown: ADC out of range` com alvo de 110 °C (= `max_temp`). Subida lisa até 110,0 °C (~0,2 °C/s, sem salto); é o limite de configuração, não este defeito.
- sensor: EPCOS 100K B57560G104F, no pino PC4

## Hipóteses
- principal: defeito do lado quente (solda do termistor na mesa, o próprio termistor ou o fio no trecho que flexiona com o Y), sensível à temperatura nessa faixa
- menos provável: conector na placa ou interferência

## Próximos passos
1. Mesa fria: medir a resistência do termistor (~100 kΩ a 25 °C) mexendo o cabo ao longo do curso do Y. Uma variação ao mexer indica fio ou solda.
2. Inspecionar a solda e o fio no termistor, embaixo da mesa.
3. Se confirmar, trocar o termistor (ou o chicote) pelo mesmo tipo e fazer o PID da mesa de novo (`PID_CALIBRATE HEATER=heater_bed TARGET=105`).
4. Para monitorar, `node scripts/frank-pro.mjs --host 192.168.0.150 --param temps --watch 1` durante o aquecimento.

## Riscos
- Leitura baixa faz a mesa ficar em potência máxima. O `verify_heater` é o que protege: NÃO aumentar a tolerância dele para "resolver" o desarme.

## Fecha quando
- A causa foi achada e corrigida, e um aquecimento de 25 a 105 °C passa sem salto acima de 1.5 °C/s.

<!-- fonte: to-do/orca-bundle-export.md -->
# Exportar de novo o bundle .orca_printer
- status: pendente (ação do usuário no GUI)
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- `printers/frank-pro/orca/Frank Pro 0.4 nozzle.orca_printer` é de 2026-10-05: não tem PETG XT nem os Speed
- só dá para regenerar pelo GUI do Orca (exportar o bundle da impressora), não pelo CLI

## Próximos passos
1. No Orca: exportar o bundle da impressora `Frank Pro 0.4 nozzle Speed`, com os filamentos e processos.
2. Salvar em `printers/frank-pro/orca/`, decidindo se substitui o antigo ou se fica com nome novo.
3. Atualizar a menção ao bundle no `README.md` da raiz.

## Fecha quando
- Bundle atualizado no repo, ou decidido que não é mais necessário (os JSON individuais já cobrem tudo).

<!-- fonte: to-do/petg-max-flowrate.md -->
# Medir o max flowrate do PETG XT e limitar a vazão no preset
- status: pendente
- máquina: Frank Pro
- prioridade: média
- atualizado: 2026-10-18

## Fatos
- `Creality Taurus PETG XT Speed`: 270 °C, PA 0.125, VALIDADO em qualidade
- `filament_max_volumetric_speed` 10 mm³/s, herdado e não medido
- vazão no ar a 270 °C: ~2% de perda a 10 mm³/s (F250). Acima disso não foi testado.
- os processos Speed puxam ~8 mm³/s (paredes internas e infill a 90 mm/s)

## Próximos passos
1. Rodar o teste de Max flowrate do Orca (menu Calibração) com o filamento PETG XT Speed a 270 °C.
2. Pegar a maior vazão sem falha de superfície.
3. Gravar `filament_max_volumetric_speed` = ~85% desse valor, só no `Creality Taurus PETG XT Speed`, no repo e no Orca.
4. `node scripts/web-files.mjs`.

## Fecha quando
- Valor medido registrado em `printers/frank-pro/calibracao.md` e aplicado no preset.

## Observação
- Com o bico CHT (`bico-cht.md`) o limite muda. Se o CHT chegar antes, medir direto com ele.

<!-- fonte: to-do/pi-fonte.md -->
# Fonte nova do Raspberry Pi: confirmar que acabaram a subtensão e as quedas do USB
- status: fonte comprada; instalação e teste pendentes
- máquina: Frank Pro (Raspberry Pi 3B)
- prioridade: alta
- atualizado: 2026-10-18

## Fatos
- o Mainsail mostra "Previously Under-Volted" (`throttled_state`)
- 2026-10-17 ~13h13 (BRT): `Got EOF when reading from device` / `Lost communication with MCU 'mcu'` no klippy.log. A porta USB da MCU caiu.
- o Pi 3B pede 5.1 V e 2.5 A
- modelo da fonte comprada: (preencher)

## Hipóteses
- A fonte atual do Pi derruba a tensão sob carga, e o USB da MCU (CH340) cai junto.

## Próximos passos
1. Instalar a fonte nova e anotar o modelo aqui.
2. Reiniciar o Pi. O `get_throttled` zera no boot.
3. Imprimir normalmente e conferir depois de cada impressão:
   - `node scripts/frank-pro.mjs --host 192.168.0.150 --param temps` (throttled deve continuar 0x0)
   - `curl -s http://192.168.0.150/server/files/logs/klippy.log | grep -E "Lost communication|Got EOF"`
4. Se o USB cair de novo com a tensão OK: suspeitar de cabo/porta USB e, só depois, da UART (ver `resources/utils/raspberry-pi3.md`, que exige recompilar a MCU).

## Riscos
- Alimentar o Pi pela fonte de 24 V da impressora (buck) corta o Pi junto quando a impressora desliga, e isso pode corromper o SD. Rodar `sudo shutdown -h now` antes.

## Fecha quando
- `throttled_state` em 0x0 e nenhum `Lost communication` depois de ~5 impressões ou ~20 h de uso.

<!-- fonte: to-do/pla-speed-validacao.md -->
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

<!-- fonte: to-do/speed-como-padrao.md -->
# Promover o perfil Speed a padrão da Frank Pro
- status: decisão pendente do usuário
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- 2026-10-16: o usuário definiu que, se a qualidade ficar boa, o Speed vira o padrão
- PETG XT Speed: VALIDADO. O suporte de celular saiu 20% mais rápido (3h26m × 4h18m) com cantos vivos.
- PLA Speed: falta a impressão real (`pla-speed-validacao.md`)
- ABS e TPU: sem Speed
- os presets originais (`Frank Pro 0.4 nozzle`, `0.20mm Standard @Taurus`, filamentos sem "Speed") não são editados; o Speed é override

## Opções
1. Usar o Speed como padrão de fato, material por material, conforme cada um for validado, e manter os originais como referência. Preferida: não exige mexer em nada.
2. Renomear (Speed → nome principal) depois que todos os materiais em uso forem validados. Isso exige atualizar repo, Orca e projeto web juntos.

## Fecha quando
- O usuário escolher a opção. Registrar a decisão em `printers/frank-pro/README.md`.

<!-- fonte: to-do/stray-kids-logo.md -->
# Logo Stray Kids em 3 cores
- status: modelo montado no Tinkercad; impressão pendente
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- pasta: `../projects/decoracao-brinquedos/stray-kids/`
- `stray-kids-letras_150mm_2mm.stl`: 150.01 × 133.09 × 2 mm, 5 peças; traços < 0.8 mm engrossados
- `stray-kids-K_150mm_2mm.stl`: só o K vermelho, 78.71 × 100.91 × 2 mm, no mesmo referencial das letras
- o Tinkercad recentraliza os imports: o K fica em X +30.23 mm e Y 0 em relação às letras
- cores: preto, branco e vermelho. O usuário montou no Tinkercad e não quis o disco de fundo gerado por script.

## Troca de cor no meio da impressão
Procedimento completo, com descarga e carga: `resources/utils/klipper.md`, seção "Troca de filamento". Resumo:
- sequência do usuário: `M104 S<temp nova>` → `PAUSE` → trocar o filamento → `RESUME`
- trocar em menos de 10 min, ou rodar `SET_IDLE_TIMEOUT TIMEOUT=1800` antes: o idle_timeout de 600 s desliga os heaters
- o RESUME não espera a temperatura (só espera se o idle_timeout tiver disparado). Rodar `M109 S<temp>` antes do RESUME.
- se os materiais forem diferentes, o perfil fatiado (fan, PA) continua valendo para as camadas seguintes
- alternativa: `SET_PAUSE_AT_LAYER LAYER=<n>`, ou o "pause" por camada no Orca, que a impressora Speed converte em `PAUSE`

## Fecha quando
- Peça impressa.

<!-- fonte: to-do/trilhos-lineares.md -->
# Trilhos lineares em XYZ
- status: decisão tomada: NÃO fazer agora; hipótese em aberto
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- na S1 Pro, não há ganho de qualidade comprovado com trilhos lineares
- o kit Tiny Machines não serve na S1
- os defeitos que apareceram até agora foram resolvidos com temperatura e PA, sem mexer na mecânica
- o usuário imprime por hobby; um upgrade caro só faz sentido se ele quiser o projeto em si

## Hipóteses
- Trilhos podem reduzir folga e manutenção das rodinhas, mas isso não foi medido nesta máquina.

## Reabrir quando
- O Input Shaper (`input-shaper-adxl.md`) ou uma impressão mostrar ringing/folga que regulagem das rodinhas e excêntricos não resolve.
- Ou o usuário decidir fazer como projeto. Aí pesquisar um kit específico para a S1/S1 Pro, com medidas e compatibilidade confirmadas.
