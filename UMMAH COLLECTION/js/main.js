// ========== HERO SLIDER ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    if (totalSlides === 0) return;
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
}

let slideInterval = totalSlides > 0 ? setInterval(nextSlide, 4000) : null;

dots.forEach(dot => {
    dot.addEventListener('click', function() {
        clearInterval(slideInterval);
        showSlide(parseInt(this.dataset.index));
        slideInterval = setInterval(nextSlide, 4000);
    });
});

// ========== PRODUCT INITIALIZATION ==========
function initProducts() {
    if (!localStorage.getItem('ummahProducts')) {
        const defaults = [
            { id: 1, name: "Premium Oud Attar", category: "attar", price: 1200, image: "https://images.unsplash.com/photo-1592945196178-c990d0e4f4c5?w=400&q=80", description: "Authentic Arabian Oud" },
            { id: 2, name: "Rose Perfume Oil", category: "attar", price: 850, image: "https://images.unsplash.com/photo-1588405748880-4348ae9e3e1d?w=400&q=80", description: "Pure rose extract" },
            { id: 3, name: "Men's White Thobe", category: "clothing", price: 2500, image: "https://images.unsplash.com/photo-1603252109303-28c72e28e1b8?w=400&q=80", description: "Premium cotton thobe" },
            { id: 4, name: "Women's Black Abaya", category: "clothing", price: 3200, image: "https://images.unsplash.com/photo-1583391733956-3750e279c727?w=400&q=80", description: "Elegant embroidered abaya" },
            { id: 5, name: "Miswak Holder", category: "accessories", price: 350, image: "https://images.unsplash.com/photo-1606723152611-3d3e2c1e8c4c?w=400&q=80", description: "Leather holder case" },
            { id: 6, name: "Wooden Tasbih", category: "accessories", price: 500, image: "https://images.unsplash.com/photo-1609599006353-e5361161eb35?w=400&q=80", description: "33 bead wooden tasbih" },
            { id: 7, name: "Quran Translation", category: "books", price: 1500, image: "https://images.unsplash.com/photo-1584286595398-595f22b80afc?w=400&q=80", description: "Bengali translation" },
            { id: 8, name: "Islamic History", category: "books", price: 800, image: "https://images.unsplash.com/photo-1544947950-fa8e5b1a7a3d?w=400&q=80", description: "Complete history book" }
        ];
        localStorage.setItem('ummahProducts', JSON.stringify(defaults));
    }
}

function getProducts() {
    return JSON.parse(localStorage.getItem('ummahProducts')) || [];
}

// Only declare if not already declared (for pages loading both scripts)
if (typeof cart === 'undefined') {
    var cart = JSON.parse(localStorage.getItem('ummahCart')) || [];
} else {
    cart = JSON.parse(localStorage.getItem('ummahCart')) || [];
}

function displayProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const products = productList || getProducts();
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id}, event)">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Fixed: now accepts event as second parameter
function addToCart(productId, e) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('ummahCart', JSON.stringify(cart));
    updateCartCount();

    // Visual feedback (now e is defined)
    if (e && e.target) {
        const btn = e.target.closest('.add-to-cart');
        if (btn) {
            btn.textContent = '✓ Added!';
            btn.style.background = 'linear-gradient(135deg, #00b894, #55efc4)';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                btn.style.background = '';
            }, 1000);
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

// ========== PAGE INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initProducts();

    // Home featured
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        displayProducts('featured-products', getProducts().slice(0, 4));
    }

    // All products
    const allContainer = document.getElementById('all-products');
    if (allContainer) {
        displayProducts('all-products');
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const cat = this.dataset.category;
                const filtered = cat === 'all' ? getProducts() : getProducts().filter(p => p.category === cat);
                displayProducts('all-products', filtered);
            });
        });
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const q = this.value.toLowerCase();
                const filtered = getProducts().filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
                displayProducts('all-products', filtered);
            });
        }
    }

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    updateCartCount();
});