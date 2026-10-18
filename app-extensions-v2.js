/**
 * ==========================================
 * PLATFORM: TITAN AI
 * VERSION: v4.5.0 - Cloudinary Feed Integration
 * FILE: app-extensions-v2.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ TITAN AI Ecosystem Active!");

    const TITAN_UPLOADS_KEY = 'titan_user_uploads';

    // ==========================================
    // 1. THEME
    // ==========================================

    if (!localStorage.getItem('theme_preference')) {
        localStorage.setItem('theme_preference', 'light');
    }

    if (localStorage.getItem('theme_preference') === 'light') {
        document.body.classList.add('light-mode');
    }

    // ==========================================
    // 2. FAVICON
    // ==========================================

    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <polygon points="50,5 90,20 90,65 50,95 10,65 10,20"
                fill="#090a0f" stroke="#f59e0b" stroke-width="4"/>
            <path d="M28 28 L72 28 L72 38 L56 38 L56 75 L44 75 L44 38 L28 38 Z"
                fill="#f59e0b"/>
            <circle cx="50" cy="83" r="4" fill="#00dfd8"/>
        </svg>`;

    const encodedSvg = encodeURIComponent(svgIcon);

    let favicon = document.querySelector("link[rel*='icon']");

    if (!favicon) {
        favicon = document.createElement('link');
        document.head.appendChild(favicon);
    }

    favicon.type = 'image/svg+xml';
    favicon.rel = 'shortcut icon';
    favicon.href = 'data:image/svg+xml,' + encodedSvg;

    // ==========================================
    // 3. STYLES
    // ==========================================

    const titanStyle = document.createElement('style');

    titanStyle.textContent = `
        :root {
            --titan-bg: #050507;
            --titan-card-bg: #0d0e12;
            --titan-text: #ffffff;
            --titan-muted: #9ca3af;
            --titan-border: rgba(255,255,255,.08);
            --titan-chip-bg: #12141c;
            --titan-nav-bg: rgba(5,5,7,.95);
            --verified-blue: #00b2ff;
        }

        body.light-mode {
            --titan-bg: #f8fafc;
            --titan-card-bg: #ffffff;
            --titan-text: #0f172a;
            --titan-muted: #64748b;
            --titan-border: rgba(0,0,0,.08);
            --titan-chip-bg: #e2e8f0;
            --titan-nav-bg: rgba(248,250,252,.96);
            background: #f8fafc !important;
            color: #0f172a !important;
        }

        body {
            background: var(--titan-bg) !important;
            color: var(--titan-text);
            transition: background .3s ease, color .3s ease;
            margin: 0;
            padding-bottom: 100px !important;
        }

        body.titan-short-open {
            overflow: hidden;
        }

        .titan-top-header {
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:14px 20px;
            background:var(--titan-nav-bg);
            backdrop-filter:blur(12px);
            position:sticky;
            top:0;
            z-index:999;
            border-bottom:1px solid var(--titan-border);
        }

        .titan-logo-group {
            display:flex;
            align-items:center;
            gap:10px;
            cursor:pointer;
        }

        .titan-logo-title {
            font-weight:800;
            font-size:1.25rem;
            color:var(--titan-text);
        }

        .titan-header-actions {
            display:flex;
            align-items:center;
            gap:16px;
        }

        .titan-icon-btn {
            background:transparent;
            border:none;
            color:var(--titan-text);
            font-size:1.15rem;
            cursor:pointer;
            padding:5px;
        }

        .titan-stories-wrapper {
            padding:12px 0;
            background:var(--titan-bg);
            border-bottom:1px solid var(--titan-border);
        }

        .titan-stories-scroll {
            display:flex;
            gap:14px;
            overflow-x:auto;
            padding:0 15px;
            scrollbar-width:none;
        }

        .titan-stories-scroll::-webkit-scrollbar,
        .titan-chips-scroll::-webkit-scrollbar {
            display:none;
        }

        .titan-story-item {
            display:flex;
            flex-direction:column;
            align-items:center;
            cursor:pointer;
            flex-shrink:0;
        }

        .titan-story-ring {
            width:66px;
            height:66px;
            border-radius:50%;
            background:linear-gradient(45deg,#f59e0b,#d97706,#ef4444);
            padding:2px;
            display:flex;
            align-items:center;
            justify-content:center;
        }

        .titan-story-thumb {
            width:61px;
            height:61px;
            border-radius:50%;
            object-fit:cover;
            border:2px solid var(--titan-bg);
        }

        .titan-story-name {
            font-size:.75rem;
            font-weight:600;
            margin-top:6px;
            color:var(--titan-muted);
        }

        .titan-chips-scroll {
            display:flex;
            gap:10px;
            overflow-x:auto;
            padding:12px 15px;
            background:var(--titan-bg);
            border-bottom:1px solid var(--titan-border);
            scrollbar-width:none;
        }

        .titan-chip {
            background:var(--titan-chip-bg);
            color:var(--titan-text);
            border:1px solid var(--titan-border);
            padding:7px 18px;
            border-radius:20px;
            font-size:.85rem;
            font-weight:600;
            cursor:pointer;
            white-space:nowrap;
        }

        .titan-chip.active,
        .titan-chip:hover {
            background:#f59e0b !important;
            color:#000 !important;
            border-color:#f59e0b !important;
        }

        .titan-hero-section {
            padding:25px 16px 15px;
            text-align:center;
            max-width:900px;
            margin:0 auto;
        }

        .hero-verified-tag {
            display:inline-flex;
            align-items:center;
            gap:8px;
            background:rgba(0,178,255,.1);
            border:1px solid rgba(0,178,255,.35);
            color:var(--verified-blue);
            padding:8px 20px;
            border-radius:30px;
            font-size:.78rem;
            font-weight:800;
            margin-bottom:18px;
        }

        .titan-hero-section h1 {
            font-size:clamp(1.8rem,5vw,2.8rem);
            font-weight:800;
            line-height:1.15;
            margin-bottom:14px;
            color:var(--titan-text);
        }

        .titan-hero-section h1 span {
            background:linear-gradient(135deg,#f59e0b,#ffd700);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
        }

        .titan-hero-section p {
            font-size:.9rem;
            color:var(--titan-muted);
            max-width:680px;
            margin:0 auto 22px;
            line-height:1.5;
        }

        .earning-cta-box {
            display:flex;
            justify-content:center;
            gap:12px;
            flex-wrap:wrap;
            margin-bottom:22px;
        }

        .btn-vip-primary,
        .btn-vip-gold {
            padding:12px 22px;
            border-radius:30px;
            font-weight:800;
            font-size:.9rem;
            cursor:pointer;
            border:none;
            display:inline-flex;
            align-items:center;
            gap:8px;
        }

        .btn-vip-primary {
            background:linear-gradient(135deg,#00b2ff,#0072ff);
            color:#fff;
        }

        .btn-vip-gold {
            background:linear-gradient(135deg,#f59e0b,#d97706);
            color:#000;
        }

        .titan-phase-cards {
            display:flex;
            flex-direction:column;
            gap:20px;
            padding:10px 15px;
            max-width:600px;
            margin:0 auto;
        }

        .titan-phase-card {
            background:var(--titan-card-bg);
            border:1px solid var(--titan-border);
            border-radius:20px;
            padding:22px;
        }

        .titan-phase-tag {
            display:inline-flex;
            align-items:center;
            gap:6px;
            background:rgba(0,223,216,.15);
            color:#009c98;
            padding:4px 12px;
            border-radius:20px;
            font-weight:800;
            font-size:.72rem;
            margin-bottom:12px;
        }

        .titan-phase-card h3 {
            font-size:1.15rem;
            font-weight:800;
            color:var(--titan-text);
            margin:0 0 8px;
        }

        .titan-phase-card p {
            font-size:.88rem;
            color:var(--titan-muted);
            line-height:1.5;
        }

        .titan-phase-img {
            width:100%;
            height:200px;
            object-fit:cover;
            border-radius:16px;
            margin-bottom:15px;
        }

        .trust-stats-bar {
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
            gap:12px;
            background:var(--titan-card-bg);
            border:1px solid var(--titan-border);
            padding:16px;
            border-radius:18px;
            margin:15px 0 25px;
        }

        .stat-item {
            text-align:center;
        }

        .stat-item h4 {
            font-size:1.1rem;
            font-weight:800;
            color:var(--titan-text);
        }

        .stat-item p {
            font-size:.68rem;
            color:var(--titan-muted);
            font-weight:700;
            text-transform:uppercase;
        }

        .titan-bottom-nav {
            position:fixed;
            bottom:0;
            left:0;
            width:100%;
            box-sizing:border-box;
            background:var(--titan-nav-bg);
            backdrop-filter:blur(12px);
            border-top:1px solid var(--titan-border);
            display:flex;
            justify-content:space-around;
            align-items:center;
            padding:10px 0;
            z-index:1000;
        }

        .titan-nav-item {
            display:flex;
            flex-direction:column;
            align-items:center;
            color:var(--titan-muted);
            font-size:.72rem;
            font-weight:600;
            gap:3px;
            cursor:pointer;
        }

        .titan-nav-item i {
            font-size:1.25rem;
        }

        .titan-nav-item.active {
            color:var(--titan-text);
        }

        .titan-nav-create {
            background:linear-gradient(135deg,#f59e0b,#ef4444);
            color:#fff !important;
            width:44px;
            height:44px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:1.35rem;
        }

        /* Feed sections */

        .titan-upload-feed {
            width:100%;
            max-width:1100px;
            margin:0 auto;
            padding:22px 16px;
            box-sizing:border-box;
        }

        .titan-feed-heading {
            font-size:1.3rem;
            font-weight:800;
            margin:0 0 16px;
            color:var(--titan-text);
        }

        .titan-video-feed-grid {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:16px;
        }

        .titan-video-card {
            min-width:0;
            overflow:hidden;
            border-radius:15px;
            background:var(--titan-card-bg);
            border:1px solid var(--titan-border);
        }

        .titan-video-card video {
            width:100%;
            aspect-ratio:16/9;
            object-fit:contain;
            background:#000;
            display:block;
        }

        .titan-video-info {
            padding:12px;
        }

        .titan-video-info h3 {
            font-size:.95rem;
            font-weight:800;
            margin:0 0 7px;
            overflow-wrap:anywhere;
            color:var(--titan-text);
        }

        .titan-video-info p {
            font-size:.78rem;
            color:var(--titan-muted);
            margin:0;
        }

        .titan-feed-empty {
            padding:24px 15px;
            border:1px dashed var(--titan-border);
            border-radius:14px;
            text-align:center;
            color:var(--titan-muted);
            line-height:1.7;
        }

        /* Shorts viewer */

        .tiktok-shorts-viewer {
            position:fixed;
            inset:0;
            width:100%;
            height:100%;
            height:100dvh;
            background:#000;
            z-index:99999;
            display:none;
            flex-direction:column;
            overflow:hidden;
        }

        .tiktok-shorts-viewer.active {
            display:flex;
        }

        .shorts-top-bar {
            position:absolute;
            top:0;
            left:0;
            width:100%;
            box-sizing:border-box;
            padding:15px 20px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            z-index:20;
            color:#fff;
            background:linear-gradient(#0008,transparent);
        }

        .shorts-close-btn {
            background:#0008;
            border:none;
            color:#fff;
            width:38px;
            height:38px;
            border-radius:50%;
            cursor:pointer;
            font-size:1rem;
        }

        .titan-shorts-feed {
            width:100%;
            height:100%;
            overflow-y:auto;
            scroll-snap-type:y mandatory;
            scrollbar-width:none;
            background:#000;
        }

        .titan-shorts-feed::-webkit-scrollbar {
            display:none;
        }

        .titan-short-card {
            width:100%;
            height:100%;
            height:100dvh;
            position:relative;
            display:flex;
            justify-content:center;
            align-items:center;
            background:#000;
            scroll-snap-align:start;
            scroll-snap-stop:always;
            overflow:hidden;
        }

        .titan-short-card video {
            width:100%;
            height:100%;
            object-fit:contain;
            background:#000;
        }

        .titan-short-info {
            position:absolute;
            bottom:25px;
            left:16px;
            right:78px;
            color:#fff;
            z-index:5;
            text-shadow:0 1px 4px #000;
            pointer-events:none;
        }

        .titan-short-info h3 {
            font-size:1rem;
            margin:0 0 8px;
            overflow-wrap:anywhere;
        }

        .titan-short-info p {
            font-size:.82rem;
            margin:0;
        }

        .titan-short-actions {
            position:absolute;
            right:14px;
            bottom:35px;
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:22px;
            color:#fff;
            z-index:8;
        }

        .titan-short-action {
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:5px;
            cursor:pointer;
            background:none;
            border:0;
            color:#fff;
            font-size:1.45rem;
            text-shadow:0 1px 4px #000;
        }

        .titan-short-action span {
            font-size:.7rem;
        }

        .titan-short-action.liked {
            color:#ff3158;
        }

        .titan-shorts-empty {
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            color:#fff;
            padding:30px;
            box-sizing:border-box;
            line-height:1.8;
        }

        @media(max-width:600px) {
            .titan-video-feed-grid {
                grid-template-columns:1fr;
            }

            .titan-video-card video {
                aspect-ratio:16/9;
            }

            .titan-hero-section {
                padding-top:20px;
            }
        }
    `;

    document.head.appendChild(titanStyle);

    // ==========================================
    // 4. SAFE HELPERS
    // ==========================================

    function escapeHTML(value) {
        return String(value == null ? '' : value).replace(
            /[&<>"']/g,
            function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char];
            }
        );
    }

    function readUploads() {
        try {
            const value = JSON.parse(
                localStorage.getItem(TITAN_UPLOADS_KEY) || '[]'
            );

            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.error('TITAN: Upload list could not be read.', error);
            return [];
        }
    }

    function getType(item) {
        return String(item.type || '').trim().toLowerCase();
    }

    function getShorts() {
        return readUploads().filter(function (item) {
            return getType(item) === 'short' && item.url;
        });
    }

    function getLongVideos() {
        return readUploads().filter(function (item) {
            return ['video', 'long video', 'long'].includes(getType(item))
                && item.url;
        });
    }

    function formatViews(value) {
        const number = Number(value) || 0;
        return number.toLocaleString() + ' views';
    }

    // ==========================================
    // 5. MAIN LAYOUT
    // ==========================================

    function injectOriginalLayout() {

        // Top header

        if (!document.getElementById('titanTopHeader')) {
            const header = document.createElement('div');

            header.id = 'titanTopHeader';
            header.className = 'titan-top-header';

            header.innerHTML = `
                <div class="titan-logo-group"
                     onclick="window.scrollTo({top:0,behavior:'smooth'})">
                    <img src="data:image/svg+xml,${encodedSvg}"
                         style="width:26px;height:26px;" alt="TITAN AI">
                    <span class="titan-logo-title">
                        TITAN <span style="color:#f59e0b;">AI</span>
                    </span>
                </div>

                <div class="titan-header-actions">
                    <button class="titan-icon-btn"
                            id="titanThemeToggle"
                            title="Toggle Theme"
                            aria-label="Toggle theme">
                        <i class="fa-solid fa-moon" id="titanThemeIcon"></i>
                    </button>

                    <button class="titan-icon-btn"
                            title="Notifications"
                            aria-label="Notifications">
                        <i class="fa-regular fa-bell"></i>
                    </button>

                    <button class="titan-icon-btn"
                            title="Search"
                            aria-label="Search"
                            onclick="document.getElementById('titan-long-video-feed')?.scrollIntoView({behavior:'smooth'})">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            `;

            document.body.prepend(header);

            document.getElementById('titanThemeToggle')
                .addEventListener('click', toggleThemeSync);
        }

        // Stories

        const headerElem = document.getElementById('titanTopHeader');

        if (headerElem && !document.getElementById('titanStoriesWrapper')) {
            const stories = document.createElement('div');

            stories.id = 'titanStoriesWrapper';
            stories.className = 'titan-stories-wrapper';

            stories.innerHTML = `
                <div class="titan-stories-scroll">
                    <div class="titan-story-item"
                         onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring">
                            <img src="data:image/svg+xml,${encodedSvg}"
                                 class="titan-story-thumb" alt="Titan AI">
                        </div>
                        <span class="titan-story-name">Titan AI</span>
                    </div>

                    <div class="titan-story-item"
                         onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring">
                            <img src="https://picsum.photos/seed/reel1/200"
                                 class="titan-story-thumb" alt="">
                        </div>
                        <span class="titan-story-name">Cyber Thr...</span>
                    </div>

                    <div class="titan-story-item"
                         onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring">
                            <img src="https://picsum.photos/seed/reel2/200"
                                 class="titan-story-thumb" alt="">
                        </div>
                        <span class="titan-story-name">Dragon Re...</span>
                    </div>

                    <div class="titan-story-item"
                         onclick="openTikTokShorts()">
                        <div class="titan-story-ring">
                            <img src="https://picsum.photos/seed/reel3/200"
                                 class="titan-story-thumb" alt="">
                        </div>
                        <span class="titan-story-name">TITAN Shorts</span>
                    </div>
                </div>
            `;

            headerElem.after(stories);
        }

        // Category chips

        const storiesWrapper = document.getElementById('titanStoriesWrapper');

        if (storiesWrapper && !document.getElementById('titanChipsScroll')) {
            const chips = document.createElement('div');

            chips.id = 'titanChipsScroll';
            chips.className = 'titan-chips-scroll';

            chips.innerHTML = `
                <button class="titan-chip active" data-category="all">All</button>
                <button class="titan-chip" data-category="movies">AI Movies</button>
                <button class="titan-chip" data-category="shorts"
                        onclick="openTikTokShorts()">Titan Shorts</button>
                <button class="titan-chip" data-category="music">Sufi Music</button>
            `;

            storiesWrapper.after(chips);

            chips.querySelectorAll('.titan-chip').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    chips.querySelectorAll('.titan-chip').forEach(function (item) {
                        item.classList.remove('active');
                    });

                    chip.classList.add('active');

                    if (chip.dataset.category === 'all') {
                        document.getElementById('titanHeroSection')
                            ?.scrollIntoView({ behavior: 'smooth' });
                    }

                    if (chip.dataset.category === 'movies') {
                        document.getElementById('titan-long-video-feed')
                            ?.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        }

        // Hero

        const chipsElem = document.getElementById('titanChipsScroll');

        if (chipsElem && !document.getElementById('titanHeroSection')) {
            const hero = document.createElement('section');

            hero.id = 'titanHeroSection';
            hero.className = 'titan-hero-section';

            hero.innerHTML = `
                <div class="hero-verified-tag">
                    <i class="fa-solid fa-circle-check"></i>
                    TITAN AI CREATOR STUDIO
                </div>

                <h1>CREATE YOUR <span>CINEMATIC WORLD</span></h1>

                <p>
                    Create AI stories, publish your videos, and share your
                    creativity with the TITAN AI community.
                </p>

                <div class="earning-cta-box">
                    <button class="btn-vip-primary"
                            onclick="openAccountModal()">
                        <i class="fa-solid fa-user-check"></i>
                        Creator Account
                    </button>

                    <button class="btn-vip-gold"
                            onclick="openTitanStudioGemini()">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        Launch Titan Studio
                    </button>
                </div>
            `;

            chipsElem.after(hero);
        }

        // Phase cards

        const heroElem = document.getElementById('titanHeroSection');

        if (heroElem && !document.getElementById('titanPhaseCards')) {
            const phaseCards = document.createElement('div');

            phaseCards.id = 'titanPhaseCards';
            phaseCards.className = 'titan-phase-cards';

            phaseCards.innerHTML = `
                <div class="titan-phase-card">
                    <div class="titan-phase-tag">PHASE 01</div>
                    <h3>Produce AI Cinematic Media</h3>
                    <p>
                        Create movie scripts, storylines, and cinematic
                        concepts with TITAN AI Studio.
                    </p>
                </div>

                <div class="titan-phase-card">
                    <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop"
                         class="titan-phase-img"
                         alt="Cinematic production">

                    <div class="titan-phase-tag">PHASE 02</div>
                    <h3>Publish and Stream</h3>
                    <p>
                        Upload Shorts and long videos to your TITAN AI feed.
                    </p>
                </div>

                <div class="titan-phase-card">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
                         class="titan-phase-img"
                         alt="Digital creativity">

                    <div class="titan-phase-tag">PHASE 03</div>
                    <h3>Build Your Community</h3>
                    <p>
                        Share your creative work and help viewers discover
                        your content.
                    </p>
                </div>

                <div class="trust-stats-bar">
                    <div class="stat-item">
                        <h4><i class="fa-solid fa-video"></i></h4>
                        <p>Video Creator</p>
                    </div>

                    <div class="stat-item">
                        <h4><i class="fa-solid fa-bolt"></i></h4>
                        <p>Shorts Feed</p>
                    </div>

                    <div class="stat-item">
                        <h4><i class="fa-solid fa-film"></i></h4>
                        <p>Long Videos</p>
                    </div>
                </div>
            `;

            heroElem.after(phaseCards);
        }

        // Long video feed container

        if (!document.getElementById('titan-long-video-feed')) {
            const longFeed = document.createElement('section');

            longFeed.id = 'titan-long-video-feed';
            longFeed.className = 'titan-upload-feed';

            const phaseCards = document.getElementById('titanPhaseCards');

            if (phaseCards) {
                phaseCards.after(longFeed);
            } else {
                document.body.appendChild(longFeed);
            }
        }

        // Bottom navigation

        if (!document.getElementById('titanBottomNav')) {
            const bottomNav = document.createElement('div');

            bottomNav.id = 'titanBottomNav';
            bottomNav.className = 'titan-bottom-nav';

            bottomNav.innerHTML = `
                <div class="titan-nav-item active"
                     onclick="window.scrollTo({top:0,behavior:'smooth'})">
                    <i class="fa-solid fa-house"></i>
                    <span>Home</span>
                </div>

                <div class="titan-nav-item"
                     onclick="openTikTokShorts()">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Shorts</span>
                </div>

                <div class="titan-nav-item titan-create-nav"
                     onclick="window.titanOpenUpload()">
                    <div class="titan-nav-create">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                </div>

                <div class="titan-nav-item"
                     onclick="openTitanStudioGemini()">
                    <i class="fa-solid fa-clapperboard"></i>
                    <span>Studio</span>
                </div>

                <div class="titan-nav-item"
                     onclick="openTitanProfile()">
                    <i class="fa-regular fa-user"></i>
                    <span>Profile</span>
                </div>
            `;

            document.body.appendChild(bottomNav);
        }

        // Shorts overlay

        if (!document.getElementById('tiktokShortsViewer')) {
            const shortsViewer = document.createElement('div');

            shortsViewer.id = 'tiktokShortsViewer';
            shortsViewer.className = 'tiktok-shorts-viewer';

            shortsViewer.innerHTML = `
                <div class="shorts-top-bar">
                    <span style="font-weight:800;font-size:1.1rem;">
                        TITAN Shorts
                        <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i>
                    </span>

                    <button class="shorts-close-btn"
                            onclick="closeTikTokShorts()"
                            aria-label="Close Shorts">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div id="titanShortsFeed" class="titan-shorts-feed"></div>
            `;

            document.body.appendChild(shortsViewer);
        }

        renderLongVideos();
    }

    // ==========================================
    // 6. LONG VIDEO FEED
    // ==========================================

    function renderLongVideos() {
        const section = document.getElementById('titan-long-video-feed');

        if (!section) return;

        const videos = getLongVideos();

        section.innerHTML = `
            <h2 class="titan-feed-heading">
                <i class="fa-solid fa-film" style="color:#f59e0b;"></i>
                Latest Long Videos
            </h2>

            ${
                videos.length
                ? `<div class="titan-video-feed-grid">
                    ${videos.map(function (item) {
                        const title = escapeHTML(item.title || 'Untitled Video');
                        const url = escapeHTML(item.url);
                        const views = formatViews(item.views);

                        return `
                            <article class="titan-video-card">
                                <video
                                    src="${url}"
                                    controls
                                    playsinline
                                    preload="metadata"
                                ></video>

                                <div class="titan-video-info">
                                    <h3>${title}</h3>
                                    <p>${escapeHTML(views)}</p>
                                </div>
                            </article>
                        `;
                    }).join('')}
                   </div>`
                : `<div class="titan-feed-empty">
                    <i class="fa-solid fa-film"></i><br>
                    ابھی کوئی Long Video اپلوڈ نہیں ہوئی۔<br>
                    اپنی پہلی ویڈیو اپلوڈ کریں، وہ یہاں نظر آئے گی۔
                   </div>`
            }
        `;
    }

    // ==========================================
    // 7. SHORTS FEED
    // ==========================================

    function renderShorts() {
        const feed = document.getElementById('titanShortsFeed');

        if (!feed) return;

        const shorts = getShorts();

        if (!shorts.length) {
            feed.innerHTML = `
                <div class="titan-shorts-empty">
                    <div>
                        <i class="fa-solid fa-bolt"
                           style="font-size:42px;color:#f59e0b;"></i>

                        <h2> ابھی کوئی Short موجود نہیں </h2>

                        <p>
                            TITAN AI پر Short اپلوڈ کریں۔
                            <br>
                            اپلوڈ ہونے کے بعد وہ یہاں نظر آئے گی۔
                        </p>
                    </div>
                </div>
            `;

            return;
        }

        feed.innerHTML = shorts.map(function (item, index) {
            const title = escapeHTML(item.title || 'TITAN Short');
            const url = escapeHTML(item.url);
            const id = escapeHTML(item.id || index);

            return `
                <article class="titan-short-card"
                         data-short-id="${id}">

                    <video
                        src="${url}"
                        playsinline
                        controls
                        preload="${index === 0 ? 'auto' : 'metadata'}"
                    ></video>

                    <div class="titan-short-info">
                        <h3>${title}</h3>
                        <p>${escapeHTML(formatViews(item.views))}</p>
                    </div>

                    <div class="titan-short-actions">
                        <button class="titan-short-action titan-like-button"
                                type="button"
                                aria-label="Like this Short">
                            <i class="fa-regular fa-heart"></i>
                            <span>Like</span>
                        </button>

                        <button class="titan-short-action titan-comment-button"
                                type="button"
                                aria-label="Comment on this Short">
                            <i class="fa-regular fa-comment"></i>
                            <span>Comment</span>
                        </button>

                        <button class="titan-short-action titan-share-button"
                                type="button"
                                aria-label="Share this Short">
                            <i class="fa-solid fa-share"></i>
                            <span>Share</span>
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        // Like button: local visual state only
        feed.querySelectorAll('.titan-like-button').forEach(function (button) {
            button.addEventListener('click', function () {
                const icon = button.querySelector('i');

                button.classList.toggle('liked');

                if (button.classList.contains('liked')) {
                    icon.className = 'fa-solid fa-heart';
                } else {
                    icon.className = 'fa-regular fa-heart';
                }
            });
        });

        // Comment is not connected to a database yet
        feed.querySelectorAll('.titan-comment-button').forEach(function (button) {
            button.addEventListener('click', function () {
                alert('Comments feature ابھی database سے connect نہیں ہے۔');
            });
        });

        // Native share
        feed.querySelectorAll('.titan-share-button').forEach(function (button) {
            button.addEventListener('click', async function () {
                const card = button.closest('.titan-short-card');
                const video = card ? card.querySelector('video') : null;
                const titleElement = card ? card.querySelector('h3') : null;

                const shareData = {
                    title: titleElement ? titleElement.textContent : 'TITAN Short',
                    url: video ? video.currentSrc || video.src : location.href
                };

                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else if (navigator.clipboard) {
                        await navigator.clipboard.writeText(shareData.url);
                        alert('Video link copy ہوگیا۔');
                    } else {
                        prompt('Video link copy کریں:', shareData.url);
                    }
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Share failed:', error);
                    }
                }
            });
        });

        // Only play the video visible on screen
        setupShortsAutoplay(feed);
    }

    // ==========================================
    // 8. SHORTS AUTOPLAY
    // ==========================================

    let shortsObserver = null;

    function setupShortsAutoplay(feed) {
        if (shortsObserver) {
            shortsObserver.disconnect();
            shortsObserver = null;
        }

        const viewer = document.getElementById('tiktokShortsViewer');

        if (!viewer || !('IntersectionObserver' in window)) return;

        shortsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                const video = entry.target;

                if (entry.isIntersecting && viewer.classList.contains('active')) {
                    const promise = video.play();

                    if (promise && promise.catch) {
                        promise.catch(function () {
                            // Some browsers require the viewer to tap Play.
                        });
                    }
                } else {
                    video.pause();
                }
            });
        }, {
            root: feed,
            threshold: 0.65
        });

        feed.querySelectorAll('video').forEach(function (video) {
            shortsObserver.observe(video);
        });
    }

    // ==========================================
    // 9. THEME TOGGLE
    // ==========================================

    function toggleThemeSync() {
        document.body.classList.toggle('light-mode');

        const isLight = document.body.classList.contains('light-mode');

        localStorage.setItem(
            'theme_preference',
            isLight ? 'light' : 'dark'
        );

        const icon = document.getElementById('titanThemeIcon');

        if (icon) {
            icon.className = isLight
                ? 'fa-solid fa-sun'
                : 'fa-solid fa-moon';
        }
    }

    // ==========================================
    // 10. OPEN / CLOSE SHORTS
    // ==========================================

    window.openTikTokShorts = function () {
        const viewer = document.getElementById('tiktokShortsViewer');

        if (!viewer) return;

        renderShorts();

        viewer.classList.add('active');
        document.body.classList.add('titan-short-open');

        // Refresh the feed each time it opens.
        const feed = document.getElementById('titanShortsFeed');

        if (feed) {
            feed.scrollTop = 0;
        }

        setupShortsAutoplay(feed);
    };

    window.closeTikTokShorts = function () {
        const viewer = document.getElementById('tiktokShortsViewer');

        if (viewer) {
            viewer.classList.remove('active');

            viewer.querySelectorAll('video').forEach(function (video) {
                video.pause();
            });
        }

        document.body.classList.remove('titan-short-open');
    };

    // ==========================================
    // 11. REFRESH AFTER UPLOAD
    // ==========================================

    window.titanRefreshVideoFeeds = function () {
        renderLongVideos();

        const viewer = document.getElementById('tiktokShortsViewer');

        if (viewer && viewer.classList.contains('active')) {
            renderShorts();
        }
    };

    window.addEventListener('titan:uploads-updated', function () {
        window.titanRefreshVideoFeeds();
    });

    // Also refresh if another tab on the same origin changes storage.
    window.addEventListener('storage', function (event) {
        if (event.key === TITAN_UPLOADS_KEY) {
            window.titanRefreshVideoFeeds();
        }
    });

    // ==========================================
    // 12. CREATE / UPLOAD BUTTON
    // ==========================================

    // Try to connect the plus button to existing upload functions.
    // Existing app-upload-system.js remains responsible for uploading.

    window.titanOpenUpload = function () {
        const existingOverlay =
            document.getElementById('titanOverlayV9') ||
            document.getElementById('titanUploadModal') ||
            document.getElementById('uploadModal');

        if (existingOverlay) {
            existingOverlay.style.display = 'flex';
            existingOverlay.classList.add('active');
            return;
        }

        // Fallback: trigger the existing plus button if available.
        const plusButton = document.querySelector(
            '.titan-nav-create, #titanUploadBtn, [data-action="upload"]'
        );

        if (plusButton && !plusButton.classList.contains('titan-create-nav')) {
            plusButton.click();
            return;
        }

        alert('Upload panel نہیں ملا۔ app-upload-system.js میں upload overlay چیک کریں۔');
    };

    // ==========================================
    // 13. KEYBOARD SUPPORT
    // ==========================================

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            window.closeTikTokShorts();
        }
    });

    // ==========================================
    // 14. INITIALIZE
    // ==========================================

    function initializeTitan() {
        injectOriginalLayout();
        renderLongVideos();

        console.log('TITAN AI: Cloudinary feed connector ready.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTitan);
    } else {
        initializeTitan();
    }

})();
