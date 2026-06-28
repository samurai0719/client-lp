// 高長建設 顧客管理 PWA Service Worker
const CACHE_NAME = "takanaga-crm-v1";
const OFFLINE_URL = "/admin/offline";

// キャッシュする静的アセット（顧客情報はキャッシュしない）
const STATIC_ASSETS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/admin-manifest.json",
  OFFLINE_URL,
];

// キャッシュ禁止パターン（顧客データ含むAPI）
const NO_CACHE_PATTERNS = [
  /\/api\/admin\//,
  /\/api\/push\//,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API・顧客データはキャッシュしない
  if (
    event.request.method !== "GET" ||
    NO_CACHE_PATTERNS.some((p) => p.test(url.pathname)) ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 静的アセットのみキャッシュ
        if (
          response.ok &&
          STATIC_ASSETS.some((a) => url.pathname === a)
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return response;
      })
      .catch(async () => {
        // オフライン時
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // 管理画面ナビゲーションにはオフライン画面を返す
        if (event.request.mode === "navigate" && url.pathname.startsWith("/admin")) {
          const offlineCache = await caches.match(OFFLINE_URL);
          if (offlineCache) return offlineCache;
        }

        return new Response("オフラインです", { status: 503 });
      })
  );
});

// プッシュ通知受信
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload = { title: "高長建設", body: "", url: "/admin" };
  try {
    payload = { ...payload, ...event.data.json() };
  } catch {
    payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "crm-notification",
      data: { url: payload.url },
      requireInteraction: false,
    })
  );
});

// 通知クリック
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/admin";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      clients.openWindow(url);
    })
  );
});

// バッジ更新メッセージ
self.addEventListener("message", (event) => {
  if (event.data?.type === "UPDATE_BADGE") {
    const count = event.data.count ?? 0;
    if ("setAppBadge" in navigator) {
      if (count > 0) {
        navigator.setAppBadge(count);
      } else {
        navigator.clearAppBadge();
      }
    }
  }
});
