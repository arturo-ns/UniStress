import { traducciones } from './i18n.js';

export function Traducir(idioma) {
  const elementos = document.querySelectorAll('[data-i18n]');

  elementos.forEach(el => {
    const clave = el.getAttribute('data-i18n'); // ej. "sidebar.perfil"
    const partes = clave.split('.');            // ["sidebar", "perfil"]

    let valor = traducciones[idioma];

    for (const parte of partes) {
      if (valor && typeof valor === 'object' && parte in valor) {
        valor = valor[parte];
      } else {
        valor = null;
        break;
      }
    }

    if (valor) {
      el.textContent = valor;
    }
  });
}
