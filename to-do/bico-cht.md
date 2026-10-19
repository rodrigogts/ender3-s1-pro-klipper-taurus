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
