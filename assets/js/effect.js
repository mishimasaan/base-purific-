document.addEventListener("DOMContentLoaded", () => {

    const dropdown = document.querySelector(".catalog-sort");
    const sidebar = document.querySelector(".sidebar");
    const filtersToggle = document.querySelector(".filters-toggle");
    const overlay = document.querySelector(".sidebar-overlay");

    if (dropdown) {

        const toggle = dropdown.querySelector(".sort-toggle");
        const current = toggle.querySelector("span");
        const options = dropdown.querySelectorAll(".sort-menu button");

        toggle.addEventListener("click", e => {

            e.stopPropagation();

            dropdown.classList.toggle("open");

        });

        options.forEach(option => {

            option.addEventListener("click", () => {

                options.forEach(btn => btn.classList.remove("active"));

                option.classList.add("active");

                current.textContent = option.textContent;

                dropdown.classList.remove("open");

                document.dispatchEvent(new CustomEvent("sortChange", {
                    detail: {
                        sort: option.dataset.sort
                    }
                }));

            });

        });

    }

    if (sidebar && filtersToggle) {

        filtersToggle.addEventListener("click", e => {

            e.stopPropagation();

            sidebar.classList.toggle("open");

            overlay?.classList.toggle("open");

        });

    }

    document.addEventListener("click", e => {

        if (dropdown && !dropdown.contains(e.target)) {

            dropdown.classList.remove("open");

        }

        if (sidebar &&
            !sidebar.contains(e.target) &&
            filtersToggle &&
            !filtersToggle.contains(e.target)) {

            sidebar.classList.remove("open");

            overlay?.classList.remove("open");

        }

    });

    overlay?.addEventListener("click", () => {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    });

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            dropdown?.classList.remove("open");

            sidebar?.classList.remove("open");

            overlay?.classList.remove("open");

        }

    });

});