'use strict';


document.addEventListener("DOMContentLoaded", () => {

    const thumbnailsContainer =
        document.getElementById("product-thumbnails");

    const mainImage =
        document.getElementById("product-main-image");

    const galleryUp =
        document.getElementById("product-gallery-up");

    const galleryDown =
        document.getElementById("product-gallery-down");

    const zoomButton =
        document.getElementById("product-zoom-button");

    const relatedProducts =
        document.getElementById("related-products");

    const relatedPrevious =
        document.getElementById("related-products-previous");

    const relatedNext =
        document.getElementById("related-products-next");


    thumbnailsContainer?.addEventListener("click", event => {

        const thumbnail =
            event.target.closest(".product-thumbnail");

        if(!thumbnail || !mainImage) return;

        const thumbnailImage =
            thumbnail.querySelector("img");

        const imageSource =
            thumbnail.dataset.image ||
            thumbnailImage?.src;

        if(!imageSource) return;

        mainImage.classList.add("is-changing");

        window.setTimeout(() => {

            mainImage.src = imageSource;

            if(thumbnailImage?.alt){

                mainImage.alt = thumbnailImage.alt;

            }

            mainImage.classList.remove("is-changing");

        }, 130);

        thumbnailsContainer
            .querySelectorAll(".product-thumbnail")
            .forEach(item => {

                item.classList.remove("active");
                item.setAttribute("aria-current", "false");

            });

        thumbnail.classList.add("active");
        thumbnail.setAttribute("aria-current", "true");

    });


    function scrollThumbnails(direction){

        if(!thumbnailsContainer) return;

        const thumbnail =
            thumbnailsContainer.querySelector(".product-thumbnail");

        const mobile =
            window.matchMedia("(max-width:768px)").matches;

        const size = thumbnail
            ? mobile
                ? thumbnail.offsetWidth + 10
                : thumbnail.offsetHeight + 12
            : 80;

        thumbnailsContainer.scrollBy({

            left:mobile ? size * direction : 0,

            top:mobile ? 0 : size * direction,

            behavior:"smooth"

        });

    }


    galleryUp?.addEventListener("click", () => {

        scrollThumbnails(-1);

    });


    galleryDown?.addEventListener("click", () => {

        scrollThumbnails(1);

    });


    document.addEventListener("click", event => {

        const header =
            event.target.closest(".product-detail-header");

        if(!header) return;

        const contentId =
            header.getAttribute("aria-controls");

        const content =
            document.getElementById(contentId);

        if(!content) return;

        const expanded =
            header.getAttribute("aria-expanded") === "true";

        header.setAttribute(
            "aria-expanded",
            String(!expanded)
        );

        if(expanded){

            content.style.maxHeight =
                `${content.scrollHeight}px`;

            requestAnimationFrame(() => {

                content.style.maxHeight = "0px";
                content.style.opacity = "0";
                content.style.paddingBottom = "0px";

            });

        }else{

            content.style.opacity = "1";
            content.style.paddingBottom = "";

            content.style.maxHeight =
                `${content.scrollHeight}px`;

            window.setTimeout(() => {

                content.style.maxHeight = "none";

            }, 300);

        }

    });


    function prepareDetails(){

        document
            .querySelectorAll(".product-detail-header")
            .forEach(header => {

                const contentId =
                    header.getAttribute("aria-controls");

                const content =
                    document.getElementById(contentId);

                if(!content) return;

                content.style.overflow = "hidden";

                content.style.transition =
                    "max-height .3s ease, opacity .2s ease, padding .3s ease";

                const expanded =
                    header.getAttribute("aria-expanded") !== "false";

                if(expanded){

                    content.style.maxHeight = "none";
                    content.style.opacity = "1";

                }else{

                    content.style.maxHeight = "0px";
                    content.style.opacity = "0";
                    content.style.paddingBottom = "0px";

                }

            });

    }


    function scrollRelated(direction){

        if(!relatedProducts) return;

        const card =
            relatedProducts.querySelector(".product-card");

        if(!card) return;

        const styles =
            window.getComputedStyle(relatedProducts);

        const gap =
            parseFloat(styles.gap) || 20;

        relatedProducts.scrollBy({

            left:(card.offsetWidth + gap) * direction,

            behavior:"smooth"

        });

    }


    relatedPrevious?.addEventListener("click", () => {

        scrollRelated(-1);

    });


    relatedNext?.addEventListener("click", () => {

        scrollRelated(1);

    });


    function closeZoom(){

        const modal =
            document.querySelector(".product-zoom-modal");

        if(!modal) return;

        modal.classList.remove("active");

        document.body.classList.remove(
            "product-zoom-open"
        );

        window.setTimeout(() => {

            modal.remove();

        }, 250);

    }


    function openZoom(){

        if(
            !mainImage ||
            !mainImage.getAttribute("src")
        ){

            return;

        }

        closeZoom();

        const modal =
            document.createElement("div");

        modal.className = "product-zoom-modal";

        const backdrop =
            document.createElement("button");

        backdrop.type = "button";
        backdrop.className = "product-zoom-backdrop";
        backdrop.setAttribute(
            "aria-label",
            "Fechar imagem ampliada"
        );

        const dialog =
            document.createElement("div");

        dialog.className = "product-zoom-dialog";

        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute(
            "aria-label",
            "Imagem ampliada do produto"
        );

        const closeButton =
            document.createElement("button");

        closeButton.type = "button";
        closeButton.className = "product-zoom-close";
        closeButton.setAttribute(
            "aria-label",
            "Fechar imagem ampliada"
        );

        closeButton.textContent = "×";

        const image =
            document.createElement("img");

        image.src = mainImage.src;

        image.alt =
            mainImage.alt ||
            "Imagem ampliada do produto";

        dialog.appendChild(closeButton);
        dialog.appendChild(image);

        modal.appendChild(backdrop);
        modal.appendChild(dialog);

        document.body.appendChild(modal);

        document.body.classList.add(
            "product-zoom-open"
        );

        requestAnimationFrame(() => {

            modal.classList.add("active");

        });

        closeButton.addEventListener(
            "click",
            closeZoom
        );

        backdrop.addEventListener(
            "click",
            closeZoom
        );

        closeButton.focus();

    }


    zoomButton?.addEventListener(
        "click",
        openZoom
    );


    document.addEventListener("keydown", event => {

        if(event.key === "Escape"){

            closeZoom();

        }

    });


    function prepareImages(){

        document
            .querySelectorAll(
                ".product-thumbnail img, .related-products img"
            )
            .forEach(image => {

                if(image.complete){

                    image.classList.add("is-loaded");

                    return;

                }

                image.addEventListener(
                    "load",
                    () => {

                        image.classList.add("is-loaded");

                    },
                    {
                        once:true
                    }
                );

            });

    }


    function prepareVisuals(){

        prepareDetails();
        prepareImages();

    }


    document.addEventListener(
        "product:rendered",
        prepareVisuals
    );


    prepareVisuals();

});