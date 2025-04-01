// 1. Inicialización básica de EmailJS
emailjs.init('vFn7-5MylcrLKzrU2');

// 2. Función mejorada para enviar con feedback visual
function sendEmail() {
    // Obtener valores
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validación esencial (solo campos vacíos)
    if (!name || !email || !subject || !message) {
        alert('Completa todos los campos');
        return;
    }

    // Obtener botón y guardar texto original
    const submitBtn = document.querySelector('#contactForm button[type="button"]');
    const originalText = submitBtn.textContent;
    
    // Cambiar estado del botón durante envío
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Envío directo con manejo de respuesta
    emailjs.send('service_77dazyg', 'template_h615h85', {
        name: name,
        email: email,
        subject: subject,
        message: message
    })
    .then(() => {
        // Mensaje personalizado sin prefijos
        alert(`¡Gracias ${name}!\nTu mensaje ha sido enviado con éxito.`);
        document.getElementById('contactForm').reset();
    })
    .catch((error) => {
        console.error('Error de envío:', error);
        alert('Error al enviar el mensaje');
    })
    .finally(() => {
        // Restaurar botón a estado original
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// 3. Evento simple (manteniendo el onclick del HTML)
// No necesitas el onsubmit si usas onclick en el botón
