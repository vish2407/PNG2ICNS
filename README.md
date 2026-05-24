# PNG → ICNS

A browser-based tool for converting PNG images into macOS `.icns` icon files — no server, no uploads, everything runs locally in the browser.

## Features

- Drag-and-drop or click-to-select PNG files
- Batch conversion (multiple files at once)
- Automatic squircle masking (82% canvas, macOS-style rounded corners)
- Centroid detection to center the artwork within the icon
- Generates all 11 required icon sizes (16px → 1024px)
- Downloads output directly to your browser's Downloads folder

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
├── utils.ts       — loadImage, downloadBlob, formatBytes
├── renderer.ts    — canvas rendering and bounds detection
├── converter.ts   — ICNS binary format assembly
├── ui.ts          — DOM interactions and event handlers
├── main.ts        — entry point
└── styles.css     — all styles
```

## How It Works

1. **Template composition** — loads the macOS squircle template and composites your image centered on top
2. **Aspect ratio preservation** — scales your image to 58.6% of the canvas while maintaining aspect ratio, ensuring safe padding around edges
3. **ICNS assembly** — generates all 11 required icon sizes and packs them into the binary ICNS container format with proper headers

## Icon Sizes Generated

| OSType | Size |
|--------|------|
| `icp4` | 16×16 |
| `ic11` | 32×32 @2x |
| `icp5` | 32×32 |
| `ic12` | 64×64 @2x |
| `icp6` | 64×64 |
| `ic07` | 128×128 |
| `ic13` | 256×256 @2x |
| `ic08` | 256×256 |
| `ic14` | 512×512 @2x |
| `ic09` | 512×512 |
| `ic10` | 1024×1024 |

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
- **Icon reverts:** Some apps store their icon in the code signature — custom icons may revert after updates
- **Permission denied:** Run as admin or check file permissions with `ls -la`

## License

MIT
