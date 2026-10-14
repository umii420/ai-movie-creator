/**
 * =========================================================
 * PLATFORM: TITAN AI PROFILE SYSTEM (INSTANT 1-CLICK FIX)
 * FILE: app-profile-system.js
 * VERSION: v3.2.0
 * =========================================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Profile Engine v3.2 (Instant Click Fix) Active!");

    // 1. Inject Styles with High Z-Index & Right-Side Drawer
    const profileStyle = document.createElement('style');
    profileStyle.id = 'titan-profile-styles-v3-2';
    profileStyle.innerHTML = `
        :root {
            --prof-bg: #ffffff;
            --prof-card-bg: #f8fafc;
            --prof-text: #0f172a;
            --prof-muted: #64748b;
            --prof-border: rgba(226, 232, 240, 0.8);
        }

        body.dark-mode {
            --prof-bg: #121212;
            --prof-card-bg: #1e1e1e;
            --prof-text: #f8fafc;
            --prof-muted: #a1a1aa;
            --prof-border: rgba(255, 255, 255, 0.1);
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
            font-family: 'Plus Jakarta Sans', sans-serif !important;
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
            position: relative; width: 96px; height: 96px;
            margin: 15px auto 10px; border-radius: 50%; overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .main-prof-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }

        .stats-row {
            display: flex; justify-content: center; align-items: center;
            gap: 24px; margin: 16px 0; text-align: center;
        }
        .stat-item .num { font-weight: 800; font-size: 1.15rem; color: var(--prof-text); display: block; }
        .stat-item .lbl { font-size: 0.8rem; color: var(--prof-muted); }

        .bio-box {
            text-align: center; padding: 0 25px; font-size: 0.88rem;
            color: var(--prof-text); line-height: 1.4; margin-bottom: 15px;
        }
        .bio-link { color: #00b2ff; text-decoration: none; word-break: break-all; }

        .tabs-bar {
            display: flex; justify-content: space-around;
            border-top: 1px solid var(--prof-border);
            border-bottom: 1px solid var(--prof-border);
            padding: 10px 0; background: var(--prof-bg);
        }
        .tab-btn { background: transparent; border: none; font-size: 1.2rem; color: var(--prof-muted); cursor: pointer; }
        .tab-btn.active { color: var(--prof-text); border-bottom: 2px solid var(--prof-text); padding-bottom: 4px; }

        .video-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; padding: 2px 0; }
        .grid-item { aspect-ratio: 3/4; background: #1e293b; position: relative; overflow: hidden; }
        .grid-item img { width: 100%; height: 100%; object-fit: cover; }
        .grid-views {
            position: absolute; bottom: 6px; left: 6px; font-size: 0.75rem; font-weight: 700;
            color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 4px;
        }

        /* TikTok Style Right Side Sliding Drawer */
        .titan-side-drawer {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);
            z-index: 9999999999 !important; display: none; justify-content: flex-end;
        }
        .titan-side-drawer.active { display: flex; }
        .side-drawer-content {
            background: var(--prof-bg);
            width: 82%; max-width: 360px; height: 100%;
            padding: 20px 16px 40px; overflow-y: auto;
            color: var(--prof-text);
            box-shadow: -5px 0 25px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
        }
        .titan-side-drawer.active .side-drawer-content {
            transform: translateX(0);
        }

        .sheet-card {
            background: var(--prof-card-bg); border-radius: 14px;
            border: 1px solid var(--prof-border); margin-bottom: 16px; overflow: hidden;
        }
        .sheet-row {
            display: flex; align-items: center; justify-content: space-between;
            padding: 15px 16px; border-bottom: 1px solid var(--prof-border);
            cursor: pointer; font-size: 0.95rem; font-weight: 500;
        }
        .sheet-row:last-child { border-bottom: none; }
        .sheet-row i.left-icon { width: 24px; font-size: 1.1rem; }
        .sheet-label { font-size: 0.8rem; font-weight: 700; color: var(--prof-muted); margin: 10px 4px 6px; }
    `;
    document.head.appendChild(profileStyle);

    // 2. Build UI Structure
    function buildProfileUI() {
        if (document.getElementById('titanMainProfilePage')) return;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <!-- 1. MAIN PROFILE PAGE -->
            <div id="titanMainProfilePage" class="titan-profile-page">
                <div class="prof-header">
                    <button class="prof-header-icon" onclick="openTitanEditProfile()"><i class="fa-solid fa-pen"></i></button>
                    <h3 style="font-size:1.05rem; font-weight:700; margin:0;">UmAr WaRrAiCh 🦅</h3>
                    <button class="prof-header-icon" onclick="openTitanOptions()"><i class="fa-solid fa-bars"></i></button>
                </div>

                <div class="main-prof-avatar-wrap">
                    <img id="mainProfileAvatar" src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop" alt="Profile" />
                </div>

                <div style="text-align:center; font-weight:700; font-size:0.9rem; color:var(--prof-muted);">@420educated</div>

                <div class="stats-row">
                    <div class="stat-item"><span class="num">471</span><span class="lbl">Following</span></div>
                    <div class="stat-item"><span class="num">289</span><span class="lbl">Followers</span></div>
                    <div class="stat-item"><span class="num">4,493</span><span class="lbl">Likes</span></div>
                </div>

                <div class="bio-box">
                    <a class="bio-link" href="https://youtube.com/@umarhayatoficial" target="_blank">https://youtube.com/@umarhayatoficial?si=Xksgc9WIPVPY1o9Y</a><br>
                    Subscribe My YouTube channel
                </div>

                <div style="display:flex; justify-content:center; margin-bottom:15px;">
                    <button onclick="if(window.openTitanStudioGemini) openTitanStudioGemini();" style="background:var(--prof-card-bg); border:1px solid var(--prof-border); color:var(--prof-text); padding:8px 20px; border-radius:20px; font-weight:600; font-size:0.85rem; cursor:pointer;"><i class="fa-solid fa-wand-magic-sparkles" style="color:#fe2c55;"></i> TikTok Studio</button>
                </div>

                <div class="tabs-bar">
                    <button class="tab-btn active"><i class="fa-solid fa-bars-staggered"></i></button>
                    <button class="tab-btn"><i class="fa-solid fa-lock"></i></button>
                    <button class="tab-btn"><i class="fa-solid fa-rotate"></i></button>
                    <button class="tab-btn"><i class="fa-regular fa-bookmark"></i></button>
                    <button class="tab-btn"><i class="fa-regular fa-heart"></i></button>
                </div>

                <div class="video-grid">
                    <div class="grid-item"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" /><div class="grid-views"><i class="fa-solid fa-play"></i> 239</div></div>
                    <div class="grid-item"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" /><div class="grid-views"><i class="fa-solid fa-play"></i> 157</div></div>
                    <div class="grid-item"><img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300" /><div class="grid-views"><i class="fa-solid fa-play"></i> 141</div></div>
                </div>
            </div>

            <!-- 2. EDIT PROFILE PAGE -->
            <div id="titanEditProfilePage" class="titan-profile-page">
                <div class="prof-header">
                    <button class="prof-header-icon" onclick="closeTitanEditProfile()"><i class="fa-solid fa-chevron-left"></i></button>
                    <h3 style="font-size:1.1rem; font-weight:700; margin:0;">Edit profile</h3>
                    <div style="width:36px;"></div>
                </div>

                <div style="display:flex; flex-direction:column; align-items:center; padding:25px 0;">
                    <div class="main-prof-avatar-wrap" style="width:100px; height:100px; cursor:pointer;" onclick="document.getElementById('editAvatarInput').click()">
                        <img id="editAvatarPreview" src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop" />
                    </div>
                    <span style="color:#00b2ff; font-weight:600; font-size:0.9rem; cursor:pointer;" onclick="document.getElementById('editAvatarInput').click()">Change photo</span>
                    <input type="file" id="editAvatarInput" accept="image/*" style="display:none;" onchange="updateProfilePhoto(this)" />
                </div>

                <div style="padding:0 16px;">
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="editField('Name')"><span style="color:var(--prof-muted);">Name</span><span><strong>UmAr WaRrAiCh 🦅</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                        <div class="sheet-row" onclick="editField('Username')"><span style="color:var(--prof-muted);">Username</span><span><strong>420educated</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                        <div class="sheet-row" onclick="alert('Profile link copied!')"><span style="color:var(--prof-muted);">Profile Link</span><span>tiktok.com/@420ed... <i class="fa-regular fa-copy"></i></span></div>
                    </div>

                    <div class="sheet-label">Basic info</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="editField('Bio')"><span style="color:var(--prof-muted);">Bio</span><span style="font-size:0.8rem; max-width:60%; text-align:right;">https://youtube.com/@umarhayatoficial... <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                    </div>

                    <div class="sheet-label">Others</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="alert('Launching My AI Self...')"><span style="color:var(--prof-muted);">AI self</span><span><strong>My AI Self</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                    </div>
                </div>
            </div>

            <!-- 3. RIGHT SIDE SLIDING DRAWER -->
            <div id="titanOptionsSheet" class="titan-side-drawer" onclick="if(event.target === this) closeTitanOptions();">
                <div class="side-drawer-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--prof-border); padding-bottom:12px;">
                        <h3 style="font-size:1.1rem; font-weight:700; margin:0;">Menu</h3>
                        <button onclick="closeTitanOptions()" style="background:transparent; border:none; font-size:1.2rem; color:var(--prof-text); cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
                    </div>

                    <div class="sheet-label">Assets</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="alert('Wallet Balance: $1,250.00 USD')"><span><i class="fa-solid fa-wallet left-icon"></i> Balance</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>

                    <div class="sheet-label">Personal tools</div>
                    <div class="sheet-card">
                        <div class="sheet-row"><span><i class="fa-regular fa-clock left-icon"></i> Activity centre</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-solid fa-cloud-arrow-down left-icon"></i> Offline videos</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-solid fa-qrcode left-icon"></i> Your QR code</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>

                    <div class="sheet-label">Creation & business tools</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="if(window.openTitanStudioGemini) openTitanStudioGemini();"><span><i class="fa-solid fa-wand-magic-sparkles left-icon" style="color:#00b2ff;"></i> TikTok Studio</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-solid fa-fire left-icon" style="color:#f59e0b;"></i> Promote</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row" onclick="closeTitanOptions(); openTitanSettings();"><span><i class="fa-solid fa-gear left-icon"></i> Settings and privacy</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>
                </div>
            </div>

            <!-- 4. SETTINGS AND PRIVACY PAGE -->
            <div id="titanSettingsPage" class="titan-profile-page">
                <div class="prof-header">
                    <button class="prof-header-icon" onclick="closeTitanSettings()"><i class="fa-solid fa-chevron-left"></i></button>
                    <h3 style="font-size:1.1rem; font-weight:700; margin:0;">Settings and privacy</h3>
                    <div style="width:36px;"></div>
                </div>

                <div style="padding:10px 16px;">
                    <div class="sheet-label">Activity</div>
                    <div class="sheet-card">
                        <div class="sheet-row"><span><i class="fa-regular fa-window-restore left-icon"></i> Manage posts</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-solid fa-sliders left-icon"></i> Content preferences</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-regular fa-bell left-icon"></i> Notifications</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>

                    <div class="sheet-label">Account</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="closeTitanSettings(); openTitanEditProfile();"><span><i class="fa-regular fa-user left-icon"></i> Account</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-solid fa-shield-halved left-icon"></i> Security and permissions</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-solid fa-chart-line left-icon"></i> Analytics</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>

                    <div class="sheet-label">Cache & mobile</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="alert('Space freed up successfully!')"><span><i class="fa-regular fa-trash-can left-icon"></i> Free up space</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row"><span><i class="fa-solid fa-leaf left-icon"></i> Data Saver</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>

                    <div class="sheet-label">Login</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="alert('Switched Account')"><span><i class="fa-solid fa-arrows-rotate left-icon"></i> Switch account</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row" onclick="alert('Logged Out')"><span style="color:#ef4444;"><i class="fa-solid fa-right-from-bracket left-icon" style="color:#ef4444;"></i> Log out</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
    }

    // Global Controllers
    window.openTitanMainProfile = function() { document.getElementById('titanMainProfilePage')?.classList.add('active'); };
    window.closeTitanMainProfile = function() { document.getElementById('titanMainProfilePage')?.classList.remove('active'); };

    window.openTitanEditProfile = function() { document.getElementById('titanEditProfilePage')?.classList.add('active'); };
    window.closeTitanEditProfile = function() { document.getElementById('titanEditProfilePage')?.classList.remove('active'); };

    window.openTitanOptions = function() { document.getElementById('titanOptionsSheet')?.classList.add('active'); };
    window.closeTitanOptions = function() { document.getElementById('titanOptionsSheet')?.classList.remove('active'); };

    window.openTitanSettings = function() { document.getElementById('titanSettingsPage')?.classList.add('active'); };
    window.closeTitanSettings = function() { document.getElementById('titanSettingsPage')?.classList.remove('active'); };

    window.updateProfilePhoto = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('mainProfileAvatar').src = e.target.result;
                document.getElementById('editAvatarPreview').src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.editField = function(name) {
        const val = prompt(`Enter new ${name}:`);
        if (val) alert(`${name} updated to: ${val}`);
    };

    // INSTANT 1-CLICK INTERCEPTOR (High Priority Listener)
    function attachInstantClickListener() {
        document.addEventListener('click', function(e) {
            const profileTarget = e.target.closest('.fa-user, [class*="profile"], #profileTab, [data-tab="profile"]');
            
            // Check if click is on bottom navigation profile button
            if (profileTarget && !e.target.closest('.titan-profile-page') && !e.target.closest('.titan-side-drawer')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                openTitanMainProfile();
                return false;
            }
        }, true); // Capture phase enabled for immediate response
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            buildProfileUI();
            attachInstantClickListener();
        });
    } else {
        buildProfileUI();
        attachInstantClickListener();
    }
})();
