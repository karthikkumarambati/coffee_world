
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================
     ELEMENTS
  ========================================= */

  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  const backTop = document.getElementById("backTop");
  const toast = document.getElementById("toast");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const year = document.getElementById("year");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let toastTimer;
  let scrollTicking = false;

  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  function closeMenu() {
    if (!nav || !toggle) return;

    nav.classList.remove("open");
    document.body.classList.remove("menu-open");

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");

    toggle.innerHTML =
      '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  function openMenu() {
    if (!nav || !toggle) return;

    nav.classList.add("open");
    document.body.classList.add("menu-open");

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");

    toggle.innerHTML =
      '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  /* =========================================
     TOAST NOTIFICATIONS
  ========================================= */

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* =========================================
     MENU AND PRODUCT INTERACTIONS
  ========================================= */

  document.querySelectorAll("[data-item]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemName = button.dataset.item;

      showToast(
        `${itemName} selected. Connect a shopping cart to place an order.`
      );

      button.classList.remove("clicked");

      // Restart the click animation.
      void button.offsetWidth;

      button.classList.add("clicked");

      setTimeout(() => {
        button.classList.remove("clicked");
      }, 350);
    });
  });

  /* =========================================
     SCROLL REVEAL ANIMATIONS
  ========================================= */

  const revealElements = document.querySelectorAll(
    ".reveal, .menu-card, .product-card, .review-card"
  );

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 90}ms`
      );

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =========================================
     ACTIVE NAVIGATION ON SCROLL
  ========================================= */

  const sectionLinks = [
    ...document.querySelectorAll(".nav-links a[href^='#']")
  ];

  const sections = [
    ...document.querySelectorAll("main section[id]")
  ];

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          sectionLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =========================================
     STICKY HEADER AND BACK TO TOP
  ========================================= */

  function updateScrollUI() {
    const scrollPosition = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", scrollPosition > 20);
    }

    if (backTop) {
      backTop.classList.toggle("show", scrollPosition > 450);
    }

    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollUI);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  // Set the correct state when the page initially loads.
  updateScrollUI();

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth"
      });
    });
  }

  /* =========================================
     CURRENT YEAR
  ========================================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================================
     CONTACT FORM VALIDATION
  ========================================= */

  if (contactForm) {
    const nameInput = contactForm.querySelector(
      '[name="name"]'
    );

    const emailInput = contactForm.querySelector(
      '[name="email"]'
    );

    const messageInput = contactForm.querySelector(
      '[name="message"]'
    );

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const message = messageInput?.value.trim() || "";

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.style.display = "block";
          formStatus.textContent =
            "Please complete all required fields.";
        }

        return;
      }

      // Client-side validation only.
      // No email is sent until a backend or email service
      // is connected.

      if (formStatus) {
        formStatus.style.display = "block";
        formStatus.classList.remove("success");

        formStatus.textContent =
          "Your details are valid, but your message has not been sent. Connect an email service to enable delivery.";
      }

      showToast("Validation complete. Email delivery is not configured.");

      // Preserve entered data so the visitor does not lose it.
    });
  }

  /* =========================================
     IMAGE LOADING EFFECTS
  ========================================= */

  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("image-loaded");
      return;
    }

    img.addEventListener(
      "load",
      () => {
        img.classList.add("image-loaded");
      },
      { once: true }
    );
  });

  /* =========================================
     SMOOTH ANCHOR NAVIGATION
  ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      // Keep the URL synchronized with the destination.
      if (window.location.hash !== targetId) {
        history.replaceState(null, "", targetId);
      }
    });
  });

});
