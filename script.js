// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Dark mode (remembered between visits)
const themeToggle = document.querySelector(".theme-toggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.innerHTML = theme === "dark" ? "&#9728;" : "&#9790;";
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (e) {
  // Storage may be unavailable (e.g. private browsing)
}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    // Ignore storage errors
  }
});

// Contact form validation
const form = document.querySelector(".contact-form");
const status = document.querySelector(".form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  status.className = "form-status";

  if (!name || !email || !message) {
    status.textContent = "Please fill out all fields.";
    status.classList.add("error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = "Please enter a valid email address.";
    status.classList.add("error");
    return;
  }

  // No backend is connected yet; this only simulates sending.
  status.textContent = `Thanks, ${name}! Your message has been received.`;
  status.classList.add("success");
  form.reset();
});
