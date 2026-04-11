document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const statusBanner = document.getElementById('login-status');
    const submitButton = form.querySelector('button[type="submit"]');

    const setStatus = (message, type) => {
        statusBanner.textContent = message;
        statusBanner.className = `status-banner ${type}`;
    };

    if (!window.YomanSupabase.isConfigured()) {
        setStatus('Agrega tu URL y tu anon key de Supabase en assets/js/supabase-config.js.', 'error');
        submitButton.disabled = true;
        submitButton.classList.add('opacity-60', 'cursor-not-allowed');
        return;
    }

    try {
        const session = await window.YomanSupabase.requireSession();
        if (session) {
            window.location.href = 'dashboard.html';
            return;
        }
    } catch (error) {
        setStatus(error.message, 'error');
    }

    setStatus('Usa un usuario creado en Supabase Authentication para entrar al panel.', 'info');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setStatus('Validando credenciales...', 'info');

        try {
            await window.YomanSupabase.signInWithPassword(
                emailInput.value.trim(),
                passwordInput.value
            );

            setStatus('Inicio de sesion correcto. Entrando al dashboard...', 'success');
            window.location.href = 'dashboard.html';
        } catch (error) {
            setStatus(error.message, 'error');
        }
    });
});
