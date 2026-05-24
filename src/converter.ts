import type { IconSpec, ProgressCallback } from './types';
import { renderSize } from './renderer';

export const ICON_SPECS: IconSpec[] = [
  { type: 'icp4', size: 16   },
  { type: 'ic11', size: 32   },
  { type: 'icp5', size: 32   },
  { type: 'ic12', size: 64   },
  { type: 'icp6', size: 64   },
  { type: 'ic07', size: 128  },
  { type: 'ic13', size: 256  },
  { type: 'ic08', size: 256  },
  { type: 'ic14', size: 512  },
  { type: 'ic09', size: 512  },
  { type: 'ic10', size: 1024 },
];

const ICNS_MAGIC = [0x69, 0x63, 0x6e, 0x73]; // 'icns'

export async function buildICNS(
  img: HTMLImageElement,
  templateImg: HTMLImageElement,
  onProgress: ProgressCallback,
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < ICON_SPECS.length; i++) {
    const { type, size } = ICON_SPECS[i]!;
    onProgress(i + 1, ICON_SPECS.length);

    const blob = await renderSize(img, templateImg, size);
    const png  = new Uint8Array(await blob.arrayBuffer());
    const chunkLen = 8 + png.length;
    const chunk = new Uint8Array(chunkLen);

    for (let j = 0; j < 4; j++) chunk[j] = type.charCodeAt(j);
    chunk[4] = (chunkLen >> 24) & 0xff;
    chunk[5] = (chunkLen >> 16) & 0xff;
    chunk[6] = (chunkLen >> 8)  & 0xff;
    chunk[7] =  chunkLen        & 0xff;
    chunk.set(png, 8);
    chunks.push(chunk);
  }

  const bodyLen = chunks.reduce((sum, c) => sum + c.length, 0);
  const fileLen = 8 + bodyLen;
  const file = new Uint8Array(fileLen);

  ICNS_MAGIC.forEach((b, i) => { file[i] = b; });
  file[4] = (fileLen >> 24) & 0xff;
  file[5] = (fileLen >> 16) & 0xff;
  file[6] = (fileLen >> 8)  & 0xff;
  file[7] =  fileLen        & 0xff;

  let offset = 8;
  for (const chunk of chunks) {
    file.set(chunk, offset);
    offset += chunk.length;
  }

  return file;
}
