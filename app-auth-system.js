/**
 * TITAN AI MOVIE CREATOR
 * Firebase Authentication — Vercel
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Firebase Auth Initialized");

    const firebaseConfig = {
        apiKey: "AIzaSyB3OBHZ0XsaHO6Wld097gtvUK44JW2BBTQ",
        authDomain: "titan-ai-2ed23.firebaseapp.com",
        projectId: "titan-ai-2ed23",
        storageBucket: "titan-ai-2ed23.firebasestorage.app",
        messagingSenderId: "953003695391",
        appId: "1:953003695391:web:fd85e69723a0cdee96642a",
        measurementId: "G-829X9X9W02"
    };

    let authInstance = null;
    let googleProviderInstance = null;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector('script[src="' + src + '"]');
            if (existing) {
                if (existing.dataset.loaded === "true") resolve();
                else {
                    existing.addEventListener("load", resolve, { once: true });
                    existing.addEventListener("error", reject, { once: true });
                }
                return;
            }
            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = () => {
                script.dataset.loaded = "true";
                resolve();
            };
            script.onerror = () => reject(new Error("Firebase SDK failed to load."));
            document.head.appendChild(script);
        });
    }

    // Direct Hide/Show Gate Overlay Function
    window.checkAuthGateState = function (isLoggedIn) {
        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = isLoggedIn ? "none" : "flex";
        }
    };

    function saveUserProfile(user) {
        if (!user) return;
        const userProfile = {
            name: user.displayName || "Titan Creator",
            email: user.email || "",
            photo: user.photoURL || "https://picsum.photos/200",
            uid: user.uid,
            verified: Boolean(user.emailVerified),
            joinedDate: new Date().toISOString()
        };

        localStorage.setItem("titan_user_profile", JSON.stringify(userProfile));
        localStorage.setItem("titan_logged_in", "true");
        window.checkAuthGateState(true);
    }

    async function initFirebase() {
        try {
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js");

            if (!window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig);
            }

            authInstance = window.firebase.auth();
            googleProviderInstance = new window.firebase.auth.GoogleAuthProvider();
            googleProviderInstance.setCustomParameters({ prompt: "select_account" });

            // Handle Redirect Result
            authInstance.getRedirectResult().then((result) => {
                if (result && result.user) {
                    saveUserProfile(result.user);
                }
            }).catch((err) => console.error("Redirect Result Error:", err));

            // Realtime Auth State Listener
            authInstance.onAuthStateChanged(function (user) {
                if (user) {
                    saveUserProfile(user);
                } else if (localStorage.getItem("titan_logged_in") !== "true") {
                    window.checkAuthGateState(false);
                }
            });

        } catch (error) {
            console.error("Firebase Init Error:", error);
        }
    }

    window.handleGoogleLogin = async function () {
        try {
            await initFirebase();
            if (authInstance && googleProviderInstance) {
                await authInstance.signInWithRedirect(googleProviderInstance);
            }
        } catch (error) {
            alert("Google Login Error: " + error.message);
        }
    };

    window.handleTitanLogout = async function () {
        if (authInstance) await authInstance.signOut();
        localStorage.removeItem("titan_user_profile");
        localStorage.setItem("titan_logged_in", "false");
        window.checkAuthGateState(false);
        location.reload();
    };

    document.addEventListener("DOMContentLoaded", function () {
        // Fast Check from LocalStorage before Firebase loads
        const loggedIn = localStorage.getItem("titan_logged_in") === "true";
        window.checkAuthGateState(loggedIn);
        initFirebase();
    });

})();
