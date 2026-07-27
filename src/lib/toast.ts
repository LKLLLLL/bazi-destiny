export function showToast(message: string): void {
  document.querySelector('.toast-notification')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText =
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:rgba(11,13,23,0.96);' +
    'border:1px solid rgba(212,175,106,0.35);color:#ece7da;padding:13px 24px;border-radius:100px;' +
    'font-size:14px;z-index:9999;backdrop-filter:blur(10px);box-shadow:0 16px 40px -12px rgba(0,0,0,0.8);' +
    'animation:toastIn .3s ease forwards;font-family:Inter,sans-serif;';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 320);
  }, 3000);
}
