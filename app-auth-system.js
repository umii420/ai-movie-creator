/**
 * TITAN AI MOVIE CREATOR - COMPACT PROFESSIONAL AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Compact Auth System Initialized");

    // Firebase Configuration (Apni Firebase keys yahan add karen)
    const firebaseConfig = {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "ai-movie-creator--umaralipakistan.firebaseapp.com",
        projectId: "ai-movie-creator--umaralipakistan",
        storageBucket: "ai-movie-creator--umaralipakistan.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    let authInstance = null;
    let googleProviderInstance = null;

    async function initFirebase() {
        try {
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js");

            if (window.firebase && !window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig);
            }

            authInstance = window.firebase.auth();
            googleProviderInstance = new window.firebase.auth.GoogleAuthProvider();

            // Session Sync & Profile Auto-Creation
            authInstance.onAuthStateChanged((user) => {
                if (user) {
                    const userProfile = {
                        name: user.displayName || "Titan Creator",
                        email: user.email,
                        photo: user.photoURL || "https://picsum.photos/200",
                        uid: user.uid,
                        bio: "AI Content Creator on Titan AI",
                        followers: "0",
                        following: "0",
                        likes: "0",
                        verified: false,
                        joinedDate: new Date().toLocaleDateString()
                    };

                    localStorage.setItem('titan_user_profile', JSON.stringify(userProfile));
                    localStorage.setItem('titan_logged_in', 'true');

                    updateHeaderToLoggedInUser(userProfile);
                    closeAccountModal();
                } else {
                    localStorage.removeItem('titan_user_profile');
                    localStorage.setItem('titan_logged_in', 'false');
                    
                    // Show compact modal automatically on fresh load if not logged in
                    openAccountModal();
                }
            });

        } catch (err) {
            console.error("❌ Firebase Auth Error:", err);
        }
    }

    // Update Header Profile Icon when Logged In
    function updateHeaderToLoggedInUser(profile) {
        const headerActions = document.querySelector('.titan-header-actions');
        if (!headerActions) return;

        let profileChip = document.getElementById('titanTopProfileChip');
        if (!profileChip) {
            profileChip = document.createElement('div');
            profileChip.id = 'titanTopProfileChip';
            headerActions.prepend(profileChip);
        }

        profileChip.style.cssText = "display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 20px; cursor: pointer;";
        profileChip.innerHTML = `
            <img src="${profile.photo}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" />
            <span style="font-weight: 700; font-size: 0.78rem; color: var(--titan-text, #fff);">${profile.name.split(' ')[0]}</span>
        `;
        profileChip.onclick = function() {
            if (window.toggleSettingsDrawer) window.toggleSettingsDrawer();
        };
    }

    // Compact Professional Modal UI (Exact Screenshot Style)
    function injectSocialAuthModal() {
        if (document.getElementById('titanAuthModal')) return;

        const modalStyles = document.createElement('style');
        modalStyles.innerHTML = `
            .titan-auth-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);
                z-index: 999999; display: none; align-items: center; justify-content: center;
                padding: 16px;
            }
            .titan-auth-overlay.active { display: flex; animation: fadeInModal 0.25s ease-out; }
            @keyframes fadeInModal {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .titan-auth-card {
                background: #ffffff; color: #111111;
                width: 100%; max-width: 360px; border-radius: 24px; padding: 28px 24px;
                text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.3); position: relative;
            }
            body.dark-mode .titan-auth-card, body:not(.light-mode) .titan-auth-card {
                background: #121318; color: #f3f4f6; border: 1px solid rgba(255,255,255,0.1);
            }
            .titan-auth-card h2 { font-size: 1.25rem; font-weight: 800; margin-bottom: 20px; letter-spacing: -0.3px; }
            
            .btn-google-compact {
                width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
                padding: 12px 16px; border-radius: 14px; font-weight: 700; font-size: 0.88rem;
                background: linear-gradient(135deg, #f59e0b, #ef4444); color: #ffffff;
                border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(245,158,11,0.25);
                transition: transform 0.15s, opacity 0.15s; margin-bottom: 18px;
            }
            .btn-google-compact:hover { transform: translateY(-1px); opacity: 0.95; }
            
            .auth-divider {
                display: flex; align-items: center; text-align: center; color: #888;
                font-size: 0.78rem; margin-bottom: 16px; font-weight: 600;
            }
            .auth-divider::before, .auth-divider::after {
                content: ''; flex: 1; border-bottom: 1px solid rgba(150,150,150,0.3);
            }
            .auth-divider::before { margin-right: .75em; }
            .auth-divider::after { margin-left: .75em; }

            .auth-input {
                width: 100%; padding: 11px 14px; border-radius: 12px;
                border: 1px solid rgba(150,150,150,0.3); background: transparent;
                color: inherit; font-size: 0.85rem; outline: none; margin-bottom: 10px;
            }
            .auth-input:focus { border-color: #f59e0b; }

            .btn-continue-compact {
                width: 100%; background: #e5e7eb; color: #374151; border: none;
                padding: 11px; border-radius: 12px; font-weight: 700; font-size: 0.85rem;
                cursor: not-allowed; margin-top: 6px; margin-bottom: 14px;
            }
            body.dark-mode .btn-continue-compact, body:not(.light-mode) .btn-continue-compact {
                background: #1f2937; color: #9ca3af;
            }

            .auth-footer-terms {
                font-size: 0.7rem; color: #888; line-height: 1.3; margin-top: 10px;
            }
            .auth-footer-terms a { color: inherit; text-decoration: underline; }
        `;
        document.head.appendChild(modalStyles);

        const modal = document.createElement('div');
        modal.id = 'titanAuthModal';
        modal.className = 'titan-auth-overlay';
        modal.innerHTML = `
            <div class="titan-auth-card">
                <h2>Sign up or log in</h2>

                <button class="btn-google-compact" onclick="handleGoogleLogin()">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google">
                    Continue with Google
                </button>

                <div class="auth-divider">or</div>

                <input type="email" class="auth-input" placeholder="Email" id="titanAuthEmail" />
                <input type="password" class="auth-input" placeholder="Password" id="titanAuthPass" />
                
                <div style="font-size: 0.72rem; text-align: left; color: #888; margin-bottom: 10px; padding-left: 2px;">
                    ✓ 8 characters &nbsp; ✓ 1 letter &nbsp; ✓ 1 number
                </div>

                <button class="btn-continue-compact">Continue</button>

                <div class="auth-footer-terms">
                    By proceeding you agree with <a href="#">Terms and Conditions</a> & <a href="#">Privacy Policy</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.openAccountModal = function () {
        injectSocialAuthModal();
        document.getElementById('titanAuthModal')?.classList.add('active');
    };

    window.closeAccountModal = function () {
        document.getElementById('titanAuthModal')?.classList.remove('active');
    };

    // Google Sign-In Trigger via Firebase
    window.handleGoogleLogin = async function () {
        if (!authInstance || !googleProviderInstance) {
            await initFirebase();
        }

        try {
            console.log("🔑 Triggering Google Sign-In...");
            await authInstance.signInWithPopup(googleProviderInstance);
        } catch (error) {
            console.error("❌ Google Login Failed:", error);
            alert("Login Failed: " + error.message);
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        initFirebase();
        injectSocialAuthModal();
    });
})();
