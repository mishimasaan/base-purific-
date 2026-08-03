document.addEventListener("DOMContentLoaded", () => {

    fetch("assets/components/navbar.html")
    .then(response => response.text())
    .then(data => {

        const navbar = document.getElementById("navbar");

        if(!navbar) return;

        navbar.innerHTML = data;

        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        navbar.querySelectorAll(".nav-links a").forEach(link => {

            if(link.getAttribute("href") === currentPage){

                link.classList.add("active");

            }

        });

        const menuButton = navbar.querySelector(".menu-toggle");
        const nav = navbar.querySelector(".nav-links");

        if(!menuButton || !nav) return;

        menuButton.addEventListener("click", () => {

            nav.classList.toggle("active");
            menuButton.classList.toggle("active");

        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");
                menuButton.classList.remove("active");

            });

        });

    });

});