// Variables para almacenar los productos y calcular totales
let productos = [];
let subtotal = 0;
let impuesto = 0;
let total = 0;
let emailjsInitialized  = false;

// Carga y muestra los productos guardados
document.addEventListener('DOMContentLoaded', () => {


    const tabla = document.getElementById("productsTable").getElementsByTagName('tbody')[0];

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        tabla.innerHTML = "<tr><td colspan='4'>No hay productos en el carrito.</td></tr>";
        return;
    }

    carrito.forEach(producto => {
        const fila = tabla.insertRow();

        // Descripción
        const celdaNombre = fila.insertCell(0);
        celdaNombre.textContent = producto.nombre;

        // Cantidad (asumimos 1 si no se guarda cantidad)
        const celdaCantidad = fila.insertCell(1);
        celdaCantidad.textContent = producto.cantidad || 1;

        // Precio unitario
        const celdaPrecio = fila.insertCell(2);
        celdaPrecio.textContent = `₡${producto.precio.toFixed(2)}`;

        // Total
        const celdaTotal = fila.insertCell(3);
        const cantidad = producto.cantidad || 1;
        celdaTotal.textContent = `₡${(producto.precio * cantidad).toFixed(2)}`;
        
        // Agregar el producto al array de productos
        productos.push({
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            total: producto.precio * cantidad
        });
    });
    
    // Calcular totales después de cargar los productos
    actualizarTotales();


    if (!emailjsInitialized) {
        emailjs.init("gonAcN-OJrWD7feiW");
        emailjsInitialized = true;
    }
});

// Función para eliminar un producto
$(document).on('click', '.remove-item', function() {
    const indice = $(this).data('index');
    
    if (indice >= 0 && indice < productos.length) {
        productos.splice(indice, 1);
        actualizarTablaProductos();
        actualizarTotales();
    }
});

// Función para actualizar la tabla de productos
function actualizarTablaProductos() {
    const cuerpoTabla = $("#productsList");
    cuerpoTabla.empty();
    
    if (productos.length === 0) {
        cuerpoTabla.append("<tr><td colspan='5'>No hay productos en la factura.</td></tr>");
        return;
    }
    
    productos.forEach((producto, indice) => {
        const fila = `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>₡${producto.precio.toFixed(2)}</td>
                <td>₡${producto.total.toFixed(2)}</td>
                <td>
                    <button class="remove-item" data-index="${indice}">×</button>
                </td>
            </tr>
        `;
        cuerpoTabla.append(fila);
    });
}

// Función para actualizar los totales basados en los productos de la tabla
function actualizarTotales() {
    // Calcular subtotal sumando todos los totales de los productos
    subtotal = 0;
    
    // Si hay filas en la tabla (excluyendo el encabezado)
    const filas = document.querySelectorAll('#productsTable tbody tr');
    filas.forEach(fila => {
        // Verificar si la fila contiene datos de producto (y no un mensaje "No hay productos")
        if (fila.cells.length >= 4 && !fila.cells[0].textContent.includes("No hay productos")) {
            // Obtener el texto de la celda del total (última columna antes del botón eliminar)
            const textoTotal = fila.cells[3].textContent;
            // Extraer el valor numérico eliminando el símbolo de moneda
            const valorTotal = parseFloat(textoTotal.replace('₡', ''));
            if (!isNaN(valorTotal)) {
                subtotal += valorTotal;
            }
        }
    });
    
    // Calcular IVA (13%)
    impuesto = subtotal * 0.13;
    
    // Calcular total
    total = subtotal + impuesto;
    
    // Actualizar los elementos de la interfaz
    $("#subtotal").text(subtotal.toFixed(2));
    $("#tax").text(impuesto.toFixed(2));
    $("#total").text(total.toFixed(2));
}

function mostrarMensajeConfirmacion() {
    const mensajeDiv = document.getElementById('mensajeConfirmacion');
    
    // Mostrar el mensaje
    mensajeDiv.style.display = 'flex';
    
    // Remover después de cierto tiempo
    setTimeout(function() {
        mensajeDiv.classList.add('desvanecer');
        setTimeout(function() {
            mensajeDiv.style.display = 'none';
            mensajeDiv.classList.remove('desvanecer');
        }, 500);
    }, 2500);
}


// Función para imprimir/descargar factura

$("#printInvoice").click(function(e) {
  

    const correoCliente = $('.client-input[placeholder="Correo del cliente"]').val();
    const nombreCliente = $('.client-input[placeholder="Nombre del cliente"]').val();
    
    // Validar el correo electrónico
    if (!correoCliente || !validarEmail(correoCliente)) {
        alert("Por favor, ingrese un correo electrónico válido.");
        $('.client-input[placeholder="Correo del cliente"]').focus();
        e.preventDefault();
        return false;
    }
    
    enviarFacturaPorCorreo(nombreCliente, correoCliente);
    

    setTimeout(function() {
        mostrarMensajeConfirmacion();
        
        localStorage.removeItem("carrito");
        
        // Redirige al index.html después de completar la factura
        setTimeout(function() {
            window.location.href = "index.html"; 
        }, 3000);
    }, 500);
});

// Función para validar el formato de correo electrónico
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function enviarFacturaPorCorreo(nombreCliente, correoCliente) {
    // Preparar los datos de productos para el correo
    let tablaProductos = '<table style="width:100%; border-collapse: collapse;">';
    tablaProductos += '<tr style="background-color: #f2f2f2;"><th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Descripción</th><th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Cantidad</th><th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Precio</th><th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Total</th></tr>';
    
    productos.forEach(producto => {
        tablaProductos += `<tr>
            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${producto.nombre}</td>
            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${producto.cantidad}</td>
            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">₡${producto.precio.toFixed(2)}</td>
            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">₡${producto.total.toFixed(2)}</td>
        </tr>`;
    });
    
    tablaProductos += '</table>';
    
    // Preparar datos para los totales
    const fecha = $("#invoiceDate").text();
    const numeroFactura = $("#invoiceNumber").text();
    const subtotalValue = $("#subtotal").text();
    const impuestoValue = $("#tax").text();
    const totalValue = $("#total").text();
    
    // Determinar el método de pago
    const metodoPago = $('input[name="paymentMethod"]:checked').val() === 'card' ? 'Tarjeta de Crédito/Débito' : 'Efectivo';
    
    // Preparar plantilla de correo
    const templateParams = {
        to_email: correoCliente,
        to_name: nombreCliente,
        from_name: 'Cupcake House',
        subject: `Factura #${numeroFactura} - Cupcake House`,
        invoice_number: numeroFactura,
        invoice_date: fecha,
        products_table: tablaProductos,
        subtotal: subtotalValue,
        tax: impuestoValue,
        total: totalValue,
        payment_method: metodoPago,
        notes: 'Si realiza la compra en efectivo debe de recoger el producto en la tienda. Presentar la factura a la hora de realizar el retiro del producto.'
    };
    
    // Enviar el correo electrónico usando EmailJS
    emailjs.send('service_at7tr4q', 'template_p7bdz2e', templateParams)
        .then(function(response) {
            console.log('Correo enviado exitosamente!', response.status, response.text);
        }, function(error) {
            console.log('Error detallado:', error);
            alert('Error al enviar: ' + error.text); // Mensaje más específico
        });
}
     

// Mostrar/ocultar formulario de tarjeta según método de pago
$('input[name="paymentMethod"]').change(function() {
    if ($(this).val() === 'card') {
        $("#creditCardContainer").show();
    } else {
        $("#creditCardContainer").hide();
    }
});

// Manejar la entrada del número de tarjeta
$("#cardNumber").on('input', function() {
    let valor = $(this).val().replace(/\D/g, '');
    let valorFormateado = '';
    
    // Formatear con espacios cada 4 dígitos
    for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) {
            valorFormateado += ' ';
        }
        valorFormateado += valor[i];
    }
    
    $(this).val(valorFormateado);
    
    // Actualizar visualización en la tarjeta
    if (valor.length > 0) {
        let valorMostrado = valorFormateado;
        // Mostrar solo los últimos 4 dígitos
        if (valor.length > 4) {
            valorMostrado = '•••• '.repeat(Math.floor((valor.length - 4) / 4)) + 
                        valorFormateado.slice(-5);
        }
        $("#cardNumberDisplay").text(valorMostrado);
    } else {
        $("#cardNumberDisplay").text('•••• •••• •••• ••••');
    }
    
    // Detectar tipo de tarjeta
    detectarTipoTarjeta(valor);
});

// Manejar la entrada del nombre del titular
$("#cardHolder").on('input', function() {
    const valor = $(this).val().toUpperCase();
    $(this).val(valor);
    
    if (valor) {
        $("#cardHolderDisplay").text(valor);
    } else {
        $("#cardHolderDisplay").text('NOMBRE DEL TITULAR');
    }
});

// Manejar la entrada de la fecha de vencimiento con validación
$("#cardExpiry").on('input', function() {
    let valor = $(this).val().replace(/\D/g, '');
    
    // Formatear como MM/AA
    if (valor.length > 0) {
        if (valor.length <= 2) {
            // Solo se agregó el mes
            if (parseInt(valor) > 12) {
                valor = '12';
            }
        } else {
            // Se agregó mes y año
            const mes = valor.substring(0, 2);
            const anio = valor.substring(2, 4);
            
            if (parseInt(mes) > 12) {
                valor = '12' + anio;
            } else {
                valor = mes + anio;
            }
        }
        
        if (valor.length > 2) {
            valor = valor.substring(0, 2) + '/' + valor.substring(2);
        }
        
        $("#cardExpiryDisplay").text(valor);
    } else {
        $("#cardExpiryDisplay").text('MM/AA');
    }
    
    $(this).val(valor.length > 2 ? valor.substring(0, 2) + '/' + valor.substring(3, 5) : valor);
    
    // Validar fecha cuando se complete la entrada
    if (valor.length >= 4) {
        validarFechaExpiracion($(this).val());
    }
});

// Función para validar la fecha de vencimiento
function validarFechaExpiracion(fechaString) {
    // Obtener mes y año de la entrada
    const partes = fechaString.split('/');
    if (partes.length !== 2) return;
    
    const mes = parseInt(partes[0]);
    // Convertir el año de 2 dígitos a 4 dígitos (asumiendo 20XX)
    const anio = 2000 + parseInt(partes[1]);
    
    // Crear la fecha del último día del mes de vencimiento
    const fechaExpiracion = new Date(anio, mes, 0);
    
    // Obtener la fecha actual
    const ahora = new Date();
    
    // Comparar las fechas (usando el último día del mes)
    if (fechaExpiracion < ahora) {
        $("#cardExpiry").addClass('error');
        // Agregar mensaje de error si no existe
        if ($('#expiryError').length === 0) {
            $("#cardExpiry").after('<div id="expiryError" class="error-message">La tarjeta ha expirado</div>');
        }
        return false;
    } else {
        $("#cardExpiry").removeClass('error');
        // Eliminar mensaje de error si existe
        $('#expiryError').remove();
        return true;
    }
}

// Manejar la entrada del CCV
$("#cardCcv").on('focus', function() {
    $("#creditCard").addClass('flipped');
}).on('blur', function() {
    $("#creditCard").removeClass('flipped');
}).on('input', function() {
    const valor = $(this).val().replace(/\D/g, '');
    $(this).val(valor);
    
    if (valor) {
        $("#cardCcvDisplay").text(valor);
    } else {
        $("#cardCcvDisplay").text('•••');
    }
});

// Función para detectar el tipo de tarjeta
function detectarTipoTarjeta(numero) {
    // Ocultar todos los iconos primero
    $("#visaIcon, #mastercardIcon").hide();
    
    // Visa comienza con 4
    if (numero.startsWith('4')) {
        $("#visaIcon").show();
    }
    // Mastercard comienza con 5
    else if (numero.startsWith('5')) {
        $("#mastercardIcon").show();
    }
}

// Validar todo el formulario antes de enviar
$("#printInvoice").click(function(e) {
    // Verificar si se seleccionó pago con tarjeta
    if ($('input[name="paymentMethod"]:checked').val() === 'card') {
        // Validar campos de tarjeta
        const numeroTarjeta = $("#cardNumber").val().replace(/\s/g, '');
        const titular = $("#cardHolder").val();
        const fechaExpiracion = $("#cardExpiry").val();
        const cvv = $("#cardCcv").val();
        
        let esValido = true;
        
        // Limpiar mensajes de error previos
        $('.error-message').remove();
        $('.form-control').removeClass('error');
        
        // Validar número de tarjeta
        if (numeroTarjeta.length < 16) {
            $("#cardNumber").addClass('error');
            $("#cardNumber").after('<div class="error-message">Número de tarjeta inválido</div>');
            esValido = false;
        }
        
        // Validar titular
        if (!titular) {
            $("#cardHolder").addClass('error');
            $("#cardHolder").after('<div class="error-message">Ingrese el nombre del titular</div>');
            esValido = false;
        }
        
        // Validar fecha de vencimiento
        if (!fechaExpiracion || fechaExpiracion.length < 5) {
            $("#cardExpiry").addClass('error');
            $("#cardExpiry").after('<div class="error-message">Fecha inválida</div>');
            esValido = false;
        } else if (!validarFechaExpiracion(fechaExpiracion)) {
            esValido = false;
        }
        
        // Validar CCV
        if (!cvv || cvv.length < 3) {
            $("#cardCcv").addClass('error');
            $("#cardCcv").after('<div class="error-message">CCV inválido</div>');
            esValido = false;
        }
        
        if (!esValido) {
            e.preventDefault();
            return false;
        }
    }
    
    // Validar que haya productos
    if (productos.length === 0) {
        alert("No hay productos en la factura.");
        e.preventDefault();
        return false;
    }
});

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar formulario de tarjeta inicialmente
    $("#creditCardContainer").hide();
    
    // Configurar fecha actual en la factura
    const hoy = new Date();
    const fechaStr = hoy.toLocaleDateString('es-CR');
    $("#invoiceDate").text(fechaStr);
    
    // Inicializar productos y totales
    actualizarTablaProductos();
    actualizarTotales();
});