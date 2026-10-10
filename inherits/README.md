# Originais das heranças do Orca

Esta pasta guarda os 15 JSONs originais usados para gerar as seis bases unificadas na raiz em 2026-10-10. Os arquivos daqui preservam a cadeia anterior ao merge.

A pasta é um arquivo histórico local. Para consultar os presets personalizados no projeto do GPT, enviar as bases unificadas e os personalizados da raiz; não é necessário enviar esta pasta.

## Mapeamento da unificação

A ordem de aplicação é da esquerda para a direita. Todos os arquivos de entrada abaixo são os originais desta pasta; o resultado é salvo na raiz com o mesmo nome da última entrada.

| Resultado na raiz | Entradas, da mais antiga à mais específica |
|---|---|
| `Creality Generic PLA.json` | `fdm_filament_common.json` → `fdm_filament_pla.json` → `Creality Generic PLA.json` |
| `Creality Generic PETG.json` | `fdm_filament_common.json` → `fdm_filament_pet.json` → `Creality Generic PETG.json` |
| `Creality Generic ABS.json` | `fdm_filament_common.json` → `fdm_filament_abs.json` → `Creality Generic ABS.json` |
| `Creality Generic TPU.json` | `fdm_filament_common.json` → `fdm_filament_tpu.json` → `Creality Generic TPU.json` |
| `Creality Ender-3 S1 Pro 0.4 nozzle.json` | `fdm_machine_common.json` → `fdm_creality_common.json` → `Creality Ender-3 S1 Pro 0.4 nozzle.json` |
| `0.20mm Standard @Creality Ender3S1Pro.json` | `fdm_process_common.json` → `fdm_process_creality_common.json` → `0.20mm Standard @Creality Ender3S1Pro.json` |

## Fontes locais no OrcaSlicer

Diretório de configuração verificado: `$HOME/.config/OrcaSlicer`, que nesta máquina corresponde a `/home/tavares/.config/OrcaSlicer`.

Os caminhos abaixo são relativos a esse diretório. Os arquivos foram localizados e seus campos `name` e `inherits` conferidos. As 15 fontes da primeira tabela têm conteúdo JSON equivalente aos originais desta pasta, incluindo os valores e tipos.

### Originais usados nas seis bases unificadas

| Arquivo em `inherits/` | Caminho da fonte no OrcaSlicer |
|---|---|
| `Creality Generic PLA.json` | `system/Creality/filament/Creality Generic PLA.json` |
| `Creality Generic PETG.json` | `system/Creality/filament/Creality Generic PETG.json` |
| `Creality Generic ABS.json` | `system/Creality/filament/Creality Generic ABS.json` |
| `Creality Generic TPU.json` | `system/Creality/filament/Creality Generic TPU.json` |
| `fdm_filament_common.json` | `system/OrcaFilamentLibrary/filament/base/fdm_filament_common.json` |
| `fdm_filament_pla.json` | `system/OrcaFilamentLibrary/filament/base/fdm_filament_pla.json` |
| `fdm_filament_pet.json` | `system/OrcaFilamentLibrary/filament/base/fdm_filament_pet.json` |
| `fdm_filament_abs.json` | `system/OrcaFilamentLibrary/filament/base/fdm_filament_abs.json` |
| `fdm_filament_tpu.json` | `system/OrcaFilamentLibrary/filament/base/fdm_filament_tpu.json` |
| `Creality Ender-3 S1 Pro 0.4 nozzle.json` | `system/Creality/machine/Creality Ender-3 S1 Pro 0.4 nozzle.json` |
| `fdm_creality_common.json` | `system/Creality/machine/fdm_creality_common.json` |
| `fdm_machine_common.json` | `system/Creality/machine/fdm_machine_common.json` |
| `0.20mm Standard @Creality Ender3S1Pro.json` | `system/Creality/process/0.20mm Standard @Creality Ender3S1Pro.json` |
| `fdm_process_creality_common.json` | `system/Creality/process/fdm_process_creality_common.json` |
| `fdm_process_common.json` | `system/Creality/process/fdm_process_common.json` |

### Perfis homônimos: preservar a origem

Também existem `fdm_filament_common.json`, `fdm_filament_pla.json`, `fdm_filament_pet.json`, `fdm_filament_abs.json` e `fdm_filament_tpu.json` em `system/Creality/filament/`. Seus nomes internos coincidem com os da biblioteca, mas seus valores diferem.

Os cinco originais deste projeto correspondem aos de `system/OrcaFilamentLibrary/filament/base/`. Para reproduzir ou atualizar a composição documentada, usar os caminhos da tabela. Buscar somente pelo nome e escolher a primeira ocorrência pode alterar temperaturas, cooling, fluxo e outros parâmetros.

Essa composição reúne bases diretas Creality com ancestrais de material da OrcaFilamentLibrary. Reproduzir o conjunto documentado e alinhar o conjunto aos ancestrais da pasta Creality são operações diferentes. Ao avaliar esse alinhamento, comparar os valores resolvidos das duas composições antes de alterar a origem das fontes.

Há também `fdm_machine_common.json` em `system/Custom/machine/` e `fdm_process_common.json` em `system/Custom/process/`. Para este conjunto, utilizar os caminhos Creality indicados na tabela.

### Presets personalizados

| Arquivo do projeto | Caminho da fonte no OrcaSlicer |
|---|---|
| `Creality Taurus PLA.json` | `user/default/filament/Creality Taurus PLA.json` |
| `Creality Taurus PETG.json` | `user/default/filament/Creality Taurus PETG.json` |
| `Creality Taurus ABS.json` | `user/default/filament/Creality Taurus ABS.json` |
| `Creality Taurus TPU.json` | `user/default/filament/Creality Taurus TPU.json` |
| `Frank Pro 0.4 nozzle.json` | `user/default/machine/Frank Pro 0.4 nozzle.json` |
| `0.20mm Standard @Taurus.json` | `user/default/process/0.20mm Standard @Taurus.json` |

Esses JSONs são as fontes para atualizar as cópias personalizadas da raiz quando essa atualização fizer parte da tarefa. A regeneração das bases, isoladamente, preserva os personalizados.

### Referências auxiliares

| Arquivo do projeto | Caminho da fonte no OrcaSlicer |
|---|---|
| `Creality Ender-3 S1 Pro.json` | `system/Creality/machine/Creality Ender-3 S1 Pro.json` |
| `Generic ABS @System.json` | `system/OrcaFilamentLibrary/filament/Generic ABS @System.json` |
| `Generic PETG @System.json` | `system/OrcaFilamentLibrary/filament/Generic PETG @System.json` |
| `Generic TPU @System.json` | `system/OrcaFilamentLibrary/filament/Generic TPU @System.json` |
| `Generic PCTG @System.json` | `system/OrcaFilamentLibrary/filament/Generic PCTG @System.json` |

A base de PCTG está disponível na instalação em `system/OrcaFilamentLibrary/filament/base/fdm_filament_pctg.json`.

O `.orca_printer` é uma exportação agrupada: para atualizá-lo, exportar o bundle pelo Orca. Para atualizar `start-n-end-gcode.gcode`, conferir as rotinas nos campos dos presets e nas seções correspondentes do Orca.

## Como atualizar a partir da instalação

1. Salvar os presets no Orca antes de ler as fontes. Preservar uma cópia da versão atual do conjunto para comparar a atualização.
2. Conferir os caminhos da tabela na instalação utilizada, o campo `name` de cada perfil e suas referências `inherits`.
3. Atualizar os 15 originais de `inherits/` a partir das fontes exatas da primeira tabela. Preservar os JSONs completos, ainda com suas heranças. Não usar as bases já unificadas da raiz como entradas.
4. Recalcular as seis bases da raiz conforme o procedimento abaixo. Caso uma atualização introduza outro ancestral, localizar a fonte correspondente à composição escolhida antes de continuar.
5. Comparar os valores resolvidos anteriores e novos. Alterações nas fontes podem mudar legitimamente o resultado; registrar e revisar essas diferenças. A equivalência exigida é entre o resultado gerado e a resolução das novas fontes.
6. Atualizar os personalizados e as referências auxiliares pelos caminhos próprios somente quando estiverem incluídos no escopo da atualização.
7. Executar as validações deste README e ajustar o documento de fontes se a estrutura ou os relacionamentos mudarem.

A atualização é feita da instalação para este projeto. As bases unificadas são os arquivos de consulta da raiz; o procedimento não grava sobre os perfis da instalação do OrcaSlicer.

## Como reproduzir

1. Ler os JSONs originais desta pasta e indexar os perfis pelo campo `name`. O campo `inherits` referencia o nome do perfil, não um caminho.
2. Para cada uma das seis bases diretas, seguir `inherits` recursivamente. Interromper em caso de ancestral ausente, nomes duplicados ou ciclo.
3. Copiar os campos do ancestral mais antigo. Sobrepor os campos do próximo descendente e repetir até a base direta.
4. Substituir cada campo inteiro quando houver override. Não concatenar arrays nem fazer merge dos elementos.
5. Preservar todos os valores e tipos JSON, inclusive strings numéricas, arrays, strings vazias, `nil`, zero, condições, percentuais e G-code.
6. Remover `inherits` do objeto final. Preservar a identificação da base direta, como `name`, `type`, `from`, `setting_id` e `instantiation`, conforme os valores resultantes dos originais.
7. Salvar na raiz com o nome original da base direta. Manter estes originais e os seis presets personalizados Taurus/Frank intactos.
8. Atualizar `../fontes-internas-projeto-impressao-3d.md` se a estrutura ou as fontes mudarem.

Pseudocódigo:

```text
resolver(nome, caminho):
    rejeitar nome repetido no caminho (ciclo)
    perfil = buscar pelo campo name; rejeitar se ausente
    resultado = resolver(perfil.inherits, caminho + nome), se houver pai
                ou objeto vazio, se não houver
    para cada chave e valor do perfil:
        resultado[chave] = valor
    remover resultado.inherits
    retornar resultado
```

## Validação obrigatória

- Comparar cada base unificada com a resolução da cadeia original, ignorando somente a referência `inherits` removida.
- Para cada personalizado, comparar a resolução antiga completa com base unificada + overrides do personalizado, também ignorando `inherits` no objeto de comparação.
- Confirmar que os personalizados não foram modificados e que os originais arquivados preservam o conteúdo anterior.
- Confirmar que as seis bases geradas não possuem `inherits`.
- Validar todos os JSONs.

Não preencher campos ausentes com defaults presumidos do Orca. A unificação cobre apenas valores explícitos dos arquivos fornecidos.

## Referências fora desta unificação

Os quatro `Generic *@System.json` e o `machine_model` permanecem na raiz sem alterações. ABS, PETG e TPU @System ainda referenciam os ancestrais desta pasta; não ficam autossuficientes no upload da raiz. A base `fdm_filament_pctg`, referenciada pelo PCTG @System, pode ser consultada no caminho da instalação indicado acima.

O bundle `.orca_printer` também permanece intacto e não é regenerado pelo procedimento.
