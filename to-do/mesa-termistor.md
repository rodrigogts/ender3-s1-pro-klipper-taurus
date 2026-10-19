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
