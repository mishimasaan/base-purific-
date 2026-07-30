document.addEventListener("DOMContentLoaded",()=>{

    const menuButton=document.querySelector(".menu-toggle");

    const nav=document.querySelector(".nav-links");

    if(!menuButton||!nav) return;

    menuButton.addEventListener("click",()=>{

        nav.classList.toggle("active");

        menuButton.classList.toggle("active");

    });

    nav.querySelectorAll("a").forEach(link=>{

        link.addEventListener("click",()=>{

            nav.classList.remove("active");

            menuButton.classList.remove("active");

        });

    });

});