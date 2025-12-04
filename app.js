// SPA Hash Router

const contentArea = document.getElementById("content-area");

// Route-to-file map
const routes = {
    // Top Level Pages
    home: "pages/home.html",
    writings: "pages/writings.html",
    portfolio: "pages/portfolio.html",
    about: "pages/about.html",
    settings: "pages/settings.html",

    // Writings Sub-pages
    "writings/quotes": "pages/writings/quotes.html",
    "writings/blog": "pages/writings/blog.html",
    "writings/articles": "pages/writings/articles.html",
    "writings/essays": "pages/writings/essays.html",
    "writings/stories": "pages/writings/stories.html",
    "writings/poems": "pages/writings/poems.html",
    "writings/thoughts": "pages/writings/thoughts.html",
    "writings/diary": "pages/writings/diary.html"
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
        
        // --- SPECIAL HANDLER: QUOTES ---
        // Since <script> tags inside fetched HTML don't run, we trigger it manually here.
        // We check if the route is "writings/quotes" AND if our global function exists.
        if (route === "writings/quotes" && window.startQuotesPage) {
            window.startQuotesPage();
        }
        // -------------------------------
        
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
        console.error(e);
        contentArea.innerHTML = "<div style='padding:40px; text-align:center;'><h2>404</h2><p>Page not found or file missing.</p></div>";
    }
}


function updateActiveLink(route) {
    const allLinks = document.querySelectorAll(".nav-item, .profile-card, .settings-btn");
    allLinks.forEach(el => el.classList.remove("active"));

    // 1. Try to find an Exact Match (e.g. "#/home")
    let activeLinks = document.querySelectorAll(`a[href="#/${route}"]`);

    // 2. If no exact match, check if it's a Sub-Page (e.g. "writings/quotes")
    // This keeps the "Writings" sidebar button active when reading a quote.
    if (activeLinks.length === 0 && route.includes("/")) {
        const parentRoute = route.split("/")[0]; // extract "writings" from "writings/quotes"
        activeLinks = document.querySelectorAll(`a[href="#/${parentRoute}"]`);
    }

    activeLinks.forEach(link => {
        link.classList.add("active");
    });
}

// Detect hash route
function router() {
    // Remove the #/ and default to home if empty
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



// Keep all your existing app.js code above this block
// ... (The router logic you already have)

// PWA SERVICE WORKER REGISTRATION (Add this final piece)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('PWA Service Worker registered successfully.');
      })
      .catch(registrationError => {
        console.error('PWA Service Worker registration failed:', registrationError);
      });
  });
}
