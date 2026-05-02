// worker/index.ts
declare const self: ServiceWorkerGlobalScope;

// This will be added to the generated sw.js by next-pwa
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  
  const title = data.title || "Okunpedia Update";
  const options = {
    body: data.body || "There is a new update in your community.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: data.url || "/",
    vibrate: [200, 100, 200, 100, 200, 100, 200], // SOS pattern
  };

  if (data.isSOS) {
    options.requireInteraction = true;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for offline forms (e.g., Comments)
self.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-comments") {
    // Logic to replay queued requests from IndexedDB
    console.log("Background sync triggered for comments");
  }
});
