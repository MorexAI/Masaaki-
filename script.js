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
