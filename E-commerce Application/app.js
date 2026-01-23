const searchInput = document.querySelector('.search-input');
const contentDiv = document.querySelector('#content');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const logoutBtn = document.querySelector('.logout-btn');
const backToTopBtn = document.querySelector('.back-to-top');
const cartBtn = document.querySelector('.cart-btn');
const searchBtn = document.querySelector('.search-btn');

// Initialize cart count badge
const cartCount = document.createElement('span');
cartCount.className = 'cart-count';

// Cart data - load from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Check Authentication State
function checkAuthState() {
  const currentUser = localStorage.getItem("currentUser");
  
  if (currentUser) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    logoutBtn.style.display = 'flex';
  } else {
    loginBtn.style.display = 'flex';
    signupBtn.style.display = 'flex';
    logoutBtn.style.display = 'none';
  }
}

// Handle Logout
function handleLogout() {
  Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout!'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      checkAuthState();
      window.location.href = "Login.html";
    }
  });
}

// Initialize cart badge
function initCartBadge() {
  cartBtn.appendChild(cartCount);
  updateCartCount();
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Add to cart function
function addToCart(product, quantity = 1) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    Swal.fire({
      icon: 'success',
      title: 'Item Updated!',
      text: `Updated quantity of ${product.title}`,
      timer: 1500,
      toast: true,
      position: 'top-right',
      showConfirmButton: false
    });
  } else {
    cart.push({
      ...product,
      quantity: quantity
    });
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${product.title} added to your cart`,
      timer: 1500,
      toast: true,
      position: 'top-right',
      showConfirmButton: false
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Remove from cart (used in cart page)
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Update cart item quantity
function updateCartItemQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    }
  }
}

// Clear entire cart
function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  updateCartCount();
}

// Get cart total
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Fetch Products from API
function fetchProducts() {
  fetch(`https://fakestoreapi.com/products`)
    .then((response) => response.json())
    .then((products) => {
      contentDiv.innerHTML = '';
      if (products && products.length > 0) {
        displayProducts(products.slice(0, 12));
      } else {
        contentDiv.innerHTML = '<p class="text-center">No products found.</p>';
      }
    })
    .catch((err) => {
      console.error(err);
      contentDiv.innerHTML = '<p class="text-center">Failed to load products. Please try again later.</p>';
    });
}

// Display Products in Grid
function displayProducts(products) {
  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Check if item is already in cart
    const inCart = cart.some(item => item.id === product.id);
    const cartText = inCart ? 'In Cart' : 'Add to Cart';
    const cartIcon = inCart ? 'fas fa-check' : 'fas fa-cart-plus';
    
    productCard.innerHTML = `
      <img src="${product.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
           class="product-image" alt="${product.title || 'Product image'}">
      <div class="product-body">
        <h3 class="product-title">${product.title || 'No title'}</h3>
        <p class="product-description">${(product.description || 'No description available').substring(0, 100)}...</p>
        <p class="product-price">$${product.price ? product.price.toFixed(2) : 'N/A'}</p>
        <div class="product-actions">
          <button class="view-details-btn" data-id="${product.id}">View Details</button>
          <button class="add-to-cart-btn" data-id="${product.id}" ${inCart ? 'disabled' : ''}>
            <i class="${cartIcon}"></i> ${cartText}
          </button>
        </div>
      </div>
    `;
    
    contentDiv.appendChild(productCard);
  });
  
  // Add event listeners to all product buttons
  addProductEventListeners();
}

// Add event listeners to product buttons
function addProductEventListeners() {
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
      const button = e.target.closest('.add-to-cart-btn');
      
      // Disable button temporarily to prevent multiple clicks
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
      
      fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(product => {
          addToCart(product);
          
          // Update button state
          button.innerHTML = '<i class="fas fa-check"></i> In Cart';
          button.disabled = true;
          
          // Update button style
          button.style.backgroundColor = 'var(--medium-grey)';
          button.style.cursor = 'default';
        })
        .catch(err => {
          console.error('Error fetching product details:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add product to cart'
          });
          
          // Reset button state
          button.disabled = false;
          button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
        });
    });
  });
  
  // View details buttons
  document.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.closest('.view-details-btn').dataset.id);
      viewProductDetails(productId);
    });
  });
}

// View product details
function viewProductDetails(productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => response.json())
    .then(product => {
      Swal.fire({
        title: product.title,
        html: `
          <div style="text-align: left;">
            <img src="${product.image}" style="max-width: 200px; max-height: 200px; margin: 0 auto 1rem; display: block;">
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Rating:</strong> ${product.rating?.rate || 'N/A'} (${product.rating?.count || 0} reviews)</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add to Cart',
        cancelButtonText: 'Close',
        confirmButtonColor: '#3085d6',
        showCloseButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          addToCart(product);
        }
      });
    })
    .catch(err => {
      console.error('Error fetching product details:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load product details'
      });
    });
}

// Search Products
function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    fetchProducts();
    return;
  }

  fetch(`https://fakestoreapi.com/products`)
    .then((response) => response.json())
    .then((products) => {
      contentDiv.innerHTML = '';
      const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
      );

      if (filteredProducts.length > 0) {
        displayProducts(filteredProducts.slice(0, 20));
      } else {
        contentDiv.innerHTML = '<p class="text-center">No products match your search.</p>';
      }
    })
    .catch((err) => {
      console.error(err);
      contentDiv.innerHTML = '<p class="text-center">Failed to search. Please try again later.</p>';
    });
}

// Back to Top Functionality
function handleScroll() {
  if (window.pageYOffset > 300) {
    backToTopBtn.style.display = 'flex';
  } else {
    backToTopBtn.style.display = 'none';
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Handle cart button click
function handleCartClick() {
  window.location.href = "cart.html";
}

// Initialize the page
function init() {
  checkAuthState();
  initCartBadge();
  fetchProducts();
  
  // Check if we're on cart page
  if (window.location.pathname.includes('cart.html')) {
    // Cart page will be handled by cart.js
    return;
  }
}

// Event Listeners
logoutBtn.addEventListener('click', handleLogout);
cartBtn.addEventListener('click', handleCartClick);

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchProducts();
});

if (searchBtn) {
  searchBtn.addEventListener('click', searchProducts);
}

window.addEventListener('scroll', handleScroll);
backToTopBtn.addEventListener('click', scrollToTop);

// Redirect to login if not authenticated (only on index.html)
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem("currentUser");
  const isIndexPage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/');
  
  if (!currentUser && isIndexPage) {
    window.location.href = "Login.html";
  }
});

// Export cart functions for use in cart.js
if (typeof window !== 'undefined') {
  window.cartFunctions = {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    cart,
    updateCartCount
  };
}

// Initialize the app
init();