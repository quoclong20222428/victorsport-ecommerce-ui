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
   ADD TO CART (demo)
========================================== */
(function initAddToCart() {
    const addBtn = document.querySelector('.btn--primary[class*="btn--full"]');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
        // Demo: tăng cart count
        const current = parseInt(localStorage.getItem('cart_count') || '0', 10);
        const next = current + 1;
        localStorage.setItem('cart_count', next);

        // Cập nhật badge
        const badge = document.querySelector('.cart-count');
        if (badge) {
            badge.textContent = next;
            badge.style.display = 'flex';
        }

        // Feedback
        const originalText = addBtn.textContent;
        addBtn.textContent = '✓ Đã thêm vào giỏ!';
        addBtn.disabled = true;
        setTimeout(() => {
            addBtn.textContent = originalText;
            addBtn.disabled = false;
        }, 2000);
    });
})();
