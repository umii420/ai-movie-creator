/* =========================================================
   TITAN AI — EXTENSIONS V2
   Frontend interaction layer
   Works with the new TITAN AI index.html
   Does NOT modify the existing Groq API.
   ========================================================= */

(() => {
  "use strict";

  if (window.TITANExtensionsV2) {
    console.info("TITAN Extensions V2 already loaded.");
    return;
  }

  const TITAN = {
    version: "2.0.0",
    initialized: false
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  function notify(message) {
    if (typeof window.titanToast === "function") {
      window.titanToast(message);
      return;
    }

    const toast = $("#toast");

    if (!toast) {
      console.info("[TITAN AI]", message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(TITAN.toastTimer);

    TITAN.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function navigate(view) {
    if (typeof window.navigateTo === "function") {
      window.navigateTo(view);
      return;
    }

    const viewMap = {
      home: "homeView",
      shorts: "shortsView",
      upload: "uploadView",
      studio: "studioView",
      profile: "profileView",
      library: "libraryView"
    };

    const target = document.getElementById(viewMap[view]);

    if (!target) {
      notify("This section is not available yet.");
      return;
    }

    $$(".view").forEach(section => {
      section.classList.remove("active");
    });

    target.classList.add("active");

    $$("[data-view]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.view === view
      );
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------------------------------------------------------
     1. HOME SEARCH
     --------------------------------------------------------- */

  function initSearch() {
    const search = $("#searchInput");
    const grid = $("#videoGrid");
    const empty = $("#emptySearch");

    if (!search || !grid) return;

    function runSearch() {
      const query = search.value.trim().toLowerCase();
      let count = 0;

      $$(".video-card", grid).forEach(card => {
        const content = (
          card.innerText + " " +
          (card.dataset.search || "") + " " +
          (card.dataset.category || "")
        ).toLowerCase();

        const matches = content.includes(query);

        card.style.display = matches ? "" : "none";

        if (matches) count++;
      });

      if (empty) {
        empty.classList.toggle("hidden", count > 0);
      }
    }

    search.addEventListener("input", runSearch);

    const form = $("#searchForm");

    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();
        navigate("home");
        runSearch();
      });
    }
  }

  /* ---------------------------------------------------------
     2. HOME CATEGORY FILTERS
     --------------------------------------------------------- */

  function initCategories() {
    const chips = $$("#categoryChips [data-category]");

    if (!chips.length) return;

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const category = chip.dataset.category;

        chips.forEach(item => {
          item.classList.toggle("active", item === chip);
        });

        let visibleCount = 0;

        $$("#videoGrid .video-card").forEach(card => {
          const categories = (
            card.dataset.category || ""
          ).toLowerCase().split(/\s+/);

          const matches =
            category === "all" ||
            categories.includes(category);

          card.style.display = matches ? "" : "none";

          if (matches) visibleCount++;
        });

        const empty = $("#emptySearch");

        if (empty) {
          empty.classList.toggle("hidden", visibleCount > 0);
        }

        const search = $("#searchInput");

        if (search && search.value.trim()) {
          search.value = "";
        }
      });
    });
  }

  /* ---------------------------------------------------------
     3. NAVIGATION
     --------------------------------------------------------- */

  function initNavigation() {
    $$("[data-view]").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();

        const view = button.dataset.view;

        if (view) navigate(view);
      });
    });

    const sidebarToggle = $("#sidebarToggle");
    const sidebar = $("#sidebar");

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", () => {
        if (window.innerWidth <= 600) return;

        const collapsed =
          sidebar.dataset.collapsed !== "true";

        sidebar.dataset.collapsed = String(collapsed);

        document.documentElement.style.setProperty(
          "--sidebar",
          collapsed ? "78px" : "238px"
        );

        sidebar.querySelectorAll(".nav-link span").forEach(label => {
          label.style.display = collapsed ? "none" : "";
        });
      });
    }
  }

  /* ---------------------------------------------------------
     4. SHORTS PLAYER
     --------------------------------------------------------- */

  function initShorts() {
    const fileInput = $("#shortsFileInput");
    const video = $("#shortsVideo");
    const placeholder = $("#shortsPlaceholder");
    const title = $("#shortsTitle");
    const description = $("#shortsDescription");

    if (!fileInput || !video) return;

    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];

      if (!file) return;

      if (!file.type.startsWith("video/")) {
        notify("Please select a valid video.");
        fileInput.value = "";
        return;
      }

      if (TITAN.shortUrl) {
        URL.revokeObjectURL(TITAN.shortUrl);
      }

      TITAN.shortUrl = URL.createObjectURL(file);

      video.src = TITAN.shortUrl;
      video.classList.remove("hidden");

      if (placeholder) {
        placeholder.classList.add("hidden");
      }

      if (title) {
        title.textContent = file.name;
      }

      if (description) {
        description.textContent =
          "Local video preview · " + file.name;
      }

      navigate("shorts");

      video.play().catch(() => {
        notify("Tap the play button to start your video.");
      });

      fileInput.value = "";
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        video.pause();
      }
    });
  }

  /* ---------------------------------------------------------
     5. UPLOAD PREVIEW
     --------------------------------------------------------- */

  function initUpload() {
    const input = $("#uploadFileInput");
    const preview = $("#uploadPreview");
    const box = $("#uploadPreviewBox");
    const title = $("#uploadTitle");

    if (!input || !preview) return;

    input.addEventListener("change", () => {
      const file = input.files && input.files[0];

      if (!file) return;

      if (!file.type.startsWith("video/")) {
        notify("Please select a video file.");
        input.value = "";
        return;
      }

      if (TITAN.uploadUrl) {
        URL.revokeObjectURL(TITAN.uploadUrl);
      }

      TITAN.uploadUrl = URL.createObjectURL(file);

      preview.src = TITAN.uploadUrl;

      if (box) {
        box.classList.remove("hidden");
      }

      if (title) {
        title.value = file.name.replace(/\.[^/.]+$/, "");
      }

      notify("Video preview ready on this device.");

      input.value = "";
    });
  }

  /* ---------------------------------------------------------
     6. STUDIO ACTIONS
     --------------------------------------------------------- */

  function initStudio() {
    const scriptButton = $("#generateScriptBtn");

    if (scriptButton) {
      scriptButton.addEventListener("contextmenu", event => {
        event.preventDefault();
      });
    }

    const sceneButton = $(
      '#sceneModal button.primary-btn'
    );

    if (sceneButton) {
      sceneButton.setAttribute(
        "aria-label",
        "Prepare scene outline"
      );
    }

    const imageButton = $(
      '#imageModal button.primary-btn'
    );

    if (imageButton) {
      imageButton.setAttribute(
        "aria-label",
        "Prepare image prompt"
      );
    }

    // Script generation remains controlled by the existing
    // generateScript() function in index.html.
    // This extension does not send any API requests.
  }

  /* ---------------------------------------------------------
     7. PROFILE AND SETTINGS
     --------------------------------------------------------- */

  function initProfile() {
    const settingsButton = $(
      '#profileView .profile-item'
    );

    if (settingsButton) {
      settingsButton.setAttribute(
        "aria-label",
        "Open TITAN AI settings"
      );
    }

    const savedCount = $("#profileVideoCount");

    if (savedCount) {
      savedCount.textContent =
        TITAN.uploadUrl || TITAN.shortUrl ? "1" : "0";
    }
  }

  /* ---------------------------------------------------------
     8. LIBRARY EMPTY STATE
     --------------------------------------------------------- */

  function initLibrary() {
    const library = $("#libraryContent");

    if (!library) return;

    if (!TITAN.uploadUrl && !TITAN.shortUrl) {
      library.classList.remove("hidden");
    }
  }

  /* ---------------------------------------------------------
     9. INITIALIZATION
     --------------------------------------------------------- */

  function init() {
    if (TITAN.initialized) return;

    TITAN.initialized = true;

    initSearch();
    initCategories();
    initNavigation();
    initShorts();
    initUpload();
    initStudio();
    initProfile();
    initLibrary();

    console.info(
      "TITAN AI Extensions V2 initialized.",
      TITAN.version
    );
  }

  window.TITANExtensionsV2 = {
    version: TITAN.version,
    navigate,
    notify,
    init
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
