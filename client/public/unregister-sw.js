/**
 * This script can be run in the browser console to unregister service workers.
 * Copy and paste this entire script into your browser console and press Enter.
 */
(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
        // console.log('Service Worker unregistered:', registration);
      }
    });
    
    // Also try to unregister the active service worker
    navigator.serviceWorker.ready.then(function(registration) {
      registration.unregister();
      // console.log('Active Service Worker unregistered');
    }).catch(function(error) {
      console.error('Error unregistering Service Worker:', error);
    });
    
    // console.log('Service Worker unregistration process completed');
  } else {
    // console.log('Service Workers are not supported in this browser');
  }
})(); 