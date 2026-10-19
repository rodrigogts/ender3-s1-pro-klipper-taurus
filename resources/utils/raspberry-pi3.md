# Raspberry Pi 3 da Frank Pro — comandos úteis

## Identificação (Moonraker, 2026-10-18)
- modelo: Raspberry Pi 3 Model B Rev 1.2, 4 núcleos aarch64, ~856 MB de RAM
- sistema: MainsailOS 3.0.0 (Debian 13 trixie), kernel 6.12.75+rpt-rpi-v8
- SD: SanDisk SB16G de 16 GB, fabricado em 05/2019
- rede: 192.168.0.150 (`mainsailos.local`); Mainsail em http://192.168.0.150
- serviços: klipper e moonraker ativos; crowsnest `failed`, provavelmente porque não há câmera (não verificado); sonar inativo
- MCU no USB: CH340 (`1a86`), `/dev/serial/by-id/usb-1a86_USB_Serial-if00-port0`

## Acesso
```sh
ssh <usuario>@192.168.0.150
```
O usuário é o que foi definido na gravação do SD.

## Saúde da alimentação
```sh
vcgencmd get_throttled      # 0x0 = nunca teve problema desde o boot
vcgencmd measure_volts core
vcgencmd measure_temp
dmesg -T | grep -iE "voltage|usb .*disconnect|ch341|ttyUSB"
```
Pela rede, sem SSH: `node scripts/frank-pro.mjs --host 192.168.0.150 --param temps`.

Bits do `get_throttled`:

| Bit | Valor | Significado |
|---|---|---|
| 0 | 0x1 | subtensão agora |
| 1 | 0x2 | frequência do ARM limitada agora |
| 2 | 0x4 | throttling agora |
| 3 | 0x8 | limite de temperatura agora |
| 16 | 0x10000 | já teve subtensão desde o boot |
| 17 | 0x20000 | já teve limite de frequência |
| 18 | 0x40000 | já teve throttling |
| 19 | 0x80000 | já atingiu o limite de temperatura |

Exemplo: `0x50000` = já teve subtensão e throttling, mas agora está normal. O Mainsail mostra isso como "Previously Under-Volted".

- O Pi 3B pede 5,1 V e 2,5 A (fonte oficial). Abaixo de ~4,63 V ele acusa subtensão.
- Subtensão pode derrubar o USB da MCU. Foi o que aconteceu em 2026-10-17 (`Lost communication with MCU`). Ver `to-do/pi-fonte.md`.

## USB e MCU
```sh
ls -l /dev/serial/by-id/
lsusb                                   # procurar 1a86:7523 (CH340)
dmesg -T | tail -50                     # logo depois de uma queda
```

## Serviços e logs
```sh
sudo systemctl status klipper moonraker
sudo systemctl restart klipper          # equivale a reiniciar o host do Klipper
sudo systemctl restart moonraker
journalctl -u klipper -n 100 --no-pager
ls ~/printer_data/logs/                 # klippy.log, moonraker.log
ls ~/printer_data/config/               # printer.cfg, mainsail.cfg, backups printer-AAAAMMDD_HHMMSS.cfg
timedatectl                             # o klippy.log de 2026-10-17 estava ~4 h à frente do horário de Brasília
sudo timedatectl set-timezone America/Sao_Paulo   # opcional: logs no horário local
```

## Disco
```sh
df -h /
du -sh ~/printer_data/gcodes ~/printer_data/logs
```
SD cheio corrompe o banco do Moonraker e os logs. Apague G-codes antigos pelo Mainsail.

## Desligar
```sh
sudo shutdown -h now
```
Espere o LED verde parar de piscar antes de cortar a energia. Cortar a energia com o sistema rodando pode corromper o SD. Isso vale principalmente se o Pi passar a ser alimentado pela fonte da impressora.

## UART em vez de USB (alternativa, não aplicada)
- Placa: USART2 PA3/PA2 no conector do LCD. Pino 3 é TX, pino 4 é RX, pino 9 é GND. O pino 10 (VCC) não vai no Pi.
- Pi: GPIO14 (TX) e GPIO15 (RX), cruzando TX↔RX, com GND comum.
- Pi 3: o UART bom (PL011) fica com o Bluetooth. Em `/boot/firmware/config.txt`, use `enable_uart=1` e `dtoverlay=disable-bt`, desligue o console serial no `raspi-config` e use `/dev/ttyAMA0`.
- Exige recompilar a MCU com USART2, o que sai da build validada (v0.11.0, GCC 10.3.1, USART1). Só vale se o USB continuar caindo com fonte boa.
