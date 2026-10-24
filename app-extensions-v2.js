/**
 * PLATFORM: TITAN AI
 * VERSION: v4.8.0 - YouTube Style Feed (No Hero Card)
 * FILE: app-extensions-v2.js
 */

(function () {
  "use strict";

  if (window.__TITAN_EXTENSIONS_V48__) return;
  window.__TITAN_EXTENSIONS_V48__ = true;

  console.log("⚡ TITAN AI Ecosystem Active! v4.8 - YouTube Style");

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
    } catch (error) {}
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
    if ($("#titan-v48-styles")) return;

    const style = document.createElement("style");
    style.id = "titan-v48-styles";

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

      #titan-extension-home * {
        box-sizing: border-box;
      }

      /* HEADER */
      .titan-v46-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }

      .titan-v46-brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .titan-logo-svg {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
      }

      .titan-brand-text {
        font-size: 19px;
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

      /* CHIPS */
      .titan-v46-chips {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 4px 0 16px;
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
        margin: 24px 0;
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
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .titan-v46-muted {
        color: var(--titan-muted);
        font-size: 13px;
      }

      /* CARDS GRID */
      .titan-v46-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .titan-video-card {
        min-width: 0;
        overflow: hidden;
        border: 1px solid var(--titan-border);
        border-radius: 14px;
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
        padding: 10px;
      }

      .titan-v46-card-info h3 {
        margin: 0 0 4px;
        font-size: 13.5px;
        line-height: 1.35;
        font-weight: 600;
      }

      .titan-v46-card-info p {
        margin: 0;
        color: var(--titan-muted);
        font-size: 11.5px;
      }

      .titan-v46-empty {
        grid-column: 1 / -1;
        padding: 30px 18px;
        text-align: center;
        color: var(--titan-muted);
        border: 1px dashed var(--titan-border);
        border-radius: 14px;
      }

      /* BOTTOM NAV */
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

  /* RENDER VIDEOS */
  function renderVideoGrid(containerId, videos) {
    const grid = $(containerId);
    if (!grid) return;

    if (!videos.length) {
      grid.innerHTML = `
        <div class="titan-v46-empty">
          <i class="fa-solid fa-film" style="font-size:28px;margin-bottom:10px"></i>
          <div>Abhi koi video nahi</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = videos.map((item) => {
      const title = safeText(item.title || "Untitled");
      const videoURL = safeMediaURL(item.url);
      const thumbURL = safeMediaURL(item.thumb || item.thumbnail || item.thumbnailUrl);
      const views = formatViews(item.views);

      const thumb = thumbURL
        ? `<img class="titan-v46-thumb" src="\( {safeText(thumbURL)}" alt=" \){title}" loading="lazy">`
        : `<div style="width:100%;height:100%;display:grid;place-items:center;color:#f59e0b;font-size:32px;background:#171717;"><i class="fa-solid fa-film"></i></div>`;

      return `
        <article class="titan-video-card">
          <div class="titan-v46-thumb-wrap" data-titan-play="\( {safeText(videoURL)}" data-titan-title=" \){title}">
            ${thumb}
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

  function renderAllFeeds() {
    const allVideos = readUploads().filter((item) => isLongVideo(item) && !item.draft);

    // Trending (first 4)
    renderVideoGrid("#titan-trending-grid", allVideos.slice(0, 4));

    // Recommended (next 4)
    renderVideoGrid("#titan-recommended-grid", allVideos.slice(4, 8));

    // Latest
    renderVideoGrid("#titan-v46-video-grid", allVideos);
  }

  window.titanRefreshVideoFeeds = renderAllFeeds;

  /* NAVIGATION */
  function openStudio() {
    if (typeof window.openTitanStudioGemini === "function") {
      window.openTitanStudioGemini();
    } else {
      alert("Titan Studio abhi available nahi hai.");
    }
  }

  function openProfile() {
    if (typeof window.openTitanProfile === "function") {
      window.openTitanProfile();
    } else {
      alert("Profile system abhi load nahi hua.");
    }
  }

  window.titanOpenUpload = function () {
    if (typeof window.openTitanCreatorCenter === "function") {
      window.openTitanCreatorCenter();
    } else {
      alert("Upload system load nahi hua.");
    }
  };

  /* HOME LAYOUT - YouTube Style (No Hero) */
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
