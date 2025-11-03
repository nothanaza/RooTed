// ========== NAVIGATION ==========
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn?.addEventListener("click", () => navLinks.classList.toggle("active"));

// === Sticky Navbar on Scroll ===
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

// dynamic padding — place in your HTML before </body>

  function syncBodyPadding() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    document.body.style.paddingTop = nav.offsetHeight + 'px';
  }
  window.addEventListener('load', syncBodyPadding);
  window.addEventListener('resize', syncBodyPadding);

// ========== LOGIN SYSTEM ==========
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function setUserSession(email) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", email);
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  alert("You have been logged out.");
  window.location.href = "index.html";
}

const loginLink = document.getElementById("loginLink");
const logoutLink = document.getElementById("logoutLink");

function refreshNavbar() {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (loginLink && logoutLink) {
    loginLink.style.display = loggedIn ? "none" : "inline";
    logoutLink.style.display = loggedIn ? "inline" : "none";
  }
}
logoutLink?.addEventListener("click", logout);
refreshNavbar();

// ========== SIGN UP ==========
document.getElementById("signupBtn")?.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) return alert("Please fill all fields.");

  const users = getUsers();
  if (users.some(u => u.email === email)) return alert("Email already registered.");

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully! Please sign in.");
  window.location.href = "signin.html";
});

// ========== SIGN IN ==========
document.getElementById("signinBtn")?.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return alert("Invalid email or password.");

  setUserSession(email);

  const params = new URLSearchParams(window.location.search);
  const returnUrl = params.get("return");
  if (returnUrl) {
    window.location.href = decodeURIComponent(returnUrl);
  } else {
    window.location.href = "index.html";
  }
});

// ========== DONATION SYSTEM ==========
let raised = parseFloat(localStorage.setItem('raised','0'));
if (isNaN(raised) || raised < 0) raised = 0;

const goal = 50000;
const input = document.getElementById("donationInput");
const donateBtn = document.getElementById("donateBtn");
const raisedAmount = document.getElementById("raisedAmount");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

function updateProgress() {
  if (!progressFill || !progressText || !raisedAmount) return;
  const percent = Math.max(0, Math.min(100, (raised / goal) * 100));
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${percent.toFixed(1)}% funded`;
  raisedAmount.textContent = `R${raised.toLocaleString()}`;
  localStorage.setItem("raised", raised);
}

document.querySelectorAll(".preset").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".preset").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    input.value = btn.dataset.amount;
  });
});

donateBtn?.addEventListener("click", () => {
  const amount = parseFloat(input.value);
  if (!amount || amount <= 0) return alert("Please enter a valid donation amount.");

  if (localStorage.getItem("isLoggedIn") !== "true") {
    localStorage.setItem("pendingDonation", amount);
    window.location.href = "signin.html?return=donate.html";
  } else {
    processDonation(amount);
  }
});

function processDonation(amount) {
  raised += amount;
  updateProgress();
  localStorage.removeItem("pendingDonation");
  alert("🎉 Thank you for your donation!");
  input.value = "";
}

window.addEventListener("load", () => {
  updateProgress();
  const pending = localStorage.getItem("pendingDonation");
  if (pending && localStorage.getItem("isLoggedIn") === "true") {
    processDonation(parseFloat(pending));
  }
});
