/**
 * Service Worker para Telegrafo Chat
 * Estratégia: stale-while-revalidate
 * - Serve cache primeiro (rápido)
 * - Atualiza cache em background
 * - Suporta offline
 */

const CACHE_VERSION = 'telegrafo-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Estratégia: Network First para API, Cache First para assets
const NETWORK_FIRST_PATHS = ['/api/', '/trpc/'];
const CACHE_FIRST_PATHS = ['.js', '.css', '.woff2', '.svg', '.png', '.jpg'];

/**
 * Instalar Service Worker
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(CACHE_URLS).catch(() => {
        console.log('[SW] Alguns assets não puderam ser cacheados durante install');
      });
    })
  );
  self.skipWaiting();
});

/**
 * Ativar Service Worker e limpar caches antigos
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch: Implementar estratégias de cache
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  // Network First para API
  if (NETWORK_FIRST_PATHS.some((path) => url.pathname.includes(path))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache First para assets
  if (CACHE_FIRST_PATHS.some((ext) => url.pathname.includes(ext))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale While Revalidate para HTML e outros
  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Network First: Tenta rede primeiro, fallback para cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Cache First: Tenta cache primeiro, fallback para rede
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline - Recurso não disponível', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Stale While Revalidate: Serve cache imediatamente, atualiza em background
 */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(CACHE_VERSION);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  });

  return cached || fetchPromise;
}

/**
 * Message Handler: Comunicação com cliente
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    });
  }
});

/**
 * Background Sync: Sincronizar dados quando voltar online
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  try {
    // Implementar sincronização de mensagens pendentes
    console.log('[SW] Sincronizando mensagens pendentes...');
  } catch (error) {
    console.error('[SW] Erro ao sincronizar:', error);
  }
}

/**
 * Push Notifications
 */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nova mensagem',
    icon: '/manifest.json',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect fill="%230066ff" width="96" height="96"/></svg>',
    tag: 'telegrafo-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Telegrafo', options)
  );
});

/**
 * Notification Click
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
