import { supabase } from './assets/scripts/utils.js';

// Usuario
import {
  cargarDatosUsuario,
  Termometro,
  manejarFotoPerfil,
  manejarEdicionPerfil,
  manejarCerrarSesion,
  iniciarTourIntroJS
} from './assets/scripts/usuario.js';

// Navegación y UI
import { cambioSeccion } from './assets/scripts/navigation.js';
import { notificaciones } from './assets/scripts/notificacion.js';
import { chatbot } from './assets/scripts/chatbot.js';

// Test psicológico
import { formularioTest } from './assets/scripts/test.js';

// Emociones
import {
  registroEmocional,
  graficoEmociones,
  recomendacionesPersonalizadas
} from './assets/scripts/emociones.js';

// Comunidad
import {
  fraseMotivacional,
  desafioDiario,
  mensajesAnonimos
} from './assets/scripts/comunidad.js';

// Recursos psicoeducativos
import { recursosPsicoeducativos } from './assets/scripts/recursos.js';

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
