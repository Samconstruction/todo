importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyC_2FSwxf4zIPNoT_VGQ5NpgG7-YZ0CiGU",authDomain:"sam-to-do.firebaseapp.com",projectId:"sam-to-do",storageBucket:"sam-to-do.firebasestorage.app",messagingSenderId:"853325320603",appId:"1:853325320603:web:8d32eab58545c5aff2513e"});
firebase.messaging();
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(){});
