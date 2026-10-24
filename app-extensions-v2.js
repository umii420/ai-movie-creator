/**
 * PLATFORM: TITAN AI
 * VERSION: v5.1.0 - Creator Video Feed
 * FILE: app-extensions-v2.js
 */

(function () {
  "use strict";

  if (window.__TITAN_EXTENSIONS_V51__) return;
  window.__TITAN_EXTENSIONS_V51__ = true;

  const UPLOADS_KEY = "titan_user_uploads";
  const THEME_KEY = "theme_preference";
  const $ = (s, r = document) => r.querySelector(s);

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[c]);

  function mediaURL(value) {
    try {
      const u = new URL(String(value || ""), location.href);
      return ["https:", "http:"].includes(u.protocol) ? u.href : "";
    } catch (_) {
      return "";
    }
  }

  function uploads() {
    try {
      const v = JSON.parse(localStorage.getItem(UPLOADS_KEY) || "[]");
      return Array.isArray(v) ? v.filter(x => x && !x.draft) : [];
    } catch (_) {
      return [];
    }
  }

  function isShort(v) {
    return ["short", "shorts", "titan short"].includes(
      String(v.type || "").toLowerCase()
    );
  }

  function isLong(v) {
    return ["video", "long video", "long"].includes(
      String(v.type || "video").toLowerCase()
    );
  }

  function views(v) {
    const n = Math.max(0, Number(v) || 0);
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(n);
  }

  function timeAgo(value) {
    if (!value) return "TITAN AI";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "TITAN AI";

    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + " min ago";
    if (mins < 1440) return Math.floor(mins / 60) + " hours ago";
    if (mins < 43200) return Math.floor(mins / 1440) + " days ago";
    return d.toLocaleDateString();
  }

  function theme() {
    try {
      const light = localStorage.getItem(THEME_KEY) === "light";
      document.body.classList.toggle("light-mode", light);
    } catch (_) {}
  }

  function toggleTheme() {
    const light = document.body.classList.contains("light-mode");
    try {
      localStorage.setItem(THEME_KEY, light ? "dark" : "light");
    } catch (_) {}
    document.body.classList.toggle("light-mode", !light);
  }

  function styles() {
    if ($("#titan-v51-style")) return;

    const s = document.createElement("style");
    s.id = "titan-v51-style";
    s.textContent = `
      :root {
        --titan-gold:#f59e0b;
        --titan-bg:#050507;
        --titan-card:#0d0e12;
        --titan-text:#f8fafc;
        --titan-muted:#9ca3af;
        --titan-border:rgba(255,255,255,.09);
      }
      body.light-mode {
        --titan-bg:#f8fafc;
        --titan-card:#fff;
        --titan-text:#111827;
        --titan-muted:#64748b;
        --titan-border:rgba(0,0,0,.1);
      }
      #titan-extension-home {
        max-width:720px;width:100%;margin:0 auto;
        padding:12px 12px 110px;box-sizing:border-box;
        color:var(--titan-text);
      }
      #titan-extension-home * {box-sizing:border-box}
      #titan-extension-home [hidden] {display:none!important}
      .titan-header {
        display:flex;align-items:center;justify-content:space-between;
        gap:10px;margin-bottom:16px;
      }
      .titan-brand {display:flex;align-items:center;gap:9px}
      .titan-logo-svg {width:38px;height:38px;flex-shrink:0}
      .titan-brand-text {font-size:19px;font-weight:900;color:var(--titan-text)}
      .titan-brand-text span {color:var(--titan-gold)}
      .titan-header-actions {display:flex;gap:8px}
      .titan-icon-btn {
        width:40px;height:40px;border-radius:50%;
        border:1px solid var(--titan-border);
        background:var(--titan-card);color:var(--titan-text);
        display:flex;align-items:center;justify-content:center;cursor:pointer;
      }
      .titan-chips {
        display:flex;gap:8px;overflow-x:auto;padding-bottom:14px;
        scrollbar-width:none;
      }
      .titan-chips::-webkit-scrollbar {display:none}
      .titan-chip {
        flex-shrink:0;padding:9px 15px;border-radius:25px;
        border:1px solid var(--titan-border);
        background:var(--titan-card);color:var(--titan-text);
        font-size:13px;font-weight:600;cursor:pointer;
      }
      .titan-chip.active {background:var(--titan-gold);color:#111;border-color:var(--titan-gold)}
      .titan-section {margin:22px 0}
      .titan-section-title {
        display:flex;align-items:center;justify-content:space-between;
        gap:8px;margin-bottom:12px;font-size:16px;font-weight:800;
      }
      .titan-section-title span {font-size:11px;color:var(--titan-muted);font-weight:500}
      .titan-grid {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .titan-card {
        min-width:0;background:var(--titan-card);
        border:1px solid var(--titan-border);border-radius:13px;overflow:hidden;
      }
      .titan-thumb {
        position:relative;aspect-ratio:16/9;background:#191919;
        cursor:pointer;overflow:hidden;
      }
      .titan-thumb img {width:100%;height:100%;object-fit:cover;display:block}
      .titan-placeholder {
        width:100%;height:100%;display:flex;align-items:center;
        justify-content:center;color:var(--titan-gold);font-size:30px;
      }
      .titan-play {
        position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
        width:42px;height:42px;border-radius:50%;background:#000b;color:#fff;
        display:flex;align-items:center;justify-content:center;pointer-events:none;
      }
      .titan-card-info {padding:10px}
      .titan-card-info h3 {
        margin:0 0 6px;font-size:13px;line-height:1.4;
        font-weight:700;overflow-wrap:anywhere;color:var(--titan-text);
      }
      .titan-card-info p {margin:0;color:var(--titan-muted);font-size:11px;line-height:1.5}
      .titan-empty {
        grid-column:1/-1;text-align:center;padding:28px 12px;
        color:var(--titan-muted);border:1px dashed var(--titan-border);
        border-radius:13px;font-size:13px;
      }
      .titan-bottom-nav {
        position:fixed;bottom:0;left:0;right:0;z-index:999;
        display:flex;justify-content:space-around;align-items:center;
        padding:8px 5px 18px;background:var(--titan-card);
        border-top:1px solid var(--titan-border);
      }
      .titan-nav-item {
        flex:1;min-height:50px;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:3px;
        background:none;border:0;color:var(--titan-muted);
        font-size:11px;cursor:pointer;
      }
      .titan-nav-item i {font-size:20px}
      .titan-nav-item.active {color:var(--titan-gold)}
      .titan-nav-item.center {position:relative;top:-7px}
      .titan-plus {
        width:49px;height:49px;border-radius:50%;
        background:var(--titan-gold);color:#111;
        display:flex;align-items:center;justify-content:center;font-size:23px;
      }
      #titan-player-modal {
        position:fixed;inset:0;z-index:99999;background:#000f;
        display:none;align-items:center;justify-content:center;padding:15px;
      }
      .titan-player-box {width:100%;max-width:900px;position:relative;background:#111;border-radius:12px;overflow:hidden}
      .titan-player-close {
        position:absolute;right:9px;top:9px;z-index:2;width:40px;height:40px;
        border:0;border-radius:50%;background:#333;color:#fff;font-size:22px;cursor:pointer;
      }
      .titan-player-video {display:block;width:100%;max-height:75vh;background:#000}
      .titan-player-title {padding:12px;color:#fff;font-weight:600;overflow-wrap:anywhere}
      @media(max-width:360px) {
        #titan-extension-home {padding-left:8px;padding-right:8px}
        .titan-grid {gap:8px}
        .titan-card-info {padding:8px}
      }
    `;
    document.head.appendChild(s);
  }

  function player(url, title) {
    const src = mediaURL(url);
    if (!src) return alert("Video URL valid nahi hai.");

    let modal = $("#titan-player-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "titan-player-modal";
      modal.innerHTML = `
        <div class="titan-player-box">
          <button class="titan-player-close" id="titan-player-close">×</button>
          <video id="titan-player" class="titan-player-video" controls playsinline preload="metadata"></video>
          <div id="titan-player-title" class="titan-player-title"></div>
        </div>`;
      document.body.appendChild(modal);

      modal.addEventListener("click", e => {
        if (e.target === modal || e.target.id === "titan-player-close") closePlayer();
      });
    }

    const video = $("#titan-player");
    video.src = src;
    $("#titan-player-title").textContent = title || "TITAN AI Video";
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    video.play().catch(() => {});
  }

  function closePlayer() {
    const modal = $("#titan-player-modal");
    const video = $("#titan-player");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "";
  }

  window.playTitanFeedVideo = player;
  window.closeTitanFeedVideo = closePlayer;

  function renderGrid(selector, list) {
    const grid = $(selector);
    if (!grid) return;

    const valid = (Array.isArray(list) ? list : []).filter(v =>
      v && mediaURL(v.url)
    );

    if (!valid.length) {
      grid.innerHTML = `<div class="titan-empty">Abhi koi video nahi hai.</div>`;
      return;
    }

    grid.innerHTML = valid.map(v => {
      const title = esc(v.title || "Untitled Video");
      const url = esc(mediaURL(v.url));
      const thumb = mediaURL(v.thumb || v.thumbnail || v.thumbnailUrl);
      const image = thumb
        ? `<img src="${esc(thumb)}" alt="${title}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
           <div class="titan-placeholder" style="display:none"><i class="fa-solid fa-film"></i></div>`
        : `<div class="titan-placeholder"><i class="fa-solid fa-film"></i></div>`;

      return `
        <article class="titan-card">
          <div class="titan-thumb" data-play="${url}" data-title="${title}" role="button" tabindex="0">
            ${image}
            <div class="titan-play"><i class="fa-solid fa-play"></i></div>
          </div>
          <div class="titan-card-info">
            <h3>${title}</h3>
            <p><i class="fa-regular fa-eye"></i> ${views(v.views)} views · ${esc(timeAgo(v.createdAt))}</p>
          </div>
        </article>`;
    }).join("");
  }

  function refreshFeeds() {
    const all = uploads();
    const long = all.filter(isLong);
    const shorts = all.filter(isShort);

    long.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    shorts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    renderGrid("#titan-trending", long.slice(0, 4));
    renderGrid("#titan-recommended", long.slice(4, 8));
    renderGrid("#titan-latest", long);
    renderGrid("#titan-shorts-grid", shorts);
  }

  window.titanRefreshVideoFeeds = refreshFeeds;

  function createHome() {
    const old = $("#titan-extension-home");
    if (old) old.remove();

    const home = document.createElement("section");
    home.id = "titan-extension-home";

    home.innerHTML = `
      <header class="titan-header">
        <div class="titan-brand">
          <svg class="titan-logo-svg" viewBox="0 0 100 100" fill="none">
            <defs><linearGradient id="titan-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient></defs>
            <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" stroke="url(#titan-gold)" stroke-width="6"/>
            <text x="50" y="64" text-anchor="middle" font-size="38" font-weight="900" fill="url(#titan-gold)" font-family="Arial Black,Arial">T</text>
          </svg>
          <div class="titan-brand-text">TITAN <span>AI</span></div>
        </div>
        <div class="titan-header-actions">
          <button class="titan-icon-btn" data-theme aria-label="Theme"><i class="fa-solid fa-moon"></i></button>
          <button class="titan-icon-btn" data-search aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
      </header>

      <div class="titan-chips">
        <button class="titan-chip active" data-filter="all">All</button>
        <button class="titan-chip" data-filter="movies">AI Movies</button>
        <button class="titan-chip" data-filter="shorts">Shorts</button>
        <button class="titan-chip" data-filter="gaming">Gaming</button>
        <button class="titan-chip" data-filter="music">Music</button>
      </div>

      <section class="titan-section" data-feed-section="long">
        <div class="titan-section-title"><div><i class="fa-solid fa-fire" style="color:var(--titan-gold)"></i> Trending Now</div><span>POPULAR</span></div>
        <div class="titan-grid" id="titan-trending"></div>
      </section>

      <section class="titan-section" data-feed-section="long">
        <div class="titan-section-title"><div><i class="fa-solid fa-star" style="color:var(--titan-gold)"></i> Recommended For You</div><span>FOR YOU</span></div>
        <div class="titan-grid" id="titan-recommended"></div>
      </section>

      <section class="titan-section" data-feed-section="long">
        <div class="titan-section-title"><div><i class="fa-solid fa-users" style="color:var(--titan-gold)"></i> Latest from Creators</div><span>NEW</span></div>
        <div class="titan-grid" id="titan-latest"></div>
      </section>

      <section class="titan-section" data-feed-section="shorts" id="titan-shorts-section" hidden>
        <div class="titan-section-title"><div><i class="fa-solid fa-bolt" style="color:var(--titan-gold)"></i> TITAN Shorts</div><span>SHORT VIDEOS</span></div>
        <div class="titan-grid" id="titan-shorts-grid"></div>
      </section>

      <nav class="titan-bottom-nav">
        <button class="titan-nav-item active" data-nav="home"><i class="fa-solid fa-house"></i><span>Home</span></button>
        <button class="titan-nav-item" data-nav="shorts"><i class="fa-solid fa-bolt"></i><span>Shorts</span></button>
        <button class="titan-nav-item center" data-nav="plus"><div class="titan-plus"><i class="fa-solid fa-plus"></i></div></button>
        <button class="titan-nav-item" data-nav="studio"><i class="fa-solid fa-clapperboard"></i><span>Studio</span></button>
        <button class="titan-nav-item" data-nav="profile"><i class="fa-solid fa-user"></i><span>Profile</span></button>
      </nav>`;

    (document.querySelector(".features-section") || document.body).appendChild(home);
  }

  function showFeed(filter) {
    const shortsOnly = filter === "shorts";

    document.querySelectorAll("#titan-extension-home [data-feed-section]").forEach(section => {
      section.hidden = shortsOnly
        ? section.getAttribute("data-feed-section") !== "shorts"
        : section.getAttribute("data-feed-section") === "shorts";
    });

    document.querySelectorAll("#titan-extension-home [data-filter]").forEach(button => {
      button.classList.toggle("active", button.getAttribute("data-filter") === filter);
    });
  }

  document.addEventListener("click", function (e) {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    if (target.closest("[data-theme]")) {
      toggleTheme();
      return;
    }

    const playButton = target.closest("[data-play]");
    if (playButton) {
      player(playButton.getAttribute("data-play"), playButton.getAttribute("data-title"));
      return;
    }

    const filterButton = target.closest("[data-filter]");
    if (filterButton) {
      showFeed(filterButton.getAttribute("data-filter"));
      refreshFeeds();
      return;
    }

    if (target.closest("[data-search]")) {
      const q = prompt("Video ka naam likhein:");
      if (q && q.trim()) {
        const found = uploads().filter(v =>
          String(v.title || "").toLowerCase().includes(q.trim().toLowerCase())
        );
        renderGrid("#titan-trending", found.filter(isLong));
        renderGrid("#titan-recommended", []);
        renderGrid("#titan-latest", found.filter(isShort));
        showFeed("all");
      }
      return;
    }

    const navButton = target.closest("[data-nav]");
    if (!navButton) return;

    const nav = navButton.getAttribute("data-nav");

    document.querySelectorAll("#titan-extension-home [data-nav]").forEach(button => {
      button.classList.toggle("active", button === navButton);
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
      } else if (typeof window.openTitanCreatorCenter === "function") {
        window.openTitanCreatorCenter();
      } else if (typeof window.openTitanUploadStudio === "function") {
        window.openTitanUploadStudio();
      } else {
        alert("Upload system abhi ready nahi hai.");
      }
    }

    if (nav === "studio") {
      if (typeof window.openTitanStudioGemini === "function") {
        window.openTitanStudioGemini();
      } else {
        alert("Studio abhi ready nahi hai.");
      }
    }

    if (nav === "profile") {
      if (typeof window.openTitanProfile === "function") {
        window.openTitanProfile();
      } else if (typeof window.openProfilePage === "function") {
        window.openProfilePage();
      } else {
        alert("Profile abhi ready nahi hai.");
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (!(e.target instanceof Element)) return;

    const card = e.target.closest(".titan-thumb[data-play]");
    if (!card) return;

    e.preventDefault();
    player(card.getAttribute("data-play"), card.getAttribute("data-title"));
  });

  function init() {
    try {
      theme();
      styles();
      createHome();
      refreshFeeds();
      window.addEventListener("titan:uploads-updated", refreshFeeds);
      console.log("TITAN AI v5.1.0 ready");
    } catch (error) {
      console.error("TITAN AI init error:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
