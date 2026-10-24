/**
 * PLATFORM: TITAN AI
 * VERSION: v5.0.0 - Safe Creator Video Feed
 * FILE: app-extensions-v2.js
 */

(function () {
  "use strict";

  if (window.__TITAN_EXTENSIONS_V50__) return;
  window.__TITAN_EXTENSIONS_V50__ = true;

  console.log("TITAN AI v5.0.0 Active");

  const UPLOADS_KEY = "titan_user_uploads";
  const THEME_KEY = "theme_preference";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const safeText = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);

  function safeMediaURL(value) {
    if (!value) return "";

    try {
      const url = new URL(String(value), location.href);

      if (
        url.protocol === "https:" ||
        url.protocol === "http:"
      ) {
        return url.href;
      }
    } catch (error) {}

    return "";
  }

  function readUploads() {
    try {
      const data = JSON.parse(
        localStorage.getItem(UPLOADS_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function isShort(item) {
    const type = String(item?.type || "").toLowerCase();

    return (
      type === "short" ||
      type === "shorts" ||
      type === "titan short"
    );
  }

  function isLongVideo(item) {
    const type = String(item?.type || "video").toLowerCase();

    return (
      type === "video" ||
      type === "long video" ||
      type === "long"
    );
  }

  function formatViews(value) {
    const count = Math.max(0, Number(value) || 0);

    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }

    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }

    return String(count);
  }

  function formatDate(value) {
    if (!value) return "TITAN AI";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "TITAN AI";
    }

    const difference = Math.max(
      0,
      Date.now() - date.getTime()
    );

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return minutes + " min ago";
    if (hours < 24) return hours + " hours ago";
    if (days < 30) return days + " days ago";

    return date.toLocaleDateString();
  }

  /* ================= THEME ================= */

  function applyTheme() {
    try {
      const theme =
        localStorage.getItem(THEME_KEY) || "dark";

      document.body.classList.toggle(
        "light-mode",
        theme === "light"
      );
    } catch (error) {}
  }

  function toggleTheme() {
    try {
      const isLight =
        document.body.classList.contains("light-mode");

      const next = isLight ? "dark" : "light";

      localStorage.setItem(THEME_KEY, next);

      document.body.classList.toggle(
        "light-mode",
        next === "light"
      );
    } catch (error) {}
  }

  /* ================= STYLES ================= */

  function injectStyles() {
    if ($("#titan-v50-styles")) return;

    const style = document.createElement("style");

    style.id = "titan-v50-styles";

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

      body.light-mode {
        --titan-bg: #f8fafc;
        --titan-card: #ffffff;
        --titan-border: rgba(0,0,0,0.10);
        --titan-text: #111827;
        --titan-muted: #64748b;
      }

      #titan-extension-home {
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        padding: 12px 12px 110px;
        box-sizing: border-box;
        color: var(--titan-text);
      }

      #titan-extension-home * {
        box-sizing: border-box;
      }

      .titan-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        gap: 10px;
      }

      .titan-brand {
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
        font-size: 19px;
        font-weight: 900;
        color: var(--titan-text);
      }

      .titan-brand-text span {
        color: var(--titan-gold);
      }

      .titan-header-actions {
        display: flex;
        gap: 8px;
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
        scrollbar-width: none;
      }

      .titan-chips::-webkit-scrollbar {
        display: none;
      }

      .titan-chip {
        flex-shrink: 0;
        padding: 9px 16px;
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
        color: #111111;
        border-color: var(--titan-gold);
      }

      .titan-section {
        margin: 22px 0;
      }

      .titan-section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 800;
      }

      .titan-section-title span {
        color: var(--titan-muted);
        font-size: 12px;
        font-weight: 500;
      }

      .titan-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .titan-card {
        min-width: 0;
        background: var(--titan-card);
        border: 1px solid var(--titan-border);
        border-radius: 14px;
        overflow: hidden;
      }

      .titan-thumb {
        position: relative;
        aspect-ratio: 16 / 9;
        background: #171717;
        cursor: pointer;
        overflow: hidden;
      }

      .titan-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.25s ease;
      }

      .titan-card:hover .titan-thumb img {
        transform: scale(1.03);
      }

      .titan-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--titan-gold);
        font-size: 30px;
        background: linear-gradient(135deg,#171717,#252525);
      }

      .titan-play {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 42px;
        height: 42px;
        background: rgba(0,0,0,0.72);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        pointer-events: none;
      }

      .titan-duration {
        position: absolute;
        bottom: 6px;
        right: 6px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 10px;
      }

      .titan-card-info {
        padding: 10px;
      }

      .titan-card-info h3 {
        margin: 0 0 6px;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.4;
        overflow-wrap: anywhere;
        color: var(--titan-text);
      }

      .titan-card-info p {
        margin: 0;
        font-size: 11px;
        color: var(--titan-muted);
        line-height: 1.5;
      }

      .titan-empty {
        grid-column: 1 / -1;
        text-align: center;
        padding: 30px 15px;
        color: var(--titan-muted);
        border: 1px dashed var(--titan-border);
        border-radius: 14px;
        font-size: 13px;
      }

      .titan-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 8px 6px 18px;
        background: var(--titan-card);
        background: color-mix(in srgb, var(--titan-card) 96%, transparent);
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
        top: -8px;
      }

      .titan-plus {
        width: 50px;
        height: 50px;
        background: var(--titan-gold);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #111111;
        font-size: 23px;
        box-shadow: 0 4px 18px rgba(245,158,11,0.35);
      }

      #titan-player-modal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0,0,0,0.96);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }

      .titan-player-box {
        width: 100%;
        max-width: 900px;
        position: relative;
        background: #111111;
        border-radius: 12px;
        overflow: hidden;
      }

      .titan-player-close {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 2;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: #333333;
        color: white;
        font-size: 22px;
        cursor: pointer;
      }

      .titan-player-video {
        width: 100%;
        max-height: 75vh;
        background: #000000;
        display: block;
      }

      .titan-player-title {
        padding: 12px;
        color: #ffffff;
        font-weight: 600;
        overflow-wrap: anywhere;
      }

      @media (max-width: 360px) {
        #titan-extension-home {
          padding-left: 8px;
          padding-right: 8px;
        }

        .titan-grid {
          gap: 8px;
        }

        .titan-card-info {
          padding: 8px;
        }

        .titan-brand-text {
          font-size: 17px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ================= VIDEO PLAYER ================= */

  function openVideo(url, title) {
    const safeURL = safeMediaURL(url);

    if (!safeURL) {
      alert("Video URL valid nahi hai.");
      return;
    }

    let modal = $("#titan-player-modal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "titan-player-modal";

      modal.innerHTML = `
        <div class="titan-player-box">
          <button
            class="titan-player-close"
            id="titan-close-player"
            aria-label="Close video"
          >×</button>

          <video
            id="titan-player"
            class="titan-player-video"
            controls
            playsinline
            preload="metadata"
          ></video>

          <div
            id="titan-player-title"
            class="titan-player-title"
          ></div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.addEventListener("click", function (event) {
        if (
          event.target === modal ||
          event.target.id === "titan-close-player"
        ) {
          closeVideo();
        }
      });
    }

    const player = $("#titan-player");

    if (!player) return;

    player.src = safeURL;
    $("#titan-player-title").textContent =
      title || "TITAN AI Video";

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    player.play().catch(function () {
      // Kuch mobile browsers mein user ko Play dabana hota hai.
    });
  }

  function closeVideo() {
    const modal = $("#titan-player-modal");
    const player = $("#titan-player");

    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }

    if (modal) {
      modal.style.display = "none";
    }

    document.body.style.overflow = "";
  }

  window.playTitanFeedVideo = openVideo;
  window.closeTitanFeedVideo = closeVideo;

  /* ================= VIDEO CARDS ================= */

  function renderGrid(id, videos) {
    const grid = $(id);

    if (!grid) return;

    const validVideos = (Array.isArray(videos) ? videos : [])
      .filter(function (item) {
        return item && safeMediaURL(item.url);
      });

    if (validVideos.length === 0) {
      grid.innerHTML = `
        <div class="titan-empty">
          <i class="fa-solid fa-film"></i>
          <br><br>
          Abhi koi video nahi hai.
          <br>
          Apni pehli video upload karein!
        </div>
      `;
      return;
    }

    grid.innerHTML = validVideos.map(function (item) {
      const title = safeText(item.title || "Untitled Video");
      const url = safeMediaURL(item.url);

      const thumb = safeMediaURL(
        item.thumb ||
        item.thumbnail ||
        item.thumbnailUrl
      );

      const views = formatViews(item.views);
      const date = safeText(formatDate(item.createdAt));

      const thumbnailHTML = thumb
        ? `
          <img
            src="${safeText(thumb)}"
            alt="${title}"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
          >
          <div class="titan-placeholder" style="display:none;">
            <i class="fa-solid fa-film"></i>
          </div>
        `
        : `
          <div class="titan-placeholder">
            <i class="fa-solid fa-film"></i>
          </div>
        `;

      return `
        <article class="titan-card">
          <div
            class="titan-thumb"
            data-play="${safeText(url)}"
            data-title="${title}"
            role="button"
            tabindex="0"
            aria-label="Play ${title}"
          >
            ${thumbnailHTML}

            <div class="titan-play">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>

          <div class="titan-card-info">
            <h3>${title}</h3>
            <p>
              <i class="fa-regular fa-eye"></i>
              ${views} views
              &nbsp;·&nbsp;
              ${date}
            </p>
          </div>
        </article>
      `;
    }).join("");
  }

  /* ================= FEEDS ================= */

  function refreshFeeds() {
    const uploads = readUploads().filter(function (item) {
      return item && item.draft !== true;
    });

    const longVideos = uploads.filter(isLongVideo);
    const shorts = uploads.filter(isShort);

    // Latest uploads first
    longVideos.sort(function (a, b) {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

    shorts.sort(function (a, b) {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

    renderGrid(
      "#titan-trending",
      longVideos.slice(0, 4)
    );

    renderGrid(
      "#titan-recommended",
      longVideos.slice(4, 8)
    );

    renderGrid(
      "#titan-latest",
      longVideos
    );

    renderGrid(
      "#titan-shorts-grid",
      shorts
    );
  }

  window.titanRefreshVideoFeeds = refreshFeeds;

  /* ================= HOME LAYOUT ================= */

  function createHome() {
    const old = $("#titan-extension-home");

    if (old) old.remove();

    const home = document.createElement("section");
    home.id = "titan-extension-home";

    home.innerHTML = `
      <header class="titan-header">
        <div class="titan-brand">
          <svg
            class="titan-logo-svg"
            viewBox="0 0 100 100"
            fill="none"
            aria-label="TITAN AI Logo"
          >
            <defs>
              <linearGradient
                id="titan-gold-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#fbbf24"/>
                <stop offset="100%" stop-color="#f59e0b"/>
              </linearGradient>
            </defs>

            <polygon
              points="50,6 90,28 90,72 50,94 10,72 10,28"
              stroke="url(#titan-gold-gradient)"
              stroke-width="6"
              fill="none"
            />

            <text
              x="50"
              y="64"
              text-anchor="middle"
              font-size="38"
              font-weight="900"
              fill="url(#titan-gold-gradient)"
              font-family="Arial Black, Arial, sans-serif"
            >T</text>
          </svg>

          <div class="titan-brand-text">
            TITAN <span>AI</span>
          </div>
        </div>

        <div class="titan-header-actions">
          <button
            class="titan-icon-btn"
            data-theme
            aria-label="Change theme"
          >
            <i class="fa-solid fa-moon"></i>
          </button>

          <button
            class="titan-icon-btn"
            data-search
            aria-label="Search videos"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </header>

      <div class="titan-chips">
        <button class="titan-chip active" data-filter="all">
          All
        </button>

        <button class="titan-chip" data-filter="movies">
          AI Movies
        </button>

        <button class="titan-chip" data-filter="shorts">
          Shorts
        </button>

        <button class="titan-chip" data-filter="gaming">
          Gaming
        </button>

        <button class="titan-chip" data-filter="music">
          Music
        </button>
      </div>

      <div class="titan-section" data-feed-section="trending">
        <div class="titan-section-title">
          <div>
            <i class="fa-solid fa-fire" style="color:var(--titan-gold)"></i>
            Trending Now
          </div>
          <span>TITAN FEED</span>
        </div>

        <div class="titan-grid" id="titan-trending"></div>
      </div>

      <div class="titan-section" data-feed-section="recommended">
        <div class="titan-section-title">
          <div>
            <i class="fa-solid fa-star" style="color:var(--titan-gold)"></i>
            Recommended For You
          </div>
          <span>FOR YOU</span>
        </div>

        <div class="titan-grid" id="titan-recommended"></div>
      </div>

      <div class="titan-section" data-feed-section="latest">
        <div class="titan-section-title">
          <div>
            <i class="fa-solid fa-users" style="color:var(--titan-gold)"></i>
            Latest from Creators
          </div>
          <span>NEW VIDEOS</span>
        </div>

        <div class="titan-grid" id="titan-latest"></div>
      </div>

      <div
        class="titan-section"
        id="titan-shorts-section"
        data-feed-section="shorts"
        hidden
      >
        <div class="titan-section-title">
          <div>
            <i class="fa-solid fa-bolt" style="color:var(--titan-gold)"></i>
            TITAN Shorts
          </div>
          <span>SHORT VIDEOS</span>
        </div>

        <div class="titan-grid" id="titan-shorts-grid"></div>
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
          <div class="titan-plus">
            <i class="fa-solid fa-plus"></i>
          </div>
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

    const target =
      document.querySelector(".features-section") ||
      document.body;

    target.appendChild(home);
  }

  /* ================= FILTERS ================= */

  function showFeed(filter) {
    const sections = document.querySelectorAll(
      "#titan-extension-home [data-feed-section]"
    );

    sections.forEach(function (section) {
      const type = section.getAttribute("data-feed-section");

      if (filter === "shorts") {
        section.hidden = type !== "shorts";
      } else {
        section.hidden = type === "shorts";

        if (
          filter === "movies" ||
          filter === "gaming" ||
          filter === "music"
        ) {
          // Category metadata is not consistently stored yet.
          // Keep all long videos visible until category filtering
          // is connected to the upload form's category field.
        }
      }
    });

    document.querySelectorAll(
      "#titan-extension-home [data-filter]"
    ).forEach(function (button) {
      button.classList.toggle(
        "active",
        button.getAttribute("data-filter") === filter
      );
    });
  }

  /* ================= EVENTS ================= */

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    // Theme
    if (target.closest("[data-theme]")) {
      toggleTheme();
      return;
    }

    // Search
    if (target.closest("[data-search]")) {
      const query = prompt("Kis video ko search karna hai?");

      if (query && query.trim()) {
        const allUploads = readUploads().filter(function (item) {
          return item && item.draft !== true;
        });

        const results = allUploads.filter(function (item) {
          return String(item.title || "")
            .toLowerCase()
            .includes(query.trim().toLowerCase());
        });

        const longResults = results.filter(isLongVideo);
        const shortResults = results.filter(isShort);

        renderGrid(
          "#titan-trending",
          longResults
        );

        renderGrid(
          "#titan-recommended",
          []
        );

        renderGrid(
          "#titan-latest",
          shortResults
        );

        const title = $("#titan-extension-home .titan-section-title");

        if (title) {
          title.scrollIntoView({ behavior: "smooth" });
        }
      }

      return;
    }

    // Category filters
    const filterButton = target.closest("[data-filter]");

    if (filterButton) {
      const filter = filterButton.getAttribute("data-filter");

      showFeed(filter);
      refreshFeeds();

      if (filter === "shorts") {
        showFeed("shorts");
      }

      return;
    }

    // Video player
    const playButton = target.closest("[data-play]");

    if (playButton) {
      openVideo(
        playButton.getAttribute("data-play"),
        playButton.getAttribute("data-title")
      );

      return;
    }

    // Navigation
    const navButton = target.closest("[data-nav]");

    if (navButton) {
      const nav = navButton.getAttribute("data-nav");

      document.querySelectorAll(
        "#titan-extension-home [data-nav]"
      ).forEach(function (button) {
        button.classList.toggle(
          "active",
          button === navButton
        );
      });

      if (nav === "home") {
        showFeed("all");
        refreshFeeds();
      }

      if (nav === "shorts") {
        refreshFeeds();
        showFeed("shorts");
      }

      if (nav === "plus") {
        if (typeof window.titanOpenUpload === "function") {
          window.titanOpenUpload();
        } else if (
          typeof window.openTitanCreatorCenter === "function"
        ) {
          window.openTitanCreatorCenter();
        } else if (
          typeof window.openTitanUploadStudio === "function"
        ) {
          window.openTitanUploadStudio();
        } else {
          alert("Upload system abhi ready nahi hai.");
        }
      }

      if (nav === "studio") {
        if (
          typeof window.openTitanStudioGemini === "function"
        ) {
          window.openTitanStudioGemini();
        } else {
          alert("Studio abhi ready nahi hai.");
        }
      }

      if (nav === "profile") {
        if (typeof window.openTitanProfile === "function") {
          window.openTitanProfile();
        } else if (
          typeof window.openProfilePage === "function"
        ) {
          window.openProfilePage();
        } else {
          alert("Profile abhi ready nahi hai.");
        }
      }
    }
  });

  // Keyboard support for video cards
  document.addEventListener("keydown", function (event) {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    const target = event.target;

    if (
      target instanceof Element &&
      target.matches(".titan-thumb[data-play]")
    ) {
      event.preventDefault();

      openVideo(
        target.getAttribute("data-play"),
        target.getAttribute("data-title")
      );
    }
  });

  /* ================= INIT ================= */

  function init() {
    try {
      applyTheme();
      injectStyles();
      createHome();
      refreshFeeds();

      window.addEventListener(
        "titan:uploads-updated",
        refreshFeeds
      );

      console.log("TITAN AI v5.0.0 Ready");
    } catch (error) {
      console.error("TITAN AI Init Error:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
