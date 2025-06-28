import { supabase } from './utils.js';
import { notificarUsuario } from './notificacion.js';

/* ========== Test psicológico ========== */
export function formularioTest() {
  const form = document.getElementById('formTest');
  const resultado = document.getElementById('resultadoTest');
  const contenedorPreguntas = document.getElementById('preguntasTest');

  if (!form || !resultado || !contenedorPreguntas) return;

  const preguntas = [
    "Me siento abrumado por la cantidad de tareas académicas.",
    "Me cuesta concentrarme en mis estudios debido al estrés.",
    "Siento que no tengo suficiente tiempo para cumplir con mis obligaciones académicas.",
    "Me siento ansioso(a) antes de los exámenes o entregas.",
    "Tengo dificultades para dormir por preocupaciones académicas.",
    "Evito estudiar porque me siento saturado(a).",
    "Me siento frustrado(a) con mi rendimiento académico.",
    "He pensado en abandonar alguna materia por estrés.",
    "Siento que pierdo el control cuando tengo muchas tareas.",
    "Me siento agotado(a) emocionalmente por la universidad."
  ];

  generarPreguntas(contenedorPreguntas, preguntas);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const respuestas = obtenerRespuestas(form, preguntas.length);
    if (!respuestas) {
      notificarUsuario('Por favor responde todas las preguntas.');
      return;
    }

    const puntaje = respuestas.reduce((acc, val) => acc + val, 0);

    // Obtener usuario
    const { data: session, error: sessionError } = await supabase.auth.getUser();
    const userId = session?.user?.id;

    if (sessionError || !userId) {
      notificarUsuario('No estás autenticado. Inicia sesión.');
      return;
    }

    // fecha local del usuario y convertilo a UTC string
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset() * 60000;
    const hoyLocal = new Date(ahora.getTime() - offset);
    const hoyStr = hoyLocal.toISOString().split('T')[0];

    const desde = `${hoyStr}T00:00:00`;
    const hasta = `${hoyStr}T23:59:59`;

    // Verificar si ya hizo test hoy (según hora local)
    const { data: existente } = await supabase
      .from('test')
      .select('id')
      .eq('userId', userId)
      .gte('fecha', desde)
      .lte('fecha', hasta)
      .maybeSingle();

    if (existente) {
      form.reset();
      notificarUsuario('Ya realizaste el test hoy. Vuelve mañana.');
      return;
    }

    // Insertar el test a supabase
    const { error: insertError } = await supabase.from('test').insert([{
      puntaje,
      userId,
      fecha: new Date().toISOString()
    }]);

    if (insertError) {
      console.error('❌ Error al guardar el test:', insertError.message);
      notificarUsuario('Error al guardar el resultado del test.');
      return;
    }

    form.reset();
    mostrarResultado(resultado, puntaje);
  });
}

function generarPreguntas(contenedor, preguntas) {
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
    contenedor.appendChild(grupo);
  });
}

function obtenerRespuestas(formulario, totalPreguntas) {
  const seleccionadas = Array.from(formulario.querySelectorAll('input[type="radio"]:checked'));
  if (seleccionadas.length !== totalPreguntas) return null;
  return seleccionadas.map(input => parseInt(input.value));
}

function nivelEstres(puntaje) {
  if (puntaje <= 20) return 'Bajo estrés. ¡Muy bien!';
  if (puntaje <= 30) return 'Estrés moderado. Puedes manejarlo, pero no descuides tu bienestar.';
  if (puntaje <= 40) return 'Alto estrés. Es momento de aplicar estrategias de relajación.';
  return 'Estrés muy alto. Considera buscar apoyo emocional o profesional.';
}

function mostrarResultado(contenedor, puntaje) {
  const nivel = nivelEstres(puntaje);
  contenedor.innerHTML = `
    <div class="alert alert-info mt-4" id="mensajeTest">
      <h5 class="mb-2">Resultado del Test</h5>
      <p>Puntaje total: <strong>${puntaje}</strong> de 50</p>
      <p><em>${nivel}</em></p>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('mensajeTest')?.remove();
  }, 4000);
}
