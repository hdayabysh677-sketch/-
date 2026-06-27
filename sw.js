// 1. عند تعديل الموقع مستقبلاً، غيّر الرقم هنا فقط ليتنبه المتصفح للتحديث
const CACHE_NAME = 'hadih-beesh-v15'; 

const assets = [
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'log.jpg',
  'spl.jpg'
];

// حدث التثبيت: حفظ الملفات الأساسية في الكاش
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    }).then(() => self.skipWaiting()) // إجبار الـ Service Worker الجديد على التنشيط فوراً
  );
});

// حدث التفعيل: تنظيف وحذف أي كاش قديم تلقائياً
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          // إذا كان اسم الكاش القديم لا يطابق الاسم الجديد، قم بحذفه
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // جعل الـ Service Worker يتحكم بالصفحة فوراً
  );
});

// حدث جلب البيانات: عرض الملفات من الكاش لجعل التطبيق سريعاً
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
