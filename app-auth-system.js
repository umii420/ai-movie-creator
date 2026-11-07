/**
 * TITAN AI - STABLE AUTH (POPUP METHOD) + PROFILE FIX
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    // SPA routes may include this file again; initialize Firebase only once.
    if (window.__TITAN_AUTH_INITIALIZED__) return;
    window.__TITAN_AUTH_INITIALIZED__ = true;

    console.log("⚡ Titan Auth System: Popup + Profile Fixed");

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
    let profileDb = null;

    async function syncBasicProfile(user, localProfile) {
        if (!profileDb || !user) return;
        const ref = profileDb.collection('users').doc(user.uid);
        const snapshot = await ref.get();
        const now = window.firebase.firestore.FieldValue.serverTimestamp();
        const payload = {
            uid: user.uid,
            displayName: String(localProfile.name || user.displayName || 'Titan Creator').slice(0, 60),
            handle: String(localProfile.handle || ('@' + (user.email ? user.email.split('@')[0] : 'creator'))).slice(0, 30),
            photoURL: String(localProfile.photo || user.photoURL || '').slice(0, 2048),
            bio: String(localProfile.bio || 'Titan AI Creator').slice(0, 300),
            updatedAt: now
        };
        if (!snapshot.exists) payload.createdAt = now;
        await ref.set(payload, { merge: true });
    }

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

        // Clean handle from email or name
        let handle = "@" + (user.email ? user.email.split("@")[0] : (user.displayName || "creator").toLowerCase().replace(/\s+/g, ""));

        let previous = {};
        try { previous = JSON.parse(localStorage.getItem('titan_user_profile') || '{}') || {}; } catch (_) {}
        const profile = {
            ...previous,
            name: previous.name || user.displayName || 'Titan Creator',
            email: user.email || '',
            photo: previous.photo || user.photoURL || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'User') + '&background=00b2ff&color=fff'),
            uid: user.uid,
            handle: previous.handle || handle,
            bio: previous.bio || 'Titan AI Creator',
            followers: previous.followers || '0',
            following: previous.following || '0',
            likes: previous.likes || '0',
            verified: false,
            joinedDate: previous.joinedDate || new Date().toISOString()
        };

        localStorage.setItem('titan_user_profile', JSON.stringify(profile));
        localStorage.setItem('titan_logged_in', 'true');
        if (profileDb) syncBasicProfile(user, profile).catch(error => console.warn('TITAN profile cloud sync:', error));
        console.log("✅ Unlocked + Profile Saved:", profile.name);
    };

    async function initFirebase() {
        try {
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js");

            if (!window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig);
            }

            authInstance = window.firebase.auth();
            profileDb = window.firebase.firestore();
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