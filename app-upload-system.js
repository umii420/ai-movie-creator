/**
 * =========================================================
 * TITAN AI — PREMIUM CREATOR CENTER
 * FILE: app-upload-system.js
 * VERSION: 10.0
 *
 * Includes:
 * Video Upload, Shorts, Thumbnail, Details, Audience,
 * Visibility, Category, Tags and Cloudinary Upload.
 *
 * Existing upload record format is preserved.
 * Google Login and Groq AI are not modified.
 * =========================================================
 */

(function () {
  "use strict";

  if (window.__TITAN_CREATOR_CENTER_V10__) return;
  window.__TITAN_CREATOR_CENTER_V10__ = true;

  const CLOUD_NAME = "dgeshman";
  const UPLOAD_PRESET = "Titan-upload";

  const UPLOADS_KEY = "titan_user_uploads";
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
  const MAX_THUMB_SIZE = 10 * 1024 * 1024;

  let selectedFile = null;
  let selectedThumbnail = null;
  let selectedMode = "Short";
  let currentObjectURL = "";
  let thumbnailObjectURL = "";
  let activeRequest = null;

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const escapeHTML = value =>
    String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  function readUploads() {
    try {
      const result = JSON.parse(
        localStorage.getItem(UPLOADS_KEY) || "[]"
      );

      return Array.isArray(result) ? result : [];
    } catch (_) {
      return [];
    }
  }

  function saveUploads(uploads) {
    try {
      localStorage.setItem(
        UPLOADS_KEY,
        JSON.stringify(uploads)
      );
      return true;
    } catch (error) {
      console.error("TITAN: Unable to save upload record", error);
      return false;
    }
  }

  function notifyFeeds() {
    window.dispatchEvent(
      new CustomEvent("titan:uploads-updated")
    );

    if (typeof window.titanRefreshVideoFeeds === "function") {
      window.titanRefreshVideoFeeds();
    }
  }

  function installStyles() {
    if ($("#titan-creator-center-style-v10")) return;

    const style = document.createElement("style");
    style.id = "titan-creator-center-style-v10";

    style.textContent = `
      #titanOverlayV9,
      #titanPubModalV9 {
        box-sizing:border-box!important;
        font-family:Inter,'Plus Jakarta Sans',Arial,sans-serif!important;
        color:#f7f7fb!important;
        -webkit-tap-highlight-color:transparent;
      }

      #titanOverlayV9 *,
      #titanPubModalV9 * {
        box-sizing:border-box;
      }

      #titanOverlayV9 {
        position:fixed!important;
        inset:0!important;
        z-index:9999999999!important;
        display:none;
        overflow-y:auto!important;
        padding:20px 16px 32px!important;
        background:
          radial-gradient(ellipse at top,#28203b 0%,transparent 48%),
          #08090e!important;
      }

      #titanOverlayV9.active {
        display:block!important;
      }

      #titanPubModalV9 {
        position:fixed!important;
        inset:0!important;
        z-index:10000000000!important;
        display:none;
        overflow-y:auto!important;
        padding:18px 16px 36px!important;
        background:#08090e!important;
      }

      #titanPubModalV9.active {
        display:block!important;
      }

      .tc-shell {
        width:100%;
        max-width:700px;
        margin:0 auto;
      }

      .tc-topbar {
        display:flex;
        align-items:center;
        gap:13px;
        margin-bottom:24px;
      }

      .tc-back {
        flex-shrink:0;
        width:43px;
        height:43px;
        border:1px solid #343541;
        border-radius:15px;
        color:#fff;
        background:#171821;
        font-size:22px;
        cursor:pointer;
      }

      .tc-brand {
        min-width:0;
        flex:1;
      }

      .tc-brand h2 {
        margin:0;
        font-size:20px;
        font-weight:850;
        letter-spacing:-.6px;
      }

      .tc-brand p {
        margin:4px 0 0;
        font-size:12px;
        color:#a5a7b5;
      }

      .tc-brand-accent {
        color:#f59e0b;
      }

      .tc-badge {
        padding:7px 10px;
        border:1px solid #59421c;
        border-radius:30px;
        color:#ffc45c;
        background:#21190c;
        font-size:10px;
        font-weight:800;
      }

      .tc-hero {
        position:relative;
        overflow:hidden;
        padding:23px;
        margin-bottom:20px;
        border:1px solid #353044;
        border-radius:24px;
        background:linear-gradient(130deg,#20192d,#12141e 68%,#151b29);
      }

      .tc-hero:after {
        content:"";
        position:absolute;
        width:150px;
        height:150px;
        right:-65px;
        top:-60px;
        border-radius:50%;
        background:rgba(245,158,11,.11);
        filter:blur(3px);
      }

      .tc-hero-icon {
        display:flex;
        align-items:center;
        justify-content:center;
        width:53px;
        height:53px;
        margin-bottom:17px;
        border-radius:17px;
        color:#17120a;
        background:linear-gradient(135deg,#ffdc91,#f59e0b);
        font-size:23px;
      }

      .tc-hero h3 {
        margin:0;
        font-size:23px;
        line-height:1.25;
        font-weight:850;
      }

      .tc-hero p {
        max-width:390px;
        margin:9px 0 0;
        color:#b9b7c7;
        font-size:13px;
        line-height:1.65;
      }

      .tc-section-label {
        margin:24px 0 12px;
        color:#a6a8b7;
        font-size:11px;
        font-weight:850;
        letter-spacing:1.4px;
        text-transform:uppercase;
      }

      .tc-mode-grid {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:12px;
      }

      .tc-mode-card {
        min-width:0;
        padding:18px 13px;
        text-align:left;
        border:1px solid #2e303d;
        border-radius:20px;
        background:#12131b;
        color:#fff;
        cursor:pointer;
        transition:border-color .2s,transform .2s,background .2s;
      }

      .tc-mode-card:active {
        transform:scale(.98);
      }

      .tc-mode-card.selected {
        border-color:#f59e0b;
        background:linear-gradient(145deg,#282012,#17151a);
        box-shadow:inset 0 0 0 1px rgba(245,158,11,.15);
      }

      .tc-mode-icon {
        display:flex;
        align-items:center;
        justify-content:center;
        width:43px;
        height:43px;
        margin-bottom:14px;
        border-radius:14px;
        color:#ffc15a;
        background:#302414;
        font-size:20px;
      }

      .tc-mode-card strong {
        display:block;
        font-size:15px;
      }

      .tc-mode-card small {
        display:block;
        margin-top:6px;
        color:#a6a7b5;
        font-size:11px;
        line-height:1.5;
      }

      .tc-primary,
      .tc-secondary {
        display:flex;
        justify-content:center;
        align-items:center;
        gap:9px;
        width:100%;
        min-height:49px;
        padding:13px 16px;
        border:0;
        border-radius:15px;
        font-size:14px;
        font-weight:850;
        cursor:pointer;
      }

      .tc-primary {
        color:#17120a;
        background:linear-gradient(110deg,#ffd98b,#f59e0b);
        box-shadow:0 7px 24px rgba(245,158,11,.12);
      }

      .tc-secondary {
        color:#f3f4f6;
        border:1px solid #343541;
        background:#191a24;
      }

      .tc-primary:disabled {
        opacity:.55;
        cursor:not-allowed;
      }

      .tc-bottom-note {
        margin:17px 0 0;
        color:#8c8e9e;
        text-align:center;
        font-size:11px;
        line-height:1.7;
      }

      .tc-form {
        width:100%;
        max-width:650px;
        margin:0 auto;
      }

      .tc-form-header {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding-bottom:17px;
        margin-bottom:20px;
        border-bottom:1px solid #292b36;
      }

      .tc-form-header h3 {
        margin:0;
        font-size:19px;
      }

      .tc-form-header p {
        margin:5px 0 0;
        color:#9ea0af;
        font-size:12px;
      }

      .tc-form-group {
        margin-bottom:18px;
      }

      .tc-form-group label {
        display:block;
        margin-bottom:8px;
        color:#e5e5eb;
        font-size:12px;
        font-weight:750;
      }

      .tc-help {
        margin-top:6px;
        color:#9294a3;
        font-size:11px;
        line-height:1.5;
      }

      .tc-input,
      .tc-select,
      .tc-textarea {
        display:block;
        width:100%;
        min-height:47px;
        padding:12px 13px;
        border:1px solid #343541;
        border-radius:13px;
        outline:none;
        background:#13141d;
        color:#f7f7fb;
        font:inherit;
        font-size:13px;
      }

      .tc-input:focus,
      .tc-select:focus,
      .tc-textarea:focus {
        border-color:#f59e0b;
        box-shadow:0 0 0 3px rgba(245,158,11,.09);
      }

      .tc-textarea {
        min-height:110px;
        resize:vertical;
        line-height:1.6;
      }

      .tc-file-card {
        display:flex;
        align-items:center;
        gap:13px;
        padding:15px;
        border:1px dashed #48404a;
        border-radius:17px;
        background:#12131b;
      }

      .tc-file-icon {
        display:flex;
        align-items:center;
        justify-content:center;
        flex-shrink:0;
        width:47px;
        height:47px;
        border-radius:14px;
        background:#2a2113;
        color:#ffc15a;
        font-size:21px;
      }

      .tc-file-info {
        min-width:0;
        flex:1;
      }

      .tc-file-info strong {
        display:block;
        overflow-wrap:anywhere;
        font-size:12px;
      }

      .tc-file-info small {
        display:block;
        margin-top:5px;
        color:#9ea0af;
        font-size:11px;
      }

      .tc-file-action {
        flex-shrink:0;
        padding:9px 11px;
        border:1px solid #444653;
        border-radius:10px;
        background:#242530;
        color:#fff;
        font-size:11px;
        font-weight:750;
        cursor:pointer;
      }

      .tc-preview {
        display:block;
        width:100%;
        max-height:360px;
        margin-top:13px;
        border-radius:15px;
        background:#000;
        object-fit:contain;
      }

      .tc-thumbnail-preview {
        display:block;
        width:100%;
        max-height:260px;
        margin-top:12px;
        border-radius:13px;
        object-fit:contain;
        background:#0a0b10;
      }

      .tc-radio-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:8px;
      }

      .tc-radio-card {
        padding:12px 6px;
        border:1px solid #343541;
        border-radius:12px;
        background:#13141d;
        color:#f7f7fb;
        text-align:center;
        font-size:11px;
        cursor:pointer;
      }

      .tc-radio-card:has(input:checked) {
        border-color:#f59e0b;
        background:#292012;
      }

      .tc-radio-card input {
        accent-color:#f59e0b;
        margin:0 0 7px;
      }

      .tc-check-row {
        display:flex;
        align-items:flex-start;
        gap:10px;
        padding:13px;
        border:1px solid #343541;
        border-radius:13px;
        background:#13141d;
      }

      .tc-check-row input {
        width:18px;
        height:18px;
        margin-top:2px;
        accent-color:#f59e0b;
      }

      .tc-check-row strong {
        display:block;
        font-size:12px;
      }

      .tc-check-row small {
        display:block;
        margin-top:5px;
        color:#9ea0af;
        font-size:11px;
        line-height:1.5;
      }

      .tc-progress-box {
        display:none;
        padding:14px;
        margin-top:16px;
        border:1px solid #343541;
        border-radius:14px;
        background:#13141d;
      }

      .tc-progress-track {
        height:7px;
        overflow:hidden;
        margin-top:10px;
        border-radius:10px;
        background:#30313a;
      }

      .tc-progress-fill {
        width:0%;
        height:100%;
        border-radius:10px;
        background:linear-gradient(90deg,#f59e0b,#ffd98b);
        transition:width .15s;
      }

      .tc-status {
        margin-top:12px;
        color:#c7c8d2;
        font-size:12px;
        line-height:1.5;
      }

      .tc-divider {
        height:1px;
        margin:22px 0;
        background:#292b36;
      }

      .tc-button-row {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:20px;
      }

      .tc-close {
        width:38px;
        height:38px;
        border:1px solid #343541;
        border-radius:12px;
        background:#191a24;
        color:#fff;
        font-size:18px;
        cursor:pointer;
      }

      @media(max-width:420px) {
        #titanOverlayV9,
        #titanPubModalV9 {
          padding-left:13px!important;
          padding-right:13px!important;
        }

        .tc-hero {
          padding:19px;
        }

        .tc-hero h3 {
          font-size:21px;
        }

        .tc-radio-grid {
          grid-template-columns:1fr;
        }

        .tc-radio-card {
          display:flex;
          align-items:center;
          gap:10px;
          text-align:left;
          padding:12px;
        }

        .tc-radio-card input {
          margin:0;
        }

        .tc-badge {
          display:none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createUploadUI() {
    if (!$("#titanOverlayV9")) {
      const overlay = document.createElement("div");
      overlay.id = "titanOverlayV9";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-label", "TITAN Creator Center");

      overlay.innerHTML = `
        <div class="tc-shell">
          <div class="tc-topbar">
            <button class="tc-back" type="button" id="tcCloseHome" aria-label="Close">×</button>

            <div class="tc-brand">
              <h2><span class="tc-brand-accent">TITAN</span> Creator</h2>
              <p>Your content. Your creation.</p>
            </div>

            <span class="tc-badge">CREATOR</span>
          </div>

          <section class="tc-hero">
            <div class="tc-hero-icon">✦</div>
            <h3>Bring your story<br>to the world.</h3>
            <p>Upload your video, prepare its details, choose your audience and publish to your TITAN feed.</p>
          </section>

          <div class="tc-section-label">Choose your content</div>

          <div class="tc-mode-grid">
            <button class="tc-mode-card" type="button" data-mode="Video">
              <span class="tc-mode-icon">▣</span>
              <strong>Upload Video</strong>
              <small>Share your full-length video with your audience.</small>
            </button>

            <button class="tc-mode-card selected" type="button" data-mode="Short">
              <span class="tc-mode-icon">▶</span>
              <strong>Upload Short</strong>
              <small>Share a quick vertical video with the TITAN community.</small>
            </button>
          </div>

          <div class="tc-section-label">Selected format</div>
          <p id="tcSelectedMode" style="color:#e7e7ed;font-size:13px;line-height:1.6">Short video selected. Choose a video file to continue.</p>

          <input id="titanFileInputV9" type="file" accept="video/*" hidden>

          <button class="tc-primary" type="button" id="tcChooseVideo" style="margin-top:20px">
            <span>＋</span> Select video from device
          </button>

          <p class="tc-bottom-note">Supported formats depend on your browser and Cloudinary configuration. Maximum file size: 100 MB.</p>
        </div>
      `;

      document.body.appendChild(overlay);
    }

    if (!$("#titanPubModalV9")) {
      const modal = document.createElement("div");
      modal.id = "titanPubModalV9";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-label", "Video publishing details");

      modal.innerHTML = `
        <div class="tc-form">
          <div class="tc-topbar">
            <button type="button" class="tc-back" id="tcBackToCreator" aria-label="Back">←</button>

            <div class="tc-brand">
              <h2>Publish <span class="tc-brand-accent">Content</span></h2>
              <p>Review your details before uploading.</p>
            </div>

            <button type="button" class="tc-close" id="tcClosePublish" aria-label="Close">×</button>
          </div>

          <div class="tc-form-header">
            <div>
              <h3>Content details</h3>
              <p>Add information to help viewers find your content.</p>
            </div>
          </div>

          <div class="tc-form-group">
            <label>SELECTED VIDEO</label>
            <div class="tc-file-card">
              <div class="tc-file-icon">▶</div>
              <div class="tc-file-info">
                <strong id="fileDisplayV9">No video selected</strong>
                <small id="tcVideoSize">Choose a video to get started.</small>
              </div>
              <button type="button" class="tc-file-action" id="tcChangeVideo">Change</button>
            </div>
            <video id="tcVideoPreview" class="tc-preview" controls playsinline hidden></video>
          </div>

          <div class="tc-form-group">
            <label for="titleInputV9">TITLE *</label>
            <input class="tc-input" type="text" id="titleInputV9" maxlength="100" placeholder="Give your video a title" required>
            <div class="tc-help">Use a clear, descriptive title. Maximum 100 characters.</div>
          </div>

          <div class="tc-form-group">
            <label for="tcDescription">DESCRIPTION</label>
            <textarea class="tc-textarea" id="tcDescription" maxlength="5000" placeholder="Tell viewers what your video is about..."></textarea>
          </div>

          <div class="tc-form-group">
            <label>THUMBNAIL</label>
            <div class="tc-file-card">
              <div class="tc-file-icon">▧</div>
              <div class="tc-file-info">
                <strong id="tcThumbName">No custom thumbnail</strong>
                <small>Optional JPG, PNG or WebP image, maximum 10 MB.</small>
              </div>
              <button type="button" class="tc-file-action" id="tcChooseThumb">Choose</button>
            </div>
            <input type="file" id="tcThumbnailInput" accept="image/jpeg,image/png,image/webp" hidden>
            <img id="tcThumbnailPreview" class="tc-thumbnail-preview" alt="Thumbnail preview" hidden>
            <div class="tc-help">If no thumbnail is selected, a default video preview image will be used where available.</div>
          </div>

          <div class="tc-form-group">
            <label for="tcVisibility">VISIBILITY</label>
            <select class="tc-select" id="tcVisibility">
              <option value="Public">Public — visible to everyone</option>
              <option value="Unlisted">Unlisted — share by link</option>
              <option value="Private">Private — only you</option>
            </select>
            <div class="tc-help">Note: this selection is saved with the browser's local record. It does not restrict a Cloudinary URL from being opened directly.</div>
          </div>

          <div class="tc-form-group">
            <label>AUDIENCE</label>
            <label class="tc-check-row">
              <input type="checkbox" id="tcMadeForKids">
              <span>
                <strong>Made for kids</strong>
                <small>Select this if the content is specifically made for children. Choose accurately for your content.</small>
              </span>
            </label>
          </div>

          <div class="tc-form-group">
            <label for="tcCategory">CATEGORY</label>
            <select class="tc-select" id="tcCategory">
              <option value="Entertainment">Entertainment</option>
              <option value="Film & Animation">Film & Animation</option>
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="Education">Education</option>
              <option value="Comedy">Comedy</option>
              <option value="People & Blogs">People & Blogs</option>
              <option value="News">News</option>
              <option value="Sports">Sports</option>
              <option value="Travel">Travel</option>
              <option value="Science & Technology">Science & Technology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="tc-form-group">
            <label for="tcTags">TAGS</label>
            <input class="tc-input" id="tcTags" maxlength="500" placeholder="AI movie, short film, TITAN AI">
            <div class="tc-help">Separate tags with commas.</div>
          </div>

          <div class="tc-form-group">
            <label for="tcLocation">LOCATION (OPTIONAL)</label>
            <input class="tc-input" id="tcLocation" maxlength="120" placeholder="Add a location if relevant">
          </div>

          <div class="tc-form-group">
            <label for="tcPlaylist">PLAYLIST (OPTIONAL)</label>
            <input class="tc-input" id="tcPlaylist" maxlength="100" placeholder="Enter a playlist name">
            <div class="tc-help">This stores a playlist label for now; real playlist management requires a backend.</div>
          </div>

          <div class="tc-divider"></div>

          <label class="tc-check-row">
            <input type="checkbox" id="tcConfirmRights">
            <span>
              <strong>I have the right to upload this content.</strong>
              <small>Only upload videos and images you own or have permission to use.</small>
            </span>
          </label>

          <div class="tc-progress-box" id="uploadProgressBox">
            <div style="display:flex;justify-content:space-between;gap:12px;font-size:12px">
              <strong id="tcProgressStatus">Preparing upload...</strong>
              <strong id="progressPercent">0%</strong>
            </div>
            <div class="tc-progress-track">
              <div class="tc-progress-fill" id="progressFill"></div>
            </div>
            <div class="tc-status" id="tcUploadStatus">Keep this page open until the upload finishes.</div>
          </div>

          <div class="tc-button-row">
            <button type="button" class="tc-secondary" id="tcSaveDraft">Save Draft</button>
            <button type="button" class="tc-primary" id="publishBtnV9">↑ Publish Video</button>
          </div>

          <p class="tc-bottom-note">Your video will be uploaded to Cloudinary and listed in this browser's TITAN feed. Advanced access controls and earnings require server-side support.</p>
        </div>
      `;

      document.body.appendChild(modal);
    }
  }

  function setMode(mode) {
    selectedMode = mode === "Video" ? "Video" : "Short";

    document.querySelectorAll("#titanOverlayV9 [data-mode]").forEach(btn => {
      btn.classList.toggle(
        "selected",
        btn.dataset.mode === selectedMode
      );
    });

    const text = $("#tcSelectedMode");
    if (text) {
      text.textContent = selectedMode === "Short"
        ? "Short selected. Choose a video file to continue."
        : "Full video selected. Choose a video file to continue.";
    }
  }

  function openCreatorCenter(mode) {
    createUploadUI();

    if (mode) setMode(mode);

    $("#titanPubModalV9").classList.remove("active");
    $("#titanOverlayV9").classList.add("active");
  }

  function closeCreatorCenter() {
    $("#titanOverlayV9")?.classList.remove("active");
    $("#titanPubModalV9")?.classList.remove("active");
  }

  function releaseObjectURLs() {
    if (currentObjectURL) {
      URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = "";
    }

    if (thumbnailObjectURL) {
      URL.revokeObjectURL(thumbnailObjectURL);
      thumbnailObjectURL = "";
    }
  }

  function resetForm() {
    selectedFile = null;
    selectedThumbnail = null;

    const fileInput = $("#titanFileInputV9");
    const thumbInput = $("#tcThumbnailInput");

    if (fileInput) fileInput.value = "";
    if (thumbInput) thumbInput.value = "";

    const title = $("#titleInputV9");
    const description = $("#tcDescription");

    if (title) title.value = "";
    if (description) description.value = "";

    [
      ["tcTags", ""],
      ["tcLocation", ""],
      ["tcPlaylist", ""]
    ].forEach(([id, value]) => {
      const el = $("#" + id);
      if (el) el.value = value;
    });

    const madeForKids = $("#tcMadeForKids");
    const rights = $("#tcConfirmRights");

    if (madeForKids) madeForKids.checked = false;
    if (rights) rights.checked = false;

    const video = $("#tcVideoPreview");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.hidden = true;
    }

    const thumb = $("#tcThumbnailPreview");
    if (thumb) {
      thumb.removeAttribute("src");
      thumb.hidden = true;
    }

    if ($("#fileDisplayV9")) {
      $("#fileDisplayV9").textContent = "No video selected";
    }

    if ($("#tcVideoSize")) {
      $("#tcVideoSize").textContent = "Choose a video to get started.";
    }

    if ($("#tcThumbName")) {
      $("#tcThumbName").textContent = "No custom thumbnail";
    }

    const progress = $("#uploadProgressBox");
    if (progress) progress.style.display = "none";

    releaseObjectURLs();
  }

  function showPublishForm(file) {
    selectedFile = file;

    const display = $("#fileDisplayV9");
    const size = $("#tcVideoSize");
    const preview = $("#tcVideoPreview");

    if (display) display.textContent = file.name;
    if (size) {
      size.textContent =
        (file.size / (1024 * 1024)).toFixed(1) + " MB";
    }

    releaseObjectURLs();
    currentObjectURL = URL.createObjectURL(file);

    if (preview) {
      preview.src = currentObjectURL;
      preview.hidden = false;
    }

    $("#titanOverlayV9").classList.remove("active");
    $("#titanPubModalV9").classList.add("active");

    const title = $("#titleInputV9");
    if (title && !title.value) {
      title.value = file.name.replace(/\.[^.]+$/, "").slice(0, 100);
    }
  }

  function handleFile(input) {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    if (!file.type || !file.type.startsWith("video/")) {
      alert("Please choose a valid video file.");
      input.value = "";
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      alert("Video size must be less than 100 MB.");
      input.value = "";
      return;
    }

    if (!file.size) {
      alert("This video file appears to be empty.");
      input.value = "";
      return;
    }

    showPublishForm(file);
  }

  function handleThumbnail(input) {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      alert("Choose a JPG, PNG or WebP thumbnail.");
      input.value = "";
      return;
    }

    if (file.size > MAX_THUMB_SIZE) {
      alert("Thumbnail size must be less than 10 MB.");
      input.value = "";
      return;
    }

    selectedThumbnail = file;

    if (thumbnailObjectURL) {
      URL.revokeObjectURL(thumbnailObjectURL);
    }

    thumbnailObjectURL = URL.createObjectURL(file);

    const preview = $("#tcThumbnailPreview");
    const name = $("#tcThumbName");

    if (preview) {
      preview.src = thumbnailObjectURL;
      preview.hidden = false;
    }

    if (name) name.textContent = file.name;
  }

  function updateProgress(percent, status) {
    const box = $("#uploadProgressBox");
    const fill = $("#progressFill");
    const percentEl = $("#progressPercent");
    const statusEl = $("#tcProgressStatus");
    const detail = $("#tcUploadStatus");

    if (box) box.style.display = "block";
    if (fill) fill.style.width = percent + "%";
    if (percentEl) percentEl.textContent = percent + "%";
    if (statusEl) statusEl.textContent = status || "Uploading...";
    if (detail) {
      detail.textContent = percent >= 100
        ? "Finishing upload..."
        : "Please keep this page open while the upload continues.";
    }
  }

  function setPublishing(isPublishing) {
    const button = $("#publishBtnV9");

    if (!button) return;

    button.disabled = isPublishing;
    button.textContent = isPublishing
      ? "Uploading..."
      : "↑ Publish Video";
  }

  function uploadToCloudinary(file, resourceType, onProgress) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "titan-videos");

      const xhr = new XMLHttpRequest();
      activeRequest = xhr;

      xhr.open(
        "POST",
        "https://api.cloudinary.com/v1_1/" +
          CLOUD_NAME + "/" + resourceType + "/upload"
      );

      xhr.upload.onprogress = event => {
        if (event.lengthComputable && typeof onProgress === "function") {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        activeRequest = null;

        let result;

        try {
          result = JSON.parse(xhr.responseText || "{}");
        } catch (_) {
          reject(new Error("Cloudinary returned an invalid response."));
          return;
        }

        if (
          xhr.status >= 200 &&
          xhr.status < 300 &&
          result.secure_url
        ) {
          resolve(result);
        } else {
          reject(
            new Error(
              result.error && result.error.message
                ? result.error.message
                : "Cloudinary upload failed. Check the upload preset."
            )
          );
        }
      };

      xhr.onerror = () => {
        activeRequest = null;
        reject(new Error("Network error. Please check your connection."));
      };

      xhr.onabort = () => {
        activeRequest = null;
        reject(new Error("Upload cancelled."));
      };

      xhr.send(formData);
    });
  }

  function saveDraft() {
    if (!selectedFile) {
      alert("Choose a video first.");
      return;
    }

    const draft = {
      id: Date.now(),
      title: ($("#titleInputV9")?.value || "").trim(),
      description: ($("#tcDescription")?.value || "").trim(),
      type: selectedMode,
      visibility: $("#tcVisibility")?.value || "Public",
      madeForKids: Boolean($("#tcMadeForKids")?.checked),
      category: $("#tcCategory")?.value || "Entertainment",
      tags: ($("#tcTags")?.value || "")
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean),
      location: ($("#tcLocation")?.value || "").trim(),
      playlist: ($("#tcPlaylist")?.value || "").trim(),
      draft: true,
      filename: selectedFile.name,
      size: selectedFile.size,
      createdAt: new Date().toISOString()
    };

    try {
      const drafts = JSON.parse(
        localStorage.getItem("titan_upload_drafts") || "[]"
      );

      const safeDrafts = Array.isArray(drafts) ? drafts : [];
      safeDrafts.unshift(draft);

      localStorage.setItem(
        "titan_upload_drafts",
        JSON.stringify(safeDrafts.slice(0, 20))
      );

      alert(
        "Draft details saved in this browser. The video file itself is not uploaded or permanently stored by this draft."
      );
    } catch (error) {
      console.error(error);
      alert("Could not save the draft. Browser storage may be full.");
    }
  }

  async function publish() {
    if (!selectedFile) {
      alert("Please select a video first.");
      return;
    }

    const title = ($("#titleInputV9")?.value || "").trim();

    if (!title) {
      alert("Please enter a video title.");
      $("#titleInputV9")?.focus();
      return;
    }

    if (!$("#tcConfirmRights")?.checked) {
      alert("Please confirm you have permission to upload this content.");
      return;
    }

    if (activeRequest) {
      alert("An upload is already in progress.");
      return;
    }

    const publishButton = $("#publishBtnV9");
    if (publishButton && publishButton.disabled) return;

    setPublishing(true);
    updateProgress(0, "Uploading video...");

    try {
      const videoResult = await uploadToCloudinary(
        selectedFile,
        "video",
        percent => updateProgress(percent, "Uploading video...")
      );

      let thumbURL = "";

      if (selectedThumbnail) {
        updateProgress(0, "Uploading thumbnail...");

        const thumbResult = await uploadToCloudinary(
          selectedThumbnail,
          "image",
          percent => updateProgress(percent, "Uploading thumbnail...")
        );

        thumbURL = thumbResult.secure_url;
      } else {
        thumbURL = videoResult.secure_url.replace(
          "/upload/",
          "/upload/so_0,w_640,h_360,c_fill,q_auto,f_jpg/"
        );
      }

      const record = {
        id: Date.now(),
        title,
        description: ($("#tcDescription")?.value || "").trim(),
        url: videoResult.secure_url,
        thumb: thumbURL,
        type: selectedMode,
        views: 0,
        public_id: videoResult.public_id,
        thumbnail_public_id: "",
        visibility: $("#tcVisibility")?.value || "Public",
        madeForKids: Boolean($("#tcMadeForKids")?.checked),
        category: $("#tcCategory")?.value || "Entertainment",
        tags: ($("#tcTags")?.value || "")
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),
        location: ($("#tcLocation")?.value || "").trim(),
        playlist: ($("#tcPlaylist")?.value || "").trim(),
        draft: false,
        createdAt: new Date().toISOString()
      };

      const uploads = readUploads();
      uploads.unshift(record);

      if (!saveUploads(uploads)) {
        throw new Error(
          "Video uploaded, but its record could not be saved in this browser."
        );
      }

      updateProgress(100, "Upload complete!");
      notifyFeeds();

      alert(
        "TITAN AI: Video uploaded successfully!\n\n" +
        "Your video has been added to this browser's TITAN feed."
      );

      closeCreatorCenter();
      resetForm();

    } catch (error) {
      console.error("TITAN Creator Center upload error:", error);

      alert(
        "Upload failed: " +
        (error && error.message ? error.message : "Please try again.")
      );

    } finally {
      setPublishing(false);
      activeRequest = null;
    }
  }

  function wireEvents() {
    const overlay = $("#titanOverlayV9");
    const modal = $("#titanPubModalV9");

    $("#tcCloseHome")?.addEventListener("click", closeCreatorCenter);

    $("#tcClosePublish")?.addEventListener("click", closeCreatorCenter);

    $("#tcBackToCreator")?.addEventListener("click", () => {
      modal.classList.remove("active");
      overlay.classList.add("active");
    });

    $("#tcChooseVideo")?.addEventListener("click", () => {
      $("#titanFileInputV9")?.click();
    });

    $("#tcChangeVideo")?.addEventListener("click", () => {
      $("#titanFileInputV9")?.click();
    });

    $("#titanFileInputV9")?.addEventListener("change", event => {
      handleFile(event.target);
    });

    $("#tcChooseThumb")?.addEventListener("click", () => {
      $("#tcThumbnailInput")?.click();
    });

    $("#tcThumbnailInput")?.addEventListener("change", event => {
      handleThumbnail(event.target);
    });

    document.querySelectorAll("#titanOverlayV9 [data-mode]").forEach(button => {
      button.addEventListener("click", () => {
        setMode(button.dataset.mode);
      });
    });

    $("#publishBtnV9")?.addEventListener("click", publish);
    $("#tcSaveDraft")?.addEventListener("click", saveDraft);

    [overlay, modal].forEach(el => {
      el?.addEventListener("click", event => {
        if (event.target === el) closeCreatorCenter();
      });
    });
  }

  // Public functions for the existing app.
  window.openTitanCreatorCenter = openCreatorCenter;
  window.openTitanUploadStudio = openCreatorCenter;
  window.setModeV9 = setMode;
  window.handleFileV9 = handleFile;
  window.publishV9 = publish;

  // Intercept the existing Plus / Create button.
  document.addEventListener("click", function (event) {
    const target = event.target.closest(
      ".titan-nav-create, .fa-plus, [data-action='create']"
    );

    if (!target) return;

    if (
      target.closest("#titanOverlayV9") ||
      target.closest("#titanPubModalV9")
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    openCreatorCenter();
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeCreatorCenter();
    }
  });

  function init() {
    installStyles();
    createUploadUI();
    wireEvents();

    console.log("TITAN AI Premium Creator Center ready.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
