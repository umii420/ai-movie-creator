/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v3.7.0-Hero-Integrated
 * FILE: app-extensions-v2.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ TITAN AI Ecosystem & Hero Section Active!");

    // 1. Dynamic Favicon Injector
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 90,20 90,65 50,95 10,65 10,20" fill="#090a0f" stroke="#f59e0b" stroke-width="4"/><path d="M 28 28 L 72 28 L 72 38 L 56 38 L 56 75 L 44 75 L 44 38 L 28 38 Z" fill="#f59e0b"/><circle cx="50" cy="83" r="4" fill="#00dfd8"/></svg>`;
    const encodedSvg = encodeURIComponent(svgIcon);
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = 'data:image/svg+xml,' + encodedSvg;
    document.getElementsByTagName('head')[0].appendChild(link);

    // 2. Comprehensive Styles including Hero Section
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
            --verified-blue: #00b2ff;
        }

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
            margin: 0;
            padding-bottom: 90px;
        }

        /* Top Header */
        .titan-top-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 20px; background: var(--titan-nav-bg);
            backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 999;
            border-bottom: 1px solid var(--titan-border);
        }
        .titan-logo-group { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .titan-logo-title { font-weight: 800; font-size: 1.25rem; color: var(--titan-text); }
        .titan-header-actions { display: flex; align-items: center; gap: 14px; }
        .titan-icon-btn {
            background: transparent; border: none; color: var(--titan-text);
            font-size: 1.15rem; cursor: pointer; padding: 6px; border-radius: 50%;
        }

        /* Hero Section Styling */
        .titan-hero-section {
            padding: 25px 5% 20px;
            text-align: center;
            max-width: 950px;
            margin: 0 auto;
        }
        .hero-verified-tag {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(0, 178, 255, 0.12); border: 1px solid rgba(0, 178, 255, 0.4);
            color: var(--verified-blue); padding: 7px 18px; border-radius: 30px;
            font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 18px;
        }
        .titan-hero-section h1 {
            font-size: clamp(1.8rem, 4.8vw, 3rem); font-weight: 800; line-height: 1.15;
            text-transform: uppercase; margin-bottom: 16px; color: var(--titan-text);
        }
        .titan-hero-section h1 span {
            background: linear-gradient(135deg, #f59e0b, #ffd700);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .titan-hero-section p {
            font-size: 0.95rem; color: var(--titan-muted); max-width: 700px; margin: 0 auto 25px;
        }
        .earning-cta-box {
            display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 25px;
        }
        .btn-vip-primary {
            background: linear-gradient(135deg, var(--verified-blue), #0072ff);
            color: #ffffff; padding: 12px 28px; border-radius: 30px; font-weight: 800;
            font-size: 0.95rem; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-vip-gold {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #000000; padding: 12px 28px; border-radius: 30px; font-weight: 800;
            font-size: 0.95rem; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .trust-stats-bar {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px; background: var(--titan-card-bg); border: 1px solid var(--titan-border);
            padding: 18px; border-radius: 20px; margin-bottom: 20px;
        }
        .stat-item h4 { font-size: 1.4rem; font-weight: 800; color: var(--titan-text); }
        .stat-item p { font-size: 0.72rem; color: var(--titan-muted); font-weight: 700; text-transform: uppercase; margin-top: 3px; }

        /* Stories Bar */
        .titan-stories-wrapper { padding: 12px 0; background: var(--titan-bg); border-bottom: 1px solid var(--titan-border); }
        .titan-stories-scroll { display: flex; gap: 12px; overflow-x: auto; padding: 0 15px; scrollbar-width: none; }
        .titan-stories-scroll::-webkit-scrollbar { display: none; }
        .titan-story-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; flex-shrink: 0; }
        .titan-story-ring { width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(45deg, #f59e0b, #ef4444); padding: 2px; display: flex; align-items: center; justify-content: center; }
        .titan-story-thumb { width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 2px solid var(--titan-bg); }
        .titan-story-name { font-size: 0.72rem; font-weight: 600; margin-top: 5px; color: var(--titan-muted); text-align: center; }

        /* Chips */
        .titan-chips-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 10px 15px; background: var(--titan-bg); border-bottom: 1px solid var(--titan-border); scrollbar-width: none; }
        .titan-chips-scroll::-webkit-scrollbar { display: none; }
        .titan-chip { background: var(--titan-chip-bg); color: var(--titan-text); border: 1px solid var(--titan-border); padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .titan-chip.active, .titan-chip:hover { background: #f59e0b !important; color: #000 !important; border-color: #f59e0b !important; }

        /* Bottom Nav */
        .titan-bottom-nav {
            position: fixed; bottom: 0; left: 0; width: 100%;
            background: var(--titan-nav-bg); backdrop-filter: blur(12px);
            border-top: 1px solid var(--titan-border); display: flex;
            justify-content: space-around; align-items: center; padding: 10px 0; z-index: 1000;
        }
        .titan-nav-item { display: flex; flex-direction: column; align-items: center; color: var(--titan-muted); font-size: 0.7rem; font-weight: 600; gap: 3px; cursor: pointer; }
        .titan-nav-item i { font-size: 1.2rem; }
        .titan-nav-item.active { color: var(--titan-text); }
        .titan-nav-create {
            background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff !important;
            width: 42px; height: 42px; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; font-size: 1.3rem;
        }

        /* Shorts Viewer */
        .tiktok-shorts-viewer { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #000; z-index: 99999; display: none; flex-direction: column; }
        .tiktok-shorts-viewer.active { display: flex; }
        .shorts-top-bar { position: absolute; top: 15px; left: 0; width: 100%; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; z-index: 10; color: #fff; }
        .shorts-close-btn { background: rgba(0,0,0,0.5); border: none; color: #fff; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; }
        .shorts-video-box { position: relative; width: 100%; height: 100%; background: #000; display: flex; align-items: center; justify-content: center; }
        .shorts-dummy-media { width: 100%; height: 100%; object-fit: cover; }
        .shorts-overlay-info { position: absolute; bottom: 25px; left: 15px; right: 80px; color: #fff; z-index: 5; }
        .shorts-side-actions { position: absolute; right: 15px; bottom: 40px; display: flex; flex-direction: column; gap: 18px; align-items: center; z-index: 5; color: #fff; }
        .shorts-action-item { display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 1.3rem; cursor: pointer; }
        .shorts-action-item span { font-size: 0.7rem; font-weight: 600; }
    `;
    document.head.appendChild(titanStyle);

    // 3. Inject Layout Dynamically
    function injectEcosystemLayout() {
        // Top Header
        if (!document.getElementById('titanTopHeader')) {
            const header = document.createElement('div');
            header.id = 'titanTopHeader';
            header.className = 'titan-top-header';
            header.innerHTML = `
                <div class="titan-logo-group" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <img src="data:image/svg+xml,${encodedSvg}" style="width:25px; height:25px;" />
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
            document.getElementById('titanThemeToggle').addEventListener('click', toggleThemeSync);
        }

        // Hero Section (Blue Tick & Revenue Banner)
        if (!document.getElementById('titanHeroSection')) {
            const hero = document.createElement('section');
            hero.id = 'titanHeroSection';
            hero.className = 'titan-hero-section';
            hero.innerHTML = `
                <div class="hero-verified-tag">
                    <i class="fa-solid fa-circle-check"></i> Verified Creator Partnership Network
                </div>
                <h1>CLAIM YOUR <span>BLUE TICK BADGE</span> & MONETIZE INSTANTLY</h1>
                <p>Unlock elite creator privileges on Titan AI. Publish long-form cinematic releases and vertical reels, build an exclusive subscriber base, and generate guaranteed high-tier revenue daily.</p>

                <div class="earning-cta-box">
                    <button class="btn-vip-primary" onclick="openAccountModal()">
                        <i class="fa-solid fa-circle-check"></i> Apply For Blue Tick Account
                    </button>
                    <button class="btn-vip-gold" onclick="openTitanStudioGemini()">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Launch Titan Studio
                    </button>
                </div>

                <div class="trust-stats-bar">
                    <div class="stat-item">
                        <h4>$250,000+ <i class="fa-solid fa-circle-check" style="color:var(--verified-blue);"></i></h4>
                        <p>Distributed Revenue</p>
                    </div>
                    <div class="stat-item">
                        <h4>35,000+ <i class="fa-solid fa-user-shield" style="color:var(--verified-blue);"></i></h4>
                        <p>Verified Creators</p>
                    </div>
                    <div class="stat-item">
                        <h4>Instant <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i></h4>
                        <p>Daily Cashouts</p>
                    </div>
                </div>
            `;
            const headerElem = document.getElementById('titanTopHeader');
            headerElem ? headerElem.after(hero) : document.body.prepend(hero);
        }

        // Stories Bar
        if (!document.getElementById('titanStoriesWrapper')) {
            const stories = document.createElement('div');
            stories.id = 'titanStoriesWrapper';
            stories.className = 'titan-stories-wrapper';
            stories.innerHTML = `
                <div class="titan-stories-scroll">
                    <div class="titan-story-item" onclick="openTitanStudioGemini()">
                        <div class="titan-story-ring"><img src="data:image/svg+xml,${encodedSvg}" class="titan-story-thumb" /></div>
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
                </div>
            `;
            const heroElem = document.getElementById('titanHeroSection');
            heroElem ? heroElem.after(stories) : document.body.prepend(stories);
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

        // TikTok Shorts Viewer Overlay
        if (!document.getElementById('tiktokShortsViewer')) {
            const shortsViewer = document.createElement('div');
            shortsViewer.id = 'tiktokShortsViewer';
            shortsViewer.className = 'tiktok-shorts-viewer';
            shortsViewer.innerHTML = `
                <div class="shorts-top-bar">
                    <span style="font-weight: 800; font-size: 1.1rem;">Titan Shorts <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i></span>
                    <button class="shorts-close-btn" onclick="closeTikTokShorts()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="shorts-video-box">
                    <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop" class="shorts-dummy-media" />
                    <div class="shorts-overlay-info">
                        <h4>@Titan_Creator <i class="fa-solid fa-circle-check" style="color:#00dfd8; font-size:0.85rem;"></i></h4>
                        <p>Cyberpunk Cinematic Teaser #TitanAI #Reels</p>
                    </div>
                    <div class="shorts-side-actions">
                        <div class="shorts-action-item"><i class="fa-solid fa-heart" style="color:#ef4444;"></i><span>24.5K</span></div>
                        <div class="shorts-action-item"><i class="fa-solid fa-comment"></i><span>1,208</span></div>
                        <div class="shorts-action-item"><i class="fa-solid fa-share-nodes"></i><span>Share</span></div>
                    </div>
                </div>
            `;
            document.body.appendChild(shortsViewer);
        }

        updateThemeIconState();
    }

    function toggleThemeSync() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme_preference', isLight ? 'light' : 'dark');
        updateThemeIconState();
    }

    function updateThemeIconState() {
        const isLight = document.body.classList.contains('light-mode');
        const icon = document.getElementById('titanThemeIcon');
        if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    window.openTikTokShorts = function() {
        document.getElementById('tiktokShortsViewer')?.classList.add('active');
    };

    window.closeTikTokShorts = function() {
        document.getElementById('tiktokShortsViewer')?.classList.remove('active');
    };

    window.toggleSettingsDrawer = function() {
        if (window.openTitanOptions) window.openTitanOptions();
        else if (window.openTitanMainProfile) window.openTitanMainProfile();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectEcosystemLayout);
    } else {
        injectEcosystemLayout();
    }
})();
