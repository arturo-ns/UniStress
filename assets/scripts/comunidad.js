import { supabase } from './utils.js';

/* ========== Frases Motivacionales ========== */
const frasesMotivacionales = [
  "No tienes que hacerlo todo hoy. Respira, prioriza y avanza a tu ritmo.",
  "Cada pequeño paso cuenta, sigue avanzando.",
  "Tu bienestar es tan importante como tus logros.",
  "No estás solo/a. Hablar es un acto de valentía.",
  "El autocuidado no es egoísmo, es una necesidad.",
  "Eres más fuerte de lo que piensas."
];

export function fraseMotivacional() {
  const fraseElemento = document.getElementById("textoFrase");
  if (!fraseElemento) return;

  const frase = frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
  fraseElemento.textContent = `"${frase}"`;
}

/* ========== Escucha Anónima ========== */
const formEscucha = document.getElementById("formEscuchaAnonima");
const listaMensajes = document.getElementById("listaMensajesAnonimos");

function obtenerMensajesAnonimos() {
  return JSON.parse(localStorage.getItem("mensajesAnonimos")) || [];
}

function guardarMensajesAnonimos(mensajes) {
  localStorage.setItem("mensajesAnonimos", JSON.stringify(mensajes));
}

export function mensajesAnonimos() {
  if (!listaMensajes) return;
  const mensajes = obtenerMensajesAnonimos();
  listaMensajes.innerHTML = "";

  if (mensajes.length === 0) {
    listaMensajes.innerHTML = '<li class="list-group-item text-muted">Aún no hay mensajes.</li>';
    return;
  }

  mensajes.slice(-5).reverse().forEach(mensaje => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = mensaje;
    listaMensajes.appendChild(li);
  });
}

formEscucha?.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("mensajeAnonimo");
  const texto = input?.value.trim();

  if (texto) {
    const mensajes = obtenerMensajesAnonimos();
    mensajes.push(texto);
    guardarMensajesAnonimos(mensajes);
    input.value = "";
    mensajesAnonimos();
  }
});

/* ========== Desafío Diario ========== */
export async function desafioDiario() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) return;

  const hoy = new Date().toISOString().split('T')[0];
  const contenedor = document.getElementById('desafioSemanal');
  if (!contenedor) return;

  // fecha local del usuario , convertilo a UTC string
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset() * 60000;
    const hoyLocal = new Date(ahora.getTime() - offset);
    const hoyStr = hoyLocal.toISOString().split('T')[0];

    const desde = `${hoyStr}T00:00:00`;
    const hasta = `${hoyStr}T23:59:59`;

    // Verificar si ya hizo test hoy (según hora local)
    const { data: existente } = await supabase
      .from('desafioDiario')
      .select('id')
      .eq('userId', userId)
      .gte('fecha', desde)
      .lte('fecha', hasta)
      .maybeSingle();
  
  if (existente) {
    contenedor.innerHTML = `
      <div class="alert alert-success">✅ Ya completaste tu desafío de hoy. ¡Bien hecho!</div>
    `;
    return;
  }

  // Obtener desafíos
  const { data: desafios, error } = await supabase.from('desafios').select('*');
  if (error || !desafios?.length) {
    contenedor.innerHTML = '<p>No hay desafíos disponibles por el momento.</p>';
    return;
  }

  // Mostrar desafío aleatorio
  const aleatorio = desafios[Math.floor(Math.random() * desafios.length)];
  contenedor.innerHTML = `
    <div class="alert alert-info d-flex align-items-center" role="alert">
      📝 <div class="ms-3"><strong>Desafío de hoy:</strong> ${aleatorio.desafio}</div>
    </div>
    <div class="form-check mt-3">
      <input type="checkbox" class="form-check-input" id="desafioCompletado">
      <label class="form-check-label" for="desafioCompletado">✔️ He completado el desafío</label>
    </div>
  `;

  document.getElementById('desafioCompletado')?.addEventListener('change', async e => {
    if (e.target.checked) {
      const { error: insertError } = await supabase.from('desafioDiario').insert([
        { userId, desafioId: aleatorio.id, fecha: hoy }
      ]);
      if (!insertError) desafioDiario();
    }
  });
}
