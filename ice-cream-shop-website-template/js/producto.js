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

  
