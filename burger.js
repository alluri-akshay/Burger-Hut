document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const nav = document.querySelector("nav ul");
    const contactBtn = document.querySelector("nav ul li:last-child");

    // Create Cart Button
    const cartBtn = document.createElement("li");
    cartBtn.className = "cart-btn";
    cartBtn.innerHTML = "🛒 <span id='cart-count'>0</span>";
    contactBtn.insertAdjacentElement("beforebegin", cartBtn);

    // Create Cart Container
    const cartContainer = document.createElement("div");
    cartContainer.className = "cart-container hidden";
    cartContainer.innerHTML = `
        <h3>Your Cart</h3>
        <ul id="cart-items"></ul>
        <p>Total: $<span id="cart-total">0.00</span></p>
        <div class="cart-actions">
            <button id="clear-cart" class="cart-btn-action">Clear Cart</button>
            <button id="checkout-btn" class="cart-btn-action">Proceed to Checkout</button>
        </div>
        <div id="checkout-section" class="hidden">
            <h4>Shipping Details</h4>
            <input type="text" id="customer-name" placeholder="Full Name" required>
            <input type="text" id="customer-address" placeholder="Shipping Address" required>
            <h4>Order Summary</h4>
            <div id="order-summary"></div>
            <h4>Payment Details</h4>
            <input type="text" id="card-name" placeholder="Cardholder Name" required>
            <input type="text" id="card-number" placeholder="Card Number" required>
            <input type="text" id="card-expiry" placeholder="MM/YY" required>
            <input type="text" id="card-cvv" placeholder="CVV" required>
            <button id="pay-now" class="pay-btn">Pay Now</button>
        </div>
    `;
    document.body.appendChild(cartContainer);

    // Add Items to Cart from Menu
    document.querySelectorAll(".menu-item").forEach((item, index) => {
        const btn = document.createElement("button");
        btn.className = "add-to-cart";
        btn.innerText = "Add to Cart";
        item.appendChild(btn);

        btn.addEventListener("click", () => {
            const itemName = item.querySelector("h3").innerText;
            const itemPrice = (Math.random() * 10 + 5).toFixed(2);
            const itemImg = item.querySelector("img").src;
            addToCart({ name: itemName, price: parseFloat(itemPrice), img: itemImg, id: index });
        });
    });

    function addToCart(item) {
        let existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
    }

    function updateCart() {
        const cartList = document.getElementById("cart-items");
        const cartCount = document.getElementById("cart-count");
        const cartTotal = document.getElementById("cart-total");
        cartList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${item.img}" width="50" height="50" alt="${item.name}">
                <div class="cart-item-details">
                    <p>${item.name} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" data-id="${index}" data-action="increase">+</button>
                        <button class="quantity-btn" data-id="${index}" data-action="decrease">-</button>
                        <button class="remove-btn" data-id="${index}">Remove</button>
                    </div>
                </div>
            `;
            cartList.appendChild(li);
        });

        cartTotal.innerText = total.toFixed(2);
        cartCount.innerText = cart.length;
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Open Cart and Show Checkout When Clicking Cart Button
    cartBtn.addEventListener("click", () => {
        cartContainer.classList.remove("hidden");
        document.getElementById("checkout-section").classList.remove("hidden");
        updateOrderSummary();
    });

    // Handle Item Quantity Change & Removal
    cartContainer.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("remove-btn")) {
            cart.splice(id, 1);
            updateCart();
        } else if (e.target.classList.contains("quantity-btn")) {
            if (e.target.dataset.action === "increase") {
                cart[id].quantity++;
            } else if (e.target.dataset.action === "decrease" && cart[id].quantity > 1) {
                cart[id].quantity--;
            }
            updateCart();
        }
    });

    // Proceed to Checkout
    document.getElementById("checkout-btn").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        document.getElementById("checkout-section").classList.remove("hidden");
        updateOrderSummary();
    });

    // Update Order Summary
    function updateOrderSummary() {
        let summary = "";
        cart.forEach(item => {
            summary += `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}<br>`;
        });
        document.getElementById("order-summary").innerHTML = summary;
    }

    // Payment Processing
    document.getElementById("pay-now").addEventListener("click", () => {
        const name = document.getElementById("customer-name").value;
        const address = document.getElementById("customer-address").value;
        const cardName = document.getElementById("card-name").value;
        const cardNumber = document.getElementById("card-number").value;
        const cardExpiry = document.getElementById("card-expiry").value;
        const cardCvv = document.getElementById("card-cvv").value;

        if (!name || !address || !cardName || !cardNumber || !cardExpiry || !cardCvv) {
            alert("Please fill in all details to proceed.");
            return;
        }

        alert("Payment successful! Your order has been placed.");
        cart = [];
        updateCart();
        document.getElementById("checkout-section").classList.add("hidden");
    });

    // Clear Cart
    document.getElementById("clear-cart").addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the cart?")) {
            cart = [];
            updateCart();
        }
    });

    updateCart();
});
