// Smooth Scroll
function scrollToOrder() {
    const orderSection = document.getElementById('order-section');
    orderSection.scrollIntoView({ behavior: 'smooth' });
}

// Global Form State
let selectedSize = 'M';
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const productCards = document.querySelectorAll('.product-card');
    const modal = document.getElementById('review-modal');
    const closeBtn = document.getElementById('review-close');
    const ctaBtn = document.getElementById('review-cta');
    const themeToggle = document.getElementById('theme-toggle');
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutBtn = document.getElementById('cart-checkout');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutSubmit = document.getElementById('checkout-submit');
    const checkoutDone = document.getElementById('checkout-done');

    initTheme();
    loadCart();

    // Handle Size Selection
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset all buttons
            sizeButtons.forEach(b => {
                b.classList.remove('bg-white', 'text-black', 'border-white');
                b.classList.add('bg-black', 'text-white', 'border-white/10', 'dark:bg-white', 'dark:text-black', 'dark:border-white');
            });
            // Set active button
            btn.classList.add('bg-white', 'text-black', 'border-white');
            btn.classList.remove('bg-black', 'text-white', 'border-white/10', 'dark:bg-white', 'dark:text-black', 'dark:border-white');
            selectedSize = btn.dataset.size;
        });
    });

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const collectionName = card.getAttribute('data-collection-name') || 'Collection';
            const color = card.getAttribute('data-color') || 'Black';
            const price = card.getAttribute('data-price') || '$95';
            const piecesInput = document.getElementById('pieces');
            const pieces = piecesInput && piecesInput.value ? piecesInput.value : '1';
            const deliveryWindow = '3–5';
            openReviewDialog({ collectionName, color, price, pieces, size: selectedSize, deliveryWindow });
        });
    });

    closeBtn.addEventListener('click', () => closeReviewDialog());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeReviewDialog();
    });
    ctaBtn.addEventListener('click', () => {
        closeReviewDialog();
        scrollToOrder();
    });

    themeToggle.addEventListener('click', toggleTheme);
    openCartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', openCheckout);
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = btn.getAttribute('data-name');
            const color = btn.getAttribute('data-color');
            const price = parseFloat(btn.getAttribute('data-price') || '0');
            const image = btn.getAttribute('data-image');
            addToCart({ name, color, price, image, qty: 1, size: selectedSize });
        });
    });
    checkoutClose && checkoutClose.addEventListener('click', closeCheckout);
    checkoutModal && checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckout();
    });
    checkoutSubmit && checkoutSubmit.addEventListener('click', submitCheckout);
    checkoutDone && checkoutDone.addEventListener('click', closeCheckout);

    // Handle Form Submission
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const collectionChoice = document.getElementById('collectionChoice').value;
        const pieces = document.getElementById('pieces').value;
        
        const deliveryInfo = calculateDelivery();

        // Update Confirmation View
        document.getElementById('display-name').textContent = fullName;
        document.getElementById('display-collection').textContent = `${collectionChoice} (${selectedSize})`;
        document.getElementById('display-pieces').textContent = pieces;
        document.getElementById('display-date').textContent = deliveryInfo.date;
        document.getElementById('display-time').textContent = `Scheduled Arrival: ${deliveryInfo.time}`;

        // Switch Views
        document.getElementById('order-form-wrapper').classList.add('hidden');
        document.getElementById('success-wrapper').classList.remove('hidden');

        // Scroll into view
        document.getElementById('success-wrapper').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// Delivery Calculation Logic
function calculateDelivery() {
    const today = new Date();
    // 3-5 Business Days
    const deliveryDays = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    const deliveryDate = new Date(today);
    
    let businessDaysAdded = 0;
    while (businessDaysAdded < deliveryDays) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        const day = deliveryDate.getDay();
        if (day !== 0 && day !== 6) { // Not Sunday or Saturday
            businessDaysAdded++;
        }
    }

    const hours = ["09:00", "11:30", "14:00", "16:30", "18:00"];
    const randomTime = hours[Math.floor(Math.random() * hours.length)];

    return {
        date: deliveryDate.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        time: randomTime
    };
}

// Reset Form
function resetOrderForm() {
    const orderForm = document.getElementById('order-form');
    orderForm.reset();
    
    // Reset Views
    document.getElementById('order-form-wrapper').classList.remove('hidden');
    document.getElementById('success-wrapper').classList.add('hidden');
    
    // Reset Size to M
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(b => {
        if (b.dataset.size === 'M') {
            b.click();
        }
    });

    window.scrollTo({ top: document.getElementById('order-section').offsetTop - 100, behavior: 'smooth' });
}

function openReviewDialog({ collectionName, size, color, pieces, price, deliveryWindow }) {
    const modal = document.getElementById('review-modal');
    const title = document.getElementById('review-title');
    const sub = document.getElementById('review-subheading');
    const keyspecs = document.getElementById('review-keyspecs');
    const fit = document.getElementById('review-fit');
    const design = document.getElementById('review-design');
    const care = document.getElementById('review-care');
    const delivery = document.getElementById('review-delivery');
    const priceEl = document.getElementById('review-price');

    title.textContent = `${collectionName} — Review`;
    sub.textContent = 'A disciplined essential, cut for clarity and crafted to endure.';
    keyspecs.textContent = `Key Specs: Collection ${collectionName}, Size ${size}, Color ${color}, Pieces ${pieces}. Balanced weight for daily wear; crisp structure with quiet movement.`;
    fit.textContent = 'Fit & Fabric: tailored fit; premium combed cotton with a smooth hand; breathable, all-season comfort; clean lines that hold their shape.';
    design.textContent = 'Design Notes: signature minimal branding; disciplined proportions; a timeless cut that layers effortlessly; versatile styling from studio to street.';
    care.textContent = 'Care: cold wash, inside-out with mild detergent; hang dry to preserve structure; low iron as needed; avoid bleach and harsh heat.';
    delivery.textContent = `Delivery: ${deliveryWindow} business days with tracked priority service for a precise handoff.`;
    priceEl.textContent = `Price: ${price}, taxes excluded.`;

    modal.classList.remove('hidden');
}

function closeReviewDialog() {
    const modal = document.getElementById('review-modal');
    modal.classList.add('hidden');
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (saved === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
    }
    updateThemeIcon();
    updateBrandLogoByTheme();
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
    updateBrandLogoByTheme();
}

function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isDark = document.documentElement.classList.contains('dark');
    btn.textContent = isDark ? '🌙' : '🌞';
}

function updateBrandLogoByTheme() {
    const img = document.getElementById('brand-logo');
    if (!img) return;
    const isDark = document.documentElement.classList.contains('dark');
    const lightSrc = 'masaaki_images/light logo.jpeg';
    const darkSrc = 'masaaki_images/masaaki logo.jpeg';
    img.src = isDark ? darkSrc : lightSrc;
}

function loadCart() {
    try {
        const raw = localStorage.getItem('cart');
        cart = raw ? JSON.parse(raw) : [];
    } catch {
        cart = [];
    }
    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
    const existing = cart.find(i => i.name === item.name && i.color === item.color && i.size === item.size);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(item);
    }
    saveCart();
    renderCart();
    openCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    if (!list || !totalEl || !countEl) return;
    list.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const row = document.createElement('div');
        row.className = 'flex items-center gap-3 border border-black/10 dark:border-white/10 p-3 rounded';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
            <div class="flex-1">
                <div class="text-sm font-medium">${item.name}</div>
                <div class="text-xs text-black/60 dark:text-white/60">Color ${item.color} • Size ${item.size} • Qty ${item.qty}</div>
            </div>
            <div class="text-sm font-medium">$${(item.price * item.qty).toFixed(2)}</div>
            <button class="ml-2 px-2 py-1 text-xs border border-black/20 dark:border-white/20 rounded">Remove</button>
        `;
        row.querySelector('button').addEventListener('click', () => removeFromCart(idx));
        list.appendChild(row);
    });
    totalEl.textContent = `$${total.toFixed(2)}`;
    countEl.textContent = cart.reduce((a, i) => a + i.qty, 0).toString();
}

function openCart() {
    document.getElementById('cart-drawer').classList.remove('hidden');
    document.getElementById('cart-overlay').classList.remove('hidden');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.add('hidden');
    document.getElementById('cart-overlay').classList.add('hidden');
}

function openCheckout() {
    renderCheckoutSummary();
    document.getElementById('checkout-form').classList.remove('hidden');
    document.getElementById('checkout-success').classList.add('hidden');
    document.getElementById('checkout-error').classList.add('hidden');
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function renderCheckoutSummary() {
    const list = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    if (!list || !totalEl) return;
    list.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between text-sm';
        row.innerHTML = `
            <span class="text-black/80 dark:text-white/80">${item.name} • ${item.color} • ${item.size} × ${item.qty}</span>
            <span class="font-medium">$${(item.price * item.qty).toFixed(2)}</span>
        `;
        list.appendChild(row);
    });
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function submitCheckout() {
    const name = document.getElementById('coName').value.trim();
    const email = document.getElementById('coEmail').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const address = document.getElementById('coAddress').value.trim();
    if (!name || !phone || !address) {
        document.getElementById('checkout-error').classList.remove('hidden');
        return;
    }
    document.getElementById('checkout-error').classList.add('hidden');
    const deliveryInfo = calculateDelivery();
    document.getElementById('co-date').textContent = deliveryInfo.date;
    document.getElementById('co-time').textContent = deliveryInfo.time;
    document.getElementById('co-contact').textContent = `${name} • ${email || 'no-email'} • ${phone} • ${address}`;
    document.getElementById('checkout-form').classList.add('hidden');
    document.getElementById('checkout-success').classList.remove('hidden');
    closeCart();
}
