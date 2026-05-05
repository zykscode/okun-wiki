(() => {
  let t = self;
  async function n() {
    try {
      console.log("Replaying queued comments...");
    } catch (t) {
      console.error("Background sync failed:", t);
    }
  }
  (t.addEventListener("push", (n) => {
    if (!n.data) return;
    let i = {};
    try {
      i = n.data.json();
    } catch (t) {
      i = { body: n.data.text() };
    }
    let e = i.title || "Okunpedia Update",
      o = {
        body: i.body || "There is a new update in your community.",
        icon: i.icon || "/icons/icon-192x192.png",
        badge: i.badge || "/icons/icon-72x72.png",
        data: { url: i.url || "/" },
        vibrate: i.isSOS ? [200, 100, 200, 100, 200, 100, 200] : [100, 50, 100],
        requireInteraction: !!i.isSOS,
        actions: [
          { action: "open", title: "Open" },
          { action: "dismiss", title: "Dismiss" },
        ],
        tag: i.isSOS ? "sos-alert" : "general-update",
        renotify: !0,
      };
    n.waitUntil(t.registration.showNotification(e, o));
  }),
    t.addEventListener("notificationclick", (n) => {
      var i;
      n.notification.close();
      let e = new URL(
        (null == (i = n.notification.data) ? void 0 : i.url) || "/",
        t.location.origin,
      ).href;
      n.waitUntil(
        t.clients.matchAll({ type: "window", includeUncontrolled: !0 }).then((n) => {
          for (let t of n) if ("focus" in t) return (t.navigate(e), t.focus());
          return t.clients.openWindow(e);
        }),
      );
    }),
    t.addEventListener("sync", (t) => {
      "sync-comments" === t.tag && t.waitUntil(n());
    }));
})();
