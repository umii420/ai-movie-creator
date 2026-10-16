/**
 * =========================================================
 * TITAN AI PROFILE + SETTINGS SYSTEM (TikTok Style)
 * FILE: app-profile-system.js
 * =========================================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Profile + Settings System Active");

    // Styles
    const style = document.createElement('style');
    style.id = 'titan-profile-styles-v6';
    style.innerHTML = `
        :root {
            --prof-bg: #ffffff;
            --prof-card-bg: #f8fafc;
            --prof-text: #0f172a;
            --prof-muted: #64748b;
            --prof-border: rgba(226, 232, 240, 0.8);
        }
        body.dark-mode, body:not(.light-mode) {
            --prof-bg: #000000;
            --prof-card-bg: #121212;
            --prof-text: #ffffff;
            --prof-muted: #a1a1aa;
            --prof-border: rgba(255, 255, 255, 0.12);
        }

        .titan-profile-page {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background: var(--prof-bg) !important;
            color: var(--prof-text) !important;
            z-index: 999999999 !important;
            display: none;
            flex-direction: column !important;
            overflow-y: auto !important;
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif !important;
        }
        .titan-profile-page.active { display: flex !important; }

        .prof-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 18px; background: var(--prof-bg);
            position: sticky; top: 0; z-index: 10;
            border-bottom: 1px solid var(--prof-border);
        }
        .prof-header-icon {
            background: transparent; border: none; font-size: 1.3rem;
            color: var(--prof-text); cursor: pointer; width: 36px; height: 36px;
            display: flex; align-items: center; justify-content: center;
        }

        .main-prof-avatar-wrap {
            position: relative; width: 100px; height: 100px;
            margin: 18px auto 10px; border-radius: 50%; overflow: hidden;
            border: 2px solid var(--prof-border);
            box-shadow: 0 4px 15px rgba(0,0,0,0.12);
            background: #18181b;
        }
        .main-prof-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }

        .user-handle-tag {
            text-align: center; font-size: 0.92rem; font-weight: 600;
            color: var(--prof-muted); margin-bottom: 14px;
        }

        .stats-row {
            display: flex; justify-content: center; align-items: center;
            gap: 28px; margin: 12px 0 18px; text-align: center;
        }
        .stat-item .num { font-weight: 800; font-size: 1.2rem; color: var(--prof-text); display: block; }
        .stat-item .lbl { font-size: 0.8rem; color: var(--prof-muted); margin-top: 2px; }

        .bio-box {
            text-align: center; padding: 0 25px; font-size: 0.88rem;
            color: var(--prof-text); line-height: 1.45; margin-bottom: 18px;
        }
        .bio-link { color: #00b2ff; text-decoration: none; word-break: break-all; font-weight: 500; }

        .tabs-bar {
            display: flex; justify-content: space-around;
            border-top: 1px solid var(--prof-border);
            border-bottom: 1px solid var(--prof-border);
            padding: 12px 0; background: var(--prof-bg);
        }
        .tab-btn { background: transparent; border: none; font-size: 1.25rem; color: var(--prof-muted); cursor: pointer; }
        .tab-btn.active { color: var(--prof-text); border-bottom: 2px solid var(--prof-text); padding-bottom: 4px; }

        .video-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; padding: 2px 0; background: var(--prof-bg); }
        .grid-item { aspect-ratio: 3/4; background: #18181b; position: relative; overflow: hidden; cursor: pointer; }
        .grid-item img, .grid-item video { width: 100%; height: 100%; object-fit: cover; }

        /* Side Drawer */
        .titan-side-drawer {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
            z-index: 9999999999 !important; display: none; justify-content: flex-end;
        }
        .titan-side-drawer.active { display: flex; }
        .side-drawer-content {
            background: var(--prof-bg);
            width: 85%; max-width: 360px; height: 100%;
            padding: 20px 0 40px; overflow-y: auto;
            color: var(--prof-text);
            box-shadow: -5px 0 25px rgba(0,0,0,0.3);
        }

        .sheet-section-title {
            font-size: 0.75rem; font-weight: 700; color: var(--prof-muted);
            text-transform: uppercase; padding: 16px 20px 8px; letter-spacing: 0.5px;
        }
        .sheet-row {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 20px; cursor: pointer; font-size: 0.95rem; font-weight: 500;
            border-bottom: 1px solid var(--prof-border);
        }
        .sheet-row:active { background: rgba(0,0,0,0.05); }
        .sheet-row i.left-icon { width: 26px; font-size: 1.15rem; margin-right: 12px; }
        .sheet-row .right-arrow { color: var(--prof-muted); font-size: 0.85rem; }

        /* Settings Page */
        .titan-settings-page {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background: var(--prof-bg) !important;
            color: var(--prof-text) !important;
            z-index: 9999999999 !important;
            display: none;
            flex-direction: column !important;
            overflow-y: auto !important;
        }
        .titan-settings-page.active { display: flex !important; }

        .settings-header {
            display: flex; align-items: center; gap: 15px;
            padding: 14px 16px; border-bottom: 1px solid var(--prof-border);
            position: sticky; top: 0; background: var(--prof-bg); z-index: 5;
        }
        .settings-header h2 { font-size: 1.15rem; font-weight: 700; margin: 0; }

        .settings-section-title {
            font-size: 0.78rem; font-weight: 700; color: var(--prof-muted);
            text-transform: uppercase; padding: 18px 16px 8px; letter-spacing: 0.4px;
        }
        .settings-row {
            display: flex; align-items: center; justify-content: space-between;
            padding: 15px 16px; cursor: pointer; font-size: 0.95rem;
            border-bottom: 1px solid var(--prof-border);
        }
        .settings-row:active { background: rgba(0,0,0,0.04); }
        .settings-row .left { display: flex; align-items: center; gap: 14px; }
        .settings-row i { font-size: 1.15rem; width: 24px; text-align: center; }
        .settings-row .arrow { color: var(--prof-muted); font-size: 0.85rem; }
        .settings-row .value { color: var(--prof-muted); font-size: 0.88rem; margin-right: 8px; }
    `;
    document.head.appendChild(style);

    // Get Profile Data
    function getUserProfileData() {
        try {
            const stored = localStorage.getItem('titan_user_profile');
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return {
            name: "Titan Creator",
            handle: "@creator",
            photo: "https://ui-avatars.com/api/?name=User&background=00b2ff&color=fff",
            bio: "Titan AI Creator",
            ytLink: "",
            followers: "0",
            following: "0",
            likes: "0"
        };
    }

    function saveUserProfileData(data) {
        localStorage.setItem('titan_user_profile', JSON.stringify(data));
    }

    // Render Video Grid
    function renderVideoGrid() {
        const grid = document.getElementById('titanProfileVideoGrid');
        if (!grid) return;

        let uploads = [];
        try {
            uploads = JSON.parse(localStorage.getItem('titan_user_uploads') || '[]');
        } catch (e) {}

        if (uploads.length === 0) {
            grid.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 50px 15px; color: var(--prof-muted); font-size: 0.9rem;">No videos uploaded yet.<br>Tap + to upload!</div>`;
            return;
        }

        grid.innerHTML = uploads.map(vid => `
            <div class="grid-item">
                <img src="${vid.thumb || 'https://via.placeholder.com/300'}" alt="Video" />
            </div>
        `).join('');
    }

    // Build UI
    function initProfileUI() {
        if (document.getElementById('titanMainProfilePage')) return;
        const p = getUserProfileData();

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <!-- MAIN PROFILE PAGE -->
            <div id="titanMainProfilePage" class="titan-profile-page">
                <div class="prof-header">
                    <button class="prof-header-icon" onclick="openTitanEditProfile()"><i class="fa-solid fa-pen"></i></button>
                    <h3 id="profileDisplayName" style="font-size:1.1rem; font-weight:700; margin:0;">${p.name}</h3>
                    <button class="prof-header-icon" onclick="openTitanOptions()"><i class="fa-solid fa-bars"></i></button>
                </div>

                <div class="main-prof-avatar-wrap">
                    <img id="mainProfileAvatar" src="${p.photo}" alt="Profile" />
                </div>

                <div id="profileDisplayHandle" class="user-handle-tag">${p.handle || '@creator'}</div>

                <div class="stats-row">
                    <div class="stat-item"><span class="num" id="statFollowing">${p.following || '0'}</span><span class="lbl">Following</span></div>
                    <div class="stat-item"><span class="num" id="statFollowers">${p.followers || '0'}</span><span class="lbl">Followers</span></div>
                    <div class="stat-item"><span class="num" id="statLikes">${p.likes || '0'}</span><span class="lbl">Likes</span></div>
                </div>

                <div class="bio-box">
                    <a id="profileYtLink" class="bio-link" href="\( {p.ytLink || '#'}" target="_blank" style=" \){p.ytLink ? '' : 'display:none;'}">${p.ytLink || ''}</a>
                    <div id="profileBioText" style="margin-top:4px;">${p.bio || 'Titan AI Creator'}</div>
                </div>

                <div style="display:flex; justify-content:center; margin-bottom:18px;">
                    <button onclick="openTitanEditProfile()" style="background:var(--prof-card-bg); border:1px solid var(--prof-border); color:var(--prof-text); padding:9px 22px; border-radius:24px; font-weight:700; font-size:0.88rem; cursor:pointer;">
                        Edit profile
                    </button>
                </div>

                <div class="tabs-bar">
                    <button class="tab-btn active"><i class="fa-solid fa-bars-staggered"></i></button>
                    <button class="tab-btn"><i class="fa-solid fa-lock"></i></button>
                    <button class="tab-btn"><i class="fa-solid fa-rotate"></i></button>
                    <button class="tab-btn"><i class="fa-regular fa-bookmark"></i></button>
                    <button class="tab-btn"><i class="fa-regular fa-heart"></i></button>
                </div>

                <div id="titanProfileVideoGrid" class="video-grid"></div>
            </div>

            <!-- SIDE MENU (TikTok Style) -->
            <div id="titanOptionsSheet" class="titan-side-drawer" onclick="if(event.target === this) closeTitanOptions();">
                <div class="side-drawer-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding: 0 20px 15px; border-bottom:1px solid var(--prof-border);">
                        <h3 style="font-size:1.1rem; font-weight:700; margin:0;">Settings & Menu</h3>
                        <button onclick="closeTitanOptions()" style="background:transparent; border:none; font-size:1.3rem; color:var(--prof-text); cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
                    </div>

                    <div class="sheet-section-title">Account Options</div>
                    <div class="sheet-row" onclick="openTitanEditProfile(); closeTitanOptions();">
                        <span><i class="fa-solid fa-user-pen left-icon"></i> Edit Profile</span>
                        <i class="fa-solid fa-chevron-right right-arrow"></i>
                    </div>
                    <div class="sheet-row">
                        <span><i class="fa-solid fa-wallet left-icon"></i> Balance</span>
                        <i class="fa-solid fa-chevron-right right-arrow"></i>
                    </div>

                    <div class="sheet-section-title">Creator Tools</div>
                    <div class="sheet-row">
                        <span><i class="fa-solid fa-clapperboard left-icon"></i> Titan Studio</span>
                        <i class="fa-solid fa-chevron-right right-arrow"></i>
                    </div>
                    <div class="sheet-row">
                        <span><i class="fa-solid fa-chart-line left-icon"></i> Analytics</span>
                        <i class="fa-solid fa-chevron-right right-arrow"></i>
                    </div>

                    <div class="sheet-section-title">Settings</div>
                    <div class="sheet-row" onclick="openTitanSettings(); closeTitanOptions();">
                        <span><i class="fa-solid fa-gear left-icon"></i> Settings and privacy</span>
                        <i class="fa-solid fa-chevron-right right-arrow"></i>
                    </div>
                </div>
            </div>

            <!-- FULL SETTINGS PAGE -->
            <div id="titanSettingsPage" class="titan-settings-page">
                <div class="settings-header">
                    <button class="prof-header-icon" onclick="closeTitanSettings()"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2>Settings and privacy</h2>
                </div>

                <div class="settings-section-title">Account</div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-user"></i> Account</div><i class="fa-solid fa-chevron-right arrow"></i></div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-shield-halved"></i> Security and permissions</div><i class="fa-solid fa-chevron-right arrow"></i></div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-share-nodes"></i> Share profile</div><i class="fa-solid fa-chevron-right arrow"></i></div>

                <div class="settings-section-title">Content & Display</div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-moon"></i> Display</div><i class="fa-solid fa-chevron-right arrow"></i></div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-language"></i> Language</div><i class="fa-solid fa-chevron-right arrow"></i></div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-bell"></i> Notifications</div><i class="fa-solid fa-chevron-right arrow"></i></div>

                <div class="settings-section-title">Support & About</div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-circle-question"></i> Help Centre</div><i class="fa-solid fa-chevron-right arrow"></i></div>
                <div class="settings-row"><div class="left"><i class="fa-solid fa-file-lines"></i> Terms and policies</div><i class="fa-solid fa-chevron-right arrow"></i></div>

                <div class="settings-section-title">Login</div>
                <div class="settings-row" onclick="handleTitanLogout()">
                    <div class="left" style="color:#ef4444;"><i class="fa-solid fa-right-from-bracket"></i> Log out</div>
                    <i class="fa-solid fa-chevron-right arrow"></i>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
        renderVideoGrid();
    }

    // Open / Close Functions
    window.openTitanProfile = function () {
        initProfileUI();
        document.getElementById('titanMainProfilePage').classList.add('active');
        renderVideoGrid();
    };

    window.closeTitanProfile = function () {
        const page = document.getElementById('titanMainProfilePage');
        if (page) page.classList.remove('active');
    };

    window.openTitanOptions = function () {
        document.getElementById('titanOptionsSheet')?.classList.add('active');
    };

    window.closeTitanOptions = function () {
        document.getElementById('titanOptionsSheet')?.classList.remove('active');
    };

    window.openTitanSettings = function () {
        document.getElementById('titanSettingsPage')?.classList.add('active');
    };

    window.closeTitanSettings = function () {
        document.getElementById('titanSettingsPage')?.classList.remove('active');
    };

    window.openTitanEditProfile = function () {
        alert("Edit Profile feature coming soon. Profile data is already saved from Google login.");
    };

    // Hook into bottom nav Profile button
    document.addEventListener('click', function (e) {
        const target = e.target.closest('.titan-nav-item, [class*="profile"]');
        if (target && (target.textContent.toLowerCase().includes('profile') || target.querySelector('.fa-user'))) {
            e.preventDefault();
            openTitanProfile();
        }
    }, true);

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProfileUI);
    } else {
        initProfileUI();
    }

})();
