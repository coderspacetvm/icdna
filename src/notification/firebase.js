import { initializeApp, getApps } from "firebase/app";
import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
    deleteToken
} from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyD8jh985uD39VQ4Rn-2p4sh0rdTD0jxmOY",
    authDomain: "thomsons-casa-store.firebaseapp.com",
    projectId: "thomsons-casa-store",
    storageBucket: "thomsons-casa-store.firebasestorage.app",
    messagingSenderId: "996201875645",
    appId: "1:996201875645:web:14fa9758b4adaeac004fd4",
    measurementId: "G-0MRN32WRE4"
};

const VAPID_KEY = "BJOZnvBy_BrELRBC3X_o0VaGsIdnWX48WMOiER0XXO1IqoQEpOVk-tPWeR4khkbUmM0Mr-J-r6sRsTpATtCzXHk";

// Initialize Firebase (prevent multiple initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Messaging instance
let messaging = null;
let messagingInitialized = false;

// Initialize messaging with proper Next.js SSR handling
const initializeMessaging = async () => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined' || messagingInitialized) {
        return messaging;
    }

    try {
        const supported = await isSupported();
        if (supported) {
            messaging = getMessaging(app);
            messagingInitialized = true;

            // Set up token refresh listener
            setupTokenRefresh();
        }
        return messaging;
    } catch (error) {
        console.error('Failed to initialize messaging:', error);
        return null;
    }
};

// Token refresh handler - using periodic check since onTokenRefresh doesn't exist
const setupTokenRefresh = () => {
    if (!messaging || typeof window === 'undefined') return;

    // Check for token changes periodically (every 24 hours)
    const checkTokenRefresh = async () => {
        try {
            // Check for notification permission before attempting to get token
            if (Notification.permission !== 'granted') {
                return;
            }

            const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
            const storedToken = localStorage.getItem("fcm_token");

            if (currentToken && currentToken !== storedToken) {
                localStorage.setItem("fcm_token", currentToken);
                // Notify app about token refresh
                window.dispatchEvent(new CustomEvent('fcm-token-refresh', {
                    detail: { token: currentToken }
                }));
            }
        } catch (error) {
            // Silently handle permission errors or just log them
            if (error?.code !== 'messaging/permission-blocked') {
                console.error('Token refresh check failed:', error);
            }
        }
    };

    // Check immediately and then every 24 hours
    checkTokenRefresh();
    setInterval(checkTokenRefresh, 24 * 60 * 60 * 1000); // 24 hours
};

// Detect iOS devices
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Detect if running in standalone mode (PWA)
const isStandalone = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
};

export const getFCMToken = () => {
    return localStorage.getItem("fcm_token");
};

export const getNotificationPermission = () => {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
};

export const generateToken = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
        if (!('Notification' in window)) {
            return { success: false, error: 'unsupported' };
        }

        // Ensure messaging is initialized
        if (!messaging) {
            await initializeMessaging();
            if (!messaging) {
                return { success: false, error: 'messaging_unavailable' };
            }
        }

        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            return { success: false, error: 'permission_denied' };
        }

        let token = null;
        let registration = null;

        // Enhanced service worker registration with retry logic
        if ('serviceWorker' in navigator && !isIOS()) {
            try {
                registration = await registerServiceWorker();
            } catch (swError) {
                // Continue without service worker for fallback
                console.warn('Service worker registration failed, continuing without:', swError);
            }
        }

        // Platform-specific token generation with improved error handling
        if (isIOS()) {
            if (isStandalone()) {
                // iOS PWA - direct token generation
                try {
                    token = await getToken(messaging, { vapidKey: VAPID_KEY });
                } catch (error) {
                    if (retryCount < MAX_RETRIES) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                        return generateToken(retryCount + 1);
                    }
                    return { success: false, error: 'ios_pwa_token_failed' };
                }
            } else {
                // iOS Safari - provide clear guidance
                return {
                    success: false,
                    error: 'ios_safari_unsupported',
                    message: 'For better notification support on iOS, please add this app to your home screen'
                };
            }
        } else {
            // Android and desktop platforms
            try {
                const tokenOptions = { vapidKey: VAPID_KEY };
                if (registration) {
                    tokenOptions.serviceWorkerRegistration = registration;
                }

                token = await getToken(messaging, tokenOptions);
            } catch (error) {
                if (retryCount < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                    return generateToken(retryCount + 1);
                }

                // Try fallback without service worker
                try {
                    token = await getToken(messaging, { vapidKey: VAPID_KEY });
                } catch (fallbackError) {
                    return { success: false, error: 'token_generation_failed' };
                }
            }
        }

        if (token) {
            const existingToken = localStorage.getItem("fcm_token");
            if (existingToken !== token) {
                localStorage.setItem("fcm_token", token);

                // Dispatch token update event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('fcm-token-update', {
                        detail: { token, previousToken: existingToken }
                    }));
                }
            }
            localStorage.setItem("notifications_enabled", "true");
            return { success: true, token };
        } else {
            return { success: false, error: 'no_token' };
        }

    } catch (error) {
        // Enhanced error handling with specific Firebase error codes
        const errorCode = error.code || error.message;

        switch (errorCode) {
            case 'messaging/unsupported-browser':
                return { success: false, error: 'unsupported_browser' };
            case 'messaging/permission-blocked':
                return { success: false, error: 'permission_blocked' };
            case 'messaging/vapid-key-required':
                return { success: false, error: 'vapid_key_error' };
            case 'messaging/token-unsubscribe-failed':
                return { success: false, error: 'token_unsubscribe_failed' };
            default:
                if (retryCount < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                    return generateToken(retryCount + 1);
                }
                return { success: false, error: 'unknown_error', details: errorCode };
        }
    }
};

export const areNotificationsEnabled = () => {
    return localStorage.getItem("notifications_enabled") === "true";
};

export const enableNotifications = async () => {
    return await generateToken();
};

export const disableNotifications = async () => {
    try {
        // Delete the FCM token from Firebase
        if (messaging) {
            const token = getFCMToken();
            if (token) {
                await deleteToken(messaging);
            }
        }

        // Clear local storage
        localStorage.setItem("notifications_enabled", "false");
        localStorage.removeItem("fcm_token");

        return { success: true };
    } catch (error) {
        console.error('Error disabling notifications:', error);
        // Still update local storage even if token deletion fails
        localStorage.setItem("notifications_enabled", "false");
        localStorage.removeItem("fcm_token");
        return { success: false, error: error.message };
    }
};

export const onMessageListener = (callback) => {
    if (!messaging) {
        initializeMessaging().then((msg) => {
            if (msg) {
                return onMessage(msg, callback);
            }
        });
        return () => { };
    }
    return onMessage(messaging, callback);
};

// Advanced: Handle token refresh events
export const onTokenRefreshListener = (callback) => {
    if (typeof window !== 'undefined') {
        const handleTokenRefresh = (event) => {
            callback(event.detail.token);
        };

        window.addEventListener('fcm-token-refresh', handleTokenRefresh);

        // Return cleanup function
        return () => {
            window.removeEventListener('fcm-token-refresh', handleTokenRefresh);
        };
    }
    return () => { };
};

// Service Worker registration with better error handling
export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                scope: '/',
                updateViaCache: 'none'
            });

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    } else {
        throw new Error('Service Worker not supported');
    }
};

// Initialize messaging when module loads (for Next.js)
if (typeof window !== 'undefined') {
    initializeMessaging();
}
