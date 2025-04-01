// Variables globales
let productosData = null;

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
                            <a href="javascript:void(0);" onclick="abrirModal('${producto.nombre}', '${producto.imagen}', '${producto.descripcion}', ${JSON.stringify(producto.sabores).replace(/"/g, '&quot;')}, ${producto.precio})">
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
function abrirModal(nombre, imagen, descripcion, sabores, precio) {
    document.getElementById('modalTitle').textContent = nombre;
    document.getElementById('modalImage').src = imagen;
    document.getElementById('modalDescription').textContent = descripcion;
    
    const saboresList = document.getElementById('saboresList');
    saboresList.innerHTML = '';
    sabores.forEach(sabor => {
        const li = document.createElement('li');
        li.textContent = sabor;
        saboresList.appendChild(li);
    });
    
    document.getElementById('precioValue').textContent = precio.toFixed(2);
    document.getElementById('customModal').style.display = 'flex';
}

// Cerrar modal
function closeModal() {
    document.getElementById('customModal').style.display = 'none';
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

// Make sure your gallery items are properly contained
$(document).ready(function() {
    // After your items load
    $('.portfolio-container').imagesLoaded(function() {
      // Initialize isotope after all images are loaded
      $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });
    });
  });