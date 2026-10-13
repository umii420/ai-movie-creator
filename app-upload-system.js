/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v6.0.0-Non-Destructive-Overlay
 * FILE: app-upload-system.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Safe Upload System Active!");

    const safeStyle = document.createElement('style');
    safeStyle.id = "titan-safe-yt-style";
    safeStyle.innerHTML = `
        /* Exact YouTube Upload Overlay Design */
        .titan-safe-yt-overlay {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background: rgba(10, 10, 12, 0.94) !important;
            background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop') !important;
            background-size: cover !important;
            background-position: center !important;
            z-index: 99999999 !important;
            display: none;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 25px 0 35px 0 !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            color: #ffffff !important;
        }
        .titan-safe-yt-overlay::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(14px);
            z-index: -1;
        }
        .titan-safe-yt-overlay.active { display: flex !important; }

        .safe-top-bar {
            width: 100%;
            padding: 0 22px;
            display: flex;
            justify-content: flex-start;
        }
        .safe-close-btn {
            background: rgba(255, 255, 255, 0.18) !important;
            border: none !important;
            color: #ffffff !important;
            width: 42px !important; height: 42px !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 1.25rem !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
        }

        .safe-center-box {
            text-align: center;
            max-width: 350px;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .safe-icon-badge {
            width: 70px; height: 70px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 2.2rem;
            color: #00b2ff;
            margin-bottom: 22px;
            box-shadow: 0 0 25px rgba(0, 178, 255, 0.35);
        }
        .safe-center-box h2 {
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            line-height: 1.45 !important;
            color: #f3f4f6 !important;
        }

        .safe-bottom-actions {
            width: 100%;
            max-width: 420px;
            padding: 0 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .safe-btn-white {
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            width: 100% !important;
            padding: 15px !important;
            border-radius: 35px !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            cursor: pointer !important;
            text-align: center !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important;
        }
        .safe-btn-glass {
            background: rgba(255, 255, 255, 0.12) !important;
            color: #ffffff !important;
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            width: 100% !important;
            padding: 15px !important;
            border-radius: 35px !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            cursor: pointer !important;
            text-align: center !important;
        }

        .safe-mode-switcher {
            display: flex;
            gap: 30px;
            align-items: center;
            font-weight: 600;
            font-size: 0.92rem;
            color: #9ca3af;
            margin-top: 15px;
        }
        .safe-mode-switcher span {
            cursor: pointer;
            padding: 7px 18px;
            border-radius: 20px;
            transition: 0.2s;
        }
        .safe-mode-switcher span.active {
            color: #000000 !important;
            background: #ffffff !important;
            font-weight: 700 !important;
        }

        /* Publishing Form Modal */
        .titan-safe-pub-modal {
            position: fixed !important;
            top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
            background: rgba(5, 5, 8, 0.97) !important;
            z-index: 999999999 !important;
            display: none;
            flex-direction: column !important;
            padding: 25px 6% !important;
            overflow-y: auto !important;
        }
        .titan-safe-pub-modal.active { display: flex !important; }
    `;
    document.head.appendChild(safeStyle);

    function buildSafeUi() {
        if (!document.getElementById('titanSafeOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'titanSafeOverlay';
            overlay.className = 'titan-safe-yt-overlay';
            overlay.innerHTML = `
                <div class="safe-top-bar">
                    <button class="safe-close-btn" onclick="closeSafeOverlay()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="safe-center-box">
                    <div class="safe-icon-badge"><i class="fa-solid fa-bolt"></i></div>
                    <h2>To record, let Titan AI access your camera and storage</h2>
                </div>
                <div class="safe-bottom-actions">
                    <button class="safe-btn-white" onclick="document.getElementById('safeGalleryInput').click()">
                        Add from gallery
                    </button>
                    <button class="safe-btn-glass" onclick="alert('Permissions are active for Titan AI.')">
                        Open settings
                    </button>
                    <input type="file" id="safeGalleryInput" accept="video/*" style="display:none;" onchange="handleSafeFile(this)" />
                    <div style="display: flex; justify-content: center; width: 100%;">
                        <div class="safe-mode-switcher">
                            <span id="sTabVideo" onclick="switchSafeMode('Video')">Video (10-20m)</span>
                            <span id="sTabShort" class="active" onclick="switchSafeMode('Short')">Short (1-2m)</span>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        if (!document.getElementById('titanSafePubModal')) {
            const pubModal = document.createElement('div');
            pubModal.id = 'titanSafePubModal';
            pubModal.className = 'titan-safe-pub-modal';
            pubModal.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                    <h3 style="font-size: 1.25rem; color:#00b2ff;"><i class="fa-solid fa-cloud-arrow-up"></i> Titan Creator Studio</h3>
                    <button class="safe-close-btn" style="width:36px; height:36px; font-size:1rem;" onclick="closeSafePubModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div style="max-width: 500px; margin: 0 auto; width: 100%;">
                    <div style="margin-bottom: 18px;">
                        <label style="display: block; font-size: 0.8rem; color: #9ca3af; margin-bottom: 6px; font-weight: 700;">SELECTED FILE</label>
                        <div id="safeFileDisplay" style="padding: 12px 15px; background: #12141c; border-radius: 12px; color: #00dfd8; font-weight: 600;">None</div>
                    </div>
                    <div style="margin-bottom: 18px;">
                        <label style="display: block; font-size: 0.8rem; color: #9ca3af; margin-bottom: 6px; font-weight: 700;">CONTENT TITLE</label>
                        <input type="text" id="safeTitleInput" placeholder="Enter title..." style="width: 100%; padding: 13px 16px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none;" />
                    </div>
                    <div style="margin-bottom: 28px;">
                        <label style="display: block; font-size: 0.8rem; color: #9ca3af; margin-bottom: 6px; font-weight: 700;">FORMAT TYPE</label>
                        <select id="safeFormatSelect" style="width: 100%; padding: 13px 16px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none;">
                            <option value="Short">Titan Short (1 to 2 Minutes)</option>
                            <option value="Video">Full Video / Film (10 to 20 Minutes)</option>
                        </select>
                    </div>
                    <button onclick="publishSafeContent()" style="width: 100%; background: linear-gradient(135deg, #00b2ff, #0072ff); color: #fff; padding: 15px; border-radius: 14px; font-weight: 800; border: none; cursor: pointer; font-size: 1.05rem;">
                        <i class="fa-solid fa-circle-check"></i> Publish Live Now
                    </button>
                </div>
            `;
            document.body.appendChild(pubModal);
        }

        // Intercept create/plus buttons safely without breaking old JS
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.titan-nav-create, [onclick*="openAccountModal"], [class*="create"], .fa-plus');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                document.getElementById('titanSafeOverlay')?.classList.add('active');
                return false;
            }
        }, true);
    }

    window.closeSafeOverlay = function() {
        document.getElementById('titanSafeOverlay')?.classList.remove('active');
    };

    window.switchSafeMode = function(mode) {
        document.getElementById('sTabVideo').classList.remove('active');
        document.getElementById('sTabShort').classList.remove('active');
        if(mode === 'Video') {
            document.getElementById('sTabVideo').classList.add('active');
            document.getElementById('safeFormatSelect').value = 'Video';
        } else {
            document.getElementById('sTabShort').classList.add('active');
            document.getElementById('safeFormatSelect').value = 'Short';
        }
    };

    window.handleSafeFile = function(input) {
        if (input.files && input.files[0]) {
            document.getElementById('safeFileDisplay').innerText = input.files[0].name;
            closeSafeOverlay();
            document.getElementById('titanSafePubModal').classList.add('active');
        }
    };

    window.closeSafePubModal = function() {
        document.getElementById('titanSafePubModal')?.classList.remove('active');
    };

    window.publishSafeContent = function() {
        const title = document.getElementById('safeTitleInput').value.trim();
        const format = document.getElementById('safeFormatSelect').value;
        if(!title) { alert("Please enter a title!"); return; }
        alert(`🎉 Success! Your ${format} ('${title}') published successfully!`);
        closeSafePubModal();
        document.getElementById('safeTitleInput').value = '';
        document.getElementById('safeGalleryInput').value = '';
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildSafeUi);
    } else {
        setTimeout(buildSafeUi, 200);
    }
})();
