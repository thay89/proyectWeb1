function openModal(imageSrc, title, description) {
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('customModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Function to close the modal
function closeModal() {
    document.getElementById('customModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling when modal is closed
}

// Function to handle the order button
function orderItem() {
    // Add your order functionality here
    // For example, you could redirect to a contact page or open a form
    alert('¡Gracias por tu interés en ordenar este producto! Te contactaremos pronto.');
    // Alternatively, you could redirect to a contact page:
    // window.location.href = 'contact.html';
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('customModal')) {
        closeModal();
    }
}

$(document).ready(function() {
    // This will prevent the default lightbox behavior
    $('a[data-lightbox]').off('click');
});

// Load products from JSON data
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

// Load products from JSON file
function loadProducts() {
    // Carga el JSON desde una carpeta específica del proyecto
    fetch('json/galeria.json')  // Ajusta esta ruta según la estructura de tu proyecto
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
            initializeIsotope();
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
            // Fallback a datos de ejemplo si la carga falla
            useBackupData();
        });
}

// Función de respaldo si la carga del JSON falla
function useBackupData() {
    const mockData = {
        "productos": [
            {
                "categoria": "Pastelería",
                "items": [
                    {
                        "id": "1",
                        "nombre": "Pastel de Chocolate",
                        "imagen": "img/portfolio-1.jpg",
                        "descripcion": "Delicioso pastel de chocolate con tres capas y cubierta de ganache.",
                        "sabores": ["Chocolate", "Trufa", "Avellana"],
                        "precio": 15.0
                    },
                    {
                        "id": "6",
                        "nombre": "Cupcakes de Vainilla",
                        "imagen": "img/portfolio-2.jpg",
                        "descripcion": "Cupcakes de vainilla con crema de mantequilla y decoraciones artesanales.",
                        "sabores": ["Vainilla", "Fresa", "Red Velvet"],
                        "precio": 3.0
                    }
                ]
            },
            {
                "categoria": "Repostería",
                "items": [
                    {
                        "id": "7",
                        "nombre": "Galletas Decoradas",
                        "imagen": "img/portfolio-1.jpg",
                        "descripcion": "Galletas de mantequilla decoradas a mano con glaseado real.",
                        "sabores": ["Vainilla", "Chocolate"],
                        "precio": 2.5
                    }
                ]
            },
            {
                "categoria": "Mesas Dulces",
                "items": [
                    {
                        "id": "13",
                        "nombre": "Mesa Dulce de Bodas",
                        "imagen": "img/portfolio-1.jpg",
                        "descripcion": "Mesa dulce elegante con variedad de postres para bodas.",
                        "sabores": ["Chocolate", "Frutas", "Crema"],
                        "precio": 100.0
                    }
                ]
            }
        ]
    };
    displayProducts(mockData);
    initializeIsotope();
}

// Display products in the gallery
function displayProducts(data) {
    const galleryContainer = document.getElementById('product-gallery');
    galleryContainer.innerHTML = '';
    
    data.productos.forEach(categoria => {
        const categoryClass = categoria.categoria.toLowerCase().replace(/\s+/g, '-');
        
        categoria.items.forEach(item => {
            // Create gallery item
            const productDiv = document.createElement('div');
            productDiv.className = `col-lg-4 col-md-6 portfolio-item ${categoryClass}`;
            
            // Create inner HTML structure
            productDiv.innerHTML = `
                <div class="position-relative overflow-hidden">
                    <img class="img-fluid" src="${item.imagen}" alt="${item.nombre}">
                    <a class="portfolio-btn" href="javascript:void(0)" onclick="openModalWithJSON('${item.id}')">
                        <i class="fa fa-eye text-primary" style="font-size: 60px;"></i>
                    </a>
                </div>
            `;
            
            galleryContainer.appendChild(productDiv);
        });
    });
    
    // Store the data in a global variable for later use
    window.productData = data;
}

// Initialize Isotope for filtering
function initializeIsotope() {
    // Wait a moment for images to load
    setTimeout(function() {
        $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        $('#portfolio-flters li').on('click', function() {
            $("#portfolio-flters li").removeClass('active');
            $(this).addClass('active');

            $('.portfolio-container').isotope({
                filter: $(this).data('filter')
            });
        });
    }, 300);
}

// Open modal with data from JSON
function openModalWithJSON(productId) {
    // Find the product in the data
    let foundProduct = null;
    
    window.productData.productos.forEach(categoria => {
        categoria.items.forEach(item => {
            if (item.id === productId) {
                foundProduct = item;
            }
        });
    });
    
    if (foundProduct) {
        // Set modal content
        document.getElementById('modalImage').src = foundProduct.imagen;
        document.getElementById('modalTitle').innerText = foundProduct.nombre;
        document.getElementById('modalDescription').innerText = foundProduct.descripcion;
        
        // Set sabores (flavors)
        const saboresList = document.getElementById('saboresList');
        saboresList.innerHTML = '';
        foundProduct.sabores.forEach(sabor => {
            const li = document.createElement('li');
            li.textContent = sabor;
            saboresList.appendChild(li);
        });
        
        // Set price
        document.getElementById('precioValue').innerText = foundProduct.precio.toFixed(2);
        
        // Show modal
        document.getElementById('customModal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
        console.error('Product not found with ID:', productId);
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById('customModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling when modal is closed
}

// Function to handle the order button
function orderItem() {
    // Add your order functionality here
    alert('¡Gracias por tu interés en ordenar este producto! Te contactaremos pronto.');
    // Alternatively, you could redirect to a contact page:
    // window.location.href = 'contact.html';
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('customModal')) {
        closeModal();
    }
}

// Disable default lightbox behavior
$(document).ready(function() {
    // This will prevent the default lightbox behavior
    $('a[data-lightbox]').off('click');
});

function initializeIsotope() {
    // Espera a que las imágenes se carguen
    imagesLoaded('.portfolio-container', function() {
        $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });
    });
}