import { notificarUsuario } from './notificacion.js';
import { Traducir } from './traductor.js';
import { traducciones } from './i18n.js';

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

/* ========== 3. Idioma ========== */
function selectorIdioma() {
  const selector = document.getElementById('selectorIdioma');
  if (!selector) return;

  // Cargar el idioma guardado al iniciar
  const idiomaGuardado = localStorage.getItem('idioma') || 'es';
  selector.value = idiomaGuardado;
  Traducir(idiomaGuardado);

  selector.addEventListener('change', () => {
  const idioma = selector.value;
  localStorage.setItem('idioma', idioma);
  Traducir(idioma);
  notificarUsuario(`Idioma cambiado a: ${idioma === 'es' ? 'Español' : 'English'}`);

  // Regenerar las preguntas del test
  const contenedorPreguntas = document.getElementById('preguntasTest');
  if (contenedorPreguntas) {
    contenedorPreguntas.innerHTML = '';
    const preguntas = traducciones[idioma].test.preguntas;
    preguntas.forEach((texto, index) => {
      const num = index + 1;
      const grupo = document.createElement('div');
      grupo.classList.add('mb-3');

      const opciones = Array.from({ length: 5 }, (_, i) => {
        const valor = i + 1;
        return `
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="pregunta${num}" id="p${num}_${valor}" value="${valor}" required>
            <label class="form-check-label" for="p${num}_${valor}">${valor}</label>
          </div>
        `;
      }).join('');

      grupo.innerHTML = `
        <label class="form-label"><strong>${num}.</strong> ${texto}</label><br/>
        ${opciones}
      `;
      contenedorPreguntas.appendChild(grupo);
    });
  }
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


