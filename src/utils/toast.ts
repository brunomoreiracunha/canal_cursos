type ToastType = 'success' | 'error' | 'info' | 'warning';

export function showToast(message: string, type: ToastType = 'info') {
  // Verifica se já existe um toast container
  let toastContainer = document.getElementById('toast-container');
  
  // Se não existir, cria um novo
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '1rem';
    toastContainer.style.right = '1rem';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  // Cria o elemento do toast
  const toast = document.createElement('div');
  toast.className = `p-4 mb-4 rounded shadow-lg transition-all duration-300 transform translate-x-full`;
  toast.style.minWidth = '300px';
  toast.style.maxWidth = '500px';

  // Define a cor de fundo baseada no tipo
  switch (type) {
    case 'success':
      toast.className += ' bg-green-500 text-white';
      break;
    case 'error':
      toast.className += ' bg-red-500 text-white';
      break;
    case 'warning':
      toast.className += ' bg-yellow-500 text-white';
      break;
    default:
      toast.className += ' bg-blue-500 text-white';
  }

  // Adiciona o conteúdo
  toast.textContent = message;

  // Adiciona ao container
  toastContainer.appendChild(toast);

  // Anima a entrada
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full');
  });

  // Remove após 3 segundos
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      toastContainer.removeChild(toast);
      // Remove o container se não houver mais toasts
      if (toastContainer.children.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }, 3000);
}
