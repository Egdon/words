const CACHE_NAME = 'vocabulary-app-v1.0';

// 需要缓存的文件列表
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './vocabulary.js',
  './styles.css',
  './manifest.json',
  './icons/icon-192x192.svg',
  './icons/icon-512x512.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
];

// 安装事件
self.addEventListener('install', event => {
  console.log('[SW] 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] 缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] 所有文件已缓存');
        self.skipWaiting();
      })
  );
});

// 获取事件
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到了，返回缓存的版本
        if (response) {
          return response;
        }

        // 否则，获取网络版本
        return fetch(event.request).then(response => {
          // 检查是否是有效的响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// 激活事件
self.addEventListener('activate', event => {
  console.log('[SW] 激活中...');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] 激活完成');
      return self.clients.claim();
    })
  );
});