// The test app moved to /todo-test/. This removes the old one's offline copy.
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('sam-beta')===0;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.registration.unregister();}));});
