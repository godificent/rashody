/* Расходы: the whole app lives in the phone's cache, so it opens with no internet.
   V changes with every release; the phone picks up a new version on the next launch with internet. */
const V='rashody-1.0';
const FILES=['./','index.html','manifest.webmanifest','icon.png','pdf.min.js','pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('rashody-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const hit=await caches.match(r,{ignoreSearch:true});if(hit)return hit;
    if(r.mode==='navigate'){const home=(await caches.match('./'))||(await caches.match('index.html'));if(home)return home;}
    return fetch(r);
  })());
});
