/**
 * TITAN AI — YouTube Style Long Video Player
 * FILE: app-long-video-player.js
 * VERSION: 1.0.0
 */

(function () {
  "use strict";

  if (window.__TITAN_LONG_PLAYER_V1__) return;
  window.__TITAN_LONG_PLAYER_V1__ = true;

  const UPLOADS_KEY = "titan_user_uploads";
  const PROFILE_KEY = "titan_user_profile";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  function safeURL(value) {
    try {
      const url = new URL(String(value || ""), location.href);

      return ["http:", "https:"].includes(url.protocol)
        ? url.href
        : "";
    } catch (_) {
      return "";
    }
  }

  function getUploads() {
    try {
      const value = JSON.parse(
        localStorage.getItem(UPLOADS_KEY) || "[]"
      );

      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function getProfile() {
    try {
      return JSON.parse(
        localStorage.getItem(PROFILE_KEY) || "{}"
      ) || {};
    } catch (_) {
      return {};
    }
  }

  function isShort(item) {
    return ["short", "shorts", "titan short"].includes(
      String(item.type || "").toLowerCase()
    );
  }

  function getLongVideos() {
    return getUploads()
      .filter(item =>
        item &&
        !item.draft &&
        !isShort(item) &&
        safeURL(item.url)
      )
      .sort((a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
  }

  function formatViews(value) {
    const n = Math.max(0, Number(value) || 0);

    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";

    return String(n);
  }

  function formatTime(value) {
    if (!value) return "Recently uploaded";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Recently uploaded";
    }

    const days = Math.floor(
      (Date.now() - date.getTime()) / 86400000
    );

    if (days < 1) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 30) return days + " days ago";

    return date.toLocaleDateString();
  }

  function creatorName(item) {
    const profile = getProfile();

    return (
      item.creatorName ||
      item.creator ||
      item.username ||
      profile.name ||
      "TITAN Creator"
    );
  }

  /* ================= STYLES ================= */

  function addStyles() {
    if ($("#titan-long-player-styles")) return;

    const style = document.createElement("style");

    style.id = "titan-long-player-styles";

    style.textContent = `
      #titan-long-video-modal {
        position: fixed;
        inset: 0;
        z-index: 1000001;
        display: none;
        overflow-y: auto;
        background: #050507;
        color: #f8fafc;
        padding: 0 0 35px;
      }

      #titan-long-video-modal.active {
        display: block;
      }

      .tlp-topbar {
        position: sticky;
        top: 0;
        z-index: 5;
        height: 54px;
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 0 15px;
        background: #080808;
        border-bottom: 1px solid #242424;
      }

      .tlp-back {
        border: 0;
        background: transparent;
        color: white;
        font-size: 26px;
        cursor: pointer;
      }

      .tlp-brand {
        font-weight: 900;
        font-size: 17px;
      }

      .tlp-brand span {
        color: #f59e0b;
      }

      .tlp-content {
        max-width: 900px;
        margin: 0 auto;
      }

      .tlp-video-box {
        width: 100%;
        background: black;
        aspect-ratio: 16 / 9;
        position: relative;
      }

      .tlp-video {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
        background: black;
      }

      .tlp-details {
        padding: 16px;
      }

      .tlp-title {
        font-size: 21px;
        line-height: 1.35;
        font-weight: 800;
        overflow-wrap: anywhere;
        margin-bottom: 12px;
      }

      .tlp-meta {
        color: #a1a1aa;
        font-size: 13px;
        margin-bottom: 16px;
      }

      .tlp-creator-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 15px 0;
      }

      .tlp-avatar {
        width: 43px;
        height: 43px;
        border-radius: 50%;
        background: #f59e0b;
        color: #111;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 900;
        flex-shrink: 0;
      }

      .tlp-creator-name {
        font-weight: 700;
        font-size: 14px;
      }

      .tlp-description {
        background: #18181b;
        border-radius: 12px;
        padding: 14px;
        font-size: 14px;
        line-height: 1.65;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .tlp-recommended-title {
        font-size: 19px;
        font-weight: 800;
        padding: 8px 16px 12px;
      }

      .tlp-video-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 18px;
        padding: 0 16px;
      }

      .tlp-video-card {
        display: grid;
        grid-template-columns: 44% 1fr;
        gap: 12px;
        align-items: start;
        cursor: pointer;
        border-radius: 10px;
      }

      .tlp-thumb {
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 9px;
        overflow: hidden;
        position: relative;
        background: #202024;
      }

      .tlp-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .tlp-thumb-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f59e0b;
        font-size: 26px;
      }

      .tlp-card-title {
        font-size: 14px;
        font-weight: 700;
        line-height: 1.4;
        overflow-wrap: anywhere;
        margin-bottom: 7px;
      }

      .tlp-card-meta {
        color: #a1a1aa;
        font-size: 11px;
        line-height: 1.6;
      }

      .tlp-no-videos {
        padding: 25px 16px;
        text-align: center;
        color: #a1a1aa;
      }

      @media (min-width: 700px) {
        .tlp-content {
          padding: 18px;
        }

        .tlp-details {
          padding-left: 0;
          padding-right: 0;
        }

        .tlp-video-list {
          padding: 0;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ================= PLAYER MODAL ================= */

  function createModal() {
    if ($("#titan-long-video-modal")) return;

    const modal = document.createElement("div");

    modal.id = "titan-long-video-modal";

    modal.innerHTML = `
      <div class="tlp-topbar">
        <button class="tlp-back" id="tlp-back" aria-label="Back">‹</button>
        <div class="tlp-brand">TITAN <span>AI</span></div>
      </div>

      <div class="tlp-content">
        <div class="tlp-video-box">
          <video
            id="tlp-main-video"
            class="tlp-video"
            controls
            playsinline
            preload="metadata"
          ></video>
        </div>

        <div class="tlp-details">
          <h1 class="tlp-title" id="tlp-main-title"></h1>

          <div class="tlp-meta" id="tlp-main-meta"></div>

          <div class="tlp-creator-row">
            <div class="tlp-avatar" id="tlp-avatar">T</div>
            <div class="tlp-creator-name" id="tlp-creator"></div>
          </div>

          <div class="tlp-description" id="tlp-description"></div>
        </div>

        <div class="tlp-recommended-title">
          Recommended Videos
        </div>

        <div class="tlp-video-list" id="tlp-video-list"></div>
      </div>
    `;

    document.body.appendChild(modal);

    $("#tlp-back").addEventListener("click", closePlayer);

    $("#tlp-main-video").addEventListener("ended", () => {
      // Keep the player open after a video ends.
    });
  }

  /* ================= THUMBNAILS ================= */

  function thumbnailURL(item) {
    const direct = safeURL(
      item.thumb || item.thumbnail || item.thumbnailUrl
    );

    if (direct) return direct;

    // Generate a thumbnail URL for supported Cloudinary videos.
    const videoURL = safeURL(item.url);

    if (videoURL && videoURL.includes("res.cloudinary.com")) {
      return videoURL.replace(
        "/upload/",
        "/upload/so_0,w_640,h_360,c_fill,q_auto,f_jpg/"
      ).replace(/\.(mp4|mov|webm)(\?.*)?$/i, ".jpg");
    }

    return "";
  }

  /* ================= RECOMMENDED ================= */

  function renderRecommended(currentItem) {
    const container = $("#tlp-video-list");
    if (!container) return;

    const list = getLongVideos()
      .filter(item => String(item.id) !== String(currentItem.id))
      .slice(0, 12);

    if (!list.length) {
      container.innerHTML = `
        <div class="tlp-no-videos">
          Abhi aur videos available nahi hain.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((item, index) => {
      const thumb = thumbnailURL(item);
      const title = escapeHTML(item.title || "Untitled Video");
      const creator = escapeHTML(creatorName(item));

      return `
        <article
          class="tlp-video-card"
          data-tlp-index="${index}"
          role="button"
          tabindex="0"
        >
          <div class="tlp-thumb">
            ${
              thumb
                ? `<img src="${escapeHTML(thumb)}" alt="${title}" loading="lazy">`
                : `<div class="tlp-thumb-placeholder">▶</div>`
            }
          </div>

          <div>
            <div class="tlp-card-title">${title}</div>
            <div class="tlp-card-meta">
              ${creator}<br>
              ${formatViews(item.views)} views · ${escapeHTML(formatTime(item.createdAt))}
            </div>
          </div>
        </article>
      `;
    }).join("");

    container.querySelectorAll("[data-tlp-index]").forEach(card => {
      const play = () => {
        const index = Number(card.getAttribute("data-tlp-index"));
        if (list[index]) openVideo(list[index]);
      };

      card.addEventListener("click", play);

      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          play();
        }
      });
    });
  }

  /* ================= OPEN VIDEO ================= */

  function openVideo(item) {
    if (!item) return;

    const url = safeURL(item.url);

    if (!url) {
      alert("Video URL valid nahi hai.");
      return;
    }

    createModal();

    const modal = $("#titan-long-video-modal");
    const video = $("#tlp-main-video");

    video.pause();
    video.src = url;
    video.load();

    $("#tlp-main-title").textContent =
      item.title || "TITAN AI Video";

    $("#tlp-main-meta").textContent =
      formatViews(item.views) +
      " views · " +
      formatTime(item.createdAt);

    const creator = creatorName(item);

    $("#tlp-creator").textContent = creator;
    $("#tlp-avatar").textContent =
      String(creator).trim().charAt(0).toUpperCase() || "T";

    $("#tlp-description").textContent =
      item.description || "No description available.";

    renderRecommended(item);

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    video.play().catch(() => {
      // Mobile browsers may require the user to tap Play.
    });
  }

  function closePlayer() {
    const modal = $("#titan-long-video-modal");
    const video = $("#tlp-main-video");

    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    if (modal) modal.classList.remove("active");

    document.body.style.overflow = "";
  }

  window.titanOpenLongVideo = function (urlOrItem) {
    if (urlOrItem && typeof urlOrItem === "object") {
      openVideo(urlOrItem);
      return;
    }

    const item = getLongVideos().find(
      video => safeURL(video.url) === safeURL(urlOrItem)
    );

    if (item) openVideo(item);
  };

  window.titanCloseLongVideo = closePlayer;

  /* ================= CONNECT TO FEED ================= */

  function connectFeedCards() {
    const home = $("#titan-extension-home");
    if (!home) return;

    home.querySelectorAll("[data-play]").forEach(card => {
      if (card.dataset.tlpConnected === "1") return;

      card.dataset.tlpConnected = "1";

      card.addEventListener("click", function (event) {
        // Do not open the long player for Shorts.
        const url = safeURL(card.getAttribute("data-play"));

        const item = getLongVideos().find(
          video => safeURL(video.url) === url
        );

        if (!item) return;

        event.preventDefault();
        event.stopPropagation();

        openVideo(item);
      }, true);
    });
  }

  function init() {
    addStyles();
    createModal();
    connectFeedCards();

    const observer = new MutationObserver(connectFeedCards);

    const home = $("#titan-extension-home");

    if (home) {
      observer.observe(home, {
        childList: true,
        subtree: true
      });
    }

    console.log("TITAN AI Long Video Player ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
