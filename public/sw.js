if (!self.define) {
  let e,
    a = {};
  const s = (s, c) => (
    (s = new URL(s + ".js", c).href),
    a[s] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const n = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (a[n]) return;
    let t = {};
    const r = (e) => s(e, n),
      o = { module: { uri: n }, exports: t, require: r };
    a[n] = Promise.all(c.map((e) => o[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(["./workbox-3c9d0171"], function (e) {
  "use strict";
  (importScripts("/worker-db9b17c3fe4b44f6.js"),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/648HIoIv_aHJZeP9UQ0im/_buildManifest.js",
          revision: "4bf11ebf43bc4b3190a8669f5df53602",
        },
        {
          url: "/_next/static/648HIoIv_aHJZeP9UQ0im/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/_next/static/chunks/1313-9db01eaa09789e85.js", revision: "9db01eaa09789e85" },
        { url: "/_next/static/chunks/2256-eb079ca84441261a.js", revision: "eb079ca84441261a" },
        { url: "/_next/static/chunks/235-1a7c70ba4338df14.js", revision: "1a7c70ba4338df14" },
        { url: "/_next/static/chunks/2578-838a87c47b6291f8.js", revision: "838a87c47b6291f8" },
        { url: "/_next/static/chunks/2759-fa5055caf42bc667.js", revision: "fa5055caf42bc667" },
        { url: "/_next/static/chunks/3357.641cd57999619537.js", revision: "641cd57999619537" },
        { url: "/_next/static/chunks/4462-b4b681bbc7f8ab5b.js", revision: "b4b681bbc7f8ab5b" },
        { url: "/_next/static/chunks/506-d38450f9629f9237.js", revision: "d38450f9629f9237" },
        { url: "/_next/static/chunks/5442-accf4fab5a07d113.js", revision: "accf4fab5a07d113" },
        { url: "/_next/static/chunks/615-626aa2e0206f7b03.js", revision: "626aa2e0206f7b03" },
        { url: "/_next/static/chunks/7428-7442f6e16dfed552.js", revision: "7442f6e16dfed552" },
        { url: "/_next/static/chunks/7918-d72de187e0ce9b77.js", revision: "d72de187e0ce9b77" },
        { url: "/_next/static/chunks/800-139475f4a4fb61b1.js", revision: "139475f4a4fb61b1" },
        { url: "/_next/static/chunks/8115-d928d4d332902584.js", revision: "d928d4d332902584" },
        { url: "/_next/static/chunks/8402-306d7c2866357c96.js", revision: "306d7c2866357c96" },
        { url: "/_next/static/chunks/8859-24e800ad9cc93964.js", revision: "24e800ad9cc93964" },
        { url: "/_next/static/chunks/9668-cb1ce46b1a387f9f.js", revision: "cb1ce46b1a387f9f" },
        { url: "/_next/static/chunks/991cd08a-0ccc9f5371893ee3.js", revision: "0ccc9f5371893ee3" },
        { url: "/_next/static/chunks/9f3760f8-ed76bc5288154b7a.js", revision: "ed76bc5288154b7a" },
        {
          url: "/_next/static/chunks/app/_not-found/page-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/about/page-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/admin/activity/page-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/admin/blog/%5Bid%5D/edit/page-4a223e1f509c3a9e.js",
          revision: "4a223e1f509c3a9e",
        },
        {
          url: "/_next/static/chunks/app/admin/blog/new/page-c893adc0b77b71bd.js",
          revision: "c893adc0b77b71bd",
        },
        {
          url: "/_next/static/chunks/app/admin/blog/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/admin/comments/page-d7abaa84c28f4fbb.js",
          revision: "d7abaa84c28f4fbb",
        },
        {
          url: "/_next/static/chunks/app/admin/error-9c5585fcca40dbe3.js",
          revision: "9c5585fcca40dbe3",
        },
        {
          url: "/_next/static/chunks/app/admin/layout-7fee79bd88e6997c.js",
          revision: "7fee79bd88e6997c",
        },
        {
          url: "/_next/static/chunks/app/admin/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/admin/pages/%5Bid%5D/edit/page-5f864ed8d13c0134.js",
          revision: "5f864ed8d13c0134",
        },
        {
          url: "/_next/static/chunks/app/admin/pages/%5Bid%5D/history/page-1f3a1a097750a367.js",
          revision: "1f3a1a097750a367",
        },
        {
          url: "/_next/static/chunks/app/admin/pages/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/admin/settings/page-fc66f5a59bc69bac.js",
          revision: "fc66f5a59bc69bac",
        },
        {
          url: "/_next/static/chunks/app/admin/towns/%5Bid%5D/edit/page-be56152e590bd8d6.js",
          revision: "be56152e590bd8d6",
        },
        {
          url: "/_next/static/chunks/app/admin/towns/new/page-80ef5cd10e7a5acd.js",
          revision: "80ef5cd10e7a5acd",
        },
        {
          url: "/_next/static/chunks/app/admin/towns/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/admin/users/page-b9d1161f425a0f9c.js",
          revision: "b9d1161f425a0f9c",
        },
        {
          url: "/_next/static/chunks/app/api/admin/blog/%5Bid%5D/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/admin/blog/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/admin/comments/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/admin/pages/%5Bid%5D/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/admin/settings/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/admin/towns/%5Bid%5D/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/admin/towns/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/admin/users/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/auth/register/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/comments/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/communities/%5Bid%5D/join/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/communities/%5Bid%5D/mentorship/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/communities/%5Bid%5D/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/communities/%5Bid%5D/updates/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/communities/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/map/towns/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/search/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/api/updates/sos/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/auth/login/page-60e2d0f57369a3b6.js",
          revision: "60e2d0f57369a3b6",
        },
        {
          url: "/_next/static/chunks/app/auth/register/page-d70a88f823a9da6b.js",
          revision: "d70a88f823a9da6b",
        },
        {
          url: "/_next/static/chunks/app/blog/%5Bslug%5D/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/blog/error-19d0e921bb49f5f0.js",
          revision: "19d0e921bb49f5f0",
        },
        {
          url: "/_next/static/chunks/app/blog/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/communities/%5Bid%5D/page-9157f3dea800a8db.js",
          revision: "9157f3dea800a8db",
        },
        {
          url: "/_next/static/chunks/app/communities/mentorship/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/communities/page-adc08c7feba31a68.js",
          revision: "adc08c7feba31a68",
        },
        { url: "/_next/static/chunks/app/error-a9ee216aa0aea454.js", revision: "a9ee216aa0aea454" },
        {
          url: "/_next/static/chunks/app/layout-aca2e6ce25950eb2.js",
          revision: "aca2e6ce25950eb2",
        },
        {
          url: "/_next/static/chunks/app/map/page-f620f01b5a998a6f.js",
          revision: "f620f01b5a998a6f",
        },
        {
          url: "/_next/static/chunks/app/not-found-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/offline/page-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        { url: "/_next/static/chunks/app/page-bc1bab7ae83a9071.js", revision: "bc1bab7ae83a9071" },
        {
          url: "/_next/static/chunks/app/profile/%5Bid%5D/page-980071ef1d9ab44b.js",
          revision: "980071ef1d9ab44b",
        },
        {
          url: "/_next/static/chunks/app/profile/page-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/search/page-fc88abb778ab9e40.js",
          revision: "fc88abb778ab9e40",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-78e296f72e2121cd.js",
          revision: "78e296f72e2121cd",
        },
        {
          url: "/_next/static/chunks/app/template-52184d3f871421f9.js",
          revision: "52184d3f871421f9",
        },
        {
          url: "/_next/static/chunks/app/towns/%5Bslug%5D/%5BpageSlug%5D/page-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/towns/%5Bslug%5D/not-found-5fa58eac21275865.js",
          revision: "5fa58eac21275865",
        },
        {
          url: "/_next/static/chunks/app/towns/%5Bslug%5D/page-1f1e3547fd90a40c.js",
          revision: "1f1e3547fd90a40c",
        },
        {
          url: "/_next/static/chunks/app/towns/error-18b7e77394ac28ac.js",
          revision: "18b7e77394ac28ac",
        },
        {
          url: "/_next/static/chunks/app/towns/page-7335e7ee7ac188dd.js",
          revision: "7335e7ee7ac188dd",
        },
        { url: "/_next/static/chunks/e70bef93-d6098e75cf5636ac.js", revision: "d6098e75cf5636ac" },
        { url: "/_next/static/chunks/ed48eaa7.84d7af6144482737.js", revision: "84d7af6144482737" },
        { url: "/_next/static/chunks/framework-5fe776fc7262173b.js", revision: "5fe776fc7262173b" },
        { url: "/_next/static/chunks/main-3cd433c239a8afd3.js", revision: "3cd433c239a8afd3" },
        { url: "/_next/static/chunks/main-app-69845e7e8ba9013e.js", revision: "69845e7e8ba9013e" },
        {
          url: "/_next/static/chunks/pages/_app-b0958da17ceee454.js",
          revision: "b0958da17ceee454",
        },
        {
          url: "/_next/static/chunks/pages/_error-c98797e2a40c8265.js",
          revision: "c98797e2a40c8265",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        { url: "/_next/static/chunks/webpack-848a7cd504370893.js", revision: "848a7cd504370893" },
        { url: "/_next/static/css/6c4cb8cf27bd1d1f.css", revision: "6c4cb8cf27bd1d1f" },
        {
          url: "/_next/static/media/19cfc7226ec3afaa-s.woff2",
          revision: "9dda5cfc9a46f256d0e131bb535e46f8",
        },
        {
          url: "/_next/static/media/21350d82a1f187e9-s.woff2",
          revision: "4e2553027f1d60eff32898367dd4d541",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/ba9851c3c22cd980-s.woff2",
          revision: "9e494903d6b0ffec1a1e14d34427d44d",
        },
        {
          url: "/_next/static/media/c5fe6dc8356a8c31-s.woff2",
          revision: "027a89e9ab733a145db70f09b8a18b42",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        { url: "/data/ward.json", revision: "d41d8cd98f00b204e9800998ecf8427e" },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        { url: "/icons/icon-128x128.png", revision: "431338e0b35cc497ee9c6df32e89d2ce" },
        { url: "/icons/icon-144x144.png", revision: "19b7c601ef3a9e2380c12f38a82e1144" },
        { url: "/icons/icon-152x152.png", revision: "84f26e6fe3533ef4c8d9b72ce2fabca7" },
        { url: "/icons/icon-192x192.png", revision: "2c6581dcbb903d829c8c8fa3b53f4198" },
        { url: "/icons/icon-384x384.png", revision: "e9b5cb0b3f05a285ed09f3546aa2a8ca" },
        { url: "/icons/icon-512x512.png", revision: "7dc7a3f17c0dbcad43ec8d36f9dfa6e6" },
        { url: "/icons/icon-72x72.png", revision: "a256854cbfc42acb98188b3613f8fa0c" },
        { url: "/icons/icon-96x96.png", revision: "713833d0e622f3d57159390cde2d1074" },
        { url: "/icons/icon.svg", revision: "b5c03d47de6c8fa5b9cbb0912a872095" },
        { url: "/images/home-tour/culture.png", revision: "b5c1384e10fa93fff362cdb4b1e48b0a" },
        { url: "/images/home-tour/history.png", revision: "e222835e7e876758cc5afef442d4b27d" },
        { url: "/images/home-tour/landscape.jpeg", revision: "1b0523ade19ef8b5c145758bbb082993" },
        { url: "/images/home-tour/lie.png", revision: "69ddad56fc645942f9a53246e7ceb1d3" },
        { url: "/manifest.json", revision: "b0e513a9ad873c34e317eace9272e744" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/robots.txt", revision: "67dc70ddd92f1cfd4e71215fcf3a556b" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
        { url: "/worker-db9b17c3fe4b44f6.js", revision: "3654efaaee2fd2761f8f0b25f75c40ce" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: function (e) {
              var a = e.response;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    a && "opaqueredirect" === a.type
                      ? new Response(a.body, { status: 200, statusText: "OK", headers: a.headers })
                      : a,
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var a = e.sameOrigin,
          s = e.url.pathname;
        return !(!a || s.startsWith("/api/auth/callback") || !s.startsWith("/api/"));
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          s = e.url.pathname,
          c = e.sameOrigin;
        return (
          "1" === a.headers.get("RSC") &&
          "1" === a.headers.get("Next-Router-Prefetch") &&
          c &&
          !s.startsWith("/api/")
        );
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          s = e.url.pathname,
          c = e.sameOrigin;
        return "1" === a.headers.get("RSC") && c && !s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var a = e.url.pathname;
        return e.sameOrigin && !a.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        return !e.sameOrigin;
      },
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      "GET",
    ));
});
