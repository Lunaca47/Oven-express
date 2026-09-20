// ===================================
// 1. Tailwind Configuration
// ===================================
window.tailwindConfig = {
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: "#F39C12",
                    cream: "#FDF5E6",
                    brown: "#4A2C2A",
                },
            },
            boxShadow: {
                soft: "0 10px 25px rgba(0,0,0,0.08)",
                card: "0 18px 45px rgba(0,0,0,0.12)",
            },
            borderRadius: {
                "2xl": "1.25rem",
            },
        },
    },
};
if (typeof tailwind !== "undefined") {
    tailwind.config = window.tailwindConfig;
}

// ===================================
// 2. Global Cart Management
// ===================================
let cart = JSON.parse(localStorage.getItem("ovenExpressCart") || "[]");

function saveCart() {
    localStorage.setItem("ovenExpressCart", JSON.stringify(cart));
    updateCartBadges(true);
}

function getCartCount() {
    return cart.reduce((total, item) => total + (item.qty || 1), 0);
}

function updateCartBadges(animate = false) {
    const count = getCartCount();
    document.querySelectorAll(".cart-count-badge").forEach((badge) => {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove("hidden");
            if (animate) {
                badge.classList.remove("cart-badge-bounce");
                void badge.offsetWidth; // Trigger reflow
                badge.classList.add("cart-badge-bounce");
            }
        } else {
            badge.textContent = "0";
            badge.classList.add("hidden");
        }
    });
}

function addToCart(item) {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart();
}

// ===================================
// 3. Main Application Script
// ===================================
document.addEventListener("DOMContentLoaded", () => {

    // --- Global Load & UI ---
    function removePreloader() {
        document.body.classList.add("loaded");
        const pre = document.getElementById("preloader");
        if (pre) pre.classList.add("hidden");
    }

    window.addEventListener("load", removePreloader);
    setTimeout(removePreloader, 400); // Safe fallback

    // Initialize Cart Badges across all pages
    updateCartBadges(false);

    // Mobile menu toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", () => {
            const isClosed = mobileMenu.classList.contains("max-h-0");
            if (isClosed) {
                mobileMenu.classList.remove("max-h-0");
                mobileMenu.classList.add("max-h-[380px]");
            } else {
                mobileMenu.classList.add("max-h-0");
                mobileMenu.classList.remove("max-h-[380px]");
            }
        });
    }

    // Scroll reveal (runs on all pages)
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    } else {
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    }


    // --- Menu Page Logic (runs on menu.html) ---

    if (document.title.includes("Menu") || document.getElementById("menuGrid")) {
        const filterButtons = document.querySelectorAll(".menu-filter");
        const menuCards = document.querySelectorAll(".menu-card");
        const searchInput = document.getElementById("menuSearch");
        const noItemsMsg = document.getElementById("noItemsMsg");
        let activeCategory = "all";

        function applyMenuFilters() {
            const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
            let visibleCount = 0;

            menuCards.forEach((card) => {
                const cat = card.getAttribute("data-category") || "";
                const name = (card.getAttribute("data-name") || "").toLowerCase();
                const desc = (card.querySelector("p")?.textContent || "").toLowerCase();

                const matchesCat = activeCategory === "all" || cat === activeCategory;
                const matchesSearch = !query || name.includes(query) || desc.includes(query);

                if (matchesCat && matchesSearch) {
                    card.classList.remove("hidden");
                    visibleCount++;
                } else {
                    card.classList.add("hidden");
                }
            });

            if (noItemsMsg) {
                if (visibleCount === 0) {
                    noItemsMsg.classList.remove("hidden");
                } else {
                    noItemsMsg.classList.add("hidden");
                }
            }
        }

        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                activeCategory = btn.getAttribute("data-filter") || "all";

                filterButtons.forEach((b) => {
                    b.classList.remove("active", "bg-brand-orange", "text-white");
                    b.classList.add("bg-orange-50", "text-brand-brown");
                });
                btn.classList.remove("bg-orange-50", "text-brand-brown");
                btn.classList.add("active", "bg-brand-orange", "text-white");

                applyMenuFilters();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", applyMenuFilters);
        }

        // Attach add-to-cart to all menu cards
        document.querySelectorAll(".menu-card .add-cart-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".menu-card");
                if (!card) return;
                const id = card.getAttribute("data-id");
                const name = card.getAttribute("data-name");
                const price = parseFloat(card.getAttribute("data-price") || "0");
                const img = card.getAttribute("data-img");

                addToCart({ id, name, price, img });

                const origText = btn.textContent;
                btn.textContent = "Added ✓";
                btn.classList.add("bg-emerald-600");
                setTimeout(() => {
                    btn.textContent = origText;
                    btn.classList.remove("bg-emerald-600");
                }, 1200);
            });
        });
    }


    // --- Order Page Logic (runs on order.html) ---

    if (document.title.includes("Order") || document.getElementById("cartView")) {
        const cartView = document.getElementById("cartView");
        const orderTrackingView = document.getElementById("orderTrackingView");
        const cartItemsEl = document.getElementById("cartItems");
        const emptyCartEl = document.getElementById("emptyCart");
        const subtotalEl = document.getElementById("subtotalAmount");
        const taxEl = document.getElementById("taxAmount");
        const totalEl = document.getElementById("totalAmount");
        const checkoutBtn = document.getElementById("checkoutBtn");

        // Checkout Modal elements
        const checkoutModal = document.getElementById("checkoutModal");
        const checkoutForm = document.getElementById("checkoutForm");
        const cancelCheckoutBtn = document.getElementById("cancelCheckoutBtn");

        // Receipt Modal elements
        const receiptModal = document.getElementById("receiptModal");
        const receiptClose = document.getElementById("receiptClose");
        const receiptItemsEl = document.getElementById("receiptItems");
        const receiptSubtotalEl = document.getElementById("receiptSubtotal");
        const receiptTaxEl = document.getElementById("receiptTax");
        const receiptTotalEl = document.getElementById("receiptTotal");
        const receiptOrderIdEl = document.getElementById("receiptOrderId");
        const receiptCustomerInfoEl = document.getElementById("receiptCustomerInfo");
        const receiptPrintBtn = document.getElementById("receiptPrintBtn");
        const receiptTrackBtn = document.getElementById("receiptTrackBtn");

        // Tracking elements
        const orderIdDisplay = document.getElementById("orderIdDisplay");
        const trackingCustomerName = document.getElementById("trackingCustomerName");
        const trackingAddress = document.getElementById("trackingAddress");
        const progressBar = document.getElementById("progressBar");
        const liveStatusMessage = document.getElementById("liveStatusMessage");
        const deliveryTime = document.getElementById("deliveryTime");
        const trackingSteps = document.querySelectorAll(".tracking-step");
        const newOrderBtn = document.getElementById("newOrderBtn");

        let trackingInterval = null;

        function renderCart() {
            if (!cartItemsEl || !emptyCartEl) return;

            cartItemsEl.innerHTML = "";
            let subtotal = 0;

            if (cart.length === 0) {
                emptyCartEl.classList.remove("hidden");
                cartItemsEl.classList.add("hidden");
                if (checkoutBtn) checkoutBtn.disabled = true;
            } else {
                emptyCartEl.classList.add("hidden");
                cartItemsEl.classList.remove("hidden");
                if (checkoutBtn) checkoutBtn.disabled = false;
            }

            cart.forEach((item) => {
                const itemTotal = item.price * item.qty;
                subtotal += itemTotal;

                const row = document.createElement("div");
                row.classList.add("flex", "items-center", "gap-3", "p-3", "rounded-xl", "bg-slate-50", "border", "border-orange-50");
                row.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="h-14 w-14 rounded-xl object-cover shadow-sm" />
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-brand-brown text-sm truncate">${item.name}</p>
                        <p class="text-xs text-brand-orange font-medium">₹ ${item.price.toFixed(2)} each</p>
                        <div class="flex items-center gap-2 mt-1">
                            <button data-action="decrease" data-id="${item.id}" class="h-6 w-6 rounded bg-white border border-slate-200 text-brand-brown hover:bg-orange-50 flex items-center justify-center font-bold text-xs shadow-xs">-</button>
                            <span class="text-xs font-semibold px-1 text-slate-700">${item.qty}</span>
                            <button data-action="increase" data-id="${item.id}" class="h-6 w-6 rounded bg-white border border-slate-200 text-brand-brown hover:bg-orange-50 flex items-center justify-center font-bold text-xs shadow-xs">+</button>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-brand-brown text-sm">₹ ${itemTotal.toFixed(2)}</p>
                        <button data-action="remove" data-id="${item.id}" class="text-xs text-red-500 hover:text-red-600 hover:underline mt-1">Remove</button>
                    </div>
                `;
                cartItemsEl.appendChild(row);
            });

            const tax = subtotal * 0.05;
            const total = subtotal + tax;

            if (subtotalEl) subtotalEl.textContent = "₹ " + subtotal.toFixed(2);
            if (taxEl) taxEl.textContent = "₹ " + tax.toFixed(2);
            if (totalEl) totalEl.textContent = "₹ " + total.toFixed(2);
        }

        // Cart Actions Delegation
        if (cartItemsEl) {
            cartItemsEl.addEventListener("click", (e) => {
                const btn = e.target.closest("button[data-action]");
                if (!btn) return;
                const action = btn.getAttribute("data-action");
                const id = btn.getAttribute("data-id");
                const item = cart.find((c) => c.id === id);
                if (!item) return;

                if (action === "increase") {
                    item.qty += 1;
                } else if (action === "decrease") {
                    item.qty -= 1;
                    if (item.qty <= 0) {
                        cart = cart.filter((c) => c.id !== id);
                    }
                } else if (action === "remove") {
                    cart = cart.filter((c) => c.id !== id);
                }

                saveCart();
                renderCart();
            });
        }

        // Open Delivery Details Modal
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                if (!cart.length) return;
                if (checkoutModal) {
                    checkoutModal.classList.add("active");
                }
            });
        }

        if (cancelCheckoutBtn && checkoutModal) {
            cancelCheckoutBtn.addEventListener("click", () => {
                checkoutModal.classList.remove("active");
            });
        }

        // Handle Checkout Form Submission & Place Order
        if (checkoutForm) {
            checkoutForm.addEventListener("submit", (e) => {
                e.preventDefault();
                if (!cart.length) return;

                const name = document.getElementById("custName")?.value.trim() || "Student";
                const phone = document.getElementById("custPhone")?.value.trim() || "";
                const block = document.getElementById("custBlock")?.value || "Hostel";
                const room = document.getElementById("custRoom")?.value.trim() || "";
                const payment = document.querySelector("input[name='paymentMethod']:checked")?.value || "UPI";

                const orderId = "OE-" + Math.floor(1000 + Math.random() * 9000);
                const addressStr = `${block}, Room ${room || "Ground Floor"}`;

                // Snapshot of cart
                const snapshot = JSON.parse(JSON.stringify(cart));

                // Close checkout modal
                if (checkoutModal) checkoutModal.classList.remove("active");

                // Populate Receipt Modal
                openReceiptModal(snapshot, orderId, name, phone, addressStr, payment);

                // Start Live Order Tracking
                startOrderTracking(orderId, name, addressStr);

                // Clear active cart
                cart = [];
                saveCart();
                renderCart();
            });
        }

        function openReceiptModal(snapshot, orderId, name, phone, address, payment) {
            if (!receiptModal || !receiptItemsEl) return;

            if (receiptOrderIdEl) receiptOrderIdEl.textContent = "#" + orderId;
            if (receiptCustomerInfoEl) {
                receiptCustomerInfoEl.innerHTML = `
                    <div class="text-xs text-slate-600 bg-orange-50/70 p-2.5 rounded-xl border border-orange-100">
                        <p class="font-semibold text-brand-brown">${name} (${phone})</p>
                        <p>${address}</p>
                        <p class="text-[11px] text-slate-500 mt-1">Payment: <span class="font-semibold text-brand-orange">${payment}</span></p>
                    </div>
                `;
            }

            receiptItemsEl.innerHTML = "";
            let receiptSubtotal = 0;

            snapshot.forEach((item) => {
                const itemTotal = item.price * item.qty;
                receiptSubtotal += itemTotal;

                const row = document.createElement("div");
                row.classList.add("flex", "items-center", "justify-between", "py-1.5", "border-b", "border-slate-100");
                row.innerHTML = `
                    <span>${item.qty}x ${item.name}</span>
                    <span class="font-medium">₹ ${itemTotal.toFixed(2)}</span>
                `;
                receiptItemsEl.appendChild(row);
            });

            const receiptTax = receiptSubtotal * 0.05;
            const receiptTotal = receiptSubtotal + receiptTax;

            if (receiptSubtotalEl) receiptSubtotalEl.textContent = "₹ " + receiptSubtotal.toFixed(2);
            if (receiptTaxEl) receiptTaxEl.textContent = "₹ " + receiptTax.toFixed(2);
            if (receiptTotalEl) receiptTotalEl.textContent = "₹ " + receiptTotal.toFixed(2);

            receiptModal.classList.add("active");
        }

        function closeReceiptModal() {
            if (receiptModal) receiptModal.classList.remove("active");
        }

        if (receiptClose) receiptClose.addEventListener("click", closeReceiptModal);
        if (receiptModal) {
            receiptModal.addEventListener("click", (e) => {
                if (e.target === receiptModal) closeReceiptModal();
            });
        }

        if (receiptPrintBtn) {
            receiptPrintBtn.addEventListener("click", () => {
                window.print();
            });
        }

        if (receiptTrackBtn) {
            receiptTrackBtn.addEventListener("click", () => {
                closeReceiptModal();
                if (orderTrackingView) {
                    orderTrackingView.scrollIntoView({ behavior: "smooth" });
                }
            });
        }

        // Live Order Tracking Simulation
        function startOrderTracking(orderId, name, address) {
            if (cartView) cartView.classList.add("hidden");
            if (orderTrackingView) {
                orderTrackingView.classList.remove("hidden");
                orderTrackingView.scrollIntoView({ behavior: "smooth" });
            }

            if (orderIdDisplay) orderIdDisplay.textContent = orderId;
            if (trackingCustomerName) trackingCustomerName.textContent = name;
            if (trackingAddress) trackingAddress.textContent = address;

            function setTrackingStep(activeStepNum, widthPercent, msg, timeEst) {
                if (progressBar) progressBar.style.width = widthPercent;
                if (liveStatusMessage) liveStatusMessage.textContent = msg;
                if (deliveryTime) deliveryTime.textContent = timeEst;

                trackingSteps.forEach((stepEl) => {
                    const stepNum = parseInt(stepEl.getAttribute("data-step") || "1", 10);
                    stepEl.classList.remove("active", "completed");
                    const icon = stepEl.querySelector(".step-icon");

                    if (stepNum < activeStepNum) {
                        stepEl.classList.add("completed");
                        if (icon) icon.textContent = "✓";
                    } else if (stepNum === activeStepNum) {
                        stepEl.classList.add("active");
                    }
                });
            }

            if (trackingInterval) clearInterval(trackingInterval);

            // Step 1: Confirmed
            setTrackingStep(1, "12%", "Order confirmed & ticket received in stall kitchen!", "18-22 mins");

            // Step 2: Preparing in Oven (after 3.5s)
            setTimeout(() => {
                setTrackingStep(2, "40%", "Baking fresh in the oven right now... 🔥", "14-16 mins");
            }, 3500);

            // Step 3: Out for Delivery (after 7.5s)
            setTimeout(() => {
                setTrackingStep(3, "75%", "Runner has picked up your parcel and is en route! 🛵", "5-8 mins");
            }, 7500);

            // Step 4: Delivered (after 12s)
            setTimeout(() => {
                setTrackingStep(4, "100%", "Order delivered to your block! Enjoy your meal! 🎉", "Arrived");
            }, 12000);
        }

        // Start New Order Button
        if (newOrderBtn) {
            newOrderBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (orderTrackingView) orderTrackingView.classList.add("hidden");
                if (cartView) cartView.classList.remove("hidden");
                renderCart();
                window.location.href = "menu.html";
            });
        }

        // Initial cart render on order.html
        renderCart();
    }


    // --- Gallery Page Logic (runs on gallery.html) ---

    if (document.title.includes("Gallery") || document.getElementById("lightbox")) {
        const galleryItems = document.querySelectorAll(".gallery-item img");
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightboxImg");
        const lightboxClose = document.getElementById("lightboxClose");

        galleryItems.forEach((img) => {
            img.addEventListener("click", (e) => {
                e.preventDefault();
                if (!lightbox || !lightboxImg) return;
                lightboxImg.src = img.src;
                lightbox.classList.add("active");
            });
        });

        if (lightbox && lightboxClose) {
            lightboxClose.addEventListener("click", () => {
                lightbox.classList.remove("active");
            });
            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) lightbox.classList.remove("active");
            });
        }
    }


    // --- Contact Form Logic (runs on contact.html) ---

    if (document.title.includes("Contact") || document.getElementById("contactForm")) {
        const contactForm = document.getElementById("contactForm");
        const contactSuccess = document.getElementById("contactSuccess");

        function showError(id, message) {
            const err = document.querySelector(`[data-error-for="${id}"]`);
            const input = document.getElementById(id);
            if (!err || !input) return;
            err.textContent = message;
            err.classList.remove("hidden");
            input.classList.add("border-red-400");
        }

        function clearErrors() {
            document.querySelectorAll("[data-error-for]").forEach((el) => {
                el.textContent = "";
                el.classList.add("hidden");
            });
            ["contactName", "contactEmail", "contactMessage"].forEach((id) => {
                const input = document.getElementById(id);
                if (input) input.classList.remove("border-red-400");
            });
        }

        if (contactForm) {
            contactForm.addEventListener("submit", (e) => {
                e.preventDefault();
                clearErrors();
                if (contactSuccess) contactSuccess.classList.add("hidden");

                const name = document.getElementById("contactName").value.trim();
                const email = document.getElementById("contactEmail").value.trim();
                const msg = document.getElementById("contactMessage").value.trim();

                let valid = true;
                if (!name) {
                    showError("contactName", "Name is required.");
                    valid = false;
                }
                if (!email) {
                    showError("contactEmail", "Email is required.");
                    valid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {
                    showError("contactEmail", "Enter a valid email address.");
                    valid = false;
                }
                if (!msg) {
                    showError("contactMessage", "Message is required.");
                    valid = false;
                }

                if (valid) {
                    if (contactSuccess) contactSuccess.classList.remove("hidden");
                    contactForm.reset();
                }
            });
        }
    }
});