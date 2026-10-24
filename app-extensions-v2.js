/**
 * PLATFORM: TITAN AI
 * VERSION: v4.9.0 - Safe YouTube Style Feed
 * FILE: app-extensions-v2.js
 */

(function () {
  "use strict";

  if (window.__TITAN_EXTENSIONS_V49__) return;
  window.__TITAN_EXTENSIONS_V49__ = true;

  console.log("⚡ TITAN AI v4.9.0 - Safe Mode Active");

  const UPLOADS_KEY = "titan_user_uploads";
  const THEME_KEY = "theme_preference";

  const $ = (selector, root = document) => root.querySelector(selector);

  const safeText = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  function safeMediaURL(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value), location.href);
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
    } catch (e) {}
    return "";
  }

  function readUploads() {
    try {
      const data = JSON.parse(localStorage.getItem(UPLOADS_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function isLongVideo(item) {
    const type = String(item?.type || "video").toLowerCase();
    return type === "video" || type === "long video" || type === "long";
  }

  function formatViews(value) {
    const count = Math.max(0, Number(value) || 0);
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return String(count);
  }

  /* ========== THEME ========== */
  function applyTheme() {
    try {
      const theme = localStorage.getItem(THEME_KEY) || "dark";
      document.body.classList.toggle("light-mode", theme === "light");
    } catch (e) {}
  }

  function toggleTheme() {
    try {
      const isLight = document.body.classList.contains("light-mode");
      const next = isLight ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      document.body.classList.toggle("light-mode", next === "light");
    } catch (e) {}
  }

  /* ========== CSS ========== */
  function injectStyles() {
    if ($("#titan-v49-styles")) return;

    const style = document.createElement("style");
    style.id = "titan-v49-styles";
    style.textContent = `
      :root {
        --titan-gold: #f59e0b;
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

      #titan-extension-home {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 12px 12px 110px;
        box-sizing: border-box;
      }

      #titan-extension-home * { box-sizing: border-box; }

      .titan-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .titan-brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .titan-logo-svg {
        width: 36px;
        height: 36px;
      }

      .titan-brand-text {
        font-size: 19px;
        font-weight: 900;
        color: #f8fafc;
      }

      .titan-brand-text span {
        color: var(--titan-gold);
      }

      .titan-icon-btn {
        width: 40px;
        height: 40px;
        border: 1px solid var(--titan-border);
        border-radius: 50%;
        background: var(--titan-card);
        color: var(--titan-text);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
      }

      .titan-chips {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 16px;
      }

      .titan-chip {
        flex-shrink: 0;
        padding: 8px 16px;
        border: 1px solid var(--titan-border);
        border-radius: 30px;
        background: var(--titan-card);
        color: var(--titan-text);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .titan-chip.active {
        background: var(--titan-gold);
        color: #111;
        border-color: var(--titan-gold);
      }

      .titan-section {
        margin: 22px 0;
      }

      .titan-section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 800;
      }

      .titan-section-title span {
        color: var(--titan-muted);
        font-size: 13px;
        font-weight: 500;
      }

      .titan-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .titan-card {
        background: var(--titan-card);
        border: 1px solid var(--titan-border);
        border-radius: 14px;
        overflow: hidden;
      }

      .titan-thumb {
        position: relative;
        aspect-ratio: 16/9;
        background: #171717;
        cursor: pointer;
      }

      .titan-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .titan-play {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: rgba(0,0,0,0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        pointer-events: none;
      }

      .titan-card-info {
        padding: 10px;
      }

      .titan-card-info h3 {
        margin: 0 0 4px;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.3;
      }

      .titan-card-info p {
        margin: 0;
        font-size: 11px;
        color: var(--titan-muted);
      }

      .titan-empty {
        grid-column: 1 / -1;
        text-align: center;
        padding: 30px 15px;
        color: var(--titan-muted);
        border: 1px dashed var(--titan-border);
        border-radius: 14px;
      }

      /* Bottom Nav */
      .titan-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 8px 6px 18px;
        background: rgba(13,14,18,0.96);
        backdrop-filter: blur(14px);
        border-top: 1px solid var(--titan-border);
        z-index: 999;
      }

      .titan-nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        background: none;
        border: none;
        color: var(--titan-muted);
        font-size: 11px;
        cursor: pointer;
        min-height: 50px;
        justify-content: center;
      }

      .titan-nav-item i {
        font-size: 20px;
      }

      .titan-nav-item.active {
        color: var(--titan-gold);
      }

      .titan-nav-item.center {
        position: relative;
        top: -12px;
      }

      .titan-plus {
        width: 52px;
        height: 52px;
        background: var(--titan-gold);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #111;
        font-size: 24px;
        box-shadow: 0 4px 18px rgba(245,158,11,0.45);
      }
    `;
    document.head.appendChild(style);
  }

  /* ========== VIDEO PLAYER ========== */
  function openVideo(url, title) {
    const safeURL = safeMediaURL(url);
    if (!safeURL) {
      alert("Video URL valid nahi hai");
      return;
    }

    let modal = $("#titan-player-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "titan-player-modal";
      modal.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;padding:16px;";
      modal.innerHTML = `
        <div style="width:100%;max-width:900px;position:relative;background:#111;border-radius:12px;overflow:hidden;">
          <button id="titan-close-player" style="position:absolute;right:10px;top:10px;z-index:2;width:40px;height:40px;border:0;border-radius:50%;background:#333;color:white;font-size:20px;cursor:pointer;">×</button>
          <video id="titan-player" controls playsinline style="width:100%;max-height:75vh;background:#000;display:block;"></video>
          <div id="titan-player-title" style="padding:12px;color:white;font-weight:600;"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.id === "titan-close-player") {
          closeVideo();
        }
      });
    }

    const player = $("#titan-player");
    player.src = safeURL;
    $("#titan-player-title").textContent = title || "TITAN AI Video";
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    player.play().catch(() => {});
  }

  function closeVideo() {
    const modal = $("#titan-player-modal");
    const player = $("#titan-player");
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "";
  }

  /* ========== RENDER VIDEOS ========== */
  function renderGrid(id, videos) {
    const grid = $(id);
    if (!grid) return;

    if (!videos || videos.length === 0) {
      grid.innerHTML = `<div class="titan-empty">Abhi koi video nahi hai</div>`;
      return;
    }

    grid.innerHTML = videos.map((item) => {
      const title = safeText(item.title || "Untitled");
      const url = safeMediaURL(item.url);
      const thumb = safeMediaURL(item.thumb || item.thumbnail || item.thumbnailUrl);
      const views = formatViews(item.views);

      const thumbHTML = thumb
        ? `<img src="\( {safeText(thumb)}" alt=" \){title}" loading="lazy">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#f59e0b;font-size:28px;"><i class="fa-solid fa-film"></i></div>`;

      return `
        <div class="titan-card">
          <div class="titan-thumb" data-play="\( {safeText(url)}" data-title=" \){title}">
            ${thumbHTML}
            <div class="titan-play"><i class="fa-solid fa-play"></i></div>
          </div>
          <div class="titan-card-info">
            <h3>${title}</h3>
            <p><i class="fa-regular fa-eye"></i> ${views} views</p>
          </div>
        </div>
      `;
    }).join("");
  }

  function refreshFeeds() {
    const videos = readUploads().filter(isLongVideo);
    renderGrid("#titan-trending", videos.slice(0, 4));
    renderGrid("#titan-recommended", videos.slice(4, 8));
    renderGrid("#titan-latest", videos);
  }

  window.titanRefreshVideoFeeds = refreshFeeds;

  /* ========== HOME LAYOUT ========== */
  function createHome() {
    // Pehle purana hata do
    const old = $("#titan-extension-home");
    if (old) old.remove();

    const home = document.createElement("section");
    home.id = "titan-extension-home";

    home.innerHTML = `
      <div class="titan-header">
        <div class="titan-brand">
          <svg class="titan-logo-svg" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fbbf24"/>
                <stop offset="100%" stop-color="#f59e0b"/>
              </linearGradient>
              <filter id="g">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" stroke="url(#tg)" stroke-width="6" fill="none" filter="url(#g)"/>
            <text x="50" y="64" text-anchor="middle" font-size="38" font-weight="900" fill="url(#tg)" font-family="Arial Black" filter="url(#g)">T</text>
          </svg>
          <div class="titan-brand-text">TITAN <span>AI</span></div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="titan-icon-btn" data-theme><i class="fa-solid fa-moon"></i></button>
          <button class="titan-icon-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
      </div>

      <div class="titan-chips">
        <button class="titan-chip active">All</button>
        <button class="titan-chip">AI Movies</button>
        <button class="titan-chip">Shorts</button>
        <button class="titan-chip">Gaming</button>
        <button class="titan-chip">Music</button>
      </div>

      <div class="titan-section">
        <div class="titan-section-title">
          <div><i class="fa-solid fa-fire" style="color:var(--titan-gold)"></i> Trending Now</div>
          <span>See All</span>
        </div>
        <div class="titan-grid" id="titan-trending"></div>
      </div>

      <div class="titan-section">
        <div class="titan-section-title">
          <div><i class="fa-solid fa-star" style="color:var(--titan-gold)"></i> Recommended For You</div>
          <span>See All</span>
        </div>
        <div class="titan-grid" id="titan-recommended"></div>
      </div>

      <div class="titan-section">
        <div class="titan-section-title">
          <div><i class="fa-solid fa-users" style="color:var(--titan-gold)"></i> Latest from Creators</div>
          <span>TITAN FEED</span>
        </div>
        <div class="titan-grid" id="titan-latest"></div>
      </div>

      <nav class="titan-bottom-nav">
        <button class="titan-nav-item active" data-nav="home">
          <i class="fa-solid fa-house"></i>
          <span>Home</span>
        </button>
        <button class="titan-nav-item" data-nav="shorts">
          <i class="fa-solid fa-bolt"></i>
          <span>Shorts</span>
        </button>
        <button class="titan-nav-item center" data-nav="plus">
          <div class="titan-plus"><i class="fa-solid fa-plus"></i></div>
        </button>
        <button class="titan-nav-item" data-nav="studio">
          <i class="fa-solid fa-clapperboard"></i>
          <span>Studio</span>
        </button>
        <button class="titan-nav-item" data-nav="profile">
          <i class="fa-solid fa-user"></i>
          <span>Profile</span>
        </button>
      </nav>
    `;

    const target = document.querySelector(".features-section") || document.body;
    target.appendChild(home);
  }

  /* ========== EVENTS ========== */
  document.addEventListener("click", (e) => {
    // Theme
    if (e.target.closest("[data-theme]")) {
      toggleTheme();
      return;
    }

    // Play video
    const playBtn = e.target.closest("[data-play]");
    if (playBtn) {
      openVideo(playBtn.getAttribute("data-play"), playBtn.getAttribute("data-title"));
      return;
    }

    // Navigation
    const navBtn = e.target.closest("[data-nav]");
    if (navBtn) {
      const nav = navBtn.getAttribute("data-nav");

      document.querySelectorAll("[data-nav]").forEach((btn) => {
        btn.classList.toggle("active", btn === navBtn);
      });

      if (nav === "plus") {
        if (typeof window.titanOpenUpload === "function") window.titanOpenUpload();
        else if (typeof window.openTitanCreatorCenter === "function") window.openTitanCreatorCenter();
        else alert("Upload system abhi ready nahi hai");
      }

      if (nav === "studio") {
        if (typeof window.openTitanStudioGemini === "function") window.openTitanStudioGemini();
        else alert("Studio abhi ready nahi hai");
      }

      if (nav === "profile") {
        if (typeof window.openTitanProfile === "function") window.openTitanProfile();
        else alert("Profile abhi ready nahi hai");
      }
    }
  });

  /* ========== INIT ========== */
  function init() {
    try {
      applyTheme();
      injectStyles();
      createHome();
      refreshFeeds();
      console.log("✅ TITAN AI v4.9.0 Safe Mode Ready");
    } catch (err) {
      console.error("TITAN AI Init Error:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
