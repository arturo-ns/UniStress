
/* ========== 1. Fade In ========== */
export function fadeIn(elemento, duracion = 800, delay = 0) {
  anime({
    targets: elemento,
    opacity: [0, 1],
    duration: duracion,
    delay: delay,
    easing: 'easeOutQuad'
  });
}

/* ========== 2. Slide In desde abajo ========== */
export function slideInBottom(elemento, duracion = 800, delay = 0, distancia = 40) {
  anime({
    targets: elemento,
    translateY: [distancia, 0],
    opacity: [0, 1],
    duration: duracion,
    delay: delay,
    easing: 'easeOutExpo'
  });
}

/* ========== 3. Escalado de entrada ========== */
export function popIn(elemento, duracion = 600, delay = 0) {
  anime({
    targets: elemento,
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: duracion,
    delay: delay,
    easing: 'easeOutBack'
  });
}

/* ========== 4. Parpadeo ========== */
export function parpadeo(elemento, duracion = 1000, repeticion = Infinity) {
  anime({
    targets: elemento,
    opacity: [1, 0],
    direction: 'alternate',
    loop: repeticion,
    duration: duracion,
    easing: 'easeInOutSine'
  });
}

/* ========== 5. Shake / Vibración ========== */
export function vibrar(elemento, duracion = 500) {
  anime({
    targets: elemento,
    translateX: [
      { value: -10, duration: 100 },
      { value: 10, duration: 100 },
      { value: -10, duration: 100 },
      { value: 10, duration: 100 },
      { value: 0, duration: 100 }
    ],
    easing: 'easeInOutQuad'
  });
}
