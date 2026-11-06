/* TITAN AI — fast, predictable client-side navigation */
(() => {
  "use strict";
  const MOUNT_ID = "app-content";
  const pageCache = new Map();
  const pending = new Map();
  let busy = false;
  let queued = null;
  let routeStyleNodes = [];

  const routePath = url => {
    const u = new URL(url, location.href);
    return u.pathname === "/" ? "/pages/home.html" : u.pathname + u.search;
  };

  function fetchPage(url) {
    const path = routePath(url);
    if (pageCache.has(path)) return Promise.resolve(pageCache.get(path));
    if (pending.has(path)) return pending.get(path);
    const request = fetch(path, { cache: "force-cache", credentials: "same-origin" })
      .then(async response => {
        if (!response.ok) throw new Error("Page load failed (" + response.status + ")");
        const html = await response.text();
        pageCache.set(path, html);
        return html;
      })
      .finally(() => pending.delete(path));
    pending.set(path, request);
    return request;
  }

  function prefetch(url) {
    const target = new URL(url, location.href);
    if (target.origin !== location.origin) return;
    const path = routePath(target);
    if (pageCache.has(path) || pending.has(path)) return;
    fetchPage(target.href).catch(() => {});
  }

  function waitForStylesheet(node) {
    if (node.sheet) return Promise.resolve();
    return new Promise(resolve => {
      const done = () => resolve();
      node.addEventListener("load", done, { once: true });
      node.addEventListener("error", done, { once: true });
      setTimeout(done, 2500);
    });
  }

  async function mountStyles(doc) {
    const previousNodes = routeStyleNodes;
    const nextNodes = [];
    const waits = [];

    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.href;
      if (!href) return;

      let node = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .find(x => x.href === href && !previousNodes.includes(x));

      if (!node) {
        node = document.createElement("link");
        node.rel = "stylesheet";
        node.href = href;
        node.dataset.titanRouteAsset = "1";
        document.head.appendChild(node);
      }

      if (node.dataset.titanRouteAsset === "1") nextNodes.push(node);
      waits.push(waitForStylesheet(node));
    });

    doc.querySelectorAll("style").forEach(style => {
      const node = document.createElement("style");
      node.dataset.titanRouteStyle = "1";
      node.textContent = style.textContent;
      document.head.appendChild(node);
      nextNodes.push(node);
    });

    await Promise.all(waits);
    previousNodes.forEach(node => node.remove());
    routeStyleNodes = nextNodes;
  }

  function runScripts(scripts, mount) {
    scripts.forEach(old => {
      const node = document.createElement("script");
      [...old.attributes].forEach(a => node.setAttribute(a.name, a.value));

      // Dynamically inserted external scripts must keep document order.
      if (old.src) {
        node.async = false;
        node.src = old.src;
      } else {
        const type = (old.getAttribute("type") || "").toLowerCase();
        const code = old.textContent || "";
        // Give each classic page script its own scope. Without this, navigating
        // away and back can redeclare top-level let/const names and throw
        // "Identifier has already been declared", stopping the page setup.
        node.textContent = type === "module"
          ? code
          : "(function () {\n" + code + "\n}).call(window);";
      }
      mount.appendChild(node);
    });
  }

  async function loadRoute(url, pushState) {
    const target = new URL(url, location.href);
    if (target.origin !== location.origin) return;
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) { location.assign(target.href); return; }

    const html = await fetchPage(target.href);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const source = doc.querySelector("#titan-app") || doc.body;
    const scripts = [...source.querySelectorAll("script")];
    const copy = source.cloneNode(true);
    copy.querySelectorAll("script").forEach(s => s.remove());

    await mountStyles(doc);
    mount.innerHTML = copy.innerHTML;
    document.title = doc.title || "TITAN AI — Watch, Create, Inspire";
    if (pushState) history.pushState({ titan: true }, "", target.pathname + target.search + target.hash);

    runScripts(scripts, mount);
    document.body.classList.toggle("titan-shorts-view", !!document.getElementById("shortFeed"));
    document.body.classList.toggle("titan-home-view", !!document.querySelector(".home-main"));
    if (target.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView());
    else {
      window.scrollTo(0, 0);
      const feed = document.getElementById("shortFeed");
      if (feed) feed.scrollTop = 0;
    }
  }

  async function navigate(url, pushState = true) {
    queued = { url, pushState };
    if (busy) return;
    busy = true;
    while (queued) {
      const job = queued;
      queued = null;
      try {
        await loadRoute(job.url, job.pushState);
      } catch (error) {
        console.error("TITAN navigation error:", error);
        const mount = document.getElementById(MOUNT_ID);
        if (mount && !mount.children.length) mount.innerHTML = '<p role="alert" style="padding:24px;color:#f4c85b">This page could not load. Please check your connection and try again.</p>';
      }
    }
    busy = false;
  }

  document.addEventListener("pointerover", event => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (link) prefetch(link.href);
  }, { passive: true });
  document.addEventListener("touchstart", event => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (link) prefetch(link.href);
  }, { passive: true, capture: true });

  document.addEventListener("click", event => {
    const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = origin?.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin) return;
    if (!(target.pathname === "/" || target.pathname.startsWith("/pages/"))) return;
    if (target.pathname === location.pathname && target.search === location.search) {
      if (target.hash) {
        event.preventDefault();
        event.stopPropagation();
        history.pushState({ titan: true }, "", target.pathname + target.search + target.hash);
        const id = decodeURIComponent(target.hash.slice(1));
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    navigate(target.href, true);
  }, true);

  window.addEventListener("popstate", () => navigate(location.href, false));
  const start = () => {
    navigate(location.href, false).then(() => {
      const warmRoutes = ["/pages/shorts.html", "/pages/creator.html", "/pages/studio.html", "/pages/profile.html"];
      const warm = () => warmRoutes.forEach(path => prefetch(path));
      if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 1200 });
      else setTimeout(warm, 500);
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();