/*
 * SmartCart - Capstone Project JavaScript Engine
 * Contains: Router, API fetching, Card Rendering, Filtering & Sorting,
 * Cart & Wishlist logic, Theme switcher, Toasts, Form validations.
 */

// Global State Object
const state = {
    products: [],
    filteredProducts: [],
    cart: JSON.parse(localStorage.getItem('smartcart_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('smartcart_wishlist')) || [],
    activeCategory: 'all',
    activeTheme: localStorage.getItem('smartcart_theme') || 'light',
    couponApplied: localStorage.getItem('smartcart_coupon_applied') === 'true' || false,
    activeFilters: {
        search: '',
        categories: [],
        maxPrice: 1000,
        minRating: 0
    },
    currentSort: 'default'
};

// Comprehensive Fallback Static Products (Fake Store API Mock backup)
const mockProductsFallback = [
    {
        id: 101,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday wear in the main compartment.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: { rate: 3.9, count: 120 }
    },
    {
        id: 102,
        title: "Mens Casual Premium Slim Fit T-Shirts ",
        price: 22.3,
        description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        rating: { rate: 4.1, count: 259 }
    },
    {
        id: 103,
        title: "Mens Cotton Jacket",
        price: 55.99,
        description: "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71li-alb7pL._AC_UX679_.jpg",
        rating: { rate: 4.7, count: 500 }
    },
    {
        id: 104,
        title: "Mens Casual Slim Fit",
        price: 15.99,
        description: "The neckline and sole fold details are designed by fashion designers in New York. Suitable for daily wear, street look, party, dates.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
        rating: { rate: 2.1, count: 430 }
    },
    {
        id: 105,
        title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        price: 695.0,
        description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear inward to be bestowed with love & abundance.",
        category: "jewelery",
        image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
        rating: { rate: 4.6, count: 400 }
    },
    {
        id: 106,
        title: "Solid Gold Petite Micropave ",
        price: 168.0,
        description: "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and crafted in premium yellow gold metal.",
        category: "jewelery",
        image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
        rating: { rate: 3.9, count: 70 }
    },
    {
        id: 107,
        title: "White Gold Plated Princess",
        price: 9.99,
        description: "Classic Created Wedding Engagement Ring for Women. Gift box included, ideal anniversary ring option.",
        category: "jewelery",
        image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
        rating: { rate: 3.0, count: 400 }
    },
    {
        id: 108,
        title: "WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
        price: 64.0,
        description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
        rating: { rate: 4.7, count: 900 }
    },
    {
        id: 109,
        title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6.0 Gb/s",
        price: 109.0,
        description: "Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance, making it ideal for typical PC workloads.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
        rating: { rate: 2.9, count: 470 }
    },
    {
        id: 110,
        title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache SATA III 2.5",
        price: 29.99,
        description: "3D NAND flash technology is applied to deliver high transfer speeds and remarkable durability. Read speeds up to 550MB/s.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/71kWymZ+cYL._AC_SX679_.jpg",
        rating: { rate: 4.8, count: 320 }
    },
    {
        id: 111,
        title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
        price: 39.99,
        description: "Lightweight weather coat with adjustable hood and drawstring waist design. Windproof, waterproof, easy to pack for outdoor hiking trips.",
        category: "women's clothing",
        image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
        rating: { rate: 3.8, count: 679 }
    },
    {
        id: 112,
        title: "MBJ Women's Ultra Flathery Solid Short Sleeve Boat Neck V Tee",
        price: 7.95,
        description: "Lightweight knit jersey with great stretch. Double stitching detail on bottom hem. Machine wash cold.",
        category: "women's clothing",
        image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
        rating: { rate: 4.5, count: 146 }
    }
];

// Initialize Document Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupCarousel();
    setupRouter();
    setupFilters();
    setupCartWishlist();
    setupPromoCountdown();
    setupFormValidation();
});

// App Initializer
async function initApp() {
    // 1. Establish Saved Color Scheme Theme
    document.documentElement.setAttribute('data-theme', state.activeTheme);
    updateThemeIcon();
    
    // Theme toggle button click listener
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            state.activeTheme = state.activeTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', state.activeTheme);
            localStorage.setItem('smartcart_theme', state.activeTheme);
            updateThemeIcon();
            showToast('Theme switched successfully!', 'info');
        });
    }

    // 2. Load API Products
    const loadingOverlay = document.getElementById('loading-overlay');
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('API server returned error status');
        state.products = await response.json();
        showToast('Products loaded from live server!', 'success');
    } catch (error) {
        console.warn('Fake Store API failed to fetch. Resolving mock fallback database. Details:', error);
        state.products = [...mockProductsFallback];
        showToast('Running in offline demo mode with mock catalog data.', 'warning');
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.visibility = 'hidden';
            }, 500);
        }
    }

    // Render Home & Shop Grids
    renderFeaturedProducts();
    resetFilters(); // Initializes products display grid
    updateCartBadges();
}

// Theme Icon updating helper
function updateThemeIcon() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    
    if (state.activeTheme === 'dark') {
        themeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
    } else {
        themeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
            </svg>
        `;
    }
}

// 1. Single Page Application Routing Control
function setupRouter() {
    const navLinks = document.querySelectorAll('.nav-link, #wishlist-btn, #cart-btn, .shop-now-trigger, .footer-nav-trigger');
    const sections = document.querySelectorAll('.app-section');
    const hamburger = document.getElementById('hamburger-toggle');
    const navMenu = document.getElementById('nav-menu');
    const logoLink = document.getElementById('logo-link');

    function navigate(targetId) {
        // Hide all views, activate target
        sections.forEach(sec => {
            sec.classList.remove('active');
        });
        
        const targetSec = document.getElementById(targetId);
        if (targetSec) {
            targetSec.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Keep header nav links matching active state
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Trigger about section stats counter animations
        if (targetId === 'about-section') {
            animateAboutStats();
        }
        
        // If navigating to Cart, re-draw
        if (targetId === 'cart-section') {
            renderCartPage();
        }

        // Close mobile nav drawer if active
        if (navMenu && navMenu.classList.contains('mobile-active')) {
            navMenu.classList.remove('mobile-active');
            if (hamburger) hamburger.classList.remove('open');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (target) navigate(target);
        });
    });

    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigate('home-section');
        });
    }

    // Mobile Hamburger Menu Trigger
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            hamburger.classList.toggle('open');
            // Toggle shape animation for hamburger bars
            if (hamburger.classList.contains('open')) {
                hamburger.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                hamburger.querySelectorAll('span')[1].style.opacity = '0';
                hamburger.querySelectorAll('span')[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                hamburger.querySelectorAll('span')[0].style.transform = 'none';
                hamburger.querySelectorAll('span')[1].style.opacity = '1';
                hamburger.querySelectorAll('span')[2].style.transform = 'none';
            }
        });
    }
}

// 2. Automatic & Manual Carousel Slider
function setupCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!slides.length) return;

    let slideIndex = 0;
    let autoSlideInterval = setInterval(showNextSlide, 5000);

    function changeSlide(n) {
        slides[slideIndex].classList.remove('active');
        slideIndex = (n + slides.length) % slides.length;
        slides[slideIndex].classList.add('active');
        
        // Reset slide timer loop
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(showNextSlide, 5000);
    }

    function showNextSlide() {
        changeSlide(slideIndex + 1);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeSlide(slideIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeSlide(slideIndex + 1));
    }
}

// 3. Render Product grids dynamically
function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;

    // Filter and sort items to select top rated products
    const sorted = [...state.products].sort((a, b) => b.rating.rate - a.rating.rate);
    const topFour = sorted.slice(0, 4);

    featuredGrid.innerHTML = '';
    topFour.forEach(product => {
        featuredGrid.appendChild(createProductCard(product));
    });
}

function renderShopProducts() {
    const shopGrid = document.getElementById('shop-products-grid');
    const countLabel = document.getElementById('products-count-label');
    if (!shopGrid) return;

    shopGrid.innerHTML = '';
    applyFiltersAndSorting();

    if (state.filteredProducts.length === 0) {
        shopGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:1rem; opacity:0.6;">
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h4>No matching products found</h4>
                <p>Modify search criteria or clear active filters in the sidebar.</p>
            </div>
        `;
        if (countLabel) countLabel.innerText = `Showing 0 products`;
        return;
    }

    if (countLabel) {
        countLabel.innerText = `Showing ${state.filteredProducts.length} product${state.filteredProducts.length > 1 ? 's' : ''}`;
    }

    state.filteredProducts.forEach(product => {
        shopGrid.appendChild(createProductCard(product));
    });
}

// Helper to construct product Card DOM elements
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    const isWishlisted = state.wishlist.some(item => item.id === product.id);
    const starsHtml = renderStarRating(product.rating.rate);

    card.innerHTML = `
        <div class="product-img-box">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="card-actions-overlay">
                <button class="overlay-btn wishlist-btn-toggle ${isWishlisted ? 'wishlisted' : ''}" title="Add to Wishlist" data-id="${product.id}">
                    <svg viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <button class="overlay-btn quick-view-trigger" title="Quick View" data-id="${product.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
        </div>
        <div class="product-details-box">
            <span class="product-category-tag">${product.category}</span>
            <a href="#" class="product-name quick-view-trigger" data-id="${product.id}">${product.title}</a>
            <div class="product-rating-row">
                <div class="rating-stars">${starsHtml}</div>
                <span>(${product.rating.count})</span>
            </div>
            <div class="product-price-row">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="btn-add-cart cart-add-btn" data-id="${product.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    Cart
                </button>
            </div>
        </div>
    `;

    // Add inline event listeners to dynamic cards
    card.querySelector('.wishlist-btn-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(product.id);
    });

    card.querySelectorAll('.quick-view-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openQuickView(product.id);
        });
    });

    card.querySelector('.cart-add-btn').addEventListener('click', () => {
        addToCart(product.id, 1);
    });

    return card;
}

// Generate inline stars rating helper
function renderStarRating(rate) {
    let starsHtml = '';
    const roundedRate = Math.round(rate);
    for (let i = 1; i <= 5; i++) {
        if (i <= roundedRate) {
            starsHtml += `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        } else {
            starsHtml += `<svg viewBox="0 0 24 24" style="color:var(--text-muted);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        }
    }
    return starsHtml;
}

// 4. Searching, Filtering, and Sorting Array Logic
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const priceSlider = document.getElementById('price-slider');
    const priceSliderValue = document.getElementById('price-slider-value');
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const ratingRadios = document.querySelectorAll('input[name="rating-filter"]');
    const sortSelect = document.getElementById('sort-select');
    const resetBtn = document.getElementById('reset-filters-btn');

    // Category click cards on Home screen
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.getAttribute('data-category');
            
            // Check the respective filter box in sidebar
            categoryCheckboxes.forEach(cb => {
                cb.checked = (cb.value === category);
            });
            
            // Sync state filter
            state.activeFilters.categories = [category];
            
            // Navigate and trigger redraw
            const shopSecLink = document.querySelector('.nav-link[data-target="shop-section"]');
            if (shopSecLink) shopSecLink.click();
            
            renderShopProducts();
        });
    });

    // Real-time Search input binding
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.activeFilters.search = e.target.value.trim().toLowerCase();
            renderShopProducts();
        });
    }

    // Price range slider slider updating
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            state.activeFilters.maxPrice = val;
            if (priceSliderValue) priceSliderValue.innerText = `Max: $${val}`;
            renderShopProducts();
        });
    }

    // Category lists checkboxes changes
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const checkedVals = Array.from(categoryCheckboxes)
                .filter(c => c.checked)
                .map(c => c.value);
            state.activeFilters.categories = checkedVals;
            renderShopProducts();
        });
    });

    // Ratings Filter radio updates
    ratingRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                state.activeFilters.minRating = parseFloat(e.target.value);
                renderShopProducts();
            }
        });
    });

    // Sort select handler
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.currentSort = e.target.value;
            renderShopProducts();
        });
    }

    // Reset button click
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetFilters();
            showToast('Product filters cleared.', 'info');
        });
    }
}

function resetFilters() {
    const searchInput = document.getElementById('search-input');
    const priceSlider = document.getElementById('price-slider');
    const priceSliderValue = document.getElementById('price-slider-value');
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const ratingRadios = document.querySelectorAll('input[name="rating-filter"]');
    const sortSelect = document.getElementById('sort-select');

    // Reset states
    state.activeFilters = {
        search: '',
        categories: [],
        maxPrice: 1000,
        minRating: 0
    };
    state.currentSort = 'default';

    // Reset fields
    if (searchInput) searchInput.value = '';
    if (priceSlider) priceSlider.value = 1000;
    if (priceSliderValue) priceSliderValue.innerText = 'Max: $1000';
    categoryCheckboxes.forEach(cb => cb.checked = false);
    ratingRadios.forEach(radio => {
        if (parseFloat(radio.value) === 0) radio.checked = true;
    });
    if (sortSelect) sortSelect.value = 'default';

    renderShopProducts();
}

function applyFiltersAndSorting() {
    // 1. Filter
    state.filteredProducts = state.products.filter(product => {
        // Search filter matching title or description
        const matchesSearch = product.title.toLowerCase().includes(state.activeFilters.search) || 
                              product.description.toLowerCase().includes(state.activeFilters.search);
        
        // Category filters matching checkboxes
        const matchesCategory = state.activeFilters.categories.length === 0 || 
                               state.activeFilters.categories.includes(product.category.toLowerCase());
        
        // Price bound comparison
        const matchesPrice = product.price <= state.activeFilters.maxPrice;

        // Rating average check
        const matchesRating = product.rating.rate >= state.activeFilters.minRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    // 2. Sort Array items
    if (state.currentSort === 'price-asc') {
        state.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (state.currentSort === 'price-desc') {
        state.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (state.currentSort === 'rating-desc') {
        state.filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (state.currentSort === 'alpha-asc') {
        state.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (state.currentSort === 'alpha-desc') {
        state.filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    }
}

// 5. Shopping Cart & Wishlist Engines
function setupCartWishlist() {
    // Cart actions binding
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-input');
    const checkoutTrigger = document.getElementById('checkout-trigger-btn');
    const checkoutClose = document.getElementById('close-checkout-btn');
    const successDoneBtn = document.getElementById('success-done-btn');

    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();
            if (code === 'SMART15') {
                state.couponApplied = true;
                localStorage.setItem('smartcart_coupon_applied', 'true');
                showToast('Coupon code applied successfully! 15% discount registered.', 'success');
                renderCartPage();
            } else {
                showToast('Invalid coupon discount code.', 'error');
            }
        });
    }

    if (checkoutTrigger) {
        checkoutTrigger.addEventListener('click', () => {
            if (state.cart.length === 0) {
                showToast('Your shopping cart is empty!', 'warning');
                return;
            }
            openCheckoutModal();
        });
    }

    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckoutModal);
    }

    if (successDoneBtn) {
        successDoneBtn.addEventListener('click', () => {
            closeCheckoutModal();
            // Navigate back to Shop Section
            const shopSecLink = document.querySelector('.nav-link[data-target="shop-section"]');
            if (shopSecLink) shopSecLink.click();
        });
    }
}

function addToCart(productId, qty) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const cartItemIndex = state.cart.findIndex(item => item.id === productId);
    if (cartItemIndex > -1) {
        state.cart[cartItemIndex].quantity += qty;
    } else {
        state.cart.push({ ...product, quantity: qty });
    }

    // Save and sync badges
    localStorage.setItem('smartcart_cart', JSON.stringify(state.cart));
    updateCartBadges();
    showToast(`Added ${qty}x "${product.title.substring(0, 20)}..." to Cart!`, 'success');
}

function updateCartQty(productId, delta) {
    const cartItemIndex = state.cart.findIndex(item => item.id === productId);
    if (cartItemIndex === -1) return;

    state.cart[cartItemIndex].quantity += delta;
    if (state.cart[cartItemIndex].quantity <= 0) {
        state.cart.splice(cartItemIndex, 1);
        showToast('Item removed from cart.', 'info');
    }

    localStorage.setItem('smartcart_cart', JSON.stringify(state.cart));
    updateCartBadges();
    renderCartPage();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    localStorage.setItem('smartcart_cart', JSON.stringify(state.cart));
    updateCartBadges();
    renderCartPage();
    showToast('Item cleared from shopping cart.', 'info');
}

function toggleWishlist(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const index = state.wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        state.wishlist.splice(index, 1);
        showToast('Removed item from wishlist.', 'info');
    } else {
        state.wishlist.push(product);
        showToast('Saved item to wishlist!', 'success');
    }

    localStorage.setItem('smartcart_wishlist', JSON.stringify(state.wishlist));
    updateCartBadges();
    
    // Update visual layouts if rendering
    renderShopProducts();
    renderFeaturedProducts();
    renderWishlistPage();
}

function updateCartBadges() {
    const cartBadge = document.getElementById('cart-badge');
    const wishlistBadge = document.getElementById('wishlist-badge');

    if (cartBadge) {
        const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalQty;
        cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    if (wishlistBadge) {
        const totalWish = state.wishlist.length;
        wishlistBadge.innerText = totalWish;
        wishlistBadge.style.display = totalWish > 0 ? 'flex' : 'none';
    }
}

function renderCartPage() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartLayout = document.getElementById('cart-layout-container');
    const emptyPanel = document.getElementById('cart-empty-panel');

    if (!cartItemsList) return;

    if (state.cart.length === 0) {
        if (cartLayout) cartLayout.style.display = 'none';
        if (emptyPanel) emptyPanel.style.display = 'flex';
        return;
    }

    if (cartLayout) cartLayout.style.display = 'grid';
    if (emptyPanel) emptyPanel.style.display = 'none';

    cartItemsList.innerHTML = '';
    let subtotal = 0;

    state.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-product">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="cart-item-info">
                    <a href="#" class="cart-item-title quick-view-trigger" data-id="${item.id}">${item.title}</a>
                    <span class="cart-item-category">${item.category}</span>
                </div>
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-qty">
                <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-subtotal">
                <span>$${itemTotal.toFixed(2)}</span>
                <button class="cart-item-remove remove-btn" data-id="${item.id}" title="Remove Item">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        `;

        // Listeners for cart adjustments
        row.querySelector('.dec-qty').addEventListener('click', () => updateCartQty(item.id, -1));
        row.querySelector('.inc-qty').addEventListener('click', () => updateCartQty(item.id, 1));
        row.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item.id));
        row.querySelector('.quick-view-trigger').addEventListener('click', (e) => {
            e.preventDefault();
            openQuickView(item.id);
        });

        cartItemsList.appendChild(row);
    });

    // Summary math
    const discount = state.couponApplied ? subtotal * 0.15 : 0;
    const total = subtotal - discount;

    const subtotalEl = document.getElementById('summary-subtotal');
    const discountEl = document.getElementById('summary-discount');
    const totalEl = document.getElementById('summary-total');
    const promoTag = document.getElementById('promo-tag');

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.innerText = `-$${discount.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
    if (promoTag) promoTag.style.display = state.couponApplied ? 'inline' : 'none';

    // If coupon is already checked, prefill input
    const couponInput = document.getElementById('coupon-input');
    if (couponInput && state.couponApplied) {
        couponInput.value = 'SMART15';
        couponInput.disabled = true;
        const applyCouponBtn = document.getElementById('apply-coupon-btn');
        if (applyCouponBtn) applyCouponBtn.disabled = true;
    }
}

function renderWishlistPage() {
    const wishlistGrid = document.getElementById('wishlist-items-grid');
    if (!wishlistGrid) return;

    wishlistGrid.innerHTML = '';

    if (state.wishlist.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="wishlist-empty-state" id="wishlist-empty-panel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <h3>Your wishlist catalog is empty!</h3>
                <p>Click the heart icon overlaying product cards to compile wishlist favorites.</p>
                <button class="btn-primary shop-now-trigger" data-target="shop-section">Browse Products</button>
            </div>
        `;
        // Re-attach triggers to dynamic shop navigators inside empty states
        wishlistGrid.querySelectorAll('.shop-now-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.nav-link[data-target="shop-section"]').click();
            });
        });
        return;
    }

    state.wishlist.forEach(product => {
        wishlistGrid.appendChild(createProductCard(product));
    });
}

// 6. Product Quick-View Modal controls
let currentModalProductId = null;
let currentModalQty = 1;

function openQuickView(productId) {
    const modal = document.getElementById('quickview-modal');
    const product = state.products.find(p => p.id === productId);
    if (!modal || !product) return;

    currentModalProductId = productId;
    currentModalQty = 1;

    // Fill elements
    document.getElementById('modal-product-img').src = product.image;
    document.getElementById('modal-product-cat').innerText = product.category;
    document.getElementById('modal-product-name').innerText = product.title;
    document.getElementById('modal-product-price').innerText = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-product-desc').innerText = product.description;
    document.getElementById('modal-product-stars').innerHTML = renderStarRating(product.rating.rate);
    document.getElementById('modal-product-reviews').innerText = `(${product.rating.count} reviews)`;
    document.getElementById('modal-qty-val').innerText = currentModalQty;

    modal.classList.add('active');

    // Bind modal actions
    const closeBtn = document.getElementById('close-quickview-btn');
    const decBtn = document.getElementById('modal-qty-dec');
    const incBtn = document.getElementById('modal-qty-inc');
    const addCartBtn = document.getElementById('modal-add-cart-btn');

    closeBtn.addEventListener('click', closeQuickView);
    
    // Quantity adjuster events
    decBtn.onclick = () => {
        if (currentModalQty > 1) {
            currentModalQty--;
            document.getElementById('modal-qty-val').innerText = currentModalQty;
        }
    };
    
    incBtn.onclick = () => {
        currentModalQty++;
        document.getElementById('modal-qty-val').innerText = currentModalQty;
    };

    addCartBtn.onclick = () => {
        addToCart(currentModalProductId, currentModalQty);
        closeQuickView();
    };

    // Close when clicking overlay backdrop
    modal.onclick = (e) => {
        if (e.target === modal) closeQuickView();
    };
}

function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.remove('active');
}

// 7. Promo Countdown Deals Timer
function setupPromoCountdown() {
    const hoursVal = document.getElementById('countdown-hours');
    const minsVal = document.getElementById('countdown-mins');
    const secsVal = document.getElementById('countdown-secs');
    if (!hoursVal) return;

    // Set end date as exactly 24 hours from current start timestamp
    let targetTime = Date.now() + 24 * 60 * 60 * 1000;

    function updateCountdown() {
        const timeRemaining = targetTime - Date.now();
        if (timeRemaining <= 0) {
            // Reset countdown to loop
            targetTime = Date.now() + 24 * 60 * 60 * 1000;
            return;
        }

        const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((timeRemaining / 1000 / 60) % 60);
        const secs = Math.floor((timeRemaining / 1000) % 60);

        hoursVal.innerText = String(hours).padStart(2, '0');
        minsVal.innerText = String(mins).padStart(2, '0');
        secsVal.innerText = String(secs).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// 8. Contact & Checkout Forms Validations
function setupFormValidation() {
    // 1. Contact Form Validations
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const fields = [
            { id: 'contact-name', errorId: 'error-name', check: (val) => val.trim().length >= 3 },
            { id: 'contact-email', errorId: 'error-email', check: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
            { id: 'contact-subject', errorId: 'error-subject', check: (val) => val.trim().length >= 4 },
            { id: 'contact-message', errorId: 'error-message', check: (val) => val.trim().length >= 15 }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.addEventListener('blur', () => validateField(input, field.check));
                input.addEventListener('input', () => {
                    if (input.parentElement.classList.contains('invalid')) {
                        validateField(input, field.check);
                    }
                });
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let allValid = true;

            fields.forEach(field => {
                const input = document.getElementById(field.id);
                if (input && !validateField(input, field.check)) {
                    allValid = false;
                }
            });

            if (allValid) {
                // Save messages entries
                const inquiries = JSON.parse(localStorage.getItem('smartcart_inquiries')) || [];
                inquiries.push({
                    name: document.getElementById('contact-name').value,
                    email: document.getElementById('contact-email').value,
                    subject: document.getElementById('contact-subject').value,
                    message: document.getElementById('contact-message').value,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('smartcart_inquiries', JSON.stringify(inquiries));
                
                showToast('Thank you! Inquiry message has been sent to our Help Desk.', 'success');
                contactForm.reset();
                
                // Clear validation states
                fields.forEach(field => {
                    const input = document.getElementById(field.id);
                    if (input) input.parentElement.classList.remove('invalid');
                });
            } else {
                showToast('Please correct the highlighted form fields.', 'error');
            }
        });
    }

    // 2. Newsletter submissions
    const newsletterHome = document.getElementById('newsletter-form-home');
    const newsletterFooter = document.getElementById('newsletter-form-footer');

    if (newsletterHome) {
        newsletterHome.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email-home');
            if (emailInput && emailInput.value) {
                showToast('Successfully subscribed to SmartCart promotions!', 'success');
                emailInput.value = '';
            }
        });
    }

    if (newsletterFooter) {
        newsletterFooter.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email-footer');
            if (emailInput && emailInput.value) {
                showToast('Successfully subscribed to email updates!', 'success');
                emailInput.value = '';
            }
        });
    }
}

// Field validation helper function
function validateField(input, validateFn) {
    const parent = input.parentElement;
    const isValid = validateFn(input.value);

    if (!isValid) {
        parent.classList.add('invalid');
    } else {
        parent.classList.remove('invalid');
    }
    return isValid;
}

// 9. Floating Toast Notification Dispatcher
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose icon based on type
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        // Info default
        iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        ${iconSvg}
        <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    // Show animation trigger
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Self destroy toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 10. Checkout Payment Form Luhn-Checking validation
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    // Reset views
    document.getElementById('checkout-form-view').style.display = 'block';
    document.getElementById('checkout-success-view').style.display = 'none';

    // Calculate dynamic cart checkout price
    let subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = state.couponApplied ? subtotal * 0.15 : 0;
    const finalTotal = subtotal - discount;

    const checkoutBtn = document.getElementById('submit-payment-btn');
    if (checkoutBtn) checkoutBtn.innerText = `Place Order ($${finalTotal.toFixed(2)})`;

    modal.classList.add('active');

    // Register card validation checks
    const checkoutForm = document.getElementById('checkout-form');
    const fields = [
        { id: 'bill-fname', errorId: 'error-fname', check: (val) => val.trim().length > 0 },
        { id: 'bill-lname', errorId: 'error-lname', check: (val) => val.trim().length > 0 },
        { id: 'bill-address', errorId: 'error-address', check: (val) => val.trim().length > 0 },
        { id: 'bill-city', errorId: 'error-city', check: (val) => val.trim().length > 0 },
        { id: 'bill-zip', errorId: 'error-zip', check: (val) => /^\d{5}$/.test(val.trim()) },
        { id: 'card-num', errorId: 'error-cardnum', check: (val) => checkLuhnAlgorithm(val.replace(/\s+/g, '')) },
        { id: 'card-exp', errorId: 'error-cardexp', check: (val) => /^(0[1-9]|1[0-2])\/?([2-9][0-9])$/.test(val.trim()) },
        { id: 'card-cvv', errorId: 'error-cardcvv', check: (val) => /^\d{3}$/.test(val.trim()) }
    ];

    // Real-time listener registration
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.onblur = () => validateField(input, field.check);
            input.oninput = () => {
                if (input.parentElement.classList.contains('invalid')) {
                    validateField(input, field.check);
                }
            };
        }
    });

    checkoutForm.onsubmit = (e) => {
        e.preventDefault();
        let isValidForm = true;

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !validateField(input, field.check)) {
                isValidForm = false;
            }
        });

        if (isValidForm) {
            // Process fake order placement
            const orderId = '#SMART-' + Math.floor(10000 + Math.random() * 90000);
            document.getElementById('receipt-order-id').innerText = orderId;

            // Clear Cart and local persistence
            state.cart = [];
            state.couponApplied = false;
            localStorage.setItem('smartcart_cart', JSON.stringify([]));
            localStorage.removeItem('smartcart_coupon_applied');
            updateCartBadges();

            // Toggle modal screen to success
            document.getElementById('checkout-form-view').style.display = 'none';
            document.getElementById('checkout-success-view').style.display = 'flex';
            showToast('Order confirmed successfully!', 'success');
            checkoutForm.reset();

            // Remove error validation CSS classes
            fields.forEach(field => {
                const input = document.getElementById(field.id);
                if (input) input.parentElement.classList.remove('invalid');
            });
        } else {
            showToast('Please correct details on your credit card billing form.', 'error');
        }
    };

    // Close when clicking overlay backdrop
    modal.onclick = (e) => {
        if (e.target === modal) closeCheckoutModal();
    };
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
}

// Luhn card number checksum validator algorithm
function checkLuhnAlgorithm(numStr) {
    if (!/^\d{13,19}$/.test(numStr)) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = numStr.length - 1; i >= 0; i--) {
        let digit = parseInt(numStr.charAt(i));
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
}

// 11. Metrics Animated counters (About Page)
function animateAboutStats() {
    const statsNumbers = document.querySelectorAll('.stat-number');
    statsNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const speed = 100; // lower is faster
        const increment = Math.ceil(target / speed);
        
        stat.innerText = '0';
        let count = 0;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                stat.innerText = count + (target === 99 ? '%' : '+');
                setTimeout(updateCount, 15);
            } else {
                stat.innerText = target + (target === 99 ? '%' : '+');
            }
        };

        updateCount();
    });
}
