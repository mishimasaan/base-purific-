'use strict';

const productContainer = document.querySelector("#product-container");
const relatedProducts = document.querySelector("#related-products");
const breadcrumbProduct = document.querySelector("#breadcrumb-product");

let products = [];
let product = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {

    await loadProducts();

    const id = Number(new URLSearchParams(window.location.search).get("id"));

    product = products.find(p => p.id === id);

    if (!product) {

        productContainer.innerHTML = "<h2>Produto não encontrado.</h2>";

        return;

    }

    document.title = `${product.name} | Purificá`;

    breadcrumbProduct.textContent = product.name;

    renderProduct();

    renderRelatedProducts();

}

async function loadProducts() {

    const response = await fetch("data/produtos.json");

    products = await response.json();

}

function renderProduct() {

    productContainer.innerHTML = `

        <section class="product">

            <div class="product-gallery">

                <div class="product-thumbnails">

                    ${product.images.map((image, index) => `

                        <img
                            src="${image}"
                            class="thumbnail ${index === 0 ? "active" : ""}"
                            onclick="changeImage('${image}', this)"
                            alt="${product.name}"
                        >

                    `).join("")}

                </div>

                <div class="product-main-image">

                    <img
                        id="main-image"
                        src="${product.images[0]}"
                        alt="${product.name}"
                    >

                </div>

            </div>

            <div class="product-details">

                ${product.badge ? `

                    <span class="product-badge">

                        ${product.badge}

                    </span>

                ` : ""}

                <h1>

                    ${product.name}

                </h1>

                <p class="product-description">

                    ${product.description}

                </p>

                <div class="product-price">

                    ${product.oldPrice ? `

                        <span class="old-price">

                            ${formatPrice(product.oldPrice)}

                        </span>

                    ` : ""}

                    <span class="current-price">

                        ${formatPrice(product.price)}

                    </span>

                    ${product.installments ? `

                        <span class="installments">

                            ou ${product.installments}

                        </span>

                    ` : ""}

                </div>

                <a
                    href="https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Tenho interesse no ${product.name}.`)}"
                    target="_blank"
                    class="btn btn-whatsapp"
                >

                    Solicitar orçamento

                </a>

                <div class="product-text">

                    <h2>

                        Descrição

                    </h2>

                    <p>

                        ${product.longDescription || "Descrição em breve."}

                    </p>

                </div>

                <div class="product-specifications">

                    <h2>

                        Especificações

                    </h2>

                    <table>

                        ${renderSpecifications()}

                    </table>

                </div>

            </div>

        </section>

    `;

}

function renderSpecifications() {

    if (!product.specifications || Object.keys(product.specifications).length === 0) {

        return `

            <tr>

                <td colspan="2">

                    Nenhuma especificação cadastrada.

                </td>

            </tr>

        `;

    }

    return Object.entries(product.specifications).map(([name, value]) => `

        <tr>

            <td>

                ${name}

            </td>

            <td>

                ${value}

            </td>

        </tr>

    `).join("");

}

function renderRelatedProducts() {

    const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    if (related.length === 0) {

        relatedProducts.innerHTML = "<p>Nenhum produto relacionado.</p>";

        return;

    }

    relatedProducts.innerHTML = related.map(item => `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${item.images[0]}"
                    alt="${item.name}"
                >

            </div>

            <div class="product-info">

                ${item.badge ? `

                    <span class="product-badge">

                        ${item.badge}

                    </span>

                ` : ""}

                <h3>

                    ${item.name}

                </h3>

                <span class="product-current-price">

                    ${formatPrice(item.price)}

                </span>

                <a
                    href="produto.html?id=${item.id}"
                    class="btn btn-primary"
                >

                    Ver detalhes

                </a>

            </div>

        </article>

    `).join("");

}

function changeImage(image, element) {

    document.querySelector("#main-image").src = image;

    document.querySelectorAll(".thumbnail").forEach(img => {

        img.classList.remove("active");

    });

    element.classList.add("active");

}

function formatPrice(value) {

    return value.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}