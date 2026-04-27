// ========== BANGLADESH DATA ==========
(function() {
    const isAdmin = sessionStorage.getItem('isUmmahAdmin');
    if (!isAdmin) {
        const pass = prompt("Admin Password দিন:");
        if (pass === "2580") { // আপনার পছন্দের পাসওয়ার্ড
            sessionStorage.setItem('isUmmahAdmin', 'true');
        } else {
            alert("Access Denied!");
            window.location.href = "index.html";
        }
    }
})();
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

// ========== ORDERS ==========
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('ummahOrders')) || [];
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('pending-orders').textContent = orders.filter(o => o.status === 'pending').length;
    document.getElementById('completed-orders').textContent = orders.filter(o => o.status === 'completed').length;
    
    const tbody = document.getElementById('orders-list');
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:2rem;">No orders yet</td></tr>';
        return;
    }
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer.name}</td>
            <td>${order.customer.phone}</td>
            <td>${order.customer.district || 'N/A'}, ${order.customer.division || 'N/A'}</td>
            <td>${order.items.map(i => `${i.name} (${i.quantity})`).join('<br>')}</td>
            <td><strong>৳${order.total}</strong></td>
            <td>${new Date(order.date).toLocaleDateString('bn-BD')}</td>
            <td><span class="status-${order.status}">${order.status}</span></td>
            <td>
                ${order.status === 'pending' ? `<button onclick="updateOrderStatus('${order.id}','completed')" class="action-btn btn-complete">✓ Complete</button>` : ''}
                <button onclick="deleteOrder('${order.id}')" class="action-btn btn-delete">🗑 Delete</button>
            </td>
        </tr>
    `).reverse().join('');
}

function updateOrderStatus(id, status) {
    let orders = JSON.parse(localStorage.getItem('ummahOrders')) || [];
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) { orders[idx].status = status; localStorage.setItem('ummahOrders', JSON.stringify(orders)); loadOrders(); }
}

function deleteOrder(id) {
    if (!confirm('Delete this order?')) return;
    let orders = JSON.parse(localStorage.getItem('ummahOrders')) || [];
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('ummahOrders', JSON.stringify(orders));
    loadOrders();
}

// ========== PRODUCTS ==========
function getProducts() { return JSON.parse(localStorage.getItem('ummahProducts')) || []; }
function saveProducts(p) { localStorage.setItem('ummahProducts', JSON.stringify(p)); loadProductsTable(); }

function loadProductsTable() {
    const products = getProducts();
    const tbody = document.getElementById('products-list');
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No products</td></tr>';
        return;
    }
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>৳${p.price}</td>
            <td>
                <button class="action-btn btn-complete" onclick="editProduct(${p.id})">✏️ Edit</button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">🗑 Delete</button>
            </td>
        </tr>
    `).join('');
}

let editingProductId = null;

function showAddProductForm() {
    editingProductId = null;
    document.getElementById('form-title').textContent = 'Add Product';
    clearForm();
    document.getElementById('product-form-container').style.display = 'block';
}

function editProduct(id) {
    const p = getProducts().find(p => p.id === id);
    if (!p) return;
    editingProductId = id;
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-desc').value = p.description;
    document.getElementById('prod-image-url').value = p.image;
    document.getElementById('prod-id').value = p.id;
    document.getElementById('image-preview').src = p.image;
    document.getElementById('image-preview').style.display = 'block';
    document.getElementById('product-form-container').style.display = 'block';
}

function hideProductForm() { document.getElementById('product-form-container').style.display = 'none'; clearForm(); }

function clearForm() {
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-desc').value = '';
    document.getElementById('prod-image-url').value = '';
    document.getElementById('prod-image-file').value = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('prod-id').value = '';
}

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('image-preview').src = e.target.result;
            document.getElementById('image-preview').style.display = 'block';
            document.getElementById('prod-image-url').value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function saveProduct() {
    const name = document.getElementById('prod-name').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const image = document.getElementById('prod-image-url').value.trim();
    if (!name || !price || !image) { alert('Fill required fields!'); return; }
    
    const product = {
        id: editingProductId || (Math.max(...getProducts().map(p => p.id), 0) + 1),
        name,
        category: document.getElementById('prod-category').value,
        price,
        description: document.getElementById('prod-desc').value.trim(),
        image
    };
    
    let products = getProducts();
    if (editingProductId) {
        products = products.map(p => p.id === editingProductId ? product : p);
    } else {
        products.push(product);
    }
    saveProducts(products);
    hideProductForm();
}

function deleteProduct(id) {
    if (!confirm('Delete?')) return;
    saveProducts(getProducts().filter(p => p.id !== id));
}

// ========== DELIVERY CHARGES ==========
function getDeliveryCharges() {
    const stored = localStorage.getItem('ummahDeliveryCharges');
    if (stored) return JSON.parse(stored);
    const defaults = {
        divisions: { "Dhaka": 60, "Chattogram": 120, "Rajshahi": 120, "Khulna": 120, "Barisal": 120, "Sylhet": 120, "Rangpur": 120, "Mymensingh": 120 },
        districts: {}
    };
    localStorage.setItem('ummahDeliveryCharges', JSON.stringify(defaults));
    return defaults;
}

function loadDeliveryChargesUI() {
    const charges = getDeliveryCharges();
    const container = document.getElementById('delivery-charges-container');
    
    let html = '';
    for (const [division, districts] of Object.entries(bangladeshLocations)) {
        const divisionCharge = charges.divisions[division] || 120;
        html += `
            <div class="division-card">
                <h4><i class="fas fa-map-marker-alt" style="color:var(--gold);"></i> ${division}</h4>
                <div class="district-row" style="background:#fffdf5;padding:10px;border-radius:8px;margin-bottom:10px;">
                    <strong>Base Charge:</strong>
                    <input type="number" id="div-${division}" value="${divisionCharge}" min="0" onchange="updateDivisionCharge('${division}')">
                </div>
                ${districts.map(d => {
                    const customCharge = charges.districts[d] !== undefined ? charges.districts[d] : '';
                    return `
                        <div class="district-row">
                            <span>${d}</span>
                            <input type="number" id="dist-${d}" value="${customCharge}" min="0" placeholder="${divisionCharge}" onchange="markDistrictCustom('${d}')">
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    container.innerHTML = html;
}

function updateDivisionCharge(division) {
    const input = document.getElementById(`div-${division}`);
    const charges = getDeliveryCharges();
    charges.divisions[division] = parseInt(input.value) || 0;
    localStorage.setItem('ummahDeliveryCharges', JSON.stringify(charges));
}

function markDistrictCustom(district) {
    // Just mark that we want to save it; actual save happens on button click
    // We'll collect all values on save
}

function saveDeliveryCharges() {
    const charges = getDeliveryCharges();
    
    // Save division charges
    for (const division of Object.keys(bangladeshLocations)) {
        const input = document.getElementById(`div-${division}`);
        if (input) charges.divisions[division] = parseInt(input.value) || 0;
    }
    
    // Save district charges (only if they have a value)
    charges.districts = {};
    for (const districts of Object.values(bangladeshLocations)) {
        for (const district of districts) {
            const input = document.getElementById(`dist-${district}`);
            if (input && input.value !== '') {
                charges.districts[district] = parseInt(input.value) || 0;
            }
        }
    }
    
    localStorage.setItem('ummahDeliveryCharges', JSON.stringify(charges));
    
    // Show success
    const msg = document.getElementById('delivery-save-message');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 2000);
}

// ========== TAB SWITCHING ==========
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    if (tab === 'orders') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('orders-tab').classList.add('active');
        loadOrders();
    } else if (tab === 'products') {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('products-tab').classList.add('active');
        loadProductsTable();
    } else if (tab === 'delivery') {
        document.querySelectorAll('.tab-btn')[2].classList.add('active');
        document.getElementById('delivery-tab').classList.add('active');
        loadDeliveryChargesUI();
    }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadProductsTable();
});