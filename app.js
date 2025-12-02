// SPA Hash Router

const contentArea = document.getElementById("content-area");

// Route-to-file map
const routes = {
    home: "pages/home.html",
    writings: "pages/writings.html",
    portfolio: "pages/portfolio.html",
    about: "pages/about.html",
    settings: "pages/settings.html",
};

// Load content
async function loadPage(route) {
    const page = routes[route] || routes["home"]; // default
    
    // 1. SIMPLE FETCH: No pre-animation classes.
    try {
        const res = await fetch(page);
        const html = await res.text();
        
        // 2. SWAP CONTENT INSTANTLY
        contentArea.innerHTML = html;
        
        // 3. SCROLL RESET
        window.scrollTo(0, 0);
        contentArea.scrollTop = 0;

        // 4. TRIGGER ANIMATION
        // We simply add a class to the *container* that triggers CSS @keyframes on children.
        // We remove it first to "reset" the animation if it was already there.
        contentArea.classList.remove("animate-entry");
        
        // Force reflow to restart animation
        void contentArea.offsetWidth; 
        
        contentArea.classList.add("animate-entry");

    } catch (e) {
        contentArea.innerHTML = "<p style='padding:20px;'>Error loading page…</p>";
    }
}


function updateActiveLink(route) {
    const allLinks = document.querySelectorAll(".nav-item, .profile-card, .settings-btn");
    allLinks.forEach(el => el.classList.remove("active"));

    const activeLinks = document.querySelectorAll(`a[href="#/${route}"]`);
    activeLinks.forEach(link => {
        link.classList.add("active");
    });
}

// Detect hash route
function router() {
    const hash = window.location.hash.replace("#/", "") || "home";
    loadPage(hash);
    updateActiveLink(hash);
}

// Handle normal navigation clicks
document.addEventListener("click", (e) => {
    const link = e.target.closest("a.spa-link");
    if (!link) return;

    e.preventDefault();
    const hash = link.getAttribute("href");
    
    if (window.location.hash !== hash) {
        window.location.hash = hash; 
    }
});

window.addEventListener("hashchange", router);
router();

function updateHeaderState() {
  if (window.innerWidth > 768) return;

  if (window.scrollY > 30)
    document.body.classList.add("header-collapsed");
  else
    document.body.classList.remove("header-collapsed");
}

addEventListener("scroll", updateHeaderState);
document.addEventListener("DOMContentLoaded", updateHeaderState);