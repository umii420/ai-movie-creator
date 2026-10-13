/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v2.3.0-Instagram-Reels-Integration
 * FILE: app-extensions-v2.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ TITAN AI Instagram + YouTube Hybrid Engine Loaded!");

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
        /* Custom Top Header Setup */
        .titan-top-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            background: #090a0f;
            position: sticky;
            top: 0;
            z-index: 999;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
            color: #fff;
            letter-spacing: -0.5px;
        }

        .titan-header-actions {
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .titan-icon-btn {
            background: transparent;
            border: none;
            color: #fff;
            font-size: 1.2rem;
            cursor: pointer;
            position: relative;
        }

        .titan-notif-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 8px;
            height: 8px;
            background-color: #ef4444;
            border-radius: 50%;
        }

        /* Instagram-style Reels/Stories Bar */
        .titan-stories-wrapper {
            padding: 12px 0;
            background: #090a0f;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
            background: #000;
            border: 2px solid #000;
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
            border: 2px solid #000;
        }

        .titan-story-thumb {
            width: 63px;
            height: 63px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #090a0f;
        }

        .titan-story-name {
            font-size: 0.72rem;
            margin-top: 5px;
            color: #d4d4d8;
            max-width: 70px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* YouTube-style Category Chips */
        .titan-chips-scroll {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 10px 15px;
            background: #090a0f;
            scrollbar-width: none;
        }
        .titan-chips-scroll::-webkit-scrollbar { display: none; }

        .titan-chip {
            background: rgba(255, 255, 255, 0.08);
            color: #fff;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
            cursor: pointer;
        }
        .titan-chip.active, .titan-chip:hover {
            background: #fff;
            color: #000;
        }

        /* Video Feed Cards */
        .titan-movie-feed {
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding: 15px 0 80px 0;
        }

        .titan-feed-card {
            background: transparent;
            cursor: pointer;
        }

        .titan-feed-thumb {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-radius: 12px;
        }

        .titan-feed-meta {
            display: flex;
            gap: 12px;
            padding: 12px 5px 0;
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
            color: #fff;
            margin-bottom: 4px;
            line-height: 1.3;
        }

        .titan-feed-info p {
            font-size: 0.8rem;
            color: #a1a1aa;
        }

        /* Bottom Navigation Bar */
        .titan-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #090a0f;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
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
            color: #a1a1aa;
            text-decoration: none;
            font-size: 0.7rem;
            gap: 3px;
            cursor: pointer;
        }
        .titan-nav-item i { font-size: 1.2rem; }
        .titan-nav-item.active { color: #fff; }

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
                    <button class="titan-icon-btn">
                        <i class="fa-regular fa-bell"></i>
                        <span class="titan-notif-badge"></span>
                    </button>
                    <button class="titan-icon-btn">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            `;
            document.body.prepend(header);
        }

        // Instagram-style Stories/Reels Section
        const topHeader = document.getElementById('titanTopHeader');
        if (topHeader && !document.getElementById('titanStoriesWrapper')) {
            const stories = document.createElement('div');
            stories.id = 'titanStoriesWrapper';
            stories.className = 'titan-stories-wrapper';
            stories.innerHTML = `
                <div class="titan-stories-scroll">
                    <!-- TITAN APP LOGO (First Circle) -->
                    <div class="titan-story-item">
                        <div class="titan-story-ring titan-story-app-logo">
                            <img src="data:image/svg+xml,${encodedSvg}" class="titan-story-thumb" alt="Titan AI" />
                            <div class="titan-story-add-icon"><i class="fa-solid fa-plus"></i></div>
                        </div>
                        <span class="titan-story-name">Titan AI</span>
                    </div>

                    <!-- Creator Reels Circles -->
                    <div class="titan-story-item">
                        <div class="titan-story-ring">
                            <img src="https://picsum.photos/seed/reel1/200" class="titan-story-thumb" />
                        </div>
                        <span class="titan-story-name">Cyber Thriller</span>
                    </div>
                    <div class="titan-story-item">
                        <div class="titan-story-ring">
                            <img src="https://picsum.photos/seed/reel2/200" class="titan-story-thumb" />
                        </div>
                        <span class="titan-story-name">Dragon Realm</span>
                    </div>
                    <div class="titan-story-item">
                        <div class="titan-story-ring">
                            <img src="https://picsum.photos/seed/reel3/200" class="titan-story-thumb" />
                        </div>
                        <span class="titan-story-name">Sufi Music</span>
                    </div>
                    <div class="titan-story-item">
                        <div class="titan-story-ring">
                            <img src="https://picsum.photos/seed/reel4/200" class="titan-story-thumb" />
                        </div>
                        <span class="titan-story-name">Neon Chase</span>
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
                <div class="titan-chip">Titan Shorts</div>
                <div class="titan-chip">Sufi Music</div>
                <div class="titan-chip">Sci-Fi Scripts</div>
            `;
            storiesWrapper.parentNode.insertBefore(chips, storiesWrapper.nextSibling);
        }

        // Video Feed
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
                <div class="titan-nav-item">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Titan Shorts</span>
                </div>
                <div class="titan-nav-item">
                    <div class="titan-nav-create"><i class="fa-solid fa-plus"></i></div>
                </div>
                <div class="titan-nav-item">
                    <i class="fa-solid fa-tv"></i>
                    <span>Subscriptions</span>
                </div>
                <div class="titan-nav-item">
                    <i class="fa-regular fa-user"></i>
                    <span>Profile</span>
                </div>
            `;
            document.body.appendChild(bottomNav);
        }
    }

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
            <div class="titan-feed-card">
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
