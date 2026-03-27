// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
        navbar.classList.replace('bg-opacity-85', 'bg-opacity-95'); // Enhance opacity on scroll
    } else {
        navbar.classList.remove('shadow-md');
    }
});

// Product Filtering
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update buttons
    buttons.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('filter-active');
            btn.classList.remove('bg-white', 'text-gray-600');
        } else {
            btn.classList.remove('filter-active');
            btn.classList.add('bg-white', 'text-gray-600');
        }
    });

    // Filter items with animation
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.parentElement.style.display = 'block'; // Make sure parent is visible if needed, but grid handles it
            product.style.display = 'block';
            
            // Add a small fade-in animation
            product.animate([
                { opacity: 0, transform: 'scale(0.95)' },
                { opacity: 1, transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        } else {
            product.style.display = 'none';
        }
    });
}

// Fade In Animation on Scroll (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    el.style.opacity = '0'; // Initial state
    observer.observe(el);
});

// --- Cart Functionality ---
let cart = JSON.parse(localStorage.getItem('zligger_cart')) || [];

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const drawer = document.getElementById('cart-drawer');
    
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before animating transform
        setTimeout(() => {
            drawer.classList.remove('translate-x-full');
        }, 10);
        updateCartDisplay();
    } else {
        drawer.classList.add('translate-x-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Wait for transition
    }
}

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    saveCart();
    updateCartDisplay();
    
    // Display short alert
    alert(`${name} has been added to your cart.`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('zligger_cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    const countBadge = document.getElementById('cart-count');
    const mobileCountBadge = document.getElementById('mobile-cart-count');
    const totalEl = document.getElementById('cart-total');
    const emptyMsg = document.getElementById('empty-cart-msg');
    
    // Update Counts
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        if(countBadge) { countBadge.textContent = totalItems; countBadge.classList.remove('hidden'); }
        if(mobileCountBadge) { mobileCountBadge.textContent = totalItems; mobileCountBadge.classList.remove('hidden'); }
    } else {
        if(countBadge) countBadge.classList.add('hidden');
        if(mobileCountBadge) mobileCountBadge.classList.add('hidden');
    }
    
    let totalValue = 0;
    
    if (cart.length === 0) {
        if(container) {
            Array.from(container.children).forEach(child => {
                if(child.id !== 'empty-cart-msg') child.remove();
            });
        }
        if(emptyMsg) emptyMsg.style.display = 'block';
        if(totalEl) totalEl.textContent = '0';
        return;
    }
    
    if(emptyMsg) emptyMsg.style.display = 'none';
    
    // Build cart items HTML
    let itemsHTML = '';
    cart.forEach(item => {
        totalValue += item.price * item.quantity;
        itemsHTML += `
            <div class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg border border-gray-200">
                <div class="flex-1">
                    <h4 class="font-bold text-gray-900 text-sm">${item.name}</h4>
                    <p class="text-brand-600 font-medium text-sm">LKR ${item.price}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">-</button>
                        <span class="text-sm font-medium w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
    });
    
    if(container) {
        Array.from(container.children).forEach(child => {
            if(child.id !== 'empty-cart-msg') child.remove();
        });
        container.insertAdjacentHTML('beforeend', itemsHTML);
    }
    if(totalEl) totalEl.textContent = totalValue.toLocaleString();
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    const phoneNumber = "94714338752"; // Zligger WhatsApp Number
    
    let message = "*New Order from Website*%0A%0A";
    let total = 0;
    
    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - LKR ${item.price * item.quantity}%0A`;
        total += item.price * item.quantity;
    });
    
    message += `%0A*Total: LKR ${total.toLocaleString()}*%0A%0APlease process my order.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Initialize cart display on load
document.addEventListener('DOMContentLoaded', updateCartDisplay);
