/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v2.0.0-YouTube-Style-Camera-Upload
 * FILE: app-upload-system.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI YouTube-Style Creator Studio Active!");

    const systemStyle = document.createElement('style');
    systemStyle.innerHTML = `
        /* YouTube Style Camera & Upload Overlay */
        .titan-yt-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: none;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #fff;
            background-image: url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
        }
        .titan-yt-overlay::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5, 5, 7, 0.85);
            backdrop-filter: blur(8px);
            z-index: -1;
        }
        .titan-yt-overlay.active { display: flex; }

        /* Top Bar */
        .titan-yt-topbar {
            width: 100%;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .titan-yt-close {
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: #fff;
            width: 40px; height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            display: flex; align-items: center; justify-content: center;
        }

        /* Center Permissions / Record Box */
        .titan-yt-center {
            text-align: center;
            max-width: 380px;
            padding: 0 20px;
        }
        .titan-yt-center i.fa-bolt-lightning {
            font-size: 3rem;
            color: #f59e0b;
            margin-bottom: 15px;
            filter: drop-shadow(0 0 10px rgba(245,158,11,0.5));
        }
        .titan-yt-center h2 {
            font-size: 1.35rem;
            font-weight: 700;
            line-height: 1.4;
            margin-bottom: 25px;
        }

        /* Action Buttons (Add from Gallery) */
        .titan-yt-actions {
            width: 100%;
            max-width: 420px;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
        }
        .btn-yt-gallery {
            background: #ffffff;
            color: #000000;
            border: none;
            width: 100%;
            padding: 14px;
            border-radius: 35px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-yt-settings {
            background: rgba(255, 255, 255, 0.12);
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.2);
            width: 100%;
            padding: 14px;
            border-radius: 35px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
        }

        /* Bottom Mode Bar (Short / Video) */
        .titan-yt-bottom-modes {
            display: flex;
            gap: 25px;
            align-items: center;
            font-weight: 600;
            font-size: 0.95rem;
            color: #9ca3af;
            padding-bottom: 15px;
        }
        .titan-yt-bottom-modes span {
            cursor: pointer;
            padding: 6px 14px;
            transition: 0.2s;
        }
        .titan-yt-bottom-modes span.active {
            color: #000;
            background: #fff;
            border-radius: 20px;
            font-weight: 700;
        }

        /* Hidden Form Modal for Details after selecting file */
        .titan-details-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(5, 5, 7, 0.96);
            z-index: 11000;
            display: none;
            flex-direction: column;
            padding: 25px 5%;
            overflow-y: auto;
        }
        .titan-details-modal.active { display: flex; }
    `;
    document.head.appendChild(systemStyle);

    function injectYouTubeUploadUI() {
        if (!document.getElementById('titanYtOverlay')) {
            const ytOverlay = document.createElement('div');
            ytOverlay.id = 'titanYtOverlay';
            ytOverlay.className = 'titan-yt-overlay';
            ytOverlay.innerHTML = `
                <div class="titan-yt-topbar">
                    <button class="titan-yt-close" onclick="closeTitanYtOverlay()"><i class="fa-solid fa-xmark"></i></button>
                    <div style="font-size: 0.85rem; font-weight: 700; color: #f59e0b;"><i class="fa-solid fa-circle-check"></i> Titan Verified Creator</div>
                    <div style="width: 40px;"></div>
                </div>

                <div class="titan-yt-center">
                    <i class="fa-solid fa-clapperboard fa-bolt-lightning"></i>
                    <h2>To record or publish, let Titan AI access your media & storage</h2>
                </div>

                <div class="titan-yt-actions">
                    <button class="btn-yt-gallery" onclick="document.getElementById('titanRealFileInput').click()">
                        <i class="fa-solid fa-folder-open"></i> Add from gallery
                    </button>
                    <button class="btn-yt-settings" onclick="alert('Camera and storage permissions are enabled for Titan AI Network.')">
                        Open settings
                    </button>
                    <input type="file" id="titanRealFileInput" accept="video/*" style="display:none;" onchange="handleFileChosen(this)" />
                </div>

                <div class="titan-yt-bottom-modes">
                    <span id="modeVideo" onclick="switchUploadMode('Video')">Video (10-20m)</span>
                    <span id="modeShort" class="active" onclick="switchUploadMode('Short')">Short (1-2m)</span>
                </div>
            `;
            document.body.appendChild(ytOverlay);
        }

        // Details Input Modal (Appears after selecting file)
        if (!document.getElementById('titanDetailsModal')) {
            const detailsModal = document.createElement('div');
            detailsModal.id = 'titanDetailsModal';
            detailsModal.className = 'titan-details-modal';
            detailsModal.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                    <h3 style="font-size: 1.2rem; color:#f59e0b;"><i class="fa-solid fa-cloud-arrow-up"></i> Publish to Titan Network</h3>
                    <button class="titan-yt-close" onclick="closeDetailsModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div style="max-width: 500px; margin: 0 auto; width: 100%;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 0.82rem; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">Selected File</label>
                        <div id="selectedFileNameDisplay" style="padding: 12px; background: #12141c; border-radius: 10px; color: #00dfd8; font-weight: 600; border: 1px solid rgba(255,255,255,0.1);">None</div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 0.82rem; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">Content Title</label>
                        <input type="text" id="titanUploadTitle" placeholder="Enter title for short or video..." style="width: 100%; padding: 12px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; outline: none; font-size: 0.95rem;" />
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; font-size: 0.82rem; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">Format Type</label>
                        <select id="titanUploadFormat" style="width: 100%; padding: 12px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; outline: none; font-size: 0.95rem;">
                            <option value="Short">Titan Short (1 to 2 Minutes)</option>
                            <option value="Video">Full Video / Film (10 to 20 Minutes)</option>
                        </select>
                    </div>
                    <button onclick="submitTitanUpload()" style="width: 100%; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; padding: 14px; border-radius: 12px; font-weight: 800; border: none; cursor: pointer; font-size: 1rem;">
                        <i class="fa-solid fa-circle-check"></i> Publish Live Now
                    </button>
                </div>
            `;
            document.body.appendChild(detailsModal);
        }

        bindPlusTrigger();
    }

    function bindPlusTrigger() {
        const createBtns = document.querySelectorAll('.titan-nav-create, [onclick*="openAccountModal"]');
        createBtns.forEach(btn => {
            btn.removeAttribute('onclick');
            btn.onclick = function(e) {
                e.preventDefault();
                document.getElementById('titanYtOverlay')?.classList.add('active');
            };
        });
    }

    window.closeTitanYtOverlay = function() {
        document.getElementById('titanYtOverlay')?.classList.remove('active');
    };

    window.switchUploadMode = function(mode) {
        document.getElementById('modeVideo').classList.remove('active');
        document.getElementById('modeShort').classList.remove('active');
        if(mode === 'Video') {
            document.getElementById('modeVideo').classList.add('active');
            document.getElementById('titanUploadFormat').value = 'Video';
        } else {
            document.getElementById('modeShort').classList.add('active');
            document.getElementById('titanUploadFormat').value = 'Short';
        }
    };

    window.handleFileChosen = function(input) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            document.getElementById('selectedFileNameDisplay').innerText = file.name;
            closeTitanYtOverlay();
            document.getElementById('titanDetailsModal').classList.add('active');
        }
    };

    window.closeDetailsModal = function() {
        document.getElementById('titanDetailsModal').classList.remove('active');
    };

    window.submitTitanUpload = function() {
        const title = document.getElementById('titanUploadTitle').value.trim();
        const format = document.getElementById('titanUploadFormat').value;

        if(!title) {
            alert("Please enter a title!");
            return;
        }

        alert(`🎉 Success! Your ${format} ('${title}') has been published live to Titan AI Network.`);
        closeDetailsModal();
        document.getElementById('titanUploadTitle').value = '';
        document.getElementById('titanRealFileInput').value = '';
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectYouTubeUploadUI);
    } else {
        setTimeout(injectYouTubeUploadUI, 300);
    }
})();
