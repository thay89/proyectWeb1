// Variables globales
let productosData = null;
let productoActual = null;
let saborSeleccionado = "";
let cantidadSeleccionada = 1;

// Inicializar la página cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    actualizarContadorCarrito();
    
    // Manejar filtrado por hash en la URL
    setTimeout(function() {
        const hash = window.location.hash.substring(1);
        if(hash) {
            const filterButton = document.querySelector(`[data-filter=".${hash}"]`);
            if(filterButton) filterButton.click();
        }
    }, 100);
});

// Cargar productos desde JSON
function cargarProductos() {
    fetch('json/galeria.json')
        .then(response => response.json())
        .then(data => {
            productosData = data;
            mostrarProductos('*');
            configurarFiltros();
            configurarBusqueda();
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

// Configurar funcionalidad de búsqueda
function configurarBusqueda() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (!searchInput || !searchButton) return;
    
    // Buscar al hacer clic en el botón
    searchButton.addEventListener('click', () => buscarProductos(searchInput.value));
    
    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') buscarProductos(searchInput.value);
    });
    
    // Buscar mientras se escribe (con debounce para optimizar)
    let debounceTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            buscarProductos(searchInput.value);
        }, 500);
    });
}

// Función de búsqueda de productos
function buscarProductos(query) {
    if (!query || query.trim() === '') {
        mostrarProductos('*');
        return;
    }
    
    query = query.toLowerCase().trim();
    const galeria = document.getElementById('product-gallery');
    galeria.innerHTML = '';
    let resultadosEncontrados = false;
    
    // Buscar coincidencias en todos los productos
    productosData.productos.forEach(categoria => {
        categoria.items.forEach(producto => {
            if (producto.nombre.toLowerCase().includes(query)) {
                resultadosEncontrados = true;
                const itemElement = crearElementoProducto(producto, categoria.categoria, query);
                galeria.appendChild(itemElement);
            }
        });
    });
    
    // Mostrar mensaje si no hay resultados
    if (!resultadosEncontrados) {
        mostrarMensajeNoResultados(galeria, query);
    }
    
    // Reiniciar isotope
    actualizarIsotope();
}

// Crear elemento HTML para un producto
function crearElementoProducto(producto, categoria, queryResaltar = null) {
    const itemElement = document.createElement('div');
    itemElement.className = `col-lg-4 col-md-6 mb-4 portfolio-item ${categoria}`;
    
    // Resaltar texto si es una búsqueda
    let nombreMostrado = producto.nombre;
    if (queryResaltar) {
        nombreMostrado = producto.nombre.replace(
            new RegExp(queryResaltar, 'gi'),
            match => `<span class="highlight">${match}</span>`
        );
    }
    
    itemElement.innerHTML = `
        <div class="position-relative overflow-hidden mb-2">
            <img class="img-fluid w-100" src="${producto.imagen}" alt="${producto.nombre}">
            <div class="portfolio-btn d-flex align-items-center justify-content-center">
                <a href="javascript:void(0);" onclick="abrirModal('${producto.id}', '${categoria}')">
                    <i class="fa fa-eye text-white" style="font-size: 60px;"></i>
                </a>
            </div>
        </div>
        <h6 class="text-center mt-2">${nombreMostrado}</h6>
    `;
    
    return itemElement;
}

// Mostrar mensaje de no resultados
function mostrarMensajeNoResultados(contenedor, query) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results col-12';
    noResults.innerHTML = `
        <p>No se encontraron productos que coincidan con "<strong>${query}</strong>"</p>
        <button class="btn btn-outline-primary mt-2" onclick="mostrarProductos('*')">Ver todos los productos</button>
    `;
    contenedor.appendChild(noResults);
}

// Mostrar productos en la galería
function mostrarProductos(filtro = '*') {
    const galeria = document.getElementById('product-gallery');
    galeria.innerHTML = '';
    galeria.style.height = 'auto';
    if (!productosData) return;
    
    productosData.productos.forEach(categoria => {
        if (filtro === '*' || filtro === categoria.categoria) {
            categoria.items.forEach(producto => {
                const itemElement = crearElementoProducto(producto, categoria.categoria);
                galeria.appendChild(itemElement);
            });
        }
    });
    
    actualizarIsotope();
}

// Configurar eventos de filtrado
function configurarFiltros() {
    const filtros = document.querySelectorAll('#portfolio-flters li');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            filtros.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const valor = this.getAttribute('data-filter').substring(1);
            mostrarProductos(valor === '' ? '*' : valor);
            
            // Limpiar búsqueda al cambiar filtro
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
        });
    });
}

// Actualizar Isotope para reorganizar elementos
function actualizarIsotope() {
    if (window.jQuery && $('.portfolio-container').length) {
        setTimeout(function() {
            $('.portfolio-container').imagesLoaded(function() {
                if ($('.portfolio-container').data('isotope')) {
                    $('.portfolio-container').isotope('destroy');
                }
                $('.portfolio-container').isotope({
                    itemSelector: '.portfolio-item',
                    layoutMode: 'fitRows'
                });
            });
        }, 100);
    }
}

// Abrir modal con información del producto
function abrirModal(id, categoria) {
    let producto = buscarProductoPorId(id, categoria);
    if (!producto) return;
    
    productoActual = producto;
    
    document.getElementById('modalTitle').textContent = producto.nombre;
    document.getElementById('modalImage').src = producto.imagen;
    document.getElementById('modalDescription').textContent = producto.descripcion;
    
    // Configurar selector de sabores
    const saboresContainer = document.getElementById('modalSabores');
    saboresContainer.innerHTML = '<h4>Selecciona un sabor:</h4>';
    
    const saborSelect = document.createElement('select');
    saborSelect.id = 'saborSelect';
    saborSelect.className = 'form-control';
    saborSelect.style = 'width: 100%; margin-top: 5px;';
    
    producto.sabores.forEach(sabor => {
        const option = document.createElement('option');
        option.value = sabor;
        option.textContent = sabor;
        saborSelect.appendChild(option);
    });
    
    saboresContainer.appendChild(saborSelect);
    
    // Configurar cantidad
    const cantidadInput = document.getElementById('cantidadInput');
    cantidadInput.value = 1;
    
    // Mostrar precio y botones
    document.getElementById('precioValue').textContent = producto.precio.toFixed(2);
    document.getElementById('customModal').style.display = 'flex';
    document.getElementById("modalButtons").innerHTML = `
        <button id="btn-order" class="btn-order" onclick="agregarCarrito('${producto.id}','${categoria}')">Ordenar</button>
        <button class="btn-close" onclick="closeModal()">Cerrar</button>
    `;
}

// Buscar producto por ID
function buscarProductoPorId(id, categoria) {
    if (categoria) {
        const categoriaObj = productosData.productos.find(p => p.categoria === categoria);
        if (categoriaObj) {
            return categoriaObj.items.find(p => p.id === id);
        }
    } else {
        for (const cat of productosData.productos) {
            const foundProduct = cat.items.find(p => p.id === id);
            if (foundProduct) return foundProduct;
        }
    }
    return null;
}

// Configurar selector de sabores
function configurarSelectorSabores(producto) {
    const saboresContainer = document.getElementById('modalSabores');
    saboresContainer.innerHTML = '<h4>Selecciona un sabor:</h4>';
    
    const saborSelect = document.createElement('select');
    saborSelect.id = 'saborSelect';
    saborSelect.className = 'form-control';
    saborSelect.style = 'width: 100%; margin-top: 5px;';
    
    producto.sabores.forEach(sabor => {
        const option = document.createElement('option');
        option.value = sabor;
        option.textContent = sabor;
        saborSelect.appendChild(option);
    });
    
    saborSelect.addEventListener('change', function() {
        saborSeleccionado = this.value;
    });
    
    saboresContainer.appendChild(saborSelect);
    
    // Establecer primer sabor por defecto
    if (producto.sabores.length > 0) {
        saborSeleccionado = producto.sabores[0];
    }
}

// Configurar contador de cantidad
function configurarCantidad() {
    const cantidadInput = document.getElementById('cantidadInput');
    cantidadInput.value = 1;
    cantidadSeleccionada = 1;
    
    cantidadInput.addEventListener('change', function() {
        cantidadSeleccionada = parseInt(this.value);
    });
}

// Cerrar modal
// Reemplaza la función existente con esto:
function cerrarModal() {
    document.getElementById('customModal').style.display = 'none';
}
// Asegura disponibilidad global con ambos nombres
window.cerrarModal = cerrarModal;
window.closeModal = cerrarModal; // Para compatibilidad con el HTML existente

function agregarCarrito() {
    if (!saborSeleccionado || cantidadSeleccionada < 1) {
        alert('Por favor selecciona un sabor y una cantidad válida');
        return;
    }
    
    const productoConSabor = {
        id: productoActual.id,
        nombre: productoActual.nombre,
        precio: productoActual.precio,
        imagen: productoActual.imagen,
        saborElegido: saborSeleccionado,
        cantidad: cantidadSeleccionada
    };
    
    addToCart(productoConSabor);
    cerrarModal();
}

// Función para agregar al carrito
function addToCart(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const index = carrito.findIndex(item => 
        item.id === producto.id && item.saborElegido === producto.saborElegido
    );
    
    if (index !== -1) {
        carrito[index].cantidad += producto.cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            saborElegido: producto.saborElegido,
            cantidad: producto.cantidad
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    alert(`${producto.cantidad} ${producto.nombre} (${producto.saborElegido}) agregado al carrito`);
}

// Actualizar el contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('contCarrito').textContent = totalItems;
}

// Funciones del carrito modal
function abrirModalCarrito() {
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
        modalCarrito.style.display = 'block';
        actualizarContenidoCarrito();
    }
}

function cerrarModalCarrito() {
    document.getElementById('modal-carrito').style.display = 'none';
}

// Actualizar contenido del carrito
function actualizarContenidoCarrito() {
    const contenedorCarrito = document.getElementById('contenedor-carrito');
    const totalElement = document.getElementById('carrito-total');
    
    if (!contenedorCarrito || !totalElement) return;
    
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    contenedorCarrito.innerHTML = '';
    
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        totalElement.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <div class="item-imagen">
                <img src="${item.imagen}" alt="${item.nombre}">
            </div>
            <div class="item-detalles">
                <h4>${item.nombre}</h4>
                <p>Sabor: ${item.saborElegido}</p>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Precio: $${item.precio.toFixed(2)}</p>
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
            </div>
            <div class="item-eliminar">
                <button onclick="eliminarDelCarrito(${index})">×</button>
            </div>
        `;
        
        contenedorCarrito.appendChild(itemElement);
    });
    
    totalElement.textContent = total.toFixed(2);
}

// Eliminar ítem del carrito
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        actualizarContenidoCarrito();
        actualizarContadorCarrito();
    }
}

// Vaciar carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    actualizarContenidoCarrito();
    actualizarContadorCarrito();
}

// Inicializar isotope cuando las imágenes están listas
$(document).ready(function() {
    $('.portfolio-container').imagesLoaded(function() {
      $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });
    });
});

