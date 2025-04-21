    // Variables para almacenar los productos y calcular totales
    let products = [];
    let subtotal = 0;
    let tax = 0;
    let total = 0;
    
// Carga y muestra los productos guardados
    document.addEventListener('DOMContentLoaded', () => {
        const tabla = document.getElementById("productsTable").getElementsByTagName('tbody')[0];
    
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
        if (carrito.length === 0) {
            tabla.innerHTML = `<tr><td colspan="4">No hay productos en el carrito.</td></tr>`;
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
        });
    });
    
    
    // Función para eliminar un producto
    $(document).on('click', '.remove-item', function() {
        const index = $(this).data('index');
        
        if (index >= 0 && index < products.length) {
            products.splice(index, 1);
            updateProductTable();
            updateTotals();
        }
    });
    


    // Función para actualizar los totales
    function updateTotals() {
        subtotal = products.reduce((sum, product) => sum + product.total, 0);
        tax = subtotal * 0.13;
        total = subtotal + tax;
        
        $("#subtotal").text(subtotal.toFixed(2));
        $("#tax").text(tax.toFixed(2));
        $("#total").text(total.toFixed(2));
    }
    
    // Función para limpiar el formulario de producto
    function clearProductForm() {
        $("#productName").val("");
        $("#productPrice").val("");
        $("#productQty").val(1);
    }
    
    // Función para imprimir/descargar factura
    $("#printInvoice").click(function() {
        window.print();
    });
    
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
        let value = $(this).val().replace(/\D/g, '');
        let formattedValue = '';
        
        // Formatear con espacios cada 4 dígitos
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        $(this).val(formattedValue);
        
        // Actualizar visualización en la tarjeta
        if (value.length > 0) {
            let displayValue = formattedValue;
            // Mostrar solo los últimos 4 dígitos
            if (value.length > 4) {
                displayValue = '•••• '.repeat(Math.floor((value.length - 4) / 4)) + 
                            formattedValue.slice(-5);
            }
            $("#cardNumberDisplay").text(displayValue);
        } else {
            $("#cardNumberDisplay").text('•••• •••• •••• ••••');
        }
        
        // Detectar tipo de tarjeta
        detectCardType(value);
    });
    
    // Manejar la entrada del nombre del titular
    $("#cardHolder").on('input', function() {
        const value = $(this).val().toUpperCase();
        $(this).val(value);
        
        if (value) {
            $("#cardHolderDisplay").text(value);
        } else {
            $("#cardHolderDisplay").text('NOMBRE DEL TITULAR');
        }
    });
    
    // Manejar la entrada de la fecha de vencimiento
    $("#cardExpiry").on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        
        // Formatear como MM/AA
        if (value.length > 0) {
            if (value.length <= 2) {
                // Solo se agregó el mes
                if (parseInt(value) > 12) {
                    value = '12';
                }
            } else {
                // Se agregó mes y año
                const month = value.substring(0, 2);
                const year = value.substring(2, 4);
                
                if (parseInt(month) > 12) {
                    value = '12' + year;
                } else {
                    value = month + year;
                }
            }
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            $("#cardExpiryDisplay").text(value);
        } else {
            $("#cardExpiryDisplay").text('MM/AA');
        }
        
        $(this).val(value.length > 2 ? value.substring(0, 2) + '/' + value.substring(3, 5) : value);
    });
    
    // Manejar la entrada del CCV
    $("#cardCcv").on('focus', function() {
        $("#creditCard").addClass('flipped');
    }).on('blur', function() {
        $("#creditCard").removeClass('flipped');
    }).on('input', function() {
        const value = $(this).val().replace(/\D/g, '');
        $(this).val(value);
        
        if (value) {
            $("#cardCcvDisplay").text(value);
        } else {
            $("#cardCcvDisplay").text('•••');
        }
    });
    
    // Función para detectar el tipo de tarjeta
    function detectCardType(number) {
        // Ocultar todos los iconos primero
        $("#visaIcon, #mastercardIcon").hide();
        
        // Visa comienza con 4
        if (number.startsWith('4')) {
            $("#visaIcon").show();
        }
        // Mastercard comienza con 5
        else if (number.startsWith('5')) {
            $("#mastercardIcon").show();
        }
    }

    