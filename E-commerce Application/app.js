const searchInput = document.querySelector('.search-input');
const contentDiv = document.querySelector('#content');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const logoutBtn = document.querySelector('.logout-btn');
const backToTopBtn = document.querySelector('.back-to-top');

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
    
    productCard.innerHTML = `
      <img src="${product.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
           class="product-image" alt="${product.title || 'Product image'}">
      <div class="product-body">
        <h3 class="product-title">${product.title || 'No title'}</h3>
        <p class="product-description">${product.description || 'No description available'}</p>
        <p class="product-price">$${product.price || 'N/A'}</p>
        <a class="view-details-btn">View Details</a>
      </div>
    `;
    
    contentDiv.appendChild(productCard);
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

// Initialize the page
checkAuthState();
fetchProducts();

// Event Listeners
logoutBtn.addEventListener('click', handleLogout);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchProducts();
});

window.addEventListener('scroll', handleScroll);
backToTopBtn.addEventListener('click', scrollToTop);

// Redirect to login if not authenticated
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser && window.location.pathname.endsWith('index.html')) {
    window.location.href = "Login.html";
  }
});

