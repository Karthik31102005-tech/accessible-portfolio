const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 1499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=75"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 2299,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=75"
    },
    {
        id: 3,
        name: "Casual Sneakers",
        category: "fashion",
        price: 1899,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=75"
    },
    {
        id: 4,
        name: "Backpack",
        category: "fashion",
        price: 999,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=75"
    },
    {
        id: 5,
        name: "Table Lamp",
        category: "home",
        price: 799,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=75"
    },
    {
        id: 6,
        name: "Coffee Mug",
        category: "home",
        price: 299,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=75"
    }
];

const grid = document.getElementById("product-grid");
const search = document.getElementById("search");
const category = document.getElementById("category");
const status = document.getElementById("product-status");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

let cart = JSON.parse(localStorage.getItem("shop-cart") || "[]");

function saveCart() {
    localStorage.setItem("shop-cart", JSON.stringify(cart));
}

function renderProducts() {
    const query = search.value.toLowerCase().trim();
    const selectedCategory = category.value;

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) &&
        (selectedCategory === "all" ||
            product.category === selectedCategory)
    );

    grid.replaceChildren();

    filtered.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        image.width = 500;
        image.height = 350;

        const title = document.createElement("h3");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = `₹${product.price}`;

        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.type = "button";
        button.dataset.id = product.id;

        card.append(image, title, price, button);
        grid.appendChild(card);
    });

    status.textContent = filtered.length
        ? `${filtered.length} product(s) found.`
        : "No products found. Try another search.";
}

function renderCart() {
    cartItems.replaceChildren();

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        total += product.price * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        const text = document.createElement("span");
        text.textContent =
            `${product.name} — ₹${product.price} × ${item.quantity} `;

        const decrease = document.createElement("button");
        decrease.textContent = "−";
        decrease.type = "button";
        decrease.dataset.action = "decrease";
        decrease.dataset.id = item.id;
        decrease.setAttribute("aria-label", `Decrease ${product.name} quantity`);

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.type = "button";
        increase.dataset.action = "increase";
        increase.dataset.id = item.id;
        increase.setAttribute("aria-label", `Increase ${product.name} quantity`);

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.type = "button";
        remove.dataset.action = "remove";
        remove.dataset.id = item.id;

        li.append(text, decrease, increase, remove);
        cartItems.appendChild(li);
    });

    cartCount.textContent = count;
    cartTotal.textContent = `Total: ₹${total}`;
}

grid.addEventListener("click", event => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    saveCart();
    renderCart();
});

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const item = cart.find(entry => entry.id === id);
    if (!item) return;

    if (button.dataset.action === "increase") item.quantity++;
    if (button.dataset.action === "decrease") item.quantity--;
    if (button.dataset.action === "remove") item.quantity = 0;

    cart = cart.filter(entry => entry.quantity > 0);

    saveCart();
    renderCart();
});

search.addEventListener("input", renderProducts);
category.addEventListener("change", renderProducts);

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
});

renderProducts();
renderCart();