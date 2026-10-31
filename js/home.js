/* ==========================================
   TITAN AI — HOME INTERACTIONS
   Search, category filters and upload menu
   ========================================== */
(() => {
    "use strict";

    function initTitanHome() {
        const root = document.getElementById("titan-app");
        if (!root || root.dataset.homeInteractionsReady === "true") return;
        root.dataset.homeInteractionsReady = "true";

        const searchInput = root.querySelector("#titanSearch");
        const searchButton = searchInput?.parentElement?.querySelector("button");
        const categoryButtons = [...root.querySelectorAll(".category-chip")];
        const cards = [...root.querySelectorAll(".featured-card, .recommended-card")];
        const refreshButton = root.querySelector(".refresh-button");
        const uploadMenu = root.querySelector(".upload-menu");
        let activeCategory = "all";

        let emptyState = root.querySelector("#titan-search-empty");
        if (!emptyState) {
            emptyState = document.createElement("p");
            emptyState.id = "titan-search-empty";
            emptyState.setAttribute("role", "status");
            emptyState.textContent = "No videos found. Try another search.";
            emptyState.style.cssText = "display:none;grid-column:1/-1;padding:24px;text-align:center;color:#999aaa;";
            root.querySelector(".recommended-grid")?.appendChild(emptyState);
        }

        function filterCards() {
            const query = (searchInput?.value || "").trim().toLocaleLowerCase();
            let visibleCount = 0;

            cards.forEach(card => {
                const category = (card.dataset.category || "").toLowerCase();
                const searchableText = (card.textContent || "").toLocaleLowerCase();
                const matchesCategory = activeCategory === "all" || category === activeCategory;
                const matchesSearch = !query || searchableText.includes(query);
                const visible = matchesCategory && matchesSearch;
                card.style.display = visible ? "" : "none";
                if (visible) visibleCount += 1;
            });

            if (emptyState) emptyState.style.display = visibleCount ? "none" : "block";
        }

        searchInput?.addEventListener("input", filterCards);
        searchInput?.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                filterCards();
                root.querySelector("#recommended")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
        searchButton?.addEventListener("click", () => {
            filterCards();
            root.querySelector("#recommended")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        categoryButtons.forEach(button => {
            button.addEventListener("click", () => {
                activeCategory = (button.dataset.category || "all").toLowerCase();
                categoryButtons.forEach(item => {
                    const active = item === button;
                    item.classList.toggle("active", active);
                    item.setAttribute("aria-pressed", String(active));
                });
                filterCards();
            });
            button.setAttribute("aria-pressed", String(button.classList.contains("active")));
        });

        refreshButton?.addEventListener("click", () => {
            refreshButton.classList.remove("is-refreshing");
            void refreshButton.offsetWidth;
            refreshButton.classList.add("is-refreshing");
            window.setTimeout(() => refreshButton.classList.remove("is-refreshing"), 650);
        });

        document.addEventListener("click", event => {
            if (uploadMenu?.open && !uploadMenu.contains(event.target)) {
                uploadMenu.open = false;
            }
        });
    }

    window.initTitanHome = initTitanHome;
})();
