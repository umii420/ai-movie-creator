/* ==========================================================
   TITAN AI — EXTENSIONS V2
   VERSION 6.0 — MODERN EDITION

   Features:
   - Modern video feed integration
   - YouTube-style video cards
   - TikTok-style Shorts grid
   - Search and category filters
   - Responsive video player
   - Upload integration
   - Duplicate homepage protection

   IMPORTANT:
   - Does not create a second homepage.
   - Does not replace Google Login.
   - Does not modify the AI Script Generator API.
   ========================================================== */

(function () {
  "use strict";

  if (window.__TITAN_EXTENSIONS_V60__) return;
  window.__TITAN_EXTENSIONS_V60__ = true;

  const TITAN = {
    version: "6.0.0",

    storageKeys: [
      "titan_user_uploads",
      "titan_uploads",
      "titanVideos",
      "titan_videos",
      "user_uploads"
    ],

    uploads: [],
    activeCategory: "all",
    searchQuery: ""
  };

  /* =========================
     SAFE DATA HELPERS
  ========================= */

  function parseJSON(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  function getString(object, keys) {
    for (const key of keys) {
      const value = object && object[key];

      if (
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        return value.trim();
      }
    }

    return "";
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  /* =========================
     UPLOAD DATA
  ========================= */

  function normalizeVideo(item, index) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const url = getString(item, [
      "url",
      "videoUrl",
      "videoURL",
      "src",
      "fileUrl",
      "fileURL",
      "mediaUrl",
      "mediaURL",
      "video",
      "dataUrl",
      "blobUrl"
    ]);

    const thumbnail = getString(item, [
      "thumbnail",
      "thumbnailUrl",
      "thumbnailURL",
      "thumb",
      "poster",
      "cover",
      "coverUrl",
      "image",
      "imageUrl"
    ]);

    const title =
      getString(item, [
        "title",
        "name",
        "videoTitle",
        "caption"
      ]) || "Untitled Video";

    const type = getString(item, [
      "type",
      "videoType",
      "format",
      "contentType"
    ]).toLowerCase();

    const ratio = Number(
      item.aspectRatio || item.ratio || 0
    );

    const isShort =
      item.isShort === true ||
      item.short === true ||
      type.includes("short") ||
      type.includes("vertical") ||
      (ratio > 0 && ratio < 0.9);

    if (!url && !thumbnail) {
      return null;
    }

    return {
      id: String(
        item.id ||
        item.videoId ||
        item._id ||
        "titan-video-" + index
      ),

      title,
      url,
      thumbnail,
      isShort,

      creator:
        getString(item, [
          "creator",
          "username",
          "userName",
          "author",
          "channelName"
        ]) || "TITAN Creator",

      category:
        getString(item, [
          "category",
          "genre",
          "tag"
        ]).toLowerCase() || "all",

      views: Number(
        item.views || item.viewCount || 0
      ),

      created:
        item.createdAt ||
        item.uploadedAt ||
        item.timestamp ||
        item.date ||
        "",

      original: item
    };
  }

  function loadUploads() {
    const videos = new Map();

    TITAN.storageKeys.forEach(key => {
      let raw;

      try {
        raw = localStorage.getItem(key);
      } catch (error) {
        return;
      }

      if (!raw) return;

      const parsed = parseJSON(raw);

      let records = [];

      if (Array.isArray(parsed)) {
        records = parsed;
      } else if (
        parsed &&
        Array.isArray(parsed.uploads)
      ) {
        records = parsed.uploads;
      } else if (
        parsed &&
        Array.isArray(parsed.videos)
      ) {
        records = parsed.videos;
      } else if (
        parsed &&
        Array.isArray(parsed.items)
      ) {
        records = parsed.items;
      }

      records.forEach((item, index) => {
        const video = normalizeVideo(item, index);

        if (video) {
          videos.set(video.id, video);
        }
      });
    });

    TITAN.uploads = Array.from(
      videos.values()
    ).sort((a, b) => {
      const first = Date.parse(a.created) || 0;
      const second = Date.parse(b.created) || 0;

      return second - first;
    });

    return TITAN.uploads;
  }

  /* =========================
     MODERN NOTIFICATION
  ========================= */

  function showNotice(message) {
    let notice = document.getElementById(
      "titanExtensionNotice"
    );

    if (!notice) {
      notice = document.createElement("div");

      notice.id = "titanExtensionNotice";

      notice.style.cssText = `
        position: fixed;
        z-index: 999999;
        left: 50%;
        bottom: 90px;
        transform: translateX(-50%);
        max-width: calc(100vw - 30px);
        padding: 13px 18px;
        border-radius: 14px;
        border: 1px solid rgba(245,180,42,.35);
        background: #171920;
        color: #ffffff;
        font: 600 13px system-ui;
        box-shadow: 0 12px 40px rgba(0,0,0,.4);
      `;

      document.body.appendChild(notice);
    }

    notice.textContent = message;
    notice.hidden = false;

    clearTimeout(notice._timer);

    notice._timer = setTimeout(() => {
      notice.hidden = true;
    }, 2800);
  }

  /* =========================
     DISPLAY HELPERS
  ========================= */

  function formatViews(number) {
    number = Number(number) || 0;

    if (number >= 1000000) {
      return (
        (number / 1000000)
          .toFixed(1)
          .replace(/\.0$/, "") +
        "M views"
      );
    }

    if (number >= 1000) {
      return (
        (number / 1000)
          .toFixed(1)
          .replace(/\.0$/, "") +
        "K views"
      );
    }

    return number + (
      number === 1 ? " view" : " views"
    );
  }

  function timeAgo(dateValue) {
    const timestamp = Date.parse(dateValue);

    if (!timestamp) {
      return "Recently uploaded";
    }

    const seconds = Math.max(
      0,
      Math.floor(
        (Date.now() - timestamp) / 1000
      )
    );

    if (seconds < 60) {
      return "Just now";
    }

    if (seconds < 3600) {
      return Math.floor(seconds / 60) + "m ago";
    }

    if (seconds < 86400) {
      return Math.floor(seconds / 3600) + "h ago";
    }

    if (seconds < 604800) {
      return Math.floor(seconds / 86400) + "d ago";
    }

    return new Date(timestamp).toLocaleDateString();
  }

  console.info(
    "[TITAN AI] Extension V2 Part 1 loaded."
  );

  /*
   * Part 2 will add:
   * - Premium video cards
   * - Shorts cards
   * - Responsive video player
   */
   /* =========================
     PREMIUM EXTENSION STYLES
  ========================= */

  function addTitanStyles() {
    if (document.getElementById("titanV2ModernStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "titanV2ModernStyles";

    style.textContent = `
      .titan-v2-card {
        position: relative;
        overflow: hidden;
        min-width: 0;
        border-radius: 17px;
        background: #151720;
        border: 1px solid rgba(255,255,255,.08);
        transition: transform .2s ease,
                    border-color .2s ease,
                    box-shadow .2s ease;
        cursor: pointer;
      }

      .titan-v2-card:hover {
        transform: translateY(-3px);
        border-color: rgba(245,180,42,.45);
        box-shadow: 0 12px 30px rgba(0,0,0,.22);
      }

      .titan-v2-thumbnail {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background:
          radial-gradient(circle at 75% 20%, #75511d55, transparent 40%),
          linear-gradient(135deg,#252936,#101116);
      }

      .titan-v2-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .titan-v2-play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: #ffd36b;
        background: rgba(8,9,13,.85);
        border: 1px solid rgba(255,255,255,.22);
        opacity: 0;
        transition: opacity .2s ease;
      }

      .titan-v2-card:hover .titan-v2-play {
        opacity: 1;
      }

      .titan-v2-badge {
        position: absolute;
        left: 10px;
        top: 10px;
        padding: 5px 9px;
        border-radius: 7px;
        background: rgba(12,13,18,.82);
        color: #ffd36b;
        font: 700 10px system-ui;
        letter-spacing: .5px;
      }

      .titan-v2-card-info {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 13px;
      }

      .titan-v2-avatar {
        width: 37px;
        height: 37px;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: linear-gradient(135deg,#f5b42a,#a96b12);
        color: #171717;
        font-size: 14px;
      }

      .titan-v2-details {
        flex: 1;
        min-width: 0;
      }

      .titan-v2-title {
        margin: 0 0 7px;
        color: #f7f7f9;
        font: 700 14px/1.45 system-ui,sans-serif;
        overflow-wrap: anywhere;
      }

      .titan-v2-meta {
        color: #9da3b1;
        font: 400 11px/1.7 system-ui,sans-serif;
      }

      .titan-v2-shorts-grid {
        display: grid;
        grid-template-columns: repeat(4,minmax(0,1fr));
        gap: 14px;
        margin-top: 18px;
      }

      .titan-v2-short-card {
        position: relative;
        overflow: hidden;
        aspect-ratio: 9 / 16;
        min-width: 0;
        padding: 0;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 17px;
        background: #171923;
        cursor: pointer;
        text-align: left;
      }

      .titan-v2-short-card img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .titan-v2-short-card::after {
        content: "";
        position: absolute;
        inset: 35% 0 0;
        background: linear-gradient(transparent,rgba(0,0,0,.85));
      }

      .titan-v2-short-title {
        position: absolute;
        z-index: 2;
        bottom: 12px;
        left: 11px;
        right: 11px;
        color: white;
        font: 700 12px/1.45 system-ui;
        overflow-wrap: anywhere;
      }

      .titan-v2-empty {
        grid-column: 1 / -1;
        padding: 28px 18px;
        border: 1px dashed rgba(255,255,255,.16);
        border-radius: 16px;
        text-align: center;
        color: #9da3b1;
      }

      .titan-v2-player-overlay {
        position: fixed;
        inset: 0;
        z-index: 999990;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(3,4,7,.94);
        backdrop-filter: blur(14px);
      }

      .titan-v2-player-shell {
        width: min(1050px,100%);
        overflow: hidden;
        border: 1px solid rgba(245,180,42,.28);
        border-radius: 19px;
        background: #101117;
        box-shadow: 0 25px 90px rgba(0,0,0,.6);
      }

      .titan-v2-player-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 13px 16px;
        border-bottom: 1px solid rgba(255,255,255,.08);
      }

      .titan-v2-player-heading {
        color: #fff;
        font: 700 15px system-ui;
        overflow-wrap: anywhere;
      }

      .titan-v2-player-close {
        width: 38px;
        height: 38px;
        flex-shrink: 0;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.13);
        background: #ffffff08;
        color: #fff;
        cursor: pointer;
      }

      .titan-v2-player-video {
        display: block;
        width: 100%;
        max-height: 76vh;
        aspect-ratio: 16 / 9;
        object-fit: contain;
        background: #000;
      }

      .titan-v2-player-footer {
        padding: 13px 16px;
        color: #aab0bd;
        font: 12px/1.7 system-ui;
      }

      @media(max-width:760px) {
        .titan-v2-shorts-grid {
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 10px;
        }

        .titan-v2-player-overlay {
          padding: 7px;
        }

        .titan-v2-player-shell {
          border-radius: 13px;
        }

        .titan-v2-player-video {
          max-height: 72vh;
        }
      }

      @media(prefers-reduced-motion:reduce) {
        .titan-v2-card,
        .titan-v2-play {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================
     VIDEO PLAYER
  ========================= */

  function closeTitanPlayer() {
    const overlay = document.getElementById(
      "titanV2PlayerOverlay"
    );

    if (!overlay) return;

    const video = overlay.querySelector("video");

    if (video) {
      video.pause();
      video.removeAttribute("src");

      video.querySelectorAll("source").forEach(source => {
        source.removeAttribute("src");
      });

      video.load();
    }

    overlay.remove();
    document.body.style.overflow = "";
    document.removeEventListener(
      "keydown",
      titanPlayerEscape
    );
  }

  function titanPlayerEscape(event) {
    if (event.key === "Escape") {
      closeTitanPlayer();
    }
  }

  function playTitanVideo(videoData) {
    if (!videoData || !videoData.url) {
      showNotice(
        "Is video ka playable URL nahi mila. Upload system check karna hoga."
      );
      return;
    }

    closeTitanPlayer();

    const overlay = document.createElement("div");

    overlay.id = "titanV2PlayerOverlay";
    overlay.className = "titan-v2-player-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", videoData.title);

    overlay.innerHTML = `
      <div class="titan-v2-player-shell">

        <div class="titan-v2-player-header">
          <div class="titan-v2-player-heading">
            ${escapeHTML(videoData.title)}
          </div>

          <button
            type="button"
            class="titan-v2-player-close"
            data-titan-v2-close
            aria-label="Close video player"
          >
            ✕
          </button>
        </div>

        <video
          class="titan-v2-player-video"
          controls
          playsinline
          preload="metadata"
          ${videoData.thumbnail
            ? `poster="${escapeHTML(videoData.thumbnail)}"`
            : ""}
        >
          <source src="${escapeHTML(videoData.url)}">
          Your browser does not support video playback.
        </video>

        <div class="titan-v2-player-footer">
          ${escapeHTML(videoData.creator)}
          · ${escapeHTML(formatViews(videoData.views))}
          · ${escapeHTML(timeAgo(videoData.created))}
        </div>

      </div>
    `;

    overlay.addEventListener("click", event => {
      if (
        event.target === overlay ||
        event.target.closest("[data-titan-v2-close]")
      ) {
        closeTitanPlayer();
      }
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    document.addEventListener(
      "keydown",
      titanPlayerEscape
    );

    const media = overlay.querySelector("video");
    const result = media.play();

    if (result && typeof result.catch === "function") {
      result.catch(() => {
        // Mobile browsers may require the user to press Play.
      });
    }
  }

  window.closeTitanFeedVideo = closeTitanPlayer;

  /* =========================
     VIDEO CARD BUILDER
  ========================= */

  function createTitanVideoCard(video) {
    const card = document.createElement("article");

    card.className = "titan-v2-card";
    card.dataset.titanVideoId = video.id;
    card.dataset.category = video.category;
    card.dataset.search = (
      video.title + " " +
      video.creator + " " +
      video.category
    ).toLowerCase();

    const thumbnail = video.thumbnail
      ? `<img
           src="${escapeHTML(video.thumbnail)}"
           alt=""
           loading="lazy"
         >`
      : "";

    card.innerHTML = `
      <div class="titan-v2-thumbnail">
        ${thumbnail}

        <span class="titan-v2-badge">
          ${video.isShort ? "TITAN SHORT" : "CREATOR VIDEO"}
        </span>

        <span class="titan-v2-play">▶</span>
      </div>

      <div class="titan-v2-card-info">

        <div class="titan-v2-avatar">T</div>

        <div class="titan-v2-details">
          <h3 class="titan-v2-title">
            ${escapeHTML(video.title)}
          </h3>

          <div class="titan-v2-meta">
            ${escapeHTML(video.creator)}<br>
            ${escapeHTML(formatViews(video.views))}
            · ${escapeHTML(timeAgo(video.created))}
          </div>
        </div>

      </div>
    `;

    card.addEventListener("click", () => {
      playTitanVideo(video);
    });

    return card;
  }

  console.info(
    "[TITAN AI] Extension V2 Part 2 loaded."
  );

  /*
   * Part 3 will add:
   * - Connection to the updated index.html
   * - Home feed rendering
   * - Shorts feed rendering
   * - Search and category integration
   * - Upload refresh events
   * - Final initialization  /* =========================
     HOME FEED INTEGRATION
  ========================= */

  function renderHomeFeed() {
    const grid = document.getElementById("titanVideoGrid");

    if (!grid) {
      console.warn(
        "[TITAN AI] #titanVideoGrid nahi mila. index.html ke actual grid ID ko verify karna hoga."
      );
      return;
    }

    grid.querySelectorAll("[data-titan-v2-card]").forEach(card => {
      card.remove();
    });

    const videos = TITAN.uploads.filter(video => !video.isShort);

    videos.forEach(video => {
      const card = createTitanVideoCard(video);
      card.dataset.titanV2Card = "true";
      grid.appendChild(card);
    });

    applyHomeFilters();
  }

  /* =========================
     SHORTS FEED INTEGRATION
  ========================= */

  function renderShortsFeed() {
    const shortsView = document.getElementById("titanShortsView");

    if (!shortsView) return;

    let grid = document.getElementById("titanV2ShortsGrid");

    if (!grid) {
      grid = document.createElement("div");
      grid.id = "titanV2ShortsGrid";
      grid.className = "titan-v2-shorts-grid";

      const panel = shortsView.querySelector(".feature-panel");

      if (panel) {
        panel.insertAdjacentElement("afterend", grid);
      } else {
        shortsView.appendChild(grid);
      }
    }

    grid.replaceChildren();

    const shorts = TITAN.uploads.filter(video => video.isShort);

    if (!shorts.length) {
      const empty = document.createElement("div");
      empty.className = "titan-v2-empty";

      empty.innerHTML = `
        <div style="font-size:32px;margin-bottom:10px">🎬</div>
        <h3 style="color:#fff;margin:0 0 8px">
          Your Shorts Start Here
        </h3>
        <p style="margin:0">
          Upload a vertical video to build your TITAN Shorts feed.
        </p>
      `;

      grid.appendChild(empty);
      return;
    }

    shorts.forEach(video => {
      const card = document.createElement("button");

      card.type = "button";
      card.className = "titan-v2-short-card";
      card.setAttribute("aria-label", "Play " + video.title);

      card.innerHTML = `
        ${
          video.thumbnail
            ? `<img src="${escapeHTML(video.thumbnail)}" alt="" loading="lazy">`
            : `<span style="
                position:absolute;
                inset:0;
                display:grid;
                place-items:center;
                color:#ffd36b;
                font-size:34px;
                background:linear-gradient(135deg,#252936,#101116)
              ">▶</span>`
        }

        <span class="titan-v2-short-title">
          ${escapeHTML(video.title)}
        </span>
      `;

      card.addEventListener("click", () => {
        playTitanVideo(video);
      });

      grid.appendChild(card);
    });
  }

  /* =========================
     SEARCH & CATEGORY FILTERS
  ========================= */

  function applyHomeFilters() {
    const grid = document.getElementById("titanVideoGrid");

    if (!grid) return;

    const cards = grid.querySelectorAll(".titan-v2-card");

    cards.forEach(card => {
      const category = (
        card.dataset.category || "all"
      ).toLowerCase();

      const searchText = (
        card.dataset.search || ""
      ).toLowerCase();

      const categoryMatch =
        TITAN.activeCategory === "all" ||
        category === TITAN.activeCategory ||
        (
          TITAN.activeCategory === "movies" &&
          /movie|film|cinema/.test(searchText)
        );

      const searchMatch =
        !TITAN.searchQuery ||
        searchText.includes(TITAN.searchQuery);

      card.style.display =
        categoryMatch && searchMatch ? "" : "none";
    });
  }

  function connectSearch() {
    const searchInput = document.getElementById("titanSearchInput");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        TITAN.searchQuery = searchInput.value
          .trim()
          .toLowerCase();

        applyHomeFilters();
      });
    }

    const categoryRow = document.getElementById("titanCategoryRow");

    if (categoryRow) {
      categoryRow.addEventListener("click", event => {
        const chip = event.target.closest("[data-category]");

        if (!chip) return;

        TITAN.activeCategory = (
          chip.dataset.category || "all"
        ).toLowerCase();

        categoryRow.querySelectorAll(".category-chip").forEach(item => {
          item.classList.toggle("active", item === chip);
        });

        applyHomeFilters();
      });
    }
  }

  /* =========================
     REFRESH UPLOADS
  ========================= */

  function refreshTitanExtension() {
    loadUploads();
    renderHomeFeed();
    renderShortsFeed();
  }

  window.titanRefreshVideoFeeds = refreshTitanExtension;

  window.titanExtensionsV2 = {
    version: TITAN.version,

    refresh: refreshTitanExtension,

    getUploads: function () {
      return TITAN.uploads.slice();
    },

    playVideoById: function (id) {
      const video = TITAN.uploads.find(item => item.id === String(id));

      if (video) {
        playTitanVideo(video);
      } else {
        showNotice("Video nahi mili.");
      }
    },

    closePlayer: closeTitanPlayer
  };

  /* =========================
     APP EVENTS
  ========================= */

  function connectUploadEvents() {
    [
      "titan:uploads-updated",
      "titan:upload-complete",
      "titan:video-uploaded",
      "titan:videos-updated"
    ].forEach(eventName => {
      window.addEventListener(eventName, refreshTitanExtension);
    });

    window.addEventListener("storage", event => {
      if (
        !event.key ||
        TITAN.storageKeys.includes(event.key)
      ) {
        refreshTitanExtension();
      }
    });
  }

  /* =========================
     START EXTENSION
  ========================= */

  function initTitanExtension() {
    addTitanStyles();
    connectSearch();
    connectUploadEvents();
    refreshTitanExtension();

    console.info(
      "[TITAN AI] Extensions V2 " +
      TITAN.version +
      " initialized."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initTitanExtension,
      { once: true }
    );
  } else {
    initTitanExtension();
  }

})();
   */
 
