/**
 * PLATFORM: TITAN AI
 * VERSION: v4.7.0 - Premium Dark Theme + Hex Logo + Better Nav
 * FILE: app-extensions-v2.js
 */

(function () {
  "use strict";

  if (window.__TITAN_EXTENSIONS_V47__) return;
  window.__TITAN_EXTENSIONS_V47__ = true;

  console.log("⚡ TITAN AI Ecosystem Active! v4.7");

  const UPLOADS_KEY = "titan_user_uploads";
  const THEME_KEY = "theme_preference";

  const $ = (selector, root = document) => root.querySelector(selector);

  const safeText = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  function safeMediaURL(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value), location.href);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.href;
      }
    } catch (error) {
      console.warn("Invalid media URL:", error);
    }
    return "";
  }

  function readUploads() {
    try {
      const data = JSON.parse(localStorage.getItem(UPLOADS_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function normaliseType(item) {
    return String(item?.type || "video").toLowerCase().trim();
  }

  function isShort(item) {
    const type = normaliseType(item);
    return type === "short" || type === "shorts" || type === "titan short";
  }

  function isLongVideo(item) {
    const type = normaliseType(item);
    return type === "video" || type === "long video" || type === "long";
  }

  function formatViews(value) {
    const count = Math.max(0, Number(value) || 0);
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return String(count);
  }

  /* THEME */
  function applyTheme() {
    let theme = "dark";
    try {
      theme = localStorage.getItem(THEME_KEY) || "dark";
    } catch (e) {}
    document.body.classList.toggle("light-mode", theme === "light");
    document.documentElement.dataset.theme = theme;
  }

  function toggleTheme() {
    const isLight = document.body.classList.contains("light-mode");
    const nextTheme = isLight ? "dark" : "light";
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch (e) {}
    document.body.classList.toggle("light-mode", nextTheme === "light");
    document.documentElement.dataset.theme = nextTheme;
  }

  /* CSS */
  function injectStyles() {
    if ($("#titan-v47-styles")) return;

    const style = document.createElement("style");
    style.id = "titan-v47-styles";

    style.textContent = `
      :root {
        --titan-gold: #f59e0b;
        --titan-gold-light: #fbbf24;
        --titan-blue: #00b2ff;
        --titan-bg: #050507;
        --titan-card: #0d0e12;
        --titan-border: rgba(255,255,255,0.08);
        --titan-text: #f8fafc;
        --titan-muted: #9ca3af;
      }

      body {
        background: var(--titan-bg) !important;
        color: var(--titan-text);
      }

      body.light-mode {
        background: var(--titan-bg) !important;
        color: var(--titan-text);
      }

      #titan-extension-home {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 12px 12px 110px;
        box-sizing: border-box;
      }

      #titan-extension-home *,
      #titan-shorts-viewer * {
        box-sizing: border-box;
      }

      /* HEADER */
      .titan-v46-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }

      .titan-v46-brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .titan-logo-svg {
        width: 38px;
        height: 38px;
        flex-shrink: 0;
      }

      .titan-brand-text {
        font-size: 20px;
        font-weight: 900;
        letter-spacing: -0.5px;
        color: #f8fafc;
      }

      .titan-brand-text span {
        color: var(--titan-gold);
      }

      .titan-v46-header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .titan-v46-icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 1px solid var(--titan-border);
        border-radius: 50%;
        background: var(--titan-card);
        color: var(--titan-text);
        cursor: pointer;
        font-size: 16px;
      }

      /* HERO */
      .titan-v46-hero {
        padding: 26px 20px;
        margin-bottom: 22px;
        border: 1px solid var(--titan-border);
        border-radius: 22px;
        background: radial-gradient(circle at 85% 15%, rgba(245,158,11,.18), transparent 40%), var(--titan-card);
      }

      .titan-v46-badge {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        padding: 7px 14px;
        border-radius: 30px;
        border: 1px solid rgba(245,158,11,.4);
        color: var(--titan-gold);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.8px;
        background: rgba(245,158,11,.08);
      }

      .titan-v46-hero h1 {
        margin: 16px 0 10px;
        font-size: clamp(24px, 6vw, 32px);
        line-height: 1.2;
        font-weight: 900;
        letter-spacing: -0.8px;
      }

      .titan-v46-hero h1 span {
        color: var(--titan-gold);
      }

      .titan-v46-hero p {
        color: var(--titan-muted);
        line-height: 1.65;
        font-size: 14.5px;
      }

      .titan-v46-actions {
        display: flex;
        flex-direction: column;
        gap: 11px;
        margin-top: 20px;
      }

      .titan-v46-button {
        min-height: 48px;
        padding: 12px 18px;
        border-radius: 14px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 15px;
      }

      .titan-v46-button-primary {
        background: var(--titan-gold);
        color: #111;
        border: none;
      }

      .titan-v46-button-secondary {
        background: transparent;
        color: var(--titan-text);
        border: 1px solid var(--titan-border);
      }

      /* CHIPS */
      .titan-v46-chips {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 4px 0 14px;
        -webkit-overflow-scrolling: touch;
      }

      .titan-v46-chip {
        flex-shrink: 0;
        padding: 9px 16px;
        border: 1px solid var(--titan-border);
        border-radius: 30px;
        background: var(--titan-card);
        color: var(--titan-text);
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
      }

      .titan-v46-chip.active {
        color: #111;
        background: var(--titan-gold);
        border-color: var(--titan-gold);
      }

      /* SECTIONS */
      .titan-v46-section {
        margin: 26px 0;
      }

      .titan-v46-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }

      .titan-v46-section-heading h2 {
        margin: 0;
        font-size: 17px;
        font-weight: 900;
      }

      .titan-v46-muted {
        color: var(--titan-muted);
        font-size: 13px;
      }

      /* CARDS */
      .titan-v46-grid,
      .titan-video-feed-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .titan-v46-card,
      .titan-video-card {
        min-width: 0;
        overflow: hidden;
        border: 1px solid var(--titan-border);
        border-radius: 16px;
        background: var(--titan-card);
      }

      .titan-v46-thumb-wrap {
        position: relative;
        aspect-ratio: 16/9;
        overflow: hidden;
        background: #171717;
        cursor: pointer;
      }

      .titan-v46-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .titan-v46-play {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(0,0,0,.7);
        color: #fff;
        display: grid;
        place-items: center;
        pointer-events: none;
      }

      .titan-v46-card-info {
        padding: 11px;
      }

      .titan-v46-card-info h3 {
        margin: 0 0 5px;
        font-size: 13.5px;
        line-height: 1.35;
      }

      .titan-v46-card-info p {
        margin: 0;
        color: var(--titan-muted);
        font-size: 11.5px;
      }

      .titan-v46-empty {
        grid-column: 1 / -1;
        padding: 28px 18px;
        text-align: center;
        color: var(--titan-muted);
        border: 1px dashed var(--titan-border);
        border-radius: 16px;
      }

      /* SHORTS */
      #titan-shorts-viewer {
        display: none;
        position: relative;
        margin: 20px auto;
        max-width: 480px;
        background: #000;
        border-radius: 20px;
        overflow: hidden;
      }

      #titan-shorts-viewer.active {
        display: block;
      }

      .titan-v46-short {
        position: relative;
        min-height: 400px;
        background: #000;
      }

      .titan-v46-short video {
        display: block;
        width: 100%;
        max-height: 75vh;
        object-fit: contain;
        background: #000;
      }

      .titan-v46-short-info {
        padding: 14px;
        color: #fff;
      }

      .titan-v46-short-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .titan-v46-short-actions button {
        min-height: 40px;
        padding: 8px 12px;
        border: 1px solid rgba(255,255,255,.22);
        border-radius: 12px;
        background: rgba(255,255,255,.08);
        color: #fff;
        cursor: pointer;
      }

      /* BOTTOM NAV - Mockup Style */
      .titan-v46-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 8px 6px 18px;
        background: rgba(13, 14, 18, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-top: 1px solid var(--titan-border);
        z-index: 1000;
      }

      .titan-v46-nav-item {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 52px;
        border: 0;
        background: transparent;
        color: var(--titan-muted);
        font-size: 11px;
        cursor: pointer;
        position: relative;
      }

      .titan-v46-nav-item i {
        font-size: 20px;
      }

      .titan-v46-nav-item.active {
        color: var(--titan-gold);
      }

      .titan-v46-nav-item.center-btn {
        position: relative;
        top: -14px;
      }

      .titan-v46-nav-item.center-btn .plus-circle {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: var(--titan-gold);
        color: #111;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        box-shadow: 0 4px 20px rgba(245, 158, 11, 0.5);
      }

      .titan-v46-nav-item.center-btn span {
        display: none;
      }

      @media (max-width: 420px) {
        .titan-v46-grid {
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* VIDEO PLAYBACK */
  function openVideo(url, title) {
    const safeURL = safeMediaURL(url);
    if (!safeURL) {
      alert("Is video ka valid URL nahi mila.");
      return;
    }

    let modal = $("#titan-v46-player-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "titan-v46-player-modal";
      modal.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.94);display:none;align-items:center;justify-content:center;padding:18px;";
      modal.innerHTML = `
        <div style="width:100%;max-width:900px;position:relative;background:#090909;border-radius:16px;overflow:hidden;">
          <button type="button" data-titan-close-player style="position:absolute;right:10px;top:10px;z-index:2;width:42px;height:42px;border:0;border-radius:50%;background:#222;color:white;font-size:22px;cursor:pointer;">×</button>
          <video id="titan-v46-player" controls playsinline preload="metadata" style="display:block;width:100%;max-height:80vh;background:#000;"></video>
          <div id="titan-v46-player-title" style="padding:14px;color:white;font-weight:700"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.closest("[data-titan-close-player]")) closeVideo();
      });
    }

    const player = $("#titan-v46-player", modal);
    player.src = safeURL;
    $("#titan-v46-player-title", modal).textContent = title || "TITAN AI Video";
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    player.play().catch(() => {});
  }

  function closeVideo() {
    const modal = $("#titan-v46-player-modal");
    const player = $("#titan-v46-player");
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "";
  }

  window.playTitanVideo = openVideo;
  window.closeTitanVideo = closeVideo;

  /* FEED */
  function renderLongVideos() {
    const grid = $("#titan-v46-video-grid");
    if (!grid) return;

    const videos = readUploads().filter((item) => isLongVideo(item) && !item.draft);

    if (!videos.length) {
      grid.innerHTML = `
        <div class="titan-v46-empty">
          <i class="fa-solid fa-film" style="font-size:28px;margin-bottom:12px"></i>
          <h3 style="margin:0 0 8px">Abhi koi video nahi</h3>
          <p style="margin:0">Plus button se apni pehli video upload karein.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = videos.map((item) => {
      const title = safeText(item.title || "Untitled Video");
      const videoURL = safeMediaURL(item.url);
      const thumbURL = safeMediaURL(item.thumb || item.thumbnail || item.thumbnailUrl);
      const views = formatViews(item.views);

      let thumbnailMarkup = thumbURL
        ? `<img class="titan-v46-thumb" src="\( {safeText(thumbURL)}" alt=" \){title}" loading="lazy">`
        : `<div style="width:100%;height:100%;display:grid;place-items:center;color:#f59e0b;font-size:36px;background:linear-gradient(135deg,#171717,#292018);"><i class="fa-solid fa-film"></i></div>`;

      return `
        <article class="titan-video-card">
          <div class="titan-v46-thumb-wrap" data-titan-play="\( {safeText(videoURL)}" data-titan-title=" \){title}" role="button" tabindex="0">
            ${thumbnailMarkup}
            <div class="titan-v46-play"><i class="fa-solid fa-play"></i></div>
          </div>
          <div class="titan-v46-card-info">
            <h3>${title}</h3>
            <p><i class="fa-regular fa-eye"></i> ${views} views</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderShorts() {
    const viewer = $("#titan-shorts-viewer");
    if (!viewer) return;

    const shorts = readUploads().filter((item) => isShort(item) && !item.draft);

    if (!shorts.length) {
      viewer.innerHTML = `
        <div class="titan-v46-empty">
          <i class="fa-solid fa-mobile-screen-button" style="font-size:28px"></i>
          <h3>Koi Short abhi upload nahi hui</h3>
          <p>Plus par tap karke apni Short upload karein.</p>
        </div>
      `;
      return;
    }

    viewer.innerHTML = shorts.map((item) => {
      const url = safeMediaURL(item.url);
      const title = safeText(item.title || "Titan Short");
      if (!url) return "";
      return `
        <article class="titan-v46-short">
          <video controls playsinline preload="metadata">
            <source src="${safeText(url)}">
          </video>
          <div class="titan-v46-short-info">
            <strong>${title}</strong>
          </div>
        </article>
      `;
    }).join("");
  }

  window.titanRefreshVideoFeeds = function () {
    renderLongVideos();
    renderShorts();
  };

  /* NAVIGATION */
  function openStudio() {
    if (typeof window.openTitanStudioGemini === "function") {
      window.openTitanStudioGemini();
      return;
    }
    alert("Titan Studio function nahi mila.");
  }

  function openProfile() {
    if (typeof window.openTitanProfile === "function") {
      window.openTitanProfile();
      return;
    }
    alert("Profile system abhi load nahi hua.");
  }

  window.titanOpenUpload = function () {
    if (typeof window.openTitanCreatorCenter === "function") {
      window.openTitanCreatorCenter();
      return;
    }
    alert("Upload system load nahi hua.");
  };

  /* HOME LAYOUT */
  function ensureHomeLayout() {
    if ($("#titan-extension-home")) return;

    const home = document.createElement("section");
    home.id = "titan-extension-home";

    home.innerHTML = `
      <header class="titan-v46-header">
        <div class="titan-v46-brand">
          <svg class="titan-logo-svg" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="titanGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fbbf24"/>
                <stop offset="50%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#d97706"/>
              </linearGradient>
              <linearGradient id="titanBlue" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#06b6d4"/>
              </linearGradient>
              <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <polygon points="50,5 91,28 91,72 50,95 9,72 9,28" stroke="url(#titanGold)" stroke-width="5.5" fill="none" filter="url(#glow)"/>
            <polygon points="50,14 82,32 82,68 50,86 18,68 18,32" stroke="url(#titanBlue)" stroke-width="1.8" fill="none" opacity="0.75"/>
            <text x="50" y="65" text-anchor="middle" font-size="40" font-weight="900" fill="url(#titanGold)" font-family="Arial Black, sans-serif" filter="url(#glow)">T</text>
          </svg>
          <div class="titan-brand-text">TITAN <span>AI</span></div>
        </div>

        <div class="titan-v46-header-actions">
          <button class="titan-v46-icon-button" type="button" data-titan-theme>
            <i class="fa-solid fa-moon"></i>
          </button>
          <button class="titan-v46-icon-button" type="button" data-titan-search>
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </header>

      <section class="titan-v46-hero">
        <div class="titan-v46-badge">
          <i class="fa-solid fa-film"></i>
          TITAN AI CREATOR STUDIO
        </div>
        <h1>CREATE YOUR<br><span>CINEMATIC WORLD</span></h1>
        <p>Apne ideas ko stories, cinematic videos aur creative projects mein badlein.</p>
        <div class="titan-v46-actions">
          <button type="button" class="titan-v46-button titan-v46-button-primary" data-titan-open-studio>
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Launch Titan Studio
          </button>
          <button type="button" class="titan-v46-button titan-v46-button-secondary" data-titan-open-upload>
            <i class="fa-solid fa-cloud-arrow-up"></i>
            Upload Video
          </button>
        </div>
      </section>

      <div class="titan-v46-chips">
        <button class="titan-v46-chip active" type="button" data-titan-category="all">All</button>
        <button class="titan-v46-chip" type="button" data-titan-category="video">AI Movies</button>
        <button class="titan-v46-chip" type="button" data-titan-category="short">Titan Shorts</button>
        <button class="titan-v46-chip" type="button" data-titan-category="music">Sufi Music</button>
      </div>

      <section class="titan-v46-section" id="titan-v46-long-section">
        <div class="titan-v46-section-heading">
          <h2><i class="fa-solid fa-film" style="color:var(--titan-gold)"></i> Latest Videos</h2>
          <span class="titan-v46-muted">TITAN FEED</span>
        </div>
        <div id="titan-v46-video-grid" class="titan-v46-grid titan-video-feed-grid"></div>
      </section>

      <section class="titan-v46-section" id="titan-v46-shorts-section">
        <div class="titan-v46-section-heading">
          <h2><i class="fa-solid fa-mobile-screen-button" style="color:var(--titan-gold)"></i> Titan Shorts</h2>
        </div>
        <div id="titan-shorts-viewer"></div>
      </section>

      <nav class="titan-v46-bottom-nav">
        <button type="button" class="titan-v46-nav-item active" data-titan-nav="home">
          <i class="fa-solid fa-house"></i>
          <span>Home</span>
        </button>
        <button type="button" class="titan-v46-nav-item" data-titan-nav="shorts">
          <i class="fa-solid fa-bolt"></i>
          <span>Shorts</span>
        </button>
        <button type="button" class="titan-v46-nav-item center-btn" data-titan-nav="plus">
          <div class="plus-circle"><i class="fa-solid fa-plus"></i></div>
        </button>
        <button type="button" class="titan-v46-nav-item" data-titan-nav="studio">
          <i class="fa-solid fa-clapperboard"></i>
          <span>Studio</span>
        </button>
        <button type="button" class="titan-v46-nav-item" data-titan-nav="profile">
          <i class="fa-solid fa-user"></i>
          <span>Profile</span>
        </button>
      </nav>
    `;

    const target = $("#homePage, #home-page, main, #app") || document.body;
    target.appendChild(home);
  }

  /* CLICK HANDLERS */
  document.addEventListener("click", async (event) => {
    if (event.target.closest("[data-titan-theme]")) {
      toggleTheme();
      return;
    }

    const playTarget = event.target.closest("[data-titan-play]");
    if (playTarget) {
      openVideo(playTarget.getAttribute("data-titan-play"), playTarget.getAttribute("data-titan-title"));
      return;
    }

    if (event.target.closest("[data-titan-open-studio]")) {
      openStudio();
      return;
    }

    if (event.target.closest("[data-titan-open-upload]")) {
      window.titanOpenUpload();
      return;
    }

    const navButton = event.target.closest("[data-titan-nav]");
    if (navButton) {
      const nav = navButton.getAttribute("data-titan-nav");
      document.querySelectorAll("[data-titan-nav]").forEach((btn) => {
        btn.classList.toggle("active", btn === navButton);
      });

      if (nav === "home") $("#titan-v46-long-section")?.scrollIntoView({ behavior: "smooth" });
      if (nav === "shorts") $("#titan-v46-shorts-section")?.scrollIntoView({ behavior: "smooth" });
      if (nav === "plus") window.titanOpenUpload();
      if (nav === "studio") openStudio();
      if (nav === "profile") openProfile();
      return;
    }

    const categoryButton = event.target.closest("[data-titan-category]");
    if (categoryButton) {
      document.querySelectorAll("[data-titan-category]").forEach((btn) => {
        btn.classList.toggle("active", btn === categoryButton);
      });
    }
  });

  /* INIT */
  function initTitanExtensions() {
    applyTheme();
    injectStyles();
    ensureHomeLayout();
    window.titanRefreshVideoFeeds();
    console.log("✅ TITAN AI v4.7.0 initialized with Hex Logo + Premium Nav");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTitanExtensions, { once: true });
  } else {
    initTitanExtensions();
  }

})();
