# Fontes internas — Projeto Impressão 3D — Frank Pro

## 1. Finalidade

Este documento orienta a consulta aos arquivos de configuração da Frank Pro, plataforma modificada com Klipper, Mainsail e Taurus dual 5015.

O conjunto de impressão é formado por três presets selecionados no Orca Slicer: impressora, filamento e processo. Cada preset personalizado contém seus ajustes específicos e referencia uma base pelo campo `inherits`. As seis bases diretas estão na raiz e contêm os valores necessários para resolver essas heranças.

Usar os arquivos para identificar o valor configurado, sua origem e o preset em que uma eventual alteração deve ser feita. Consultar as instruções do projeto para o estado validado das máquinas, calibrações e decisões técnicas.

## 2. Mapa dos presets e suas bases

| Categoria | Preset personalizado | Base direta |
|---|---|---|
| Filamento PLA | `Creality Taurus PLA.json` | `Creality Generic PLA.json` |
| Filamento PETG | `Creality Taurus PETG.json` | `Creality Generic PETG.json` |
| Filamento ABS | `Creality Taurus ABS.json` | `Creality Generic ABS.json` |
| Filamento TPU | `Creality Taurus TPU.json` | `Creality Generic TPU.json` |
| Impressora | `Frank Pro 0.4 nozzle.json` | `Creality Ender-3 S1 Pro 0.4 nozzle.json` |
| Processo | `0.20mm Standard @Taurus.json` | `0.20mm Standard @Creality Ender3S1Pro.json` |

A referência de herança usa o campo `name` da base. Exemplo:

```json
{
  "name": "Creality Taurus PLA",
  "inherits": "Creality Generic PLA"
}
```

Para resolver essa referência, consultar `Creality Generic PLA.json` e conferir seu campo `name`. O relacionamento é entre nomes de perfis; o nome do arquivo serve para localizar a fonte correspondente.

## 3. Como ler os valores e a herança

### 3.1. Precedência dentro de um preset

1. Identificar o preset personalizado da categoria investigada.
2. Procurar a chave exata nesse arquivo.
3. Se a chave estiver definida no personalizado, esse é o valor que prevalece.
4. Se a chave estiver ausente, consultar a base indicada por `inherits`.
5. Registrar o valor resultante e o arquivo que o fornece.

As bases diretas da tabela são autossuficientes para os campos que documentam. A consulta dos seis personalizados segue um único vínculo: personalizado → base direta.

A resolução acontece por chave inteira. Um array definido no personalizado substitui o array da base; seus elementos não são concatenados. Manter strings, arrays, condições, expressões e G-code exatamente como estão armazenados.

### 3.2. Exemplos dos arquivos

| Consulta | Valor na base | Valor no personalizado | Resultado e origem |
|---|---|---|---|
| PLA: `nozzle_temperature` | `["220"]` | `["210"]` | `["210"]`, de `Creality Taurus PLA.json` |
| PLA: `filament_flow_ratio` | `["0.98"]` | Campo omitido | `["0.98"]`, de `Creality Generic PLA.json` |
| Processo: `bridge_speed` | `"25"` | `"15"` | `"15"`, de `0.20mm Standard @Taurus.json` |
| Processo: `layer_height` | `"0.2"` | Campo omitido | `"0.2"`, de `0.20mm Standard @Creality Ender3S1Pro.json` |

Esses exemplos demonstram a precedência dos arquivos. Para uma consulta concreta, ler o conteúdo correspondente à revisão em análise.

### 3.3. Interpretação dos campos

- **Campo definido:** aplicar o valor explícito conforme a semântica do parâmetro.
- **Campo omitido:** procurar na base referenciada.
- **Strings numéricas:** preservar a representação JSON; interpretar unidade e significado conforme o parâmetro.
- **Arrays:** preservar a posição dos elementos, especialmente em configurações associadas a extrusores.
- **`"0"` e `"1"`:** interpretar como número ou opção booleana conforme a chave.
- **`nil` e valores vazios:** interpretar conforme a regra específica do campo, especialmente em overrides.
- **Percentuais e expressões:** manter sua relação com a referência definida pelo Orca.
- **G-code:** ler quebras de linha, comandos e placeholders como parte da rotina.

Quando a consulta depender de um default ou fallback do Orca, verificar a documentação ou implementação da versão utilizada.

### 3.4. Relação entre impressora, filamento e processo

Resolver primeiro a herança de cada categoria separadamente. Depois considerar os overrides entre categorias previstos pelo Orca.

Por exemplo, a impressora define a retração padrão, enquanto campos de retração do filamento podem fornecer overrides específicos para o material. A aplicação depende do campo e de sua condição de ativação.

Ao apresentar uma configuração, identificar:

- O conjunto selecionado de impressora, filamento e processo.
- A chave e seu valor resultante.
- O arquivo responsável pelo valor.
- A condição de aplicação, quando houver override ou expressão.

## 4. Filamentos

| Arquivo personalizado | Uso | Base para consulta dos demais valores |
|---|---|---|
| `Creality Taurus PLA.json` | Ajustes específicos de PLA para a Frank Pro | `Creality Generic PLA.json` |
| `Creality Taurus PETG.json` | Ajustes específicos de PETG para a Frank Pro | `Creality Generic PETG.json` |
| `Creality Taurus ABS.json` | Ajustes específicos de ABS para a Frank Pro | `Creality Generic ABS.json` |
| `Creality Taurus TPU.json` | Ajustes específicos de TPU para a Frank Pro | `Creality Generic TPU.json` |

Consultar esses pares para temperaturas do bico e das superfícies de mesa, cooling, flow ratio, velocidade volumétrica máxima, retração, propriedades do material e demais campos de filamento.

Distinguir temperatura da primeira camada da temperatura das demais camadas. Para a mesa, identificar o campo correspondente à superfície selecionada no Orca.

Os percentuais de fan devem ser analisados considerando o Taurus dual 5015. Usar o estado validado nas instruções do projeto e os testes do material para distinguir configuração armazenada de calibração medida.

### Referências Generic @System

| Arquivo | Finalidade |
|---|---|
| `Generic ABS @System.json` | Consulta dos campos explícitos do preset genérico de ABS |
| `Generic PETG @System.json` | Consulta dos campos explícitos do preset genérico de PETG |
| `Generic TPU @System.json` | Consulta dos campos explícitos do preset genérico de TPU |
| `Generic PCTG @System.json` | Consulta dos campos explícitos do preset genérico de PCTG |

Esses arquivos são referências auxiliares para identificação, compatibilidade e comparação dos campos que apresentam. Para determinar os valores dos materiais Taurus, utilizar os pares personalizado/base da tabela principal.

## 5. Impressora

### `Frank Pro 0.4 nozzle.json`

Preset operacional personalizado da Frank Pro. Consultar primeiro para flavor de G-code, rotinas de início e encerramento, pausa, troca de filamento, identificação do extrusor e demais ajustes explícitos.

Os campos `machine_start_gcode`, `machine_end_gcode`, `machine_pause_gcode` e `change_filament_gcode` descrevem as rotinas configuradas nesse preset.

### `Creality Ender-3 S1 Pro 0.4 nozzle.json`

Base direta da Frank Pro. Consultar para parâmetros de máquina herdados pelo personalizado, como volume de impressão, diâmetro do bico, retração padrão, limites armazenados no slicer e demais configurações de geração de G-code.

Aplicar sempre os overrides de `Frank Pro 0.4 nozzle.json` sobre os campos dessa base.

### `Creality Ender-3 S1 Pro.json`

Referência do tipo `machine_model`. Identifica modelo, família, tecnologia, variante de bico, recursos visuais da mesa e materiais padrão associados.

Para parâmetros operacionais, consultar o par personalizado/base da impressora. Para o comportamento e os limites efetivamente validados na máquina, consultar o estado do projeto e as configurações do Klipper.

## 6. Processo

### `0.20mm Standard @Taurus.json`

Preset personalizado de processo. Contém ajustes explícitos de pontes, brim, preenchimento e identificação do extrusor, entre outros campos presentes no arquivo.

### `0.20mm Standard @Creality Ender3S1Pro.json`

Base direta de processo. Consultar para altura de camada, larguras de linha, paredes, topo/fundo, preenchimento, velocidades, acelerações, suportes, pontes, overhangs e adesão à mesa.

Aplicar os campos de `0.20mm Standard @Taurus.json` sobre essa base. Para avaliar qualidade, velocidade ou extrusão, considerar também o filamento e a impressora selecionados.

## 7. G-code e bundle

### `start-n-end-gcode.gcode`

Referência legível das rotinas personalizadas da Frank Pro:

| Seção | Finalidade |
|---|---|
| START | Preparação, modos de movimento/extrusão, homing, aquecimento, mesh e purga |
| END | Retração, afastamento, apresentação da peça e desligamentos |
| BEFORE LAYER CHANGE | Rotina entre camadas, incluindo `G92 E0` |
| CHANGE FILAMENT | Pausa por `PAUSE` |
| PAUSE | Pausa por `PAUSE` |

A rotina de início carrega a mesh com `BED_MESH_PROFILE LOAD=default`.

Para analisar uma rotina, consultar essa referência junto ao campo correspondente no preset de impressora ou processo. Em caso de divergência, confirmar a revisão selecionada no Orca.

### `Frank Pro 0.4 nozzle.orca_printer`

Bundle de exportação do Orca. Reúne configurações associadas à Frank Pro e serve para consultar a exportação, comparar presets e recuperar informações agrupadas.

Usar os arquivos individuais como referências específicas de cada preset e o bundle como fonte complementar. Comparar revisões quando os valores divergirem.

## 8. Roteiro de consulta e prioridade das fontes

| Pergunta | Consultar primeiro | Complemento |
|---|---|---|
| Temperatura, cooling, flow ou limite volumétrico | Taurus do material | Creality Generic correspondente |
| Retração | Frank Pro e Taurus do material | Base da impressora, base do material e regra de override |
| Volume, bico, flavor ou parâmetros de máquina | Frank Pro | Base operacional da impressora |
| Camadas, velocidades, paredes, infill ou suportes | Processo Taurus | Base de processo |
| Start, end, pausa ou troca de filamento | Campos do preset Frank Pro | `start-n-end-gcode.gcode` |
| Identificação e apresentação do modelo | `Creality Ender-3 S1 Pro.json` | Base operacional da impressora |
| Configurações agrupadas da exportação | Bundle `.orca_printer` | Presets individuais correspondentes |

Prioridade para interpretar os resultados:

1. Informação mais recente fornecida pelo usuário.
2. Medições e testes realizados na Frank Pro, com o contexto registrado nas instruções do projeto.
3. Preset personalizado correspondente e sua base direta, respeitando a precedência por campo.
4. Referência específica de G-code e bundle para comparação.
5. Documentação oficial e fontes técnicas confiáveis para semântica, defaults e comportamento do Orca.

Ao recomendar uma alteração, indicar o preset personalizado, a chave e o valor proposto. Preservar a distinção entre valor explícito, valor herdado e resultado de calibração na máquina.
