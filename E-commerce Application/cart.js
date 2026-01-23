// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const cartCountElement = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart page
function initCartPage() {
  updateCartCount();
  renderCartItems();
  updateOrderSummary();
  
  if (cart.length === 0) {
    showEmptyCart();
  }
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalItems;
}

// Render cart items
function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-image">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
        <div class="cart-item-controls">
          <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
          <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
          <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
          <button class="remove-item-btn" data-id="${item.id}">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
      <div class="cart-item-total">
        $${(item.price * item.quantity).toFixed(2)}
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  // Add event listeners
  addCartItemEventListeners();
}

// Show empty cart state
function showEmptyCart() {
  cartItemsContainer.innerHTML = `
    <div class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <h3>Your cart is empty</h3>
      <p>Add some items to your cart to see them here</p>
      <a href="index.html" class="continue-shopping-btn">
        <i class="fas fa-shopping-bag"></i> Start Shopping
      </a>
    </div>
  `;
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      saveCart();
      renderCartItems();
      updateOrderSummary();
      updateCartCount();
    }
  }
}

// Remove item from cart
function removeFromCart(productId) {
  Swal.fire({
    title: 'Remove Item?',
    text: 'Are you sure you want to remove this item from your cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!'
  }).then((result) => {
    if (result.isConfirmed) {
      cart = cart.filter(item => item.id !== productId);
      saveCart();
      renderCartItems();
      updateOrderSummary();
      updateCartCount();
      
      if (cart.length === 0) {
        showEmptyCart();
      }
    }
  });
}

// Clear entire cart
function clearCart() {
  if (cart.length === 0) return;
  
  Swal.fire({
    title: 'Clear Cart?',
    text: 'Are you sure you want to clear your entire cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, clear it!'
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveCart();
      renderCartItems();
      updateOrderSummary();
      updateCartCount();
      showEmptyCart();
    }
  });
}

// Update order summary
function updateOrderSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0; // Flat shipping rate
  const total = subtotal + shipping;
  
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  shippingElement.textContent = subtotal > 0 ? `$${shipping.toFixed(2)}` : '$0.00';
  totalElement.textContent = `$${total.toFixed(2)}`;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add event listeners to cart items
function addCartItemEventListeners() {
  // Decrease quantity buttons
  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const item = cart.find(item => item.id === productId);
      if (item) {
        updateQuantity(productId, item.quantity - 1);
      }
    });
  });
  
  // Increase quantity buttons
  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const item = cart.find(item => item.id === productId);
      if (item) {
        updateQuantity(productId, item.quantity + 1);
      }
    });
  });
  
  // Quantity inputs
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const newQuantity = parseInt(e.target.value);
      if (!isNaN(newQuantity)) {
        updateQuantity(productId, newQuantity);
      }
    });
  });
  
  // Remove buttons
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.closest('.remove-item-btn').dataset.id);
      removeFromCart(productId);
    });
  });
}

// Handle checkout
function handleCheckout() {
  if (cart.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Empty Cart',
      text: 'Please add items to your cart before checking out'
    });
    return;
  }
  
  Swal.fire({
    title: 'Proceed to Checkout?',
    text: `Total: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, checkout!'
  }).then((result) => {
    if (result.isConfirmed) {
      // In a real app, this would redirect to payment/checkout page
      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Thank you for your purchase',
        timer: 2000
      }).then(() => {
        // Clear cart after successful checkout
        cart = [];
        saveCart();
        renderCartItems();
        updateOrderSummary();
        updateCartCount();
        showEmptyCart();
      });
    }
  });
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', initCartPage);

// Event listeners
clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', handleCheckout);