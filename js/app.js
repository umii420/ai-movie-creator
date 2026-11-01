/* TITAN AI — reliable in-app navigation (no full-page reloads) */
(() => {
  "use strict";

  const MOUNT_ID = "app-content";
  let busy = false;
  let queued = null;

  function mountStyles(doc) {
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.href;
      if (!href || [...document.querySelectorAll('link[rel="stylesheet"]')].some(x => x.href === href)) return;
      const node = document.createElement("link");
      node.rel = "stylesheet";
      node.href = href;
      node.dataset.titanRouteAsset = "1";
      document.head.appendChild(node);
    });
    document.querySelectorAll('style[data-titan-route-style="1"]').forEach(x => x.remove());
    doc.querySelectorAll("style").forEach(style => {
      const node = document.createElement("style");
      node.dataset.titanRouteStyle = "1";
      node.textContent = style.textContent;
      document.head.appendChild(node);
    });
  }

  function runScripts(scripts, mount) {
    scripts.forEach(old => {
      const node = document.createElement("script");
      [...old.attributes].forEach(a => node.setAttribute(a.name, a.value));
      node.textContent = old.textContent;
      mount.appendChild(node);
    });
  }

  async function loadRoute(url, pushState) {
    const target = new URL(url, location.href);
    if (target.origin !== location.origin) return;
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) {
      location.assign(target.href);
      return;
    }

    const path = target.pathname === "/" ? "/pages/home.html" : target.pathname + target.search;
    const response = await fetch(path, { cache: "no-cache", headers: { "X-TITAN-Navigation": "1" } });
    if (!response.ok) throw new Error("Page load failed (" + response.status + ")");
    const doc = new DOMParser().parseFromString(await response.text(), "text/html");
    const pageRoot = doc.querySelector("#titan-app");
    const source = pageRoot || doc.body;
    const scripts = [...source.querySelectorAll("script")];
    const copy = source.cloneNode(true);
    copy.querySelectorAll("script").forEach(s => s.remove());

    mountStyles(doc);
    mount.innerHTML = copy.innerHTML;
    document.title = doc.title || "TITAN AI — Watch, Create, Inspire";
    if (pushState) history.pushState({ titan: true }, "", target.pathname + target.search + target.hash);

    runScripts(scripts, mount);
    document.body.classList.toggle("titan-shorts-view", !!document.getElementById("shortFeed"));

    if (target.hash) {
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView());
    } else {
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
        // Keep the current screen usable; only fall back to browser navigation on a real load failure.
        if (job.pushState) location.assign(job.url);
      }
    }
    busy = false;
  }

  document.addEventListener("click", event => {
    const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = origin?.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin) return;
    const isAppRoute = target.pathname === "/" || target.pathname.startsWith("/pages/");
    if (!isAppRoute) return;
    if (target.pathname === location.pathname && target.search === location.search && !target.hash) return;

    event.preventDefault();
    event.stopPropagation();
    navigate(target.href, true);
  }, true);

  window.addEventListener("popstate", () => navigate(location.href, false));

  const start = () => navigate(location.href, false);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();