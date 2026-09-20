# 🍕 Oven Express — Campus Food Stall & Delivery Web App

[![GitHub Pages](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://lunaca47.github.io/Oven-express/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A modern, responsive web application designed for campus food ordering and delivery. Built with semantic HTML5, modern Tailwind CSS, and Vanilla JavaScript (ES6+).

🌐 **Live Demo:** [https://lunaca47.github.io/Oven-express/](https://lunaca47.github.io/Oven-express/)

---

## 📌 Project Overview

**Oven Express** is a campus food stall platform crafted to solve the everyday student problem: fast, reliable food between packed lectures and late-night study sessions. The platform provides a seamless browsing and ordering experience with zero framework overhead, featuring real-time menu search, persistent shopping cart, checkout flow with campus hostel delivery details, and a live 4-stage order tracker.

---

## ✨ Key Features

### 🛒 1. Dynamic Cart & Real-Time Navbar Badges
- Items stored and synced in `localStorage` across page navigation and sessions.
- Dynamic cart counter badge displayed on both desktop and mobile navigation headers with subtle pop animations upon adding items.
- Full cart controls on the order page: increment (`+`), decrement (`-`), and remove with instant subtotal and 5% GST recalculation.

### 🔍 2. Instant Menu Search & Category Filtering
- Instant keyword search filtering by dish name or ingredients (e.g. *pizza*, *burger*, *paneer*, *fries*).
- Category pill navigation (*All, Pizza, Burgers, Sandwiches, Snacks, Beverages*).
- Interactive "No items found" state when search query yields no matches.

### 📋 3. Campus Delivery Checkout
- Dedicated modal capturing student order details:
  - **Full Name & Contact Phone**
  - **Hostel / Campus Location Selector** (Boys Hostels 1–4, Girls Hostels 1–3, Central Library, Academic Block 34, or Direct Counter Pickup)
  - **Room / Desk Number**
  - **Payment Modes**: UPI / QR Code, Cash on Delivery (COD), or Campus SmartCard.

### ⏱️ 4. Live 4-Stage Order Tracking System
- Interactive simulation showing real-time delivery status:
  1. **Confirmed** — Order queued in stall kitchen.
  2. **In Oven** — Baking fresh in the oven 🔥
  3. **On the Way** — Campus runner en route to hostel 🛵
  4. **Delivered** — Arrived at student's room / block 🎉
- Dynamically animated progress bar (`12%` → `40%` → `75%` → `100%`) with pulse animations and time estimates.

### 🖨️ 5. Printable Invoices & Floating Receipt Modal
- Displays generated Order ID (e.g. `#OE-4921`), itemized summary, student delivery info, and total.
- One-click print feature using clean, dedicated `@media print` CSS stylesheet.
- Direct jump button to live order tracking.

### 🖼️ 6. Interactive Gallery with Responsive Lightbox
- High-resolution local imagery showcasing campus stall specialties.
- Full-screen modal lightbox for inspection on click.

### 📱 7. Responsive & Mobile-First Design
- Mobile hamburger menu drawer with smooth toggle animations.
- Custom scroll reveal transitions powered by the `IntersectionObserver` API.
- Custom preloader with smooth body fade-in and failsafe timer.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessibility, and meta tags |
| **Tailwind CSS (CDN)** | Utility-first styling, responsive grid layouts, design tokens |
| **Vanilla JavaScript (ES6+)** | State management (`localStorage`), DOM manipulation, event delegation |
| **CSS3** | Custom keyframe animations, preloader, lightbox, print styles |
| **IntersectionObserver API** | Performant scroll-reveal animations |

---

## 📂 Project Structure

```bash
OVEN-EXPRESS/
├── images/             # 22 high-quality local food and stall photos
│   ├── pizza1.jpg
│   ├── pizza2.jpg
│   ├── burger1.webp
│   ├── bread.webp
│   ├── fires.webp
│   ├── coffee.webp
│   └── ...
├── .gitignore          # Ignores IDE and OS temp files
├── about.html          # Stall story, mission, metrics, and campus crew
├── contact.html        # Stall location, hours, WhatsApp group, and validated contact form
├── gallery.html        # Showcase gallery with interactive lightbox modal
├── home.html           # Automatic redirect to index.html
├── index.html          # Landing page with hero banner, bestsellers, and key USPs
├── menu.html           # Full menu with search bar, category tabs, and add-to-cart
├── order.html          # Cart view, campus checkout modal, receipt, and live tracking
├── README.md           # Project documentation and CV showcase
├── script.js           # Core client logic (cart, filters, checkout, tracking, modals)
└── styles.css          # Custom animations, preloader, tracking pulses, and print rules
```

---

## 🚀 Running Locally

No build tools or package managers required. Simply clone and run:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lunaca47/Oven-express.git
   cd Oven-express
   ```

2. **Open in browser:**
   - Double click `index.html` to open in any web browser, **OR**
   - Use VS Code extension **Live Server** (Right-click `index.html` → *Open with Live Server*).

---

## 🌐 How to Enable GitHub Pages (Free Live Hosting)

To activate your live demo URL for your CV:

1. Open your repository on GitHub: **[https://github.com/Lunaca47/Oven-express](https://github.com/Lunaca47/Oven-express)**
2. Click on **Settings** (top right gear icon).
3. In the left sidebar, click on **Pages** (under *Code and automation*).
4. Under **Build and deployment** → **Branch**:
   - Select **`main`** from the branch dropdown.
   - Select **`/ (root)`** folder.
   - Click **Save**.
5. Wait 60–90 seconds. Refresh the page, and GitHub will provide your live URL:
   > 🔗 **`https://lunaca47.github.io/Oven-express/`**

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
