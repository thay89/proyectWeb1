let carrito= [];
cargarCarrito();

function agregarCarrito(nombre, categoria){
   fetch('json/galeria.json')
   .then(res => res.json())
   .then(data => {
    let producto = data.productos.find(p => p.categoria === categoria).items.find( p => p.nombre === nombre)
    if(producto){
        carrito.push({nombre: producto.nombre, precio: producto.precio})
        guardarCarrito();
    } else {
        console.log("No se encontro el producto");
    }
   })
   .catch(err => console.error("Error ak cargar el producto", err))
}


function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function cargarCarrito(){
   let c= localStorage.getItem("carrito");
   if(c){
        carrito = JSON.parse(c);
        console.log(carrito);
   }
   contador();
}

function contador(){
    let contador= document.getElementById("contCarrito");
    contador.textContent= carrito.reduce((cont,item) => cont+1,0);
}

function eliminarProd(id){
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    contador();
}

function vaciarCarrito(){
    carrito = [];
    guardarCarrito();
    contador();
}

function mostrar(){
    
}