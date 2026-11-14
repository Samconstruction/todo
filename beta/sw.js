// Tapping a notification opens the app right on the thing it is about (registered before Firebase so it runs first).
self.addEventListener('notificationclick',function(e){
  var d=e.notification.data||{},f=d.FCM_MSG||{},go=d.go||(f.data&&f.data.go)||'',gt=d.gt||(f.data&&f.data.gt)||'';
  if(!go){try{go=new URL((f.fcmOptions&&f.fcmOptions.link)||(f.notification&&f.notification.click_action)||'x:').searchParams.get('go')||'';}catch(x){}}
  e.stopImmediatePropagation();e.notification.close();
  var url='https://samconstruction.github.io/todo/beta/'+(go?'?go='+encodeURIComponent(go)+(gt?'&gt='+encodeURIComponent(gt):''):'');
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){if(list[i].url.indexOf('/todo/beta/')>=0&&'focus' in list[i]){list[i].postMessage({type:'go',go:go,gt:gt});return list[i].focus();}}
    return self.clients.openWindow(url);
  }));
});
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyC_2FSwxf4zIPNoT_VGQ5NpgG7-YZ0CiGU",authDomain:"sam-to-do.firebaseapp.com",projectId:"sam-to-do",storageBucket:"sam-to-do.firebasestorage.app",messagingSenderId:"853325320603",appId:"1:853325320603:web:8d32eab58545c5aff2513e"});
firebase.messaging();
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
// Keep the app on the phone so it opens right away: try the network, but if it is slow (bad signal) show the saved copy after 2 seconds.
// The network answer still updates the saved copy, and the app reloads itself when a new version is out.
var CACHE='sam-beta-v1';
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.origin!==self.location.origin||u.pathname.indexOf('/todo/beta/')!==0||/version\.json/.test(u.pathname))return;
  var nav=r.mode==='navigate'||/\/todo\/beta\/(index\.html)?$/.test(u.pathname),key=nav?'/todo/beta/':r;
  var net=(nav?fetch(u.origin+u.pathname,{cache:'no-cache',credentials:'same-origin'}):fetch(r)).then(function(res){if(res&&res.ok){var cp=res.clone();e.waitUntil(caches.open(CACHE).then(function(c){return c.put(key,cp);}));}return res;});
  e.waitUntil(net.catch(function(){}));
  var saved=caches.match(key);
  e.respondWith(new Promise(function(done){var over=false;function give(x){if(!over&&x){over=true;done(x);}}
    net.then(give,function(){saved.then(function(m){give(m);if(!over)caches.match('/todo/beta/').then(function(m2){give(m2||Response.error());});});});
    setTimeout(function(){saved.then(give);},nav?2000:4000);}));
});
