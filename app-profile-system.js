/**
 * =========================================================
 * PLATFORM: TITAN AI PROFILE SYSTEM (EXPLICIT CLICK BINDING)
 * FILE: app-profile-system.js
 * VERSION: v2.0.0
 * =========================================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Profile System Ready...");

    const profileStyle = document.createElement('style');
    profileStyle.id = 'titan-profile-styles-v2';
    profileStyle.innerHTML = `
        :root {
            --profile-bg: #f8fafc;
            --profile-card-bg: #ffffff;
            --profile-text: #0f172a;
            --profile-muted: #64748b;
            --profile-border: rgba(226, 232, 240, 0.8);
        }

        .titan-profile-page {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background: var(--profile-bg) !important;
            color: var(--profile-text) !important;
            z-index: 9999999 !important;
            display: none;
            flex-direction: column !important;
            overflow-y: auto !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .titan-profile-page.active { display: flex !important; }

        .profile-nav-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 16px 20px; background: var(--profile-card-bg);
            border-bottom: 1px solid var(--profile-border);
            position: sticky; top: 0; z-index: 10;
        }
        .profile-nav-header h2 { font-size: 1.15rem; font-weight: 700; margin: 0; flex-grow: 1; text-align: center; }
        .profile-back-btn { background: transparent; border: none; font-size: 1.3rem; color: var(--profile-text); cursor: pointer; }

        .profile-avatar-container { display: flex; flex-direction: column; align-items: center; padding: 28px 20px 20px; }
        .avatar-wrapper { position: relative; width: 105px; height: 105px; border-radius: 50%; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.12); cursor: pointer; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-camera-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.38); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.6rem; }
        .change-photo-lbl { margin-top: 12px; color: #00a8e8; font-size: 0.92rem; font-weight: 600; cursor: pointer; }

        .profile-section-group { padding: 0 16px 20px; }
        .section-label { font-size: 0.82rem; font-weight: 600; color: var(--profile-muted); margin: 12px 6px 8px; }
        .profile-card { background: var(--profile-card-bg); border-radius: 16px; border: 1px solid var(--profile-border); overflow: hidden; }
        .profile-row-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid var(--profile-border); cursor: pointer; }
        .profile-row-item:last-child { border-bottom: none; }

        .row-left { display: flex; align-items: center; gap: 14px; font-size: 0.98rem; font-weight: 500; }
        .row-left i { font-size: 1.15rem; width: 22px; text-align: center; color: var(--profile-text); }
        .row-right { display: flex; align-items: center; gap: 8px; color: var(--profile-muted); font-size: 0.9rem; max-width: 60%; word-break: break-all; }

        .titan-bottom-sheet { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 99999999; display: none; justify-content: flex-end; flex-direction: column; }
        .titan-bottom-sheet.active { display: flex; }
        .bottom-sheet-content { background: var(--profile-card-bg); border-top-left-radius: 24px; border-top-right-radius: 24px; padding: 24px 20px 40px; max-height: 80vh; overflow-y: auto; color: var(--profile-text); }
    `;
    document.head.appendChild(profileStyle);

    function initProfileUi() {
        if (document.getElementById('titanEditProfilePage')) return;

        const mainContainer = document.createElement('div');
        mainContainer.innerHTML = `
            <!-- EDIT PROFILE PAGE -->
            <div id="titanEditProfilePage" class="titan-profile-page">
                <div class="profile-nav-header">
                    <button class="profile-back-btn" onclick="closeTitanProfile()"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2>Edit profile</h2>
                    <div style="width: 36px;"></div>
                </div>

                <div class="profile-avatar-container">
                    <div class="avatar-wrapper" onclick="document.getElementById('profileAvatarInput').click()">
                        <img id="profileAvatarPreview" class="avatar-img" src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop" alt="Profile" />
                        <div class="avatar-camera-overlay"><i class="fa-solid fa-camera"></i></div>
                    </div>
                    <span class="change-photo-lbl" onclick="document.getElementById('profileAvatarInput').click()">Change photo</span>
                    <input type="file" id="profileAvatarInput" accept="image/*" style="display:none;" onchange="updateProfilePhoto(this)">
                </div>

                <div class="profile-section-group">
                    <div class="profile-card">
                        <div class="profile-row-item" onclick="editProfileField('Name')"><span class="row-left" style="color:var(--profile-muted);">Name</span><span class="row-right"><strong id="profNameVal" style="color:var(--profile-text);">UmAr WaRrAiCh 🦅</strong> <i class="fa-solid fa-chevron-right"></i></span></div>
                        <div class="profile-row-item" onclick="editProfileField('Username')"><span class="row-left" style="color:var(--profile-muted);">Username</span><span class="row-right"><strong id="profUserVal" style="color:var(--profile-text);">420educated</strong> <i class="fa-solid fa-chevron-right"></i></span></div>
                        <div class="profile-row-item" onclick="copyTitanProfileLink()"><span class="row-left" style="color:var(--profile-muted);">Profile Link</span><span class="row-right"><span id="profLinkVal">tiktok.com/@420ed...</span> <i class="fa-regular fa-copy"></i></span></div>
                    </div>
                </div>

                <div class="profile-section-group">
                    <div class="section-label">Basic info</div>
                    <div class="profile-card">
                        <div class="profile-row-item" onclick="editProfileField('Bio')"><span class="row-left" style="color:var(--profile-muted);">Bio</span><span class="row-right"><span id="profBioVal" style="color:var(--profile-text); font-size: 0.82rem;">https://youtube.com/@umarhayatoficial...</span> <i class="fa-solid fa-chevron-right"></i></span></div>
                    </div>
                </div>

                <div class="profile-section-group">
                    <div class="section-label">Others</div>
                    <div class="profile-card">
                        <div class="profile-row-item" onclick="alert('Launching My AI Self...')"><span class="row-left" style="color:var(--profile-muted);">AI self</span><span class="row-right"><strong style="color:var(--profile-text);">My AI Self</strong> <i class="fa-solid fa-chevron-right"></i></span></div>
                    </div>
                </div>
            </div>

            <!-- OPTIONS SLIDE-UP SHEET -->
            <div id="titanOptionsSheet" class="titan-bottom-sheet" onclick="if(event.target === this) closeTitanOptions();">
                <div class="bottom-sheet-content">
                    <div style="width: 40px; height: 4px; background: rgba(150,150,150,0.3); border-radius: 10px; margin: 0 auto 18px;"></div>
                    <div class="section-label">Assets</div>
                    <div class="profile-card" style="margin-bottom: 18px;">
                        <div class="profile-row-item" onclick="alert('Wallet Balance: $1,250.00 USD')"><span class="row-left"><i class="fa-solid fa-wallet"></i> Balance</span><span class="row-right"><i class="fa-solid fa-chevron-right"></i></span></div>
                    </div>
                    <div class="section-label">Personal tools</div>
                    <div class="profile-card" style="margin-bottom: 18px;">
                        <div class="profile-row-item"><span class="row-left"><i class="fa-regular fa-clock"></i> Activity centre</span><span class="row-right"><i class="fa-solid fa-chevron-right"></i></span></div>
                        <div class="profile-row-item"><span class="row-left"><i class="fa-solid fa-cloud-arrow-down"></i> Offline videos</span><span class="row-right"><i class="fa-solid fa-chevron-right"></i></span></div>
                        <div class="profile-row-item"><span class="row-left"><i class="fa-solid fa-qrcode"></i> Your QR code</span><span class="row-right"><i class="fa-solid fa-chevron-right"></i></span></div>
                    </div>
                    <div class="section-label">Creation & business tools</div>
                    <div class="profile-card">
                        <div class="profile-row-item" onclick="if(window.openTitanStudioGemini) openTitanStudioGemini();"><span class="row-left"><i class="fa-solid fa-wand-magic-sparkles" style="color:#00b2ff;"></i> Titan Studio</span><span class="row-right"><i class="fa-solid fa-chevron-right"></i></span></div>
                        <div class="profile-row-item" onclick="closeTitanOptions(); openTitanSettings();"><span class="row-left"><i class="fa-solid fa-gear"></i> Settings and privacy</span><span class="row-right"><i class="fa-solid fa-chevron-right"></i></span></div>
                    </div>
                </div>
            </div>

            <!-- SETTINGS AND PRIVACY PAGE -->
            <div id="titanSettingsPage" class="titan-profile-page">
                <div class="profile-nav-header">
                    <button class="profile-back-btn" onclick="closeTitanSettings()"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2>Settings and privacy</h2>
                    <div style="width: 36px;"></div>
                </div>
                <div class="profile-section-group">
                    <div class="section-label">Account</div>
                    <div class="profile-card">
                        <div class="profile-row-item" onclick="closeTitanSettings(); openTitanProfile();"><span class="row-left"><i class="fa-regular fa-user"></i> Account</span><span class="row-right"><i class="fa-solid fa-chevron-right"></i></span></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(mainContainer);
    }

    window.openTitanProfile = function() { document.getElementById('titanEditProfilePage')?.classList.add('active'); };
    window.closeTitanProfile = function() { document.getElementById('titanEditProfilePage')?.classList.remove('active'); };
    window.openTitanOptions = function() { document.getElementById('titanOptionsSheet')?.classList.add('active'); };
    window.closeTitanOptions = function() { document.getElementById('titanOptionsSheet')?.classList.remove('active'); };
    window.openTitanSettings = function() { document.getElementById('titanSettingsPage')?.classList.add('active'); };
    window.closeTitanSettings = function() { document.getElementById('titanSettingsPage')?.classList.remove('active'); };

    window.updateProfilePhoto = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) { document.getElementById('profileAvatarPreview').src = e.target.result; };
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.editProfileField = function(fieldName) {
        const newVal = prompt(`Enter new ${fieldName}:`);
        if (newVal) {
            if (fieldName === 'Name') document.getElementById('profNameVal').innerText = newVal;
            if (fieldName === 'Username') document.getElementById('profUserVal').innerText = newVal;
            if (fieldName === 'Bio') document.getElementById('profBioVal').innerText = newVal;
        }
    };

    window.copyTitanProfileLink = function() {
        navigator.clipboard.writeText("https://titanai.app/@420educated");
        alert("Profile link copied!");
    };

    // Explicit Click listener for menu button or profile tab
    document.addEventListener('click', function(e) {
        const menuBtn = e.target.closest('.menu-btn, .fa-sliders, .fa-bars, [class*="profile"], .fa-user');
        if (menuBtn) {
            e.preventDefault();
            e.stopPropagation();
            openTitanOptions();
        }
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProfileUi);
    } else {
        initProfileUi();
    }
})();
