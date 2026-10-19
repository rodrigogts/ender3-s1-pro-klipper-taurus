; ============================================================
; FRANK PRO - KLIPPER START G-CODE
; Ender-3 S1 Pro + Taurus dual 5015
; ============================================================

; ===
; START
; ===

G90
M82
M106 S0

; HOME INICIAL
G28
G1 Z10 F3000
G1 X5 Y5 F5000

; AQUECIMENTO
M140 S[bed_temperature_initial_layer_single]
M104 S170
M190 S[bed_temperature_initial_layer_single]
M109 S[nozzle_temperature_initial_layer]

; PURGE ANTES DO HOME FINAL
G92 E0
M83
G1 E6 F180
G1 E-1.5 F2100
M82
G92 E0

; HOME FINAL COM A MÁQUINA QUENTE
G28

; CARREGA A MESH SALVA NO KLIPPER
BED_MESH_PROFILE LOAD=default

; LINHAS DE PURGA
G1 Z10 F3000
G1 X5 Y20 F5000
G1 Z0.20 F300

M83
G1 E1.5 F1200
M82
G92 E0

G1 X5 Y200 E7 F1200
G1 X5.8 Y200 F5000
G1 X5.8 Y20 E14 F1200

G92 E0
G1 Z2.0 F3000

; ===
; END
; ===

G91
M83
G1 E-2 F2700
G1 E-2 Z0.2 F2400
G1 X5 Y5 F3000
G1 Z10 F3000
G90

G1 X0 Y220 F3000

M106 S0
M104 S0
M140 S0

M84 X Y E

; ===
; BEFORE LAYER CHANGE
; ===

;BEFORE_LAYER_CHANGE
;[layer_z]
G92 E0

; ===
; CHANGE FILAMENT
; ===

PAUSE

; ===
; PAUSE
; ===

PAUSE