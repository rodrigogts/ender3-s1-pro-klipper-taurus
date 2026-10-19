# Atalho do OrcaSlicer no desktop

Arquivo de integração com o desktop (GNOME/Ubuntu) que não pertence ao OrcaSlicer em si, mas
sem o qual o atalho do sistema não funciona direito.

## `com.orcaslicer.OrcaSlicer.desktop`

Atalho do OrcaSlicer (AppImage) para GNOME/Ubuntu.

### Onde copiar

```sh
install -Dm644 resources/desktop/com.orcaslicer.OrcaSlicer.desktop \
  "$HOME/.local/share/applications/com.orcaslicer.OrcaSlicer.desktop"
```

Ajuste o caminho do AppImage para o diretório deste usuário (o formato
`.desktop` **não** expande variáveis de ambiente em `Exec`/`TryExec`, então o
caminho tem de ficar absoluto no arquivo):

```sh
sed -i "s|/home/[^/]*/3d-print|$HOME/3d-print|g" \
  "$HOME/.local/share/applications/com.orcaslicer.OrcaSlicer.desktop"
```

Depois, atualize os caches e valide:

```sh
update-desktop-database "$HOME/.local/share/applications"
desktop-file-validate "$HOME/.local/share/applications/com.orcaslicer.OrcaSlicer.desktop"
```

### Ícone

O ícone é referenciado por nome (`Icon=com.orcaslicer.OrcaSlicer`) e tem de
existir no tema de ícones do usuário. O PNG vem dentro do próprio AppImage
(192x192):

```sh
install -Dm644 /tmp/.mount_OrcaSl*/OrcaSlicer.png \
  "$HOME/.local/share/icons/hicolor/192x192/apps/com.orcaslicer.OrcaSlicer.png"
gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor"
```

O `/tmp/.mount_OrcaSl*` só existe enquanto o AppImage está rodando; abra o
OrcaSlicer antes, ou extraia com `OrcaSlicer.AppImage --appimage-extract`.

### Por que `StartupWMClass`

```
StartupWMClass=orca-slicer
```

O GNOME casa a janela aberta com o lançador comparando o `WM_CLASS` da janela
com o nome do arquivo `.desktop`. Eles não batem:

| | valor |
|---|---|
| arquivo `.desktop` | `com.orcaslicer.OrcaSlicer` |
| `WM_CLASS` da janela | `"orca-slicer", "OrcaSlicer"` |

Sem `StartupWMClass`, o ícone aparece no menu (lido direto de `Icon=`), mas a
janela fica órfã no dock e no alt-tab, com ícone genérico. Para conferir o
`WM_CLASS` numa sessão X11:

```sh
xprop WM_CLASS   # e clique na janela do OrcaSlicer
```

**Atenção:** se o AppImage (ou o AppImageLauncher) reescrever o atalho ao
atualizar, essa linha se perde e o ícone volta a sumir. É só recopiar daqui.
