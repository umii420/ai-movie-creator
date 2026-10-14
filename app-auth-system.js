/**
 * =========================================================
 * PLATFORM: TITAN AI AUTHENTICATION SYSTEM (HTML LINKED & CACHE-FREE)
 * FILE: app-auth-system.js
 * VERSION: v3.0.0
 * =========================================================
 */

(function () {
    'use strict';

    console.log("⚡ Titan AI Auth Engine v3.0 Loaded Successfully!");

    // Inject Auth Styles dynamically to ensure UI loads even if CSS is missing
    if (!document.getElementById('titan-auth-styles-v3')) {
        const authStyle = document.createElement('style');
        authStyle.id = 'titan-auth-styles-v3';
        authStyle.innerHTML = `
            :root {
                --auth-bg: #ffffff;
                --auth-card-bg: #f8fafc;
                --auth-text: #0f172a;
                --auth-muted: #64748b;
                --auth-border: rgba(226, 232, 240, 0.8);
            }

            body.dark-mode {
                --auth-bg: #121212;
                --auth-card-bg: #1e1e1e;
                --auth-text: #f8fafc;
                --auth-muted: #a1a1aa;
                --auth-border: rgba(255, 255, 255, 0.1);
            }

            .titan-auth-modal {
                position: fixed !important;
                top: 0 !important; left: 0 !important;
                width: 100vw !important; height: 100vh !important;
                background: rgba(0, 0, 0, 0.75) !important;
                backdrop-filter: blur(8px) !important;
                z-index: 9999999999 !important;
                display: none;
                align-items: center !important;
                justify-content: center !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
            }
            .titan-auth-modal.active { display: flex !important; }

            .auth-card {
                background: var(--auth-bg);
                color: var(--auth-text);
                width: 90%;
                max-width: 380px;
                border-radius: 24px;
                padding: 32px 24px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.35);
                text-align: center;
                position: relative;
                animation: authPopIn 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
            }

            @keyframes authPopIn {
                from { transform: scale(0.85); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            .auth-close-btn {
                position: absolute;
                top: 16px; right: 16px;
                background: transparent;
                border: none;
                font-size: 1.25rem;
                color: var(--auth-muted);
                cursor: pointer;
            }

            .auth-title {
                font-size: 1.4rem;
                font-weight: 800;
                margin-bottom: 6px;
                letter-spacing: -0.3px;
            }

            .auth-subtitle {
                font-size: 0.82rem;
                color: var(--auth-muted);
                margin-bottom: 22px;
                line-height: 1.4;
            }

            .social-btn-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .btn-social {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                width: 100%;
                padding: 13px 16px;
                border-radius: 14px;
                font-size: 0.92rem;
                font-weight: 700;
                cursor: pointer;
                border: 1px solid var(--auth-border);
                transition: transform 0.15s ease, opacity 0.15s ease;
            }
            .btn-social:active { transform: scale(0.97); opacity: 0.9; }

            .btn-google { background: #ffffff; color: #000000; border-color: #cbd5e1; }
            .btn-tiktok { background: #000000; color: #ffffff; border-color: #000000; }
            .btn-facebook { background: #1877f2; color: #ffffff; border-color: #1877f2; }
            .btn-instagram {
                background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                color: #ffffff;
                border-color: transparent;
            }

            .auth-footer-note {
                font-size: 0.72rem;
                color: var(--auth-muted);
                margin-top: 18px;
                line-height: 1.4;
            }
            .auth-footer-note a { color: #00b2ff; text-decoration: none; }
        `;
        document.head.appendChild(authStyle);
    }

    // Build UI Modal Component in DOM
    function buildAuthModal() {
        if (document.getElementById('titanAuthModal')) return;

        const modalDiv = document.createElement('div');
        modalDiv.id = 'titanAuthModal';
        modalDiv.className = 'titan-auth-modal';
        modalDiv.innerHTML = `
            <div class="auth-card">
                <button class="auth-close-btn" onclick="window.closeTitanAuth()"><i class="fa-solid fa-xmark"></i></button>
                
                <h2 class="auth-title">Log in to Titan AI</h2>
                <p class="auth-subtitle">Connect your account to upload videos, like, and sync profile.</p>

                <div class="social-btn-container">
                    <!-- 1. GOOGLE (Top Priority) -->
                    <button class="btn-social btn-google" onclick="window.titanLoginAction('Google')">
                        <i class="fa-brands fa-google" style="color: #ea4335; font-size: 1.15rem;"></i>
                        Continue with Google
                    </button>

                    <!-- 2. TIKTOK -->
                    <button class="btn-social btn-tiktok" onclick="window.titanLoginAction('TikTok')">
                        <i class="fa-brands fa-tiktok" style="font-size: 1.15rem;"></i>
                        Continue with TikTok
                    </button>

                    <!-- 3. FACEBOOK -->
                    <button class="btn-social btn-facebook" onclick="window.titanLoginAction('Facebook')">
                        <i class="fa-brands fa-facebook" style="font-size: 1.15rem;"></i>
                        Continue with Facebook
                    </button>

                    <!-- 4. INSTAGRAM -->
                    <button class="btn-social btn-instagram" onclick="window.titanLoginAction('Instagram')">
                        <i class="fa-brands fa-instagram" style="font-size: 1.15rem;"></i>
                        Continue with Instagram
                    </button>
                </div>

                <div class="auth-footer-note">
                    By continuing, you agree to Titan's <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }

    // Global Window Controllers for HTML & App Integration
    window.openTitanAuth = function() {
        const modal = document.getElementById('titanAuthModal');
        if (modal) {
            modal.classList.add('active');
        } else {
            buildAuthModal();
            document.getElementById('titanAuthModal')?.classList.add('active');
        }
    };

    window.closeTitanAuth = function() {
        document.getElementById('titanAuthModal')?.classList.remove('active');
    };

    // Simulated Real Login Action & HTML Profile Binding
    window.titanLoginAction = function(provider) {
        console.log(`🚀 Logging in via ${provider}...`);
        
        // Prompt user email/profile link simulation for instant connection
        const userGmail = prompt(`Enter your ${provider} account email or username to sync with Titan AI:`, "umarhayat@gmail.com");
        
        if (userGmail) {
            alert(`✅ Successfully connected with ${provider} (${userGmail})!`);
            window.closeTitanAuth();

            // Auto-sync profile info in HTML elements if present
            const profileNameHeader = document.querySelector('.prof-header h3, h3');
            if (profileNameHeader && provider === 'Google') {
                profileNameHeader.innerText = "UmAr WaRrAiCh (Synced)";
            }

            // Open main profile automatically after successful login
            if (window.openTitanMainProfile) {
                window.openTitanMainProfile();
            }
        }
    };

    // Auto-trigger modal on startup or when needed if not logged in
    document.addEventListener('DOMContentLoaded', function() {
        buildAuthModal();
        // Uncomment below line if you want login modal to pop up automatically when app opens:
        // window.openTitanAuth();
    });

    // Also run immediately if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        buildAuthModal();
    }
})();
