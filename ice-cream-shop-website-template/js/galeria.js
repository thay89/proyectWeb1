// Variables globales
let productosData = null;

//Filtrar desde otras pestanas
document.addEventListener('DOMContentLoaded', function() {
    // Espera a que se cargue la página
    setTimeout(function() {
        const hash = window.location.hash.substring(1);
        if(hash) {
            const filterButton = document.querySelector(`[data-filter=".${hash}"]`);
            if(filterButton) {
                filterButton.click(); // Simula clic en el filtro
            }
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
    console.log(producto);

    const nombre = producto.nombre;
    const imagen = producto.imagen;
    const descripcion = producto.descripcion;
    const precio = producto.precio;
    const sabores = producto.sabores;
    document.getElementById('modalTitle').textContent = producto.nombre;
    document.getElementById('modalImage').src = producto.imagen;
    document.getElementById('modalDescription').textContent = producto.descripcion;
    
    const saboresList = document.getElementById('saboresList');
    saboresList.innerHTML = '';
    sabores.forEach(sabor => {
        const li = document.createElement('li');
        li.textContent = sabor;
        saboresList.appendChild(li);
    });
    
    document.getElementById('precioValue').textContent = precio.toFixed(2);
    document.getElementById('customModal').style.display = 'flex';
    document.getElementById("modalButtons").innerHTML = `<button id="btn-order" class="btn-order" onclick="agregarCarrito('${producto.id}','${categoria}' )" >Ordenar</button>
                    <button class="btn-close" onclick="cerrarModal()">Cerrar</button>`;
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
    }
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

