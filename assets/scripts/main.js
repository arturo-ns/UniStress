import { supabase } from './utils.js';

// Usuario
import {
  cargarDatosUsuario,
  Termometro,
  manejarFotoPerfil,
  manejarEdicionPerfil,
  manejarCerrarSesion,
  iniciarTourIntroJS
} from './usuario.js';

// Navegación y UI
import { cambioSeccion } from './navigation.js';
import { notificaciones } from './notificacion.js';
import { chatbot } from './chatbot.js';

// Test psicológico
import { formularioTest } from './test.js';

// Emociones
import {
  registroEmocional,
  graficoEmociones,
  recomendacionesPersonalizadas,
  descargarHistorialEmociones
} from './emociones.js';

// Comunidad
import {
  fraseMotivacional,
  desafioDiario,
  mensajesAnonimos
} from './comunidad.js';

// Recursos psicoeducativos
import { recursosPsicoeducativos } from './recursos.js';

import {  } from './configuracion.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicialización general
  cargarDatosUsuario();
  cambioSeccion();

  // Perfil
  manejarFotoPerfil();
  manejarEdicionPerfil();
  manejarCerrarSesion();
  Termometro();

  // Test y emociones
  formularioTest();
  registroEmocional();
  graficoEmociones();
  descargarHistorialEmociones();
  recomendacionesPersonalizadas();

  // Recursos
  recursosPsicoeducativos();

  // Comunidad
  fraseMotivacional();
  desafioDiario();
  mensajesAnonimos();

  // extras
  notificaciones();
  chatbot();


   // Botón para mostrar/ocultar sidebar en móvil
  document.getElementById('toggleSidebarBtn')?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('toggleIcon');

    sidebar.classList.toggle('mostrar');
    icon.textContent = sidebar.classList.contains('mostrar') ? '×' : '☰';
  });

  document.querySelectorAll('#sidebar .btn-seccion').forEach(boton => {
  boton.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      document.getElementById('sidebar')?.classList.remove('mostrar');
      document.getElementById('toggleIcon').textContent = '☰';
    }
  });
  });

  // Tour interactivo (solo si no ha sido visto)
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;

  if (userId) {
    const { data: perfil } = await supabase
      .from('userProfile')
      .select('tutorial')
      .eq('userId', userId)
      .single();

    if (perfil?.tutorial === false) {
      iniciarTourIntroJS();
    }
  }
});
