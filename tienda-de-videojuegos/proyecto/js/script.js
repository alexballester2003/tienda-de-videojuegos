const contenedor = document.getElementById("cards-de-productos");
const listaCarrito = document.getElementById("lista-carrito");
const contador = document.getElementById("cantidad-carrito");
const total = document.getElementById("total");

// Obtener carrito
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar carrito
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto
function agregarAlCarrito(producto) {

    let carrito = obtenerCarrito();

    const existe = carrito.find(p => p.id === producto.id);

    if (existe) {

        existe.cantidad++;

    } else {
        carrito.push({...producto, cantidad: 1});
    }

    guardarCarrito(carrito);

    actualizarCarrito();

    alert(producto.nombre + " agregado al carrito.");
}

// Mostrar carrito
function actualizarCarrito() {

    const carrito = obtenerCarrito();

    listaCarrito.innerHTML = "";

    contador.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    let totalCompra = 0;

    carrito.forEach(producto => {

        totalCompra += producto.precio * producto.cantidad;

        const div = document.createElement("div");

        div.innerHTML = `
            <h4>${producto.nombre}</h4>

            <p>Precio: $${producto.precio}</p>

            <p>Cantidad: ${producto.cantidad}</p>

            <button onclick="sumarCantidad(${producto.id})">+</button>

            <button onclick="restarCantidad(${producto.id})">-</button>

            <button onclick="eliminarProducto(${producto.id})">
                Eliminar
            </button>

            <hr>
        `;

        listaCarrito.appendChild(div);

    });

    total.textContent = "TOTAL: $" + totalCompra.toLocaleString("es-AR");
}

// Aumentar cantidad
function sumarCantidad(id){

    const carrito = obtenerCarrito();

    const producto = carrito.find(p => p.id === id);

    producto.cantidad++;

    guardarCarrito(carrito);

    actualizarCarrito();

}

// Disminuir cantidad
function restarCantidad(id){

    let carrito = obtenerCarrito();

    const producto = carrito.find(p => p.id === id);

    producto.cantidad--;

    if(producto.cantidad<=0){

        carrito = carrito.filter(p=>p.id!==id);

    }

    guardarCarrito(carrito);

    actualizarCarrito();

}

// Eliminar
function eliminarProducto(id){

    let carrito = obtenerCarrito();

    carrito = carrito.filter(p=>p.id!==id);

    guardarCarrito(carrito);

    actualizarCarrito();

}

// Cargar productos

fetch("../data/productos.json")

.then(respuesta=>respuesta.json())

.then(productos=>{


    productos.forEach(producto=>{

        const card=document.createElement("div");

        card.classList.add("card");

        card.innerHTML=`

            <img src="${producto.img}" alt="${producto.nombre}">

            <h3>${producto.nombre}</h3>

            <p>${producto.descripcion}</p>

            <h4>$${producto.precio.toLocaleString("es-AR")}</h4>

            <button class="agregar">
                Agregar al carrito
            </button>

        `;

        card.querySelector("button").addEventListener("click",()=>{

            agregarAlCarrito(producto);

        });

        contenedor.appendChild(card);

    });

})

.catch(error=>{

    console.log(error);

    contenedor.innerHTML="<h2>Error al cargar productos.</h2>";

});

// Validación formulario

const formulario=document.querySelector("form");

formulario.addEventListener("submit",(e)=>{

    const nombre=document.querySelector("[name='nombre']").value;

    const email=document.querySelector("[name='email']").value;

    if(nombre.trim()==""){

        alert("Ingrese un nombre");

        e.preventDefault();

    }

    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!expresion.test(email)){

     alert("Correo inválido");

     e.preventDefault();

    }

});

// Inicializar carrito

actualizarCarrito();

// Botón vaciar carrito
document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    actualizarCarrito();
});