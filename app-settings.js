/* =====================================================
   TITAN AI — ADVANCED SETTINGS 2026
   Version: 6.0.0
   Standalone Settings Module
   Existing Groq API remains untouched.
===================================================== */

(() => {
  "use strict";

  const TITAN_SETTINGS = {
    version: "6.0.0",
    profileKey: "titan_user_profile",
    uploadsKey: "titan_user_uploads",
    settingsKey: "titan_app_settings"
  };

  const defaults = {
    theme: "dark",
    language: "English",
    notifications: true,
    sound: true,
    autoplay: true,
    privacy: "public",
    compactMode: false
  };

  const readJSON = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn("TITAN AI: Could not read", key);
      return fallback;
    }
  };

  const saveJSON = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      alert("Storage full ya unavailable hai. Dobara try karein.");
      return false;
    }
  };

  let settings = {
    ...defaults,
    ...readJSON(TITAN_SETTINGS.settingsKey, {})
  };

  const styles = `
    #titan-settings-root {
      --ts-bg: #080a10;
      --ts-card: #11151f;
      --ts-card2: #171d2a;
      --ts-text: #f4f6fc;
      --ts-muted: #9aa5b8;
      --ts-border: #283044;
      --ts-accent: #f59e0b;
      --ts-blue: #38bdf8;
      color: var(--ts-text);
      font-family: Inter, Arial, sans-serif;
      width: 100%;
      box-sizing: border-box;
    }

    #titan-settings-root *,
    #titan-settings-root *::before,
    #titan-settings-root *::after {
      box-sizing: border-box;
    }

    #titan-settings-root.ts-light {
      --ts-bg: #f3f5fa;
      --ts-card: #ffffff;
      --ts-card2: #edf1f7;
      --ts-text: #172033;
      --ts-muted: #657086;
      --ts-border: #dce2ec;
      --ts-accent: #d97706;
      --ts-blue: #0284c7;
    }

    .ts-shell {
      background: var(--ts-bg);
      border: 1px solid var(--ts-border);
      border-radius: 20px;
      overflow: hidden;
      min-height: 600px;
    }

    .ts-header {
      padding: 24px;
      border-bottom: 1px solid var(--ts-border);
      background:
        radial-gradient(ellipse at top right,
        rgba(245,158,11,.12), transparent 60%);
    }

    .ts-brand {
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--ts-accent);
      font-weight: 900;
    }

    .ts-header h2 {
      font-size: clamp(24px, 4vw, 34px);
      margin: 12px 0 7px;
      font-weight: 900;
    }

    .ts-muted {
      color: var(--ts-muted);
      font-size: 13px;
      line-height: 1.7;
    }

    .ts-layout {
      display: grid;
      grid-template-columns: 225px minmax(0,1fr);
      min-height: 500px;
    }

    .ts-sidebar {
      padding: 15px;
      border-right: 1px solid var(--ts-border);
      background: var(--ts-card);
    }

    .ts-nav {
      width: 100%;
      text-align: left;
      padding: 12px;
      margin: 3px 0;
      background: transparent;
      color: var(--ts-muted);
      border: 1px solid transparent;
      border-radius: 11px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition: .2s;
    }

    .ts-nav:hover,
    .ts-nav.active {
      background: var(--ts-card2);
      border-color: var(--ts-border);
      color: var(--ts-text);
    }

    .ts-nav.active {
      box-shadow: inset 3px 0 var(--ts-accent);
    }

    .ts-content {
      min-width: 0;
      padding: 24px;
    }

    .ts-page-title {
      font-size: 23px;
      margin: 0 0 6px;
      font-weight: 900;
    }

    .ts-section {
      margin-top: 22px;
      padding: 20px;
      background: var(--ts-card);
      border: 1px solid var(--ts-border);
      border-radius: 15px;
    }

    .ts-section h3 {
      margin: 0 0 7px;
      font-size: 16px;
    }

    .ts-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 16px 0;
      border-bottom: 1px solid var(--ts-border);
    }

    .ts-row:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .ts-row:first-of-type {
      padding-top: 12px;
    }

    .ts-row-copy {
      min-width: 0;
      flex: 1;
    }

    .ts-row-copy strong {
      display: block;
      font-size: 13px;
      margin-bottom: 5px;
    }

    .ts-row-copy small {
      display: block;
      color: var(--ts-muted);
      font-size: 12px;
      line-height: 1.6;
    }

    .ts-input,
    .ts-select,
    .ts-textarea {
      width: 100%;
      background: var(--ts-bg);
      border: 1px solid var(--ts-border);
      border-radius: 9px;
      color: var(--ts-text);
      padding: 12px;
      outline: none;
      font: inherit;
      font-size: 13px;
      margin-top: 7px;
    }

    .ts-input:focus,
    .ts-select:focus,
    .ts-textarea:focus {
      border-color: var(--ts-accent);
    }

    .ts-textarea {
      min-height: 90px;
      resize: vertical;
    }

    .ts-btn {
      border: 1px solid var(--ts-border);
      background: var(--ts-card2);
      color: var(--ts-text);
      border-radius: 9px;
      padding: 10px 14px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      transition: .2s;
    }

    .ts-btn:hover {
      filter: brightness(1.12);
      transform: translateY(-1px);
    }

    .ts-btn-primary {
      color: #17120a;
      background: var(--ts-accent);
      border-color: var(--ts-accent);
    }

    .ts-btn-danger {
      color: #fff;
      background: #b91c1c;
      border-color: #b91c1c;
    }

    .ts-btn-blue {
      background: #075985;
      color: white;
      border-color: #075985;
    }

    .ts-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 25px;
      flex-shrink: 0;
    }

    .ts-switch input {
      width: 1px;
      height: 1px;
      opacity: 0;
      position: absolute;
    }

    .ts-switch span {
      position: absolute;
      inset: 0;
      border-radius: 30px;
      background: #475569;
      cursor: pointer;
      transition: .2s;
    }

    .ts-switch span::before {
      content: "";
      position: absolute;
      width: 19px;
      height: 19px;
      top: 3px;
      left: 3px;
      border-radius: 50%;
      background: white;
      transition: .2s;
    }

    .ts-switch input:checked + span {
      background: var(--ts-accent);
    }

    .ts-switch input:checked + span::before {
      transform: translateX(19px);
    }

    .ts-stats {
      display: grid;
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 12px;
      margin-top: 20px;
    }

    .ts-stat {
      padding: 17px;
      border: 1px solid var(--ts-border);
      background: var(--ts-card);
      border-radius: 13px;
      min-width: 0;
    }

    .ts-stat strong {
      display: block;
      font-size: 24px;
      color: var(--ts-accent);
      overflow-wrap: anywhere;
    }

    .ts-stat span {
      color: var(--ts-muted);
      font-size: 11px;
    }

    .ts-video {
      display: grid;
      grid-template-columns: 100px minmax(0,1fr);
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid var(--ts-border);
    }

    .ts-video:last-child {
      border-bottom: 0;
    }

    .ts-thumb {
      width: 100px;
      height: 74px;
      object-fit: cover;
      border-radius: 9px;
      background: var(--ts-card2);
    }

    .ts-video-title {
      font-size: 13px;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .ts-video-meta {
      font-size: 11px;
      color: var(--ts-muted);
      margin: 6px 0;
      line-height: 1.6;
    }

    .ts-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 9px;
    }

    .ts-badge {
      display: inline-block;
      border-radius: 30px;
      padding: 5px 9px;
      font-size: 10px;
      background: var(--ts-card2);
      border: 1px solid var(--ts-border);
      color: var(--ts-muted);
    }

    .ts-empty {
      padding: 30px 10px;
      text-align: center;
      color: var(--ts-muted);
      font-size: 13px;
    }

    .ts-message {
      padding: 12px;
      margin: 12px 0;
      border-radius: 9px;
      background: var(--ts-card2);
      font-size: 12px;
      line-height: 1.7;
    }

    .ts-news-card {
      padding: 15px;
      margin-top: 12px;
      border: 1px solid var(--ts-border);
      background: var(--ts-card);
      border-radius: 12px;
    }

    .ts-news-card h4 {
      margin: 0 0 7px;
    }

    .ts-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--ts-border);
      color: var(--ts-muted);
      font-size: 11px;
    }

    @media(max-width:700px) {
      .ts-layout {
        grid-template-columns: 1fr;
      }

      .ts-sidebar {
        display: flex;
        overflow-x: auto;
        gap: 6px;
        border-right: 0;
        border-bottom: 1px solid var(--ts-border);
        padding: 10px;
      }

      .ts-nav {
        width: auto;
        min-width: max-content;
        margin: 0;
        padding: 11px;
      }

      .ts-content {
        padding: 15px;
      }

      .ts-header {
        padding: 19px;
      }

      .ts-stats {
        gap: 7px;
      }

      .ts-stat {
        padding: 11px;
      }

      .ts-stat strong {
        font-size: 20px;
      }

      .ts-section {
        padding: 15px;
      }

      .ts-video {
        grid-template-columns: 78px minmax(0,1fr);
        gap: 10px;
      }

      .ts-thumb {
        width: 78px;
        height: 65px;
      }
    }

    @media(prefers-reduced-motion:reduce) {
      #titan-settings-root * {
        transition: none !important;
      }
    }
  `;

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function getProfile() {
    return readJSON(TITAN_SETTINGS.profileKey, {
      name: "",
      handle: "",
      bio: "",
      photoURL: "",
      photo: "",
      ytLink: "",
      followers: 0,
      following: 0,
      likes: 0
    });
  }

  function getUploads() {
    const uploads = readJSON(TITAN_SETTINGS.uploadsKey, []);
    return Array.isArray(uploads) ? uploads : [];
  }

  function persistSettings() {
    saveJSON(TITAN_SETTINGS.settingsKey, settings);
  }

  function applyTheme() {
    const root = document.getElementById("titan-settings-root");
    if (!root) return;

    root.classList.toggle("ts-light", settings.theme === "light");

    document.documentElement.dataset.titanTheme = settings.theme;
    document.documentElement.style.colorScheme = settings.theme;

    /*
      This module changes only its own theme by default.
      It does not overwrite your existing app's theme classes.
    */
  }

  function renderShell() {
    const root = document.getElementById("titan-settings-root");
    if (!root) return;

    root.innerHTML = `
      <div class="ts-shell">
        <header class="ts-header">
          <div class="ts-brand">TITAN AI / CONTROL CENTER</div>
          <h2>Settings & Control ⚙️</h2>
          <div class="ts-muted">
            Personalize your studio, manage your videos and control your preferences.
          </div>
        </header>

        <div class="ts-layout">
          <aside class="ts-sidebar" aria-label="Settings navigation">
            <button class="ts-nav active" data-page="overview">◈ Overview</button>
            <button class="ts-nav" data-page="account">👤 Account & Profile</button>
            <button class="ts-nav" data-page="videos">🎬 My Videos</button>
            <button class="ts-nav" data-page="appearance">🌙 Appearance</button>
            <button class="ts-nav" data-page="notifications">🔔 Notifications</button>
            <button class="ts-nav" data-page="privacy">🔐 Privacy</button>
            <button class="ts-nav" data-page="language">🌐 Language</button>
            <button class="ts-nav" data-page="world">📰 World Updates</button>
            <button class="ts-nav" data-page="about">ℹ️ About TITAN</button>
          </aside>

          <main class="ts-content" id="ts-page-content"></main>
        </div>

        <footer class="ts-footer">
          TITAN AI · Settings v${TITAN_SETTINGS.version}
          · Preferences are stored in this browser.
        </footer>
      </div>
    `;

    root.querySelectorAll(".ts-nav").forEach(button => {
      button.addEventListener("click", () => {
        root.querySelectorAll(".ts-nav").forEach(item => {
          item.classList.toggle("active", item === button);
        });

        renderPage(button.dataset.page);
      });
    });

    applyTheme();
    renderPage("overview");
  }

  function setPage(html) {
    const content = document.getElementById("ts-page-content");
    if (content) content.innerHTML = html;
  }

  function renderPage(page) {
    switch (page) {
      case "account":
        renderAccount();
        break;
      case "videos":
        renderVideos();
        break;
      case "appearance":
        renderAppearance();
        break;
      case "notifications":
        renderNotifications();
        break;
      case "privacy":
        renderPrivacy();
        break;
      case "language":
        renderLanguage();
        break;
      case "world":
        renderWorld();
        break;
      case "about":
        renderAbout();
        break;
      default:
        renderOverview();
    }
  }

  function renderOverview() {
    const profile = getProfile();
    const videos = getUploads();
    const totalViews = videos.reduce(
      (sum, video) => sum + (Number(video.views) || 0), 0
    );

    setPage(`
      <h2 class="ts-page-title">Welcome to TITAN Control</h2>
      <p class="ts-muted">Your creator studio at a glance.</p>

      <div class="ts-stats">
        <div class="ts-stat">
          <strong>${videos.length}</strong>
          <span>Uploaded videos</span>
        </div>
        <div class="ts-stat">
          <strong>${totalViews.toLocaleString()}</strong>
          <span>Recorded views</span>
        </div>
        <div class="ts-stat">
          <strong>${Number(profile.followers) || 0}</strong>
          <span>Followers</span>
        </div>
      </div>

      <section class="ts-section">
        <h3>⚡ Quick Settings</h3>
        <p class="ts-muted">Change your most-used settings quickly.</p>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Dark / Light mode</strong>
            <small>Change the settings dashboard appearance.</small>
          </div>
          <button class="ts-btn ts-btn-primary" data-action="toggle-theme">
            ${settings.theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Notifications</strong>
            <small>Enable or disable this app's notification preference.</small>
          </div>
          <label class="ts-switch">
            <input type="checkbox" data-setting="notifications"
              ${settings.notifications ? "checked" : ""}>
            <span></span>
          </label>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Video Management</strong>
            <small>Edit your saved upload details.</small>
          </div>
          <button class="ts-btn" data-action="goto-videos">Open Videos</button>
        </div>
      </section>

      <section class="ts-section">
        <h3>🛡️ Account Status</h3>
        <p class="ts-muted">
          ${profile.name
            ? "Profile name: " + escapeHTML(profile.name)
            : "Your profile name has not been configured yet."}
        </p>
        <p class="ts-muted">
          Videos are read from this browser's titan_user_uploads storage.
        </p>
      </section>

      <div class="ts-message">
        Note: Video views shown here are only as accurate as the data saved
        by your current app. They are not verified platform-wide analytics.
      </div>
    `);

    bindSettingInputs();
    bindActions();
  }

  function renderAccount() {
    const profile = getProfile();

    setPage(`
      <h2 class="ts-page-title">Account & Profile</h2>
      <p class="ts-muted">Edit the profile information stored in this browser.</p>

      <section class="ts-section">
        <h3>Creator Profile</h3>
        <form id="ts-profile-form">
          <label class="ts-row-copy">
            <strong>Display Name</strong>
            <input class="ts-input" name="name" maxlength="80"
              value="${escapeHTML(profile.name)}"
              placeholder="Your display name">
          </label>

          <label class="ts-row-copy">
            <strong>Username / Handle</strong>
            <input class="ts-input" name="handle" maxlength="50"
              value="${escapeHTML(profile.handle)}"
              placeholder="@username">
          </label>

          <label class="ts-row-copy">
            <strong>Bio</strong>
            <textarea class="ts-textarea" name="bio" maxlength="500"
              placeholder="Tell people about yourself">${escapeHTML(profile.bio)}</textarea>
          </label>

          <label class="ts-row-copy">
            <strong>Profile Photo URL</strong>
            <input class="ts-input" name="photoURL" type="url"
              value="${escapeHTML(profile.photoURL || profile.photo || "")}"
              placeholder="https://example.com/photo.jpg">
            <small class="ts-muted">
              Paste an image URL. This does not upload a new image.
            </small>
          </label>

          <label class="ts-row-copy">
            <strong>YouTube / Creator Link</strong>
            <input class="ts-input" name="ytLink" type="url"
              value="${escapeHTML(profile.ytLink)}"
              placeholder="https://...">
          </label>

          <div style="margin-top:18px">
            <button class="ts-btn ts-btn-primary" type="submit">
              Save Profile
            </button>
          </div>
        </form>
        <div id="ts-profile-message" class="ts-muted" aria-live="polite"></div>
      </section>
    `);

    document.getElementById("ts-profile-form").addEventListener("submit", event => {
      event.preventDefault();

      const form = new FormData(event.currentTarget);
      const updated = {
        ...getProfile(),
        name: String(form.get("name") || "").trim(),
        handle: String(form.get("handle") || "").trim(),
        bio: String(form.get("bio") || "").trim(),
        photoURL: String(form.get("photoURL") || "").trim(),
        ytLink: String(form.get("ytLink") || "").trim()
      };

      if (saveJSON(TITAN_SETTINGS.profileKey, updated)) {
        document.getElementById("ts-profile-message").textContent =
          "Profile information saved in this browser.";
      }
    });
  }

  function renderVideos() {
    const videos = getUploads();

    setPage(`
      <h2 class="ts-page-title">My Videos</h2>
      <p class="ts-muted">
        Edit saved titles, descriptions and visibility preferences.
      </p>

      <div class="ts-message">
        Important: Editing here updates the browser's saved upload records.
        It does not rename or delete the original Cloudinary file.
        True Public/Unlisted/Private access control requires backend enforcement.
      </div>

      <section class="ts-section">
        <h3>Your Uploads (${videos.length})</h3>
        <div id="ts-video-list">
          ${videos.length ? videos.map((video, index) => `
            <article class="ts-video">
              <img class="ts-thumb"
                src="${escapeHTML(video.thumb || video.thumbnail || "")}"
                alt=""
                onerror="this.style.visibility='hidden'">

              <div>
                <div class="ts-video-title">
                  ${escapeHTML(video.title || "Untitled video")}
                </div>

                <div class="ts-video-meta">
                  ${escapeHTML(video.type || "Video")}
                  · ${Number(video.views) || 0} views
                  · ${escapeHTML(video.visibility || "public")}
                  <br>
                  ${escapeHTML(video.createdAt
                    ? new Date(video.createdAt).toLocaleDateString()
                    : "Date unavailable")}
                </div>

                <div class="ts-actions">
                  <button class="ts-btn" data-action="edit-video"
                    data-index="${index}">✏️ Edit</button>
                  <button class="ts-btn ts-btn-blue" data-action="open-video"
                    data-index="${index}">▶ Open</button>
                  <button class="ts-btn ts-btn-danger" data-action="delete-video"
                    data-index="${index}">🗑️ Remove</button>
                </div>
              </div>
            </article>
          `).join("") : `
            <div class="ts-empty">
              No saved videos found.<br>
              Upload a video through your existing TITAN AI upload page.
            </div>
          `}
        </div>
      </section>

      <div id="ts-edit-container"></div>
    `);

    bindActions();
  }

  function editVideo(index) {
    const videos = getUploads();
    const video = videos[index];

    if (!video) return;

    const container = document.getElementById("ts-edit-container");

    container.innerHTML = `
      <section class="ts-section">
        <h3>Edit Video Details</h3>

        <form id="ts-video-form">
          <label>
            <strong>Title</strong>
            <input class="ts-input" name="title" maxlength="150"
              required value="${escapeHTML(video.title || "")}">
          </label>

          <label>
            <strong>Description</strong>
            <textarea class="ts-textarea" name="description"
              maxlength="5000">${escapeHTML(video.description || "")}</textarea>
          </label>

          <label>
            <strong>Thumbnail URL</strong>
            <input class="ts-input" name="thumb" type="url"
              value="${escapeHTML(video.thumb || video.thumbnail || "")}"
              placeholder="https://example.com/thumbnail.jpg">
          </label>

          <label>
            <strong>Visibility preference</strong>
            <select class="ts-select" name="visibility">
              <option value="public"
                ${video.visibility === "public" ? "selected" : ""}>
                Public
              </option>
              <option value="unlisted"
                ${video.visibility === "unlisted" ? "selected" : ""}>
                Unlisted
              </option>
              <option value="private"
                ${video.visibility === "private" ? "selected" : ""}>
                Private
              </option>
            </select>
          </label>

          <div class="ts-message">
            Visibility is currently a saved preference only. Your existing
            feed may still show the video publicly until backend access rules
            are implemented.
          </div>

          <div class="ts-actions">
            <button class="ts-btn ts-btn-primary" type="submit">
              Save Changes
            </button>
            <button class="ts-btn" type="button"
              data-action="cancel-edit">Cancel</button>
          </div>
        </form>
        <div id="ts-edit-message" class="ts-muted"></div>
      </section>
    `;

    container.scrollIntoView({ behavior: "smooth", block: "start" });

    document.getElementById("ts-video-form").addEventListener("submit", event => {
      event.preventDefault();

      const current = getUploads();
      if (!current[index]) return;

      const form = new FormData(event.currentTarget);

      current[index] = {
        ...current[index],
        title: String(form.get("title") || "").trim(),
        description: String(form.get("description") || "").trim(),
        thumb: String(form.get("thumb") || "").trim(),
        visibility: String(form.get("visibility") || "public")
      };

      if (saveJSON(TITAN_SETTINGS.uploadsKey, current)) {
        renderVideos();
      }
    });
  }

  function removeVideo(index) {
    const videos = getUploads();
    const video = videos[index];

    if (!video) return;

    const confirmed = window.confirm(
      'Remove "' + (video.title || "Untitled video") +
      '" from this browser\'s TITAN AI video list?\n\n' +
      "This does NOT delete the original Cloudinary video."
    );

    if (!confirmed) return;

    videos.splice(index, 1);

    if (saveJSON(TITAN_SETTINGS.uploadsKey, videos)) {
      renderVideos();
    }
  }

  function renderAppearance() {
    setPage(`
      <h2 class="ts-page-title">Appearance</h2>
      <p class="ts-muted">Customize the settings dashboard.</p>

      <section class="ts-section">
        <h3>Theme</h3>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Dark Mode</strong>
            <small>Dark cinematic interface.</small>
          </div>
          <button class="ts-btn ${settings.theme === "dark" ? "ts-btn-primary" : ""}"
            data-action="set-theme" data-theme="dark">Dark</button>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Light Mode</strong>
            <small>Bright, clean interface.</small>
          </div>
          <button class="ts-btn ${settings.theme === "light" ? "ts-btn-primary" : ""}"
            data-action="set-theme" data-theme="light">Light</button>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Compact Mode</strong>
            <small>Save space in settings lists.</small>
          </div>
          <label class="ts-switch">
            <input type="checkbox" data-setting="compactMode"
              ${settings.compactMode ? "checked" : ""}>
            <span></span>
          </label>
        </div>
      </section>
    `);

    bindSettingInputs();
    bindActions();
  }

  function renderNotifications() {
    setPage(`
      <h2 class="ts-page-title">Notifications</h2>
      <p class="ts-muted">Choose your notification preferences.</p>

      <section class="ts-section">
        <h3>Preferences</h3>

        ${toggleRow("notifications", "Notifications",
          "Main notification preference.")}

        ${toggleRow("sound", "Sound Effects",
          "Save your preference for app sounds.")}

        ${toggleRow("autoplay", "Video Autoplay",
          "Save your preference for automatic video playback.")}

        <div class="ts-message">
          These switches store preferences only. Your existing notification
          and player code must read these settings to enforce them.
        </div>
      </section>
    `);

    bindSettingInputs();
  }

  function toggleRow(key, title, description) {
    return `
      <div class="ts-row">
        <div class="ts-row-copy">
          <strong>${escapeHTML(title)}</strong>
          <small>${escapeHTML(description)}</small>
        </div>
        <label class="ts-switch">
          <input type="checkbox" data-setting="${key}"
            ${settings[key] ? "checked" : ""}>
          <span></span>
        </label>
      </div>
    `;
  }

  function renderPrivacy() {
    setPage(`
      <h2 class="ts-page-title">Privacy & Security</h2>
      <p class="ts-muted">Review privacy settings and account safety.</p>

      <section class="ts-section">
        <h3>Video Visibility</h3>
        <p class="ts-muted">
          This is a default preference for future uploads. It does not
          replace server-side access control.
        </p>

        <label>
          <strong>Default upload visibility</strong>
          <select class="ts-select" id="ts-default-privacy">
            <option value="public" ${settings.privacy === "public" ? "selected" : ""}>
              Public
            </option>
            <option value="unlisted" ${settings.privacy === "unlisted" ? "selected" : ""}>
              Unlisted
            </option>
            <option value="private" ${settings.privacy === "private" ? "selected" : ""}>
              Private
            </option>
          </select>
        </label>

        <button class="ts-btn ts-btn-primary"
          style="margin-top:14px" data-action="save-privacy">
          Save Preference
        </button>
      </section>

      <section class="ts-section">
        <h3>Security Checklist</h3>
        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>API Keys</strong>
            <small>Never place secret API keys in frontend JavaScript.</small>
          </div>
          <span class="ts-badge">Important</span>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Cloudinary Deletion</strong>
            <small>
              Original media deletion should use a protected server endpoint
              and environment variables.
            </small>
          </div>
          <span class="ts-badge">Backend needed</span>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Account Authentication</strong>
            <small>
              Real account security requires server-side authentication.
              Browser storage alone is not secure authentication.
            </small>
          </div>
          <span class="ts-badge">Review</span>
        </div>
      </section>
    `);

    bindActions();
  }

  function renderLanguage() {
    setPage(`
      <h2 class="ts-page-title">Language</h2>
      <p class="ts-muted">Choose your preferred language.</p>

      <section class="ts-section">
        <h3>App Language Preference</h3>
        <select class="ts-select" id="ts-language">
          ${["English", "Urdu", "Roman Urdu"].map(language => `
            <option value="${language}"
              ${settings.language === language ? "selected" : ""}>
              ${language}
            </option>
          `).join("")}
        </select>

        <button class="ts-btn ts-btn-primary"
          style="margin-top:14px" data-action="save-language">
          Save Language
        </button>

        <div class="ts-message">
          This saves your preferred language. Full translation requires
          your app's interface text to use a translation dictionary.
        </div>
      </section>
    `);

    bindActions();
  }

  function renderWorld() {
    setPage(`
      <h2 class="ts-page-title">🌍 Duniya Ki Updates</h2>
      <p class="ts-muted">
        Open current world news from trusted news providers.
      </p>

      <section class="ts-section">
        <h3>World News</h3>

        <div class="ts-news-card">
          <h4>Reuters</h4>
          <p class="ts-muted">International news and global developments.</p>
          <a href="https://www.reuters.com/world/"
            target="_blank" rel="noopener noreferrer"
            class="ts-btn ts-btn-primary"
            style="display:inline-block;text-decoration:none">
            Read World News ↗
          </a>
        </div>

        <div class="ts-news-card">
          <h4>Associated Press</h4>
          <p class="ts-muted">Global headlines and current affairs.</p>
          <a href="https://apnews.com/world-news"
            target="_blank" rel="noopener noreferrer"
            class="ts-btn"
            style="display:inline-block;text-decoration:none">
            Explore AP News ↗
          </a>
        </div>

        <div class="ts-news-card">
          <h4>BBC News</h4>
          <p class="ts-muted">International news and analysis.</p>
          <a href="https://www.bbc.com/news/world"
            target="_blank" rel="noopener noreferrer"
            class="ts-btn"
            style="display:inline-block;text-decoration:none">
            Explore BBC World ↗
          </a>
        </div>

        <div class="ts-message">
          These links open external news websites. A live news feed inside
          TITAN AI would require a news API or a backend RSS integration.
        </div>
      </section>
    `);
  }

  function renderAbout() {
    setPage(`
      <h2 class="ts-page-title">About TITAN AI</h2>
      <p class="ts-muted">Your creative studio control center.</p>

      <section class="ts-section">
        <div class="ts-brand">TITAN AI</div>
        <h3 style="margin-top:12px">Version ${TITAN_SETTINGS.version}</h3>
        <p class="ts-muted">
          A standalone settings module designed to work alongside your
          existing TITAN AI application.
        </p>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Settings Module</strong>
            <small>Loaded locally in your browser.</small>
          </div>
          <span class="ts-badge">Active</span>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Script Generator</strong>
            <small>Your existing Groq integration is not modified by this file.</small>
          </div>
          <span class="ts-badge">Untouched</span>
        </div>

        <div class="ts-row">
          <div class="ts-row-copy">
            <strong>Preferences</strong>
            <small>Stored in this browser's local storage.</small>
          </div>
          <span class="ts-badge">Local</span>
        </div>
      </section>

      <section class="ts-section">
        <h3>Reset Settings</h3>
        <p class="ts-muted">
          Restore this module's preferences to their default values.
          Your uploaded videos and profile will not be removed.
        </p>
        <button class="ts-btn ts-btn-danger" data-action="reset-settings">
          Reset Preferences
        </button>
      </section>
    `);

    bindActions();
  }

  function bindSettingInputs() {
    document.querySelectorAll(
      '#titan-settings-root [data-setting]'
    ).forEach(input => {
      input.addEventListener("change", () => {
        settings[input.dataset.setting] = input.checked;
        persistSettings();
      });
    });
  }

  function bindActions() {
    const root = document.getElementById("titan-settings-root");
    if (!root) return;

    root.querySelectorAll("[data-action]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        const index = Number(button.dataset.index);

        if (action === "toggle-theme") {
          settings.theme = settings.theme === "dark" ? "light" : "dark";
          persistSettings();
          applyTheme();
          renderOverview();
        }

        if (action === "set-theme") {
          settings.theme = button.dataset.theme;
          persistSettings();
          applyTheme();
          renderAppearance();
        }

        if (action === "goto-videos") renderPage("videos");

        if (action === "edit-video") editVideo(index);

        if (action === "delete-video") removeVideo(index);

        if (action === "cancel-edit") {
          const container = document.getElementById("ts-edit-container");
          if (container) container.innerHTML = "";
        }

        if (action === "open-video") {
          const video = getUploads()[index];
          if (video && video.url) {
            window.open(video.url, "_blank", "noopener,noreferrer");
          } else {
            alert("Is video ka URL available nahi hai.");
          }
        }

        if (action === "save-privacy") {
          settings.privacy =
            document.getElementById("ts-default-privacy").value;
          persistSettings();
          alert("Default visibility preference saved.");
        }

        if (action === "save-language") {
          settings.language =
            document.getElementById("ts-language").value;
          persistSettings();
          alert("Language preference saved.");
        }

        if (action === "reset-settings") {
          const ok = window.confirm(
            "Reset this module's preferences? Videos and profile will remain."
          );

          if (!ok) return;

          settings = { ...defaults };
          persistSettings();
          applyTheme();
          renderPage("about");
        }
      });
    });
  }

  function addStyles() {
    if (document.getElementById("titan-settings-styles")) return;

    const style = document.createElement("style");
    style.id = "titan-settings-styles";
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function mountSettings() {
    addStyles();

    /*
      Create a separate mount so existing app sections are not replaced.
      You can open Settings using TITANSettings.open().
    */
    let root = document.getElementById("titan-settings-root");

    if (!root) {
      root = document.createElement("section");
      root.id = "titan-settings-root";
      root.style.display = "none";
      root.setAttribute("aria-label", "TITAN AI Settings");

      document.body.appendChild(root);
    }

    renderShell();
    root.style.display = "none";
  }

  function openSettings() {
    let root = document.getElementById("titan-settings-root");

    if (!root) {
      mountSettings();
      root = document.getElementById("titan-settings-root");
    }

    root.style.display = "block";
    applyTheme();

    root.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeSettings() {
    const root = document.getElementById("titan-settings-root");
    if (root) root.style.display = "none";
  }

  /*
    Public interface:
    TITANSettings.open()
    TITANSettings.close()
    TITANSettings.get()
  */
  window.TITANSettings = {
    open: openSettings,
    close: closeSettings,
    get: () => ({ ...settings }),
    version: TITAN_SETTINGS.version
  };

  function init() {
    mountSettings();

    /*
      Optional integration:
      Add data-open-titan-settings to any existing button to open settings.
    */
    document.addEventListener("click", event => {
      const button = event.target.closest("[data-open-titan-settings]");
      if (button) {
        event.preventDefault();
        openSettings();
      }
    });

    console.log("TITAN AI Settings 2026 Active!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
