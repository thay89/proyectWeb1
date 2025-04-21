function cargarProductos() {
    fetch('json/galeria.json')
      .then(response => response.json())
      .then(data => {
        const galeria = document.getElementById('galeria');
        galeria.innerHTML = ''; // limpiar antes de agregar
  
        // Iterar sobre las categorías y productos
        data.productos.forEach(categoria => {
          categoria.items.forEach(producto => {
            // Crear un contenedor solo con la imagen
            const imagen = document.createElement('img');
            imagen.src = producto.imagen;
            imagen.alt = 'Producto';
            imagen.style.width = '100%';  // Ajustar la imagen al contenedor
  
            // Añadir la imagen al contenedor de la galería
            galeria.appendChild(imagen);
          });
        });
      })
      .catch(error => {
        console.error('Error cargando productos:', error);
      });
  }
  
  // Cargar productos cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', cargarProductos);

  

function abrirModal(imagenSrc) {
    const modal = document.getElementById('modal-imagen');
    const imagenModal = document.getElementById('imagen-modal');
    
    imagenModal.src = imagenSrc;
    
    modal.style.display = 'flex';
}

function cerrarModal() {
    const modal = document.getElementById('modal-imagen');
    modal.style.display = 'none';
}

// Agregar evento a las imágenes generadas para abrir el modal al hacer clic
document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que las imágenes estén cargadas correctamente
    const galeria = document.getElementById('galeria');
    galeria.addEventListener('click', (event) => {
        // Verificar si el clic fue en una imagen
        if (event.target.tagName === 'IMG') {
            abrirModal(event.target.src);
        }
    });
});
