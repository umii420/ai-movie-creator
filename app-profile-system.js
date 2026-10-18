/* ==========================================================
   TITAN AI — PROFILE, EDIT PROFILE, SETTINGS & VIDEO PLAYER
   File: app-profile-system.js
   Google Login / Groq AI Script Generator: NOT MODIFIED
   ========================================================== */

(function () {
  "use strict";

  if (window.__TITAN_PROFILE_SYSTEM_V8__) return;
  window.__TITAN_PROFILE_SYSTEM_V8__ = true;

  const PROFILE_KEY = "titan_user_profile";
  const UPLOADS_KEY = "titan_user_uploads";
  const STYLE_ID = "titan-profile-styles-v8";

  let activeTab = "videos";
  let currentPlayerUrl = "";

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeURL(value) {
    try {
      const url = new URL(String(value || ""), window.location.href);

      if (
        url.protocol === "https:" ||
        url.protocol === "http:" ||
        url.protocol === "blob:"
      ) {
        return url.href;
      }
    } catch (_) {}

    return "";
  }

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn("TITAN storage read error:", key, error);
      return fallback;
    }
  }

  function getUserProfileData() {
    const saved = readJSON(PROFILE_KEY, {});

    const profile =
      saved && typeof saved === "object" && !Array.isArray(saved)
        ? saved
        : {};

    return {
      ...profile,
      name: profile.name || profile.displayName || "TITAN Creator",
      handle: profile.handle || "@titancreator",
      bio: profile.bio || "",
      photoURL: profile.photoURL || profile.photo || "",
      ytLink: profile.ytLink || "",
      followers: Number(profile.followers) || 0,
      following: Number(profile.following) || 0,
      likes: Number(profile.likes) || 0
    };
  }

  function saveUserProfileData(changes) {
    const oldProfile = readJSON(PROFILE_KEY, {});
    const profile =
      oldProfile && typeof oldProfile === "object" ? oldProfile : {};

    const updated = { ...profile, ...changes };

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error("TITAN profile save error:", error);
      alert("Profile save nahi hua. Browser storage check karein.");
      return false;
    }
  }

  function getUploads() {
    const uploads = readJSON(UPLOADS_KEY, []);
    return Array.isArray(uploads) ? uploads : [];
  }

  function formatNumber(value) {
    const n = Number(value) || 0;

    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";

    return String(n);
  }

  function getInitials(name) {
    return String(name || "T")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  }

  /* ---------------------- CSS ---------------------- */

  function installStyles() {
    if ($("#" + STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .titan-profile-overlay,
      .titan-player-overlay,
      .titan-edit-overlay,
      .titan-settings-overlay {
        position:fixed;
        inset:0;
        z-index:99990;
        display:none;
        overflow-y:auto;
        background:rgba(3,4,8,.96);
        color:#f5f5f7;
        font-family:Inter,Arial,sans-serif;
        -webkit-overflow-scrolling:touch;
      }

      .titan-profile-overlay.titan-visible,
      .titan-player-overlay.titan-visible,
      .titan-edit-overlay.titan-visible,
      .titan-settings-overlay.titan-visible {
        display:block;
      }

      .titan-profile-shell,
      .titan-settings-shell {
        width:min(100%,760px);
        margin:0 auto;
        padding:20px 16px 100px;
      }

      .titan-topbar {
        display:flex;
        align-items:center;
        gap:12px;
        margin-bottom:24px;
      }

      .titan-topbar h2 {
        flex:1;
        margin:0;
        font-size:20px;
      }

      .titan-icon-button {
        width:42px;
        height:42px;
        border:1px solid #30313a;
        border-radius:50%;
        background:#14151b;
        color:#fff;
        font-size:19px;
        cursor:pointer;
      }

      .titan-profile-heading {
        display:flex;
        align-items:center;
        gap:18px;
        margin-bottom:20px;
      }

      .titan-avatar {
        width:94px;
        height:94px;
        flex-shrink:0;
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
        border-radius:50%;
        background:#22242c;
        border:2px solid #f59e0b;
        color:#f59e0b;
        font-size:25px;
        font-weight:800;
      }

      .titan-avatar img {
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .titan-profile-numbers {
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin:20px 0;
      }

      .titan-profile-number {
        flex:1;
        text-align:center;
        padding:12px 4px;
        border-radius:12px;
        background:#121319;
      }

      .titan-profile-number strong {
        display:block;
        font-size:18px;
      }

      .titan-profile-number span {
        display:block;
        margin-top:4px;
        color:#a1a1aa;
        font-size:12px;
      }

      .titan-profile-bio {
        color:#d4d4d8;
        line-height:1.6;
        white-space:pre-wrap;
        overflow-wrap:anywhere;
      }

      .titan-profile-link {
        display:inline-block;
        margin-top:8px;
        color:#38bdf8;
        overflow-wrap:anywhere;
      }

      .titan-profile-actions {
        display:flex;
        gap:10px;
        margin:18px 0 24px;
      }

      .titan-btn {
        flex:1;
        min-height:42px;
        padding:10px 14px;
        border:0;
        border-radius:10px;
        background:#f59e0b;
        color:#111;
        font-weight:750;
        cursor:pointer;
      }

      .titan-btn.secondary {
        background:#20212a;
        color:#fff;
        border:1px solid #353640;
      }

      .titan-profile-tabs {
        display:flex;
        border-bottom:1px solid #292a32;
        margin-bottom:16px;
      }

      .titan-profile-tab {
        flex:1;
        padding:14px 6px;
        background:none;
        color:#a1a1aa;
        border:0;
        border-bottom:2px solid transparent;
        cursor:pointer;
      }

      .titan-profile-tab.active {
        color:#f59e0b;
        border-bottom-color:#f59e0b;
      }

      .titan-video-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:5px;
      }

      .titan-video-card {
        position:relative;
        min-width:0;
        aspect-ratio:9/13;
        overflow:hidden;
        border:0;
        border-radius:6px;
        background:#181920;
        color:#fff;
        padding:0;
        text-align:left;
        cursor:pointer;
      }

      .titan-video-card img,
      .titan-video-card video {
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
      }

      .titan-video-card .titan-video-title {
        position:absolute;
        right:0;
        bottom:0;
        left:0;
        padding:26px 7px 8px;
        background:linear-gradient(transparent,rgba(0,0,0,.9));
        font-size:12px;
        overflow-wrap:anywhere;
      }

      .titan-empty-state {
        grid-column:1/-1;
        padding:42px 15px;
        text-align:center;
        color:#a1a1aa;
      }

      .titan-form-group {
        margin-bottom:16px;
      }

      .titan-form-group label {
        display:block;
        margin-bottom:7px;
        color:#d4d4d8;
        font-size:13px;
      }

      .titan-form-group input,
      .titan-form-group textarea {
        width:100%;
        box-sizing:border-box;
        padding:12px;
        border:1px solid #383944;
        border-radius:10px;
        background:#111218;
        color:#fff;
        font:inherit;
        outline:none;
      }

      .titan-form-group textarea {
        min-height:100px;
        resize:vertical;
      }

      .titan-settings-row {
        display:flex;
        align-items:center;
        gap:12px;
        width:100%;
        padding:16px 4px;
        border:0;
        border-bottom:1px solid #282932;
        background:transparent;
        color:#f5f5f7;
        text-align:left;
        font-size:15px;
        cursor:pointer;
      }

      .titan-settings-row span:first-child {
        width:26px;
        color:#f59e0b;
        text-align:center;
      }

      .titan-settings-row .titan-row-arrow {
        margin-left:auto;
        color:#777985;
      }

      .titan-player-content {
        min-height:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        padding:18px;
        box-sizing:border-box;
      }

      .titan-player-video {
        width:min(100%,900px);
        max-height:75vh;
        background:#000;
        border-radius:12px;
      }

      .titan-player-title {
        width:min(100%,900px);
        overflow-wrap:anywhere;
        margin-top:14px;
      }

      .titan-small-note {
        margin:10px 0 18px;
        color:#a1a1aa;
        font-size:12px;
        line-height:1.5;
      }

      @media(max-width:480px) {
        .titan-profile-heading { gap:12px; }
        .titan-avatar { width:76px; height:76px; }
        .titan-profile-shell,
        .titan-settings-shell { padding:16px 12px 90px; }
      }
    `;

    document.head.appendChild(style);
  }

  /* ---------------------- Overlay creation ---------------------- */

  function createOverlay(id, className) {
    let overlay = $("#" + id);

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = id;
      overlay.className = className;
      document.body.appendChild(overlay);
    }

    return overlay;
  }

  function closeAllTitanOverlays() {
    document
      .querySelectorAll(
        ".titan-profile-overlay,.titan-player-overlay," +
        ".titan-edit-overlay,.titan-settings-overlay"
      )
      .forEach(el => el.classList.remove("titan-visible"));
  }

  function closeTitanProfile() {
    const el = $("#titanProfileOverlay");
    if (el) el.classList.remove("titan-visible");
  }

  window.closeTitanProfile = closeTitanProfile;

  /* ---------------------- Profile page ---------------------- */

  function renderVideoGrid() {
    const grid = $("#titanProfileVideoGrid");
    if (!grid) return;

    grid.replaceChildren();

    const uploads = getUploads();

    if (activeTab !== "videos") {
      const empty = document.createElement("div");
      empty.className = "titan-empty-state";
      empty.textContent =
        activeTab === "likes"
          ? "Liked videos ka section abhi available nahi hai."
          : "Saved videos ka section abhi available nahi hai.";

      grid.appendChild(empty);
      return;
    }

    if (!uploads.length) {
      const empty = document.createElement("div");
      empty.className = "titan-empty-state";
      empty.innerHTML =
        '<div style="font-size:35px;margin-bottom:12px">▣</div>' +
        "<strong>Abhi koi video upload nahi hui</strong>" +
        '<p style="font-size:13px">Plus button se apni pehli video upload karein.</p>';

      grid.appendChild(empty);
      return;
    }

    uploads.slice().reverse().forEach((vid, index) => {
      if (!vid || !vid.url) return;

      const url = safeURL(vid.url);
      if (!url) return;

      const card = document.createElement("button");
      card.type = "button";
      card.className = "titan-video-card";

      const thumbUrl = safeURL(vid.thumb || vid.url);
      const isVideo = /\.(mp4|webm|ogg|mov)(?:$|[?#])/i.test(url);

      if (thumbUrl && !isVideo) {
        const img = document.createElement("img");
        img.src = thumbUrl;
        img.alt = String(vid.title || "TITAN video");
        img.loading = "lazy";
        img.onerror = function () {
          this.style.display = "none";
        };
        card.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.style.cssText =
          "height:100%;display:flex;align-items:center;" +
          "justify-content:center;font-size:34px;color:#f59e0b";
        placeholder.textContent = "▶";
        card.appendChild(placeholder);
      }

      const title = document.createElement("span");
      title.className = "titan-video-title";
      title.textContent = vid.title || "Titan Video";
      card.appendChild(title);

      card.addEventListener("click", () => {
        playTitanVideo(url, vid.title || "Titan Video");
      });

      grid.appendChild(card);
    });

    if (!grid.children.length) {
      const empty = document.createElement("div");
      empty.className = "titan-empty-state";
      empty.textContent = "Koi playable video nahi mili.";
      grid.appendChild(empty);
    }
  }

  function renderProfile() {
    const overlay = createOverlay(
      "titanProfileOverlay",
      "titan-profile-overlay"
    );

    const p = getUserProfileData();
    const avatar = safeURL(p.photoURL);
    const yt = safeURL(p.ytLink);

    overlay.replaceChildren();

    const shell = document.createElement("div");
    shell.className = "titan-profile-shell";

    shell.innerHTML = `
      <div class="titan-topbar">
        <button class="titan-icon-button" id="titanProfileBack" aria-label="Close">←</button>
        <h2>Creator Profile</h2>
        <button class="titan-icon-button" id="titanProfileMenu" aria-label="Settings">⋮</button>
      </div>

      <div class="titan-profile-heading">
        <div class="titan-avatar" id="titanProfileAvatar">
          ${avatar ? `<img src="${escapeHTML(avatar)}" alt="Profile photo">` : escapeHTML(getInitials(p.name))}
        </div>
        <div style="min-width:0;flex:1">
          <h2 id="titanProfileName" style="margin:0 0 5px;overflow-wrap:anywhere">
            ${escapeHTML(p.name)}
          </h2>
          <div id="titanProfileHandle" style="color:#a1a1aa;overflow-wrap:anywhere">
            ${escapeHTML(p.handle)}
          </div>
        </div>
      </div>

      <div class="titan-profile-numbers">
        <div class="titan-profile-number">
          <strong>${formatNumber(getUploads().length)}</strong>
          <span>Videos</span>
        </div>
        <div class="titan-profile-number">
          <strong>${formatNumber(p.followers)}</strong>
          <span>Followers</span>
        </div>
        <div class="titan-profile-number">
          <strong>${formatNumber(p.following)}</strong>
          <span>Following</span>
        </div>
      </div>

      <div class="titan-profile-bio" id="titanProfileBio">${escapeHTML(p.bio || "Apni bio add karein.")}</div>

      <a
        id="titanProfileYoutube"
        class="titan-profile-link"
        href="${yt ? escapeHTML(yt) : "#"}"
        target="_blank"
        rel="noopener noreferrer"
        ${yt ? "" : "hidden"}
      >▶ YouTube Channel</a>

      <div class="titan-profile-actions">
        <button class="titan-btn" id="titanEditProfileButton">Edit Profile</button>
        <button class="titan-btn secondary" id="titanShareProfileButton">Share Profile</button>
      </div>

      <div class="titan-profile-tabs">
        <button class="titan-profile-tab active" data-tab="videos">▦ Videos</button>
        <button class="titan-profile-tab" data-tab="likes">♡ Likes</button>
        <button class="titan-profile-tab" data-tab="saved">▣ Saved</button>
      </div>

      <div class="titan-video-grid" id="titanProfileVideoGrid"></div>
    `;

    overlay.appendChild(shell);

    $("#titanProfileBack", shell).addEventListener("click", closeTitanProfile);

    $("#titanProfileMenu", shell).addEventListener("click", openTitanSettings);

    $("#titanEditProfileButton", shell).addEventListener(
      "click",
      openTitanEditProfile
    );

    $("#titanShareProfileButton", shell).addEventListener(
      "click",
      shareTitanProfile
    );

    shell.querySelectorAll("[data-tab]").forEach(button => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.tab;

        shell.querySelectorAll("[data-tab]").forEach(tab => {
          tab.classList.toggle("active", tab === button);
        });

        renderVideoGrid();
      });
    });

    renderVideoGrid();
  }

  function openTitanProfile() {
    closeAllTitanOverlays();
    renderProfile();
    $("#titanProfileOverlay").classList.add("titan-visible");
  }

  window.openTitanProfile = openTitanProfile;
  window.openProfilePage = openTitanProfile;

  /* ---------------------- Edit profile ---------------------- */

  function openTitanEditProfile() {
    const p = getUserProfileData();

    const overlay = createOverlay(
      "titanEditOverlay",
      "titan-edit-overlay"
    );

    overlay.replaceChildren();

    const shell = document.createElement("div");
    shell.className = "titan-profile-shell";

    shell.innerHTML = `
      <div class="titan-topbar">
        <button class="titan-icon-button" id="titanEditCancel">←</button>
        <h2>Edit Profile</h2>
      </div>

      <form id="titanEditProfileForm">
        <div class="titan-form-group">
          <label for="titanEditName">Display Name</label>
          <input id="titanEditName" maxlength="60" value="${escapeHTML(p.name)}" required>
        </div>

        <div class="titan-form-group">
          <label for="titanEditHandle">Username</label>
          <input id="titanEditHandle" maxlength="30" value="${escapeHTML(String(p.handle).replace(/^@/, ""))}" required>
        </div>

        <div class="titan-form-group">
          <label for="titanEditBio">Bio</label>
          <textarea id="titanEditBio" maxlength="300" placeholder="Apne baare mein likhein">${escapeHTML(p.bio)}</textarea>
        </div>

        <div class="titan-form-group">
          <label for="titanEditPhoto">Profile Photo URL (optional)</label>
          <input id="titanEditPhoto" type="url" value="${escapeHTML(p.photoURL || "")}" placeholder="https://...">
        </div>

        <div class="titan-form-group">
          <label for="titanEditYoutube">YouTube Channel URL (optional)</label>
          <input id="titanEditYoutube" type="url" value="${escapeHTML(p.ytLink || "")}" placeholder="https://www.youtube.com/@...">
        </div>

        <p class="titan-small-note">
          Changes is browser mein save hongi. Profile photo ke liye publicly accessible image URL dein.
        </p>

        <button class="titan-btn" type="submit">Save Changes</button>
      </form>
    `;

    overlay.appendChild(shell);
    closeAllTitanOverlays();
    overlay.classList.add("titan-visible");

    $("#titanEditCancel", shell).addEventListener("click", () => {
      overlay.classList.remove("titan-visible");
      openTitanProfile();
    });

    $("#titanEditProfileForm", shell).addEventListener("submit", event => {
      event.preventDefault();

      const name = $("#titanEditName", shell).value.trim();
      let handle = $("#titanEditHandle", shell).value.trim();
      const bio = $("#titanEditBio", shell).value.trim();
      const photoURL = $("#titanEditPhoto", shell).value.trim();
      const ytLink = $("#titanEditYoutube", shell).value.trim();

      if (!name || !handle) {
        alert("Name aur username zaroor likhein.");
        return;
      }

      handle = "@" + handle.replace(/^@+/, "").replace(/\s+/g, "");

      if (photoURL && !safeURL(photoURL)) {
        alert("Profile photo ke liye valid HTTP/HTTPS URL dein.");
        return;
      }

      if (ytLink && !safeURL(ytLink)) {
        alert("YouTube link valid nahi hai.");
        return;
      }

      const saved = saveUserProfileData({
        name,
        displayName: name,
        handle,
        bio,
        photoURL,
        ytLink
      });

      if (saved) {
        overlay.classList.remove("titan-visible");
        activeTab = "videos";
        openTitanProfile();
      }
    });
  }

  window.openTitanEditProfile = openTitanEditProfile;

  /* ---------------------- Video player ---------------------- */

  function playTitanVideo(url, title) {
    const safe = safeURL(url);

    if (!safe) {
      alert("Video URL valid nahi hai.");
      return;
    }

    const overlay = createOverlay(
      "titanPlayerOverlay",
      "titan-player-overlay"
    );

    currentPlayerUrl = safe;
    overlay.replaceChildren();

    const content = document.createElement("div");
    content.className = "titan-player-content";

    const topbar = document.createElement("div");
    topbar.style.cssText =
      "width:100%;max-width:900px;display:flex;justify-content:flex-end";

    const close = document.createElement("button");
    close.className = "titan-icon-button";
    close.textContent = "✕";
    close.setAttribute("aria-label", "Close video");
    close.addEventListener("click", closeTitanVideo);

    topbar.appendChild(close);

    const video = document.createElement("video");
    video.className = "titan-player-video";
    video.src = safe;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";

    const heading = document.createElement("h3");
    heading.className = "titan-player-title";
    heading.textContent = title || "TITAN Video";

    content.append(topbar, video, heading);
    overlay.appendChild(content);

    closeAllTitanOverlays();
    overlay.classList.add("titan-visible");

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Mobile browsers may require the user to press Play.
      });
    }
  }

  function closeTitanVideo() {
    const overlay = $("#titanPlayerOverlay");

    if (overlay) {
      const video = $("video", overlay);

      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }

      overlay.classList.remove("titan-visible");
    }

    currentPlayerUrl = "";
  }

  window.playTitanVideo = playTitanVideo;
  window.closeTitanVideo = closeTitanVideo;

  /* ---------------------- Share profile ---------------------- */

  async function shareTitanProfile() {
    const p = getUserProfileData();
    const shareData = {
      title: p.name + " | TITAN AI",
      text: "Check out " + p.name + " on TITAN AI.",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
        alert("Profile link copy ho gaya.");
        return;
      }

      prompt("Profile link copy karein:", shareData.url);
    } catch (error) {
      if (error && error.name !== "AbortError") {
        prompt("Profile link copy karein:", shareData.url);
      }
    }
  }

  /* ---------------------- Settings ---------------------- */

  function openTitanSettings() {
    const overlay = createOverlay(
      "titanSettingsOverlay",
      "titan-settings-overlay"
    );

    overlay.replaceChildren();

    const shell = document.createElement("div");
    shell.className = "titan-settings-shell";

    shell.innerHTML = `
      <div class="titan-topbar">
        <button class="titan-icon-button" id="titanSettingsBack">←</button>
        <h2>Settings & Privacy</h2>
      </div>

      <button class="titan-settings-row" data-action="account">
        <span>♙</span><span>Account</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="security">
        <span>🔒</span><span>Security & Login</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="display">
        <span>◐</span><span>Display / Theme</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="language">
        <span>文</span><span>Language preference</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="notifications">
        <span>♧</span><span>Notifications preference</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="share">
        <span>↗</span><span>Share profile</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="help">
        <span>?</span><span>Help Centre</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="terms">
        <span>≡</span><span>Terms & Privacy</span><span class="titan-row-arrow">›</span>
      </button>

      <button class="titan-settings-row" data-action="logout" style="color:#fb7185">
        <span style="color:#fb7185">⇥</span><span>Log out</span><span class="titan-row-arrow">›</span>
      </button>

      <p class="titan-small-note">
        Note: Kuch settings abhi sirf is browser mein preference save karti hain.
        Real account security, notifications aur privacy backend se configure hoti hain.
      </p>
    `;

    overlay.appendChild(shell);

    closeAllTitanOverlays();
    overlay.classList.add("titan-visible");

    $("#titanSettingsBack", shell).addEventListener("click", () => {
      overlay.classList.remove("titan-visible");
      openTitanProfile();
    });

    shell.querySelectorAll("[data-action]").forEach(button => {
      button.addEventListener("click", () => {
        handleSettingsAction(button.dataset.action);
      });
    });
  }

  window.openTitanSettings = openTitanSettings;

  function handleSettingsAction(action) {
    switch (action) {
      case "account": {
        const p = getUserProfileData();
        alert(
          "Account information\n\nName: " + p.name +
          "\nUsername: " + p.handle +
          "\nEmail: " + (p.email || "Available nahi") +
          "\n\nAccount details aap Edit Profile se update kar sakte hain."
        );
        break;
      }

      case "security":
        alert(
          "Google Login aapke existing authentication system se handle hota hai. " +
          "Password ya security details yahan store na karein."
        );
        break;

      case "display": {
        const currentlyDark = document.body.classList.contains("light-mode");
        document.body.classList.toggle("light-mode", !currentlyDark);

        try {
          localStorage.setItem(
            "theme_preference",
            currentlyDark ? "dark" : "light"
          );
        } catch (_) {}

        alert(
          "Theme preference change kar di gayi. Agar app ka doosra theme system " +
          "active hai to uski setting bhi update karni hogi."
        );
        break;
      }

      case "language": {
        const current = localStorage.getItem("titan_language") || "Roman Urdu";
        const chosen = prompt(
          "Language preference likhein: English, Urdu, ya Roman Urdu",
          current
        );

        if (chosen && chosen.trim()) {
          localStorage.setItem("titan_language", chosen.trim());
          alert("Language preference save ho gayi. App ki tamam text abhi automatically translate nahi hogi.");
        }
        break;
      }

      case "notifications": {
        const current = localStorage.getItem("titan_notifications") !== "off";
        const next = !current;

        localStorage.setItem("titan_notifications", next ? "on" : "off");

        alert(
          next
            ? "Local notification preference ON hai."
            : "Local notification preference OFF hai." +
              "\nYeh setting abhi browser preference hai, real push notifications nahi."
        );
        break;
      }

      case "share":
        shareTitanProfile();
        break;

      case "help":
        alert(
          "TITAN AI Help\n\nProfile edit karne ke liye Edit Profile use karein. " +
          "Videos upload karne ke liye app ka Plus button use karein. " +
          "Agar upload fail ho, Cloudinary configuration check karni hogi."
        );
        break;

      case "terms":
        alert(
          "Terms & Privacy\n\nYeh menu placeholder hai. Public launch se pehle " +
          "apni real Terms of Service aur Privacy Policy pages add karein."
        );
        break;

      case "logout":
        if (confirm("Kya aap logout karna chahte hain?")) {
          if (typeof window.handleTitanLogout === "function") {
            window.handleTitanLogout();
          } else if (typeof window.titanLogout === "function") {
            window.titanLogout();
          } else {
            alert("Logout function existing auth file mein available nahi mila. Google Login code ko change nahi kiya gaya.");
          }
        }
        break;

      default:
        alert("Yeh option abhi available nahi hai.");
    }
  }

  /* ---------------------- Optional navigation helpers ---------------------- */

  window.openTitanBalance = function () {
    alert("Balance feature abhi backend se connected nahi hai.");
  };

  window.openTitanAnalytics = function () {
    alert("Real analytics ke liye views aur engagement ka backend tracking system chahiye.");
  };

  window.openTitanStudio = function () {
    if (typeof window.openTitanStudioGemini === "function") {
      window.openTitanStudioGemini();
      return;
    }

    alert("Titan Studio ka existing function is page par nahi mila.");
  };

  /* ---------------------- Safe keyboard / backdrop close ---------------------- */

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeTitanVideo();
      closeTitanProfile();

      [
        "titanEditOverlay",
        "titanSettingsOverlay"
      ].forEach(id => {
        const el = $("#" + id);
        if (el) el.classList.remove("titan-visible");
      });
    }
  });

  document.addEventListener("click", event => {
    const overlay = event.target;

    if (
      overlay &&
      overlay.classList &&
      overlay.classList.contains("titan-profile-overlay")
    ) {
      closeTitanProfile();
    }

    if (
      overlay &&
      overlay.classList &&
      overlay.classList.contains("titan-player-overlay")
    ) {
      closeTitanVideo();
    }
  });

  /* ---------------------- Initialization ---------------------- */

  function initTitanProfileSystem() {
    installStyles();

    // Do not auto-open the profile; preserve the existing home screen.
    console.log("TITAN AI Profile System V8 ready.");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initTitanProfileSystem,
      { once: true }
    );
  } else {
    initTitanProfileSystem();
  }

})();
