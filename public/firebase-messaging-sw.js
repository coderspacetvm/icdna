// Use latest Firebase SDK version matching your package.json
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD8jh985uD39VQ4Rn-2p4sh0rdTD0jxmOY",
    authDomain: "thomsons-casa-store.firebaseapp.com",
    projectId: "thomsons-casa-store",
    storageBucket: "thomsons-casa-store.firebasestorage.app",
    messagingSenderId: "996201875645",
    appId: "1:996201875645:web:14fa9758b4adaeac004fd4",
    measurementId: "G-0MRN32WRE4"
});

const messaging = firebase.messaging();

// Cache management for better performance
const CACHE_NAME = 'thomson-casa-notifications-v1';

// Install event - prepare service worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Thomson\'s Casa Store';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || 'You have a new notification',
        icon: payload.notification?.icon || '/assets/icons/app_icon.png',
        image: payload.notification?.image,
        badge: '/assets/icons/app_icon.png',
        tag: payload.data?.tag || 'default',
        requireInteraction: false,
        silent: false,
        data: {
            url: payload.data?.url || payload.fcmOptions?.link || '/',
            ...payload.data
        },
        actions: [
            {
                action: 'open',
                title: 'Open',
                icon: '/assets/icons/app_icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/app_icon.png'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            // Try to focus existing window first
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus().then(() => {
                        if (urlToOpen !== '/') {
                            return client.navigate(urlToOpen);
                        }
                    });
                }
            }
            // Open new window if no existing window found
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    // Optional: Track notification close events
});

// Handle push events (for additional control)
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    try {
        const payload = event.data.json();

        const notificationTitle = payload.notification?.title || payload.data?.title || 'Thomson\'s Casa Store';
        const notificationOptions = {
            body: payload.notification?.body || payload.data?.body || 'You have a new notification',
            icon: payload.notification?.icon || '/assets/icons/app_icon.png',
            image: payload.notification?.image,
            badge: '/assets/icons/app_icon.png',
            tag: payload.data?.tag || 'default',
            data: {
                url: payload.data?.url || '/',
                ...payload.data
            }
        };

        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    } catch (error) {
        // Fallback for malformed push data
        event.waitUntil(
            self.registration.showNotification('Thomson\'s Casa Store', {
                body: 'You have a new notification',
                icon: '/assets/icons/app_icon.png',
                badge: '/assets/icons/app_icon.png'
            })
        );
    }
});
