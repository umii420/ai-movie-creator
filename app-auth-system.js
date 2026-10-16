/**
 * TITAN AI MOVIE CREATOR - FIXED AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Auth System: Fixed Version Loaded");

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
    let isUnlocking = false;

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
            script.onerror = () => reject(new Error("SDK load failed."));
            document.head.appendChild(script);
        });
    }

    // Unlock the app
    window.unlockTitanApp = function (user) {
        if (isUnlocking) return;
        isUnlocking = true;

        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = "none";
            gate.remove();
        }

        if (user) {
            const userProfile = {
                name: user.displayName || "Titan Creator",
                email: user.email || "",
                photo: user.photoURL || ("https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || "User") + "&background=00b2ff&color=fff"),
                uid: user.uid,
                verified: true,
                joinedDate: new Date().toISOString()
            };

            localStorage.setItem("titan_user_profile", JSON.stringify(userProfile));
            localStorage.setItem("titan_logged_in", "true");
            console.log("✅ Unlocked:", userProfile.name);
        }
    };

    function showAuthGate() {
        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = "flex";
        }
    }

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

            // 1. Check redirect result first (most important after Google login)
            try {
                const result = await authInstance.getRedirectResult();
                if (result && result.user) {
                    window.unlockTitanApp(result.user);
                    return;
                }
            } catch (err) {
                console.log("No redirect result");
            }

            // 2. Listen for auth state
            authInstance.onAuthStateChanged(function (user) {
                if (user) {
                    window.unlockTitanApp(user);
                } else {
                    // Only show gate if we are sure user is not logged in
                    if (localStorage.getItem("titan_logged_in") !== "true") {
                        showAuthGate();
                    }
                }
            });

        } catch (error) {
            console.error("Firebase Error:", error);
            showAuthGate();
        }
    }

    // Google Login
    window.handleGoogleLogin = async function () {
        try {
            if (!authInstance) await initFirebase();

            if (authInstance && googleProviderInstance) {
                // Show loading state (optional)
                const btn = document.querySelector(".btn-google-gate");
                if (btn) {
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting...';
                    btn.disabled = true;
                }

                await authInstance.signInWithRedirect(googleProviderInstance);
            } else {
                alert("Please wait, system is loading...");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed. Please try again.");
            location.reload();
        }
    };

    // Logout
    window.handleTitanLogout = async function () {
        try {
            if (authInstance) await authInstance.signOut();
        } catch (e) {}
        
        localStorage.removeItem("titan_user_profile");
        localStorage.setItem("titan_logged_in", "false");
        location.reload();
    };

    // On page load
    document.addEventListener("DOMContentLoaded", function () {
        // Fast check
        if (localStorage.getItem("titan_logged_in") === "true") {
            hideAuthGate();
        } else {
            showAuthGate();
        }

        // Initialize Firebase
        initFirebase();
    });

})();
