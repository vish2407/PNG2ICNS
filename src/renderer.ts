// User artwork fills 600/1024 of the canvas at the largest size, scaled proportionally
const USER_FILL = 600 / 1024;

export function renderSize(
  userImg: HTMLImageElement,
  templateImg: HTMLImageElement,
  canvasSize: number,
): Promise<Blob> {
  const fc = document.createElement('canvas');
  fc.width = fc.height = canvasSize;
  const ctx = fc.getContext('2d')!;

  // Layer 1: template background stretched to fill
  ctx.drawImage(templateImg, 0, 0, canvasSize, canvasSize);

  // Layer 2: user image scaled to fit within USER_FILL box, centered
  const maxDim = Math.round(canvasSize * USER_FILL);
  const scale  = Math.min(maxDim / userImg.width, maxDim / userImg.height);
  const w = Math.round(userImg.width  * scale);
  const h = Math.round(userImg.height * scale);
  const x = Math.round((canvasSize - w) / 2);
  const y = Math.round((canvasSize - h) / 2);
  ctx.drawImage(userImg, x, y, w, h);

  return new Promise<Blob>((resolve, reject) => {
    fc.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob returned null'));
    }, 'image/png');
  });
}
