/* TITAN AI — client-side navigation: swap views without reloading the browser */
(() => {
  "use strict";
  const ROOT_ID = "titan-app";
  let navigating = false;

  function addAssets(doc) {
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.href;
      if (!href || Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(x => x.href === href)) return;
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

  function executeScripts(scripts, root) {
    scripts.forEach(old => {
      const node = document.createElement("script");
      Array.from(old.attributes).forEach(a => node.setAttribute(a.name, a.value));
      node.textContent = old.textContent;
      root.appendChild(node);
    });
  }

  async function navigate(url, push) {
    if (navigating) return;
    const target = new URL(url, location.origin);
    if (target.origin !== location.origin) return;
    navigating = true;
    const root = document.getElementById(ROOT_ID);
    try {
      const path = target.pathname === "/" ? "/pages/home.html" : target.pathname + target.search;
      const response = await fetch(path, { cache: "default" });
      if (!response.ok) throw new Error("Page load failed: " + response.status);
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      const pageRoot = doc.querySelector("#titan-app");
      const source = pageRoot || doc.body;
      const scripts = Array.from(source.querySelectorAll("script"));
      const content = source.cloneNode(true);
      content.querySelectorAll("script").forEach(s => s.remove());

      addAssets(doc);
      root.innerHTML = content === source ? "" : content.innerHTML;
      document.title = doc.title || "TITAN AI — Watch, Create, Inspire";
      if (push) history.pushState({ titan: true }, "", target.pathname + target.search + target.hash);
      executeScripts(scripts, root);

      if (target.hash) {
        requestAnimationFrame(() => document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView());
      } else {
        window.scrollTo(0, 0);
        const feed = document.getElementById("shortFeed");
        if (feed) feed.scrollTop = 0;
      }
      document.body.classList.toggle("titan-shorts-view", !!document.getElementById("shortFeed"));
    } catch (error) {
      console.error("TITAN route error:", error);
      // Fallback only for a genuine fetch/render failure.
      if (root && !root.children.length) root.innerHTML = '<div style="padding:28px;color:white">TITAN AI could not load this screen. Please try again.</div>';
    } finally {
      navigating = false;
    }
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin || !(target.pathname === "/" || target.pathname.startsWith("/pages/"))) return;
    if (target.pathname === location.pathname && target.search === location.search && !target.hash) return;
    event.preventDefault();
    navigate(target.href, true);
  });

  window.addEventListener("popstate", () => navigate(location.href, false));

  const start = () => navigate(location.href, false);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();