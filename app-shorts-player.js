/**
 * TITAN AI - TikTok Style Shorts Player
 * FILE: app-shorts-player.js
 * VERSION: 1.0.0
 */

(function () {
  "use strict";

  if (window.__TITAN_SHORTS_PLAYER__) return;
  window.__TITAN_SHORTS_PLAYER__ = true;

  const UPLOADS_KEY = "titan_user_uploads";
  const PROFILE_KEY = "titan_user_profile";

  const $ = (s, r = document) => r.querySelector(s);

  let shorts = [];
  let currentIndex = 0;
  let isMuted = true;
  let touchStartY = 0;
  let touchStartX = 0;
  let touchEndY = 0;
  let isOpen = false;

  function getUploads() {
    try {
      const data = JSON.parse(
        localStorage.getItem(UPLOADS_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
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

  function safeURL(value) {
    try {
      const url = new URL(String(value || ""), location.href);

      return ["https:", "http:"].includes(url.protocol)
        ? url.href
        : "";
    } catch (_) {
      return "";
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }

  function getShorts() {
    return getUploads()
      .filter(item => {
        const type = String(item.type || "").toLowerCase();

        return (
          !item.draft &&
          ["short", "shorts", "titan short"].includes(type) &&
          !!safeURL(item.url)
        );
      })
      .sort((a, b) => {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      });
  }

  function injectStyles() {
    if ($("#titan-shorts-player-style")) return;

    const style = document.createElement("style");

    style.id = "titan-shorts-player-style";

    style.textContent = `
      #titan-shorts-fullscreen {
        position: fixed;
        inset: 0;
        z-index: 1000000;
        background: #000;
        color: #fff;
        display: none;
        overflow: hidden;
        font-family: Arial, sans-serif;
        touch-action: pan-x;
      }

      #titan-shorts-fullscreen.active {
        display: block;
      }

      .tsp-video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
      }

      .tsp-top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: max(18px, env(safe-area-inset-top)) 16px 35px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 5;
        background: linear-gradient(#0009, transparent);
      }

      .tsp-top button,
      .tsp-action {
        border: 0;
        color: #fff;
        background: transparent;
        cursor: pointer;
        text-shadow: 0 1px 4px #000;
      }

      .tsp-close {
        font-size: 30px;
        width: 42px;
        height: 42px;
      }

      .tsp-brand {
        font-size: 17px;
        font-weight: 900;
      }

      .tsp-brand span {
        color: #f59e0b;
      }

      .tsp-actions {
        position: absolute;
        right: 12px;
        bottom: 115px;
        z-index: 5;
        display: flex;
        flex-direction: column;
        gap: 23px;
        align-items: center;
      }

      .tsp-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        min-width: 48px;
      }

      .tsp-action .tsp-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff24;
        font-size: 24px;
      }

      .tsp-action.liked .tsp-icon {
        color: #ff3158;
      }

      .tsp-bottom {
        position: absolute;
        left: 0;
        right: 70px;
        bottom: 0;
        z-index: 5;
        padding: 50px 16px max(28px, env(safe-area-inset-bottom));
        background: linear-gradient(transparent, #000c);
      }

      .tsp-creator {
        font-size: 15px;
        font-weight: 800;
        margin-bottom: 8px;
      }

      .tsp-caption {
        font-size: 14px;
        line-height: 1.45;
        overflow-wrap: anywhere;
        max-height: 100px;
        overflow-y: auto;
      }

      .tsp-hint {
        margin-top: 10px;
        font-size: 11px;
        color: #ffffffb8;
      }

      .tsp-progress {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: #ffffff35;
        z-index: 7;
      }

      .tsp-progress-bar {
        height: 100%;
        width: 0%;
        background: #f59e0b;
      }

      .tsp-sound {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 4;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        background: #0008;
        color: white;
        font-size: 28px;
        pointer-events: none;
      }

      .tsp-sound.show {
        display: flex;
      }

      .tsp-empty {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 25px;
      }

      .tsp-empty button {
        margin-top: 16px;
        padding: 12px 20px;
        border: 0;
        border-radius: 25px;
        background: #f59e0b;
        color: #111;
        font-weight: bold;
      }

      .tsp-comment-panel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background: #171717;
        border-radius: 18px 18px 0 0;
        padding: 22px 16px max(22px, env(safe-area-inset-bottom));
        display: none;
      }

      .tsp-comment-panel.open {
        display: block;
      }

      .tsp-comment-panel h3 {
        margin: 0 0 12px;
      }

      .tsp-comment-panel p {
        font-size: 13px;
        color: #ccc;
        line-height: 1.5;
      }

      @media (min-width: 700px) {
        #titan-shorts-fullscreen {
          max-width: 480px;
          left: 50%;
          right: auto;
          width: 100%;
          transform: translateX(-50%);
          border-left: 1px solid #222;
          border-right: 1px solid #222;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createPlayer() {
    if ($("#titan-shorts-fullscreen")) return;

    const root = document.createElement("div");

    root.id = "titan-shorts-fullscreen";

    root.innerHTML = `
      <video
        class="tsp-video"
        id="tsp-video"
        playsinline
        webkit-playsinline
        preload="metadata"
      ></video>

      <div class="tsp-top">
        <button class="tsp-close" id="tsp-close" aria-label="Close">‹</button>
        <div class="tsp-brand">TITAN <span>SHORTS</span></div>
        <button id="tsp-mute" aria-label="Sound">🔇</button>
      </div>

      <div class="tsp-sound" id="tsp-sound">▶</div>

      <div class="tsp-actions">
        <button class="tsp-action" id="tsp-like">
          <span class="tsp-icon">♥</span>
          <span id="tsp-likes">Like</span>
        </button>

        <button class="tsp-action" id="tsp-comment">
          <span class="tsp-icon">💬</span>
          <span>Comment</span>
        </button>

        <button class="tsp-action" id="tsp-share">
          <span class="tsp-icon">↗</span>
          <span>Share</span>
        </button>
      </div>

      <div class="tsp-bottom">
        <div class="tsp-creator" id="tsp-creator"></div>
        <div class="tsp-caption" id="tsp-caption"></div>
        <div class="tsp-hint">Swipe up ↑ for next Short</div>
      </div>

      <div class="tsp-progress">
        <div class="tsp-progress-bar" id="tsp-progress-bar"></div>
      </div>

      <div class="tsp-comment-panel" id="tsp-comment-panel">
        <h3>Comments</h3>
        <p>Comments system abhi connect nahi hai.</p>
        <button id="tsp-close-comments">Close</button>
      </div>
    `;

    document.body.appendChild(root);

    $("#tsp-close").addEventListener("click", close);
    $("#tsp-mute").addEventListener("click", toggleMute);
    $("#tsp-like").addEventListener("click", like);
    $("#tsp-comment").addEventListener("click", showComments);
    $("#tsp-share").addEventListener("click", share);
    $("#tsp-close-comments").addEventListener("click", () => {
      $("#tsp-comment-panel").classList.remove("open");
    });

    const video = $("#tsp-video");

    video.addEventListener("timeupdate", updateProgress);

    video.addEventListener("ended", () => {
      if (currentIndex < shorts.length - 1) {
        showShort(currentIndex + 1);
      }
    });

    video.addEventListener("click", togglePlay);

    root.addEventListener("touchstart", onTouchStart, {
      passive: true
    });

    root.addEventListener("touchend", onTouchEnd, {
      passive: true
    });

    root.addEventListener("wheel", onWheel, {
      passive: false
    });

    document.addEventListener("keydown", onKeyDown);
  }

  function open(index = 0) {
    shorts = getShorts();

    if (!shorts.length) {
      alert("Abhi koi Short upload nahi hui. Pehle Short upload karein.");
      return;
    }

    createPlayer();

    currentIndex = Math.max(
      0,
      Math.min(index, shorts.length - 1)
    );

    isMuted = true;
    isOpen = true;

    const root = $("#titan-shorts-fullscreen");
    root.classList.add("active");
    document.body.style.overflow = "hidden";

    showShort(currentIndex);
  }

  function showShort(index) {
    if (!shorts.length) return;

    currentIndex = Math.max(
      0,
      Math.min(index, shorts.length - 1)
    );

    const item = shorts[currentIndex];
    const video = $("#tsp-video");

    video.pause();
    video.src = safeURL(item.url);
    video.muted = isMuted;
    video.currentTime = 0;

    $("#tsp-creator").textContent =
      "@" + (getProfile().handle || getProfile().name || "titancreator");

    $("#tsp-caption").textContent =
      item.description || item.title || "TITAN AI Short";

    $("#tsp-mute").textContent = isMuted ? "🔇" : "🔊";
    $("#tsp-progress-bar").style.width = "0%";
    $("#tsp-comment-panel").classList.remove("open");

    video.play().catch(() => {
      // Browser autoplay policy may require a tap.
    });
  }

  function close() {
    const root = $("#titan-shorts-fullscreen");
    const video = $("#tsp-video");

    isOpen = false;

    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    if (root) root.classList.remove("active");

    document.body.style.overflow = "";
  }

  function toggleMute() {
    const video = $("#tsp-video");
    if (!video) return;

    isMuted = !isMuted;
    video.muted = isMuted;

    $("#tsp-mute").textContent = isMuted ? "🔇" : "🔊";
  }

  function togglePlay() {
    const video = $("#tsp-video");
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      $("#tsp-sound").textContent = "▶";
    } else {
      video.pause();
      $("#tsp-sound").textContent = "Ⅱ";
    }

    const icon = $("#tsp-sound");
    icon.classList.add("show");

    setTimeout(() => icon.classList.remove("show"), 500);
  }

  function like() {
    const button = $("#tsp-like");

    button.classList.toggle("liked");

    $("#tsp-likes").textContent =
      button.classList.contains("liked") ? "Liked" : "Like";
  }

  function showComments() {
    $("#tsp-comment-panel").classList.add("open");
  }

  async function share() {
    const item = shorts[currentIndex];
    if (!item) return;

    const shareData = {
      title: item.title || "TITAN AI Short",
      text: item.description || "Watch this Short on TITAN AI",
      url: location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied!");
      } else {
        prompt("Share this page:", shareData.url);
      }
    } catch (_) {}
  }

  function updateProgress() {
    const video = $("#tsp-video");

    if (!video || !video.duration) return;

    const percentage =
      (video.currentTime / video.duration) * 100;

    $("#tsp-progress-bar").style.width =
      percentage + "%";
  }

  function onTouchStart(event) {
    touchStartY = event.changedTouches[0].clientY;
    touchStartX = event.changedTouches[0].clientX;
  }

  function onTouchEnd(event) {
    touchEndY = event.changedTouches[0].clientY;

    const endX = event.changedTouches[0].clientX;
    const deltaY = touchStartY - touchEndY;
    const deltaX = Math.abs(touchStartX - endX);

    if (deltaX > Math.abs(deltaY)) return;

    if (deltaY > 55) {
      if (currentIndex < shorts.length - 1) {
        showShort(currentIndex + 1);
      }
    } else if (deltaY < -55) {
      if (currentIndex > 0) {
        showShort(currentIndex - 1);
      }
    }
  }

  let lastWheel = 0;

  function onWheel(event) {
    if (!isOpen) return;

    const now = Date.now();

    if (now - lastWheel < 650) return;

    if (Math.abs(event.deltaY) < 25) return;

    event.preventDefault();
    lastWheel = now;

    if (event.deltaY > 0 && currentIndex < shorts.length - 1) {
      showShort(currentIndex + 1);
    } else if (event.deltaY < 0 && currentIndex > 0) {
      showShort(currentIndex - 1);
    }
  }

  function onKeyDown(event) {
    if (!isOpen) return;

    if (event.key === "Escape") {
      close();
    }

    if (
      event.key === "ArrowDown" &&
      currentIndex < shorts.length - 1
    ) {
      showShort(currentIndex + 1);
    }

    if (
      event.key === "ArrowUp" &&
      currentIndex > 0
    ) {
      showShort(currentIndex - 1);
    }
  }

  /*
   * Public function for existing TITAN AI buttons.
   */
  window.titanOpenShortsPlayer = open;
  window.titanCloseShortsPlayer = close;

  /*
   * Connect Shorts buttons without changing other systems.
   */
  document.addEventListener("click", function (event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const nav = target.closest('[data-nav="shorts"]');

    if (nav) {
      event.preventDefault();
      event.stopImmediatePropagation();
      open(0);
      return;
    }

    const card = target.closest("[data-play]");

    if (!card) return;

    const url = card.getAttribute("data-play");

    const item = getShorts().find(v => safeURL(v.url) === url);

    if (item) {
      event.preventDefault();
      event.stopImmediatePropagation();
      open(getShorts().indexOf(item));
    }
  }, true);

  function init() {
    injectStyles();
    createPlayer();
    console.log("TITAN AI Shorts Player ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
