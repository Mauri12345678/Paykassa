// JavaScript for managing the shopping cart functionality

let cart = [];

// Function to add an item to the cart
function addToCart(productId, productName, productPrice) {
    const item = { id: productId, name: productName, price: productPrice, quantity: 1 };
    const existingItem = cart.find(cartItem => cartItem.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    updateCartDisplay();
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    cart = cart.filter(cartItem => cartItem.id !== productId);
    updateCartDisplay();
}

// Function to calculate the total price of the cart
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Function to update the cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        cartContainer.appendChild(itemElement);
    });

    const totalElement = document.createElement('div');
    totalElement.textContent = `Total: $${calculateTotal()}`;
    cartContainer.appendChild(totalElement);
}

// Function to clear the cart
function clearCart() {
    cart = [];
    updateCartDisplay();
}