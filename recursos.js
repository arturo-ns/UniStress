import { supabase } from './utils.js';

export async function recursosPsicoeducativos() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) return;

  // fecha local del usuario y convertilo a UTC string
  const ahora = new Date();
  const offset = ahora.getTimezoneOffset() * 60000;
  const hoyLocal = new Date(ahora.getTime() - offset);
  const hoyStr = hoyLocal.toISOString().split('T')[0];
  const desde = `${hoyStr}T00:00:00`;
  const hasta = `${hoyStr}T23:59:59`;

  // Verificar si ya registro su emocion hoy (según hora local)
  const { data: emocionHoy } = await supabase
    .from('estadoEmocional')
    .select('emocion')
    .eq('userId', userId)
    .gte('created_at', desde)
    .lte('created_at', hasta)
    .maybeSingle();

  const emocion = emocionHoy?.emocion;
  const contenedorArticulos = document.getElementById('contenedorArticulos');
  const listaArticulos = document.getElementById('listaArticulos');
  const listaVideos = document.getElementById('contenedorVideosAudios');
  const listaHerramientas = document.getElementById('contenedorHerramientas');

  if (!emocion) {
    contenedorArticulos.innerHTML = '<p class="text-muted">Registra tu emoción de hoy para ver articulos personalizados.</p>';
    listaVideos.innerHTML = '<p class="text-muted">Registra tu emoción de hoy para ver videos personalizados.</p>';
    listaHerramientas.innerHTML = '<p class="text-muted">Registra tu emoción de hoy para ver herramientas personalizados.</p>';
    return;
  }

  // Obtener recursos relacionados con la emoción desde supabase
  const { data: recursos, error } = await supabase
    .from('recursos')
    .select('*')
    .eq('emocion', emocion);

  if (error || !recursos || recursos.length === 0) {
    contenedorArticulos.innerHTML = '<p class="text-muted">No hay recursos disponibles para esta emoción aún.</p>';
    return;
  }

  // Separo recursos por tipo
  const articulos = recursos.filter(r => r.tipo === 'articulo');
  const videos = recursos.filter(r => r.tipo === 'video');
  const audios = recursos.filter(r => r.tipo === 'audio');
  const herramientas = recursos.filter(r => r.tipo === 'herramienta');

  // Mostrar artículos
  listaArticulos.innerHTML = articulos.map(a => `
    <li class="list-group-item custom-list-item">
      <a href="${a.enlace}" target="_blank">${a.descripcion}</a>
    </li>
  `).join('');

  // Mostrar videos y audios
  listaVideos.innerHTML =
    videos.map(v => `
      <div class="ratio ratio-16x9 mb-3">
        <iframe src="${v.enlace}" title="${v.descripcion}" allowfullscreen></iframe>
      </div>
    `).join('') +
    audios.map(a => `
      <p>
        <a href="${a.enlace}" class="btn btn-sm btn-personalizado" target="_blank">${a.descripcion}</a>
      </p>
    `).join('');

  // Mostrar herramientas
  listaHerramientas.innerHTML = `
    <ul class="custom-list-group">
      ${herramientas.map(h => `
        <li class="list-group-item custom-list-item">
          <a href="${h.enlace}" target="_blank">${h.descripcion}</a>
        </li>
      `).join('')}
    </ul>
  `;

  //me ayudo a detectar errores
  console.log('Emoción de hoy:', emocion);
  console.log('Artículos encontrados:', articulos);
  console.log('Herramientas encontradas:', herramientas);
}

