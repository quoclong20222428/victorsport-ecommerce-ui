/**
 * main.js — Shared interactive behaviors
 * Justplay Sportswear E-commerce
 */

'use strict';

/* ==========================================
   MOBILE MENU TOGGLE
========================================== */
(function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu   = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = !menu.hidden;
        menu.hidden = isOpen;
        toggle.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Đóng khi click bên ngoài
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
})();

/* ==========================================
   MOBILE DROPDOWN (trong mobile menu)
========================================== */
(function initMobileDropdowns() {
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const list = btn.nextElementSibling;
            if (!list) return;
            const isOpen = !list.hidden;
            list.hidden = isOpen;
            btn.setAttribute('aria-expanded', !isOpen);
        });
    });
})();

/* ==========================================
   CART COUNT — cập nhật từ localStorage
========================================== */
(function updateCartCount() {
    const badge = document.querySelector('.cart-count');
    if (!badge) return;

    const count = parseInt(localStorage.getItem('cart_count') || '0', 10);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
})();

/* ==========================================
   QUANTITY SELECTOR
========================================== */
(function initQuantitySelectors() {
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const minusBtn = selector.querySelector('.qty-btn:first-child');
        const plusBtn  = selector.querySelector('.qty-btn:last-child');
        const input    = selector.querySelector('.qty-input');
        if (!minusBtn || !plusBtn || !input) return;

        minusBtn.addEventListener('click', () => {
            const current = parseInt(input.value, 10);
            const min = parseInt(input.min || '1', 10);
            if (current > min) input.value = current - 1;
        });

        plusBtn.addEventListener('click', () => {
            const current = parseInt(input.value, 10);
            const max = parseInt(input.max || '99', 10);
            if (current < max) input.value = current + 1;
        });
    });
})();

/* ==========================================
   PRODUCT TABS
========================================== */
(function initTabs() {
    document.querySelectorAll('[role="tablist"]').forEach(tablist => {
        const tabs   = tablist.querySelectorAll('[role="tab"]');
        const panels = document.querySelectorAll('[role="tabpanel"]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all
                tabs.forEach(t => {
                    t.setAttribute('aria-selected', 'false');
                    t.classList.remove('active');
                });
                panels.forEach(p => { p.hidden = true; });

                // Activate clicked
                tab.setAttribute('aria-selected', 'true');
                tab.classList.add('active');
                const panel = document.getElementById(tab.getAttribute('aria-controls'));
                if (panel) panel.hidden = false;
            });
        });
    });
})();

/* ==========================================
   PRODUCT GALLERY THUMBNAILS
========================================== */
(function initGallery() {
    const mainImg = document.getElementById('main-product-image');
    if (!mainImg) return;

    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const src = thumb.querySelector('img')?.src;
            if (src) mainImg.src = src;
        });
    });
})();

/* ==========================================
   PASSWORD VISIBILITY TOGGLE
========================================== */
(function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.setAttribute('aria-label', isPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
        });
    });
})();

/* ==========================================
   WISHLIST BUTTON — toggle .active class
   Fill style via CSS: .wishlist-btn.active .lucide
========================================== */
(function initWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = btn.classList.toggle('active');
            btn.setAttribute('aria-label', isActive ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích');
        });
    });
})();

/* ==========================================
   MOBILE FILTER SIDEBAR
========================================== */
(function initFilterToggle() {
    const toggleBtn = document.querySelector('.filter-toggle-btn');
    const sidebar   = document.querySelector('.filters-sidebar');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebar.style.display = sidebar.classList.contains('open') ? 'block' : '';
    });
})();

/* ==========================================
   STICKY HEADER — thêm shadow khi scroll
========================================== */
(function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '';
        }
    }, { passive: true });
})();

/* ==========================================
   CART STORAGE HELPERS
   Single source of truth: localStorage 'jp_cart'
   All pages read/write through this module.
========================================== */
const Cart = (function () {
    const KEY = 'jp_cart';

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch (_) { return []; }
    }

    function save(items) {
        localStorage.setItem(KEY, JSON.stringify(items));
        var total = items.reduce(function(s, i) { return s + i.qty; }, 0);
        localStorage.setItem('cart_count', total);
    }

    function addItem(product) {
        var items = load();
        var existing = items.find(function(i) {
            return i.id === product.id && i.size === product.size && i.color === product.color;
        });
        if (existing) {
            existing.qty = Math.min(existing.qty + product.qty, 10);
        } else {
            items.push(product);
        }
        save(items);
        return load();
    }

    function removeItem(id, size, color) {
        var items = load().filter(function(i) {
            return !(i.id === id && i.size === size && i.color === color);
        });
        save(items);
        return items;
    }

    function updateQty(id, size, color, qty) {
        var items = load();
        var item = items.find(function(i) {
            return i.id === id && i.size === size && i.color === color;
        });
        if (item) item.qty = Math.max(1, Math.min(qty, 10));
        save(items);
        return items;
    }

    function getSubtotal() {
        return load().reduce(function(s, i) { return s + (i.price * i.qty); }, 0);
    }

    function count() {
        return load().reduce(function(s, i) { return s + i.qty; }, 0);
    }

    function clear() {
        localStorage.removeItem(KEY);
        localStorage.setItem('cart_count', '0');
    }

    /** Seed demo cart items if cart is empty (for demo flow).
     *  Uses inline data matching data/products.json demoCart. */
    function seedDemo() {
        if (load().length > 0) return;  // already has items
        var demoItems = [
            {
                id: 'ao-chay-bo-nam',
                name: '\u00c1o ch\u1ea1y b\u1ed9 nam',
                price: 599000,
                originalPrice: null,
                size: 'M',
                color: 'den',
                colorLabel: '\u0110en',
                qty: 1,
                image: 'https://placehold.co/120x150/EEEEEE/333333?text=Ao+chay+bo'
            },
            {
                id: 'quan-tap-gym',
                name: 'Qu\u1ea7n t\u1eadp gym',
                price: 399000,
                originalPrice: null,
                size: 'L',
                color: 'xam',
                colorLabel: 'X\u00e1m',
                qty: 2,
                image: 'https://placehold.co/120x150/EEEEEE/333333?text=Quan+gym'
            },
            {
                id: 'ao-khoac-chay-bo',
                name: '\u00c1o kho\u00e1c ch\u1ea1y b\u1ed9',
                price: 499000,
                originalPrice: 699000,
                size: 'M',
                color: 'do',
                colorLabel: '\u0110\u1ecf',
                qty: 1,
                image: 'https://placehold.co/120x150/EEEEEE/333333?text=Ao+khoac'
            }
        ];
        save(demoItems);
    }

    function formatPrice(n) {
        return n.toLocaleString('vi-VN') + '\u20ab';
    }

    return {
        load: load,
        save: save,
        addItem: addItem,
        removeItem: removeItem,
        updateQty: updateQty,
        getSubtotal: getSubtotal,
        count: count,
        clear: clear,
        seedDemo: seedDemo,
        formatPrice: formatPrice
    };
})();

/* ==========================================
   CART COUNT — update badge from Cart storage
========================================== */
(function updateCartCount() {
    const badge = document.querySelector('.cart-count');
    if (!badge) return;
    const n = Cart.count();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'flex' : 'none';
})();

/* ==========================================
   ADD TO CART
   Scoped strictly to #add-to-cart-btn
   (product-detail.html only)
   NEVER fires from cart.html checkout button
========================================== */
(function initAddToCart() {
    const addBtn = document.getElementById('add-to-cart-btn');
    if (!addBtn) return;   // not on product-detail page — bail

    addBtn.addEventListener('click', function() {
        const sizeInput  = document.querySelector('input[name="size"]:checked');
        const colorInput = document.querySelector('input[name="color"]:checked');
        const qtyInput   = document.querySelector('.product-detail-section .qty-input');

        if (!sizeInput) {
            const sizeGroup = document.querySelector('.size-options');
            if (sizeGroup) {
                sizeGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                sizeGroup.style.outline = '2px solid var(--color-primary)';
                sizeGroup.style.borderRadius = '4px';
                setTimeout(function() { sizeGroup.style.outline = ''; }, 2000);
            }
            return;
        }

        const colorLabel = document.getElementById('selected-color');
        const product = {
            id:    addBtn.dataset.productId || 'product-001',
            name:  addBtn.dataset.name || document.querySelector('.product-detail-name')?.textContent?.trim() || 'San pham',
            price: parseInt(addBtn.dataset.price || '599000', 10),
            originalPrice: addBtn.dataset.originalPrice ? parseInt(addBtn.dataset.originalPrice, 10) : null,
            size:  sizeInput.value,
            color: colorInput ? colorInput.value : 'mac-dinh',
            colorLabel: colorLabel ? colorLabel.textContent.trim() : (colorInput ? colorInput.value : 'Mặc định'),
            qty:   parseInt(qtyInput ? qtyInput.value : '1', 10),
            image: document.getElementById('main-product-image')?.src || '',
        };

        Cart.addItem(product);

        const badge = document.querySelector('.cart-count');
        const n = Cart.count();
        if (badge) {
            badge.textContent = n;
            badge.style.display = 'flex';
        }

        const original = addBtn.textContent;
        addBtn.textContent = 'Đã thêm vào giỏ hàng';
        addBtn.disabled = true;
        setTimeout(function() {
            addBtn.textContent = original;
            addBtn.disabled = false;
        }, 2000);
    });
})();

/* ==========================================
   CHECKOUT BUTTON — cart.html only
   Business rule:
     Cart empty  → block, show error message
     Cart items  → navigate to checkout.html
   NEVER calls addToCart logic
========================================== */
(function initCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;   // not on cart page — bail

    checkoutBtn.addEventListener('click', function() {
        const items = Cart.load();

        if (items.length === 0) {
            let msg = document.getElementById('cart-empty-checkout-msg');
            if (!msg) {
                msg = document.createElement('p');
                msg.id = 'cart-empty-checkout-msg';
                msg.setAttribute('role', 'alert');
                msg.style.cssText = [
                    'color:var(--color-error)',
                    'font-size:var(--font-size-body-sm)',
                    'margin-top:var(--space-xs)',
                    'text-align:center'
                ].join(';');
                msg.textContent = 'Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.';
                checkoutBtn.parentNode.insertBefore(msg, checkoutBtn.nextSibling);
            }
            msg.hidden = false;
            return;
        }

        window.location.href = 'checkout.html';
    });
})();

/* ==========================================
   CART PAGE — Data-driven from localStorage
   Renders items dynamically, syncs all changes
   back to Cart storage (localStorage jp_cart).
========================================== */
(function initCartPage() {
    var container = document.getElementById('cart-items-container');
    if (!container) return;  // not on cart page

    // Seed demo data if cart is empty (first visit)
    Cart.seedDemo();

    // DOM refs
    var cartLayout    = document.querySelector('.cart-layout');
    var cartContinue  = document.querySelector('.cart-continue');
    var emptyState    = document.getElementById('cart-empty-state');
    var subtotalEl    = document.querySelector('.summary-subtotal-value');
    var totalEl       = document.querySelector('.summary-total-value');
    var countEl       = document.querySelector('.cart-item-count');

    /** Render the full cart from localStorage */
    function renderCart() {
        var items = Cart.load();

        // Empty state
        if (items.length === 0) {
            if (cartLayout)   cartLayout.style.display   = 'none';
            if (cartContinue) cartContinue.style.display = 'none';
            if (emptyState)   emptyState.hidden = false;
            container.innerHTML = '';
            updateSummary(items);
            updateBadge();
            return;
        }

        // Has items — show cart layout
        if (cartLayout)   cartLayout.style.display = '';
        if (cartContinue) cartContinue.style.display = '';
        if (emptyState)   emptyState.hidden = true;

        // Build HTML for each cart item
        var html = '';
        items.forEach(function(item, idx) {
            var lineTotal = item.price * item.qty;
            html += '<div class="cart-item" data-idx="' + idx + '" data-id="' + item.id + '" data-size="' + item.size + '" data-color="' + item.color + '" data-unit-price="' + item.price + '">';
            html += '  <img src="' + (item.image || 'https://placehold.co/120x150/EEEEEE/333333?text=SP') + '" alt="' + item.name + '" class="cart-item-image">';
            html += '  <div class="cart-item-details">';
            html += '    <h2 class="cart-item-name"><a href="product-detail.html">' + item.name + '</a></h2>';
            html += '    <p class="cart-item-variant">Size: ' + item.size + ' | M\u00e0u: ' + (item.colorLabel || item.color) + '</p>';
            html += '    <p class="cart-item-price">' + Cart.formatPrice(lineTotal) + '</p>';
            html += '    <div class="cart-item-actions">';
            html += '      <div class="quantity-selector">';
            html += '        <button type="button" class="qty-btn qty-btn--minus" aria-label="Gi\u1ea3m s\u1ed1 l\u01b0\u1ee3ng"><i data-lucide="minus"></i></button>';
            html += '        <input type="number" class="qty-input" value="' + item.qty + '" min="1" max="10" aria-label="S\u1ed1 l\u01b0\u1ee3ng">';
            html += '        <button type="button" class="qty-btn qty-btn--plus" aria-label="T\u0103ng s\u1ed1 l\u01b0\u1ee3ng"><i data-lucide="plus"></i></button>';
            html += '      </div>';
            html += '      <button type="button" class="cart-remove-btn" aria-label="X\u00f3a ' + item.name + '"><i data-lucide="trash-2" aria-hidden="true"></i></button>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
        });

        container.innerHTML = html;
        updateSummary(items);
        updateBadge();

        // Re-init Lucide icons for newly rendered elements
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    /** Update summary panel */
    function updateSummary(items) {
        var subtotal  = items.reduce(function(s, i) { return s + (i.price * i.qty); }, 0);
        var totalQty  = items.reduce(function(s, i) { return s + i.qty; }, 0);
        if (subtotalEl) subtotalEl.textContent = Cart.formatPrice(subtotal);
        if (totalEl)    totalEl.textContent    = Cart.formatPrice(subtotal);
        if (countEl)    countEl.textContent    = '(' + totalQty + ' s\u1ea3n ph\u1ea9m)';
    }

    /** Sync cart badge in header */
    function updateBadge() {
        var badge = document.querySelector('.cart-count');
        var n = Cart.count();
        if (badge) {
            badge.textContent = n;
            badge.style.display = n > 0 ? 'flex' : 'none';
        }
    }

    // ---- Event delegation: Qty +/- ----
    container.addEventListener('click', function(e) {
        var minusBtn = e.target.closest('.qty-btn--minus');
        var plusBtn  = e.target.closest('.qty-btn--plus');
        if (!minusBtn && !plusBtn) return;

        var el    = (minusBtn || plusBtn).closest('.cart-item');
        var input = el ? el.querySelector('.qty-input') : null;
        if (!el || !input) return;

        var newQty = parseInt(input.value, 10);
        if (minusBtn) newQty = Math.max(1, newQty - 1);
        if (plusBtn)  newQty = Math.min(10, newQty + 1);

        // Update localStorage
        Cart.updateQty(el.dataset.id, el.dataset.size, el.dataset.color, newQty);

        // Re-render (simple and correct)
        renderCart();
    });

    // ---- Event delegation: Remove ----
    container.addEventListener('click', function(e) {
        var btn = e.target.closest('.cart-remove-btn');
        if (!btn) return;
        var el = btn.closest('.cart-item');
        if (!el) return;

        // Fade out then remove from storage
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.25s ease';
        setTimeout(function() {
            Cart.removeItem(el.dataset.id, el.dataset.size, el.dataset.color);
            renderCart();
        }, 250);
    });

    // ---- Initial render ----
    renderCart();
})();



/* ==========================================
   HERO CAROUSEL
   - Autoplay every 5 seconds
   - Prev / Next / Dot navigation
   - Pause on hover
   - prefers-reduced-motion aware
   - aria-hidden management
========================================== */
(function initHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    const track       = carousel.querySelector('.hero-carousel-track');
    const slides      = carousel.querySelectorAll('.hero-slide');
    const dots        = carousel.querySelectorAll('.hero-dot');
    const prevBtn     = carousel.querySelector('.hero-carousel-btn--prev');
    const nextBtn     = carousel.querySelector('.hero-carousel-btn--next');

    if (!track || !slides.length) return;

    const TOTAL      = slides.length;
    const INTERVAL   = 5000;  // ms between auto-advances
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current  = 0;
    let timer    = null;
    let paused   = false;

    /* --- Core: go to slide N --- */
    function goTo(index) {
        // Wrap around
        index = (index + TOTAL) % TOTAL;

        // Remove active from old slide
        slides[current].classList.remove('is-active');
        slides[current].setAttribute('aria-hidden', 'true');

        // Update dots
        dots[current].classList.remove('hero-dot--active');
        dots[current].setAttribute('aria-selected', 'false');

        current = index;

        // Translate track
        track.style.transform = `translateX(-${current * 100}%)`;

        // Activate new slide
        slides[current].classList.add('is-active');
        slides[current].setAttribute('aria-hidden', 'false');

        // Update dots
        dots[current].classList.add('hero-dot--active');
        dots[current].setAttribute('aria-selected', 'true');
    }

    /* --- Autoplay --- */
    function startTimer() {
        if (prefersReduced) return;   // no autoplay for reduced-motion users
        stopTimer();
        timer = setInterval(() => {
            if (!paused) goTo(current + 1);
        }, INTERVAL);
    }

    function stopTimer() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    function resetTimer() {
        stopTimer();
        startTimer();
    }

    /* --- Init first slide --- */
    slides[0].classList.add('is-active');
    slides[0].setAttribute('aria-hidden', 'false');

    /* --- Prev / Next buttons --- */
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goTo(current - 1);
            resetTimer();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goTo(current + 1);
            resetTimer();
        });
    }

    /* --- Dot clicks --- */
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = parseInt(dot.getAttribute('data-slide'), 10);
            goTo(target);
            resetTimer();
        });
    });

    /* --- Pause on hover --- */
    carousel.addEventListener('mouseenter', () => { paused = true; });
    carousel.addEventListener('mouseleave', () => { paused = false; });

    /* --- Touch / Swipe support (mobile) --- */
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {         // 50px threshold
            goTo(diff > 0 ? current + 1 : current - 1);
            resetTimer();
        }
    }, { passive: true });

    /* --- Keyboard navigation --- */
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
    });

    /* --- Start autoplay --- */
    startTimer();
})();
