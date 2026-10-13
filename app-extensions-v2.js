/**
 * ==========================================
 * PLATFORM: TITAN AI (Global Edition)
 * VERSION: v2.1.0-Titan-Icon-Release
 * FILE: app-extensions-v2.js
 * ARCHITECTURE: Dynamic UI, Favicon & Feature Injector
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ TITAN AI Engine v2.1.0 Loaded Successfully!");

    // ----------------------------------------------------
    // 1. Dynamic Favicon & Header Logo Injector (Titan Shield 'T')
    // ----------------------------------------------------
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
        <!-- Dark Shield Background -->
        <polygon points="50,5 90,20 90,65 50,95 10,65 10,20" fill="#090a0f" stroke="url(#titanGold)" stroke-width="4"/>
        <!-- Titan 'T' Symbol -->
        <path d="M 28 28 L 72 28 L 72 38 L 56 38 L 56 75 L 44 75 L 44 38 L 28 38 Z" fill="url(#titanGold)"/>
        <!-- Cyber Accent Dot -->
        <circle cx="50" cy="83" r="4" fill="url(#cyberGlow)"/>
    </svg>`;

    const encodedSvg = encodeURIComponent(svgIcon);
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = `data:image/svg+xml,${encodedSvg}`;
    document.getElementsByTagName('head')[0].appendChild(link);

    // ----------------------------------------------------
    // 2. Inject Titan UI Styles (Reels, Feed & Logo Styling)
    // ----------------------------------------------------
    const titanStyle = document.createElement('style');
    titanStyle.innerHTML = `
        /* WhatsApp Style Reels Header Section */
        .titan-reels-wrapper {
            width: 100%;
            max-width: 800px;
            margin: 0 auto 30px;
            padding: 15px 0;
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid var(--border-glow);
            border-bottom: 1px solid var(--border-glow);
            text-align: left;
        }

        .titan-reels-title {
            font-family: var(--font-heading);
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            padding: 0 15px;
        }

        .titan-reels-scroll {
            display: flex;
            gap: 14px;
            overflow-x: auto;
            padding: 0 15px 5px;
            scrollbar-width: none;
        }
        .titan-reels-scroll::-webkit-scrollbar { display: none; }

        .titan-reel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            flex-shrink: 0;
            transition: transform 0.2s ease;
        }
        .titan-reel-item:hover { transform: scale(1.05); }

        .titan-reel-ring {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(45deg, #f59e0b, #ef4444);
            padding: 2.5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .titan-reel-thumb {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--bg-black);
        }

        .titan-reel-name {
            font-size: 0.75rem;
            margin-top: 6px;
            color: var(--text-main);
            max-width: 75px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 600;
        }

        /* YouTube Style Movie Feed Cards Override */
        .titan-movie-feed {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 20px;
        }

        .titan-feed-card {
            background: var(--card-bg);
            border: 1px solid var(--border-glow);
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            transition: 0.2s ease;
        }
        .titan-feed-card:hover { border-color: var(--accent-green); }

        .titan-feed-thumb {
            width: 100%;
            height: 220px;
            object-fit: cover;
            display: block;
        }

        .titan-feed-meta {
            padding: 15px;
            display: flex;
            gap: 12px;
        }

        .titan-feed-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            background: #27272a;
        }

        .titan-feed-info h3 {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 4px;
            color: var(--text-main);
            font-family: var(--font-heading);
            line-height: 1.3;
        }

        .titan-feed-info p {
            font-size: 0.82rem;
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(titanStyle);

    // ----------------------------------------------------
    // 3. Inject Dynamic Sections & Logo into DOM
    // ----------------------------------------------------
    function injectTitanComponents() {
        // Update Header Logo with Animated Golden Icon
        const logoDiv = document.querySelector('.logo');
        if (logoDiv) {
            logoDiv.innerHTML = `
                <span style="display:inline-flex; align-items:center; gap:8px;">
                    <img src="data:image/svg+xml,${encodedSvg}" style="width:28px; height:28px; filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.6));" />
                    <span style="font-family:var(--font-heading); font-weight:800; letter-spacing:-0.5px; color:var(--text-main);">TITAN <span style="color:var(--accent-green);">AI</span></span>
                </span>
            `;
        }

        // Inject Reels after Hero Prompt Section
        const heroSection = document.querySelector('.hero');
        if (heroSection && !document.getElementById('titanReelsWrapper')) {
            const reelsWrapper = document.createElement('div');
            reelsWrapper.id = 'titanReelsWrapper';
            reelsWrapper.className = 'titan-reels-wrapper';
            reelsWrapper.innerHTML = `
                <div class="titan-reels-title"><i class="fa-solid fa-fire" style="color: #f59e0b;"></i> Viral Reels & Stories</div>
                <div class="titan-reels-scroll" id="titanReelsContainer"></div>
            `;
            heroSection.parentNode.insertBefore(reelsWrapper, heroSection.nextSibling);
            populateReels();
        }

        // Inject Movie Feed inside Features Section
        const featuresSection = document.querySelector('.features-section');
        if (featuresSection && !document.getElementById('titanMovieFeed')) {
            const feedHeader = document.createElement('div');
            feedHeader.className = 'section-header';
            feedHeader.style.marginTop = '40px';
            feedHeader.innerText = 'TITAN FEATURED MOVIES & SHOWS';

            const movieFeed = document.createElement('div');
            movieFeed.id = 'titanMovieFeed';
            movieFeed.className = 'titan-movie-feed';

            featuresSection.appendChild(feedHeader);
            featuresSection.appendChild(movieFeed);
            populateMovieFeed();
        }
    }

    // ----------------------------------------------------
    // 4. Mock Data Loaders
    // ----------------------------------------------------
    function populateReels() {
        const container = document.getElementById('titanReelsContainer');
        if (!container) return;

        const reels = [
            { name: "Cyber Thriller", img: "https://picsum.photos/seed/reel1/200" },
            { name: "Dragon Realm", img: "https://picsum.photos/seed/reel2/200" },
            { name: "Sufi Rock AI", img: "https://picsum.photos/seed/reel3/200" },
            { name: "Neon Chase", img: "https://picsum.photos/seed/reel4/200" },
            { name: "Lost Horizon", img: "https://picsum.photos/seed/reel5/200" }
        ];

        container.innerHTML = reels.map(r => `
            <div class="titan-reel-item">
                <div class="titan-reel-ring">
                    <img src="${r.img}" class="titan-reel-thumb" alt="${r.name}" />
                </div>
                <span class="titan-reel-name">${r.name}</span>
            </div>
        `).join('');
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

    // Initialize when DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectTitanComponents);
    } else {
        injectTitanComponents();
    }

})();
