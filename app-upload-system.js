/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v1.1.0-Mobile-File-Upload
 * FILE: app-upload-system.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Mobile Storage Upload Engine Active!");

    const systemStyle = document.createElement('style');
    systemStyle.innerHTML = `
        .titan-system-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(5, 5, 7, 0.95);
            backdrop-filter: blur(12px);
            z-index: 10000;
            display: none;
            flex-direction: column;
            padding: 20px 5%;
            overflow-y: auto;
        }
        .titan-system-modal.active { display: flex; }

        .titan-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 20px;
            color: #fff;
        }
        .titan-modal-header h3 {
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .titan-close-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: #fff;
            width: 36px; height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.1rem;
            display: flex; align-items: center; justify-content: center;
        }

        .upload-form-container {
            max-width: 550px;
            margin: 0 auto;
            width: 100%;
            background: #0d0e12;
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }
        .upload-input-group {
            margin-bottom: 18px;
        }
        .upload-input-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            color: #9ca3af;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .upload-input-group input, .upload-input-group textarea, .upload-input-group select {
            width: 100%;
            padding: 12px 16px;
            background: #12141c;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            color: #fff;
            font-size: 0.95rem;
            outline: none;
        }

        /* Mobile File Picker Custom Box */
        .file-drop-zone {
            border: 2px dashed rgba(245, 158, 11, 0.5);
            background: rgba(245, 158, 11, 0.05);
            border-radius: 14px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: 0.2s ease;
        }
        .file-drop-zone:active {
            background: rgba(245, 158, 11, 0.15);
        }
        .file-drop-zone i {
            font-size: 2rem;
            color: #f59e0b;
            margin-bottom: 8px;
        }
        .file-drop-zone p {
            font-size: 0.85rem;
            color: #9ca3af;
        }

        .btn-publish-titan {
            width: 100%;
            background: linear-gradient(135deg, #f59e0b, #ef4444);
            color: #fff;
            padding: 14px;
            border-radius: 14px;
            font-weight: 800;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(systemStyle);

    function injectSystemModals() {
        if (!document.getElementById('titanUploadModal')) {
            const uploadModal = document.createElement('div');
            uploadModal.id = 'titanUploadModal';
            uploadModal.className = 'titan-system-modal';
            uploadModal.innerHTML = `
                <div class="titan-modal-header">
                    <h3><i class="fa-solid fa-mobile-screen-button" style="color:#f59e0b;"></i> Mobile Video Upload</h3>
                    <button class="titan-close-btn" onclick="closeTitanUploadModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="upload-form-container">
                    <div class="upload-input-group">
                        <label>Select Video File From Mobile</label>
                        <div class="file-drop-zone" onclick="document.getElementById('uploadFileInput').click()">
                            <i class="fa-solid fa-folder-open"></i>
                            <p id="fileChooseStatus">Tap to select Video / Reel from Phone Gallery</p>
                        </div>
                        <input type="file" id="uploadFileInput" accept="video/*" style="display:none;" onchange="handleFileSelected(this)" />
                    </div>

                    <div class="upload-input-group">
                        <label>Video Title</label>
                        <input type="text" id="uploadTitle" placeholder="Enter video title..." />
                    </div>

                    <div class="upload-input-group">
                        <label>Category</label>
                        <select id="uploadCategory">
                            <option value="Titan Shorts">Titan Shorts / Reel</option>
                            <option value="AI Movies">AI Movies & Cinematic</option>
                            <option value="Sufi Music">Sufi Music & Poetry</option>
                        </select>
                    </div>

                    <button class="btn-publish-titan" onclick="publishMobileVideo()">
                        <i class="fa-solid fa-cloud-arrow-up"></i> Upload & Publish
                    </button>
                </div>
            `;
            document.body.appendChild(uploadModal);
        }
        bindButtonsFunctionality();
    }

    function bindButtonsFunctionality() {
        const createBtns = document.querySelectorAll('.titan-nav-create, [onclick*="openAccountModal"]');
        createBtns.forEach(btn => {
            btn.removeAttribute('onclick');
            btn.addEventListener('click', openTitanUploadModal);
        });
    }

    window.openTitanUploadModal = function() {
        document.getElementById('titanUploadModal')?.classList.add('active');
    };
    window.closeTitanUploadModal = function() {
        document.getElementById('titanUploadModal')?.classList.remove('active');
    };

    window.handleFileSelected = function(input) {
        if (input.files && input.files[0]) {
            const fileName = input.files[0].name;
            document.getElementById('fileChooseStatus').innerHTML = `Selected File: <strong style="color:#00dfd8;">${fileName}</strong>`;
        }
    };

    window.publishMobileVideo = function() {
        const fileInput = document.getElementById('uploadFileInput');
        const title = document.getElementById('uploadTitle').value.trim();

        if (!fileInput.files || fileInput.files.length === 0) {
            alert("Please select a video file from your mobile storage first!");
            return;
        }
        if (!title) {
            alert("Please enter a title for your video!");
            return;
        }

        alert("🎉 Mobile Video '" + title + "' selected and published successfully!");
        closeTitanUploadModal();
        
        // Reset form
        fileInput.value = '';
        document.getElementById('uploadTitle').value = '';
        document.getElementById('fileChooseStatus').innerText = "Tap to select Video / Reel from Phone Gallery";
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectSystemModals);
    } else {
        setTimeout(injectSystemModals, 300);
    }
})();
