/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v2.7.0-Studio-Assistant-Upload
 * FILE: app-extensions-v2.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ TITAN AI Studio Assistant & Upload Engine Loaded!");

    // 1. Dynamic Favicon Injector
    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="titanGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" />
                <stop offset="50%" stop-color="#d97706" />
                <stop offset="100%" stop-color="#78350f" />
            </linearGradient>
            <linearGradient id="cyberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00dfd8" />
                <stop offset="100%" stop-color="#0072ff" />
            </linearGradient>
        </defs>
        <polygon points="50,5 90,20 90,65 50,95 10,65 10,20" fill="#090a0f" stroke="url(#titanGold)" stroke-width="4"/>
        <path d="M 28 28 L 72 28 L 72 38 L 56 38 L 56 75 L 44 75 L 44 38 L 28 38 Z" fill="url(#titanGold)"/>
        <circle cx="50" cy="83" r="4" fill="url(#cyberGlow)"/>
    </svg>`;

    const encodedSvg = encodeURIComponent(svgIcon);
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = `data:image/svg+xml,${encodedSvg}`;
    document.getElementsByTagName('head')[0].appendChild(link);

    // 2. Dynamic Styles Injector
    const titanStyle = document.createElement('style');
    titanStyle.innerHTML = `
        :root {
            --titan-bg: #090a0f;
            --titan-card-bg: #12141c;
            --titan-text: #ffffff;
            --titan-muted: #a1a1aa;
            --titan-border: rgba(255, 255, 255, 0.08);
        }

        body.titan-light-mode {
            --titan-bg: #f8fafc;
            --titan-card-bg: #ffffff;
            --titan-text: #0f172a;
            --titan-muted: #64748b;
            --titan-border: rgba(0, 0, 0, 0.08);
        }

        body {
            background-color: var(--titan-bg) !important;
            color: var(--titan-text) !important;
            transition: background 0.3s ease, color 0.3s ease;
        }

        /* Header Setup */
        .titan-top-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            background: var(--titan-bg);
            position: sticky;
            top: 0;
            z-index: 999;
            border-bottom: 1px solid var(--titan-border);
        }

        .titan-logo-group {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }

        .titan-logo-title {
            font-family: sans-serif;
            font-weight: 800;
            font-size: 1.2rem;
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
            font-size: 1.1rem;
            cursor: pointer;
            position: relative;
            padding: 6px;
            border-radius: 50%;
            transition: background 0.2s;
        }
        .titan-icon-btn:hover { background: var(--titan-border); }

        .titan-notif-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 7px;
            height: 7px;
            background-color: #ef4444;
            border-radius: 50%;
        }

        /* Stories Bar */
        .titan-stories-wrapper {
            padding: 12px 0;
            background: var(--titan-bg);
            border-bottom: 1px solid var(--titan-border);
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

        .titan-story-app-logo {
            background: var(--titan-bg);
            border: 2px solid var(--titan-bg);
        }

        .titan-story-add-icon {
            position: absolute;
            bottom: 2px;
            right: 2px;
            background: #0072ff;
            color: #fff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            border: 2px solid var(--titan-bg);
        }

        .titan-story-thumb {
            width: 63px;
            height: 63px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--titan-bg);
        }

        .titan-story-name {
            font-size: 0.72rem;
            margin-top: 5px;
            color: var(--titan-muted);
            max-width: 70px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* Chips Bar */
        .titan-chips-scroll {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 10px 15px;
            background: var(--titan-bg);
            border-bottom: 1px solid var(--titan-border);
            scrollbar-width: none;
        }
        .titan-chips-scroll::-webkit-scrollbar { display: none; }

        .titan-chip {
            background: var(--titan-card-bg);
            color: var(--titan-text);
            border: 1px solid var(--titan-border);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
            cursor: pointer;
        }
        .titan-chip.active, .titan-chip:hover {
            background: #f59e0b;
            color: #000;
            border-color: #f59e0b;
        }

        /* Movie Feed */
        .titan-movie-feed {
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding: 15px;
            padding-bottom: 90px;
        }

        .titan-feed-card {
            background: var(--titan-card-bg);
            border: 1px solid var(--titan-border);
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
        }

        .titan-feed-thumb {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .titan-feed-meta {
            display: flex;
            gap: 12px;
            padding: 12px;
        }

        .titan-feed-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            object-fit: cover;
        }

        .titan-feed-info h3 {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--titan-text);
            margin-bottom: 4px;
            line-height: 1.3;
        }

        .titan-feed-info p {
            font-size: 0.8rem;
            color: var(--titan-muted);
        }

        /* TikTok Shorts Overlay */
        .titan-shorts-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #000;
            z-index: 2000;
            display: none;
            flex-direction: column;
        }
        .titan-shorts-container.active { display: flex; }

        .titan-shorts-header {
            position: absolute;
            top: 15px;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 20px;
            z-index: 2010;
            color: #fff;
            font-size: 0.95rem;
            font-weight: 600;
        }
        .titan-shorts-header span { opacity: 0.6; cursor: pointer; }
        .titan-shorts-header span.active { opacity: 1; border-bottom: 2px solid #fff; padding-bottom: 2px; }

        .titan-shorts-reel-box {
            position: relative;
            width: 100%;
            height: 100%;
            background: #111;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .titan-shorts-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .titan-shorts-sidebar {
            position: absolute;
            right: 15px;
            bottom: 90px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            z-index: 2020;
            color: #fff;
        }

        .titan-shorts-action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            background: transparent;
            border: none;
            color: #fff;
            cursor: pointer;
        }
        .titan-shorts-action-btn i { font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

        .titan-shorts-caption {
            position: absolute;
            left: 15px;
            bottom: 80px;
            right: 80px;
            z-index: 2020;
            color: #fff;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }
        .titan-shorts-caption h4 { font-size: 0.95rem; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
        .titan-shorts-caption p { font-size: 0.85rem; opacity: 0.9; margin-bottom: 4px; }

        /* Titan Studio Modal Setup */
        .titan-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 3000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .titan-modal-overlay.active { display: flex; }

        .titan-modal-card {
            background: #0f121d;
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 16px;
            width: 100%;
            max-width: 500px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            position: relative;
        }

        .titan-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            border: none;
            color: #a1a1aa;
            font-size: 1.2rem;
            cursor: pointer;
        }

        .titan-studio-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 12px;
            color: #fff;
            margin-top: 15px;
            font-family: inherit;
            resize: none;
        }
        .titan-studio-input:focus { outline: none; border-color: #f59e0b; }

        .titan-btn-primary {
            width: 100%;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #000;
            font-weight: 700;
            border: none;
            padding: 12px;
            border-radius: 10px;
            margin-top: 15px;
            cursor: pointer;
            transition: 0.2s;
        }
        .titan-btn-primary:hover { opacity: 0.9; }

        /* Bottom Nav */
        .titan-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: var(--titan-bg);
            border-top: 1px solid var(--titan-border);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 8px 0;
            z-index: 1000;
        }

        .titan-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: var(--titan-muted);
            text-decoration: none;
            font-size: 0.7rem;
            gap: 3px;
            cursor: pointer;
        }
        .titan-nav-item i { font-size: 1.2rem; }
        .titan-nav-item.active { color: var(--titan-text); }

        .titan-nav-create {
            background: linear-gradient(135deg, #f59e0b, #ef4444);
            color: #fff !important;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
            cursor: pointer;
        }
    `;
    document.head.appendChild(titanStyle);

    // 3. Inject Layout Elements into Document
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
                    <button class="titan-icon-btn" id="titanThemeToggle" title="Toggle Theme">
                        <i class="fa-solid fa-moon" id="titanThemeIcon"></i>
                    </button>
                    <button class="titan-icon-btn" title="Notifications">
                        <i class="fa-regular fa-bell"></i>
                        <span class="titan-notif-badge"></span>
                    </button>
                    <button class="titan-icon-btn" title="Search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            `;
            document.body.prepend(header);

            document.getElementById('titanThemeToggle').addEventListener('click', () => {
                document.body.classList.toggle('titan-light-mode');
                const isLight = document.body.classList.contains('titan-light-mode');
                document.getElementById('titanThemeIcon').className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            });
        }

        // Stories Bar
        const topHeader = document.getElementById('titanTopHeader');
        if (topHeader && !document.getElementById('titanStoriesWrapper')) {
            const stories = document.createElement('div');
            stories.id = 'titanStoriesWrapper';
            stories.className = 'titan-stories-wrapper';
            stories.innerHTML = `
                <div class="titan-stories-scroll">
                    <div class="titan-story-item" onclick="openTitanStudio()">
                        <div class="titan-story-ring titan-story-app-logo">
                            <img src="data:image/svg+xml,${encodedSvg}" class="titan-story-thumb" alt="Titan AI" />
                            <div class="titan-story-add-icon"><i class="fa-solid fa-plus"></i></div>
                        </div>
                        <span class="titan-story-name">Titan AI</span>
                    </div>
                    <div class="titan-story-item" onclick="openTitanShorts()">
                        <div class="titan-story-ring"><img src="https://picsum.photos/seed/reel1/200" class="titan-story-thumb" /></div>
                        <span class="titan-story-name">Cyber Thriller</span>
                    </div>
                    <div class="titan-story-item" onclick="openTitanShorts()">
                        <div class="titan-story-ring"><img src="https://picsum.photos/seed/reel2/200" class="titan-story-thumb" /></div>
                        <span class="titan-story-name">Dragon Realm</span>
                    </div>
                    <div class="titan-story-item" onclick="openTitanShorts()">
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
                <div class="titan-chip" onclick="openTitanShorts()">Titan Shorts</div>
                <div class="titan-chip">Sufi Music</div>
                <div class="titan-chip">Sci-Fi Scripts</div>
            `;
            storiesWrapper.parentNode.insertBefore(chips, storiesWrapper.nextSibling);
        }

        // Movie Feed
        const featuresSection = document.querySelector('.features-section');
        if (featuresSection && !document.getElementById('titanMovieFeed')) {
            const movieFeed = document.createElement('div');
            movieFeed.id = 'titanMovieFeed';
            movieFeed.className = 'titan-movie-feed';
            featuresSection.appendChild(movieFeed);
            populateMovieFeed();
        }

        // Bottom Navigation Bar
        if (!document.getElementById('titanBottomNav')) {
            const bottomNav = document.createElement('div');
            bottomNav.id = 'titanBottomNav';
            bottomNav.className = 'titan-bottom-nav';
            bottomNav.innerHTML = `
                <div class="titan-nav-item active" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <i class="fa-solid fa-house"></i>
                    <span>Home</span>
                </div>
                <div class="titan-nav-item" onclick="openTitanShorts()">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Titan Shorts</span>
                </div>
                <div class="titan-nav-item">
                    <div class="titan-nav-create" onclick="openTitanUpload()"><i class="fa-solid fa-plus"></i></div>
                </div>
                <div class="titan-nav-item" onclick="openTitanStudio()">
                    <i class="fa-solid fa-clapperboard"></i>
                    <span>Titan Studio</span>
                </div>
                <div class="titan-nav-item">
                    <i class="fa-regular fa-user"></i>
                    <span>Profile</span>
                </div>
            `;
            document.body.appendChild(bottomNav);
        }

        // TikTok Style Shorts Overlay
        if (!document.getElementById('titanShortsModal')) {
            const modal = document.createElement('div');
            modal.id = 'titanShortsModal';
            modal.className = 'titan-shorts-container';
            modal.innerHTML = `
                <div class="titan-shorts-header">
                    <span>STEM</span>
                    <span>Community</span>
                    <span>Following</span>
                    <span class="active">For You</span>
                    <i class="fa-solid fa-magnifying-glass" style="position: absolute; right: 20px; top: 2px;"></i>
                </div>
                <div class="titan-shorts-reel-box">
                    <img src="https://picsum.photos/seed/tiktokreel/600/900" class="titan-shorts-video" alt="Short Reel" />
                    
                    <div class="titan-shorts-caption">
                        <h4>Titan Studios <i class="fa-solid fa-circle-check" style="color:#00dfd8; font-size:0.8rem;"></i></h4>
                        <p>Tehri chaahat mein kitna fasana hua... #TitanAI #Shorts</p>
                        <span style="font-size: 0.75rem; opacity: 0.8;"><i class="fa-solid fa-music"></i> Original Audio - Titan AI Studio</span>
                    </div>

                    <div class="titan-shorts-sidebar">
                        <div style="position: relative;">
                            <img src="https://picsum.photos/seed/avatar1/100" style="width:45px; height:45px; border-radius:50%; border: 2px solid #fff;" />
                            <div style="position: absolute; bottom: -5px; left: 14px; background: #ef4444; color: #fff; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px;">+</div>
                        </div>
                        <button class="titan-shorts-action-btn"><i class="fa-solid fa-heart" style="color: #ef4444;"></i><span>9,688</span></button>
                        <button class="titan-shorts-action-btn"><i class="fa-solid fa-comment-dots"></i><span>144</span></button>
                        <button class="titan-shorts-action-btn"><i class="fa-solid fa-bookmark"></i><span>531</span></button>
                        <button class="titan-shorts-action-btn"><i class="fa-solid fa-share"></i><span>175</span></button>
                    </div>
                </div>

                <div class="titan-bottom-nav" style="background: rgba(0,0,0,0.9); border-top: 1px solid rgba(255,255,255,0.1);">
                    <div class="titan-nav-item active" onclick="closeTitanShorts()">
                        <i class="fa-solid fa-house"></i>
                        <span>Home</span>
                    </div>
                    <div class="titan-nav-item">
                        <i class="fa-solid fa-user-group"></i>
                        <span>Friends</span>
                    </div>
                    <div class="titan-nav-item">
                        <div class="titan-nav-create" onclick="openTitanUpload()"><i class="fa-solid fa-plus"></i></div>
                    </div>
                    <div class="titan-nav-item">
                        <i class="fa-regular fa-comment-dots"></i>
                        <span>Inbox</span>
                    </div>
                    <div class="titan-nav-item">
                        <i class="fa-regular fa-user"></i>
                        <span>Profile</span>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Titan Studio AI Assistant Modal
        if (!document.getElementById('titanStudioModal')) {
            const studioModal = document.createElement('div');
            studioModal.id = 'titanStudioModal';
            studioModal.className = 'titan-modal-overlay';
            studioModal.innerHTML = `
                <div class="titan-modal-card">
                    <button class="titan-modal-close" onclick="closeTitanStudio()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="color:#f59e0b; display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Titan Studio Assistant
                    </h3>
                    <p style="font-size:0.85rem; color:#a1a1aa; margin-top:5px;">Apni AI movie ki script ya dialogue yahan generate karwayen:</p>
                    <textarea class="titan-studio-input" rows="4" placeholder="Maslan: Ek sci-fi movie ki kahani Roman Urdu mein likho..."></textarea>
                    <button class="titan-btn-primary" onclick="alert('Script Generation Engine Active!')">Generate Script & Scenes</button>
                </div>
            `;
            document.body.appendChild(studioModal);
        }

        // Long-form Video Upload Modal (Center Plus Button)
        if (!document.getElementById('titanUploadModal')) {
            const uploadModal = document.createElement('div');
            uploadModal.id = 'titanUploadModal';
            uploadModal.className = 'titan-modal-overlay';
            uploadModal.innerHTML = `
                <div class="titan-modal-card">
                    <button class="titan-modal-close" onclick="closeTitanUpload()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="color:#fff; display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-cloud-arrow-up" style="color:#f59e0b;"></i> Upload AI Movie
                    </h3>
                    <p style="font-size:0.85rem; color:#a1a1aa; margin-top:5px;">10 se 20 minute ki Cinematic Movie upload karein:</p>
                    <input type="text" class="titan-studio-input" placeholder="Movie Title (e.g. Pahar Ki Awaaz)" />
                    <textarea class="titan-studio-input" rows="2" placeholder="Movie Description & Credits..."></textarea>
                    <div style="border: 2px dashed rgba(255,255,255,0.2); padding: 20px; text-align: center; border-radius: 10px; margin-top: 15px; cursor: pointer;">
                        <i class="fa-solid fa-file-video" style="font-size: 2rem; color: #f59e0b;"></i>
                        <p style="font-size: 0.8rem; margin-top: 8px; color: #ccc;">Drag & Drop or Click to Select Video File</p>
                    </div>
                    <button class="titan-btn-primary" onclick="alert('Movie Uploading to Titan Feed...')">Publish Movie to Feed</button>
                </div>
            `;
            document.body.appendChild(uploadModal);
        }
    }

    // Modal Control Functions
    window.openTitanShorts = function() {
        const modal = document.getElementById('titanShortsModal');
        if (modal) modal.classList.add('active');
    };

    window.closeTitanShorts = function() {
        const modal = document.getElementById('titanShortsModal');
        if (modal) modal.classList.remove('active');
    };

    window.openTitanStudio = function() {
        const modal = document.getElementById('titanStudioModal');
        if (modal) modal.classList.add('active');
    };

    window.closeTitanStudio = function() {
        const modal = document.getElementById('titanStudioModal');
        if (modal) modal.classList.remove('active');
    };

    window.openTitanUpload = function() {
        const modal = document.getElementById('titanUploadModal');
        if (modal) modal.classList.add('active');
    };

    window.closeTitanUpload = function() {
        const modal = document.getElementById('titanUploadModal');
        if (modal) modal.classList.remove('active');
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
            <div class="titan-feed-card" onclick="openTitanShorts()">
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
