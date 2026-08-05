'use strict';


const relatedProducts = document.querySelector("#related-products");
const breadcrumbProduct = document.querySelector("#breadcrumb-product");

const productCategory = document.querySelector("#product-category");
const productTitle = document.querySelector("#product-title");
const productSubtitle = document.querySelector("#product-subtitle");

const productPrice = document.querySelector("#product-price");
const productInstallment = document.querySelector("#product-installment");
const productAction = document.querySelector("#product-action");

const productMainImage = document.querySelector("#product-main-image");
const productThumbnails = document.querySelector("#product-thumbnails");

const productDescriptionText = document.querySelector(
    "#product-description-text"
);

const productSpecificationsList = document.querySelector(
    "#product-specifications-list"
);


let products = [];
let product = null;


document.addEventListener("DOMContentLoaded", init);


async function init(){

    try{

        await loadProducts();

        const id = Number(
            new URLSearchParams(window.location.search).get("id")
        );

        product = products.find(item => item.id === id);

        if(!product){

            renderProductNotFound();

            return;

        }

        document.title = `${product.name} | Purificá`;

        renderProduct();
        renderRelatedProducts();

        document.dispatchEvent(

            new CustomEvent("product:rendered", {

                detail:product

            })

        );

    }catch(error){

        console.error("Erro ao carregar produto:", error);

        renderProductError();

    }

}


async function loadProducts(){

    const response = await fetch("data/produtos.json");

    if(!response.ok){

        throw new Error(
            `Erro ao carregar produtos: ${response.status}`
        );

    }

    products = await response.json();

    if(!Array.isArray(products)){

        throw new Error(
            "O arquivo produtos.json não contém uma lista válida."
        );

    }

}


function renderProduct(){

    breadcrumbProduct.textContent = product.name;

    productCategory.textContent =
        product.badge ||
        product.category ||
        "Purificador";

    productTitle.textContent = product.name;

    productSubtitle.textContent =
        product.description ||
        "Conheça mais sobre este produto.";

    productPrice.textContent = formatPrice(product.price);

    productInstallment.textContent =
        product.installments
            ? `ou ${product.installments}`
            : "Consulte as condições de pagamento";

    productDescriptionText.textContent =
        product.longDescription ||
        product.description ||
        "Descrição em breve.";

    renderMainImage();
    renderThumbnails();
    renderProductAction();
    renderSpecifications();

}


function renderMainImage(){

    const images = getProductImages(product);

    if(images.length === 0){

        productMainImage.removeAttribute("src");

        productMainImage.alt = "Imagem indisponível";

        return;

    }

    productMainImage.src = images[0];

    productMainImage.alt = product.name;

}


function renderThumbnails(){

    const images = getProductImages(product);

    if(images.length === 0){

        productThumbnails.innerHTML = "";

        return;

    }

    productThumbnails.innerHTML = images.map((image,index)=>`

        <button

            type="button"

            class="product-thumbnail ${index === 0 ? "active" : ""}"

            data-image="${image}"

            aria-current="${index === 0 ? "true" : "false"}"

            aria-label="Visualizar imagem ${index + 1} de ${product.name}"

        >

            <img

                src="${image}"

                alt="${product.name} - imagem ${index + 1}"

            >

        </button>

    `).join("");

}


function renderProductAction(){

    const message = encodeURIComponent(
        `Olá! Tenho interesse no ${product.name}.`
    );

    productAction.innerHTML = `

        <a

            href="https://wa.me/5511999999999?text=${message}"

            target="_blank"

            rel="noopener noreferrer"

            class="btn btn-whatsapp"

        >

            Solicitar orçamento

        </a>

    `;

}


function renderSpecifications(){

    if(
        !product.specifications ||
        Object.keys(product.specifications).length === 0
    ){

        productSpecificationsList.innerHTML = `

            <div class="spec-row">

                <span class="spec-value">

                    Nenhuma especificação cadastrada.

                </span>

            </div>

        `;

        return;

    }

    productSpecificationsList.innerHTML = Object.entries(
        product.specifications
    )
    .map(([name,value])=>`

        <div class="spec-row">

            <span class="spec-name">

                ${name}

            </span>

            <span class="spec-value">

                ${value}

            </span>

        </div>

    `)
    .join("");

}


function renderRelatedProducts(){

    const related = products

        .filter(item => {

            return (
                item.category === product.category &&
                item.id !== product.id
            );

        })

        .slice(0,4);


    if(related.length === 0){

        relatedProducts.innerHTML = `

            <p class="related-products-empty">

                Nenhum produto relacionado.

            </p>

        `;

        return;

    }


    relatedProducts.innerHTML = related.map(item=>{

        const images = getProductImages(item);

        const image = images[0] || "";

        return `

            <article class="product-card">

                <a

                    href="produto.html?id=${item.id}"

                    class="product-image"

                    aria-label="Ver detalhes de ${item.name}"

                >

                    ${item.badge ? `

                        <span class="product-badge">

                            ${item.badge}

                        </span>

                    ` : ""}

                    <img

                        src="${image}"

                        alt="${item.name}"

                    >

                </a>

                <div class="product-info">

                    <span class="product-category">

                        ${item.category || "Purificador"}

                    </span>

                    <h3>

                        ${item.name}

                    </h3>

                    ${item.description ? `

                        <p>

                            ${item.description}

                        </p>

                    ` : ""}

                    <strong class="product-current-price">

                        ${formatPrice(item.price)}

                    </strong>

                    ${item.installments ? `

                        <span class="product-installments">

                            ou ${item.installments}

                        </span>

                    ` : ""}

                    <div class="product-actions">

                        <a

                            href="produto.html?id=${item.id}"

                            class="btn btn-primary"

                        >

                            Ver detalhes

                        </a>

                    </div>

                </div>

            </article>

        `;

    }).join("");

}


function getProductImages(item){

    if(
        Array.isArray(item.images) &&
        item.images.length > 0
    ){

        return item.images.filter(Boolean);

    }

    if(item.image){

        return [item.image];

    }

    return [];

}


function renderProductNotFound(){

    breadcrumbProduct.textContent = "Produto não encontrado";

    productCategory.textContent = "Erro";

    productTitle.textContent = "Produto não encontrado";

    productSubtitle.textContent =
        "O produto informado não existe ou foi removido.";

    productPrice.textContent = "R$ 0,00";

    productInstallment.textContent = "";

    productMainImage.removeAttribute("src");

    productMainImage.alt = "Produto não encontrado";

    productThumbnails.innerHTML = "";

    productAction.innerHTML = `

        <a

            href="catalogo.html"

            class="btn btn-primary"

        >

            Voltar ao catálogo

        </a>

    `;

    productDescriptionText.textContent =
        "Não foi possível localizar este produto.";

    productSpecificationsList.innerHTML = "";

    relatedProducts.innerHTML = "";

}


function renderProductError(){

    breadcrumbProduct.textContent = "Erro";

    productCategory.textContent = "Erro";

    productTitle.textContent =
        "Não foi possível carregar o produto";

    productSubtitle.textContent =
        "Tente novamente em alguns instantes.";

    productPrice.textContent = "R$ 0,00";

    productInstallment.textContent = "";

    productMainImage.removeAttribute("src");

    productMainImage.alt =
        "Erro ao carregar imagem do produto";

    productThumbnails.innerHTML = "";

    productAction.innerHTML = `

        <button

            type="button"

            class="btn btn-primary"

            onclick="window.location.reload()"

        >

            Tentar novamente

        </button>

    `;

    productDescriptionText.textContent =
        "Ocorreu um erro ao carregar os dados.";

    productSpecificationsList.innerHTML = "";

    relatedProducts.innerHTML = "";

}


function formatPrice(value){

    const numericValue = Number(value);

    if(!Number.isFinite(numericValue)){

        return "R$ 0,00";

    }

    return numericValue.toLocaleString("pt-BR",{

        style:"currency",

        currency:"BRL"

    });

}