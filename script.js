// ---------- Stiker yang bisa digeser ----------
const board = document.getElementById('board');
const stickers = board.querySelectorAll('.sticker');
let topLayer = 10;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function moveSticker(el, left, top) {
  const maxLeft = board.clientWidth - el.offsetWidth;
  const maxTop = board.clientHeight - el.offsetHeight;
  el.style.setProperty('--x', clamp(left, 0, maxLeft) + 'px');
  el.style.setProperty('--y', clamp(top, 0, maxTop) + 'px');
}

stickers.forEach((el) => {
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    el.style.zIndex = ++topLayer;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = el.offsetLeft;
    startTop = el.offsetTop;
  });

  el.addEventListener('pointermove', (e) => {
    if (!el.hasPointerCapture(e.pointerId)) return;
    moveSticker(el, startLeft + e.clientX - startX, startTop + e.clientY - startY);
  });

  const stopDrag = (e) => {
    el.classList.remove('is-dragging');
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };
  el.addEventListener('pointerup', stopDrag);
  el.addEventListener('pointercancel', stopDrag);

  // Akses keyboard: tombol panah menggeser stiker
  el.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 40 : 16;
    const moves = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    el.style.zIndex = ++topLayer;
    moveSticker(el, el.offsetLeft + move[0], el.offsetTop + move[1]);
  });
});

// ---------- Salin email ----------
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Cadangan untuk browser lama atau halaman tanpa HTTPS
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

document.querySelectorAll('[data-copy-email]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const email = btn.dataset.copyEmail;
    try {
      await copyText(email);
      showToast('Email tersalin: ' + email);
    } catch (err) {
      showToast('Gagal menyalin. Email: ' + email);
    }
  });
});

// ---------- Tahun di footer ----------
document.getElementById('year').textContent = new Date().getFullYear();
