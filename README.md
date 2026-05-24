# Mac Icon Creator

A browser-based tool for creating custom macOS `.icns` icon files from your PNG artwork. Compose your image onto a professional squircle template, generate all 11 required icon sizes, and apply instantly to apps, folders, or files — entirely in the browser, no uploads or server needed.

## Features

- **Drag-and-drop or click-to-select** PNG files (multiple files at once)
- **Template-based composition** — your image is automatically centered and scaled on a macOS squircle background
- **Live preview** — see exactly how your icon will look before converting
- **Generates all 11 icon sizes** (16px → 1024px) required for macOS
- **One-click download** — ready-to-use `.icns` files saved directly to your Downloads folder
- **100% browser-based** — no uploads, no server, no tracking
- **IBM Carbon design** — clean, professional interface using IBM Plex fonts and Carbon color palette

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) 18+

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check and build for production → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript type-check only |

## Project Structure

```
src/
├── types.ts       — shared TypeScript interfaces
├── utils.ts       — image loading, download, formatting
├── renderer.ts    — canvas rendering with template composition
├── converter.ts   — ICNS binary format assembly
├── ui.ts          — DOM interactions and event handlers
├── main.ts        — entry point
└── styles.css     — IBM Carbon-inspired styles
```

## How It Works

1. **Template composition** — draws the macOS squircle background template at each target size
2. **Image scaling** — scales your artwork to 58.6% of the canvas (600px at 1024px size) with aspect ratio preserved, centered
3. **Live preview** — renders a 256px composite so you see the result before converting
4. **ICNS assembly** — generates all 11 required icon sizes and packs into binary ICNS format with proper headers

## Icon Sizes Generated

| OSType | Size | Use case |
|--------|------|----------|
| `icp4` | 16×16 | System icons, menus |
| `ic11` | 32×32 @2x | Retina 16×16 |
| `icp5` | 32×32 | Desktop, folders |
| `ic12` | 64×64 @2x | Retina 32×32 |
| `icp6` | 64×64 | Preferences, utilities |
| `ic07` | 128×128 | Cover Flow |
| `ic13` | 256×256 @2x | Retina 128×128 |
| `ic08` | 256×256 | Finder, Spotlight |
| `ic14` | 512×512 @2x | Retina 256×256 |
| `ic09` | 512×512 | App Store, Launchpad |
| `ic10` | 1024×1024 | macOS Big Sur+ native size |

## How to Apply an Icon in macOS

Once you've generated your `.icns` file, here's how to apply it to apps, folders, or files:

### Apply to an Application

1. **Get the `.icns` file** from your Downloads folder (e.g., `MyApp.icns`)
2. **Find the app** you want to customize (in Applications folder or wherever it's stored)
3. **Right-click the app** and select **Get Info** (or press `Cmd + I`)
4. **Drag and drop** the `.icns` file onto the icon in the top-left corner of the Info window
5. **Close the window** — the change applies instantly

Alternatively, using Terminal:
```bash
cp ~/Downloads/MyIcon.icns /Applications/MyApp.app/Contents/Resources/AppIcon.icns
```

### Apply to a Folder

1. **Select the folder** you want to customize
2. **Right-click** and select **Get Info**
3. **Drag and drop** your `.icns` file onto the folder icon in the top-left corner
4. **Close the window**

### Apply to Any File

1. **Right-click the file** and select **Get Info**
2. **Click on the file's icon** in the top-left corner (it will be highlighted)
3. **Paste your custom icon** (`Cmd + V`) after copying it from the `.icns` file:
   - Open the `.icns` file with Preview
   - Select all (`Cmd + A`) and copy (`Cmd + C`)
   - Go back to the Get Info window and paste (`Cmd + V`)

### Revert to Default Icon

1. **Right-click the file/folder/app** and select **Get Info**
2. **Click on the icon** in the top-left corner
3. **Press Delete** to remove the custom icon
4. **Close the window** — the system default icon returns

### Troubleshooting

- **Icon doesn't change:** Try logging out and back in, or restart Finder with `killall Finder`
- **Icon reverts:** Some apps store their icon in code signature — custom icons may revert after updates. Use `codesign --remove-signature /Applications/MyApp.app` (at your own risk)
- **Permission denied:** Right-click → Open With → Get Info, or check file permissions with `ls -la`

## Tech Stack

- **Build**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Design**: [IBM Carbon](https://www.carbondesignsystem.com/) colors & [IBM Plex](https://www.ibm.com/plex) fonts
- **Canvas**: Native HTML5 Canvas API for image composition

## License

MIT
