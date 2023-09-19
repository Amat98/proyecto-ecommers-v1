//* URL base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
//*Dibujar productos en la web.
const productsList = document.querySelector("#products-container");
//* Mostrar y ocultar carrito
const navToggle = document.querySelector(".nav__button--toggle");
const navCar = document.querySelector(".nav__car");
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list")
//* Array carrito
//? Necesitamos tener un array que reciba los elementos que debo introducir en el carrito de compras.
let carProducts = [];
//* Ventana Modal
const modalContainer = document.querySelector("#modal-container");
const modalElement = document.querySelector("#modal-element");
let modalDetails = [];
//*carrito desplegable */
navToggle.addEventListener("click", () => {
    navCar.classList.toggle("nav__car--visible")
})

eventListenersLoader(); // >> se pone primero para que escuche todo antes de que se realicen las funciones

function eventListenersLoader(){
    //* Escucha cuando se presiona el boton *Add to car"
    productsList.addEventListener("click", addProduct);
    //* Cuando se presione el boton "Delete"
    car.addEventListener("click", deleteProduct);
    //* Listeners Modal.
    //* cuando se de click al boton de detalles.
    productsList.addEventListener("click", modalProduct)
    //* cuando se da click en cerrar
    modalContainer.addEventListener("click", closeModal)
}

//* hacer peticion a la API de productos.
//* 1.- Crear una funcion con la peticion.
function getProducts() {
    axios.get(baseUrl)
        .then((response) => {
            const products = response.data
            // console.log(products);
            printProducts(products);
        })
        .catch((error) => {
            console.log(error);
        })
}
getProducts();
//* 2.- Renderizar los productos capturados de la API en el HTML.
function printProducts(products) {
    let html = '';
    for(let product of products) {
        html += `
        <div class="products__element">
            <img src="${product.image}" alt="product_img" class="products__img">
            <p class="products__name">${product.name}</p>
            <div class="products__div">
                <p class="products__usd">USD: </p>
                <p class="products__price">${product.price.toFixed(2)}</p>
            </div>
            <div class="products__div products__div--flex">
                <button data-id="${product.id}" class="products__button add_car">
                    Add Car
                </button>
                <button data-id="${product.id}" data-stock="${product.quantity}" data-description="${product.description}" data-category="${product.category}" class="products__button products__button--search products__details">
                    Details
                </button>
            </div>    
        </div>

        `
    }
    productsList.innerHTML = html;
}
//*Agregar los productos al carrito
//*1.- Capturar la informacion delm producto que se da click.
function addProduct(event){
    //* Metodo contains >> valida si existe un elemento dentro de la clase.
    if(event.target.classList.contains("add_car")){
        const product = event.target.parentElement.parentElement;
        //* parentElement >> es para acceder al padre del elemento
        carProductsElements(product);
    }
}

//* 2. Debemos transformar la informacion HTML a un array de objetos.
//* 2.1 debo validar si el elemento seleccionado ya se encuentra dentro del array del carrito (carProducts). si existe, le debo sumar una unidad para que no se repida
function carProductsElements(product){
    const infoProduct = {
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector(".products__element p").textContent,
        price: product.querySelector(".products__price").textContent,
        quantity: 1
    }
    // console.log(infoProduct)
    //* Agregar el objeto de infoProduct al arrayn de carProducts, pero hay que validar si el elemento existe o no.
    //? El primer if valida si por lo menos el primer elemento que se encuentre en carProducts es igual al que quiero enviarle en infoProducts.
    if(carProducts.some(product => product.id === infoProduct.id)){
        const productIncrement = carProducts.map(product => {
            if(product.id === infoProduct.id){
                product.quantity++;
                return product;
            } else {
                return product;
            }
        })
        carProducts = [...productIncrement];
    } else {
        carProducts = [...carProducts, infoProduct] // >> tambien se puede utilizar el spread operator en este caso se utiliza para infoProduct(objeto)
    }
    carElementsHTML();
}

function carElementsHTML(){
    let carHTML = '';
    for(let product of carProducts) {
        carHTML += `
            <div class="car__product">
                <div class="car__product__image">
                    <img src="${product.image}">
                </div>
                <div class="car__product__description">
                    <p>${product.name}</p>
                    <div class="car__div">
                        <p class="products__usd">USD: </p>
                        <p class="products__price">${product.price}</p>
                    </div>
                    <p>Quantity: ${product.quantity}</p>
                </div>
                <div class="car__product__button">
                    <button class="delete__product" data-id="${product.id}">
                        Delete
                    </button>
                </div>
            </div>
            
        `
    }
    carList.innerHTML = carHTML;
}

//* Eliminar productos del carrito
function deleteProduct(event){
    if(event.target.classList.contains("delete__product")){
        const productId = event.target.getAttribute("data-id");
        carProducts = carProducts.filter(product => product.id != productId);
        carElementsHTML();
    }
}
//* Modal >>
//* Ventana modal
//* 1.- Crear funcion que escuche el boton del producto.
function modalProduct(event) {
    if(event.target.classList.contains("products__details")){
        modalContainer.classList.add("modal--block");
        const product = event.target.parentElement.parentElement;
        modalDetailsElement(product);
    }
}

//* 2.- Crear funcion que escuche el boton de cierre.
function closeModal(evet){
    if(evet.target.classList.contains("modal__icon")){
        modalContainer.classList.remove("modal--block")
    }
}

//* 3.- Crear funcion que convierta la info HTML en objeto.
function modalDetailsElement(product){
    const infoDetails = {
        id: product.querySelector("button").getAttribute("data-id"),
        image: product.querySelector("img").src,
        name: product.querySelector(".products__element p").textContent,
        price: product.querySelector(".products__price").textContent,
        description: product.querySelector(".products__details").getAttribute("data-description"),
        category: product.querySelector(".products__details").getAttribute("data-category"),
        stock: product.querySelector(".products__details").getAttribute("data-stock")
    }
    modalDetails = [ ...modalDetails, infoDetails];
    modalHTML();
}

//* 4.- Dibujar producto dentro del modal.
function modalHTML(){
    let detailsHTML = "";
    for(let element of modalDetails){
        detailsHTML = `
        <img src="${element.image}" class="modal__img">
        <div class="modal__div">
            <p class="modal__div--name">${element.name}</p>
            <p class="modal__div--description">${element.description}</p>
            <div class="modal__flex">
                <p>Category: ${element.category}</p>
                <p>Stock:${element.stock}</p>
            </div>
        </div>
        `
    }
    modalElement.innerHTML = detailsHTML;
}





