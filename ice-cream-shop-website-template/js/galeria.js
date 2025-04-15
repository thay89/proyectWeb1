let productosData = null;
let saborSeleccionado = "";
let cantidadSeleccionada = 1;
let productoActual = null;

//Filtrar desde otras pestanas
document.addEventListener('DOMContentLoaded', function() {
    // Espera a que se cargue la página
    setTimeout(function() {
        const hash = window.location.hash.substring(1);
        if(hash) {
            const filterButton = document.querySelector(`[data-filter=".${hash}"]`);
            if(filterButton) {
                filterButton.click(); 
            }
        }
    }, 100);
    
    // Inicializar el contador del carrito
    actualizarContadorCarrito();
});

// Cargar productos desde JSON
function cargarProductos() {
    fetch('json/galeria.json')
        .then(response => response.json())
        .then(data => {
            productosData = data;
            mostrarProductos('*');
            configurarFiltros();
        })
        .catch(error => console.error('Error al cargar los datos:', error));
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
                const itemElement = document.createElement('div');
                itemElement.className = `col-lg-4 col-md-6 mb-4 portfolio-item ${categoria.categoria}`;
                
                itemElement.innerHTML = `
                    <div class="position-relative overflow-hidden mb-2">
                        <img class="img-fluid w-100" src="${producto.imagen}" alt="${producto.nombre}">
                        <div class="portfolio-btn d-flex align-items-center justify-content-center">
                            <a href="javascript:void(0);" onclick="abrirModal('${producto.id}', '${categoria.categoria}')">
                                <i class="fa fa-eye text-white" style="font-size: 60px;"></i>
                            </a>
                        </div>
                    </div>
                `;
                
                galeria.appendChild(itemElement);
            });
        }
    });
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
        });
    });
}

// Abrir modal con información del producto
function abrirModal(id, categoria) {
    let producto = productosData.productos.find(p => p.categoria === categoria).items.find(p => p.id === id);
    
    if (!producto) return;
    productoActual = producto; // Guardar el producto actual
    
    document.getElementById('modalTitle').textContent = producto.nombre;
    document.getElementById('modalImage').src = producto.imagen;
    document.getElementById('modalDescription').textContent = producto.descripcion;
    
    // Cambiar la lista de sabores por un selector
    const saboresContainer = document.getElementById('modalSabores');
    saboresContainer.innerHTML = '<h4>Selecciona un sabor:</h4>';
    
    // Crear el selector de sabores
    const saborSelect = document.createElement('select');
    saborSelect.id = 'saborSelect';
    saborSelect.className = 'form-control';
    saborSelect.style = 'width: 100%; margin-top: 5px;';
    
    // Agregar los sabores como opciones
    producto.sabores.forEach(sabor => {
        const option = document.createElement('option');
        option.value = sabor;
        option.textContent = sabor;
        saborSelect.appendChild(option);
    });
    
    // Agregar evento para actualizar la variable global cuando se cambie el sabor
    saborSelect.addEventListener('change', function() {
        saborSeleccionado = this.value;
        console.log('Sabor seleccionado:', saborSeleccionado);
    });
    
    saboresContainer.appendChild(saborSelect);
    
    // Establecer el primer sabor como seleccionado por defecto
    if (producto.sabores.length > 0) {
        saborSeleccionado = producto.sabores[0];
    }
    
    // Configurar el contador de cantidad
    const cantidadInput = document.getElementById('cantidadInput');
    cantidadInput.value = 1;
    cantidadSeleccionada = 1; // Restablecer a 1 cada vez que se abre el modal
    
    cantidadInput.addEventListener('change', function() {
        cantidadSeleccionada = parseInt(this.value);
        console.log('Cantidad seleccionada:', cantidadSeleccionada);
    });
    
    document.getElementById('precioValue').textContent = producto.precio.toFixed(2);
    document.getElementById('customModal').style.display = 'flex';
    document.getElementById("modalButtons").innerHTML = `
        <button id="btn-order" class="btn-order" onclick="agregarCarrito('${producto.id}','${categoria}')" >Ordenar</button>
        <button class="btn-close" onclick="cerrarModal()">Cerrar</button>
    `;
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Agregar producto al carrito
function agregarCarrito(id, categoria) {
    // Asegurar que tengamos los valores actualizados antes de agregar al carrito
    const cantidad = cantidadSeleccionada;
    const sabor = saborSeleccionado;
    
    // Asegurar que hay un sabor seleccionado y una cantidad válida
    if (!sabor || cantidad < 1) {
        alert('Por favor selecciona un sabor y una cantidad válida');
        return;
    }
    
    // Preparar el producto con el sabor y cantidad seleccionados
    const productoConSabor = {
        id: productoActual.id,
        nombre: productoActual.nombre,
        precio: productoActual.precio,
        imagen: productoActual.imagen,
        saborElegido: sabor,
        cantidad: cantidad
    };
    
    // Agregar al carrito
    addToCart(productoConSabor);
    
    // Cerrar el modal después de agregar al carrito
    cerrarModal();
}

// Función para agregar al carrito
function addToCart(producto) {
    // Recuperar carrito actual del localStorage o inicializar nuevo
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya está en el carrito con el mismo sabor
    const index = carrito.findIndex(item => 
        item.id === producto.id && item.saborElegido === producto.saborElegido
    );
    
    if (index !== -1) {
        // Si ya existe, aumentar la cantidad
        carrito[index].cantidad += producto.cantidad;
    } else {
        // Si no existe, añadir nuevo item
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            saborElegido: producto.saborElegido,
            cantidad: producto.cantidad
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar el contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar confirmación
    alert(`${producto.cantidad} ${producto.nombre} (${producto.saborElegido}) agregado al carrito`);
}

// Actualizar el contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('contCarrito').textContent = totalItems;
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarProductos);

// Deshabilitar comportamiento lightbox
document.addEventListener('DOMContentLoaded', function() {
    const lightboxLinks = document.querySelectorAll('a[data-lightbox]');
    lightboxLinks.forEach(link => {
        link.removeAttribute('data-lightbox');
    });
});

$(document).ready(function() {
    $('.portfolio-container').imagesLoaded(function() {
      $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });
    });
});