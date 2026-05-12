/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
  isSOS?: boolean;
  icon?: string;
  badge?: string;
}

// Push Notifications
sw.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  let data: PushPayload = {};

  try {
    data = event.data.json();
  } catch {
    data = {
      body: event.data.text(),
    };
  }

  const title = data.title || "Okunpedia Update";

  const options = {
    body: data.body || "There is a new update in your community.",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: data.badge || "/icons/icon-72x72.png",
    data: {
      url: data.url || "/",
    },
    vibrate: data.isSOS ? [200, 100, 200, 100, 200, 100, 200] : [100, 50, 100],

    requireInteraction: !!data.isSOS,

    actions: [
      {
        action: "open",
        title: "Open",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],

    tag: data.isSOS ? "sos-alert" : "general-update",

    renotify: true,
  } as unknown as NotificationOptions;

  event.waitUntil(sw.registration.showNotification(title, options));
});

// Notification Click
sw.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  const urlToOpen = new URL(targetUrl, sw.location.origin).href;

  event.waitUntil(
    sw.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }

        return sw.clients.openWindow(urlToOpen);
      }),
  );
});

// Background Sync
// eslint-disable-next-line @typescript-eslint/no-explicit-any
sw.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-comments") {
    event.waitUntil(syncQueuedComments());
  }
});

// Example replay function
async function syncQueuedComments() {
  try {
    console.log("Replaying queued comments...");

    // Example:
    // 1. Open IndexedDB
    // 2. Read pending comments
    // 3. Send to API
    // 4. Remove successful ones
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}
