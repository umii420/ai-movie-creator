/**
 * TITAN AI MOVIE CREATOR
 * Firebase Authentication — Vercel
 * FILE: app-auth-system.js
 */

(function () {
    'use strict';

    console.log("⚡ Titan Firebase Auth Initialized");

    // 1. Original Firebase Project Configuration
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
    let initializationPromise = null;

    // 2. Load Firebase SDK only once
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(
                'script[src="' + src + '"]'
            );

            if (existing) {
                if (existing.dataset.loaded === "true") {
                    resolve();
                } else {
                    existing.addEventListener("load", resolve, {
                        once: true
                    });
                    existing.addEventListener("error", reject, {
                        once: true
                    });
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

            script.onerror = () => {
                reject(new Error("Firebase SDK could not load."));
            };

            document.head.appendChild(script);
        });
    }

    // 3. Update Login Gate
    function checkAuthGateState(isLoggedIn) {
        const gate = document.getElementById(
            "titanAuthGateOverlay"
        );

        if (gate) {
            gate.style.display = isLoggedIn ? "none" : "flex";
        }
    }

    // 4. Save Real Firebase User Profile
    function saveUserProfile(user) {
        if (!user) return;

        const userProfile = {
            name: user.displayName || "Titan Creator",
            email: user.email || "",
            photo: user.photoURL || "https://picsum.photos/200",
            uid: user.uid,
            verified: Boolean(user.emailVerified),
            joinedDate: user.metadata &&
                user.metadata.creationTime
                ? user.metadata.creationTime
                : new Date().toISOString()
        };

        localStorage.setItem(
            "titan_user_profile",
            JSON.stringify(userProfile)
        );

        localStorage.setItem("titan_logged_in", "true");
    }

    // 5. Initialize Firebase
    async function initFirebase() {
        if (initializationPromise) {
            return initializationPromise;
        }

        initializationPromise = (async function () {
            try {
                await loadScript(
                    "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
                );

                await loadScript(
                    "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"
                );

                if (!window.firebase) {
                    throw new Error("Firebase SDK is unavailable.");
                }

                if (!window.firebase.apps.length) {
                    window.firebase.initializeApp(firebaseConfig);
                }

                authInstance = window.firebase.auth();

                googleProviderInstance =
                    new window.firebase.auth.GoogleAuthProvider();

                googleProviderInstance.setCustomParameters({
                    prompt: "select_account"
                });

                // Observe the real Firebase authentication state.
                authInstance.onAuthStateChanged(
                    function (user) {
                        if (user) {
                            saveUserProfile(user);
                            checkAuthGateState(true);
                        } else {
                            localStorage.removeItem(
                                "titan_user_profile"
                            );

                            localStorage.setItem(
                                "titan_logged_in",
                                "false"
                            );

                            checkAuthGateState(false);
                        }
                    },
                    function (error) {
                        console.error(
                            "Firebase Auth State Error:",
                            error
                        );
                    }
                );

                // Complete a Google redirect sign-in if one was started.
                try {
                    const result =
                        await authInstance.getRedirectResult();

                    if (result && result.user) {
                        saveUserProfile(result.user);
                        checkAuthGateState(true);
                    }
                } catch (error) {
                    console.error(
                        "Google Redirect Error:",
                        error
                    );
                }

                console.log("✅ Firebase Authentication Ready");

            } catch (error) {
                initializationPromise = null;

                console.error(
                    "Firebase Initialization Error:",
                    error
                );

                checkAuthGateState(false);
                throw error;
            }
        })();

        return initializationPromise;
    }

    // 6. Google Login
    window.handleGoogleLogin = async function () {
        try {
            await initFirebase();

            if (!authInstance || !googleProviderInstance) {
                throw new Error(
                    "Firebase Authentication is not ready."
                );
            }

            // Redirect is more reliable on many mobile browsers.
            await authInstance.signInWithRedirect(
                googleProviderInstance
            );

        } catch (error) {
            console.error("Google Login Error:", error);

            alert(
                "Google Login Error: " +
                (error.message || "Please try again.")
            );
        }
    };

    // 7. Email/Password Login
    // Call this function from your existing email login form if needed.
    window.handleTitanEmailLogin = async function (
        email,
        password
    ) {
        try {
            await initFirebase();

            const result =
                await authInstance.signInWithEmailAndPassword(
                    email,
                    password
                );

            saveUserProfile(result.user);
            checkAuthGateState(true);

            return result.user;

        } catch (error) {
            console.error("Email Login Error:", error);

            alert(
                "Email Login Error: " +
                (error.message || "Please try again.")
            );

            throw error;
        }
    };

    // 8. Email/Password Registration
    window.handleTitanEmailSignup = async function (
        email,
        password
    ) {
        try {
            await initFirebase();

            const result =
                await authInstance.createUserWithEmailAndPassword(
                    email,
                    password
                );

            saveUserProfile(result.user);
            checkAuthGateState(true);

            return result.user;

        } catch (error) {
            console.error("Email Registration Error:", error);

            alert(
                "Registration Error: " +
                (error.message || "Please try again.")
            );

            throw error;
        }
    };

    // 9. Logout — always sign out of Firebase
    window.handleTitanLogout = async function () {
        try {
            await initFirebase();

            if (authInstance) {
                await authInstance.signOut();
            }

            localStorage.removeItem("titan_user_profile");
            localStorage.setItem("titan_logged_in", "false");

            alert("Logged out successfully!");
            location.reload();

        } catch (error) {
            console.error("Logout Error:", error);

            alert(
                "Logout Error: " +
                (error.message || "Please try again.")
            );
        }
    };

    // 10. Start on Page Load
    function startAuthSystem() {
        checkAuthGateState(
            localStorage.getItem("titan_logged_in") === "true"
        );

        initFirebase().catch(function () {
            console.error(
                "Titan Auth could not initialize."
            );
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            startAuthSystem,
            { once: true }
        );
    } else {
        startAuthSystem();
    }

})();
