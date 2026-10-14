/**
 * =========================================================
 * TITAN AI MOVIE CREATOR - APP AUTH SYSTEM
 * FILE: app-auth-system.js
 * =========================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase Configuration Keys
const firebaseConfig = {
  apiKey: "AIzaSyAbVtYa7D6TcGnn8_UQno0l1MEKIBjMBDA",
  authDomain: "ai-movie-creator-e366c.firebaseapp.com",
  projectId: "ai-movie-creator-e366c",
  storageBucket: "ai-movie-creator-e366c.firebasestorage.app",
  messagingSenderId: "999640101244",
  appId: "1:999640101244:web:530e0dcc86e768747234f9",
  measurementId: "G-QQ145DMTQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Render Google Login Button in Header Container
function renderLoginButton(user) {
    const container = document.getElementById('titanLoginContainer');
    if (!container) return;

    if (user) {
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; background: #1e293b; padding: 6px 14px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);">
                <img src="${user.photoURL || 'https://www.svgrepo.com/show/508699/user-circle.svg'}" style="width: 26px; height: 26px; border-radius: 50%;" alt="User">
                <span style="font-size: 0.85rem; font-weight: 600; color: #fff;">${user.displayName || 'User'}</span>
                <button onclick="window.logoutTitanUser()" style="background: none; border: none; color: #f87171; font-weight: 700; cursor: pointer; font-size: 0.8rem; margin-left: 6px;">Logout</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button onclick="window.handleGoogleLogin()" style="display: flex; align-items: center; gap: 8px; background: #ffffff; color: #000000; border: none; padding: 10px 18px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s;">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google">
                Continue with Google
            </button>
        `;
    }
}

// Google Login Handler
window.handleGoogleLogin = async function() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        alert(`Welcome ${result.user.displayName}! Successfully logged in.`);
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed: " + error.message);
    }
};

// Logout Handler
window.logoutTitanUser = async function() {
    try {
        await signOut(auth);
        alert("Logged out successfully.");
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

// Listen to Auth Changes
onAuthStateChanged(auth, (user) => {
    renderLoginButton(user);
});
