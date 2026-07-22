const CACHE_NAME = 'pq-v1';
const ASSETS = [
  '/game/',
  '/game/index.html',
  '/game/style.css',
  '/game/game.js',
  '/game/manifest.json',
  '/game/data/questions.json',
  '/game/data/levels.json',
  '/game/data/creatures.json',
  '/game/data/gadgets.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      if (resp.ok && e.request.method === 'GET') {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return resp;
    }).catch(() => caches.match('/game/index.html')))
  );
});
