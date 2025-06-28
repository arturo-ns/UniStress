/* ========== Manejo de secciones ========== */
export function cambioSeccion() {
  const botones = document.querySelectorAll('.btn-seccion');
  const secciones = document.querySelectorAll('.seccionDashboard');
  const claveStorage = 'ultimaSeccionActiva';// nombre clave en el localstorage 

  if (!botones.length || !secciones.length) return;

  // oculta la anterior seccion y muestra la seccion selecionada
  const mostrarSeccion = (id) => {
    secciones.forEach(sec => sec.classList.add('d-none'));
    document.getElementById(id)?.classList.remove('d-none');

    botones.forEach(boton => {
      boton.classList.toggle('active', boton.getAttribute('data-seccion') === id);
    });

    localStorage.setItem(claveStorage, id); // Guarda la sección activa
  };

  // Agregar listeners(event listeners) a los botones
  botones.forEach(boton => {
    boton.addEventListener('click', e => {
      e.preventDefault();
      const id = boton.getAttribute('data-seccion');
      mostrarSeccion(id);
    });
  });

  // Mostrar la última sección visitada o la sección por defecto perfil
  const ultima = localStorage.getItem(claveStorage) || 'perfil';
  mostrarSeccion(ultima);
}
