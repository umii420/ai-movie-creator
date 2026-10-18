/**
 * ==========================================
 * TITAN AI — REAL VIDEO UPLOAD (Cloudinary)
 * FILE: app-upload-system.js
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Cloudinary Upload System Loaded");

    // ========== CLOUDINARY CONFIG ==========
    const CLOUD_NAME = "dgeshman";
    const UPLOAD_PRESET = "Titan-upload";
    // =======================================

    let selectedFile = null;

    // Styles
    if (!document.getElementById('titan-upload-style')) {
        const style = document.createElement('style');
        style.id = 'titan-upload-style';
        style.innerHTML = `
            #titanOverlayV9 {
                position: fixed !important;
                top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: rgba(10, 10, 12, 0.97) !important;
                z-index: 9999999999 !important;
                display: none;
                flex-direction: column !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 25px 0 35px 0 !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
                color: #ffffff !important;
            }

            #titanOverlayV9.active {
                display: flex !important;
            }

            #titanPubModalV9 {
                position: fixed !important;
                top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: rgba(5, 5, 8, 0.98) !important;
                z-index: 10000000000 !important;
                display: none;
                flex-direction: column !important;
                padding: 25px 6% !important;
                overflow-y: auto !important;
                color: #fff !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
            }

            #titanPubModalV9.active {
                display: flex !important;
            }

            .upload-progress-bar {
                width: 100%;
                height: 8px;
                background: #333;
                border-radius: 10px;
                overflow: hidden;
                margin: 15px 0;
            }

            .upload-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00b2ff, #0072ff);
                width: 0%;
                transition: width 0.3s;
            }
        `;
        document.head.appendChild(style);
    }

    // Build upload UI
    function buildUploadUI() {
        if (!document.getElementById('titanOverlayV9')) {
            const overlay = document.createElement('div');
            overlay.id = 'titanOverlayV9';

            overlay.innerHTML = `
                <div style="width:100%;padding:0 22px;display:flex;justify-content:flex-start;">
                    <button onclick="document.getElementById('titanOverlayV9').classList.remove('active')"
                        style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:1.2rem;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div style="text-align:center;max-width:350px;padding:0 20px;">
                    <div style="width:70px;height:70px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#00b2ff;margin:0 auto 20px;">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <h2 style="font-size:1.2rem;font-weight:700;color:#f3f4f6;">Upload your video to Titan AI</h2>
                    <p style="font-size:0.85rem;color:#9ca3af;margin-top:8px;">Select a video from your gallery</p>
                </div>

                <div style="width:100%;max-width:420px;padding:0 24px;display:flex;flex-direction:column;gap:12px;">
                    <button onclick="document.getElementById('titanFileInputV9').click()"
                        style="background:#fff;color:#000;border:none;width:100%;padding:15px;border-radius:35px;font-weight:700;font-size:1rem;cursor:pointer;">
                        Add from gallery
                    </button>

                    <input type="file" id="titanFileInputV9" accept="video/*"
                        style="display:none;" onchange="handleFileV9(this)" />

                    <div style="display:flex;justify-content:center;gap:20px;margin-top:10px;font-size:0.9rem;color:#9ca3af;">
                        <span id="tabVidV9" onclick="setModeV9('Video')"
                            style="cursor:pointer;padding:6px 15px;border-radius:20px;">
                            Video (10-20m)
                        </span>

                        <span id="tabShortV9" onclick="setModeV9('Short')"
                            style="cursor:pointer;padding:6px 15px;border-radius:20px;background:#fff;color:#000;font-weight:700;">
                            Short (1-2m)
                        </span>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
        }

        if (!document.getElementById('titanPubModalV9')) {
            const pubModal = document.createElement('div');
            pubModal.id = 'titanPubModalV9';

            pubModal.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:15px;margin-bottom:25px;">
                    <h3 style="color:#00b2ff;">
                        <i class="fa-solid fa-cloud-arrow-up"></i> Titan Creator Studio
                    </h3>

                    <button onclick="document.getElementById('titanPubModalV9').classList.remove('active')"
                        style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div style="max-width:500px;margin:0 auto;width:100%;">
                    <div style="margin-bottom:15px;">
                        <label style="font-size:0.8rem;color:#9ca3af;font-weight:700;">SELECTED FILE</label>
                        <div id="fileDisplayV9" style="padding:12px;background:#12141c;border-radius:10px;color:#00dfd8;margin-top:5px;">None</div>
                    </div>

                    <div style="margin-bottom:15px;">
                        <label style="font-size:0.8rem;color:#9ca3af;font-weight:700;">TITLE</label>
                        <input type="text" id="titleInputV9" placeholder="Enter video title..."
                            style="width:100%;padding:12px;background:#12141c;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;margin-top:5px;outline:none;" />
                    </div>

                    <div style="margin-bottom:15px;">
                        <label style="font-size:0.8rem;color:#9ca3af;font-weight:700;">FORMAT</label>
                        <select id="formatSelectV9"
                            style="width:100%;padding:12px;background:#12141c;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;margin-top:5px;outline:none;">
                            <option value="Short">Titan Short (1-2 mins)</option>
                            <option value="Video">Full Video (10-20 mins)</option>
                        </select>
                    </div>

                    <div id="uploadProgressBox" style="display:none;">
                        <div style="font-size:0.85rem;color:#9ca3af;margin-bottom:6px;">
                            Uploading... <span id="progressPercent">0%</span>
                        </div>

                        <div class="upload-progress-bar">
                            <div class="upload-progress-fill" id="progressFill"></div>
                        </div>
                    </div>

                    <button id="publishBtnV9" onclick="publishV9()"
                        style="width:100%;background:linear-gradient(135deg,#00b2ff,#0072ff);color:#fff;padding:14px;border-radius:12px;font-weight:800;border:none;cursor:pointer;margin-top:10px;">
                        Publish Live Now
                    </button>
                </div>
            `;

            document.body.appendChild(pubModal);
        }
    }

    // Open upload overlay when plus button is clicked
    document.addEventListener('click', function (e) {
        const target = e.target.closest('.fa-plus, [class*="plus"], .titan-nav-create');

        if (
            target &&
            !target.closest('#titanOverlayV9') &&
            !target.closest('#titanPubModalV9')
        ) {
            e.preventDefault();
            e.stopPropagation();

            document.getElementById('titanOverlayV9')?.classList.add('active');
        }
    }, true);

    // Select Short or Video mode
    window.setModeV9 = function (mode) {
        const videoTab = document.getElementById('tabVidV9');
        const shortTab = document.getElementById('tabShortV9');
        const formatSelect = document.getElementById('formatSelectV9');

        if (!videoTab || !shortTab || !formatSelect) return;

        if (mode === 'Video') {
            videoTab.style.background = '#fff';
            videoTab.style.color = '#000';
            videoTab.style.fontWeight = '700';

            shortTab.style.background = 'transparent';
            shortTab.style.color = '#9ca3af';
            shortTab.style.fontWeight = '400';

            formatSelect.value = 'Video';
        } else {
            shortTab.style.background = '#fff';
            shortTab.style.color = '#000';
            shortTab.style.fontWeight = '700';

            videoTab.style.background = 'transparent';
            videoTab.style.color = '#9ca3af';
            videoTab.style.fontWeight = '400';

            formatSelect.value = 'Short';
        }
    };

    // Handle selected file
    window.handleFileV9 = function (input) {
        if (!input.files || !input.files[0]) return;

        selectedFile = input.files[0];

        // Max 100 MB
        if (selectedFile.size > 100 * 1024 * 1024) {
            alert("Video size should be less than 100 MB");
            input.value = '';
            selectedFile = null;
            return;
        }

        document.getElementById('fileDisplayV9').innerText =
            selectedFile.name + " (" +
            (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB)";

        document.getElementById('titanOverlayV9').classList.remove('active');
        document.getElementById('titanPubModalV9').classList.add('active');
    };

    // Reset upload button and progress
    function resetPublishButton() {
        const btn = document.getElementById('publishBtnV9');
        const progressBox = document.getElementById('uploadProgressBox');
        const progressFill = document.getElementById('progressFill');

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "Publish Live Now";
        }

        if (progressBox) progressBox.style.display = 'none';
        if (progressFill) progressFill.style.width = '0%';
    }

    // Upload video to Cloudinary
    window.publishV9 = async function () {
        const titleEl = document.getElementById('titleInputV9');
        const formatEl = document.getElementById('formatSelectV9');
        const title = titleEl.value.trim();

        if (!title) {
            alert("Please enter a title!");
            return;
        }

        if (!selectedFile) {
            alert("Please select a video first!");
            return;
        }

        const btn = document.getElementById('publishBtnV9');
        const progressBox = document.getElementById('uploadProgressBox');
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');

        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Uploading...`;
        progressBox.style.display = 'block';

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("upload_preset", UPLOAD_PRESET);
            formData.append("folder", "titan-videos");

            const xhr = new XMLHttpRequest();

            xhr.open(
                "POST",
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
            );

            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progressFill.style.width = percent + "%";
                    progressPercent.innerText = percent + "%";
                }
            };

            xhr.onload = function () {
                let result = {};

                try {
                    result = JSON.parse(xhr.responseText || '{}');
                } catch (error) {
                    resetPublishButton();
                    alert("Upload failed: Cloudinary returned an invalid response.");
                    return;
                }

                if (xhr.status >= 200 && xhr.status < 300 && result.secure_url) {
                    let uploads = [];

                    try {
                        uploads = JSON.parse(
                            localStorage.getItem('titan_user_uploads') || '[]'
                        );

                        if (!Array.isArray(uploads)) uploads = [];
                    } catch (error) {
                        uploads = [];
                    }

                    uploads.unshift({
                        id: Date.now(),
                        title: title,
                        url: result.secure_url,
                        thumb: result.secure_url.replace(
                            "/upload/",
                            "/upload/w_400,h_600,c_fill,q_auto,f_auto/"
                        ),
                        type: formatEl.value,
                        views: 0,
                        public_id: result.public_id,
                        createdAt: new Date().toISOString()
                    });

                    try {
                        localStorage.setItem(
                            'titan_user_uploads',
                            JSON.stringify(uploads)
                        );
                    } catch (storageError) {
                        console.error("Could not save video record:", storageError);
                        resetPublishButton();
                        alert("Video uploaded, but its feed record could not be saved in this browser.");
                        return;
                    }

                    // IMPORTANT: Refresh Titan AI feeds after successful upload.
                    window.dispatchEvent(
                        new CustomEvent('titan:uploads-updated')
                    );

                    if (typeof window.titanRefreshVideoFeeds === 'function') {
                        window.titanRefreshVideoFeeds();
                    }

                    alert("✅ Video uploaded successfully!");

                    document.getElementById('titanPubModalV9').classList.remove('active');
                    titleEl.value = '';
                    document.getElementById('titanFileInputV9').value = '';
                    document.getElementById('fileDisplayV9').innerText = 'None';
                    selectedFile = null;

                    resetPublishButton();
                } else {
                    console.error("Cloudinary upload failed:", result);

                    const message =
                        result.error && result.error.message
                            ? result.error.message
                            : "Please check the Cloudinary upload preset and try again.";

                    resetPublishButton();
                    alert("Upload failed: " + message);
                }
            };

            xhr.onerror = function () {
                resetPublishButton();
                alert("Network error. Please check your connection and try again.");
            };

            xhr.onabort = function () {
                resetPublishButton();
                alert("Upload was cancelled.");
            };

            xhr.send(formData);

        } catch (error) {
            console.error("Upload error:", error);
            resetPublishButton();
            alert("Upload failed. Please try again.");
        }
    };

    // Initialize upload UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildUploadUI);
    } else {
        buildUploadUI();
    }

})();
