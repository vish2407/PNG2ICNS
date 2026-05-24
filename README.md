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

1. **Bounds detection** — scans the PNG pixel-by-pixel to find the tight bounding box of non-transparent content
2. **Squircle render** — crops the image to its centroid, applies a rounded-rect clip at 82% of the target canvas size, and composites it onto a transparent background
3. **ICNS assembly** — writes the binary ICNS container format with the correct 4-byte type codes and big-endian chunk lengths for each size

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

## License

MIT
