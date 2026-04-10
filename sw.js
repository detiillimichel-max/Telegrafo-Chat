const CACHE_NAME = 'oio-familia-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Nunito:wght@300;400;600;700&display=swap'
];

// Instalação — pré-cache dos assets essenciais
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(() => console.warn('Cache miss:', url)))
      );
    })
  );
});

// Ativação — limpa caches antigos e toma controle imediato
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all([
        ...keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)),
        self.clients.claim()
      ]);
    })
  );
});

// Estratégia: Network First com fallback para cache
// Firebase e Storage sempre vão para rede (nunca cacheados)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Deixa Firebase, Storage e APIs sempre ir para a rede
  if (
    url.includes('firebaseio.com') ||
    url.includes('firebasestorage') ||
    url.includes('googleapis.com/upload') ||
    url.includes('gstatic.com/firebasejs') ||
    event.request.method !== 'GET'
  ) {
    return; // comportamento padrão do browser
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clona e guarda no cache se for resposta válida
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sem rede: tenta o cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Fallback para o index quando offline
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
