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
    let profileDb = null;\n    let firebaseInitPromise = null;

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

    function ensureGate() {
        if (document.getElementById("titanAuthGateOverlay")) return;
        const gate = document.createElement("div");
        gate.id = "titanAuthGateOverlay";
        gate.innerHTML = '<div class="titan-auth-card" role="dialog" aria-modal="true"><div class="titan-auth-mark"><i class="fa-solid fa-crown"></i></div><h2>Welcome to TITAN AI</h2><p>Sign in to upload videos, manage your creator profile, and save your work.</p><button class="btn-google-gate" type="button" onclick="handleGoogleLogin()"><i class="fa-brands fa-google"></i><span>Continue with Google</span></button><button class="titan-auth-guest" type="button">Continue as guest</button><small>Your account keeps your creator content connected to you.</small></div>';
        const style = document.createElement("style");
        style.id = "titan-auth-gate-style";
        style.textContent = "#titanAuthGateOverlay{position:fixed;inset:0;z-index:999999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(4,5,10,.78);backdrop-filter:blur(14px)}.titan-auth-card{width:min(100%,420px);padding:30px 24px;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:linear-gradient(145deg,#171923,#0b0c11);box-shadow:0 24px 80px rgba(0,0,0,.55);color:#fff;text-align:center;font-family:inherit}.titan-auth-mark{width:56px;height:56px;margin:0 auto 14px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#ff3434,#a20b16);font-size:22px}.titan-auth-card h2{margin:0 0 10px;font-size:24px;font-weight:800}.titan-auth-card p{margin:0 0 22px;color:#b9bac4;line-height:1.55}.btn-google-gate{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;border:0;border-radius:14px;background:#fff;color:#111;font-weight:800;cursor:pointer}.btn-google-gate:disabled{opacity:.65;cursor:wait}.titan-auth-guest{margin:14px 0 8px;background:transparent;border:0;color:#d4d5dc;padding:10px;cursor:pointer;font-weight:700}.titan-auth-card small{display:block;color:#858793;font-size:11px;line-height:1.5}";
        if (!document.getElementById(style.id)) document.head.appendChild(style);
        document.body.appendChild(gate);
        gate.querySelector(".titan-auth-guest").addEventListener("click", hideGate);
    }

    function hideGate() {
        const gate = document.getElementById("titanAuthGateOverlay");
        if (gate) {
            gate.style.display = "none";
            gate.remove();
        }
    }

    function showGate() {
        ensureGate();
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
        if (firebaseInitPromise) return firebaseInitPromise;
        firebaseInitPromise = (async () => {
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js");
            if (!window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig);
            authInstance = window.firebase.auth();
            profileDb = window.firebase.firestore();
            googleProviderInstance = new window.firebase.auth.GoogleAuthProvider();
            googleProviderInstance.setCustomParameters({ prompt: "select_account" });
            authInstance.onAuthStateChanged(user => {
                if (user) window.unlockTitanApp(user);
                else {
                    localStorage.removeItem("titan_user_profile");
                    localStorage.setItem("titan_logged_in", "false");
                    showGate();
                }
            });
            return authInstance;
        })().catch(error => {
            firebaseInitPromise = null;
            console.error("Firebase Error:", error);
            showGate();
            throw error;
        });
        return firebaseInitPromise;
    }

    window.handleGoogleLogin = async function () {
        const btn = document.querySelector(".btn-google-gate");
        const card = document.querySelector(".titan-auth-card");
        let status = card && card.querySelector(".titan-auth-status");
        if (card && !status) {
            status = document.createElement("p");
            status.className = "titan-auth-status";
            status.style.cssText = "margin:12px 0 0;color:#ffb7b7;font-size:13px;line-height:1.5";
            card.appendChild(status);
        }
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Connecting to Google...</span>';
        }
        if (status) status.textContent = "Opening secure Google sign-in…";

        try {
            await initFirebase();
            if (!authInstance || !googleProviderInstance) throw new Error("Firebase Authentication did not initialize.");

            const result = await authInstance.signInWithPopup(googleProviderInstance);
            if (result && result.user) {
                window.unlockTitanApp(result.user);
                if (status) status.textContent = "Signed in successfully.";
            }
        } catch (error) {
            console.error("TITAN Google Login Error:", error);
            const message = error && error.code
                ? error.code + (error.message ? ": " + error.message : "")
                : (error.message || "Unknown login error");
            if (status) status.textContent = "Sign-in failed: " + message;
            if (error && error.code === "auth/popup-blocked") {
                try {
                    await authInstance.signInWithRedirect(googleProviderInstance);
                    return;
                } catch (redirectError) {
                    console.error("TITAN redirect login error:", redirectError);
                    if (status) status.textContent = "Sign-in failed: " + (redirectError.message || redirectError.code || "Redirect error");
                }
            }
        } finally {
            if (btn && document.contains(btn)) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-brands fa-google"></i><span>Continue with Google</span>';
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