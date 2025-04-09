let carrito = [];
cargarCarrito();

// Funciones para el modal
function abrirModalCarrito() {
    document.getElementById('modal-carrito').style.display = 'block';
    mostrar();
}

function cerrarModalCarrito() {
    document.getElementById('modal-carrito').style.display = 'none';
}

// Funciones del carrito
function agregarCarrito(id, categoria) {
    const categoriaObj = productosData.productos.find(p => p.categoria === categoria);
    if (!categoriaObj) return;

    const producto = categoriaObj.items.find(p => p.id === id);
    if (!producto) return;

    const existe = carrito.some(item => item.id === id);
    
    // Mostrar notificación
    const mensaje = existe 
        ? 'Este producto ya está en tu carrito' 
        : `¡${producto.nombre} agregado!`;
    const tipo = existe ? 'warning' : 'success';
    
    mostrarNotificacionCentrada(mensaje, tipo);

    if (!existe) {
        carrito.push({
            id: producto.id,
            imagen: producto.imagen,
            nombre: producto.nombre,
            precio: producto.precio
        });
        guardarCarrito();
    }
}

// Función para notificación centrada
function mostrarNotificacionCentrada(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion-centrada alert-${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    notificacion.style.cssText = `
    ${tipo === 'warning' ? 
        'background: #bf2646; border: 2px solid #9c698b;' : 
        'background: #901956; border: 2px solid #e87bb7;'
    }
`;


    setTimeout(() => {
        notificacion.classList.add('desvanecer');
        setTimeout(() => notificacion.remove(), 300);
    }, 2000);
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function cargarCarrito() {
   let c = localStorage.getItem("carrito");
   if(c) {
        carrito = JSON.parse(c);
   }
   contador();
}

function contador() {
    let contador = document.getElementById("contCarrito");
    if (contador) {
        contador.textContent = carrito.length;
    }
}

function eliminarProd(id) {
    // Filtra el carrito, manteniendo solo los productos con ID diferente
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito(); // Guarda los cambios
    mostrar(); // Actualiza la vista del carrito
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrar();
}

function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio, 0).toFixed(2);
}

function mostrar() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    const totalElement = document.getElementById("carrito-total");
    
    if (contenedorCarrito) {
        contenedorCarrito.innerHTML = "";
        
        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
            totalElement.textContent = "0.00";
            return;
        }
        
        carrito.forEach(item => {
            const productoElement = document.createElement("div");
            productoElement.className = "producto-carrito";
            
            productoElement.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" class="img-carrito">
                <div class="info-producto">
                    <h3>${item.nombre}</h3>
                    <p>$${item.precio.toFixed(2)}</p>
                     <button onclick="eliminarProd('${item.id}')" class="btn-eliminar">Eliminar</button>
                </div>
            `;
            
            contenedorCarrito.appendChild(productoElement);
        });
        
        if (totalElement) {
            totalElement.textContent = calcularTotal();
        }
    }
}

