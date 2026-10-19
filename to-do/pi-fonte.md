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
