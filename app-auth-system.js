/**
 * TITAN AI MOVIE CREATOR - CLEAN MULTI-SOCIAL AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Clean Multi-Social Auth System Initialized");

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
                        verified: false, // Strict: No blue tick
                        joinedDate: new Date().toLocaleDateString()
                    };

                    localStorage.setItem('titan_user_profile', JSON.stringify(userProfile));
                    localStorage.setItem('titan_logged_in', 'true');

                    updateUIForLoggedInUser(userProfile);
                    closeAccountModal();
                } else {
                    localStorage.removeItem('titan_user_profile');
                    localStorage.setItem('titan_logged_in', 'false');
                    renderLoginHeaderButton();
                }
            });

        } catch (err) {
            console.error("❌ Firebase Auth Error:", err);
        }
    }

    // Modern Multi-Social Sign-Up Modal
    function injectSocialAuthModal() {
        if (document.getElementById('titanAuthModal')) return;

        const modalStyles = document.createElement('style');
        modalStyles.innerHTML = `
            .titan-auth-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background: rgba(0,0,0,0.82); backdrop-filter: blur(12px);
                z-index: 100000; display: none; align-items: center; justify-content: center;
                padding: 20px;
            }
            .titan-auth-overlay.active { display: flex; animation: fadeIn 0.25s ease-out; }
            .titan-auth-card {
                background: #0f1015; border: 1px solid rgba(255,255,255,0.12);
                width: 100%; max-width: 380px; border-radius: 24px; padding: 28px 22px;
                text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.6); position: relative;
            }
            .titan-auth-close {
                position: absolute; top: 16px; right: 18px; background: transparent;
                border: none; color: #888; font-size: 1.2rem; cursor: pointer;
            }
            .titan-auth-card h2 { font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 6px; }
            .titan-auth-card p { font-size: 0.82rem; color: #aaa; margin-bottom: 22px; line-height: 1.4; }
            .titan-social-btn {
                width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
                padding: 12px 18px; border-radius: 14px; font-weight: 700; font-size: 0.88rem;
                border: none; cursor: pointer; margin-bottom: 11px; transition: transform 0.15s, opacity 0.15s;
            }
            .titan-social-btn:hover { transform: translateY(-2px); opacity: 0.95; }
            .btn-google { background: #ffffff; color: #000000; box-shadow: 0 4px 12px rgba(255,255,255,0.12); }
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
                <button class="titan-auth-close" onclick="closeAccountModal()"><i class="fa-solid fa-xmark"></i></button>
                <h2>Welcome to Titan AI</h2>
                <p>Sign up to start creating original AI movies and manage your profile.</p>

                <button class="titan-social-btn btn-google" onclick="handleGoogleLogin()">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google">
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

    // Trigger Google Auth Directly
    window.handleGoogleLogin = async function () {
        if (!authInstance || !googleProviderInstance) {
            await initFirebase();
        }

        try {
            await authInstance.signInWithPopup(googleProviderInstance);
        } catch (error) {
            console.error("❌ Sign-In Error:", error);
        }
    };

    function updateUIForLoggedInUser(profile) {
        const container = document.getElementById('titanLoginContainer');
        if (container) {
            container.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 5px 12px; border-radius: 20px; cursor: pointer;" onclick="toggleSettingsDrawer()">
                    <img src="${profile.photo}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;" />
                    <span style="font-weight: 700; font-size: 0.82rem; color: var(--titan-text, #fff);">${profile.name.split(' ')[0]}</span>
                </div>
            `;
        }
    }

    function renderLoginHeaderButton() {
        const container = document.getElementById('titanLoginContainer');
        if (container) {
            container.innerHTML = `
                <button onclick="openAccountModal()" style="display: flex; align-items: center; gap: 6px; background: #ffffff; color: #000; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.82rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <i class="fa-solid fa-user-plus"></i> Sign Up
                </button>
            `;
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        initFirebase();
        injectSocialAuthModal();
        renderLoginHeaderButton();
    });
})();
