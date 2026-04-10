// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scroll-progress').style.setProperty('--scroll', `${scrollPercent}%`);
});

// Formulario de contacto
function handleSubmit(e) {
    e.preventDefault();
    alert('✅ ¡Mensaje enviado! En las próximas horas te contactaremos con tu propuesta personalizada.');
    e.target.reset();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✅ Yoman Publicidad • Ultra Modernista 2026 listo', 
                'color:#FFCC00; font-size:16px; font-weight:700');
    
    // Si quieres agregar más interacciones (smooth scroll, animaciones, etc.) aquí va
});