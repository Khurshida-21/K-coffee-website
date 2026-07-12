
// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const categoryBtns = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');
const statNumbers = document.querySelectorAll('.stat-number');
const contactForm = document.getElementById('contactForm');
const slideUpElements = document.querySelectorAll('.slide-up');
const cartCountElement = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartSidebarContent = document.getElementById('cartSidebarContent');
const cartSidebarFooter = document.getElementById('cartSidebarFooter');
const totalPriceElement = document.getElementById('totalPrice');
const favoritesIcon = document.getElementById('favoritesIcon');
const favoritesCountElement = document.getElementById('favoritesCount');
const favoritesModal = document.getElementById('favoritesModal');
const closeFavorites = document.getElementById('closeFavorites');
const favoritesModalBody = document.getElementById('favoritesModalBody');
let cartCount = 0;
let cartItems = [];
let favoritesCount = 0;

// ===== Mobile Menu Toggle =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// ===== Active Navigation Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Smooth Scrolling for Navigation Links =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Menu Category Filter =====
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        // Filter menu items
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ===== Scroll Animation Observer =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counter animation if it's a stat number
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all slide-up elements
slideUpElements.forEach(element => {
    observer.observe(element);
});

// Observe stat numbers
statNumbers.forEach(stat => {
    observer.observe(stat);
});

// ===== Counter Animation =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateCounter();
}

// ===== Contact Form Submission =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Simple validation
    if (name && email && subject && message) {
        // Show success message (in a real app, you would send this to a server)
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
});

// ===== Notification System =====
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== Add to Cart Button Click =====
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = menuItem.querySelector('.price').textContent;
        const itemImage = menuItem.querySelector('.menu-image');
        
        // Create cart item object
        const cartItem = {
            name: itemName,
            price: itemPrice,
            image: itemImage,
            quantity: 1
        };
        
        // Add to cart items array
        cartItems.push(cartItem);
        
        // Increment cart count
        cartCount++;
        updateCartCount();
        
        // Update cart sidebar
        updateCartSidebar();
        
        // Visual feedback
        e.target.textContent = 'Added! ✓';
        e.target.style.background = '#4CAF50';
        
        // Show notification
        showNotification(`${itemName} added to cart!`, 'success');

        // Reset button after 2 seconds
        setTimeout(() => {
            e.target.textContent = 'Add to Cart';
            e.target.style.background = '';
        }, 2000);
    });
});

// ===== Cart Counter Functions =====
function updateCartCount() {
    cartCountElement.textContent = `Cart (${cartCount})`;
}

// ===== Cart Sidebar Functions =====
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateCartSidebar() {
    // Clear current content
    cartSidebarContent.innerHTML = '';
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        cartSidebarContent.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        cartSidebarFooter.style.display = 'none';
        return;
    }
    
    // Show footer
    cartSidebarFooter.style.display = 'block';
    
    // Display cart items
    cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        
        // Get image or emoji
        let imageContent = '';
        if (item.image && item.image.tagName === 'IMG') {
            imageContent = `<img src="${item.image.src}" alt="${item.name}">`;
        } else if (item.image) {
            const emoji = item.image.querySelector('.placeholder-icon');
            imageContent = emoji ? emoji.textContent : '☕';
        } else {
            imageContent = '☕';
        }
        
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                ${imageContent}
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
        
        cartSidebarContent.appendChild(cartItemElement);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            increaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            decreaseQuantity(index);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeItem(index);
        });
    });
    
    // Calculate and display total
    calculateTotal();
}

function increaseQuantity(index) {
    if (index >= 0 && index < cartItems.length) {
        cartItems[index].quantity++;
        cartCount++;
        updateCartCount();
        updateCartSidebar();
    }
}

function decreaseQuantity(index) {
    if (index >= 0 && index < cartItems.length) {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
            cartCount--;
            updateCartCount();
            updateCartSidebar();
        }
    }
}

function removeItem(index) {
    if (index >= 0 && index < cartItems.length) {
        // Decrease cart count by the quantity of the removed item
        cartCount -= cartItems[index].quantity;
        
        // Remove item from array
        cartItems.splice(index, 1);
        
        // Update displays
        updateCartCount();
        updateCartSidebar();
        
        // Show notification
        showNotification('Item removed from cart', 'success');
    }
}

function calculateTotal() {
    let total = 0;
    
    cartItems.forEach(item => {
        // Remove $ and convert to number
        const price = parseFloat(item.price.replace('$', ''));
        total += price * item.quantity;
    });
    
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

// Cart icon click event
cartIcon.addEventListener('click', openCart);

// Close cart button event
closeCart.addEventListener('click', closeCartSidebar);

// Overlay click event
cartOverlay.addEventListener('click', closeCartSidebar);

// Close cart with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        closeCartSidebar();
    }
});

// ===== Parallax Effect for Hero Section =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroSection && heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== Gallery Item Click Effect =====
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('h4').textContent;
        const description = item.querySelector('p').textContent;
        
        // Create modal (simple implementation)
        showNotification(`${title}: ${description}`, 'success');
    });
});

// ===== Favorite Button (Wishlist) Functionality =====
const favoriteButtons = document.querySelectorAll('.favorite-btn');
const STORAGE_KEY = 'brewhaven_favorites';

// Load favorites from localStorage
function loadFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Toggle favorite status
function toggleFavorite(itemId, button) {
    const favorites = loadFavorites();
    const index = favorites.indexOf(itemId);
    
    if (index === -1) {
        // Add to favorites
        favorites.push(itemId);
        button.classList.add('active');
        button.classList.remove('removing');
        button.querySelector('i').className = 'fa-solid fa-heart';
        
        // Add sparkle animation
        createSparkles(button);
        
        // Add glow effect
        button.classList.add('glow');
        setTimeout(() => button.classList.remove('glow'), 800);
        
        showToast('♡ Added to Favorites', 'success');
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        button.classList.remove('active');
        button.classList.add('removing');
        button.querySelector('i').className = 'fa-regular fa-heart';
        
        // Add sparkle animation
        createSparkles(button);
        
        // Remove glow effect
        button.classList.remove('glow');
        
        showToast('♡ Removed from Favorites', 'success');
        
        // Remove removing class after animation
        setTimeout(() => button.classList.remove('removing'), 600);
    }
    
    saveFavorites(favorites);
    updateFavoritesCount();
}

// Create sparkle effect
function createSparkles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create 4-6 sparkles
    const sparkleCount = 4 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random position around the heart
        const angle = (Math.PI * 2 * i) / sparkleCount;
        const distance = 15 + Math.random() * 10;
        const sparkleX = Math.cos(angle) * distance;
        const sparkleY = Math.sin(angle) * distance;
        
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.setProperty('--sparkle-x', `${sparkleX}px`);
        sparkle.style.setProperty('--sparkle-y', `${sparkleY}px`);
        
        document.body.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            document.body.removeChild(sparkle);
        }, 500);
    }
}

// Initialize favorite buttons
function initFavoriteButtons() {
    const favorites = loadFavorites();
    
    favoriteButtons.forEach(button => {
        const menuItem = button.closest('.menu-item');
        const itemId = menuItem.getAttribute('data-item-id');
        
        // Check if item is in favorites
        if (favorites.includes(itemId)) {
            button.classList.add('active');
            button.querySelector('i').className = 'fa-solid fa-heart';
        }
        
        // Add click event listener
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(itemId, button);
        });
    });
}

// Initialize on page load
initFavoriteButtons();

// ===== Initialize on Page Load =====
window.addEventListener('load', () => {
    // Ensure all fade-in animations play
    document.querySelectorAll('.fade-in').forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });

    // Initial check for elements in view
    slideUpElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            element.classList.add('visible');
        }
    });
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===== Performance: Debounce scroll events =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', debouncedScrollHandler);

// ===== Toast Notification System =====
function showToast(message, type) {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    const icon = type === 'success' ? '✓' : '✕';
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 2 seconds
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// ===== Favorites Count Update =====
function updateFavoritesCount() {
    const favorites = loadFavorites();
    favoritesCount = favorites.length;
    favoritesCountElement.textContent = `Favorites (${favoritesCount})`;
}

// ===== Favorites Modal Functions =====
function openFavoritesModal() {
    renderFavoritesModal();
    favoritesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFavoritesModal() {
    favoritesModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderFavoritesModal() {
    const favorites = loadFavorites();
    
    // Clear current content
    favoritesModalBody.innerHTML = '';
    
    // Check if favorites is empty
    if (favorites.length === 0) {
        favoritesModalBody.innerHTML = `
            <div class="empty-favorites-message">
                <span class="empty-favorites-icon">🤍</span>
                <h4>No favorites yet</h4>
                <p>Start exploring our delicious menu.</p>
            </div>
        `;
        return;
    }
    
    // Display favorite items
    favorites.forEach(itemId => {
        const menuItem = document.querySelector(`[data-item-id="${itemId}"]`);
        if (!menuItem) return;
        
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = menuItem.querySelector('.price').textContent;
        const itemImage = menuItem.querySelector('.menu-image');
        
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        
        // Get image or emoji
        let imageContent = '';
        if (itemImage && itemImage.tagName === 'IMG') {
            imageContent = `<img src="${itemImage.src}" alt="${itemName}">`;
        } else {
            imageContent = '☕';
        }
        
        favoriteItem.innerHTML = `
            <div class="favorite-item-image">
                ${imageContent}
            </div>
            <div class="favorite-item-details">
                <div class="favorite-item-name">${itemName}</div>
                <div class="favorite-item-price">${itemPrice}</div>
                <div class="favorite-item-actions">
                    <button class="add-to-cart-favorite" data-item-id="${itemId}">Add to Cart</button>
                    <button class="remove-favorite" data-item-id="${itemId}">Remove from Favorites</button>
                </div>
            </div>
        `;
        
        favoritesModalBody.appendChild(favoriteItem);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            const menuItem = document.querySelector(`[data-item-id="${itemId}"]`);
            
            if (menuItem) {
                // Trigger the add to cart button click
                const addToCartBtn = menuItem.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    addToCartBtn.click();
                }
            }
        });
    });
    
    // Add event listeners to "Remove from Favorites" buttons
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            const favoriteBtn = document.querySelector(`[data-item-id="${itemId}"] .favorite-btn`);
            
            if (favoriteBtn) {
                // Remove from favorites
                toggleFavorite(itemId, favoriteBtn);
                
                // Re-render modal
                renderFavoritesModal();
            }
        });
    });
}

// ===== Favorites Icon Click Event =====
favoritesIcon.addEventListener('click', openFavoritesModal);

// Close favorites modal button event
closeFavorites.addEventListener('click', closeFavoritesModal);

// Close favorites modal on overlay click
favoritesOverlay.addEventListener('click', closeFavoritesModal);

// Close favorites modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && favoritesModal.classList.contains('active')) {
        closeFavoritesModal();
    }
});

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Activate easter egg
            document.body.style.animation = 'rainbow 2s linear';
            showNotification('☕ You found the secret! Enjoy 10% off your next visit! ☕', 'success');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ===== Checkout Functionality =====
const checkoutBtn = document.querySelector('.checkout-btn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const confirmationModal = document.getElementById('confirmationModal');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');

// Open checkout modal
checkoutBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Populate order summary
    populateOrderSummary();
    
    // Show checkout modal
    checkoutModal.classList.add('active');
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'hidden';
});

// Close checkout modal
closeCheckout.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close checkout on overlay click
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Populate order summary
function populateOrderSummary() {
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    orderSummaryItems.innerHTML = '';
    
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.price.replace('$', ''));
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        
        // Get image or emoji
        let imageContent = '';
        if (item.image && item.image.tagName === 'IMG') {
            imageContent = `<img src="${item.image.src}" alt="${item.name}">`;
        } else if (item.image) {
            const emoji = item.image.querySelector('.placeholder-icon');
            imageContent = emoji ? emoji.textContent : '☕';
        } else {
            imageContent = '☕';
        }
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-summary-item';
        orderItem.innerHTML = `
            <div class="order-summary-item-image">
                ${imageContent}
            </div>
            <div class="order-summary-item-details">
                <div class="order-summary-item-name">${item.name}</div>
                <div class="order-summary-item-meta">Qty: ${item.quantity} × ${item.price}</div>
            </div>
            <div class="order-summary-item-price">$${itemTotal.toFixed(2)}</div>
        `;
        
        orderSummaryItems.appendChild(orderItem);
    });
    
    // Update totals
    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${subtotal.toFixed(2)}`;
}

// Payment method selection
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const upiFields = document.getElementById('upiFields');
const cardFields = document.getElementById('cardFields');

paymentMethods.forEach(method => {
    method.addEventListener('change', (e) => {
        // Hide all payment fields
        upiFields.style.display = 'none';
        cardFields.style.display = 'none';
        
        // Show relevant fields
        if (e.target.value === 'upi') {
            upiFields.style.display = 'block';
        } else if (e.target.value === 'card') {
            cardFields.style.display = 'block';
        }
        
        validateForm();
    });
});

// Form validation
function validateForm() {
    const requiredFields = checkoutForm.querySelectorAll('input[required]');
    let isValid = true;
    
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
    
    // Validate customer details
    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const email = document.getElementById('checkoutEmail');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const pinCode = document.getElementById('pinCode');
    
    if (!fullName.value.trim()) {
        document.getElementById('fullNameError').textContent = 'Full name is required';
        isValid = false;
    }
    
    if (!phoneNumber.value.trim() || phoneNumber.value.length < 10) {
        document.getElementById('phoneNumberError').textContent = 'Valid phone number is required';
        isValid = false;
    }
    
    
    if (!email.value.trim() || !email.value.includes('@')) {
        document.getElementById('checkoutEmailError').textContent = 'Valid email is required';
        isValid = false;
    }
    
    if (!address.value.trim()) {
        document.getElementById('addressError').textContent = 'Address is required';
        isValid = false;
    }
    
    if (!city.value.trim()) {
        document.getElementById('cityError').textContent = 'City is required';
        isValid = false;
    }
    
    if (!pinCode.value.trim() || pinCode.value.length < 6) {
        document.getElementById('pinCodeError').textContent = 'Valid PIN code is required';
        isValid = false;
    }
    
    // Validate payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        isValid = false;
    } else {
        // Validate payment-specific fields
        if (selectedPayment.value === 'upi') {
            const upiId = document.getElementById('upiId');
            if (!upiId.value.trim() || !upiId.value.includes('@')) {
                document.getElementById('upiIdError').textContent = 'Valid UPI ID is required';
                isValid = false;
            }
        } else if (selectedPayment.value === 'card') {
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');
            
            if (!cardNumber.value.trim() || cardNumber.value.replace(/\s/g, '').length < 16) {
                document.getElementById('cardNumberError').textContent = 'Valid card number is required';
                isValid = false;
            }
            
            if (!expiryDate.value.trim() || !expiryDate.value.match(/^\d{2}\/\d{2}$/)) {
                document.getElementById('expiryDateError').textContent = 'Valid expiry date (MM/YY) is required';
                isValid = false;
            }
            
            if (!cvv.value.trim() || cvv.value.length < 3) {
                document.getElementById('cvvError').textContent = 'Valid CVV is required';
                isValid = false;
            }
        }
    }
    
    // Enable/disable place order button
    placeOrderBtn.disabled = !isValid;
    
    return isValid;
}

// Add input listeners to all required fields
const allInputs = checkoutForm.querySelectorAll('input');
allInputs.forEach(input => {
    input.addEventListener('input', validateForm);
    input.addEventListener('blur', validateForm);
});

// Store order data for receipt
let currentOrderData = null;

// Place order
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    placeOrderBtn.classList.add('loading');
    placeOrderBtn.disabled = true;
    
    // Simulate order processing (2 seconds)
    setTimeout(() => {
        // Generate order ID
        const orderId = 'BH-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('orderId').textContent = '#' + orderId;
        
        // Get payment method
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        const paymentMethodText = selectedPayment.value === 'upi' ? 'UPI' :
                                  selectedPayment.value === 'card' ? 'Debit/Credit Card' :
                                  'Cash on Delivery';
        document.getElementById('paymentMethodDisplay').textContent = paymentMethodText;
        
        // Get total
        const total = document.getElementById('checkoutTotal').textContent;
        document.getElementById('finalTotal').textContent = total;
        
        // Store order data for receipt (before clearing cart)
        currentOrderData = {
            orderId: '#' + orderId,
            date: new Date().toLocaleString(),
            paymentMethod: paymentMethodText,
            total: total,
            customerName: document.getElementById('fullName').value,
            customerEmail: document.getElementById('checkoutEmail').value,
            customerPhone: document.getElementById('phoneNumber').value,
            customerAddress: document.getElementById('address').value,
            customerCity: document.getElementById('city').value,
            customerPin: document.getElementById('pinCode').value,
            items: [...cartItems] // Copy cart items
        };
        
        // Hide checkout modal
        checkoutModal.classList.remove('active');
        
        // Show confirmation modal
        confirmationModal.classList.add('active');
        
        // Reset button state
        placeOrderBtn.classList.remove('loading');
        
        // Clear cart
        cartItems = [];
        cartCount = 0;
        updateCartCount();
        updateCartSidebar();
        
        // Reset form
        checkoutForm.reset();
        upiFields.style.display = 'none';
        cardFields.style.display = 'none';
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }, 2000);
});

// Continue shopping
continueShoppingBtn.addEventListener('click', () => {
    confirmationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Scroll to home
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Download receipt
downloadReceiptBtn.addEventListener('click', () => {
    // Use stored order data
    if (!currentOrderData) {
        showNotification('No order data available', 'error');
        return;
    }
    
    const { orderId, date, paymentMethod, total, customerName, customerEmail, customerPhone, customerAddress, customerCity, customerPin, items } = currentOrderData;
    
    // Generate receipt content
    let receiptContent = `
╔══════════════════════════════════════════════════════════════╗
║                    BREW HAVEN COFFEE SHOP                   ║
║              Artisan Coffee - Est. 2015                     ║
╚══════════════════════════════════════════════════════════════╝

ORDER RECEIPT
═══════════════════════════════════════════════════════════════

Order ID: ${orderId}
Date & Time: ${date}
Payment Method: ${paymentMethod}

───────────────────────────────────────────────────────────────
CUSTOMER DETAILS
───────────────────────────────────────────────────────────────
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Address: ${customerAddress}
City: ${customerCity}
PIN Code: ${customerPin}

───────────────────────────────────────────────────────────────
ORDER ITEMS
───────────────────────────────────────────────────────────────
`;
    
    items.forEach((item, index) => {
        const price = parseFloat(item.price.replace('$', ''));
        const itemTotal = price * item.quantity;
        receiptContent += `${index + 1}. ${item.name}\n`;
        receiptContent += `   Qty: ${item.quantity} × ${item.price} = $${itemTotal.toFixed(2)}\n`;
    });
    
    receiptContent += `
───────────────────────────────────────────────────────────────
SUMMARY
───────────────────────────────────────────────────────────────
Subtotal: ${total}
Delivery Charge: FREE
───────────────────────────────────────────────────────────────
TOTAL: ${total}
═══════════════════════════════════════════════════════════════

Estimated Preparation Time: 15-20 minutes

Thank you for choosing Brew Haven! ☕
We hope you enjoy your coffee!

For any queries, contact us at:
Email: hello@brewhaven.com
Phone: (555) 123-4567
`;
    
    // Create and download receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BrewHaven_Receipt_${orderId.replace('#', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Receipt downloaded successfully!', 'success');
});

// Close confirmation modal on overlay click
confirmationModal.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
        confirmationModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (checkoutModal.classList.contains('active')) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (confirmationModal.classList.contains('active')) {
            confirmationModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

