// ========== BANGLADESH LOCATIONS ==========
const bangladeshLocations = {
    "Dhaka": ["Dhaka", "Gazipur", "Narsingdi", "Manikganj", "Munshiganj", "Narayanganj", "Tangail", "Kishoreganj", "Shariatpur", "Madaripur", "Faridpur", "Rajbari", "Gopalganj"],
    "Chattogram": ["Chattogram", "Cox's Bazar", "Comilla", "Feni", "Noakhali", "Lakshmipur", "Brahmanbaria", "Chandpur", "Rangamati", "Khagrachhari", "Bandarban"],
    "Rajshahi": ["Rajshahi", "Naogaon", "Natore", "Chapainawabganj", "Pabna", "Sirajganj", "Bogra", "Joypurhat"],
    "Khulna": ["Khulna", "Bagerhat", "Satkhira", "Jashore", "Narail", "Magura", "Kushtia", "Chuadanga", "Meherpur", "Jhenaidah"],
    "Barisal": ["Barisal", "Bhola", "Patuakhali", "Barguna", "Jhalokathi", "Pirojpur"],
    "Sylhet": ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
    "Rangpur": ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Lalmonirhat", "Nilphamari", "Thakurgaon", "Panchagarh"],
    "Mymensingh": ["Mymensingh", "Jamalpur", "Sherpur", "Netrokona"]
};

// ========== DEFAULT DELIVERY CHARGES ==========
function getDefaultDeliveryCharges() {
    return {
        divisions: {
            "Dhaka": 60,
            "Chattogram": 120,
            "Rajshahi": 120,
            "Khulna": 120,
            "Barisal": 120,
            "Sylhet": 120,
            "Rangpur": 120,
            "Mymensingh": 120
        },
        districts: {}
    };
}

function getDeliveryCharges() {
    const stored = localStorage.getItem('ummahDeliveryCharges');
    if (stored) return JSON.parse(stored);
    const defaults = getDefaultDeliveryCharges();
    localStorage.setItem('ummahDeliveryCharges', JSON.stringify(defaults));
    return defaults;
}

// ========== CART SETUP (Avoid re-declaration) ==========
// Use var to allow redeclaration in same global scope safely
var cart = JSON.parse(localStorage.getItem('ummahCart')) || [];

// ========== CART DISPLAY ==========
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart" style="text-align:center;padding:3rem;"><i class="fas fa-shopping-cart" style="font-size:4rem;color:#ddd;"></i><p style="margin:1rem 0;font-size:1.2rem;">Your cart is empty</p><a href="products.html" class="btn-primary">Browse Products</a></div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>৳${item.price}</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        <p>৳${item.price * item.quantity}</p>
                        <button onclick="removeFromCart(${item.id})" class="btn-delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
        }
        updateCartSummary();
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = `৳${subtotal}`;
    if (totalEl) totalEl.textContent = `৳${subtotal + (cart.length > 0 ? 60 : 0)}`;
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) { removeFromCart(productId); return; }
    const item = cart.find(item => item.id === productId);
    if (item) { item.quantity = newQuantity; }
    localStorage.setItem('ummahCart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('ummahCart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// ========== CHECKOUT PAGE LOGIC ==========
function loadDivisions() {
    const divisionSelect = document.getElementById('division');
    if (!divisionSelect) return;
    const divisions = Object.keys(bangladeshLocations);
    divisionSelect.innerHTML = '<option value="">Select Division</option>' +
        divisions.map(d => `<option value="${d}">${d}</option>`).join('');
}

function loadDistricts() {
    const divisionSelect = document.getElementById('division');
    const districtSelect = document.getElementById('district');
    if (!divisionSelect || !districtSelect) return;
    const division = divisionSelect.value;
    districtSelect.innerHTML = '<option value="">Select District</option>';
    if (division && bangladeshLocations[division]) {
        districtSelect.innerHTML += bangladeshLocations[division]
            .map(d => `<option value="${d}">${d}</option>`).join('');
    }
    updateDeliveryFee();
}

function getDeliveryFee(division, district) {
    const charges = getDeliveryCharges();
    if (district && charges.districts[district]) {
        return charges.districts[district];
    }
    if (division && charges.divisions[division]) {
        return charges.divisions[division];
    }
    return 120;
}

function updateDeliveryFee() {
    const division = document.getElementById('division')?.value;
    const district = document.getElementById('district')?.value;
    const deliveryFee = cart.length > 0 ? getDeliveryFee(division, district) : 0;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryFeeEl = document.getElementById('checkout-delivery-fee');
    const totalEl = document.getElementById('checkout-total');
    
    if (subtotalEl) subtotalEl.textContent = `৳${subtotal}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `৳${deliveryFee}`;
    if (totalEl) totalEl.textContent = `৳${subtotal + deliveryFee}`;
}

function displayCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:1rem;">No items in cart</p>';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="order-item-mini">
            <div>
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="order-item-price">৳${item.price * item.quantity}</div>
        </div>
    `).join('');
    updateDeliveryFee();
}

function placeOrder() {
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const division = document.getElementById('division')?.value;
    const district = document.getElementById('district')?.value;
    const address = document.getElementById('address')?.value.trim();
    
    if (!name || !phone || !division || !district || !address) {
        alert('Please fill all required fields!');
        return;
    }
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const deliveryFee = getDeliveryFee(division, district);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const order = {
        id: 'ORD-' + Date.now(),
        customer: {
            name,
            phone,
            email: document.getElementById('email')?.value || '',
            division,
            district,
            address,
            city: document.getElementById('city')?.value || '',
            postalCode: document.getElementById('postal-code')?.value || ''
        },
        payment: document.querySelector('input[name="payment"]:checked')?.value || 'cod',
        items: cart,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    let orders = JSON.parse(localStorage.getItem('ummahOrders')) || [];
    orders.push(order);
    localStorage.setItem('ummahOrders', JSON.stringify(orders));
    
    document.getElementById('order-id').textContent = order.id;
    document.getElementById('success-modal').style.display = 'flex';
    
    cart = [];
    localStorage.setItem('ummahCart', JSON.stringify(cart));
    updateCartCount();
}

// ========== CART COUNT UPDATE ==========
function updateCartCount() {
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Cart page
    displayCart();
    
    // Checkout page
    loadDivisions();
    displayCheckoutItems();
    
    updateCartCount();
    
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
});