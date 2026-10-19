# Defaults do OrcaSlicer

Cópias dos perfis de sistema do OrcaSlicer usados pelos presets da Frank Pro. Servem de fonte para as seis bases unificadas e de referência. Não são enviados ao projeto web e nunca são editados à mão: só atualizados a partir da instalação.

## Conteúdo
- 15 originais da cadeia de herança das seis bases (com `inherits`, como estão na instalação).
- Referências auxiliares, fora da unificação: `Creality Ender-3 S1 Pro.json` (machine_model) e `Generic ABS/PETG/TPU/PCTG @System.json`. A base `fdm_filament_pctg`, que o PCTG @System referencia, não foi copiada; ela está na instalação em `system/OrcaFilamentLibrary/filament/base/fdm_filament_pctg.json`.

## Unificação
`node scripts/web-files.mjs` gera as bases em `web-ui-project/web-files/`. As bases geradas são as que os presets de `printers/frank-pro/orca/` citam em `inherits`. Regra:
1. Indexar os JSONs desta pasta pelo campo `name` (o `inherits` referencia o nome, não o arquivo). Nome duplicado é erro.
2. Seguir `inherits` recursivamente até o ancestral mais antigo. Ciclo ou ancestral ausente é erro.
3. Copiar os campos do ancestral e sobrepor os de cada descendente, até a base direta. Override é por chave inteira: arrays são substituídos, não mesclados.
4. Preservar valores e tipos JSON (strings numéricas, arrays, strings vazias, `nil`, percentuais, G-code).
5. Remover `inherits` do resultado. Salvar como `<name>.json`, com indentação de 2 espaços e quebra de linha final.

Não preencher campos ausentes com defaults presumidos do Orca: a unificação cobre só os valores explícitos destes arquivos.

| Base gerada | Cadeia, da mais antiga à mais específica |
|---|---|
| `Creality Generic PLA.json` | `fdm_filament_common` → `fdm_filament_pla` → `Creality Generic PLA` |
| `Creality Generic PETG.json` | `fdm_filament_common` → `fdm_filament_pet` → `Creality Generic PETG` |
| `Creality Generic ABS.json` | `fdm_filament_common` → `fdm_filament_abs` → `Creality Generic ABS` |
| `Creality Generic TPU.json` | `fdm_filament_common` → `fdm_filament_tpu` → `Creality Generic TPU` |
| `Creality Ender-3 S1 Pro 0.4 nozzle.json` | `fdm_machine_common` → `fdm_creality_common` → `Creality Ender-3 S1 Pro 0.4 nozzle` |
| `0.20mm Standard @Creality Ender3S1Pro.json` | `fdm_process_common` → `fdm_process_creality_common` → `0.20mm Standard @Creality Ender3S1Pro` |

Em 2026-10-18 a saída do script ficou idêntica, byte a byte, às bases geradas à mão em 2026-10-10.

## Fontes na instalação
Diretório de configuração: `$HOME/.config/OrcaSlicer`. Caminhos relativos a ele. Conferidos iguais em 2026-10-18.

| Arquivo desta pasta | Fonte |
|---|---|
| `Creality Generic PLA/PETG/ABS/TPU.json` | `system/Creality/filament/` |
| `fdm_filament_common/pla/pet/abs/tpu.json` | `system/OrcaFilamentLibrary/filament/base/` |
| `Creality Ender-3 S1 Pro 0.4 nozzle.json`, `fdm_creality_common.json`, `fdm_machine_common.json` | `system/Creality/machine/` |
| `0.20mm Standard @Creality Ender3S1Pro.json`, `fdm_process_creality_common.json`, `fdm_process_common.json` | `system/Creality/process/` |
| `Creality Ender-3 S1 Pro.json` | `system/Creality/machine/` |
| `Generic ABS/PETG/TPU/PCTG @System.json` | `system/OrcaFilamentLibrary/filament/` |

### Homônimos: preservar a origem
`system/Creality/filament/` também tem `fdm_filament_common/pla/pet/abs/tpu.json`, com o mesmo `name` e valores diferentes. Os desta pasta são os da `OrcaFilamentLibrary/filament/base/`. Buscar só pelo nome e pegar a primeira ocorrência muda temperaturas, cooling e fluxo. Há também `fdm_machine_common.json` e `fdm_process_common.json` em `system/Custom/`; os usados aqui são os de `system/Creality/`.

## Atualizar a partir da instalação
Fazer quando o Orca for atualizado.
1. Copiar os arquivos pelos caminhos exatos da tabela, preservando o JSON completo com `inherits`.
2. Conferir `name` e `inherits` de cada um. Se aparecer um ancestral novo, localizar a fonte certa (atenção aos homônimos) e incluir aqui.
3. `node scripts/web-files.mjs` e revisar o `git diff` das bases em `web-ui-project/web-files/`. Mudanças nas fontes podem mudar o resultado legitimamente; registrar as relevantes.
4. Os presets personalizados não mudam nesse processo. Eles vivem em `~/.config/OrcaSlicer/user/default/` e são copiados para `printers/frank-pro/orca/`.
