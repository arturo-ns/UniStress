const supabase = window.supabase.createClient(
  'https://xesanftcibogmzonkwkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc2FuZnRjaWJvZ216b25rd2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjUyMTMsImV4cCI6MjA2NDY0MTIxM30.PXJh4PCNiynXnqe21YbgpuVHqVjYw6DVd5AaKJcAi8U'
);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const inputEmail = document.getElementById('email');
  const inputPassword = document.getElementById('password');
  const mensajeError = document.getElementById('mensajeError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    // 🔐 Login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      mostrarError('Correo o contraseña incorrectos o cuenta no verificada.');
      return;
    }

    const user = data.user;
    const userId = user.id;

    // 🔎 Buscar datos en usuarioTemporal
    const { data: tempData, error: tempError } = await supabase
      .from('usuarioTemporal')
      .select('*')
      .eq('email', email)
      .single();

    if (tempError) {
      console.warn('No se encontraron datos en usuarioTemporal o ya fueron eliminados.');
    }

    if (tempData) {
      // Verifica si ya existe perfil
      const { data: perfilExistente, error: errorPerfil } = await supabase
        .from('userProfile')
        .select('id')
        .eq('userId', userId)
        .maybeSingle();

      if (!perfilExistente) {
        const { error: insertError } = await supabase.from('userProfile').insert([{
          nombre: tempData.nombre,
          apellido: tempData.apellido,
          fechaNacimiento: tempData.fechaNacimiento,
          genero: tempData.genero,
          carrera: tempData.carrera,
          universidad: tempData.universidad,
          userId: userId
        }]);

        if (!insertError) {
          console.log('✅ Perfil insertado en userProfile');

          // 🧹 Eliminar fila de usuarioTemporal
          await supabase.from('usuarioTemporal').delete().eq('email', email);
        } else {
          console.warn('⚠️ No se pudo insertar perfil:', insertError.message);
        }
      } else {
        console.log('ℹ️ El perfil ya existía, no se volvió a insertar');
      }
    }

    // ✅ Redirigir al dashboard
    window.location.href = 'dashboard.html';
  });

  function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
    mensajeError.classList.remove('ocultar');
    mensajeError.classList.add('mostrar');

    setTimeout(() => {
      mensajeError.classList.remove('mostrar');
      mensajeError.classList.add('ocultar');

      setTimeout(() => {
        mensajeError.style.display = 'none';
        mensajeError.textContent = '';
      }, 500);
    }, 3000);
  }
});






