/* ==========================================
   TITAN AI — MAIN APPLICATION CONTROLLER
   Version: 1.0
   ========================================== */

(() => {
    "use strict";

    const HOME_PAGE = "/pages/home.html";

    async function loadHomePage() {

        const app = document.getElementById("app-content");

        if (!app) {
            console.error("TITAN AI: app-content not found");
            return;
        }

        try {

            const response = await fetch(HOME_PAGE, {
                cache: "no-cache"
            });

            if (!response.ok) {
                throw new Error("Home Page Not Found");
            }

            const html = await response.text();

            const parser = new DOMParser();

            const page = parser.parseFromString(
                html,
                "text/html"
            );

            const homeContent = page.querySelector("#titan-app");

            if (!homeContent) {
                throw new Error("Home Content Missing");
            }

            // Load Home Page
            app.innerHTML = homeContent.innerHTML;

            // Initialize interactions after dynamic Home markup is mounted.
            window.initTitanHome?.();

            // Load page CSS
            const cssFiles = page.querySelectorAll(
                'link[rel="stylesheet"]'
            );

            cssFiles.forEach(link => {

                const href = link.getAttribute("href");

                if (!href) return;

                const exists = document.querySelector(
                    `link[rel="stylesheet"][href="${href}"]`
                );

                if (!exists) {

                    const newLink = document.createElement("link");

                    newLink.rel = "stylesheet";
                    newLink.href = href;

                    document.head.appendChild(newLink);
                }

            });

            // Support CSS currently written inside home.html
            page.querySelectorAll("style").forEach(style => {
                const newStyle = document.createElement("style");
                newStyle.textContent = style.textContent;
                document.head.appendChild(newStyle);
            });

            console.log("TITAN AI Home Loaded Successfully");

        } catch (error) {

            console.error("TITAN AI Error:", error);

            app.innerHTML = `
                <div style="
                    min-height:70vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    flex-direction:column;
                    text-align:center;
                    padding:20px;
                    color:white;
                ">
                    <h1 style="color:#E9C46A">
                        TITAN AI
                    </h1>

                    <p>
                        Home Page Loading Failed
                    </p>

                    <button id="retryHome" style="
                        padding:12px 25px;
                        background:#8052E8;
                        border:none;
                        border-radius:25px;
                        color:white;
                        cursor:pointer;
                    ">
                        Try Again
                    </button>
                </div>
            `;

            document.getElementById("retryHome")
                ?.addEventListener("click", loadHomePage);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            loadHomePage
        );
    } else {
        loadHomePage();
    }

})();
