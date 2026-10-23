/**
 * PLATFORM: TITAN AI
 * VERSION: v4.6.0 - Premium Feed & Navigation
 * FILE: app-extensions-v2.js
 *
 * Compatibility:
 * - app-auth-system.js
 * - app-profile-system.js
 * - app-upload-system.js
 * - /api/generate (Groq backend is not changed)
 */

(function () {
  "use strict";

  if (window.__TITAN_EXTENSIONS_V46__) return;
  window.__TITAN_EXTENSIONS_V46__ = true;

  console.log("⚡ TITAN AI Ecosystem Active!");

  const UPLOADS_KEY = "titan_user_uploads";
  const THEME_KEY = "theme_preference";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

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

      if (
        url.protocol === "https:" ||
        url.protocol === "http:"
      ) {
        return url.href;
      }
    } catch (error) {
      console.warn("Invalid media URL:", error);
    }

    return "";
  }

  function readUploads() {
    try {
      const data = JSON.parse(
        localStorage.getItem(UPLOADS_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn("Could not read Titan uploads:", error);
      return [];
    }
  }

  function normaliseType(item) {
    return String(item?.type || "video")
      .toLowerCase()
      .trim();
  }

  function isShort(item) {
    const type = normaliseType(item);

    return (
      type === "short" ||
      type === "shorts" ||
      type === "titan short"
    );
  }

  function isLongVideo(item) {
    const type = normaliseType(item);

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

  /* -----------------------------------------
     THEME
  ----------------------------------------- */

  function applyTheme() {
    let theme = "light";

    try {
      theme =
        localStorage.getItem(THEME_KEY) || "light";
    } catch (error) {}

    document.body.classList.toggle(
      "light-mode",
      theme === "light"
    );

    document.documentElement.dataset.theme = theme;
  }

  function toggleTheme() {
    const isLight =
      document.body.classList.contains("light-mode");

    const nextTheme = isLight ? "dark" : "light";

    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {}

    document.body.classList.toggle(
      "light-mode",
      nextTheme === "light"
    );

    document.documentElement.dataset.theme = nextTheme;
  }

  /* -----------------------------------------
     CSS
  ----------------------------------------- */

  function injectStyles() {
    if ($("#titan-v46-styles")) return;

    const style = document.createElement("style");
    style.id = "titan-v46-styles";

    style.textContent = `
      :root {
        --titan-gold: #f59e0b;
        --titan-blue: #00b2ff;
        --titan-bg: #050507;
        --titan-card: #0d0e12;
        --titan-border: rgba(255,255,255,.10);
        --titan-text: #f8fafc;
        --titan-muted: #9ca3af;
      }

      body {
        background: var(--titan-bg);
        color: var(--titan-text);
      }

      body.light-mode {
        --titan-bg: #f8fafc;
        --titan-card: #ffffff;
        --titan-border: rgba(15,23,42,.12);
        --titan-text: #111827;
        --titan-muted: #64748b;
        background: var(--titan-bg);
        color: var(--titan-text);
      }

      #titan-extension-home {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 16px;
        box-sizing: border-box;
      }

      #titan-extension-home *,
      #titan-shorts-viewer * {
        box-sizing: border-box;
      }

      .titan-v46-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 22px;
      }

      .titan-v46-brand {
        font-size: 23px;
        font-weight: 900;
        letter-spacing: -.8px;
        color: var(--titan-text);
      }

      .titan-v46-brand span {
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
        width: 42px;
        height: 42px;
        border: 1px solid var(--titan-border);
        border-radius: 13px;
        background: var(--titan-card);
        color: var(--titan-text);
        cursor: pointer;
      }

      .titan-v46-hero {
        padding: clamp(22px, 5vw, 48px);
        margin-bottom: 24px;
        border: 1px solid var(--titan-border);
        border-radius: 24px;
        background:
          radial-gradient(
            circle at 85% 15%,
            rgba(245,158,11,.16),
            transparent 38%
          ),
          var(--titan-card);
      }

      .titan-v46-badge {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        padding: 8px 12px;
        border-radius: 30px;
        border: 1px solid rgba(245,158,11,.35);
        color: var(--titan-gold);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1px;
      }

      .titan-v46-hero h1 {
        margin: 22px 0 12px;
        font-size: clamp(30px, 6vw, 56px);
        line-height: 1.06;
        font-weight: 900;
        letter-spacing: -1.5px;
      }

      .titan-v46-hero h1 span {
        color: var(--titan-gold);
      }

      .titan-v46-hero p {
        max-width: 620px;
        color: var(--titan-muted);
        line-height: 1.8;
      }

      .titan-v46-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      .titan-v46-button {
        min-height: 46px;
        padding: 12px 18px;
        border: 1px solid var(--titan-border);
        border-radius: 13px;
        font-weight: 800;
        cursor: pointer;
      }

      .titan-v46-button-primary {
        background: var(--titan-gold);
        color: #111111;
        border-color: var(--titan-gold);
      }

      .titan-v46-button-secondary {
        background: transparent;
        color: var(--titan-text);
      }

      .titan-v46-section {
        margin: 28px 0;
      }

      .titan-v46-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }

      .titan-v46-section-heading h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 900;
      }

      .titan-v46-muted {
        color: var(--titan-muted);
        font-size: 13px;
      }

      .titan-v46-chips {
        display: flex;
        gap: 9px;
        overflow-x: auto;
        padding: 3px 0 12px;
      }

      .titan-v46-chip {
        flex-shrink: 0;
        padding: 10px 15px;
        border: 1px solid var(--titan-border);
        border-radius: 30px;
        background: var(--titan-card);
        color: var(--titan-text);
        cursor: pointer;
      }

      .titan-v46-chip.active {
        color: #111111;
        background: var(--titan-gold);
        border-color: var(--titan-gold);
      }

      .titan-v46-grid,
      .titan-video-feed-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .titan-v46-card,
      .titan-video-feed-grid .titan-video-card {
        min-width: 0;
        overflow: hidden;
        border: 1px solid var(--titan-border);
        border-radius: 17px;
        background: var(--titan-card);
        color: var(--titan-text);
      }

      .titan-v46-thumb-wrap {
        position: relative;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: #171717;
        cursor: pointer;
      }

      .titan-v46-thumb {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .titan-v46-play {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(0,0,0,.7);
        color: #ffffff;
        pointer-events: none;
      }

      .titan-v46-card-info {
        padding: 13px;
      }

      .titan-v46-card-info h3 {
        margin: 0 0 8px;
        font-size: 15px;
        line-height: 1.45;
        overflow-wrap: anywhere;
      }

      .titan-v46-card-info p {
        margin: 0;
        color: var(--titan-muted);
        font-size: 12px;
      }

      .titan-v46-empty {
        grid-column: 1 / -1;
        padding: 28px 18px;
        text-align: center;
        color: var(--titan-muted);
        border: 1px dashed var(--titan-border);
        border-radius: 16px;
      }

      #titan-shorts-viewer {
        display: none;
        position: relative;
        margin: 20px auto;
        max-width: 480px;
        background: #000000;
        border-radius: 20px;
        overflow: hidden;
      }

      #titan-shorts-viewer.active {
        display: block;
      }

      .titan-v46-short {
        position: relative;
        min-height: 400px;
        background: #000000;
      }

      .titan-v46-short video {
        display: block;
        width: 100%;
        max-height: 75vh;
        object-fit: contain;
        background: #000000;
      }

      .titan-v46-short-info {
        padding: 14px;
        color: #ffffff;
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
        color: #ffffff;
        cursor: pointer;
      }

      .titan-v46-bottom-nav {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 4px;
        padding: 10px 5px;
        margin-top: 28px;
        border-top: 1px solid var(--titan-border);
        background: var(--titan-card);
      }

      .titan-v46-nav-item {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 0;
        min-height: 48px;
        border: 0;
        background: transparent;
        color: var(--titan-muted);
        font-size: 11px;
        cursor: pointer;
      }

      .titan-v46-nav-item i {
        font-size: 18px;
      }

      .titan-v46-nav-item.active {
        color: var(--titan-gold);
      }

      @media (max-width: 760px) {
        #titan-extension-home {
          padding: 12px;
        }

        .titan-v46-grid,
        .titan-video-feed-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .titan-v46-card-info {
          padding: 10px;
        }
      }

      @media (max-width: 420px) {
        .titan-v46-grid,
        .titan-video-feed-grid {
          grid-template-columns: 1fr;
        }

        .titan-v46-hero h1 {
          letter-spacing: -.6px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #titan-extension-home *,
        #titan-shorts-viewer * {
          scroll-behavior: auto !important;
          animation: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* -----------------------------------------
     VIDEO PLAYBACK
  ----------------------------------------- */

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

      modal.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:99999",
        "background:rgba(0,0,0,.94)",
        "display:none",
        "align-items:center",
        "justify-content:center",
        "padding:18px"
      ].join(";");

      modal.innerHTML = `
        <div style="
          width:100%;
          max-width:900px;
          position:relative;
          background:#090909;
          border-radius:16px;
          overflow:hidden;
        ">
          <button
            type="button"
            data-titan-close-player
            aria-label="Close video"
            style="
              position:absolute;
              right:10px;
              top:10px;
              z-index:2;
              width:42px;
              height:42px;
              border:0;
              border-radius:50%;
              background:#222;
              color:white;
              font-size:22px;
              cursor:pointer;
            "
          >×</button>

          <video
            id="titan-v46-player"
            controls
            playsinline
            preload="metadata"
            style="
              display:block;
              width:100%;
              max-height:80vh;
              background:#000;
            "
          ></video>

          <div
            id="titan-v46-player-title"
            style="padding:14px;color:white;font-weight:700"
          ></div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.addEventListener("click", (event) => {
        if (
          event.target === modal ||
          event.target.closest("[data-titan-close-player]")
        ) {
          closeVideo();
        }
      });
    }

    const player = $("#titan-v46-player", modal);

    player.src = safeURL;
    $("#titan-v46-player-title", modal).textContent =
      title || "TITAN AI Video";

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    const playPromise = player.play();

    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Mobile browsers may require the user to tap Play.
      });
    }
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

  window.playTitanVideo = function (url, title) {
    openVideo(url, title);
  };

  window.closeTitanVideo = closeVideo;

  /* -----------------------------------------
     VIDEO FEED
  ----------------------------------------- */

  function renderLongVideos() {
    const grid = $("#titan-v46-video-grid");
    if (!grid) return;

    const videos = readUploads().filter(
      (item) => isLongVideo(item) && !item.draft
    );

    if (!videos.length) {
      grid.innerHTML = `
        <div class="titan-v46-empty">
          <i class="fa-solid fa-film"
             style="font-size:28px;margin-bottom:12px"></i>
          <h3 style="margin:0 0 8px">Abhi koi video nahi</h3>
          <p style="margin:0">
            Plus button se apni pehli video upload karein.
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = videos.map((item) => {
      const title = safeText(item.title || "Untitled Video");
      const videoURL = safeMediaURL(item.url);
      const thumbURL = safeMediaURL(
        item.thumb || item.thumbnail || item.thumbnailUrl
      );

      const views = formatViews(item.views);

      let thumbnailMarkup;

      if (thumbURL) {
        thumbnailMarkup = `
          <img
            class="titan-v46-thumb"
            src="${safeText(thumbURL)}"
            alt="${title}"
            loading="lazy"
            decoding="async"
            onerror="
              this.style.display='none';
              this.parentElement.classList.add('thumbnail-error');
            "
          >
        `;
      } else {
        thumbnailMarkup = `
          <div style="
            width:100%;
            height:100%;
            display:grid;
            place-items:center;
            color:#f59e0b;
            font-size:36px;
            background:linear-gradient(135deg,#171717,#292018);
          ">
            <i class="fa-solid fa-film"></i>
          </div>
        `;
      }

      return `
        <article class="titan-video-card">
          <div
            class="titan-v46-thumb-wrap"
            data-titan-play="${safeText(videoURL)}"
            data-titan-title="${title}"
            role="button"
            tabindex="0"
            aria-label="Play ${title}"
          >
            ${thumbnailMarkup}
            <div class="titan-v46-play">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>

          <div class="titan-v46-card-info">
            <h3>${title}</h3>
            <p>
              <i class="fa-regular fa-eye"></i>
              ${views} views
            </p>
          </div>
        </article>
      `;
    }).join("");
  }

  /* -----------------------------------------
     SHORTS
  ----------------------------------------- */

  function renderShorts() {
    const viewer = $("#titan-shorts-viewer");
    if (!viewer) return;

    const shorts = readUploads().filter(
      (item) => isShort(item) && !item.draft
    );

    if (!shorts.length) {
      viewer.innerHTML = `
        <div class="titan-v46-empty">
          <i class="fa-solid fa-mobile-screen-button"
             style="font-size:28px"></i>
          <h3>Koi Short abhi upload nahi hui</h3>
          <p>Plus par tap karke apni Short upload karein.</p>
        </div>
      `;
      return;
    }

    viewer.innerHTML = shorts.map((item, index) => {
      const url = safeMediaURL(item.url);
      const thumb = safeMediaURL(
        item.thumb || item.thumbnail || item.thumbnailUrl
      );
      const title = safeText(item.title || "Titan Short");
      const description = safeText(item.description || "");

      if (!url) return "";

      return `
        <article class="titan-v46-short">
          <video
            controls
            playsinline
            preload="metadata"
            ${thumb ? `poster="${safeText(thumb)}"` : ""}
            data-titan-short-video
            data-short-index="${index}"
          >
            <source src="${safeText(url)}">
            Your browser does not support video.
          </video>

          <div class="titan-v46-short-info">
            <strong>${title}</strong>

            ${
              description
                ? `<p>${description}</p>`
                : ""
            }

            <div class="titan-v46-short-actions">
              <button
                type="button"
                data-titan-like
                aria-pressed="false"
              >
                <i class="fa-regular fa-heart"></i>
                Like
              </button>

              <button
                type="button"
                data-titan-comment
              >
                <i class="fa-regular fa-comment"></i>
                Comment
              </button>

              <button
                type="button"
                data-titan-share
                data-share-title="${title}"
                data-share-url="${safeText(url)}"
              >
                <i class="fa-solid fa-share"></i>
                Share
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /* -----------------------------------------
     FEED REFRESH COMPATIBILITY
  ----------------------------------------- */

  window.titanRefreshVideoFeeds = function () {
    renderLongVideos();
    renderShorts();
  };

  window.addEventListener("titan:uploads-updated", () => {
    window.titanRefreshVideoFeeds();
  });

  window.addEventListener("storage", (event) => {
    if (!event.key || event.key === UPLOADS_KEY) {
      window.titanRefreshVideoFeeds();
    }

    if (event.key === THEME_KEY) {
      applyTheme();
    }
  });

  /* -----------------------------------------
     STUDIO / PROFILE / UPLOAD NAVIGATION
  ----------------------------------------- */

  function openStudio() {
    if (typeof window.openTitanStudioGemini === "function") {
      window.openTitanStudioGemini();
      return;
    }

    if (typeof window.openTitanStudio === "function") {
      window.openTitanStudio();
      return;
    }

    const studio = $(
      "#titanStudio, #titanStudioModal, #geminiOutputModal"
    );

    if (studio) {
      studio.style.display = "block";
      studio.classList.add("active");
      return;
    }

    alert(
      "Titan Studio ka function nahi mila. " +
      "Apni existing Studio file aur API settings check karein."
    );
  }

  function openProfile() {
    if (typeof window.openTitanProfile === "function") {
      window.openTitanProfile();
      return;
    }

    if (typeof window.openProfilePage === "function") {
      window.openProfilePage();
      return;
    }

    alert("Profile system abhi load nahi hua.");
  }

  window.titanOpenUpload = function () {
    if (
      typeof window.openTitanCreatorCenter === "function"
    ) {
      window.openTitanCreatorCenter();
      return;
    }

    if (
      typeof window.openTitanUploadStudio === "function"
    ) {
      window.openTitanUploadStudio();
      return;
    }

    const uploadModal = $(
      "#titanOverlayV9, #titanUploadModal, #uploadModal"
    );

    if (uploadModal) {
      uploadModal.style.display = "flex";
      uploadModal.classList.add("active");
      return;
    }

    alert(
      "Upload system load nahi hua. " +
      "app-upload-system.js ko check karein."
    );
  };

  /* -----------------------------------------
     HOME LAYOUT
  ----------------------------------------- */

  function ensureHomeLayout() {
    // Don't replace the user's existing app layout.
    // If an older Home extension exists, only update its fake CTA.
    const oldHero = $(
      ".earning-cta-box, .hero-verified-tag"
    );

    if (oldHero) {
      const earningBox = $(".earning-cta-box");

      if (earningBox) {
        const studioButton = Array.from(
          earningBox.querySelectorAll("button")
        ).find((button) =>
          /studio/i.test(button.textContent || "")
        );

        earningBox.innerHTML = "";

        if (studioButton) {
          studioButton.classList.add(
            "titan-v46-button",
            "titan-v46-button-primary"
          );

          studioButton.innerHTML =
            '<i class="fa-solid fa-wand-magic-sparkles"></i> ' +
            "Launch Titan Studio";

          earningBox.appendChild(studioButton);
        } else {
          const button = document.createElement("button");

          button.type = "button";
          button.className =
            "titan-v46-button titan-v46-button-primary";
          button.innerHTML =
            '<i class="fa-solid fa-wand-magic-sparkles"></i> ' +
            "Launch Titan Studio";

          button.addEventListener("click", openStudio);
          earningBox.appendChild(button);
        }
      }

      const badge = $(".hero-verified-tag");

      if (badge) {
        badge.classList.remove("hero-verified-tag");
        badge.classList.add("titan-v46-badge");
        badge.textContent = "TITAN AI CREATOR STUDIO";
      }

      return;
    }

    // Create a standalone Home only if no extension Home exists.
    if ($("#titan-extension-home")) return;

    const home = document.createElement("section");
    home.id = "titan-extension-home";

    home.innerHTML = `
      <header class="titan-v46-header">
        <div class="titan-v46-brand">
          TITAN <span>AI</span>
        </div>

        <div class="titan-v46-header-actions">
          <button
            class="titan-v46-icon-button"
            type="button"
            data-titan-theme
            aria-label="Toggle theme"
          >
            <i class="fa-solid fa-moon"></i>
          </button>

          <button
            class="titan-v46-icon-button"
            type="button"
            data-titan-search
            aria-label="Search videos"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </header>

      <section class="titan-v46-hero">
        <div class="titan-v46-badge">
          <i class="fa-solid fa-film"></i>
          TITAN AI CREATOR STUDIO
        </div>

        <h1>
          CREATE YOUR<br>
          <span>CINEMATIC WORLD</span>
        </h1>

        <p>
          Apne ideas ko stories, cinematic videos aur
          creative projects mein badlein.
        </p>

        <div class="titan-v46-actions">
          <button
            type="button"
            class="titan-v46-button titan-v46-button-primary"
            data-titan-open-studio
          >
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Launch Titan Studio
          </button>

          <button
            type="button"
            class="titan-v46-button titan-v46-button-secondary"
            data-titan-open-upload
          >
            <i class="fa-solid fa-cloud-arrow-up"></i>
            Upload Video
          </button>
        </div>
      </section>

      <div class="titan-v46-chips">
        <button class="titan-v46-chip active"
          type="button" data-titan-category="all">
          All
        </button>

        <button class="titan-v46-chip"
          type="button" data-titan-category="video">
          AI Movies
        </button>

        <button class="titan-v46-chip"
          type="button" data-titan-category="short">
          Titan Shorts
        </button>

        <button class="titan-v46-chip"
          type="button" data-titan-category="music">
          Sufi Music
        </button>
      </div>

      <section class="titan-v46-section"
        id="titan-v46-long-section">

        <div class="titan-v46-section-heading">
          <h2>
            <i class="fa-solid fa-film"
               style="color:var(--titan-gold)"></i>
            Latest Videos
          </h2>

          <span class="titan-v46-muted">
            TITAN FEED
          </span>
        </div>

        <div
          id="titan-v46-video-grid"
          class="titan-v46-grid titan-video-feed-grid"
        ></div>
      </section>

      <section class="titan-v46-section"
        id="titan-v46-shorts-section">

        <div class="titan-v46-section-heading">
          <h2>
            <i class="fa-solid fa-mobile-screen-button"
               style="color:var(--titan-gold)"></i>
            Titan Shorts
          </h2>
        </div>

        <div id="titan-shorts-viewer"></div>
      </section>

      <nav class="titan-v46-bottom-nav"
        aria-label="Main navigation">

        <button type="button"
          class="titan-v46-nav-item active"
          data-titan-nav="home">
          <i class="fa-solid fa-house"></i>
          <span>Home</span>
        </button>

        <button type="button"
          class="titan-v46-nav-item"
          data-titan-nav="shorts">
          <i class="fa-solid fa-play"></i>
          <span>Shorts</span>
        </button>

        <button type="button"
          class="titan-v46-nav-item"
          data-titan-nav="plus">
          <i class="fa-solid fa-plus"></i>
          <span>Plus</span>
        </button>

        <button type="button"
          class="titan-v46-nav-item"
          data-titan-nav="studio">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Studio</span>
        </button>

        <button type="button"
          class="titan-v46-nav-item"
          data-titan-nav="profile">
          <i class="fa-solid fa-user"></i>
          <span>Profile</span>
        </button>
      </nav>
    `;

    const target = $(
      "#homePage, #home-page, main, #app"
    ) || document.body;

    target.appendChild(home);
  }

  /* -----------------------------------------
     CLICK HANDLERS
  ----------------------------------------- */

  document.addEventListener("click", async (event) => {
    const themeButton = event.target.closest(
      "[data-titan-theme]"
    );

    if (themeButton) {
      toggleTheme();
      return;
    }

    const playTarget = event.target.closest(
      "[data-titan-play]"
    );

    if (playTarget) {
      openVideo(
        playTarget.getAttribute("data-titan-play"),
        playTarget.getAttribute("data-titan-title")
      );
      return;
    }

    const studioButton = event.target.closest(
      "[data-titan-open-studio]"
    );

    if (studioButton) {
      openStudio();
      return;
    }

    const uploadButton = event.target.closest(
      "[data-titan-open-upload]"
    );

    if (uploadButton) {
      window.titanOpenUpload();
      return;
    }

    const navButton = event.target.closest(
      "[data-titan-nav]"
    );

    if (navButton) {
      const nav = navButton.getAttribute("data-titan-nav");

      document.querySelectorAll("[data-titan-nav]")
        .forEach((button) => {
          button.classList.toggle(
            "active",
            button === navButton
          );
        });

      if (nav === "home") {
        $("#titan-v46-long-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      if (nav === "shorts") {
        $("#titan-v46-shorts-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      if (nav === "plus") {
        window.titanOpenUpload();
      }

      if (nav === "studio") {
        openStudio();
      }

      if (nav === "profile") {
        openProfile();
      }

      return;
    }

    const categoryButton = event.target.closest(
      "[data-titan-category]"
    );

    if (categoryButton) {
      const category =
        categoryButton.getAttribute("data-titan-category");

      document.querySelectorAll("[data-titan-category]")
        .forEach((button) => {
          button.classList.toggle(
            "active",
            button === categoryButton
          );
        });

      const longSection = $("#titan-v46-long-section");
      const shortsSection = $("#titan-v46-shorts-section");

      if (longSection) {
        longSection.style.display =
          category === "short" ? "none" : "";
      }

      if (shortsSection) {
        shortsSection.style.display =
          category === "video" || category === "music"
            ? "none"
            : "";
      }

      return;
    }

    const likeButton = event.target.closest(
      "[data-titan-like]"
    );

    if (likeButton) {
      const liked =
        likeButton.getAttribute("aria-pressed") === "true";

      likeButton.setAttribute(
        "aria-pressed",
        String(!liked)
      );

      likeButton.innerHTML = liked
        ? '<i class="fa-regular fa-heart"></i> Like'
        : '<i class="fa-solid fa-heart"></i> Liked';

      // This is a local visual state, not a database-backed like.
      return;
    }

    const commentButton = event.target.closest(
      "[data-titan-comment]"
    );

    if (commentButton) {
      alert(
        "Comments ke liye abhi backend/database connect nahi hai."
      );
      return;
    }

    const shareButton = event.target.closest(
      "[data-titan-share]"
    );

    if (shareButton) {
      const shareURL =
        shareButton.getAttribute("data-share-url");

      const shareTitle =
        shareButton.getAttribute("data-share-title") ||
        "TITAN AI Short";

      try {
        if (navigator.share) {
          await navigator.share({
            title: shareTitle,
            url: shareURL
          });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareURL);
          alert("Video link copy ho gaya.");
        } else {
          prompt("Video link copy karein:", shareURL);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.warn("Share failed:", error);
        }
      }
    }

    const searchButton = event.target.closest(
      "[data-titan-search]"
    );

    if (searchButton) {
      const query = prompt("Video ka naam search karein:");

      if (query) {
        const cards = document.querySelectorAll(
          "#titan-v46-video-grid .titan-video-card"
        );

        let found = 0;

        cards.forEach((card) => {
          const match = card.textContent
            .toLowerCase()
            .includes(query.toLowerCase());

          card.style.display = match ? "" : "none";

          if (match) found++;
        });

        if (!found) {
          alert("Is naam ki koi video nahi mili.");
        }
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    const playTarget = event.target.closest?.(
      "[data-titan-play]"
    );

    if (
      playTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();

      openVideo(
        playTarget.getAttribute("data-titan-play"),
        playTarget.getAttribute("data-titan-title")
      );
    }

    if (event.key === "Escape") {
      closeVideo();
    }
  });

  /* -----------------------------------------
     INITIALIZATION
  ----------------------------------------- */

  function initTitanExtensions() {
    applyTheme();
    injectStyles();
    ensureHomeLayout();

    window.titanRefreshVideoFeeds();

    console.log("✅ TITAN AI v4.6.0 initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initTitanExtensions,
      { once: true }
    );
  } else {
    initTitanExtensions();
  }

})();
