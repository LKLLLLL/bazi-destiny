export function showToast(message: string): void {
  document.querySelector('.toast-notification')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 320);
  }, 3000);
}
