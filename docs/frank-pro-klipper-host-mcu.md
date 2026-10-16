# Frank Pro — Klipper no host e na MCU

A Frank Pro roda versões **diferentes** do Klipper no Raspberry Pi (host) e na placa (MCU). Essa diferença é **intencional e validada**. Não recomende atualizar a MCU só porque as versões divergem.

## Estado validado

| Componente | Versão | Lida em |
|---|---|---|
| Klipper host (Raspberry Pi 3, MainsailOS 3.0.0) | `v0.13.0-786-g461c4e372` | 2026-10-16, via Moonraker |
| Klipper MCU (STM32F401RCT6) | `v0.11.0-0-ge02b725` | 2026-10-16, via Moonraker |
| Toolchain da MCU | GNU Arm Embedded Toolchain 10.3-2021.10 (GCC 10.3.1) | `mcu_build_versions` |

Parâmetros da build da MCU: STM32F401, bootloader de 64 KiB, cristal de 8 MHz, USART1 em PA10/PA9 a 250000, aplicação em `0x08010000`.

## Por que a MCU fica na v0.11.0

O bootloader da Creality não aceitou o Klipper compilado com toolchain moderna. A solução validada foi a v0.11.0 compilada com GCC 10.3.1. Só mexa nessa base com motivo concreto e teste controlado.

## Aviso esperado do Klipper

Com esse par de versões, o Klipper registra em `configfile.warnings`:

```text
deprecated_mcu_code: MCU 'mcu' has deprecated code (it is missing feature 'STEPPER_STEP_BOTH_EDGE').
Recompiling and flashing is recommended (MCU version 'v0.11.0-0-ge02b725', host version 'v0.13.0-...').
```

Enquanto a MCU estiver na build validada, esse aviso é **esperado**. Ele não indica falha e não exige ação.

## Quando a diferença deixa de ser esperada

Estes casos são problemas reais e devem ser investigados:

- versão da MCU diferente de `v0.11.0-0-ge02b725`, ou toolchain diferente de GCC 10.3.1;
- Klipper fora do estado `ready` (`shutdown`, `error`, falha de protocolo ou de comunicação com a MCU);
- qualquer aviso diferente de `deprecated_mcu_code`, ou `deprecated_mcu_code` com uma MCU que não seja a validada;
- erros de comunicação no `klippy.log` (timeout, `Lost communication with MCU`).

## Uso no script

`scripts/frank-pro.mjs` usa estes valores como referência da build validada:

- `--param versoes` identifica a divergência como esperada quando a MCU é a validada;
- `--param avisos` separa o `deprecated_mcu_code` esperado dos avisos reais, sem escondê-lo.

Se a build da MCU mudar depois de um teste controlado, atualize este documento e a constante `MCU_VALIDADA` do script juntos.
