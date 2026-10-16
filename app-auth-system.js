/**
 * TITAN AI - STABLE AUTH (POPUP METHOD)
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Auth System: Popup Version");

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
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function hideGate() {
        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = "none";
            gate.remove();
        }
    }

    function showGate() {
        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = "flex";
        }
    }

    window.unlockTitanApp = function (user) {
        hideGate();

        if (!user) return;

        const profile = {
            name: user.displayName || "Titan Creator",
            email: user.email || "",
            photo: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=00b2ff&color=fff`,
            uid: user.uid,
            verified: true,
            joinedDate: new Date().toISOString()
        };

        localStorage.setItem("titan_user_profile", JSON.stringify(profile));
        localStorage.setItem("titan_logged_in", "true");
        console.log("✅ Unlocked:", profile.name);
    };

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

            authInstance.onAuthStateChanged((user) => {
                if (user) {
                    window.unlockTitanApp(user);
                } else {
                    localStorage.removeItem("titan_user_profile");
                    localStorage.setItem("titan_logged_in", "false");
                    showGate();
                }
            });

        } catch (error) {
            console.error("Firebase Error:", error);
            showGate();
        }
    }

    window.handleGoogleLogin = async function () {
        try {
            if (!authInstance) await initFirebase();

            const btn = document.querySelector(".btn-google-gate");
            if (btn) {
                btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Connecting...`;
                btn.disabled = true;
            }

            const result = await authInstance.signInWithPopup(googleProviderInstance);
            
            if (result && result.user) {
                window.unlockTitanApp(result.user);
            }

        } catch (error) {
            console.error("Login Error:", error);
            
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
                try {
                    await authInstance.signInWithRedirect(googleProviderInstance);
                } catch (err2) {
                    alert("Login failed. Please allow popups or try again.");
                    location.reload();
                }
            } else {
                alert("Login failed: " + (error.message || "Unknown error"));
                location.reload();
            }
        }
    };

    window.handleTitanLogout = async function () {
        try {
            if (authInstance) await authInstance.signOut();
        } catch (e) {}
        localStorage.removeItem("titan_user_profile");
        localStorage.setItem("titan_logged_in", "false");
        location.reload();
    };

    document.addEventListener("DOMContentLoaded", () => {
        if (localStorage.getItem("titan_logged_in") === "true") {
            hideGate();
        } else {
            showGate();
        }
        initFirebase();
    });

})();
