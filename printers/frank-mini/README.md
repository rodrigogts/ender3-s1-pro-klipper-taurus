# Frank Mini — estado da máquina

Creality Ender 3 Neo em diagnóstico/modernização.
Legenda: VALIDADO = observado na máquina; NÃO VALIDADO = falta medir; HIPÓTESE = suspeita sem prova.

## Origem
- comprada nova, ficou ~2 anos guardada e foi montada depois
- sem evidência atual de erro de montagem; chicotes aparentam originais; cola de fábrica em conectores/flat

## Arquitetura original
- Bowden
- CR Touch
- Z simples
- hotend diferente do Sprite Pro
- extrusor metálico ≠ hotend all-metal; não confundir

## VALIDADO
- liga
- display acende e mostra informações
- termistores exibem temperatura
- clique/seleção do encoder funciona
- giro do encoder não movimenta o menu
- remover o botão plástico e girar a haste não muda o sintoma
- mesa aquece sem comando
- mesa continua aquecendo com o display desconectado
- impressora desligada + Raspberry via USB: CR Touch pisca, compatível com backfeed de 5 V

## NÃO VALIDADO
- revisão exata da placa/microcontrolador
- tensão da saída BED com target 0
- estado do MOSFET/gate/trilhas
- causa do encoder
- necessidade de trocar a placa

## HIPÓTESES
- encoder: oxidação/sujeira, falha A/B, solda/trilha/cabo ou entrada da placa
- mesa: MOSFET/circuito de potência travado em condução (principal suspeita); não condenar a placa antes de medir

## Próximo diagnóstico
1. medir com multímetro a saída BED com target 0
2. se houver tensão indevida, seguir MOSFET/gate/trilhas
3. diagnosticar o encoder separadamente
4. não deixar o Raspberry no USB com a impressora desligada até tratar VBUS/backfeed

## Upgrades discutidos (NÃO instalados)
- placa defeituosa: considerar BTT SKR Mini E3 V3 + Raspberry + Klipper em vez de repor a 4.2.2
- dual Z viável; kit típico: segundo motor, fuso, acoplador, suporte/porca e cabo Y
- drivers Z independentes: avaliar `Z_TILT`; um driver: cabo Y
- PEI flexível é opção
- hotend/heatbreak/direct drive só se necessário
- mover só o hotend da Frank Pro/S1 Pro para a Neo não é plug-and-play; Sprite exige conjunto/adaptação compatível

## Filosofia
diagnosticar → reparar → validar stock funcional → melhorar só com ganho real
