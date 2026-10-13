/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v3.0.0-Exact-YouTube-UI-Clone
 * FILE: app-upload-system.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Exact YouTube-Style UI Engine Active!");

    // Inject CSS replicating the exact YouTube upload overlay design
    const ytStyle = document.createElement('style');
    ytStyle.innerHTML = `
        .titan-yt-exact-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(10, 10, 12, 0.92);
            background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
            z-index: 100000;
            display: none;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0 35px 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #ffffff;
        }
        .titan-yt-exact-overlay::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.82);
            backdrop-filter: blur(14px);
            z-index: -1;
        }
        .titan-yt-exact-overlay.active { display: flex; }

        /* Top Close Bar */
        .yt-top-bar {
            width: 100%;
            padding: 0 20px;
            display: flex;
            justify-content: flex-start;
        }
        .yt-close-btn {
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: #ffffff;
            width: 42px; height: 42px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.25rem;
            display: flex; align-items: center; justify-content: center;
            transition: 0.2s;
        }
        .yt-close-btn:active { background: rgba(255, 255, 255, 0.3); }

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
            width: 65px; height: 65px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 2rem;
            color: #00b2ff;
            margin-bottom: 22px;
            box-shadow: 0 0 25px rgba(0, 178, 255, 0.3);
        }
        .yt-center-box h2 {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1.45;
            color: #f3f4f6;
            letter-spacing: -0.2px;
        }

        /* Bottom Buttons Group */
        .yt-bottom-actions {
            width: 100%;
            max-width: 420px;
            padding: 0 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .yt-btn-white {
            background: #ffffff;
            color: #000000;
            border: none;
            width: 100%;
            padding: 15px;
            border-radius: 35px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            transition: 0.2s;
        }
        .yt-btn-white:active { transform: scale(0.97); }

        .yt-btn-glass {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            width: 100%;
            padding: 15px;
            border-radius: 35px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            text-align: center;
            transition: 0.2s;
        }

        /* Bottom Mode Switcher Bar (Video / Short) */
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
            color: #000000;
            background: #ffffff;
            font-weight: 700;
        }

        /* Post-Selection Form Modal (For Title & Publishing) */
        .titan-publish-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(5, 5, 8, 0.97);
            z-index: 200000;
            display: none;
            flex-direction: column;
            padding: 25px 6%;
            overflow-y: auto;
        }
        .titan-publish-modal.active { display: flex; }
    `;
    document.head.appendChild(ytStyle);

    function injectExactYtUi() {
        // 1. Main YouTube-style Overlay
        if (!document.getElementById('titanYtExactOverlay')) {
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
                    <button class="yt-btn-glass" onclick="alert('Titan AI permissions are fully active for your verified profile.')">
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
        }

        // 2. Details & Publishing Form Modal
        if (!document.getElementById('titanPublishModal')) {
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
        }

        bindPlusButtonTriggers();
    }

    function bindPlusButtonTriggers() {
        const createBtns = document.querySelectorAll('.titan-nav-create, [onclick*="openAccountModal"]');
        createBtns.forEach(btn => {
            btn.removeAttribute('onclick');
            btn.onclick = function(e) {
                e.preventDefault();
                document.getElementById('titanYtExactOverlay')?.classList.add('active');
            };
        });
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
        setTimeout(injectExactYtUi, 300);
    }
})();
