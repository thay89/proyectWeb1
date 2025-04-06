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
function agregarCarrito(nombre, categoria) {
   fetch('json/galeria.json')
   .then(res => res.json())
   .then(data => {
    let producto = data.productos.find(p => p.categoria === categoria).items.find(p => p.nombre === nombre);
    if(producto) {
        carrito.push({
            id: Date.now(),
            imagen: producto.imagen,
            nombre: producto.nombre,
            precio: producto.precio
        });
        guardarCarrito();
    }
   })
   .catch(err => console.error("Error al cargar el producto", err));
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
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    mostrar();
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
                    <button onclick="eliminarProd(${item.id})" class="btn-eliminar">Eliminar</button>
                </div>
            `;
            
            contenedorCarrito.appendChild(productoElement);
        });
        
        if (totalElement) {
            totalElement.textContent = calcularTotal();
        }
    }
}

function procesarPago() {
    alert("Pago procesado: $" + calcularTotal());
    vaciarCarrito();
    cerrarModalCarrito();
}