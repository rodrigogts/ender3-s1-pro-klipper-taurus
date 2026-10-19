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
