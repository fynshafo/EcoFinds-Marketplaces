const API = "http://localhost:5000/api";

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = email.split("@")[0];

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
  alert("Registered successfully!");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  alert("Welcome " + data.username);
  loadProducts();
}

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `<h3>${p.title}</h3><p>₹${p.price}</p>`;
    container.appendChild(card);
  });
}
