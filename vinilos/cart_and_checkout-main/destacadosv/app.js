let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', function() {
    if (cart.style.right == '-100%') {
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', function() {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});

let products = null;

// Get data from the JSON file
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
    });

let listCart = [];

// Restore the cart from cookies on page load
function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    } else {
        listCart = [];
    }
    // Update the cart UI after restoring the cart
    addCartToHTML();
}
checkCart();

function addCart($idProduct) {
    let productsCopy = JSON.parse(JSON.stringify(products));

    // If this product is not in the cart
    if (!listCart[$idProduct]) {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    } else {
        // If this product is already in the cart, increase its quantity
        listCart[$idProduct].quantity++;
    }

    // Save the updated cart to cookies
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    addCartToHTML();
}

function addCartToHTML() {
    // Clear current cart display
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    // Select the totalQuantity div in the header
    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    // If the cart has products
    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                // Add each product to the cart display
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = `
                    <img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div>MEDIDAS: ${product.details}</div>
                        <div class="price">$${product.price} / 1 PRODUCTO</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);

                // Increment total quantity
                totalQuantity += product.quantity;
            }
        });
    }

    // Update the total quantity display in the header
    totalHTML.innerText = totalQuantity > 0 ? `${totalQuantity}` : '';
}

function changeQuantity($idProduct, $type) {
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;
            // Remove the product if its quantity drops to 0 or below
            if (listCart[$idProduct].quantity <= 0) {
                delete listCart[$idProduct];
            }
            break;
        default:
            break;
    }

    // Save the updated cart to cookies
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    // Update the cart display
    addCartToHTML();
}

// Load products and set up event listeners
fetch('product.json')
    .then(response => response.json())
    .then(productsData => {
        const productsContainer = document.querySelector('.listProduct');
        productsData.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('item');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <div class="price">$${product.price.toFixed(2)}</div><br>
                <div class="details">MEDIDAS: ${product.details}</div>
                <button class="add-to-cart" data-id="${product.id}">AGREGAR AL CARRITO</button>
            `;
            productsContainer.appendChild(productElement);
        });

        // Add event listeners to "AGREGAR AL CARRITO" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                addCart(productId);
            });
        });

        // Set up search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const items = document.querySelectorAll('.listProduct .item');
            items.forEach(item => {
                const productName = item.querySelector('h2').textContent.toLowerCase();
                if (productName.includes(filter)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
    });
