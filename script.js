// Smooth Scroll
function scrollToOrder() {
    const orderSection = document.getElementById('order-section');
    orderSection.scrollIntoView({ behavior: 'smooth' });
}

// Global Form State
let selectedSize = 'M';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const productCards = document.querySelectorAll('.product-card');
    const modal = document.getElementById('review-modal');
    const closeBtn = document.getElementById('review-close');
    const ctaBtn = document.getElementById('review-cta');

    // Handle Size Selection
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset all buttons
            sizeButtons.forEach(b => {
                b.classList.remove('bg-white', 'text-black', 'border-white');
                b.classList.add('bg-black', 'text-white', 'border-white/10');
            });
            // Set active button
            btn.classList.add('bg-white', 'text-black', 'border-white');
            btn.classList.remove('bg-black', 'text-white', 'border-white/10');
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
