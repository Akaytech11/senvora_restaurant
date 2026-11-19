/**
 * ============================================================================
 * SENVORA RESTAURANT - MAIN CLIENT APPLICATION
 * Handles Menu Rendering, Search, Category Filters, Cart, WhatsApp Ordering,
 * Table Reservations, Lightbox Gallery, Reviews, and Admin Sync via localStorage.
 * ============================================================================
 */

// Shared Storage Keys (Synchronized with admin.js)
const STORAGE_KEYS = {
    MENU: 'senvora_menu_items',
    CATEGORIES: 'senvora_categories',
    ORDERS: 'senvora_orders',
    RESERVATIONS: 'senvora_reservations',
    REVIEWS: 'senvora_reviews',
    SETTINGS: 'senvora_settings',
    CART: 'senvora_cart'
};

// Default Restaurant Settings
const DEFAULT_SETTINGS = {
    whatsappNumber: '919876543210',
    phone: '+91 98765 43210',
    email: 'concierge@senvorarestaurant.in',
    address: 'Level 12, The Imperial Crest, MG Road, Bengaluru, Karnataka 560001',
    hours: 'Monday – Sunday: 12:00 PM – 11:30 PM'
};

// Default Categories
const DEFAULT_CATEGORIES = [
    'Starters',
    'Main Course',
    'Indian Cuisine',
    'Chinese Cuisine',
    'Italian Cuisine',
    'Desserts',
    'Beverages'
];

// Default Luxury Menu Items (INR)
const DEFAULT_MENU = [
    {
        id: 'dish-1',
        name: '24K Gold Truffle Galouti Kebab',
        category: 'Starters',
        price: 850,
        diet: 'non-veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
        description: 'Melt-in-mouth smoked lamb medallions infused with black winter truffle, saffron, and edible gold leaf on mini ulte tawa paratha.'
    },
    {
        id: 'dish-2',
        name: 'Chargrilled Zafrani Paneer Tikka',
        category: 'Starters',
        price: 680,
        diet: 'veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
        description: 'Artisanal cottage cheese marinated in Kashmiri saffron, hung curd, and roasted cardamom, finished over live charcoal.'
    },
    {
        id: 'dish-3',
        name: 'Herb-Crusted New Zealand Lamb Rack',
        category: 'Main Course',
        price: 1950,
        diet: 'non-veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        description: 'Pan-seared prime lamb rack with rosemary jus, velvety truffle potato mousseline, and glazed baby heirloom carrots.'
    },
    {
        id: 'dish-4',
        name: 'Wild Morel & Asparagus Wellington',
        category: 'Main Course',
        price: 1450,
        diet: 'veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
        description: 'Himalayan Gucchi mushrooms and tender green asparagus wrapped in flaky golden puff pastry with porcini cream reduction.'
    },
    {
        id: 'dish-5',
        name: 'Royal Awadhi Nalli Nihari',
        category: 'Indian Cuisine',
        price: 1350,
        diet: 'non-veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
        description: 'Slow-braised lamb shanks simmered for 12 hours with 32 royal spices, served with warqi paratha and ginger juliennes.'
    },
    {
        id: 'dish-6',
        name: 'Dal Senvora Bukhara (24-Hour Black Lentils)',
        category: 'Indian Cuisine',
        price: 790,
        diet: 'veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        description: 'Whole urad lentils slow-cooked overnight over glowing embers, finished with white churned butter and smoked fenugreek.'
    },
    {
        id: 'dish-7',
        name: 'Imperial Peking Duck & Scallion Crepes',
        category: 'Chinese Cuisine',
        price: 1690,
        diet: 'non-veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80',
        description: 'Crispy lacquer-roasted duck carved tableside, accompanied by handmade steamed pancakes, cucumber batons, and aged hoisin.'
    },
    {
        id: 'dish-8',
        name: 'Truffle Edamame & Water Chestnut Dim Sum',
        category: 'Chinese Cuisine',
        price: 740,
        diet: 'veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
        description: 'Translucent crystal dumplings filled with crushed edamame, crunchy water chestnuts, and white truffle oil.'
    },
    {
        id: 'dish-9',
        name: 'Black Truffle & Burrata Ravioli',
        category: 'Italian Cuisine',
        price: 1280,
        diet: 'veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=800&q=80',
        description: 'Hand-rolled pasta parcels stuffed with creamy Pugliese burrata, tossed in aged Parmesan butter and shaved Umbrian truffle.'
    },
    {
        id: 'dish-10',
        name: 'Amalfi Lobster & Saffron Risotto',
        category: 'Italian Cuisine',
        price: 1850,
        diet: 'non-veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
        description: 'Acquerello carnaroli rice simmered in shellfish bisque and saffron threads, crowned with butter-poached rock lobster.'
    },
    {
        id: 'dish-11',
        name: 'Valrhona 70% Dark Chocolate & 24K Gold Sphere',
        category: 'Desserts',
        price: 690,
        diet: 'veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
        description: 'Dark chocolate dome melted tableside with warm salted caramel espresso, revealing hazelnut praline mousse inside.'
    },
    {
        id: 'dish-12',
        name: 'Smoked Saffron & Rose Gold Elixir (Mocktail)',
        category: 'Beverages',
        price: 450,
        diet: 'veg',
        available: true,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        description: 'Damask rose hydrosol, Kashmiri saffron reduction, cold-pressed blood orange, and sparkling botanical tonic.'
    }
];

// Default Customer Reviews
const DEFAULT_REVIEWS = [
    {
        id: 'rev-1',
        name: 'Raghavendra Singhania',
        rating: 5,
        date: '14 Oct 2026',
        comment: 'An unforgettable evening. The 24K Gold Truffle Galouti Kebab and Amalfi Lobster Risotto rival top Michelin restaurants in London. Impeccable service.'
    },
    {
        id: 'rev-2',
        name: 'Ananya Deshmukh',
        rating: 5,
        date: '02 Nov 2026',
        comment: 'The black and gold ambience feels straight out of a royal palace. Celebrated our anniversary here and the staff curated a bespoke tasting menu.'
    },
    {
        id: 'rev-3',
        name: 'Vikramjit Malhotra',
        rating: 5,
        date: '11 Nov 2026',
        comment: 'Dal Senvora Bukhara and Black Truffle Ravioli are extraordinary. Even their WhatsApp concierge delivery arrived hot in luxury packaging.'
    }
];

// Application State
let activeCategory = 'All';
let activeDiet = 'all';
let searchQuery = '';
let cart = [];
let lightboxIndex = 0;

// Initialize LocalStorage Seed Data if Empty
function initializeStore() {
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_MENU));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    }
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    cart = savedCart ? JSON.parse(savedCart) : [];
}

// Helper: Get Data from Storage
function getData(key, fallback = []) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

// Helper: Toast Notification
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-crown gold-text"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Apply Dynamic Restaurant Contact & Hours Settings
function applyRestaurantSettings() {
    const settings = getData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    document.getElementById('contact-address').textContent = settings.address;
    document.getElementById('contact-phone').textContent = settings.phone;
    document.getElementById('contact-email').textContent = settings.email;
    document.getElementById('contact-hours').textContent = settings.hours;
    document.getElementById('res-hours-display').textContent = settings.hours;
    document.getElementById('res-phone-display').textContent = settings.phone;

    const waBtn = document.getElementById('whatsapp-direct-btn');
    const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
    waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Senvora Restaurant, I would like to inquire about dining and reservations.')}`;
}

// ============================================================================
// MENU CATEGORIES, FILTERING & RENDERING
// ============================================================================
function renderCategories() {
    const categories = ['All', ...getData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)];
    const tabContainer = document.getElementById('category-tabs');
    tabContainer.innerHTML = categories.map(cat => `
        <button class="cat-tab ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">
            ${cat}
        </button>
    `).join('');

    tabContainer.querySelectorAll('.cat-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.cat;
            renderCategories();
            renderMenu();
        });
    });
}

function renderMenu() {
    const menuItems = getData(STORAGE_KEYS.MENU, DEFAULT_MENU);
    const grid = document.getElementById('menu-grid');

    const filtered = menuItems.filter(item => {
        const matchesCat = activeCategory === 'All' || item.category === activeCategory;
        const matchesDiet = activeDiet === 'all' || item.diet === activeDiet;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q);
        return matchesCat && matchesDiet && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 50px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-utensils" style="font-size:2.5rem; color: var(--gold-primary); margin-bottom:12px;"></i>
                <h3>No dishes match your current filter</h3>
                <p>Try clearing your search term or selecting "All" categories.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <article class="menu-card">
            <div class="menu-card-img">
                <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'">
                <span class="diet-badge">
                    <span class="${item.diet === 'veg' ? 'veg-dot' : 'nonveg-dot'}"></span>
                    ${item.diet === 'veg' ? 'Pure Veg' : 'Non-Veg'}
                </span>
                <span class="status-badge ${item.available ? 'status-available' : 'status-soldout'}">
                    ${item.available ? 'Available' : 'Sold Out'}
                </span>
            </div>
            <div class="menu-card-body">
                <span class="menu-cat-label">${item.category}</span>
                <div class="menu-card-header">
                    <h3 class="menu-card-title">${item.name}</h3>
                    <span class="menu-card-price">₹${Number(item.price).toLocaleString('en-IN')}</span>
                </div>
                <p class="menu-card-desc">${item.description}</p>
                <button 
                    class="add-cart-btn" 
                    onclick="addToCart('${item.id}')" 
                    ${!item.available ? 'disabled' : ''}>
                    <i class="fa-solid fa-bag-shopping"></i> 
                    ${item.available ? 'Add to Cart' : 'Currently Unavailable'}
                </button>
            </div>
        </article>
    `).join('');
}

// ============================================================================
// SHOPPING CART & ONLINE / WHATSAPP ORDERING
// ============================================================================
function saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartUI();
}

window.addToCart = function(dishId) {
    const menuItems = getData(STORAGE_KEYS.MENU, DEFAULT_MENU);
    const dish = menuItems.find(d => d.id === dishId);
    if (!dish || !dish.available) return;

    const existing = cart.find(c => c.id === dishId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: dish.id,
            name: dish.name,
            price: Number(dish.price),
            qty: 1
        });
    }
    saveCart();
    showToast(`Added "${dish.name}" to your order.`);
};

window.updateCartQty = function(dishId, delta) {
    const index = cart.findIndex(c => c.id === dishId);
    if (index === -1) return;

    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
};

window.removeCartItem = function(dishId) {
    cart = cart.filter(c => c.id !== dishId);
    saveCart();
};

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = totalCount;

    const container = document.getElementById('cart-items-container');
    const footer = document.getElementById('cart-footer');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-champagne-glasses"></i>
                <h4>Your Gourmet Bag is Empty</h4>
                <p>Select signature dishes from our menu to begin your order.</p>
            </div>
        `;
        footer.classList.add('hidden');
        return;
    }

    footer.classList.remove('hidden');
    container.innerHTML = cart.map(item => `
        <div class="cart-item-row">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>₹${(item.price * item.qty).toLocaleString('en-IN')} (₹${item.price} × ${item.qty})</span>
            </div>
            <div class="cart-qty-controls">
                <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
                <button class="remove-item-btn" onclick="removeCartItem('${item.id}')" aria-label="Remove item">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('cart-tax').textContent = `₹${tax.toLocaleString('en-IN')}`;
    document.getElementById('cart-total').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

function validateCheckoutForm() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    let isValid = true;
    document.getElementById('err-cust-name').textContent = '';
    document.getElementById('err-cust-phone').textContent = '';
    document.getElementById('err-cust-address').textContent = '';

    if (name.length < 2) {
        document.getElementById('err-cust-name').textContent = 'Please enter your full name.';
        isValid = false;
    }
    if (!/^[+]?[\d\s-]{8,15}$/.test(phone)) {
        document.getElementById('err-cust-phone').textContent = 'Enter a valid 10-digit phone number.';
        isValid = false;
    }
    if (address.length < 4) {
        document.getElementById('err-cust-address').textContent = 'Enter delivery address or table number.';
        isValid = false;
    }

    return isValid ? { name, phone, address } : null;
}

function recordOrder(customer, method = 'Direct Website Order') {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const newOrder = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        customerName: customer.name,
        phone: customer.phone,
        address: customer.address,
        items: [...cart],
        subtotal,
        tax,
        total,
        method,
        status: 'Confirmed',
        createdAt: new Date().toLocaleString('en-IN')
    };

    const orders = getData(STORAGE_KEYS.ORDERS, []);
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    cart = [];
    saveCart();
    document.getElementById('checkout-form').reset();
    closeCartDrawer();
    showToast(`Order #${newOrder.id} confirmed! Our kitchen has received your request.`);
    return newOrder;
}

// ============================================================================
// TABLE RESERVATION FORM
// ============================================================================
function setupReservationForm() {
    const dateInput = document.getElementById('res-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    const form = document.getElementById('reservation-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear errors
        ['name', 'email', 'phone', 'guests', 'date', 'time'].forEach(f => {
            document.getElementById(`err-res-${f}`).textContent = '';
        });

        const name = document.getElementById('res-name').value.trim();
        const email = document.getElementById('res-email').value.trim();
        const phone = document.getElementById('res-phone').value.trim();
        const guests = document.getElementById('res-guests').value;
        const date = document.getElementById('res-date').value;
        const time = document.getElementById('res-time').value;
        const requests = document.getElementById('res-requests').value.trim();

        let valid = true;
        if (name.length < 2) {
            document.getElementById('err-res-name').textContent = 'Full name is required.';
            valid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('err-res-email').textContent = 'Please enter a valid email address.';
            valid = false;
        }
        if (!/^[+]?[\d\s-]{8,15}$/.test(phone)) {
            document.getElementById('err-res-phone').textContent = 'Please enter a valid phone number.';
            valid = false;
        }
        if (!guests) {
            document.getElementById('err-res-guests').textContent = 'Please select number of guests.';
            valid = false;
        }
        if (!date) {
            document.getElementById('err-res-date').textContent = 'Please select a reservation date.';
            valid = false;
        }
        if (!time) {
            document.getElementById('err-res-time').textContent = 'Please select a dining time.';
            valid = false;
        }

        if (!valid) return;

        const reservation = {
            id: 'RES-' + Date.now().toString().slice(-5),
            name,
            email,
            phone,
            guests,
            date,
            time,
            requests: requests || 'None',
            status: 'Confirmed',
            createdAt: new Date().toLocaleString('en-IN')
        };

        const existing = getData(STORAGE_KEYS.RESERVATIONS, []);
        existing.unshift(reservation);
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(existing));

        form.classList.add('hidden');
        const confirmBox = document.getElementById('reservation-confirmation');
        confirmBox.classList.remove('hidden');
        document.getElementById('res-confirm-details').innerHTML = `
            Thank you, <strong>${name}</strong>. Your table for <strong>${guests}</strong> on 
            <strong>${date}</strong> at <strong>${time}</strong> is reserved.<br>
            <span class="gold-text">Booking Reference: #${reservation.id}</span>
        `;
        showToast(`Table reserved for ${name} (${date} at ${time}).`);
    });

    document.getElementById('new-reservation-btn').addEventListener('click', () => {
        form.reset();
        document.getElementById('reservation-confirmation').classList.add('hidden');
        form.classList.remove('hidden');
    });
}

// ============================================================================
// GALLERY & LIGHTBOX
// ============================================================================
function setupGallery() {
    const filterBtns = document.querySelectorAll('.gal-filter-btn');
    const items = Array.from(document.querySelectorAll('.gallery-item'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.gal;

            items.forEach(item => {
                if (cat === 'all' || item.dataset.category === cat) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-caption');

    function openLightbox(idx) {
        lightboxIndex = idx;
        const img = items[lightboxIndex].querySelector('img');
        const title = items[lightboxIndex].querySelector('h4').textContent;
        lbImg.src = img.src;
        lbCap.textContent = title;
        lightbox.classList.add('open');
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    document.getElementById('lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('open');
    });

    document.getElementById('lightbox-prev').addEventListener('click', () => {
        lightboxIndex = (lightboxIndex - 1 + items.length) % items.length;
        openLightbox(lightboxIndex);
    });

    document.getElementById('lightbox-next').addEventListener('click', () => {
        lightboxIndex = (lightboxIndex + 1) % items.length;
        openLightbox(lightboxIndex);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('open');
    });
}

// ============================================================================
// CUSTOMER REVIEWS
// ============================================================================
function renderReviews() {
    const reviews = getData(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const list = document.getElementById('reviews-list');

    if (reviews.length === 0) {
        list.innerHTML = `<p style="color:var(--text-muted);">No reviews yet. Be the first to share your dining experience!</p>`;
        return;
    }

    list.innerHTML = reviews.map(rev => {
        const stars = '<i class="fa-solid fa-star"></i>'.repeat(rev.rating) +
                      '<i class="fa-regular fa-star"></i>'.repeat(5 - rev.rating);
        return `
            <article class="review-card">
                <div class="review-top">
                    <span class="reviewer-name">${rev.name}</span>
                    <span class="review-date">${rev.date}</span>
                </div>
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${rev.comment}"</p>
            </article>
        `;
    }).join('');
}

function setupReviewForm() {
    const stars = document.querySelectorAll('#star-rating-input i');
    const ratingInput = document.getElementById('rev-rating');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const val = Number(star.dataset.val);
            ratingInput.value = val;
            stars.forEach(s => {
                s.classList.toggle('active', Number(s.dataset.val) <= val);
            });
        });
    });

    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('err-rev-name').textContent = '';
        document.getElementById('err-rev-comment').textContent = '';

        const name = document.getElementById('rev-name').value.trim();
        const comment = document.getElementById('rev-comment').value.trim();
        const rating = Number(ratingInput.value) || 5;

        let valid = true;
        if (name.length < 2) {
            document.getElementById('err-rev-name').textContent = 'Please enter your name.';
            valid = false;
        }
        if (comment.length < 10) {
            document.getElementById('err-rev-comment').textContent = 'Please write at least 10 characters.';
            valid = false;
        }
        if (!valid) return;

        const newRev = {
            id: 'rev-' + Date.now(),
            name,
            rating,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            comment
        };

        const reviews = getData(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
        reviews.unshift(newRev);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

        e.target.reset();
        ratingInput.value = 5;
        stars.forEach(s => s.classList.add('active'));
        renderReviews();
        showToast('Thank you! Your review has been published.');
    });
}

// ============================================================================
// CART DRAWER & NAVIGATION EVENTS
// ============================================================================
function openCartDrawer() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-backdrop').classList.add('open');
}

function closeCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-backdrop').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    initializeStore();
    applyRestaurantSettings();
    renderCategories();
    renderMenu();
    updateCartUI();
    setupReservationForm();
    setupGallery();
    renderReviews();
    setupReviewForm();

    // Remove Preloader
    setTimeout(() => {
        document.getElementById('preloader').classList.add('fade-out');
    }, 500);

    // Navbar Scroll & Scroll-to-Top
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        scrollTopBtn.classList.toggle('visible', window.scrollY > 450);
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile Hamburger
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });

    // Top Quick Search Bar
    const searchDropdown = document.getElementById('nav-search-bar');
    const topSearchInput = document.getElementById('top-search-input');
    const menuSearchInput = document.getElementById('menu-search-input');

    document.getElementById('nav-search-btn').addEventListener('click', () => {
        searchDropdown.classList.toggle('open');
        if (searchDropdown.classList.contains('open')) topSearchInput.focus();
    });

    document.getElementById('close-search-btn').addEventListener('click', () => {
        searchDropdown.classList.remove('open');
    });

    topSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        menuSearchInput.value = searchQuery;
        renderMenu();
        if (searchQuery.length > 1) {
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        }
    });

    menuSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMenu();
    });

    // Diet Filter Buttons
    document.querySelectorAll('.diet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diet-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDiet = btn.dataset.diet;
            renderMenu();
        });
    });

    // Cart Drawer Toggles
    document.getElementById('cart-toggle-btn').addEventListener('click', openCartDrawer);
    document.getElementById('close-cart-btn').addEventListener('click', closeCartDrawer);
    document.getElementById('cart-backdrop').addEventListener('click', closeCartDrawer);

    // Direct Checkout Submit
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        const customer = validateCheckoutForm();
        if (!customer) return;
        recordOrder(customer, 'Website Order');
    });

    // WhatsApp Checkout Button
    document.getElementById('whatsapp-order-btn').addEventListener('click', () => {
        if (cart.length === 0) return;
        const customer = validateCheckoutForm();
        if (!customer) return;

        const settings = getData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const total = subtotal + Math.round(subtotal * 0.05);

        const itemLines = cart.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
        const order = recordOrder(customer, 'WhatsApp Order');

        const msg = `*NEW ORDER - SENVORA RESTAURANT*\n` +
                    `Order ID: #${order.id}\n` +
                    `Name: ${customer.name}\n` +
                    `Phone: ${customer.phone}\n` +
                    `Address/Table: ${customer.address}\n\n` +
                    `*Items:*\n${itemLines}\n\n` +
                    `*Total (incl. 5% GST): ₹${total.toLocaleString('en-IN')}*`;

        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    });

    // Reveal on Scroll Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});