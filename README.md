# Frank Pro — Klipper e Taurus

Configurações do OrcaSlicer e referências técnicas da **Frank Pro**, uma Creality Ender-3 S1 Pro modificada com Klipper, extrusor Sprite Pro e cooling Taurus dual 5015.

O repositório reúne presets de impressora, filamentos e processo, rotinas de G-code e documentação para consultar e adaptar essas configurações.

## Conteúdo

| Arquivo ou grupo | Finalidade |
|---|---|
| `Frank Pro 0.4 nozzle.json` | Preset personalizado da impressora com flavor Klipper e rotinas de G-code |
| `Creality Taurus PLA/PETG/ABS/TPU.json` | Presets personalizados dos quatro materiais, em arquivos separados |
| `Creality Taurus PETG XT.json` | Preset personalizado do Tritan HT da 3D Fila, herdando da base PETG |
| `0.20mm Standard @Taurus.json` | Preset personalizado de processo |
| `Creality Generic *.json` | Bases diretas dos filamentos Taurus |
| `Creality Ender-3 S1 Pro 0.4 nozzle.json` | Base direta do preset Frank Pro |
| `0.20mm Standard @Creality Ender3S1Pro.json` | Base direta do processo Taurus |
| `Creality Ender-3 S1 Pro.json` | Identificação do modelo de impressora |
| `Generic * @System.json` | Referências auxiliares de materiais |
| `Frank Pro 0.4 nozzle.orca_printer` | Bundle de exportação do OrcaSlicer |
| `start-n-end-gcode.gcode` | Referência legível das rotinas de início, encerramento e pausa |
| `fontes-internas-projeto-impressao-3d.md` | Guia dos arquivos, heranças e precedência dos valores |
| `inherits/` | Originais das bases e instruções para reproduzir sua unificação |
| `AGENTS.md` | Instruções para o agente de desenvolvimento local e contexto técnico do projeto |

## Como consultar e adaptar

Comece pelo [guia de fontes e configurações](fontes-internas-projeto-impressao-3d.md). Ele explica quais arquivos consultar para cada parâmetro e como interpretar os valores.

Os presets Taurus e Frank Pro herdam de suas bases pelo campo `inherits`. As seis bases diretas na raiz contêm seus valores herdados reunidos. Para determinar uma configuração, procure primeiro no personalizado e, se a chave estiver omitida, consulte a base correspondente. O valor explícito do personalizado prevalece.

Os arquivos originais usados nessa composição estão em `inherits/`. O [README dessa pasta](inherits/README.md) documenta os caminhos das fontes na instalação local do OrcaSlicer, o procedimento de atualização e a unificação das bases.

Para utilizar como referência em um projeto do GPT, selecione os arquivos da raiz destinados à consulta e use as instruções próprias do seu projeto. A resolução dos sete presets personalizados pode ser feita com os respectivos arquivos-base da raiz.

## Aplicação em outras impressoras

Estas configurações representam uma máquina modificada. Ao adaptar, confira volume e limites de movimento, extrusor, retração, aquecimento, cooling, macros e rotinas de G-code da sua impressora. Ajustes de filamento e calibrações devem ser verificados na máquina e no material utilizados.

## Uso e permissões

O conteúdo autoral deste repositório é disponibilizado sob a **CC0 1.0 Universal**, na medida permitida por lei. Consulte o [texto oficial em inglês](LICENSE) e a [tradução não oficial para português brasileiro](LICENSE.pt-BR.md).

Você pode usar, copiar, modificar, redistribuir e utilizar comercialmente o conteúdo autoral deste repositório, sem restrições e sem obrigação de atribuição. Pode adaptar os arquivos para sua impressora e publicar suas próprias versões.

Os presets de terceiros incluídos como referência mantêm as licenças e os direitos de seus respectivos autores. A permissão acima se aplica ao conteúdo que o autor deste repositório tem direito de licenciar.

O conteúdo é fornecido como está, sem garantia.
