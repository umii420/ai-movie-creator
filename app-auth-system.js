/**
 * TITAN AI MOVIE CREATOR - REAL GOOGLE AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Clean Google Auth Active!");

    // فائر بیس کی اپنی کنفیگریشن یہاں رکھیں
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

            // یوزر سیشن ہینڈلر
            authInstance.onAuthStateChanged((user) => {
                if (user) {
                    const userProfile = {
                        name: user.displayName || "Titan Creator",
                        email: user.email,
                        photo: user.photoURL || "https://picsum.photos/200",
                        uid: user.uid,
                        verified: true
                    };

                    localStorage.setItem('titan_user_profile', JSON.stringify(userProfile));
                    localStorage.setItem('titan_logged_in', 'true');
                    console.log("✅ Google Logged In:", user.email);
                } else {
                    localStorage.removeItem('titan_user_profile');
                    localStorage.setItem('titan_logged_in', 'false');
                }
            });

        } catch (err) {
            console.error("❌ Firebase Auth Error:", err);
        }
    }

    // رئیل گوگل سائن ان فنکشن
    window.handleGoogleLogin = async function () {
        if (!authInstance || !googleProviderInstance) {
            await initFirebase();
        }

        try {
            console.log("🔑 Opening Real Google Sign-In...");
            const result = await authInstance.signInWithPopup(googleProviderInstance);
            const user = result.user;
            alert("خوش آمدید " + user.displayName + "! آپ کا گوگل اکاؤنٹ سائن ان ہو چکا ہے۔");
            location.reload();
        } catch (error) {
            console.error("❌ Google Login Error:", error);
            alert("Google Login Error: " + error.message);
        }
    };

    // لاگ آؤٹ فنکشن
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
