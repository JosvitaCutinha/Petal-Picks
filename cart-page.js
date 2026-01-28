// Cart page functionality
let cart = JSON.parse(localStorage.getItem('flowerCart')) || [];

// Initialize cart page when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartCount();
});

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');
    const cartContent = document.querySelector('.cart-content');

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCartDiv.style.display = 'block';
        return;
    }

    cartContent.style.display = 'grid';
    emptyCartDiv.style.display = 'none';

    let cartHTML = '<h3 style="margin-bottom: 20px; color: #333; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">Your Items</h3>';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        // Create a more descriptive product name based on image
        const productImageName = item.image.split('/').pop().split('.')[0];
        const displayName = `${item.name} (${productImageName})`;
        
        cartHTML += `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                <div class="item-details">
                    <h4>${displayName}</h4>
                    <div class="item-price">$${item.price.toFixed(2)} each</div>
                    <div class="item-discount">${item.discount} discount</div>
                    <div class="item-id" style="font-size: 0.8rem; color: #999;">ID: ${item.uniqueId || productImageName}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
                <button class="remove-btn" onclick="removeItem(${index})" title="Remove ${displayName}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    updateSummary();
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCart();
        loadCartItems();
        updateCartCount();
        showUpdateMessage('Cart updated');
    }
}

function removeItem(index) {
    if (cart[index]) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        loadCartItems();
        updateCartCount();
        showUpdateMessage(`${itemName} removed from cart`);
    }
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        loadCartItems();
        updateCartCount();
        showUpdateMessage('Cart cleared');
    }
}

function updateSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Update page title with item count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.title = `Shopping Cart (${totalItems}) - Flower Web`;
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    
    if (totalItems > 0) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = 'flex';
    } else {
        cartCountElement.style.display = 'none';
    }
}

function saveCart() {
    localStorage.setItem('flowerCart', JSON.stringify(cart));
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.08;
    const shipping = total > 50 ? 0 : 5.99;
    const finalTotal = total + tax + shipping;
    
    alert(`Thank you for your order!\n\nOrder Summary:\nSubtotal: $${total.toFixed(2)}\nTax: $${tax.toFixed(2)}\nShipping: ${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}\nTotal: $${finalTotal.toFixed(2)}\n\nYour order will be processed shortly.`);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    loadCartItems();
    updateCartCount();
}

function showUpdateMessage(message) {
    // Create and show a temporary message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'update-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
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

    document.body.appendChild(messageDiv);

    // Remove message after 2 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 2000);
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
`;
document.head.appendChild(style);