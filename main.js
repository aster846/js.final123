// === 1. NAVBAR VISIBILITY LOGIC ===
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}
const navLoginLink = document.getElementById('navLoginLink');
const logoutBtn = document.getElementById('logoutBtn');

function updateNavbar() {
    if (sessionStorage.getItem('loggedIn')) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (navLoginLink) navLoginLink.style.display = 'none';
    } else {
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (navLoginLink) navLoginLink.style.display = 'block';
    }
}
updateNavbar();

// === 2. LOGIN PAGE LOGIC ===
const wrapper = document.querySelector('.wrapper');
if (wrapper) {
    const signUpBtnLink = document.querySelector('.signUpBtn-link');
    const signInBtnLink = document.querySelector('.signInBtn-link');
    const loginSubmitBtn = document.querySelector('.form-wrapper.sign-in button');
    const signupSubmitBtn = document.querySelector('.form-wrapper.sign-up button');

    if(signUpBtnLink) signUpBtnLink.addEventListener('click', () => wrapper.classList.add('active'));
    if(signInBtnLink) signInBtnLink.addEventListener('click', () => wrapper.classList.remove('active'));

    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', () => sessionStorage.setItem('loggedIn', 'true'));
    }
    if (signupSubmitBtn) {
        signupSubmitBtn.addEventListener('click', () => sessionStorage.setItem('loggedIn', 'true'));
    }
}

// === 3. GUEST POPUP LOGIC ===
const guestOverlay = document.getElementById('guestOverlay');
const guestBtn = document.getElementById('guestBtn');
const loginBtn = document.getElementById('loginBtn');

if (guestOverlay) {
    const isGuest = sessionStorage.getItem('guestUser');
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isGuest === 'true' || isLoggedIn === 'true') {
        guestOverlay.style.display = 'none';
    } else {
        guestOverlay.style.display = 'flex';
    }

    guestBtn.addEventListener('click', () => {
        alert("You are now browsing as a Guest!");
        sessionStorage.setItem('guestUser', 'true');
        guestOverlay.style.display = 'none';
        updateNavbar(); 
    });

    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// === 4. LOGOUT LOGIC ===
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('guestUser');
        window.location.reload();
    });
}

// === 5. SEARCH & FILTER (FIXED) ===
function searchStudent() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let productCards = document.querySelectorAll(".product-card");

    productCards.forEach(product => {
        let title = product.querySelector("h3").innerText.toLowerCase();
        if (title.includes(keyword)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

const catButtons = document.querySelectorAll(".cat-btn");
catButtons.forEach(button => {
    button.addEventListener("click", () => {
        catButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        
        const clickedCategory = button.dataset.category.toLowerCase();
        const productCards = document.querySelectorAll(".product-card");
        const productRows = document.querySelectorAll(".product-row");

        productCards.forEach(product => {
            const productCategories = (product.getAttribute('data-category') || "").toLowerCase();
            
            if (clickedCategory === "all" || productCategories.includes(clickedCategory)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
n
        productRows.forEach(row => {
            const hasVisibleContent = Array.from(row.querySelectorAll('.product-card')).some(p => p.style.display !== 'none');
            row.style.display = hasVisibleContent ? "flex" : "none";
        });
    });
});

// === 6. SHOPPING CART LOGIC ===
let cart = JSON.parse(localStorage.getItem('asterCart')) || [];

function addToCart(bookName, price, bookImg) { 
    const existingItem = cart.find(item => item.name === bookName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: bookName, price: parseFloat(price), image: bookImg, quantity: 1 });
    }
    localStorage.setItem('asterCart', JSON.stringify(cart));
    alert(`${bookName} has been added to your cart!`);
    updateOrderCount();
}

function updateOrderCount() {
    const orderLink = document.querySelector('a[href="order.html"] span');
    if (orderLink) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        orderLink.innerText = `Order (${totalItems})`;
    }
}

// === 7. DYNAMIC PRODUCT DETAIL POPUP ===
const modal = document.getElementById("productDetailModal");

document.addEventListener('click', function (e) {
    const card = e.target.closest('.product-card');
    const isButton = e.target.classList.contains('btn');

    if (card && !isButton) {
        const title = card.querySelector('h3').innerText;
        const img = card.querySelector('img').src;
        const priceText = card.querySelector('.price').innerText;
        const priceValue = priceText.replace('$', '');
        
        const description = card.getAttribute('data-description') || "No description available for this book.";

        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalImg").src = img;
        document.getElementById("modalPrice").innerText = priceText;
        document.getElementById("modalDescription").innerText = description;

        const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
        if (modalAddToCartBtn) {
            modalAddToCartBtn.onclick = function() {
                addToCart(title, priceValue, img); 
            };
        }

        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; 
    }
});

// === 8. CLOSE MODAL LOGIC ===
document.addEventListener('click', function (e) {
    const isCloseBtn = e.target.classList.contains('close-modal');
    if (isCloseBtn || e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

updateOrderCount();