/**
 * TITAN AI MOVIE CREATOR - CLEAN GOOGLE AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Google Auth System Initialized");

    // Yahan apni original Firebase configuration keys dal dein
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
                        joinedDate: new Date().toLocaleDateString()
                    };

                    localStorage.setItem('titan_user_profile', JSON.stringify(userProfile));
                    localStorage.setItem('titan_logged_in', 'true');
                    console.log("✅ User Logged In:", user.email);
                } else {
                    localStorage.removeItem('titan_user_profile');
                    localStorage.setItem('titan_logged_in', 'false');
                    console.log("ℹ️ User Logged Out");
                }
            });

        } catch (err) {
            console.error("❌ Firebase Auth Error:", err);
        }
    }

    // Global Google Login Function (Aap ise kisi bhi button par onclick="handleGoogleLogin()" laga sakte hain)
    window.handleGoogleLogin = async function () {
        if (!authInstance || !googleProviderInstance) {
            await initFirebase();
        }

        try {
            console.log("🔑 Opening Google Sign-In Popup...");
            const result = await authInstance.signInWithPopup(googleProviderInstance);
            const user = result.user;
            alert("Welcome " + user.displayName + "! Successfully logged in.");
        } catch (error) {
            console.error("❌ Google Login Failed:", error);
            alert("Google Login Error: " + error.message);
        }
    };

    // Logout Function
    window.handleTitanLogout = function () {
        if (authInstance) {
            authInstance.signOut().then(() => {
                alert("Logged out successfully!");
                location.reload();
            });
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        initFirebase();
    });
})();
