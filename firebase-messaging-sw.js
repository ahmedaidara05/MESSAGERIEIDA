/* Service Worker Firebase Cloud Messaging - Messagerie Ida */
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyClnkqZC-Jt_lD51-zlGZqmZp7LUI8uz_M",
  authDomain: "messagerie-74782.firebaseapp.com",
  projectId: "messagerie-74782",
  storageBucket: "messagerie-74782.firebasestorage.app",
  messagingSenderId: "847192067277",
  appId: "1:847192067277:web:01772fbd95be50c8e16d84"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || 'Nouveau message';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/icon-192.png',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(clients.openWindow(url));
});
