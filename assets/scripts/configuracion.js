import { notificarUsuario } from './notificacion.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarConfiguracion();
});

function inicializarConfiguracion() {
  modoOscuro();
  colorAcento();
  selectorIdioma();
  notificaciones();
  eliminarCuenta();
}

/* ========== 1. Modo Claro/Oscuro ========== */
function modoOscuro() {
  const toggle = document.getElementById('toggleModoOscuro');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('modo-oscuro', toggle.checked);
  });
}

/* ========== 2. Color de acento ========== */
function colorAcento() {
  const selector = document.getElementById('selectorColorAcento');
  if (!selector) return;

  selector.addEventListener('change', () => {
    document.documentElement.style.setProperty('--bs-primary', selector.value);
  });
}

/* ========== 3. Idioma (visual temporal) ========== */
function selectorIdioma() {
  const selector = document.getElementById('selectorIdioma');
  if (!selector) return;

  selector.addEventListener('change', () => {
    const idioma = selector.value;
    notificarUsuario(`Idioma cambiado a: ${idioma === 'es' ? 'Español' : 'English'}`);
  });
}

/* ========== 4. Notificaciones ========== */
function notificaciones() {
  const toggle = document.getElementById('toggleNotificaciones');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    notificarUsuario(`Notificaciones ${toggle.checked ? 'activadas' : 'desactivadas'}`);
  });
}

/* ========== 5. Eliminar cuenta ========== */
function eliminarCuenta() {
  const btnEliminar = document.getElementById('btnEliminarCuenta');
  if (!btnEliminar) return;

  btnEliminar.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmarEliminarCuenta'));
    modal.show();

    const confirmarBtn = document.getElementById('confirmarEliminarCuenta');
    if (confirmarBtn) {
      confirmarBtn.addEventListener(
        'click',
        () => {
          notificarUsuario('Cuenta eliminada correctamente.');
          modal.hide();
          window.location.href = 'login.html';
        },
        { once: true }
      );
    }
  });
}
