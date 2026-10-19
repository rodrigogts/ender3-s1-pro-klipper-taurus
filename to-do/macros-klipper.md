# Macros: troca de filamento estilo Marlin (M600), posicionamento do bico e pré-aquecimento
- status: proposta; o usuário aplica no Mainsail
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

## Instalação (o usuário, no Mainsail, com a impressora parada)
1. Máquina (Machine) → pasta de config → criar o arquivo `macros.cfg` e colar o bloco abaixo inteiro.
2. Abrir o `printer.cfg` e, logo abaixo de `[include mainsail.cfg]`, acrescentar a linha `[include macros.cfg]`.
3. "Salvar e reiniciar". Isso reinicia o Klipper: fazer só sem impressão rodando.
4. Avisar o agente, que confere por GET se as macros carregaram e então:
   - troca no start G-code do preset `Frank Pro 0.4 nozzle Speed` (repo e Orca) o `M104 S170` por `PREAQUECE_BICO S=170`. Só depois da instalação: sem a macro, o Klipper para a impressão com comando desconhecido;
   - atualiza os snapshots em `printers/frank-pro/klipper/` (incluindo `macros.cfg`) e o projeto web.

## Arquivo `macros.cfg`
```ini
# Macros da Frank Pro. Incluido pelo printer.cfg com [include macros.cfg].

# ---------- Pre-aquecimento ----------
# Usado no start G-code no lugar de M104 S170: nao derruba um bico que ja esta mais quente.
[gcode_macro PREAQUECE_BICO]
description: Pre-aquece o bico so se o alvo atual for menor que S (padrao 170)
gcode:
  {% set alvo = params.S|default(170)|float %}
  {% if printer.extruder.target < alvo %}
    M104 S{alvo}
  {% endif %}

# ---------- Troca de filamento estilo Marlin ----------
# Canto superior esquerdo (X min., Y max.) = estacionar; inferior esquerdo = purgar.
# Coordenadas na borda da area de 220 x 220; ajuste aqui se a purga cair em cima da peca.
[gcode_macro M600]
description: Troca de filamento: pausa, estaciona no canto sup. esquerdo e descarrega
variable_park_x: 0
variable_park_y: 220
variable_purge_x: 0
variable_purge_y: 0
variable_lift: 10          ; mm acima da posicao atual (minimo 20 mm de altura absoluta)
variable_unload: 50        ; mm de descarga; UNLOAD=0 pula
variable_pos_x: 0          ; posicao da pausa, gravada pelo M600 para o RETOMA_TROCA
variable_pos_y: 0
variable_pos_z: 0
gcode:
  {% if printer.pause_resume.is_paused %}
    {action_raise_error("M600: impressao ja esta pausada")}
  {% endif %}
  {% set z = [printer.gcode_move.gcode_position.z + lift, 20]|max %}
  {% set unload_mm = params.UNLOAD|default(unload)|float %}
  {% set pos = printer.gcode_move.gcode_position %}
  SET_GCODE_VARIABLE MACRO=M600 VARIABLE=pos_x VALUE={pos.x}
  SET_GCODE_VARIABLE MACRO=M600 VARIABLE=pos_y VALUE={pos.y}
  SET_GCODE_VARIABLE MACRO=M600 VARIABLE=pos_z VALUE={pos.z}
  # PAUSE do mainsail.cfg restaura este valor no RESUME
  SET_GCODE_VARIABLE MACRO=RESUME VARIABLE=restore_idle_timeout VALUE={printer.configfile.settings.idle_timeout.timeout}
  SET_IDLE_TIMEOUT TIMEOUT=1800
  PAUSE X={park_x} Y={park_y} Z_MIN={z}
  {% if unload_mm > 0 and printer.extruder.can_extrude %}
    SAVE_GCODE_STATE NAME=m600_unload
    M83
    G1 E10 F300
    G1 E-{unload_mm} F1800
    RESTORE_GCODE_STATE NAME=m600_unload
  {% endif %}
  RESPOND TYPE=command MSG="action:prompt_begin Troca de filamento"
  RESPOND TYPE=command MSG="action:prompt_text Tire o filamento (alavanca do Sprite), coloque o novo ate o extrusor puxar e confirme."
  RESPOND TYPE=command MSG="action:prompt_footer_button Carregar e purgar|CARREGA_TROCA|primary"
  RESPOND TYPE=command MSG="action:prompt_show"

[gcode_macro CARREGA_TROCA]
description: Troca de filamento: purga no canto inf. esquerdo e volta a estacionar (L=mm, padrao 50)
gcode:
  {% set m = printer["gcode_macro M600"] %}
  RESPOND TYPE=command MSG="action:prompt_end"
  {% if not printer.pause_resume.is_paused %}
    {action_raise_error("CARREGA_TROCA: so durante a pausa do M600")}
  {% endif %}
  {% if not printer.extruder.can_extrude %}
    {action_raise_error("CARREGA_TROCA: bico frio; aqueca com M109 e rode de novo")}
  {% endif %}
  SAVE_GCODE_STATE NAME=m600_load
  G90
  G1 X{m.purge_x} Y{m.purge_y} F6000
  M83
  G1 E{params.L|default(50)|float} F180
  G1 E-1 F2100               ; o RESUME desfaz 1 mm
  G4 P2000
  G1 X{m.park_x} Y{m.park_y} F6000
  RESTORE_GCODE_STATE NAME=m600_load
  RESPOND TYPE=command MSG="action:prompt_begin Troca de filamento"
  RESPOND TYPE=command MSG="action:prompt_text Purga feita. Limpe o bico com pinca e retome, ou purgue mais."
  RESPOND TYPE=command MSG="action:prompt_button Purgar mais 20 mm|CARREGA_TROCA L=20|secondary"
  RESPOND TYPE=command MSG="action:prompt_footer_button Retomar|RETOMA_TROCA|primary"
  RESPOND TYPE=command MSG="action:prompt_show"

[gcode_macro RETOMA_TROCA]
description: Troca de filamento: volta como o Marlin (XY alto, desce na vertical) e retoma
gcode:
  {% set m = printer["gcode_macro M600"] %}
  RESPOND TYPE=command MSG="action:prompt_end"
  {% if not printer.pause_resume.is_paused %}
    {action_raise_error("RETOMA_TROCA: nao ha pausa do M600 para retomar")}
  {% endif %}
  G90
  G1 X{m.pos_x} Y{m.pos_y} F6000   ; XY primeiro, ainda na altura de estacionamento
  G1 Z{m.pos_z} F600               ; desce na vertical ate o ponto da pausa
  RESUME                           ; desfaz 1 mm no proprio ponto e continua (ja esta na posicao salva)

# ---------- Posicionamento ----------
[gcode_macro CENTRO]
description: Bico no centro da mesa, 5 mm acima
gcode:
  {% if "xyz" not in printer.toolhead.homed_axes %}
    G28
  {% endif %}
  G90
  G1 Z5 F600
  G1 X110 Y110 F6000

[gcode_macro CANTO]
description: Bico sobre o parafuso N (1 frente-esq, 2 frente-dir, 3 tras-dir, 4 tras-esq), 5 mm acima
gcode:
  {% set pts = [[20, 29], [195, 29], [195, 198], [20, 198]] %}
  {% set n = params.N|default(1)|int %}
  {% if n < 1 or n > 4 %}
    {action_raise_error("CANTO: use N=1, 2, 3 ou 4")}
  {% endif %}
  {% if "xyz" not in printer.toolhead.homed_axes %}
    G28
  {% endif %}
  G90
  G1 Z5 F600
  G1 X{pts[n-1][0]} Y{pts[n-1][1]} F6000
```

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
