/**
 * TITAN AI MOVIE CREATOR - FRONT GATE GOOGLE AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Front Gate Auth System Initialized");

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

    // Check and Control Front Gate Visibility
    function checkAuthGateState() {
        const isLoggedIn = localStorage.getItem('titan_logged_in') === 'true';
        const gateOverlay = document.getElementById('titanAuthGateOverlay');
        
        if (gateOverlay) {
            if (!isLoggedIn) {
                gateOverlay.style.display = 'flex'; // Show front gate if not logged in
            } else {
                gateOverlay.style.display = 'none'; // Hide if already logged in
            }
        }
    }

    async function initFirebase() {
        try {
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js");

            if (window.firebase && !window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig);
            }

            authInstance = window.firebase.auth();
            googleProviderInstance = new window.firebase.auth.GoogleAuthProvider();

            // Session Listener
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
                    console.log("✅ User Logged In:", user.email);
                } else {
                    localStorage.removeItem('titan_user_profile');
                    localStorage.setItem('titan_logged_in', 'false');
                }
                checkAuthGateState();
            });

        } catch (err) {
            console.error("❌ Firebase Auth Error:", err);
            // Fallback: Agar firebase load na ho toh gate check chala do
            checkAuthGateState();
        }
    }

    // Google Login Trigger Function
    window.handleGoogleLogin = async function () {
        if (!authInstance || !googleProviderInstance) {
            await initFirebase();
        }

        try {
            console.log("🔑 Opening Google Sign-In Popup...");
            const result = await authInstance.signInWithPopup(googleProviderInstance);
            const user = result.user;
            
            // Save profile immediately
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

            // Hide Gate & Refresh
            document.getElementById('titanAuthGateOverlay').style.display = 'none';
            alert("Welcome " + user.displayName + "! Profile created successfully.");
            location.reload();
        } catch (error) {
            console.error("❌ Google Login Failed:", error);
            alert("Google Login Error: " + error.message);
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        checkAuthGateState(); // Pehle check karein
        initFirebase();       // Phir firebase init karein
    });
})();
