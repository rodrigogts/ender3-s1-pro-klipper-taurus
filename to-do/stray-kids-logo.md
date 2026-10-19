# Logo Stray Kids em 3 cores
- status: modelo montado no Tinkercad; impressão pendente
- máquina: Frank Pro
- prioridade: baixa
- atualizado: 2026-10-18

## Fatos
- pasta: `../projects/decoracao-brinquedos/stray-kids/`
- `stray-kids-letras_150mm_2mm.stl`: 150.01 × 133.09 × 2 mm, 5 peças; traços < 0.8 mm engrossados
- `stray-kids-K_150mm_2mm.stl`: só o K vermelho, 78.71 × 100.91 × 2 mm, no mesmo referencial das letras
- o Tinkercad recentraliza os imports: o K fica em X +30.23 mm e Y 0 em relação às letras
- cores: preto, branco e vermelho. O usuário montou no Tinkercad e não quis o disco de fundo gerado por script.

## Troca de cor no meio da impressão
Procedimento completo, com descarga e carga: `resources/utils/klipper.md`, seção "Troca de filamento". Resumo:
- sequência do usuário: `M104 S<temp nova>` → `PAUSE` → trocar o filamento → `RESUME`
- trocar em menos de 10 min, ou rodar `SET_IDLE_TIMEOUT TIMEOUT=1800` antes: o idle_timeout de 600 s desliga os heaters
- o RESUME não espera a temperatura (só espera se o idle_timeout tiver disparado). Rodar `M109 S<temp>` antes do RESUME.
- se os materiais forem diferentes, o perfil fatiado (fan, PA) continua valendo para as camadas seguintes
- alternativa: `SET_PAUSE_AT_LAYER LAYER=<n>`, ou o "pause" por camada no Orca, que a impressora Speed converte em `PAUSE`

## Fecha quando
- Peça impressa.
