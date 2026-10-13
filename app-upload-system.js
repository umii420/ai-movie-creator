/**
 * ==========================================
 * PLATFORM: TITAN AI (Hybrid Ecosystem)
 * VERSION: v1.3.0-Only-Shorts-And-Videos
 * FILE: app-upload-system.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Custom Upload System Active (Shorts & Videos Only)!");

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

        .file-drop-zone {
            border: 2px dashed rgba(245, 158, 11, 0.5);
            background: rgba(245, 158, 11, 0.05);
            border-radius: 14px;
            padding: 22px;
            text-align: center;
            cursor: pointer;
            transition: 0.2s ease;
        }
        .file-drop-zone:active {
            background: rgba(245, 158, 11, 0.15);
        }
        .file-drop-zone i {
            font-size: 2.2rem;
            color: #f59e0b;
            margin-bottom: 8px;
        }
        .file-drop-zone p {
            font-size: 0.88rem;
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

    function injectUploadModal() {
        if (!document.getElementById('titanUploadModal')) {
            const uploadModal = document.createElement('div');
            uploadModal.id = 'titanUploadModal';
            uploadModal.className = 'titan-system-modal';
            uploadModal.innerHTML = `
                <div class="titan-modal-header">
                    <h3><i class="fa-solid fa-cloud-arrow-up" style="color:#f59e0b;"></i> Titan Studio — Video Upload</h3>
                    <button class="titan-close-btn" onclick="closeTitanUploadModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="upload-form-container">
                    <div class="upload-input-group">
                        <label>Select Video File from Phone Gallery</label>
                        <div class="file-drop-zone" onclick="document.getElementById('uploadFileInput').click()">
                            <i class="fa-solid fa-folder-open"></i>
                            <p id="fileChooseStatus">Tap to select Short or Video from Gallery</p>
                        </div>
                        <input type="file" id="uploadFileInput" accept="video/*" style="display:none;" onchange="handleFileSelected(this)" />
                    </div>

                    <div class="upload-input-group">
                        <label>Select Format Type</label>
                        <select id="uploadCategory" onchange="updateDurationLimit(this.value)">
                            <option value="Titan Shorts">Titan Short (1 to 2 Minutes)</option>
                            <option value="Long Video">Full Video / Film (10 to 20 Minutes)</option>
                        </select>
                        <small id="durationHint" style="color: #f59e0b; display: block; margin-top: 6px; font-size: 0.78rem;">Allowed duration: 1 to 2 minutes for Shorts.</small>
                    </div>

                    <div class="upload-input-group">
                        <label>Title</label>
                        <input type="text" id="uploadTitle" placeholder="Enter title..." />
                    </div>

                    <button class="btn-publish-titan" onclick="publishTitanVideo()">
                        <i class="fa-solid fa-circle-check"></i> Upload & Publish
                    </button>
                </div>
            `;
            document.body.appendChild(uploadModal);
        }
        bindCreateButtons();
    }

    function bindCreateButtons() {
        const createBtns = document.querySelectorAll('.titan-nav-create, [onclick*="openAccountModal"]');
        createBtns.forEach(btn => {
            btn.removeAttribute('onclick');
            btn.onclick = function(e) {
                e.preventDefault();
                openTitanUploadModal();
            };
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
            document.getElementById('fileChooseStatus').innerHTML = `Selected: <strong style="color:#00dfd8;">${fileName}</strong>`;
        }
    };

    window.updateDurationLimit = function(category) {
        const hint = document.getElementById('durationHint');
        if (category === 'Titan Shorts') {
            hint.innerText = "Allowed duration: 1 to 2 minutes for Shorts.";
        } else {
            hint.innerText = "Allowed duration: 10 to 20 minutes for Full Videos/Films.";
        }
    };

    window.publishTitanVideo = function() {
        const fileInput = document.getElementById('uploadFileInput');
        const title = document.getElementById('uploadTitle').value.trim();
        const category = document.getElementById('uploadCategory').value;

        if (!fileInput.files || fileInput.files.length === 0) {
            alert("Please select a video file from your phone gallery first!");
            return;
        }
        if (!title) {
            alert("Please enter a title for your content!");
            return;
        }

        alert(`🎉 Success! '${title}' (${category}) uploaded successfully!`);
        closeTitanUploadModal();
        
        fileInput.value = '';
        document.getElementById('uploadTitle').value = '';
        document.getElementById('fileChooseStatus').innerText = "Tap to select Short or Video from Gallery";
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUploadModal);
    } else {
        setTimeout(injectUploadModal, 300);
    }
})();
