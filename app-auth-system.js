/**
 * TITAN AI MOVIE CREATOR - SAFE AUTH SYSTEM
 * FILE: app-auth-system.js
 */

(function() {
    console.log("Titan Auth Module Initialized");

    // Function to handle Google Login safely
    window.handleGoogleLogin = function() {
        alert("Redirecting to Google Sign-In...");
        // Firebase Auth Popup Trigger
    };

    // Auto Render Button in Header Container
    document.addEventListener("DOMContentLoaded", function() {
        const container = document.getElementById('titanLoginContainer');
        if (container) {
            container.innerHTML = `
                <button onclick="window.handleGoogleLogin()" style="display: flex; align-items: center; gap: 8px; background: #ffffff; color: #000000; border: none; padding: 10px 18px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s;">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google">
                    Continue with Google
                </button>
            `;
        }
    });
})();
