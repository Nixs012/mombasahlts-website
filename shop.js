// Shop functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initializeCart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize products
    initializeProducts();
});

// Cart functionality
let cart = [];
let products = [];

function initializeCart() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('mombasaHamletsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function setupEventListeners() {
    // Category filtering
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            filterProductsByCategory(category);
        });
    });
    
    // Sort products
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
    
    // Size filter
    const sizeFilter = document.getElementById('size-filter');
    if (sizeFilter) {
        sizeFilter.addEventListener('change', function() {
            filterProductsBySize(this.value);
        });
    }
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-product');
            addToCart(productId);
        }
        
        // Quick view buttons
        if (e.target.classList.contains('quick-view')) {
            const productId = e.target.getAttribute('data-product');
            showQuickView(productId);
        }
        
        // Wishlist buttons
        if (e.target.closest('.wishlist-btn')) {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            toggleWishlist(wishlistBtn);
        }
    });
    
    // Cart sidebar functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            updateCartDisplay();
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Quick view modal functionality
    const quickViewModal = document.getElementById('quickViewModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            quickViewModal.classList.remove('active');
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove('active');
        }
        
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        if (e.target === sidebarOverlay) {
            closeMobileSidebar();
        }
    });
}

async function initializeProducts() {
    const productsGrid = document.querySelector('.products-grid');
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
        // The 'sizes' property is a string in the database, so we convert it to an array
        products.forEach(p => {
            if (typeof p.sizes === 'string') {
                p.sizes = p.sizes.split(',');
            }
        });
        displayProducts(products);
    } catch (error) {
        console.error("Could not fetch products:", error);
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="products-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to load products</h3>
                    <p>Could not connect to the server. Please try again later.</p>
                </div>
            `;
        }
    }
}

function displayProducts(productsToDisplay) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <h3>No products found</h3>
                <p>Please check back later.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card" data-category="${product.category}" data-price="${product.price}" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-view" data-product="${product.id}">Quick View</button>
                </div>
                ${product.originalPrice ? `<span class="product-badge sale">Sale</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">KSh ${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">KSh ${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-product="${product.id}">Add to Cart</button>
                    <button class="wishlist-btn" aria-label="Add to wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortProducts(criteria) {
    const productsGrid = document.querySelector('.products-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        
        switch(criteria) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                // For simplicity, we'll assume newer products have higher IDs
                return parseInt(b.getAttribute('data-product-id')) - parseInt(a.getAttribute('data-product-id'));
            default: // popularity
                return 0; // Would typically use actual popularity data
        }
    });
    
    // Reappend sorted products
    productCards.forEach(card => productsGrid.appendChild(card));
}

function filterProductsBySize(size) {
    // This would typically filter based on actual product size data
    // For now, we'll just show a message
    if (size !== 'all') {
        alert(`Filtering by size: ${size.toUpperCase()}. This functionality would filter products based on available sizes.`);
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Update cart count
    updateCartCount();
    
    // Save to localStorage
    saveCart();
    
    // Show confirmation
    showToast(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartTotal = document.querySelector('.total-amount');
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItems.innerHTML = '';
    } else {
        emptyCartMessage.style.display = 'none';
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">KSh ${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        
        // Add event listeners for quantity buttons
        const decreaseButtons = cartItems.querySelectorAll('.decrease');
        const increaseButtons = cartItems.querySelectorAll('.increase');
        const removeButtons = cartItems.querySelectorAll('.cart-item-remove');
        
        decreaseButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                updateCartItemQuantity(itemId, -1);
            });
        });
        
        increaseButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                updateCartItemQuantity(itemId, 1);
            });
        });
        
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                removeFromCart(itemId);
            });
        });
    }
    
    if (cartTotal) {
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `KSh ${totalAmount.toLocaleString()}`;
    }
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id == productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
            saveCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartCount();
    updateCartDisplay();
    saveCart();
    
    showToast('Item removed from cart');
}

function saveCart() {
    localStorage.setItem('mombasaHamletsCart', JSON.stringify(cart));
}

function showQuickView(productId) {
    const product = products.find(p => p.id == productId);
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.querySelector('.modal-body');
    
    if (!product || !modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <div class="modal-product-price">
                KSh ${product.price.toLocaleString()}
                ${product.originalPrice ? `<span class="original-price">KSh ${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
            <p class="modal-product-description">${product.description}</p>
            <div class="modal-product-options">
                <select class="size-select">
                    <option value="">Select Size</option>
                    ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
            </div>
            <div class="modal-product-actions">
                <button class="btn modal-add-to-cart" data-product="${product.id}">Add to Cart</button>
                <button class="wishlist-btn" aria-label="Add to wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Add event listener to the modal's add to cart button
    const modalAddToCart = modalBody.querySelector('.modal-add-to-cart');
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            const sizeSelect = modalBody.querySelector('.size-select');
            const selectedSize = sizeSelect.value;
            
            if (!selectedSize) {
                showToast('Please select a size');
                return;
            }
            
            addToCart(product.id);
            modal.classList.remove('active');
        });
    }
} // <-- This closing brace was missing in your original code

function toggleWishlist(wishlistBtn) {
    wishlistBtn.classList.toggle('active');
    const isActive = wishlistBtn.classList.contains('active');
    const heartIcon = wishlistBtn.querySelector('i');
    
    if (isActive) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showToast('Added to wishlist');
    } else {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showToast('Removed from wishlist');
    }
}

function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Mobile sidebar functionality
function openMobileSidebar() {
    const sidebar = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileSidebar);
}

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

if (searchInput && searchButton) {
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Filter products based on search query
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update products grid with search results
    displaySearchResults(filteredProducts, query);
}

function displaySearchResults(results, query) {
    const productsGrid = document.querySelector('.products-grid');
    const categoryTitle = document.querySelector('.category-title');
    const categoryLinks = document.querySelectorAll('.category-link');
    
    if (!productsGrid) return;
    
    // Clear active category
    categoryLinks.forEach(link => link.classList.remove('active'));
    
    if (results.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <h3>No products found for "${query}"</h3>
                <p>Try different keywords or browse all categories</p>
                <button class="btn clear-search">View All Products</button>
            </div>
        `;
        
        // Add event listener to clear search button
        const clearSearchBtn = productsGrid.querySelector('.clear-search');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                filterProductsByCategory('all');
                categoryLinks[0].classList.add('active');
            });
        }
    } else {
        // Update category title
        if (categoryTitle) {
            categoryTitle.textContent = `Search Results for "${query}"`;
        }
        
        // Generate product cards for search results
        productsGrid.innerHTML = results.map(product => `
            <div class="product-card" data-category="${product.category}" data-price="${product.price}" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="btn quick-view" data-product="${product.id}">Quick View</button>
                        <button class="wishlist-btn" aria-label="Add to wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    ${product.originalPrice ? `<span class="discount-badge">Sale</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">KSh ${product.price.toLocaleString()}</span>
                        ${product.originalPrice ? `<span class="original-price">KSh ${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <button class="btn add-to-cart" data-product="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }
}

// Checkout functionality
const checkoutButton = document.querySelector('.checkout-btn');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        
        // In a real application, this would redirect to a checkout page
        alert('Proceeding to checkout. This would redirect to a secure checkout page in a real application.');
    });
}

// Initialize any product cards that might be in the initial HTML
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const quickViewBtn = card.querySelector('.quick-view');
        const addToCartBtn = card.querySelector('.add-to-cart');
        const wishlistBtn = card.querySelector('.wishlist-btn');
        
        if (quickViewBtn && productId) {
            quickViewBtn.setAttribute('data-product', productId);
        }
        
        if (addToCartBtn && productId) {
            addToCartBtn.setAttribute('data-product', productId);
        }
        
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function() {
                toggleWishlist(this);
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupEventListeners();
    initializeProducts();
    initializeProductCards();
    updateCartCount();
});
