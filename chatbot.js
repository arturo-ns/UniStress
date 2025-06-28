import { fadeIn, slideInBottom, popIn, parpadeo } from './animaciones.js';

export function chatbot() {
  const btnAbrir = document.getElementById('btnAbrirChatbot');
  const ventana = document.getElementById('chatbotVentana');
  const form = document.getElementById('formChatbot');
  const input = document.getElementById('inputChatbot');
  const historial = document.getElementById('chatbotHistorial');
  const cerrar = document.getElementById('cerrarChatbot');

  if (!btnAbrir || !ventana || !form || !input || !historial || !cerrar) return;

  /* ========== Animaciones iniciales del botón ========== */
  popIn(btnAbrir); // efecto de aparición
  setTimeout(() => parpadeo(btnAbrir, 1000, 2), 7000); // atención visual

  /* ========== Abrir y cerrar ventana del chatbot ========== */
  btnAbrir.addEventListener('click', () => {
    const abierto = ventana.classList.contains('mostrar');
    ventana.classList.toggle('mostrar', !abierto);
    if (!abierto) slideInBottom(ventana); // animación solo al abrir
  });

  cerrar.addEventListener('click', () => ventana.classList.remove('mostrar'));

  /* ========== Enviar mensaje ========== */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mensaje = input.value.trim();
    if (!mensaje) return;

    agregarMensaje(mensaje, 'usuario');
    input.value = '';
    responderChatbot(mensaje);
  });

  /* ========== Mostrar mensajes ========== */
  function agregarMensaje(texto, tipo = 'bot') {
    const div = document.createElement('div');
    div.className = `chatbot-mensaje ${tipo}`;
    div.textContent = texto;
    historial.appendChild(div);
    fadeIn(div, 600);
    historial.scrollTop = historial.scrollHeight;
  }

  /* ========== respuesta automática ========== */
  function responderChatbot(mensaje) {
    const respuesta = obtenerRespuesta(mensaje.toLowerCase());
    setTimeout(() => agregarMensaje(respuesta, 'bot'), 500);
  }

  function obtenerRespuesta(msg) {
    if (msg.includes('ansiedad')) return 'Respira hondo. ¿Quieres probar una técnica de relajación?';
    if (msg.includes('estres') || msg.includes('estrés')) return '¿Has intentado hacer una pausa o usar nuestros recursos?';
    if (msg.includes('hola') || msg.includes('buenas')) return '¡Hola! Estoy aquí para ti 😊';
    if (msg.includes('solo') || msg.includes('sola')) return 'No estás solo/a. Siempre puedes escribir aquí.';
    return 'Cuéntame más. Estoy aquí para escucharte.';
  }
}
