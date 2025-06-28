const supabase = window.supabase.createClient(
  'https://xesanftcibogmzonkwkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc2FuZnRjaWJvZ216b25rd2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjUyMTMsImV4cCI6MjA2NDY0MTIxM30.PXJh4PCNiynXnqe21YbgpuVHqVjYw6DVd5AaKJcAi8U'
);

import { notificarUsuario } from './notificacion.js';

document.getElementById('formRegistro').addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('📩 Enviando formulario...');

  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const fechaNacimiento = document.getElementById('fecha').value;
  const genero = document.getElementById('genero').value;
  const carrera = document.getElementById('carrera').value.trim();
  const universidad = document.getElementById('universidad').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmar = document.getElementById('confirmar').value;

  if (password !== confirmar) {
    notificarUsuario('Las contraseñas no coinciden', 'error');
    return;
  }

  console.log('🛠 Registrando en Supabase Auth...');

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://arturo-ns.github.io/UniStress2/login.html'
    }
  });

  if (signUpError) {
    console.error('❌ Error en Auth:', signUpError.message);
    notificarUsuario('Error al registrar usuario: ' + signUpError.message, 'error');
    return;
  }

  console.log('✅ Usuario creado:', signUpData.user?.email);

  const { error: tempError } = await supabase.from('usuarioTemporal').insert([{
    email,
    nombre,
    apellido,
    fechaNacimiento,
    genero,
    carrera,
    universidad
  }]);

  if (tempError) {
    console.error('⚠️ Error al guardar datos temporales:', tempError.message);
    notificarUsuario('Usuario creado, pero hubo un error al guardar los datos del perfil.', 'advertencia');
  } else {
    console.log('✅ Datos temporales guardados en Supabase');
  }

  notificarUsuario('Cuenta creada correctamente. Revisa tu correo y confirma tu email.', 'exito');

  // Redirige con leve retraso para que se vea el toast
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000);
});
