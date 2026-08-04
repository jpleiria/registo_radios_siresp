const CACHE='radios-siresp-v22'; const ASSETS=['./','./index.html','./styles.css','./logo-fix.css','./features.css','./app-v2.js','./manifest.webmanifest','./jszip.min.js','./qrcode.js','./logo.png','./radio-portatil.png','./radio-base.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('radios-siresp-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.open(CACHE).then(cache=>cache.match(e.request)).then(r=>r||fetch(e.request))));
