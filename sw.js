const CACHE='radios-gestao-v32';
const ASSETS=['./','./index.html','./styles.css','./logo-fix.css','./features.css','./app-v2.js','./manifest.webmanifest','./jszip.min.js','./qrcode.js','./logo.png','./radio-portatil.png','./radio-base.png'];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('radios-siresp-')||key.startsWith('radios-gestao-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request)).then(response=>response||fetch(event.request)));
});
