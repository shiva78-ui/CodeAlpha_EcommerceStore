const API_URL = "https://codealpha-ecommercestore-25bt.onrender.com/api";


// Load products when the page opens
async function loadProducts() {
    const productsContainer =
        document.getElementById("products-container");
    if (!productsContainer) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load products");
        }

        displayProducts(data.products);

    } catch (error) {
        console.error("Error loading products:", error);

        productsContainer.innerHTML = `
            <p>Unable to load products.</p>
        `;
    }
}


// Display products on the page
function displayProducts(products) {
    const productsContainer =
        document.getElementById("products-container");

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <p>No products available.</p>
        `;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">

            <img
                src="${product.image || 'https://via.placeholder.com/300'}"
                alt="${product.name}"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <p class="product-price">
                    ₹${product.price}
                </p>

                <p class="product-stock">
                    Stock: ${product.stock}
                </p>

                <button
                    class="add-cart-btn"
                    onclick="addToCart('${product._id}')"
                >
                    Add to Cart
                </button>

            </div>

        </div>
    `).join("");
}


// Add product to cart
async function addToCart(productId) {

    const token = localStorage.getItem("token");

    if (!token) {
        showNotification("Please login first.", "error");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/cart`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add product");
        }

        showNotification(
            "Product added to cart!",
            "success"
        );
        updateCartCount();

    } catch (error) {

        console.error(
            "Add to cart error:",
            error
        );

        showNotification(
            error.message,
            "error"
        );
    }
} function showNotification(message, type) {

    const notification =
        document.createElement("div");

    notification.className =
        `notification ${type}`;

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.classList.add("show");

    }, 10);

    setTimeout(() => {

        notification.classList.remove("show");

        setTimeout(() => {
            notification.remove();
        }, 300);

    }, 2500);
}



// Scroll to products
function scrollToProducts() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


// Load products when page loads
loadProducts();
// Registration

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const message =
            document.getElementById("register-message");

        try {

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            message.textContent =
                "Registration successful! Redirecting to login...";

            message.style.color = "green";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {

            console.error("Registration error:", error);

            message.textContent = error.message;

            message.style.color = "red";
        }

    });

}
// Login

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("login-email").value;

        const password =
            document.getElementById("login-password").value;

        const message =
            document.getElementById("login-message");

        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Save JWT token in browser
            localStorage.setItem("token", data.token);

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.textContent =
                "Login successful! Redirecting...";

            message.style.color = "green";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {

            console.error("Login error:", error);

            message.textContent = error.message;

            message.style.color = "red";
        }

    });

}
// Update navbar based on login status

function updateNavbar() {

    const userSection =
        document.getElementById("user-section");

    if (!userSection) {
        return;
    }

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {

        const user = JSON.parse(userData);

        userSection.innerHTML = `
            <span class="welcome-user">
                Hi, ${user.name}
            </span>

            <a href="#" onclick="logout()">
                Logout
            </a>
        `;

    } else {

        userSection.innerHTML = `
            <a href="login.html">
                Login
            </a>
        `;
    }
}


// Logout

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";
}


// Update navbar when page loads

updateNavbar();
// ==============================
// Cart
// ==============================

async function loadCart() {

    const cartContainer =
        document.getElementById("cart-container");

    if (!cartContainer) {
        return;
    }

    const token = localStorage.getItem("token");

    // User must be logged in
    if (!token) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Please login to view your cart.</h3>

                <br>

                <a href="login.html">
                    Login
                </a>
            </div>
        `;

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/cart`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load cart"
            );
        }

        displayCart(data.cart);
        updateCartCount();

    } catch (error) {

        console.error("Cart error:", error);

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Unable to load cart.</p>
            </div>
        `;
    }
}


// Display cart

function displayCart(cart) {

    const cartContainer =
        document.getElementById("cart-container");

    if (!cart || !cart.items || cart.items.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h3>Your cart is empty 🛒</h3>

                <br>

                <a href="index.html#products">
                    Continue Shopping
                </a>

            </div>
        `;

        return;
    }


    let total = 0;


    const itemsHTML = cart.items.map(item => {

        const product = item.product;

        const itemTotal =
            product.price * item.quantity;

        total += itemTotal;


        return `
    <div class="cart-item">

        <img
            src="${product.image || 'https://via.placeholder.com/100'}"
            alt="${product.name}"
            class="cart-item-image"
        >

        <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Price: ₹${product.price}
                    </p>

                    <p>
                        Item Total: ₹${itemTotal}
                    </p>

                </div>


                <div class="cart-quantity">

                    <button
                        onclick="changeQuantity(
                            '${product._id}',
                            ${item.quantity - 1}
                        )"
                        ${item.quantity <= 1 ? "disabled" : ""}
                    >
                        −
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="changeQuantity(
                            '${product._id}',
                            ${item.quantity + 1}
                        )"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-cart-btn"
                    onclick="removeFromCart(
                        '${product._id}'
                    )"
                >
                    Remove
                </button>

            </div>
        `;

    }).join("");


    cartContainer.innerHTML = `

        <div class="cart-container">

            ${itemsHTML}

        </div>


        <div class="cart-summary">

            <div class="cart-total">
                Total: ₹${total}
            </div>

            <button
                class="checkout-btn"
                onclick="checkout()"
            >
                Checkout
            </button>

        </div>
    `;
}


// Change quantity

async function changeQuantity(productId, quantity) {

    if (quantity < 1) {
        return;
    }

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/cart`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    productId,
                    quantity
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to update cart"
            );
        }


        displayCart(data.cart);

    } catch (error) {

        alert(error.message);

    }
}


// Remove product from cart

async function removeFromCart(productId) {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/cart/${productId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to remove product"
            );
        }


        displayCart(data.cart);
        updateCartCount();

    } catch (error) {

        alert(error.message);

    }
}


// Checkout


async function checkout() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `${API_URL}/orders`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Checkout failed"
            );
        }

        // Save the completed order for the confirmation page.
        sessionStorage.setItem(
            "lastOrder",
            JSON.stringify(data.order)
        );

        // Open the order confirmation page.
        window.location.href = "order-success.html";

    } catch (error) {
        console.error("Checkout error:", error);
        alert(error.message);
    }
}



// Load cart when cart page opens

loadCart();
// ==============================
// Order History
// ==============================


async function loadOrders() {
    const ordersContainer =
        document.getElementById("orders-container");

    // Stop if this page doesn't contain the orders section.
    if (!ordersContainer) {
        return;
    }

    const token = localStorage.getItem("token");

    // Ask the user to log in if no token exists.
    if (!token) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <h3>Please login to view your orders.</h3>
                <br>
                <a href="login.html">Login</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load orders"
            );
        }

        displayOrders(data.orders);
    } catch (error) {
        console.error("Orders error:", error);

        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <p>Unable to load orders.</p>
                <p>Please try refreshing the page.</p>
            </div>
        `;
    }
}


// Display orders

function displayOrders(orders) {

    const ordersContainer =
        document.getElementById("orders-container");


    if (!orders || orders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="empty-orders">

                <h3>
                    You haven't placed any orders yet.
                </h3>

                <br>

                <a href="index.html#products">
                    Start Shopping
                </a>

            </div>
        `;

        return;
    }


    const ordersHTML = orders.map(order => {

        const orderDate =
            new Date(order.createdAt)
                .toLocaleDateString("en-IN");


        const itemsHTML =
            order.items.map(item => {

                const itemTotal =
                    item.price * item.quantity;

                return `
                    <div class="order-item">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₹${item.price}
                            ×
                            ${item.quantity}
                        </p>

                        <p>
                            Item Total:
                            ₹${itemTotal}
                        </p>

                    </div>
                `;

            }).join("");


        return `
            <div class="order-card">

                <div class="order-header">

                    <div>

                        <div class="order-id">
                            Order ID:
                            ${order._id}
                        </div>

                        <div class="order-date">
                            Ordered on:
                            ${orderDate}
                        </div>

                    </div>


                    <span class="order-status">
                        ${order.status}
                    </span>

                </div>


                <div>

                    ${itemsHTML}

                </div>


                <div class="order-total">

                    Total:
                    ₹${order.totalAmount}

                </div>
                ${order.status === "Pending" ? `
    <button
        class="cancel-order-btn"
        onclick="cancelOrder('${order._id}')"
    >
        Cancel Order
    </button>
` : ""}

            </div>
        `;

    }).join("");


    ordersContainer.innerHTML = `
        <div class="orders-container">

            ${ordersHTML}

        </div>
    `;
}


// Load orders when the page opens

loadOrders();
// ==============================
// Cart Counter
// ==============================

async function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const token =
        localStorage.getItem("token");

    // User is not logged in
    if (!token) {
        cartCount.textContent = "";
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/cart`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            cartCount.textContent = "";
            return;
        }

        const items = data.cart?.items || [];

        // Calculate total quantity
        const totalQuantity = items.reduce(
            (total, item) => total + item.quantity,
            0
        );

        if (totalQuantity > 0) {

            cartCount.textContent =
                `(${totalQuantity})`;

        } else {

            cartCount.textContent = "";
        }

    } catch (error) {

        console.error(
            "Cart count error:",
            error
        );

        cartCount.textContent = "";
    }
}

updateCartCount();

function loadOrderSuccess() {
    const itemsContainer =
        document.getElementById("success-items");

    // Run only on the order confirmation page.
    if (!itemsContainer) {
        return;
    }

    const savedOrder = sessionStorage.getItem("lastOrder");

    if (!savedOrder) {
        itemsContainer.innerHTML = `
            <p>Order details could not be found.</p>
            <p>Please visit your Orders page to check your order.</p>
        `;
        return;
    }

    let order;

    try {
        order = JSON.parse(savedOrder);
    } catch (error) {
        console.error("Unable to read saved order:", error);
        itemsContainer.innerHTML =
            "<p>Unable to read order details.</p>";
        return;
    }

    // Validate the order data.
    if (!order || !Array.isArray(order.items)) {
        itemsContainer.innerHTML =
            "<p>Order information is invalid.</p>";
        return;
    }

    // Display the order ID.
    const orderIdElement =
        document.getElementById("success-order-id");

    if (orderIdElement) {
        orderIdElement.textContent =
            `Order ID: ${order._id}`;
    }

    // Display the total amount.
    const totalElement =
        document.getElementById("success-total");

    if (totalElement) {
        totalElement.textContent =
            `₹${order.totalAmount}`;
    }

    // Display the order status.
    const statusElement =
        document.querySelector(".success-status strong");

    if (statusElement && order.status) {
        statusElement.textContent = order.status;
    }

    if (order.items.length === 0) {
        itemsContainer.innerHTML =
            "<p>No products were found in this order.</p>";
        return;
    }

    // Display each purchased product.
    itemsContainer.innerHTML = order.items.map(item => {
        const image = item.image ||
            "https://via.placeholder.com/100?text=Product";

        const itemTotal = item.price * item.quantity;

        return `
            <div class="success-item">
                <img
                    src="${image}"
                    alt="${item.name}"
                    onerror="this.onerror=null;this.src='https://via.placeholder.com/100?text=Product';"
                >

                <div class="success-item-info">
                    <h3>${item.name}</h3>
                    <p>Price: ₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>

                <div class="success-item-price">
                    ₹${itemTotal}
                </div>
            </div>
        `;
    }).join("");
}

// Load order details when the confirmation page opens.
loadOrderSuccess();

async function cancelOrder(orderId) {
    const confirmed = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please log in to cancel your order.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/orders/${orderId}/cancel`,
            {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to cancel order."
            );
        }

        alert("Order cancelled successfully!");

        // Reload the order history to show the updated status.
        await loadOrders();
    } catch (error) {
        console.error("Cancel order error:", error);
        alert(error.message);
    }
}
