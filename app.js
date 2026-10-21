// Good Me Interactive App Logic

document.addEventListener('DOMContentLoaded', () => {
  // Top Announcement Bar dismiss
  const topBar = document.getElementById('announcement-bar');
  const closeTopBarBtn = document.getElementById('closeTopBarBtn');
  if (closeTopBarBtn) {
    closeTopBarBtn.addEventListener('click', () => {
      topBar.style.display = 'none';
    });
  }

  // Cart Drawer open/close
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');

  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Toast Helper
  const toast = document.getElementById('toastNotice');
  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  // Add to cart buttons
  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  const cartCountEl = document.getElementById('cartCount');
  const cartDrawerCountEl = document.getElementById('cartDrawerCount');
  const cartItemsList = document.getElementById('cartItemsList');
  let currentCount = 2;

  addCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const title = btn.getAttribute('data-title');
      const price = btn.getAttribute('data-price');
      
      currentCount++;
      if (cartCountEl) cartCountEl.textContent = currentCount;
      if (cartDrawerCountEl) cartDrawerCountEl.textContent = currentCount;

      // Add item element to cart drawer
      const newItem = document.createElement('div');
      newItem.className = 'cart-item';
      newItem.innerHTML = `
        <div class="cart-item-img">🍃</div>
        <div class="cart-item-info">
          <h4>${title}</h4>
          <span class="cart-item-price">$${price}.00</span>
          <div class="qty-stepper">
            <button class="qty-btn" onclick="updateItemQty(this, -1)">-</button>
            <span class="qty-val">1</span>
            <button class="qty-btn" onclick="updateItemQty(this, 1)">+</button>
          </div>
        </div>
        <button class="btn-remove" onclick="removeCartItem(this)">&times;</button>
      `;
      cartItemsList.appendChild(newItem);
      recalculateSubtotal();

      showToast(`Added "${title}" to your ritual!`);
      openCart();
    });
  });

  // Filter tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');
      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Interactive Quiz Logic
  const step1 = document.getElementById('quizStep1');
  const step2 = document.getElementById('quizStep2');
  const step3 = document.getElementById('quizStep3');
  const progressBar = document.getElementById('quizProgress');
  const restartBtn = document.getElementById('restartQuizBtn');

  const quizOptionBtns1 = step1.querySelectorAll('.quiz-option-btn');
  quizOptionBtns1.forEach(btn => {
    btn.addEventListener('click', () => {
      step1.style.display = 'none';
      step2.style.display = 'block';
      progressBar.style.width = '66%';
    });
  });

  const quizOptionBtns2 = step2.querySelectorAll('.quiz-option-btn');
  quizOptionBtns2.forEach(btn => {
    btn.addEventListener('click', () => {
      step2.style.display = 'none';
      step3.style.display = 'block';
      progressBar.style.width = '100%';
    });
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      step3.style.display = 'none';
      step1.style.display = 'block';
      progressBar.style.width = '33%';
    });
  }

  const addResultToCartBtn = document.getElementById('addResultToCart');
  if (addResultToCartBtn) {
    addResultToCartBtn.addEventListener('click', () => {
      currentCount++;
      if (cartCountEl) cartCountEl.textContent = currentCount;
      if (cartDrawerCountEl) cartDrawerCountEl.textContent = currentCount;
      showToast('Formula added to cart with 20% discount applied!');
      openCart();
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      newsletterFeedback.innerHTML = `🎉 Welcome to the inner circle! Your 20% voucher code <strong>TOXA20</strong> has been sent to ${email}.`;
      newsletterForm.reset();
    });
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#fbf8f3';
        navLinks.style.padding = '24px';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      }
    });
  }
});

// Global functions for cart item manipulation
function updateItemQty(btn, delta) {
  const stepper = btn.closest('.qty-stepper');
  const valEl = stepper.querySelector('.qty-val');
  let val = parseInt(valEl.textContent) + delta;
  if (val <= 0) {
    removeCartItem(btn);
  } else {
    valEl.textContent = val;
    recalculateSubtotal();
  }
}

function removeCartItem(btn) {
  const item = btn.closest('.cart-item');
  if (item) {
    item.remove();
    const cartCountEl = document.getElementById('cartCount');
    const cartDrawerCountEl = document.getElementById('cartDrawerCount');
    let count = document.querySelectorAll('.cart-item').length;
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartDrawerCountEl) cartDrawerCountEl.textContent = count;
    recalculateSubtotal();
  }
}

function recalculateSubtotal() {
  const items = document.querySelectorAll('.cart-item');
  let sum = 0;
  items.forEach(it => {
    const priceText = it.querySelector('.cart-item-price')?.textContent || '$0';
    const price = parseFloat(priceText.replace('$', '')) || 0;
    const qty = parseInt(it.querySelector('.qty-val')?.textContent || '1') || 1;
    sum += price * qty;
  });
  const subtotalEl = document.getElementById('cartSubtotalVal');
  if (subtotalEl) {
    subtotalEl.textContent = `$${sum.toFixed(2)}`;
  }
}
