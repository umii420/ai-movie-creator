/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v3.5.1-Theme-Sync-Shorts-Fix
 * FILE: app-extensions-v2.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ TITAN AI Theme Sync Engine & Shorts Active!");

    // 1. Dynamic Favicon Injector
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 90,20 90,65 50,95 10,65 10,20" fill="#090a0f" stroke="#f59e0b" stroke-width="4"/><path d="M 28 28 L 72 28 L 72 38 L 56 38 L 56 75 L 44 75 L 44 38 L 28 38 Z" fill="#f59e0b"/><circle cx="50" cy="83" r="4" fill="#00dfd8"/></svg>`;

    const encodedSvg = encodeURIComponent(svgIcon);
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = 'data:image/svg+xml,' + encodedSvg;
    document.getElementsByTagName('head')[0].appendChild(link);

    // 2. Comprehensive Dynamic Style Syncing + TikTok Shorts Viewer
    const titanStyle = document.createElement('style');
    titanStyle.innerHTML = `
        :root {
            --titan-bg: #050507;
            --titan-card-bg: #0d0e12;
            --titan-text: #ffffff;
            --titan-muted: #9ca3af;
            --titan-border: rgba(255, 255, 255, 0.08);
            --titan-chip-bg: #12141c;
            --titan-nav-bg: rgba(5, 5, 7, 0.95);
        }

        /* Full Light Mode Sync Across All Elements */
        body.light-mode {
            --titan-bg: #f8fafc !important;
            --titan-card-bg: #ffffff !important;
            --titan-text: #0f172a !important;
            --titan-muted: #64748b !important;
            --titan-border: rgba(0, 0, 0, 0.08) !important;
            --titan-chip-bg: #e2e8f0 !important;
            --titan-nav-bg: rgba(248, 250, 252, 0.95) !important;
            background-color: #f8fafc !important;
            color: #0f172a !important;
        }

        body {
            background-color: var(--titan-bg) !important;
            color: var(--titan-text) !important;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Top Bar Styling */
        .titan-top-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 20px;
            background: var(--titan-nav-bg);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 999;
            border-bottom: 1px solid var(--titan-border);
            transition: background 0.3s ease, border-color 0.3s ease;
        }

        .titan-logo-group {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }

        .titan-logo-title {
            font-weight: 800;
            font-size: 1.25rem;
            color: var(--titan-text);
            letter-spacing: -0.5px;
        }

        .titan-header-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .titan-icon-btn {
            background: transparent;
            border: none;
            color: var(--titan-text);
            font-size: 1.15rem;
            cursor: pointer;
            padding: 6px;
            border-radius: 50%;
            transition: color 0.2s ease, background 0.2s ease;
        }

        /* Stories Bar Sync */
        .titan-stories-wrapper {
            padding: 14px 0;
            background: var(--titan-bg);
            border-bottom: 1px solid var(--titan-border);
            transition: background 0.3s ease, border-color 0.3s ease;
        }

        .titan-stories-scroll {
            display: flex;
            gap: 14px;
            overflow-x: auto;
            padding: 0 15px;
            scrollbar-width: none;
        }
        .titan-stories-scroll::-webkit-scrollbar { display: none; }

        .titan-story-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            flex-shrink: 0;
        }

        .titan-story-ring {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            background: linear-gradient(45deg, #f59e0b, #d97706, #ef4444);
            padding: 2.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .titan-story-thumb {
            width: 63px;
            height: 63px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--titan-bg);
        }

        .titan-story-name {
            font-size: 0.75rem;
            font-weight: 600;
            margin-top: 6px;
            color: var(--titan-muted);
            text-align: center;
            max-width: 70px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* Category Chips Sync */
        .titan-chips-scroll {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 12px 15px;
            background: var(--titan-bg);
            border-bottom: 1px solid var(--titan-border);
            scrollbar-width: none;
            transition: background 0.3s ease, border-color 0.3s ease;
        }
        .titan-chips-scroll::-webkit-scrollbar { display: none; }

        .titan-chip {
            background: var(--titan-chip-bg);
            color: var(--titan-text);
            border: 1px solid var(--titan-border);
            padding: 7px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.2s ease, color 0.2s ease;
        }
        .titan-chip.active, .titan-chip:hover {
            background: #f59e0b !important;
            color: #000000 !important;
            border-color: #f59e0b !important;
        }

        /* Movie Feed Cards Sync */
        .titan-movie-feed {
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding: 15px 0;
            padding-bottom: 90px;
        }

        .titan-feed-card {
            background: var(--titan-card-bg);
            border: 1px solid var(--titan-border);
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            transition: background 0.3s ease;
        }

        .titan-feed-thumb {
            width: 100%;
            height: 210px;
            object-fit: cover;
        }

        .titan-feed-meta {
            display: flex;
            gap: 12px;
            padding: 14px;
        }

        .titan-feed-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }

        .titan-feed-info h3 {
            font-size: 0.98rem;
            font-weight: 700;
            color: var(--titan-text);
            margin-bottom: 4px;
            line-height: 1.3;
        }

        .titan-feed-info p {
            font-size: 0.82rem;
            color: var(--titan-muted);
        }

        /* Bottom Nav Sync */
        .titan-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: var(--titan-nav-bg);
            backdrop-filter: blur(12px);
            border-top: 1px solid var(--titan-border);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10px 0;
            z-index: 1000;
            transition: background 0.3s ease, border-color 0.3s ease;
        }

        .titan-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: var(--titan-muted);
            font-size: 0.72rem;
            font-weight: 600;
            gap: 3px;
            cursor: pointer;
        }
        .titan-nav-item i { font-size: 1.25rem; }
        .titan-nav-item.active { color: var(--titan-text); }

        .titan-nav-create {
            background: linear-gradient(135deg, #f59e0b, #ef4444);
            color: #ffffff !important;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.35rem;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        /* TikTok / Shorts Fullscreen Viewer Overlay */
        .tiktok-shorts-viewer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #000000;
            z-index: 9999;
            display: none;
            flex-direction: column;
        }
        .tiktok-shorts-viewer.active { display: flex; }

        .shorts-top-bar {
            position: absolute;
            top: 15px;
            left: 0;
            width: 100%;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
            color: #fff;
        }

        .shorts-close-btn {
            background: rgba(0,0,0,0.5);
            border: none;
            color: #fff;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
        }

        .shorts-video-box {
            position: relative;
            width: 100%;
            height: 100%;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .shorts-dummy-media {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .shorts-overlay-info {
            position: absolute;
            bottom: 25px;
            left: 15px;
            right: 80px;
            color: #fff;
            z-index: 5;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        }

        .shorts-overlay-info h4 {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .shorts-overlay-info p {
            font-size: 0.85rem;
            opacity: 0.9;
        }

        .shorts-side-actions {
            position: absolute;
            right: 15px;
            bottom: 40px;
            display: flex;
            flex-direction: column;
            gap: 22px;
            align-items: center;
            z-index: 5;
            color: #fff;
        }

        .shorts-action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            font-size: 1.4rem;
            cursor: pointer;
        }
        .shorts-action-item span { font-size: 0.72rem; font-weight: 600; }
    `;
    document.head.appendChild(titanStyle);

    // 3. Inject Custom Sections & Bind Theme Switching
    function injectCustomLayout() {
        // Top Header
        if (!document.getElementById('titanTopHeader')) {
            const header = document.createElement('div');
            header.id = 'titanTopHeader';
            header.className = 'titan-top-header';
            header.innerHTML = `
                <div class="titan-logo-group" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <img src="data:image/svg+xml,${encodedSvg}" style="width:26px; height:26px;" />
                    <span class="titan-logo-title">TITAN <span style="color:#f59e0b;">AI</span></span>
                </div>
                <div class="titan-header-actions">
                    <button class="titan-icon-btn" id="titanThemeToggle" title="Toggle Mode">
                        <i class="fa-solid fa-moon" id="titanThemeIcon"></i>
                    </button>
                    <button class="titan-icon-btn"><i class="fa-regular fa-bell"></i></button>
                    <button class="titan-icon-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            `;
            document.body.prepend(header);

            // Theme Toggle Handler
            document.getElementById('titanThemeToggle').addEventListener('click', toggleThemeSync);
        }

        // Stories Bar
        const topHeader = document.getElementById('titanTopHeader');
        if (topHeader && !document.getElementById('titanStoriesWrapper')) {
            const stories = document.createElement('div');
            stories.id = 'titanStoriesWrapper';
            stories.className = 'titan-stories-wrapper';
            stories.innerHTML = `
                <div class="titan-stories-scroll">
                    <div class="titan-story-item" onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring">
                            <img src="data:image/svg+xml,${encodedSvg}" class="titan-story-thumb" alt="Titan AI" />
                        </div>
                        <span class="titan-story-name">Titan AI</span>
                    </div>
                    <div class="titan-story-item" onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring"><img src="https://picsum.photos/seed/reel1/200" class="titan-story-thumb" /></div>
                        <span class="titan-story-name">Cyber Thriller</span>
                    </div>
                    <div class="titan-story-item" onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring"><img src="https://picsum.photos/seed/reel2/200" class="titan-story-thumb" /></div>
                        <span class="titan-story-name">Dragon Realm</span>
                    </div>
                    <div class="titan-story-item" onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring"><img src="https://picsum.photos/seed/reel3/200" class="titan-story-thumb" /></div>
                        <span class="titan-story-name">Sufi Music</span>
                    </div>
                </div>
            `;
            topHeader.parentNode.insertBefore(stories, topHeader.nextSibling);
        }

        // Category Chips
        const storiesWrapper = document.getElementById('titanStoriesWrapper');
        if (storiesWrapper && !document.getElementById('titanChipsScroll')) {
            const chips = document.createElement('div');
            chips.id = 'titanChipsScroll';
            chips.className = 'titan-chips-scroll';
            chips.innerHTML = `
                <div class="titan-chip active">All</div>
                <div class="titan-chip">AI Movies</div>
                <div class="titan-chip" onclick="openTikTokShorts()">Titan Shorts</div>
                <div class="titan-chip">Sufi Music</div>
                <div class="titan-chip">Sci-Fi Scripts</div>
            `;
            storiesWrapper.parentNode.insertBefore(chips, storiesWrapper.nextSibling);
        }

        // Feed
        const featuresSection = document.querySelector('.features-section');
        if (featuresSection && !document.getElementById('titanMovieFeed')) {
            const movieFeed = document.createElement('div');
            movieFeed.id = 'titanMovieFeed';
            movieFeed.className = 'titan-movie-feed';
            featuresSection.appendChild(movieFeed);
            populateMovieFeed();
        }

        // Bottom Navigation Bar (Original Labeled Buttons)
        if (!document.getElementById('titanBottomNav')) {
            const bottomNav = document.createElement('div');
            bottomNav.id = 'titanBottomNav';
            bottomNav.className = 'titan-bottom-nav';
            bottomNav.innerHTML = `
                <div class="titan-nav-item active" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <i class="fa-solid fa-house"></i>
                    <span>Home</span>
                </div>
                <div class="titan-nav-item" onclick="openTikTokShorts()">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Titan Shorts</span>
                </div>
                <div class="titan-nav-item">
                    <div class="titan-nav-create" onclick="openAccountModal()"><i class="fa-solid fa-plus"></i></div>
                </div>
                <div class="titan-nav-item" onclick="openTitanStudioGemini()">
                    <i class="fa-solid fa-clapperboard"></i>
                    <span>Titan Studio</span>
                </div>
                <div class="titan-nav-item" onclick="toggleSettingsDrawer()">
                    <i class="fa-regular fa-user"></i>
                    <span>Profile</span>
                </div>
            `;
            document.body.appendChild(bottomNav);
        }

        // TikTok Shorts Viewer Fullscreen Overlay
        if (!document.getElementById('tiktokShortsViewer')) {
            const shortsViewer = document.createElement('div');
            shortsViewer.id = 'tiktokShortsViewer';
            shortsViewer.className = 'tiktok-shorts-viewer';
            shortsViewer.innerHTML = `
                <div class="shorts-top-bar">
                    <span style="font-weight: 800; font-size: 1.1rem; letter-spacing: -0.5px;">Titan Shorts <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i></span>
                    <button class="shorts-close-btn" onclick="closeTikTokShorts()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="shorts-video-box">
                    <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop" class="shorts-dummy-media" alt="Short Reel" />
                    
                    <div class="shorts-overlay-info">
                        <h4>@Titan_Creator <i class="fa-solid fa-circle-check" style="color:#00dfd8; font-size:0.85rem;"></i></h4>
                        <p>Cyberpunk Cinematic Teaser 8K Rendered Scene #TitanAI #Reels</p>
                    </div>

                    <div class="shorts-side-actions">
                        <div class="shorts-action-item"><i class="fa-solid fa-heart" style="color:#ef4444;"></i><span>24.5K</span></div>
                        <div class="shorts-action-item"><i class="fa-solid fa-comment"></i><span>1,208</span></div>
                        <div class="shorts-action-item"><i class="fa-solid fa-share-nodes"></i><span>Share</span></div>
                        <div class="shorts-action-item" onclick="closeTikTokShorts(); openTitanStudioGemini();"><i class="fa-solid fa-wand-magic-sparkles" style="color:#f59e0b;"></i><span>Create</span></div>
                    </div>
                </div>
            `;
            document.body.appendChild(shortsViewer);
        }

        // Initialize icon state on load
        updateThemeIconState();

        document.body.classList.add('titan-ready');
    }

    // Dynamic Theme Switcher Function
    function toggleThemeSync() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme_preference', isLight ? 'light' : 'dark');
        updateThemeIconState();
    }

    function updateThemeIconState() {
        const isLight = document.body.classList.contains('light-mode');
        const icon = document.getElementById('titanThemeIcon');
        if (icon) {
            icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    window.openTikTokShorts = function() {
        document.getElementById('tiktokShortsViewer')?.classList.add('active');
    };

    window.closeTikTokShorts = function() {
        document.getElementById('tiktokShortsViewer')?.classList.remove('active');
    };

    window.openTitanStudioGemini = function() {
        const geminiModal = document.getElementById('geminiOutputModal');
        if (geminiModal) {
            geminiModal.classList.add('active');
            const promptInput = document.getElementById('modalPromptInput');
            if (promptInput) promptInput.focus();
        }
    };

    function populateMovieFeed() {
        const container = document.getElementById('titanMovieFeed');
        if (!container) return;

        const movies = [
            {
                title: "Pahar Ki Awaaz — Full AI Cinematic Film",
                channel: "Titan Studios",
                views: "145K views • 2 days ago",
                thumb: "https://picsum.photos/seed/movie1/600/350",
                avatar: "https://picsum.photos/seed/avatar1/100"
            },
            {
                title: "Never Mine (Official AI Music Video Release)",
                channel: "Umar Alig",
                views: "52K views • 1 week ago",
                thumb: "https://picsum.photos/seed/movie2/600/350",
                avatar: "https://picsum.photos/seed/avatar2/100"
            }
        ];

        container.innerHTML = movies.map(m => `
            <div class="titan-feed-card" onclick="openTitanStudioGemini()">
                <img src="${m.thumb}" class="titan-feed-thumb" alt="${m.title}" />
                <div class="titan-feed-meta">
                    <img src="${m.avatar}" class="titan-feed-avatar" alt="${m.channel}" />
                    <div class="titan-feed-info">
                        <h3>${m.title}</h3>
                        <p>${m.channel} • ${m.views}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCustomLayout);
    } else {
        injectCustomLayout();
    }
})();
