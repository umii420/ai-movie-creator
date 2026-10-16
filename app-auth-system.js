/**
 * TITAN AI MOVIE CREATOR - CLEAN AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Auth System: Clean Version Loaded");

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
                if (existing.dataset.loaded === "true") {
                    resolve();
                } else {
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
            script.onerror = () => reject(new Error("SDK load failed."));
            document.head.appendChild(script);
        });
    }

    // Unlock app after successful login
    window.unlockTitanApp = function (user) {
        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = "none";
            gate.remove();
        }

        const userProfile = {
            name: user.displayName || "Titan Creator",
            email: user.email || "",
            photo: user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || "User") + "&background=00b2ff&color=fff",
            uid: user.uid,
            verified: true,
            joinedDate: new Date().toISOString()
        };

        localStorage.setItem("titan_user_profile", JSON.stringify(userProfile));
        localStorage.setItem("titan_logged_in", "true");
        console.log("✅ Titan App Unlocked:", userProfile.name);
    };

    // Show Auth Gate
    function showAuthGate() {
        let gate = document.getElementById("titanAuthGateOverlay");
        if (!gate) return;

        gate.style.display = "flex";
    }

    // Hide Auth Gate
    function hideAuthGate() {
        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = "none";
            gate.remove();
        }
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
            googleProviderInstance.setCustomParameters({
                prompt: "select_account"
            });

            // Check if user came back from redirect
            const result = await authInstance.getRedirectResult().catch(() => null);
            if (result && result.user) {
                window.unlockTitanApp(result.user);
                return;
            }

            // Listen for auth state changes
            authInstance.onAuthStateChanged(function (user) {
                if (user) {
                    window.unlockTitanApp(user);
                } else {
                    // User not logged in
                    localStorage.removeItem("titan_user_profile");
                    localStorage.setItem("titan_logged_in", "false");
                    showAuthGate();
                }
            });

        } catch (error) {
            console.error("Firebase Init Error:", error);
            showAuthGate();
        }
    }

    // Google Login Button
    window.handleGoogleLogin = async function () {
        try {
            if (!authInstance) await initFirebase();

            if (authInstance && googleProviderInstance) {
                await authInstance.signInWithRedirect(googleProviderInstance);
            } else {
                alert("Authentication system is loading. Please try again in a moment.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed. Please try again.");
        }
    };

    // Logout
    window.handleTitanLogout = async function () {
        try {
            if (authInstance) {
                await authInstance.signOut();
            }
            localStorage.removeItem("titan_user_profile");
            localStorage.setItem("titan_logged_in", "false");
            location.reload();
        } catch (error) {
            console.error("Logout Error:", error);
            localStorage.removeItem("titan_user_profile");
            localStorage.setItem("titan_logged_in", "false");
            location.reload();
        }
    };

    // On page load
    document.addEventListener("DOMContentLoaded", function () {
        // First check localStorage for faster experience
        if (localStorage.getItem("titan_logged_in") === "true") {
            hideAuthGate();
        } else {
            showAuthGate();
        }

        // Then initialize real Firebase
        initFirebase();
    });

})();
