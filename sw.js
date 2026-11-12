// Tapping a notification opens the app right on the thing it is about (registered before Firebase so it runs first).
self.addEventListener('notificationclick',function(e){
  var d=e.notification.data||{},f=d.FCM_MSG||{},go=d.go||(f.data&&f.data.go)||'',gt=d.gt||(f.data&&f.data.gt)||'';
  if(!go){try{go=new URL((f.fcmOptions&&f.fcmOptions.link)||(f.notification&&f.notification.click_action)||'x:').searchParams.get('go')||'';}catch(x){}}
  e.stopImmediatePropagation();e.notification.close();
  var url='https://samconstruction.github.io/todo/'+(go?'?go='+encodeURIComponent(go)+(gt?'&gt='+encodeURIComponent(gt):''):'');
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){if(list[i].url.indexOf('/todo/')>=0&&'focus' in list[i]){list[i].postMessage({type:'go',go:go,gt:gt});return list[i].focus();}}
    return self.clients.openWindow(url);
  }));
});
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyC_2FSwxf4zIPNoT_VGQ5NpgG7-YZ0CiGU",authDomain:"sam-to-do.firebaseapp.com",projectId:"sam-to-do",storageBucket:"sam-to-do.firebasestorage.app",messagingSenderId:"853325320603",appId:"1:853325320603:web:8d32eab58545c5aff2513e"});
firebase.messaging();
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
// Keep the app on the phone so it opens even with no signal: try the network first, use the saved copy if it fails.
var CACHE='sam-app-v1'; // always checks for a fresh app page, so updates arrive right away
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.origin!==self.location.origin||u.pathname.indexOf('/todo/')!==0||/version\.json/.test(u.pathname))return;
  var nav=r.mode==='navigate'||/\/todo\/(index\.html)?$/.test(u.pathname);
  e.respondWith((nav?fetch(u.origin+u.pathname,{cache:'no-cache',credentials:'same-origin'}):fetch(r)).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r.mode==='navigate'?'/todo/':r,cp);});}return res;})
    .catch(function(){return caches.match(r.mode==='navigate'?'/todo/':r).then(function(m){return m||caches.match('/todo/');});}));
});
