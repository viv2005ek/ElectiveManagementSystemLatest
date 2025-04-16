/**
 * Unregisters any service workers that might be registered in the application.
 * This is useful when removing PWA functionality from an application.
 */
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
      console.log('Service Worker unregistered successfully');
    }).catch((error) => {
      console.error('Error unregistering Service Worker:', error);
    });
  }
} 