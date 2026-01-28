// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('flowerCart')) || [];
let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

// Initialize cart functionality when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeCart();
});

function initializeCart() {
    // Add click event listeners to all "add to cart" buttons
    const cartButtons = document.querySelectorAll('.cart-btn');
    cartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            addToCart(this);
        });
    });

    // Add cart icon click event to redirect to cart page
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }

    updateCartDisplay();
}

function addToCart(button) {
    // Find the product box containing this button
    const productBox = button.closest('.box');

    // Extract product information
    const productName = productBox.querySelector('h3').textContent;
    const productPrice = productBox.querySelector('.price').textContent.split('$')[1].split(' ')[0];
    const productImage = productBox.querySelector('img').src;
    const discount = productBox.querySelector('.discount').textContent;

    // Create unique product identifier based on image source
    const productId = productImage.split('/').pop().split('.')[0]; // Extract filename without extension

    // Create product object
    const product = {
        id: productId + '_' + Date.now(), // More unique ID
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
        discount: discount,
        quantity: 1,
        uniqueId: productId // For identifying same products
    };

    // Check if product already exists in cart (same image = same product)
    const existingProduct = cart.find(item => item.uniqueId === product.uniqueId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    saveCart();
    updateCartDisplay();
    showAddedToCartMessage(product.name);
}

function saveCart() {
    localStorage.setItem('flowerCart', JSON.stringify(cart));
}

function updateCartDisplay() {
    // Update cart count in the shopping cart icon
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        // Remove existing count badge if any
        const existingBadge = cartIcon.parentElement.querySelector('.cart-count');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Add new count badge if cart has items
        if (cartCount > 0) {
            const countBadge = document.createElement('span');
            countBadge.className = 'cart-count';
            countBadge.textContent = cartCount;
            countBadge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            `;
            cartIcon.parentElement.style.position = 'relative';
            cartIcon.parentElement.appendChild(countBadge);
        }
    }
}

function showAddedToCartMessage(productName) {
    // Create and show a temporary message
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.textContent = `${productName} added to cart!`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

function showCart() {
    // Create cart modal
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    cartContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        width: 90%;
    `;

    let cartHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #333;">Shopping Cart (${cartCount} items)</h2>
            <button class="close-cart" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
    `;

    if (cart.length === 0) {
        cartHTML += '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
    } else {
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartHTML += `
                <div class="cart-item" style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #333;">${item.name}</h4>
                        <p style="margin: 0; color: #666;">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0; font-weight: bold; color: #27ae60;">$${itemTotal.toFixed(2)}</p>
                        <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px; font-size: 12px;">Remove</button>
                    </div>
                </div>
            `;
        });

        cartHTML += `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #333;">Total: $${total.toFixed(2)}</h3>
                    <button onclick="clearCart()" style="background: #e74c3c; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">Clear Cart</button>
                </div>
                <button style="width: 100%; background: #27ae60; color: white; border: none; padding: 15px; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">Proceed to Checkout</button>
            </div>
        `;
    }

    cartContent.innerHTML = cartHTML;
    cartModal.appendChild(cartContent);
    document.body.appendChild(cartModal);

    // Close cart when clicking outside or on close button
    cartModal.addEventListener('click', function (e) {
        if (e.target === cartModal || e.target.classList.contains('close-cart')) {
            document.body.removeChild(cartModal);
        }
    });
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        const product = cart[productIndex];
        cartCount -= product.quantity;
        cart.splice(productIndex, 1);
        updateCartDisplay();

        // Close and reopen cart to refresh
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal) {
            document.body.removeChild(cartModal);
            showCart();
        }
    }
}

function clearCart() {
    cart = [];
    cartCount = 0;
    updateCartDisplay();

    // Close and reopen cart to refresh
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        document.body.removeChild(cartModal);
        showCart();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .cart-item:hover {
        background-color: #f8f9fa;
    }
    
    .cart-content {
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);