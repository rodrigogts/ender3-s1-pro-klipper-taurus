# to-do

Um arquivo por ação em andamento, pendente ou ainda sem decisão. Cada arquivo traz status, fatos, hipóteses, próximos passos e o critério de fechamento.

Regras:
- Ação fechada: o resultado vai para o doc da máquina (`printers/<máquina>/README.md` ou `calibracao.md`) e o arquivo daqui é apagado. O histórico fica no git.
- Fato novo: atualizar o campo `atualizado` e o status.
- Status possíveis: em andamento, pendente, pedido/comprado, aberto, decisão pendente, decisão tomada, ideia.

| Arquivo | Máquina | Status | Prioridade | Resumo |
|---|---|---|---|---|
| [exclude-object.md](exclude-object.md) | Frank Pro | configurado; falta o teste | alta | `[exclude_object]` no Klipper e nos dois processos do Orca, para cancelar só a peça que falhou. Falta testar a exclusão numa impressão |
| [mesa-termistor.md](mesa-termistor.md) | Frank Pro | aberto | alta | Termistor da mesa com leitura errática entre 95 e 97 °C que desarmou o verify_heater duas vezes. Suspeita no lado quente; medir ~100 kΩ mexendo o cabo |
| [pi-fonte.md](pi-fonte.md) | Frank Pro | comprada, teste pendente | alta | Fonte nova do Pi: confirmar que somem o "Previously Under-Volted" e a queda do USB da MCU |
| [pla-speed-validacao.md](pla-speed-validacao.md) | Frank Pro | pausado | média | Calombos no overhang do casco do Benchy em PLA Speed (Z 5–10). O casco oco reproduz em ~12 min; o teste com PA 0.025 está pronto (G-code editado) e não foi impresso. Peças sem overhang daquele tipo imprimem bem |
| [petg-max-flowrate.md](petg-max-flowrate.md) | Frank Pro | pendente | média | Max flowrate do PETG XT a 270 °C e limite de ~85% no `filament_max_volumetric_speed` |
| [bico-cht.md](bico-cht.md) | Frank Pro | pedido, em trânsito | média | Bico CHT 0.4 latão + CuCrZr para mais vazão; depois de instalar, refazer z_offset, vazão e PA |
| [input-shaper-adxl.md](input-shaper-adxl.md) | Frank Pro | pendente | média | ADXL345 + Input Shaper medido na própria máquina antes de subir acelerações |
| [frank-mini-diagnostico.md](frank-mini-diagnostico.md) | Frank Mini | pendente | média | Mesa que aquece sem comando (MOSFET?) e encoder que não gira o menu |
| [abs-calibracao.md](abs-calibracao.md) | Frank Pro | pendente | baixa | Criar o ABS Speed e calibrar temperatura, vazão e PA do ABS |
| [speed-como-padrao.md](speed-como-padrao.md) | Frank Pro | decisão pendente | baixa | Tornar o Speed o perfil padrão: por material, conforme for validado, ou renomear tudo no fim |
| [trilhos-lineares.md](trilhos-lineares.md) | Frank Pro | decisão tomada: não agora | baixa | Trilhos lineares XYZ: sem ganho comprovado na S1 Pro; reabrir só com evidência de folga ou ringing |
| [stray-kids-logo.md](stray-kids-logo.md) | Frank Pro | impressão pendente | baixa | Logo em 3 cores montado no Tinkercad; procedimento de troca de cor com PAUSE |
| [orca-bundle-export.md](orca-bundle-export.md) | Frank Pro | pendente | baixa | Reexportar o `.orca_printer` (o atual é de 2026-10-05, sem os Speed) |
| [armazenamento-filamento.md](armazenamento-filamento.md) | geral | sacos a caminho; sílica em teste | baixa | 20 sacos a vácuo PA+PE 32 × 34 cm (chegam até 24/10; os atuais perdem vácuo) e sílica laranja regenerável (testando 65 °C no secador; o usual é ~100–120 °C) |
| [cli-fatiamento-helper.md](cli-fatiamento-helper.md) | Frank Pro | ideia | baixa | Script para fatiar pelo CLI do Orca (torres, comparações) com as correções já conhecidas |

Ordem sugerida na Frank Pro: exclude-object (pedido do usuário; rápido) → mesa-termistor e pi-fonte (confiabilidade) → pla-speed-validacao → petg-max-flowrate → bico-cht → input-shaper-adxl. O bico CHT, quando chegar, vem antes do max flowrate, porque o limite muda com ele.
