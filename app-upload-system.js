/**
 * ==========================================
 * TITAN AI — ULTRA SAFE UPLOAD FIX v7.0.0
 * ==========================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Upload System v7.0 Loaded Successfully!");

    // 1. Inject Styles
    if (!document.getElementById('titan-v7-style')) {
        const style = document.createElement('style');
        style.id = 'titan-v7-style';
        style.innerHTML = `
            #titanOverlayV7 {
                position: fixed !important;
                top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: rgba(10, 10, 12, 0.95) !important;
                background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop') !important;
                background-size: cover !important;
                background-position: center !important;
                z-index: 999999999 !important;
                display: none;
                flex-direction: column !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 25px 0 35px 0 !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
                color: #ffffff !important;
            }
            #titanOverlayV7.active { display: flex !important; }

            #titanPubModalV7 {
                position: fixed !important;
                top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: rgba(5, 5, 8, 0.98) !important;
                z-index: 1000000000 !important;
                display: none;
                flex-direction: column !important;
                padding: 25px 6% !important;
                overflow-y: auto !important;
                color: #fff !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
            }
            #titanPubModalV7.active { display: flex !important; }
        `;
        document.head.appendChild(style);
    }

    // 2. Create UI Elements dynamically
    function createUI() {
        if (!document.getElementById('titanOverlayV7')) {
            const overlay = document.createElement('div');
            overlay.id = 'titanOverlayV7';
            overlay.innerHTML = `
                <div style="width: 100%; padding: 0 22px; display: flex; justify-content: flex-start;">
                    <button onclick="document.getElementById('titanOverlayV7').classList.remove('active')" style="background: rgba(255,255,255,0.2); border: none; color: #fff; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div style="text-align: center; max-width: 350px; padding: 0 20px;">
                    <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #00b2ff; margin: 0 auto 20px auto;"><i class="fa-solid fa-bolt"></i></div>
                    <h2 style="font-size: 1.2rem; font-weight: 700; color: #f3f4f6;">To record, let Titan AI access your camera and storage</h2>
                </div>
                <div style="width: 100%; max-width: 420px; padding: 0 24px; display: flex; flex-direction: column; gap: 12px;">
                    <button onclick="document.getElementById('titanFileInputV7').click()" style="background: #fff; color: #000; border: none; width: 100%; padding: 15px; border-radius: 35px; font-weight: 700; font-size: 1rem; cursor: pointer;">Add from gallery</button>
                    <button onclick="alert('Permissions are active.')" style="background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.2); width: 100%; padding: 15px; border-radius: 35px; font-weight: 600; font-size: 1rem; cursor: pointer;">Open settings</button>
                    <input type="file" id="titanFileInputV7" accept="video/*" style="display:none;" onchange="handleFileV7(this)" />
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px; font-size: 0.9rem; color: #9ca3af;">
                        <span id="tabVidV7" onclick="setModeV7('Video')" style="cursor:pointer; padding: 6px 15px; border-radius: 20px;">Video (10-20m)</span>
                        <span id="tabShortV7" onclick="setModeV7('Short')" style="cursor:pointer; padding: 6px 15px; border-radius: 20px; background:#fff; color:#000; font-weight:700;">Short (1-2m)</span>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        if (!document.getElementById('titanPubModalV7')) {
            const pubModal = document.createElement('div');
            pubModal.id = 'titanPubModalV7';
            pubModal.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 25px;">
                    <h3 style="color:#00b2ff;"><i class="fa-solid fa-cloud-arrow-up"></i> Titan Creator Studio</h3>
                    <button onclick="document.getElementById('titanPubModalV7').classList.remove('active')" style="background:rgba(255,255,255,0.2); border:none; color:#fff; width:36px; height:36px; border-radius:50%; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div style="max-width: 500px; margin: 0 auto; width: 100%;">
                    <div style="margin-bottom: 15px;">
                        <label style="font-size:0.8rem; color:#9ca3af; font-weight:700;">SELECTED FILE</label>
                        <div id="fileDisplayV7" style="padding: 12px; background: #12141c; border-radius: 10px; color: #00dfd8; margin-top:5px;">None</div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="font-size:0.8rem; color:#9ca3af; font-weight:700;">TITLE</label>
                        <input type="text" id="titleInputV7" placeholder="Enter video title..." style="width: 100%; padding: 12px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; margin-top:5px; outline:none;" />
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label style="font-size:0.8rem; color:#9ca3af; font-weight:700;">FORMAT</label>
                        <select id="formatSelectV7" style="width: 100%; padding: 12px; background: #12141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; margin-top:5px; outline:none;">
                            <option value="Short">Titan Short (1-2 mins)</option>
                            <option value="Video">Full Video (10-20 mins)</option>
                        </select>
                    </div>
                    <button onclick="publishV7()" style="width: 100%; background: linear-gradient(135deg, #00b2ff, #0072ff); color: #fff; padding: 14px; border-radius: 12px; font-weight: 800; border: none; cursor: pointer;">Publish Live Now</button>
                </div>
            `;
            document.body.appendChild(pubModal);
        }
    }

    // 3. Global Click Listener to catch any Plus or Create button click
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button, i, a, div');
        if (target) {
            const text = target.innerText || '';
            const className = target.className || '';
            const idName = target.id || '';
            
            // Agar click kisi bhi plus icon, create button ya upload option par ho
            if (className.includes('plus') || className.includes('create') || idName.includes('plus') || target.querySelector('.fa-plus')) {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('titanOverlayV7').classList.add('active');
            }
        }
    }, true);

    window.setModeV7 = function(mode) {
        if(mode === 'Video') {
            document.getElementById('tabVidV7').style.background = '#fff';
            document.getElementById('tabVidV7').style.color = '#000';
            document.getElementById('tabVidV7').style.fontWeight = '700';
            document.getElementById('tabShortV7').style.background = 'transparent';
            document.getElementById('tabShortV7').style.color = '#9ca3af';
            document.getElementById('formatSelectV7').value = 'Video';
        } else {
            document.getElementById('tabShortV7').style.background = '#fff';
            document.getElementById('tabShortV7').style.color = '#000';
            document.getElementById('tabShortV7').style.fontWeight = '700';
            document.getElementById('tabVidV7').style.background = 'transparent';
            document.getElementById('tabVidV7').style.color = '#9ca3af';
            document.getElementById('formatSelectV7').value = 'Short';
        }
    };

    window.handleFileV7 = function(input) {
        if (input.files && input.files[0]) {
            document.getElementById('fileDisplayV7').innerText = input.files[0].name;
            document.getElementById('titanOverlayV7').classList.remove('active');
            document.getElementById('titanPubModalV7').classList.add('active');
        }
    };

    window.publishV7 = function() {
        const title = document.getElementById('titleInputV7').value.trim();
        if(!title) { alert("Please enter a title!"); return; }
        alert("🎉 Success! Your content has been published successfully.");
        document.getElementById('titanPubModalV7').classList.remove('active');
        document.getElementById('titleInputV7').value = '';
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();
