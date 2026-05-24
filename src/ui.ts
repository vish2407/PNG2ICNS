import { buildICNS } from './converter';
import { renderSize } from './renderer';
import { loadImage, loadImageFromUrl, downloadBlob, formatBytes } from './utils';

const TEMPLATE_URL = '/icon_template1.png';
const PREVIEW_SIZE = 256;

function el<T extends HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`Element #${id} not found`);
  return e as T;
}

const dropZone     = el<HTMLDivElement>('drop-zone');
const fileInput    = el<HTMLInputElement>('file-input');
const previewWrap  = el<HTMLDivElement>('preview-wrap');
const previewThumb = el<HTMLImageElement>('preview-thumb');
const previewName  = el<HTMLDivElement>('preview-name');
const previewSize  = el<HTMLDivElement>('preview-size');
const clearBtn     = el<HTMLButtonElement>('clear-btn');
const convertBtn   = el<HTMLButtonElement>('convert-btn');
const progressWrap = el<HTMLDivElement>('progress-wrap');
const progressText = el<HTMLSpanElement>('progress-text');
const progressPct  = el<HTMLSpanElement>('progress-pct');
const progressFill = el<HTMLDivElement>('progress-fill');
const batchList    = el<HTMLDivElement>('batch-list');
const toast        = el<HTMLDivElement>('toast');

let pendingFiles: File[] = [];
let toastTimer: ReturnType<typeof setTimeout> | null = null;

// Cached template — loaded once on first use
let templateImgCache: HTMLImageElement | null = null;
async function getTemplate(): Promise<HTMLImageElement> {
  if (!templateImgCache) templateImgCache = await loadImageFromUrl(TEMPLATE_URL);
  return templateImgCache;
}

function setProgress(pct: number, label: string): void {
  progressFill.style.width = `${pct}%`;
  progressPct.textContent  = `${pct}%`;
  progressText.textContent = label || 'Processing…';
}

function showToast(type: 'success' | 'error', msg: string): void {
  toast.className = `toast ${type}`;
  el<HTMLSpanElement>('toast-msg').textContent = msg;
  toast.classList.add('show');
  if (toastTimer !== null) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function reset(): void {
  pendingFiles = [];
  previewWrap.classList.remove('visible');
  convertBtn.classList.remove('visible');
  progressWrap.classList.remove('visible');
  batchList.innerHTML = '';
  fileInput.value = '';
  previewThumb.src = '';
}

async function handleFiles(files: File[]): Promise<void> {
  pendingFiles = files;
  batchList.innerHTML = '';
  convertBtn.classList.add('visible');
  progressWrap.classList.remove('visible');
  setProgress(0, '');

  if (files.length === 1) {
    const f = files[0]!;
    previewName.textContent = f.name;
    previewSize.textContent = `${formatBytes(f.size)} · PNG`;
    previewWrap.classList.add('visible');

    // Show composite preview so the user sees how the icon will look
    try {
      const [userImg, template] = await Promise.all([loadImage(f), getTemplate()]);
      const blob = await renderSize(userImg, template, PREVIEW_SIZE);
      previewThumb.src = URL.createObjectURL(blob);
    } catch {
      previewThumb.src = URL.createObjectURL(f);
    }
  } else {
    previewWrap.classList.remove('visible');
    files.forEach((f, i) => {
      const item = document.createElement('div');
      item.className = 'batch-item';
      item.id = `batch-${i}`;
      item.innerHTML = `<span class="bi-status waiting" id="bs-${i}">○</span><span class="bi-name">${f.name}</span>`;
      batchList.appendChild(item);
    });
  }
}

async function runConversion(): Promise<void> {
  if (!pendingFiles.length) return;

  convertBtn.disabled = true;
  progressWrap.classList.add('visible');

  let template: HTMLImageElement;
  try {
    template = await getTemplate();
  } catch {
    showToast('error', '❌ Could not load icon template');
    convertBtn.disabled = false;
    return;
  }

  for (let i = 0; i < pendingFiles.length; i++) {
    const f = pendingFiles[i]!;
    const statusEl = document.getElementById(`bs-${i}`);
    if (statusEl) { statusEl.textContent = '◉'; statusEl.className = 'bi-status working'; }

    try {
      const img  = await loadImage(f);
      const icns = await buildICNS(img, template, (step, total) => {
        const overall = (i / pendingFiles.length) + (step / total / pendingFiles.length);
        setProgress(Math.round(overall * 100), `${f.name} · size ${step}/${total}`);
      });

      downloadBlob(icns, f.name.replace(/\.png$/i, '') + '.icns');
      if (statusEl) { statusEl.textContent = '✓'; statusEl.className = 'bi-status done'; }
    } catch {
      if (statusEl) { statusEl.textContent = '✕'; statusEl.className = 'bi-status error'; }
      showToast('error', `❌ Failed: ${f.name}`);
    }
  }

  setProgress(100, 'Done');
  showToast('success', `✓ Saved ${pendingFiles.length} icon${pendingFiles.length > 1 ? 's' : ''} to Downloads`);
  convertBtn.disabled = false;
}

export function initUI(): void {
  // Pre-warm template load
  void getTemplate();

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('hover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    const files = Array.from(e.dataTransfer?.files ?? []).filter(f => f.type === 'image/png');
    if (files.length) void handleFiles(files);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files?.length) void handleFiles(Array.from(fileInput.files));
  });
  clearBtn.addEventListener('click', reset);
  convertBtn.addEventListener('click', () => void runConversion());
}
