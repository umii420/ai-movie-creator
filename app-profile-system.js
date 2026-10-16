/**
 * =========================================================
 * PLATFORM: TITAN AI PROFILE ENGINE (USER MANUAL SETUP)
 * FILE: app-profile-system.js
 * =========================================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Profile Engine (Manual Setup Mode) Active!");

    // Insert Dynamic Profile Styles
    const profileStyle = document.createElement('style');
    profileStyle.id = 'titan-profile-styles-v5';
    profileStyle.innerHTML = `
        :root {
            --prof-bg: #ffffff;
            --prof-card-bg: #f8fafc;
            --prof-text: #0f172a;
            --prof-muted: #64748b;
            --prof-border: rgba(226, 232, 240, 0.8);
        }

        body.dark-mode {
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
        .grid-views {
            position: absolute; bottom: 8px; left: 8px; font-size: 0.78rem; font-weight: 700;
            color: #ffffff; text-shadow: 0 1px 4px rgba(0,0,0,0.9); display: flex; align-items: center; gap: 4px;
        }

        .titan-side-drawer {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            z-index: 9999999999 !important; display: none; justify-content: flex-end;
        }
        .titan-side-drawer.active { display: flex; }
        .side-drawer-content {
            background: var(--prof-bg);
            width: 82%; max-width: 350px; height: 100%;
            padding: 20px 16px 40px; overflow-y: auto;
            color: var(--prof-text);
            box-shadow: -5px 0 25px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.22s ease-out;
        }
        .titan-side-drawer.active .side-drawer-content { transform: translateX(0); }

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

    // Get User Data from Local Storage (Manual State)
    function getUserProfileData() {
        try {
            const stored = localStorage.getItem('titan_user_profile');
            if (stored) return JSON.parse(stored);
        } catch(e) {}
        return {
            name: "Set Your Name",
            handle: "@username",
            photo: "https://via.placeholder.com/150/18181b/ffffff?text=User",
            bio: "Tap Edit Profile to set your bio & link",
            ytLink: "",
            followers: "0",
            following: "0",
            likes: "0"
        };
    }

    // Save Updated Profile Data
    function saveUserProfileData(data) {
        localStorage.setItem('titan_user_profile', JSON.stringify(data));
    }

    // Render Uploaded Grid Videos
    function renderVideoGrid() {
        const grid = document.getElementById('titanProfileVideoGrid');
        if (!grid) return;

        let uploads = [];
        try {
            uploads = JSON.parse(localStorage.getItem('titan_user_uploads') || '[]');
        } catch(e) {}

        if (uploads.length === 0) {
            grid.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 40px 10px; color: var(--prof-muted); font-size: 0.85rem;">No videos uploaded yet. Tap + to upload!</div>`;
            return;
        }

        grid.innerHTML = uploads.map(vid => `
            <div class="grid-item">
                <img src="${vid.thumb || 'https://via.placeholder.com/300'}" alt="Video" />
                <div class="grid-views"><i class="fa-solid fa-play"></i> ${vid.views || '0'}</div>
            </div>
        `).join('');
    }

    // Build DOM Elements
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

                <div id="profileDisplayHandle" class="user-handle-tag">${p.handle}</div>

                <div class="stats-row">
                    <div class="stat-item"><span class="num" id="statFollowing">${p.following}</span><span class="lbl">Following</span></div>
                    <div class="stat-item"><span class="num" id="statFollowers">${p.followers}</span><span class="lbl">Followers</span></div>
                    <div class="stat-item"><span class="num" id="statLikes">${p.likes}</span><span class="lbl">Likes</span></div>
                </div>

                <div class="bio-box">
                    <a id="profileYtLink" class="bio-link" href="${p.ytLink || '#'}" target="_blank" style="${p.ytLink ? '' : 'display:none;'}">${p.ytLink}</a>
                    <div id="profileBioText" style="margin-top:4px;">${p.bio}</div>
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

            <!-- EDIT PROFILE PAGE -->
            <div id="titanEditProfilePage" class="titan-profile-page">
                <div class="prof-header">
                    <button class="prof-header-icon" onclick="closeTitanEditProfile()"><i class="fa-solid fa-chevron-left"></i></button>
                    <h3 style="font-size:1.1rem; font-weight:700; margin:0;">Edit Profile</h3>
                    <div style="width:36px;"></div>
                </div>

                <div style="display:flex; flex-direction:column; align-items:center; padding:25px 0;">
                    <div class="main-prof-avatar-wrap" style="width:100px; height:100px; cursor:pointer;" onclick="document.getElementById('editAvatarInput').click()">
                        <img id="editAvatarPreview" src="${p.photo}" />
                    </div>
                    <span style="color:#00b2ff; font-weight:600; font-size:0.9rem; cursor:pointer; margin-top:8px;" onclick="document.getElementById('editAvatarInput').click()">Change photo</span>
                    <input type="file" id="editAvatarInput" accept="image/*" style="display:none;" onchange="updateProfilePhoto(this)" />
                </div>

                <div style="padding:0 16px;">
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="editField('Name')"><span style="color:var(--prof-muted);">Name</span><span id="editNameVal"><strong>${p.name}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                        <div class="sheet-row" onclick="editField('Handle')"><span style="color:var(--prof-muted);">Handle</span><span id="editHandleVal"><strong>${p.handle}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                        <div class="sheet-row" onclick="editField('Bio')"><span style="color:var(--prof-muted);">Bio</span><span id="editBioVal"><strong>${p.bio}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                        <div class="sheet-row" onclick="editField('YouTube Link')"><span style="color:var(--prof-muted);">YouTube Link</span><span id="editYtVal"><strong>${p.ytLink || 'Add Link'}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></span></div>
                    </div>
                </div>
            </div>

            <!-- OPTIONS MENU DRAWER -->
            <div id="titanOptionsSheet" class="titan-side-drawer" onclick="if(event.target === this) closeTitanOptions();">
                <div class="side-drawer-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--prof-border); padding-bottom:12px;">
                        <h3 style="font-size:1.1rem; font-weight:700; margin:0;">Settings & Menu</h3>
                        <button onclick="closeTitanOptions()" style="background:transparent; border:none; font-size:1.2rem; color:var(--prof-text); cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
                    </div>

                    <div class="sheet-label">Account Options</div>
                    <div class="sheet-card">
                        <div class="sheet-row" onclick="openTitanEditProfile(); closeTitanOptions();"><span><i class="fa-solid fa-user-pen left-icon" style="color:#00b2ff;"></i> Edit Profile</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                        <div class="sheet-row" onclick="alert('Wallet Balance: $0.00')"><span><i class="fa-solid fa-wallet left-icon" style="color:#22c55e;"></i> Balance</span><i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
        renderVideoGrid();
    }

    // Global Window Functions
    window.openTitanMainProfile = function() {
        const p = getUserProfileData();
        
        document.getElementById('profileDisplayName').innerText = p.name;
        document.getElementById('profileDisplayHandle').innerText = p.handle;
        document.getElementById('mainProfileAvatar').src = p.photo;
        document.getElementById('profileBioText').innerText = p.bio;

        const ytEl = document.getElementById('profileYtLink');
        if (ytEl) {
            if (p.ytLink) {
                ytEl.href = p.ytLink;
                ytEl.innerText = p.ytLink;
                ytEl.style.display = 'inline-block';
            } else {
                ytEl.style.display = 'none';
            }
        }

        renderVideoGrid();
        document.getElementById('titanMainProfilePage')?.classList.add('active');
        history.pushState({ titanModal: 'profile' }, '');
    };

    window.closeTitanMainProfile = function() {
        document.getElementById('titanMainProfilePage')?.classList.remove('active');
    };

    window.openTitanEditProfile = function() {
        const p = getUserProfileData();
        document.getElementById('editNameVal').innerHTML = `<strong>${p.name}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i>`;
        document.getElementById('editHandleVal').innerHTML = `<strong>${p.handle}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i>`;
        document.getElementById('editBioVal').innerHTML = `<strong>${p.bio}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i>`;
        document.getElementById('editYtVal').innerHTML = `<strong>${p.ytLink || 'Add Link'}</strong> <i class="fa-solid fa-chevron-right" style="color:#94a3b8;"></i>`;
        
        document.getElementById('titanEditProfilePage')?.classList.add('active');
        history.pushState({ titanModal: 'editProfile' }, '');
    };

    window.closeTitanEditProfile = function() {
        document.getElementById('titanEditProfilePage')?.classList.remove('active');
    };

    window.openTitanOptions = function() {
        document.getElementById('titanOptionsSheet')?.classList.add('active');
        history.pushState({ titanModal: 'options' }, '');
    };

    window.closeTitanOptions = function() {
        document.getElementById('titanOptionsSheet')?.classList.remove('active');
    };

    window.updateProfilePhoto = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgUrl = e.target.result;
                document.getElementById('mainProfileAvatar').src = imgUrl;
                document.getElementById('editAvatarPreview').src = imgUrl;
                
                let p = getUserProfileData();
                p.photo = imgUrl;
                saveUserProfileData(p);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    window.editField = function(fieldName) {
        let p = getUserProfileData();
        let currentValue = "";
        if (fieldName === 'Name') currentValue = p.name;
        if (fieldName === 'Handle') currentValue = p.handle;
        if (fieldName === 'Bio') currentValue = p.bio;
        if (fieldName === 'YouTube Link') currentValue = p.ytLink;

        const val = prompt(`Enter ${fieldName}:`, currentValue);
        if (val !== null && val.trim() !== "") {
            if (fieldName === 'Name') p.name = val.trim();
            if (fieldName === 'Handle') p.handle = val.trim().startsWith('@') ? val.trim() : '@' + val.trim();
            if (fieldName === 'Bio') p.bio = val.trim();
            if (fieldName === 'YouTube Link') p.ytLink = val.trim();

            saveUserProfileData(p);
            window.openTitanMainProfile();
            window.openTitanEditProfile();
        }
    };

    // Global Click Handler for Profile Navigation
    document.addEventListener('click', function(e) {
        const profileBtn = e.target.closest('.fa-user, [class*="profile"], #profileTab, [data-tab="profile"]');
        if (profileBtn && !e.target.closest('.titan-profile-page') && !e.target.closest('.titan-side-drawer')) {
            e.preventDefault();
            e.stopPropagation();
            openTitanMainProfile();
        }
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProfileUI);
    } else {
        initProfileUI();
    }
})();
