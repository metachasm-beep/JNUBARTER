/// <reference lib="webworker" />

/**
 * JNU BARTER — Custom Service Worker
 * Handles: offline caching, push notifications, notificationclick
 */

import { defaultCache } from "@ducanh2912/next-pwa/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https?:\/\/.*\/api\/listings/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "listings-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
      },
    },
    {
      matcher: /^https?:\/\/.*\/api\/chains/,
      handler: "CacheFirst",
      options: {
        cacheName: "chains-cache",
        expiration: { maxEntries: 10, maxAgeSeconds: 300 },
      },
    },
    {
      matcher: /\.(?:js|css|woff2?)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
      },
    },
    {
      matcher: /\.(?:png|jpg|jpeg|svg|webp|ico)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "images-cache",
        expiration: { maxEntries: 60, maxAgeSeconds: 86400 },
      },
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();

self.addEventListener("push", (event: any) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    event.waitUntil(
      self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon ?? "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        data: { url: payload.url ?? "/" },
        tag: "jnu-barter",
      } as any)
    );
  } catch (err) {
    console.error("[SW] push error", err);
  }
});

self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients: readonly any[]) => {
      const match = clients.find((c: any) => c.url.includes(self.location.origin));
      if (match) {
        match.focus();
        return (match as any).navigate(url);
      } else {
        return self.clients.openWindow(url);
      }
    })
  );
});
