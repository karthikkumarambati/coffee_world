(() => {
  "use strict";
  const header = document.getElementById("siteHeader");
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("navLinks");
  const searchBtn = document.getElementById("search-btn");
  const searchPanel = document.getElementById("searchPanel");
  const searchInput = document.getElementById("siteSearch");
  const cartBtn = document.getElementById("cart-btn");
  const cartDialog = document.getElementById("cartDialog");
  const closeCart = document.getElementById("closeCart");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const toast = document.getElementById("toast");
  const cart = new Map();
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function closeMenu() {
    nav.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("active");
    document.body.classList.toggle("menu-open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 12), { passive: true });

  searchBtn.addEventListener("click", () => {
    const opened = searchPanel.classList.toggle("open");
    if (opened) searchInput.focus();
  });
  searchPanel.addEventListener("submit", event => {
    event.preventDefault();
    const term = searchInput.value.trim().toLowerCase();
    if (!term) return;
    const match = [...document.querySelectorAll(".menu-card, .product-card")].find(card => card.textContent.toLowerCase().includes(term));
    if (match) {
      match.scrollIntoView({ behavior: "smooth", block: "center" });
      match.classList.add("search-highlight");
      setTimeout(() => match.classList.remove("search-highlight"), 1500);
      searchPanel.classList.remove("open");
    } else showToast("No matches found. Try “latte” or “beans”.");
  });
  document.addEventListener("click", event => {
    if (!searchPanel.contains(event.target) && !searchBtn.contains(event.target)) searchPanel.classList.remove("open");
  });

  function addItem(name, price) {
    const item = cart.get(name) || { name, price: Number(price), qty: 0 };
    item.qty += 1;
    cart.set(name, item);
    renderCart();
    showToast(`${name} added to your bag`);
  }
  function updateQty(name, delta) {
    const item = cart.get(name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart.delete(name);
    renderCart();
  }
  function renderCart() {
    const items = [...cart.values()];
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartCountEl.textContent = count;
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
    if (!items.length) {
      cartItemsEl.innerHTML = '<p class="empty-cart">Your bag is waiting for something lovely.</p>';
      return;
    }
    cartItemsEl.innerHTML = items.map(item => `
      <div class="cart-item">
        <div><h3>${escapeHtml(item.name)}</h3><p>$${item.price.toFixed(2)} each</p></div>
        <div class="cart-item-right"><div>$${(item.price * item.qty).toFixed(2)}</div>
          <div class="quantity-controls">
            <button type="button" data-qty="-1" data-name="${escapeHtml(item.name)}" aria-label="Remove one ${escapeHtml(item.name)}">−</button>
            <span>${item.qty}</span>
            <button type="button" data-qty="1" data-name="${escapeHtml(item.name)}" aria-label="Add one ${escapeHtml(item.name)}">+</button>
          </div>
        </div>
      </div>`).join("");
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => addItem(button.dataset.name, button.dataset.price));
  });
  cartItemsEl.addEventListener("click", event => {
    const button = event.target.closest("button[data-qty]");
    if (button) updateQty(button.dataset.name, Number(button.dataset.qty));
  });
  cartBtn.addEventListener("click", () => {
    if (typeof cartDialog.showModal === "function") cartDialog.showModal();
    else showToast("Your bag has " + cartCountEl.textContent + " item(s).");
  });
  closeCart.addEventListener("click", () => cartDialog.close());
  cartDialog.addEventListener("click", event => {
    if (event.target === cartDialog) cartDialog.close();
  });
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    showToast(cart.size ? "Demo only — checkout is not connected yet." : "Add something to your bag first.");
  });

  const newsletterForm = document.getElementById("newsletterForm");
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("newsletterEmail");
    const message = document.getElementById("newsletterMessage");
    if (!email.checkValidity()) { email.reportValidity(); return; }
    message.textContent = "Thanks for your interest! Newsletter signup needs an email service connection.";
    message.style.color = "#8a633f";
    newsletterForm.reset();
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealEls.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
      observer.observe(element);
    });
  } else revealEls.forEach(element => element.classList.add("is-visible"));

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
