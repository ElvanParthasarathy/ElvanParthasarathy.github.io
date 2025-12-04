const CACHE_NAME = 'elvanp-spa-cache-v1';
// IMPORTANT: List every file the browser needs to load the site and its content
const urlsToCache = [
  '/', 
  '/index.html',
  '/app.js',
  '/logo.png',
  '/logo2.png',

  // 1. CORE ASSETS (CSS, Quotes JS)
  '/assets/style.css',
  '/assets/mobile.css',
  '/assets/quotes.js',
  '/assets/quotes_data.js',

  // 2. ALL HTML CONTENT FRAGMENTS (from /pages folder)
  '/pages/about.html',
  '/pages/home.html',
  '/pages/portfolio.html',
  '/pages/settings.html',
  '/pages/writings.html',
  '/pages/writings/quotes.html',
  '/pages/writings/blog.html',
  '/pages/writings/articles.html',
  '/pages/writings/essays.html',
  '/pages/writings/stories.html',
  '/pages/writings/poems.html',
  '/pages/writings/thoughts.html',
  '/pages/writings/diary.html',
  
  // 3. ALL SVG ICONS referenced in index.html and app.js
  '/assets/icons/profile.svg',
  '/assets/icons/settings.svg',
  '/assets/icons/home.svg',
  '/assets/icons/writings.svg',
  '/assets/icons/portfolio.svg'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install Event: Caching Assets');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No match in cache - fetch from network
        return fetch(event.request);
      })
  );
});
