# Macros: troca de filamento estilo Marlin (M600), posicionamento do bico e pré-aquecimento
- status: M600 VALIDADO em 2026-10-18; falta só conferir dois detalhes (abaixo)

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
- correção pronta em `to-do/macros-v2-PARA-INSTALAR.cfg` (v2, só ASCII, diferença mínima para o snapshot): `ret_espera` 2 mm depois da purga (o mesmo do `PAUSE_PARK_RETRACT_LENGTH` padrão do Marlin; 3 mm foi descartado por cautela com plástico derretido subindo para a zona fria durante a espera); no `RETOMA_TROCA`, já no ponto, devolve `ret_espera − 1 − ret_slicer` (0.2 mm) antes do `RESUME`. Com o `RESUME` (+1) e o `G1 E.8` do G-code, a conta fecha em zero. Instalar sem impressão rodando: upload por cima do `macros.cfg` e Salvar e reiniciar; depois atualizar o snapshot e apagar `to-do/macros-v2-PARA-INSTALAR.cfg`. Atenção: `printers/frank-pro/klipper/macros.cfg` é o snapshot do que já está na impressora (v1); colar ele não muda nada (aconteceu em 2026-10-19 00:54).
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
