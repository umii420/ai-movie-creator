/* TITAN AI — lightweight client-side page router */
(() => {
  "use strict";
  const ROOT_ID = "titan-app";
  let navigating = false;

  function addPageAssets(doc) {
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.href;
      if (!href || document.querySelector('link[rel="stylesheet"][href="' + href + '"]')) return;
      const node = document.createElement("link");
      node.rel = "stylesheet";
      node.href = href;
      document.head.appendChild(node);
    });
    doc.querySelectorAll("style").forEach(style => {
      const node = document.createElement("style");
      node.dataset.titanPageStyle = location.pathname;
      node.textContent = style.textContent;
      document.head.appendChild(node);
    });
  }

  function runPageScripts(container) {
    const scripts = Array.from(container.querySelectorAll("script"));
    scripts.forEach(oldScript => {
      const script = document.createElement("script");
      Array.from(oldScript.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
      script.textContent = oldScript.textContent;
      oldScript.replaceWith(script);
    });
  }

  async function navigate(url, push = true) {
    if (navigating) return;
    const target = new URL(url, location.origin);
    if (target.origin !== location.origin) return;
    navigating = true;
    try {
      const requestPath = target.pathname === "/" ? "/pages/home.html" : target.pathname + target.search;
      const response = await fetch(requestPath, { cache: "default", headers: { "X-TITAN-Navigation": "1" } });
      if (!response.ok) throw new Error("Page could not be loaded (" + response.status + ")");
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const root = document.getElementById(ROOT_ID);
      if (!root) throw new Error("TITAN app container missing");

      addPageAssets(doc);
      root.innerHTML = "";
      const pageRoot = doc.querySelector("#titan-app");
      if (pageRoot) {
        root.innerHTML = pageRoot.innerHTML;
      } else {
        Array.from(doc.body.children).forEach(child => {
          if (child.tagName !== "SCRIPT") root.appendChild(document.importNode(child, true));
        });
      }
      document.title = doc.title || "TITAN AI";
      runPageScripts(root);
      if (push) history.pushState({ titan: true }, "", target.pathname + target.search + target.hash);
      if (target.hash) {
        requestAnimationFrame(() => document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView());
      } else {
        window.scrollTo(0, 0);
        const feed = document.getElementById("shortFeed");
        if (feed) feed.scrollTop = 0;
      }
    } catch (error) {
      console.error("TITAN navigation:", error);
      // Safe fallback only if the in-app fetch fails.
      location.href = target.href;
    } finally {
      navigating = false;
    }
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (!(url.pathname === "/" || url.pathname.startsWith("/pages/"))) return;
    if (url.pathname === location.pathname && url.search === location.search && !url.hash) return;
    event.preventDefault();
    navigate(url.href, true);
  });

  window.addEventListener("popstate", () => navigate(location.href, false));

  // The homepage is rendered into the same shell as every other screen.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => navigate("/", false));
  } else {
    navigate("/", false);
  }
})();