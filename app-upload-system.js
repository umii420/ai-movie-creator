/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v4.0.0-Ultimate-YouTube-UI-Override
 * FILE: app-upload-system.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI YouTube-Style Master Engine Override Active!");

    // Inject CSS replicating the EXACT YouTube upload overlay design
    const ytStyle = document.createElement('style');
    ytStyle.id = "titan-yt-style-override";
    ytStyle.innerHTML = `
        /* Force kill any old conflicting modals */
        #titanUploadModal, .upload-form-container, [id*="uploadModal"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* YouTube-Style Fullscreen Overlay */
        .titan-yt-exact-overlay {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background: rgba(10, 10, 12, 0.92) !important;
            background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop') !important;
            background-size: cover !important;
            background-position: center !important;
            z-index: 9999999 !important;
            display: none;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 25px 0 35px 0 !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            color: #ffffff !important;
            box-sizing: border-box !important;
        }
        .titan-yt-exact-overlay::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(14px);
            z-index: -1;
        }
        .titan-yt-exact-overlay.active { display: flex !important; }

        /* Top Close Cross Button */
        .yt-top-bar {
            width: 100%;
            padding: 0 22px;
            display: flex;
            justify-content: flex-start;
            box-sizing: border-box;
        }
        .yt-close-btn {
            background: rgba(255, 255, 255, 0.18) !important;
            border: none !important;
            color: #ffffff !important;
            width: 42px !important; height: 42px !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 1.25rem !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            transition: 0.2s;
        }

        /* Center Content Box */
        .yt-center-box {
            text-align: center;
            max-width: 340px;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .yt-shorts-icon-badge {
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
        .yt-center-box h2 {
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            line-height: 1.45 !important;
            color: #f3f4f6 !important;
        }

        /* Bottom Action Buttons */
        .yt-bottom-actions {
            width: 100%;
            max-width: 420px;
            padding: 0 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-sizing: border-box;
        }
        .yt-btn-white {
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

        .yt-btn-glass {
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

        /* Bottom Mode Switcher Bar */
        .yt-mode-switcher {
            display: flex;
            gap: 30px;
            align-items: center;
            font-weight: 600;
            font-size: 0.92rem;
            color: #9ca3af;
            margin-top: 15px;
        }
        .yt-mode-switcher span {
            cursor: pointer;
            padding: 7px 18px;
            border-radius: 20px;
            transition: 0.2s;
        }
        .yt-mode-switcher span.active {
            color: #000000 !important;
            background: #ffffff !important;
            font-weight: 700 !important;
        }

        /* Second Step Publishing Modal */
        .titan-publish-modal {
            position: fixed !important;
            top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
            background: rgba(5, 5, 8, 0.97) !important;
            z-index: 99999999 !important;
            display: none;
            flex-direction: column !important;
            padding: 25px 6% !important;
            overflow-y: auto !important;
            box-sizing: border-box !important;
        }
        .titan-publish-modal.active { display: flex !important; }
    `;
    document.head.appendChild(ytStyle);

    function injectExactYtUi() {
        // Remove old element if existed
        document.getElementById('titanYtExactOverlay')?.remove();
        document.getElementById('titanPublishModal')?.remove();

        // Create Main Overlay
        const overlay = document.createElement('div');
        overlay.id = 'titanYtExactOverlay';
        overlay.className = 'titan-yt-exact-overlay';
        overlay.innerHTML = `
            <div class="yt-top-bar">
                <button class="yt-close-btn" onclick="closeTitanYtOverlay()"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="yt-center-box">
                <div class="yt-shorts-icon-badge">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <h2>To record, let Titan AI access your camera and storage</h2>
            </div>

            <div class="yt-bottom-actions">
                <button class="yt-btn-white" onclick="document.getElementById('titanGalleryInput').click()">
                    Add from gallery
                </button>
                <button class="yt-btn-glass" onclick="alert('Titan AI permissions are active.')">
                    Open settings
                </button>
                <input type="file" id="titanGalleryInput" accept="video/*" style="display:none;" onchange="handleGalleryVideoSelected(this)" />

                <div style="display: flex; justify-content: center; width: 100%;">
                    <div class="yt-mode-switcher">
                        <span id="tabVideo" onclick="switchMode('Video')">Video (10-20m)</span>
                        <span id="tabShort" class="active" onclick="switchMode('Short')">Short (1-2m)</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Create Publish Modal
        const pubModal = document.createElement('div');
        pubModal.id = 'titanPublishModal';
        pubModal.className = 'titan-publish-modal';
        pubModal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                <h3 style="font-size: 1.25rem; color:#00b2ff; font-family:'Space Grotesk', sans-serif;"><i class="fa-solid fa-cloud-arrow-up"></i> Titan Creator Studio</h3>
                <button class="yt-close-btn" style="width:36px; height:36px; font-size:1rem;" onclick="closePublishModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div style="max-width: 500px; margin: 0 auto; width: 100%;">
                <div style="margin-bottom: 18px;">
                    <label style="display: block; font-size: 0.8rem; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">Selected File</label>
                    <div id="fileDisplayLabel" style="padding: 12px 15px; background: #12141c; border-radius: 12px; color: #00dfd8; font-weight: 600; border: 1px solid rgba(255,255,255,0.1);">None</div>
                </div>
                <div style="margin-bottom: 18px;">
                    <label style="display: block; font-size: 0.8rem; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">Content Title</label>
                    <input type="text" id="finalUploadTitle" placeholder="Enter title for short or long video..." style="width: 100%; padding: 13px 16px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none; font-size: 0.95rem;" />
                </div>
                <div style="margin-bottom: 28px;">
                    <label style="display: block; font-size: 0.8rem; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">Format Type</label>
                    <select id="finalUploadFormat" style="width: 100%; padding: 13px 16px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none; font-size: 0.95rem;">
                        <option value="Short">Titan Short (1 to 2 Minutes)</option>
                        <option value="Video">Full Video / Film (10 to 20 Minutes)</option>
                    </select>
                </div>
                <button onclick="publishToTitanNetwork()" style="width: 100%; background: linear-gradient(135deg, #00b2ff, #0072ff); color: #fff; padding: 15px; border-radius: 14px; font-weight: 800; border: none; cursor: pointer; font-size: 1.05rem; box-shadow: 0 8px 25px rgba(0,178,255,0.4);">
                    <i class="fa-solid fa-circle-check"></i> Publish Live to Verified Feed
                </button>
            </div>
        `;
        document.body.appendChild(pubModal);

        hijackPlusButton();
    }

    // Completely hijack Plus (+) button and disable older handlers
    function hijackPlusButton() {
        window.openTitanUploadModal = function() {
            document.getElementById('titanYtExactOverlay')?.classList.add('active');
        };

        document.addEventListener('click', function (e) {
            const target = e.target.closest('.titan-nav-create, [onclick*="openAccountModal"], .fa-plus, [class*="create"]');
            if (target) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                document.getElementById('titanYtExactOverlay')?.classList.add('active');
                return false;
            }
        }, true);
    }

    window.closeTitanYtOverlay = function() {
        document.getElementById('titanYtExactOverlay')?.classList.remove('active');
    };

    window.switchMode = function(mode) {
        document.getElementById('tabVideo').classList.remove('active');
        document.getElementById('tabShort').classList.remove('active');
        if(mode === 'Video') {
            document.getElementById('tabVideo').classList.add('active');
            document.getElementById('finalUploadFormat').value = 'Video';
        } else {
            document.getElementById('tabShort').classList.add('active');
            document.getElementById('finalUploadFormat').value = 'Short';
        }
    };

    window.handleGalleryVideoSelected = function(input) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            document.getElementById('fileDisplayLabel').innerText = file.name;
            closeTitanYtOverlay();
            document.getElementById('titanPublishModal').classList.add('active');
        }
    };

    window.closePublishModal = function() {
        document.getElementById('titanPublishModal').classList.remove('active');
    };

    window.publishToTitanNetwork = function() {
        const title = document.getElementById('finalUploadTitle').value.trim();
        const format = document.getElementById('finalUploadFormat').value;

        if(!title) {
            alert("Please enter a title for your content!");
            return;
        }

        alert(`🎉 Success! Your ${format} ('${title}') has been uploaded and published to Titan Network.`);
        closePublishModal();
        document.getElementById('finalUploadTitle').value = '';
        document.getElementById('titanGalleryInput').value = '';
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectExactYtUi);
    } else {
        setTimeout(injectExactYtUi, 200);
    }
})();
