/**
 * ============================================================================
 * SENVORA RESTAURANT - EXECUTIVE ADMIN DASHBOARD CONTROLLER
 * Manages Authentication Demo, Menu CRUD, Categories, Orders, Reservations,
 * Reviews Moderation, and Contact/Hours Settings via localStorage.
 * ============================================================================
 */

const STORAGE_KEYS = {
    MENU: 'senvora_menu_items',
    CATEGORIES: 'senvora_categories',
    ORDERS: 'senvora_orders',
    RESERVATIONS: 'senvora_reservations',
    REVIEWS: 'senvora_reviews',
    SETTINGS: 'senvora_settings',
    ADMIN_AUTH: 'senvora_admin_logged_in'
};

const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'senvora2026'
};

const DEFAULT_CATEGORIES = [
    'Starters', 'Main Course', 'Indian Cuisine',
    'Chinese Cuisine', 'Italian Cuisine', 'Desserts', 'Beverages'
];

const DEFAULT_SETTINGS = {
    whatsappNumber: '919876543210',
    phone: '+91 98765 43210',
    email: 'concierge@senvorarestaurant.in',
    address: 'Level 12, The Imperial Crest, MG Road, Bengaluru, Karnataka 560001',
    hours: 'Monday – Sunday: 12:00 PM – 11:30 PM'
};

function getData(key, fallback = []) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function notifyAdmin(msg) {
    const toast = document.getElementById('admin-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================================
// AUTHENTICATION (DEMO CLIENT-SIDE GUARD)
// ============================================================================
function checkAuth() {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    document.getElementById('admin-login-screen').classList.toggle('hidden', isLoggedIn);
    document.getElementById('admin-dashboard').classList.toggle('hidden', !isLoggedIn);
    if (isLoggedIn) {
        refreshAllDashboardViews();
    }
}

document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('admin-username').value.trim();
    const pass = document.getElementById('admin-password').value.trim();
    const err = document.getElementById('login-error');

    if (user === DEMO_CREDENTIALS.username && pass === DEMO_CREDENTIALS.password) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        err.textContent = '';
        checkAuth();
    } else {
        err.textContent = 'Invalid credentials. Use admin / senvora2026';
    }
});

document.getElementById('admin-logout-btn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    checkAuth();
});

// ============================================================================
// NAVIGATION TABS & KPI COUNTERS
// ============================================================================
document.querySelectorAll('.side-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.dataset.tab;
        document.getElementById(targetId).classList.add('active');
        document.getElementById('panel-title').textContent = btn.textContent.trim();
    });
});

function updateKPIs() {
    const menu = getData(STORAGE_KEYS.MENU, []);
    const orders = getData(STORAGE_KEYS.ORDERS, []);
    const res = getData(STORAGE_KEYS.RESERVATIONS, []);

    document.getElementById('kpi-dishes').textContent = menu.length;
    document.getElementById('kpi-orders').textContent = orders.length;
    document.getElementById('kpi-reservations').textContent = res.length;
    document.getElementById('badge-orders').textContent = orders.length;
    document.getElementById('badge-res').textContent = res.length;
}

// ============================================================================
// MENU CRUD OPERATIONS
// ============================================================================
function populateCategoryDropdown() {
    const categories = getData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    const select = document.getElementById('dish-category');
    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

function renderAdminMenuTable() {
    const menu = getData(STORAGE_KEYS.MENU, []);
    const tbody = document.getElementById('admin-menu-tbody');

    if (menu.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No dishes in menu. Add a dish above or restore defaults.</td></tr>`;
        return;
    }

    tbody.innerHTML = menu.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" class="table-thumb" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=60'"></td>
            <td>
                <strong>${item.name}</strong><br>
                <small class="muted">${item.diet === 'veg' ? 'Pure Veg' : 'Non-Veg'} • ${item.description.slice(0, 55)}...</small>
            </td>
            <td>${item.category}</td>
            <td><strong class="gold-text">₹${Number(item.price).toLocaleString('en-IN')}</strong></td>
            <td>
                <span class="badge ${item.available ? 'badge-green' : 'badge-red'}">
                    ${item.available ? 'Available' : 'Sold Out'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-outline-gold btn-sm" onclick="editDish('${item.id}')" title="Edit Dish">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-outline-gold btn-sm" onclick="toggleDishAvailability('${item.id}')" title="Toggle Availability">
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDish('${item.id}')" title="Delete Dish">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

document.getElementById('dish-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('edit-dish-id').value;
    const dishPayload = {
        id: editId || 'dish-' + Date.now(),
        name: document.getElementById('dish-name').value.trim(),
        category: document.getElementById('dish-category').value,
        price: Number(document.getElementById('dish-price').value),
        diet: document.getElementById('dish-diet').value,
        available: document.getElementById('dish-available').value === 'true',
        image: document.getElementById('dish-image').value.trim(),
        description: document.getElementById('dish-desc').value.trim()
    };

    let menu = getData(STORAGE_KEYS.MENU, []);
    if (editId) {
        menu = menu.map(item => item.id === editId ? dishPayload : item);
        notifyAdmin(`Updated "${dishPayload.name}" successfully.`);
    } else {
        menu.unshift(dishPayload);
        notifyAdmin(`Added "${dishPayload.name}" to the live menu.`);
    }

    setData(STORAGE_KEYS.MENU, menu);
    resetDishForm();
    refreshAllDashboardViews();
});

window.editDish = function(id) {
    const menu = getData(STORAGE_KEYS.MENU, []);
    const dish = menu.find(d => d.id === id);
    if (!dish) return;

    document.getElementById('edit-dish-id').value = dish.id;
    document.getElementById('dish-name').value = dish.name;
    document.getElementById('dish-category').value = dish.category;
    document.getElementById('dish-price').value = dish.price;
    document.getElementById('dish-diet').value = dish.diet;
    document.getElementById('dish-available').value = String(dish.available);
    document.getElementById('dish-image').value = dish.image;
    document.getElementById('dish-desc').value = dish.description;

    document.getElementById('dish-form-title').textContent = `Editing: ${dish.name}`;
    document.getElementById('save-dish-btn').innerHTML = `<i class="fa-solid fa-check"></i> Update Dish`;
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleDishAvailability = function(id) {
    const menu = getData(STORAGE_KEYS.MENU, []).map(item => {
        if (item.id === id) {
            item.available = !item.available;
        }
        return item;
    });
    setData(STORAGE_KEYS.MENU, menu);
    refreshAllDashboardViews();
    notifyAdmin('Dish availability status updated.');
};

window.deleteDish = function(id) {
    if (!confirm('Are you sure you want to permanently remove this dish from the menu?')) return;
    const menu = getData(STORAGE_KEYS.MENU, []).filter(item => item.id !== id);
    setData(STORAGE_KEYS.MENU, menu);
    refreshAllDashboardViews();
    notifyAdmin('Dish deleted from menu.');
};

function resetDishForm() {
    document.getElementById('dish-form').reset();
    document.getElementById('edit-dish-id').value = '';
    document.getElementById('dish-form-title').textContent = 'Add New Signature Dish';
    document.getElementById('save-dish-btn').innerHTML = `<i class="fa-solid fa-plus"></i> Save Dish to Menu`;
    document.getElementById('cancel-edit-btn').classList.add('hidden');
}

document.getElementById('cancel-edit-btn').addEventListener('click', resetDishForm);

document.getElementById('reset-demo-menu-btn').addEventListener('click', () => {
    if (!confirm('Reset menu to original Senvora signature items?')) return;
    localStorage.removeItem(STORAGE_KEYS.MENU);
    notifyAdmin('Menu reset! Open index.html once to re-seed defaults or reload.');
    refreshAllDashboardViews();
});

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================
function renderAdminCategories() {
    const categories = getData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    const list = document.getElementById('admin-category-list');
    list.innerHTML = categories.map(cat => `
        <li>
            <span>${cat}</span>
            <button class="del-cat-btn" onclick="deleteCategory('${cat}')" title="Remove Category">&times;</button>
        </li>
    `).join('');
}

document.getElementById('category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('new-category-name');
    const name = input.value.trim();
    if (!name) return;

    const categories = getData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    if (!categories.includes(name)) {
        categories.push(name);
        setData(STORAGE_KEYS.CATEGORIES, categories);
        notifyAdmin(`Category "${name}" added.`);
    }
    input.value = '';
    refreshAllDashboardViews();
});

window.deleteCategory = function(catName) {
    const categories = getData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES).filter(c => c !== catName);
    setData(STORAGE_KEYS.CATEGORIES, categories);
    refreshAllDashboardViews();
    notifyAdmin(`Category "${catName}" removed.`);
};

// ============================================================================
// VIEW ORDERS, RESERVATIONS & REVIEWS
// ============================================================================
function renderAdminOrders() {
    const orders = getData(STORAGE_KEYS.ORDERS, []);
    const container = document.getElementById('admin-orders-list');

    if (orders.length === 0) {
        container.innerHTML = `<p class="muted">No customer orders placed yet.</p>`;
        return;
    }

    container.innerHTML = orders.map(ord => `
        <div class="record-card">
            <h4>Order #${ord.id} (${ord.method})</h4>
            <p><strong>Guest:</strong> ${ord.customerName} (${ord.phone})</p>
            <p><strong>Address/Table:</strong> ${ord.address}</p>
            <p class="muted">${ord.createdAt}</p>
            <div class="record-items-list">
                ${ord.items.map(i => `<div>${i.name} × ${i.qty} — ₹${i.price * i.qty}</div>`).join('')}
            </div>
            <p><strong class="gold-text">Total Payable: ₹${Number(ord.total).toLocaleString('en-IN')}</strong></p>
        </div>
    `).join('');
}

function renderAdminReservations() {
    const reservations = getData(STORAGE_KEYS.RESERVATIONS, []);
    const container = document.getElementById('admin-res-list');

    if (reservations.length === 0) {
        container.innerHTML = `<p class="muted">No table reservations recorded yet.</p>`;
        return;
    }

    container.innerHTML = reservations.map(r => `
        <div class="record-card">
            <h4>Booking #${r.id}</h4>
            <p><strong>Guest:</strong> ${r.name}</p>
            <p><strong>Contact:</strong> ${r.phone} | ${r.email}</p>
            <p><strong>Schedule:</strong> ${r.date} at ${r.time} (${r.guests})</p>
            <p><strong>Requests:</strong> ${r.requests}</p>
        </div>
    `).join('');
}

function renderAdminReviews() {
    const reviews = getData(STORAGE_KEYS.REVIEWS, []);
    const container = document.getElementById('admin-reviews-list');

    if (reviews.length === 0) {
        container.innerHTML = `<p class="muted">No customer reviews available.</p>`;
        return;
    }

    container.innerHTML = reviews.map(rev => `
        <div class="record-card">
            <h4>${rev.name} (${rev.rating} ★)</h4>
            <p class="muted">${rev.date}</p>
            <p>"${rev.comment}"</p>
            <button class="btn btn-danger btn-sm" style="margin-top:10px;" onclick="deleteReview('${rev.id}')">Remove Review</button>
        </div>
    `).join('');
}

window.deleteReview = function(id) {
    const reviews = getData(STORAGE_KEYS.REVIEWS, []).filter(r => r.id !== id);
    setData(STORAGE_KEYS.REVIEWS, reviews);
    renderAdminReviews();
    notifyAdmin('Review removed from website.');
};

document.getElementById('clear-orders-btn').addEventListener('click', () => {
    if (!confirm('Clear all stored customer orders?')) return;
    setData(STORAGE_KEYS.ORDERS, []);
    refreshAllDashboardViews();
});

document.getElementById('clear-res-btn').addEventListener('click', () => {
    if (!confirm('Clear all stored table reservations?')) return;
    setData(STORAGE_KEYS.RESERVATIONS, []);
    refreshAllDashboardViews();
});

// ============================================================================
// RESTAURANT SETTINGS
// ============================================================================
function loadSettingsForm() {
    const s = getData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    document.getElementById('set-whatsapp').value = s.whatsappNumber;
    document.getElementById('set-phone').value = s.phone;
    document.getElementById('set-email').value = s.email;
    document.getElementById('set-hours').value = s.hours;
    document.getElementById('set-address').value = s.address;
}

document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
        whatsappNumber: document.getElementById('set-whatsapp').value.trim(),
        phone: document.getElementById('set-phone').value.trim(),
        email: document.getElementById('set-email').value.trim(),
        hours: document.getElementById('set-hours').value.trim(),
        address: document.getElementById('set-address').value.trim()
    };
    setData(STORAGE_KEYS.SETTINGS, updated);
    notifyAdmin('Restaurant contact & opening hours updated!');
});

function refreshAllDashboardViews() {
    populateCategoryDropdown();
    renderAdminMenuTable();
    renderAdminCategories();
    renderAdminOrders();
    renderAdminReservations();
    renderAdminReviews();
    loadSettingsForm();
    updateKPIs();
}

document.addEventListener('DOMContentLoaded', checkAuth);