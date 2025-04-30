
 emailjs.init('vFn7-5MylcrLKzrU2');
 
 // 2. Función mejorada para enviar con feedback visual
 function sendEmail() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Mostrar errores personalizados si falta algo
    if (!name || !email || !subject || !message) {
        mostrarErrores(); // llama a la función de arriba
        return;
    }

    const submitBtn = document.querySelector('#contactForm button[type="button"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    emailjs.send('service_77dazyg', 'template_h615h85', {
        name: name,
        email: email,
        subject: subject,
        message: message
    })
    .then(() => {
        alert(`¡Gracias ${name}!\nTu mensaje ha sido enviado con éxito.`);
        document.getElementById('contactForm').reset();
        mostrarErrores(); // limpia mensajes después de enviar
    })
    .catch((error) => {
        console.error('Error de envío:', error);
        alert('Error al enviar el mensaje');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

 
function mostrarErrores() {
    const campos = document.querySelectorAll('#contactForm .form-control');

    campos.forEach(campo => {
        const mensaje = campo.getAttribute('data-validation-required-message');
        const mensajeElemento = campo.nextElementSibling; 

        if (!campo.value.trim()) {
            mensajeElemento.textContent = mensaje;
        } else {
            mensajeElemento.textContent = '';
        }
    });
}

 