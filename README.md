# Victor Sport - E-Commerce Website

A modern, high-performance, and responsive e-commerce web interface built for **Victor Sport**, an athletic apparel and sportswear brand.

---

## 🌟 Key Features

- **Homepage (`index.html`)**
  - Full-width hero showcase with call-to-action buttons
  - Interactive "Shop by Sport" category grid (Gym & Fitness, Running, Football, Yoga, Pickleball, etc.)
  - Featured / Bestseller product grid with badges, price tags, color swatches, and wishlist toggles
  - Promotional banner and USP (Unique Selling Proposition) feature cards
  - Newsletter subscription form

- **Product Listing Page (`products.html`)**
  - Sidebar filters for Categories, Sports, Sizes, Colors, and Price ranges
  - Mobile-responsive sliding filter drawer
  - Product sorting controls (Latest, Price Low to High, Price High to Low, Popularity)
  - Responsive multi-column product layout with pagination

- **Product Detail Page (`product-detail.html`)**
  - Interactive image gallery with thumbnail switcher
  - Dynamic size and color swatches selection
  - Interactive quantity selector
  - Add to cart and wishlist quick actions
  - Trust signals (Free Shipping, Return Policy, Authenticity Guarantee)
  - Tabbed interface for Product Description, Technical Specifications, and Customer Reviews
  - Related product suggestions

- **Shopping Cart Page (`cart.html`)**
  - Detailed cart item listing with variant options (Size, Color)
  - Quantity adjustments with real-time state updates
  - Sticky order summary sidebar with free shipping thresholds
  - Secure checkout action trigger

- **Sport Landing Page (`sport.html`)**
  - Dedicated promotional layout for specific sports (e.g., Pickleball collection)
  - Hero banner with targeted messaging and sport category products

- **Authentication Page (`login.html`)**
  - Tabbed interface for switching between Login and Registration forms
  - Password visibility toggle
  - Social media quick login options (Google, Facebook)
  - Form validation states and accessibility attributes

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup, ARIA roles, WCAG 2.1 accessibility standards
- **CSS3**: Pure Vanilla CSS architecture utilizing Design Tokens (CSS Variables), Flexbox, and CSS Grid (No heavy framework dependencies)
- **JavaScript (ES6+)**: Vanilla JavaScript for modular interactive components (Mobile menu, Mega-menu dropdown, Tabs, Wishlist state, Cart counter, Quantity selectors)
- **Icons**: Lucide Icons SVG library integrated via UMD CDN

---

## 📁 Project Structure

```
code_assignment/
├── css/
│   ├── reset.css          # Browser style resets & normalizations
│   ├── tokens.css         # Design tokens (Colors, Typography, Spacing, Radius, Shadows)
│   ├── layout.css         # Grid layouts, containers, section spacing
│   ├── components.css     # UI components (Header, Footer, Buttons, Cards, Navigation, Mega-menu)
│   ├── pages.css          # Page-specific styling
│   └── responsive.css     # Mobile, tablet, and print media queries
├── js/
│   └── main.js            # Global UI interaction scripts
├── images/
│   └── logo_brand.png     # Brand logo asset
├── index.html             # Homepage
├── products.html          # Product catalog & filter page
├── product-detail.html    # Product detail showcase
├── cart.html              # Shopping cart & checkout preview
├── sport.html             # Sport category promotional page
├── login.html             # User authentication (Login / Sign Up)
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser, or launch using a local development server (such as VS Code Live Server or `npx serve`). No build tools or package installations are required.
