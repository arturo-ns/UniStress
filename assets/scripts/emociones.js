import { supabase } from './utils.js';
import { notificarUsuario } from './notificacion.js';

let graficoEmocionalInstance = null;
export function registroEmocional() {
  const form = document.getElementById('formRegistroEmocion');
  const notaInput = document.getElementById('notaEmocion');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const emocionSeleccionada = form.querySelector('input[name="emocion"]:checked');
    if (!emocionSeleccionada) {
      notificarUsuario('Por favor selecciona una emoción.');
      return;
    }

    const emocion = emocionSeleccionada.value;
    const comentario = notaInput.value.trim();

    // Obtener el usuario actual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user.id;

    if (sessionError || !userId) {
      notificarUsuario('No estás autenticado.');
      return;
    }

    // fecha local del usuario y convertilo a UTC string
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset() * 60000;
    const hoyLocal = new Date(ahora.getTime() - offset);
    const hoyStr = hoyLocal.toISOString().split('T')[0];

    const desde = `${hoyStr}T00:00:00`;
    const hasta = `${hoyStr}T23:59:59`;

    const { data: existentes, error } = await supabase
    .from('estadoEmocional')
    .select('id')
    .eq('userId', userId)
    .gte('created_at', desde)
    .lte('created_at', hasta);

    if (error) {
      console.error('❌ Error al verificar emoción existente:', error.message);
      return;
    }

    if (existentes.length > 0) {
      notificarUsuario('Ya registraste una emoción hoy.');
      return;
    }

    // Insertar nuevo registro
    const { error: insertError } = await supabase.from('estadoEmocional').insert([
      {
        userId,
        emocion,
        comentario
      }
    ]);

    if (insertError) {
      console.error('❌ Error al registrar emoción:', insertError.message);
      notificarUsuario('Hubo un problema al registrar la emoción.');
      return;
    }

    notificarUsuario('¡Emoción registrada con éxito!');
    form.reset();
    setTimeout(() => {
      location.reload();
    }, 1000);
    await graficoEmociones();
    await recomendacionesPersonalizadas();
  });
}

export async function graficoEmociones() {
  const ctx = document.getElementById('graficoEmociones')?.getContext('2d');
  if (!ctx) return;

  const { data: session } = await supabase.auth.getUser();
  const userId = session?.user?.id;
  if (!userId) return;

  const { data, error } = await supabase
    .from('estadoEmocional')
    .select('emocion, created_at')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) {
    console.warn('No hay datos emocionales para graficar.');
    return;
  }

  const fechas = [];
  const valores = [];

  data.forEach(entry => {
    fechas.push(new Date(entry.created_at).toLocaleDateString('es-ES'));
    valores.push(emocionValor(entry.emocion));
  });

  // Destruye el gráfico anterior si ya existe
  if (graficoEmocionalInstance) {
    graficoEmocionalInstance.destroy();
  }

  // Crea un nuevo gráfico
  graficoEmocionalInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Evolución Emocional',
        data: valores,
        fill: true,
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => valorEmocion(context.raw)
          }
        }
      },
      scales: {
        y: {
          min: -1,
          max: 6,
          ticks: {
            stepSize: 1,
            callback: valor => {
              const mapa = {
                0: '😠 Enojado',
                1: '😢 Triste',
                2: '😨 Ansioso',
                3: '😐 Neutral',
                5: '😊 Feliz'
              };
              return mapa[valor] || '';
            }
          },
          title: {
            display: true,
            text: 'Emoción',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        x: {
          offset: true,
          title: {
            display: true,
            text: 'Fecha',
            padding: 10,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            maxRotation: 45,
            minRotation: 30
          }
        }
      }
    }
  });
}


function emocionValor(emocion) {
  const mapa = {
    Feliz: 5,
    Neutral: 3,
    Ansioso: 2,
    Triste: 1,
    Enojado: 0
  };
  return mapa[emocion] ?? 3;
}

function valorEmocion(valor) {
  const mapa = {
    5: '😊 Feliz',
    3: '😐 Neutral',
    2: '😨 Ansioso',
    1: '😢 Triste',
    0: '😠 Enojado'
  };
  return mapa[valor] ?? valor;
}

export function descargarHistorialEmociones() {
  document.getElementById('btnDescargarHistorial')?.addEventListener('click', async () => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('estadoEmocional')
      .select('emocion, comentario, created_at')
      .eq('userId', userId)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    // CSV: encabezado y filas
    const encabezado = ['Fecha', 'Emoción', 'Comentario'];
    const filas = data.map(reg => [
      new Date(reg.created_at).toLocaleDateString(),
      reg.emocion,
      (reg.comentario || '').replace(/\n/g, ' ').replace(/"/g, '')
    ]);

    const csvContenido = [encabezado, ...filas]
      .map(fila => fila.map(val => `${val}`).join(';'))
      .join('\n');

    const blob = new Blob(
      ["\uFEFF" + csvContenido],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historial_emocional.csv';
    link.click();
    URL.revokeObjectURL(url);
  });
}


export async function recomendacionesPersonalizadas() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) return;

  const hoy = new Date().toISOString().split('T')[0];
  const contenedor = document.getElementById('recomendacionesEmocionales');
  if (!contenedor) return;

  // Buscar la emoción registrada hoy
  const { data: emocionData, error: emocionError } = await supabase
    .from('estadoEmocional')
    .select('emocion')
    .eq('userId', userId)
    .gte('created_at', `${hoy}T00:00:00Z`)
    .lte('created_at', `${hoy}T23:59:59Z`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (emocionError || !emocionData?.emocion) {
    contenedor.innerHTML = `<p class="texto-secundario">Registra tu emoción de hoy para ver una recomendación personalizada.</p>`;
    return;
  }

  const emocion = emocionData.emocion;

  // Buscar una recomendación para la emoción
  const { data: recomendaciones, error: recomendacionError } = await supabase
    .from('recomendaciones')
    .select('recomendacion')
    .eq('emocion', emocion);

  if (recomendacionError || !recomendaciones || recomendaciones.length === 0) {
    contenedor.innerHTML = `<p class="texto-secundario">No hay recomendaciones disponibles para la emoción "${emocion}".</p>`;
    return;
  }

  // Elegir una recomendación aleatoria
  const aleatoria = recomendaciones[Math.floor(Math.random() * recomendaciones.length)].recomendacion;

  contenedor.innerHTML = `
    <div class="alert alert-primary d-flex align-items-center" role="alert">
      💡 <div class="ms-3">${aleatoria}</div>
    </div>
  `;
}


