/**
 * TITAN AI MOVIE CREATOR - FORCED GATEWAY AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Forced Gateway Auth Initialized");

    // Firebase Configuration
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

            // Session State Listener
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
                    
                    // Forcefully open modal immediately if not logged in
                    openAccountModal();
                }
            });

        } catch (err) {
            console.error("❌ Firebase Auth Error:", err);
        }
    }

    // Update Header Profile Chip when Logged In
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

    // Forced Gateway Modal UI (No Close Button - Must Login)
    function injectSocialAuthModal() {
        if (document.getElementById('titanAuthModal')) return;

        const modalStyles = document.createElement('style');
        modalStyles.innerHTML = `
            .titan-auth-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(15px);
                z-index: 999999; display: none; align-items: center; justify-content: center;
                padding: 16px;
            }
            .titan-auth-overlay.active { display: flex; animation: fadeInModal 0.3s ease-out; }
            @keyframes fadeInModal {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .titan-auth-card {
                background: #0d0e12; color: #f3f4f6; border: 1px solid rgba(255,255,255,0.15);
                width: 100%; max-width: 380px; border-radius: 24px; padding: 32px 24px;
                text-align: center; box-shadow: 0 20px 45px rgba(0,0,0,0.7); position: relative;
            }
            .titan-auth-card h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 6px; color: #ffffff; }
            .titan-auth-card p { font-size: 0.82rem; color: #9ca3af; margin-bottom: 24px; line-height: 1.4; }
            
            .titan-social-btn {
                width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
                padding: 13px 18px; border-radius: 14px; font-weight: 700; font-size: 0.9rem;
                border: none; cursor: pointer; margin-bottom: 12px; transition: transform 0.15s, opacity 0.15s;
            }
            .titan-social-btn:hover { transform: translateY(-2px); opacity: 0.95; }
            .btn-google { background: #ffffff; color: #000000; box-shadow: 0 4px 15px rgba(255,255,255,0.15); }
            .btn-tiktok { background: #000000; color: #ffffff; border: 1px solid rgba(255,255,255,0.2); }
            .btn-instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #ffffff; }
            .btn-facebook { background: #1877f2; color: #ffffff; }
        `;
        document.head.appendChild(modalStyles);

        const modal = document.createElement('div');
        modal.id = 'titanAuthModal';
        modal.className = 'titan-auth-overlay';
        modal.innerHTML = `
            <div class="titan-auth-card">
                <h2>Welcome to Titan AI</h2>
                <p>Sign up to start creating original AI movies and manage your profile.</p>

                <button class="titan-social-btn btn-google" onclick="handleGoogleLogin()">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" height="20" alt="Google">
                    Continue with Google
                </button>

                <button class="titan-social-btn btn-tiktok" onclick="handleGoogleLogin()">
                    <i class="fa-brands fa-tiktok" style="font-size: 1.1rem; color: #00f2fe;"></i>
                    Continue with TikTok
                </button>

                <button class="titan-social-btn btn-instagram" onclick="handleGoogleLogin()">
                    <i class="fa-brands fa-instagram" style="font-size: 1.1rem;"></i>
                    Continue with Instagram
                </button>

                <button class="titan-social-btn btn-facebook" onclick="handleGoogleLogin()">
                    <i class="fa-brands fa-facebook" style="font-size: 1.1rem;"></i>
                    Continue with Facebook
                </button>
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

    // Google Login Trigger via Firebase
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
