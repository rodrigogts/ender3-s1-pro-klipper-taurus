# Exportar de novo o bundle .orca_printer
- status: pendente (ação do usuário no GUI)
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- `printers/frank-pro/orca/Frank Pro 0.4 nozzle.orca_printer` é de 2026-10-05: não tem PETG XT nem os Speed
- só dá para regenerar pelo GUI do Orca (exportar o bundle da impressora), não pelo CLI

## Próximos passos
1. No Orca: exportar o bundle da impressora `Frank Pro 0.4 nozzle Speed`, com os filamentos e processos.
2. Salvar em `printers/frank-pro/orca/`, decidindo se substitui o antigo ou se fica com nome novo.
3. Atualizar a menção ao bundle no `README.md` da raiz.

## Fecha quando
- Bundle atualizado no repo, ou decidido que não é mais necessário (os JSON individuais já cobrem tudo).
