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
  recomendacionesPersonalizadas
} from './emociones.js';

// Comunidad
import {
  fraseMotivacional,
  desafioDiario,
  mensajesAnonimos
} from './comunidad.js';

// Recursos psicoeducativos
import { recursosPsicoeducativos } from './recursos.js';

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