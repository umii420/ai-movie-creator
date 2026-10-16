/**
 * TITAN AI MOVIE CREATOR - FIREBASE & VERCEL GOOGLE AUTHENTICATION
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Google Auth System Initialized");

    // 1. Firebase Configuration Setup
    const firebaseConfig = {
        apiKey: window.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
        authDomain: "titan-ai-xxxx.firebaseapp.com",
        projectId: "titan-ai-xxxx",
        storageBucket: "titan-ai-xxxx.appspot.com",
        messagingSenderId: "107128741829",
        appId: "1:107128741829:web:titan"
    };

    let authInstance = null;
    let googleProviderInstance = null;

    // Helper to dynamically load Firebase JS SDKs
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

    // Check & Toggle Front-Gate Modal Display
    function checkAuthGateState() {
        const isLoggedIn = localStorage.getItem('titan_logged_in') === 'true';
        const gateOverlay = document.getElementById('titanAuthGateOverlay');
        
        if (gateOverlay) {
            gateOverlay.style.display = isLoggedIn ? 'none' : 'flex';
        }
    }

    // Initialize Firebase Services
    async function initFirebase() {
        try {
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js");

            if (window.firebase && !window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig);
            }

            authInstance = window.firebase.auth();
            googleProviderInstance = new window.firebase.auth.GoogleAuthProvider();

            // Observe Firebase Login Status
            authInstance.onAuthStateChanged((user) => {
                if (user) {
                    const userProfile = {
                        name: user.displayName || "Titan Creator",
                        email: user.email,
                        photo: user.photoURL || "https://picsum.photos/200",
                        uid: user.uid,
                        verified: true,
                        joinedDate: new Date().toLocaleDateString()
                    };

                    localStorage.setItem('titan_user_profile', JSON.stringify(userProfile));
                    localStorage.setItem('titan_logged_in', 'true');
                }
                checkAuthGateState();
            });

        } catch (err) {
            console.error("❌ Firebase Initialization Error:", err);
            checkAuthGateState();
        }
    }

    // Handle "Continue with Google" Click Trigger
    window.handleGoogleLogin = async function () {
        if (!authInstance || !googleProviderInstance) {
            await initFirebase();
        }

        try {
            console.log("🔑 Triggering Google Sign-In Popup...");
            const result = await authInstance.signInWithPopup(googleProviderInstance);
            const user = result.user;

            const userProfile = {
                name: user.displayName || "Titan Creator",
                email: user.email,
                photo: user.photoURL || "https://picsum.photos/200",
                uid: user.uid,
                verified: true,
                joinedDate: new Date().toLocaleDateString()
            };

            localStorage.setItem('titan_user_profile', JSON.stringify(userProfile));
            localStorage.setItem('titan_logged_in', 'true');

            const gateOverlay = document.getElementById('titanAuthGateOverlay');
            if (gateOverlay) gateOverlay.style.display = 'none';

            alert("Welcome " + userProfile.name + "! Profile created successfully.");
            location.reload();
        } catch (error) {
            console.error("❌ Google Login Error:", error);

            // Fallback for mobile browser popup blockers
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-by-user') {
                const userEmail = prompt("Popup was blocked or closed. Enter your Gmail address to connect:");
                if (userEmail && userEmail.includes("@")) {
                    const name = userEmail.split('@')[0];
                    const userProfile = {
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        email: userEmail,
                        photo: "https://picsum.photos/200",
                        uid: "titan_" + Date.now(),
                        verified: true,
                        joinedDate: new Date().toLocaleDateString()
                    };
                    localStorage.setItem('titan_user_profile', JSON.stringify(userProfile));
                    localStorage.setItem('titan_logged_in', 'true');
                    location.reload();
                }
            } else {
                alert("Login Error: " + error.message);
            }
        }
    };

    // Logout Functionality
    window.handleTitanLogout = function () {
        if (authInstance) {
            authInstance.signOut().then(() => {
                localStorage.removeItem('titan_user_profile');
                localStorage.setItem('titan_logged_in', 'false');
                alert("Logged out successfully!");
                location.reload();
            });
        } else {
            localStorage.removeItem('titan_user_profile');
            localStorage.setItem('titan_logged_in', 'false');
            location.reload();
        }
    };

    // Auto Run on DOM Load
    document.addEventListener("DOMContentLoaded", function () {
        checkAuthGateState();
        initFirebase();
    });
})();
