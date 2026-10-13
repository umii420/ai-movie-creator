/**
 * ==========================================
 * PLATFORM: TITAN AI (Global Edition)
 * VERSION: v2.0.0-Titan-Release
 * FILE: app-extensions-v2.js
 * ARCHITECTURE: Dynamic UI & Feature Injector
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ TITAN AI Engine v2.0.0 Loaded Successfully!");

    // 1. Inject Titan UI Styles
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

    // 2. Inject Dynamic Sections into existing DOM
    function injectTitanComponents() {
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

    // 3. Mock Data Loaders
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
