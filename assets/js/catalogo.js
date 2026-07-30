'use strict';

const productsGrid = document.querySelector(".products-grid");
const productsCount = document.querySelector("#products-count");

let products = [];
let currentProducts = [];

document.addEventListener("DOMContentLoaded", init);


async function init(){

    await loadProducts();

    setupSorting();

    setupFilters();

}


async function loadProducts(){

    try{

        const response = await fetch("data/produtos.json");


        if(!response.ok){

            throw new Error("Erro ao carregar os produtos.");

        }


        products = await response.json();


        applyCategoryFilter();


    }

    catch(error){

        console.error(error);

    }

}



function applyCategoryFilter(){

    const params = new URLSearchParams(window.location.search);

    const category = params.get("categoria");


    if(category){

        currentProducts = products.filter(product =>

            product.category.toLowerCase() === category.toLowerCase()

        );

    }else{

        currentProducts = [...products];

    }


    renderProducts(currentProducts);

}



function setupFilters(){

    document.addEventListener("filterChange",(e)=>{

        let list = [...currentProducts];


        if(e.detail.categories.length){

            list = list.filter(product =>

                e.detail.categories.includes(product.category)

            );

        }


        if(e.detail.brands.length){

            list = list.filter(product =>

                e.detail.brands.includes(product.brand)

            );

        }


        renderProducts(list);

    });

}



function setupSorting(){

    document.addEventListener("sortChange",(e)=>{

        let list = [...currentProducts];


        switch(e.detail.sort){

            case "featured":

                list = list.filter(product=>product.featured);

                break;


            case "popular":

                list.sort((a,b)=>

                    (b.sales || 0) - (a.sales || 0)

                );

                break;


            case "recent":

                list.sort((a,b)=>

                    b.id - a.id

                );

                break;


            case "discount":

                list.sort((a,b)=>{

                    const discountA =
                    (a.oldPrice || a.price) - a.price;


                    const discountB =
                    (b.oldPrice || b.price) - b.price;


                    return discountB - discountA;

                });

                break;


            case "price-asc":

                list.sort((a,b)=>

                    a.price - b.price

                );

                break;


            case "price-desc":

                list.sort((a,b)=>

                    b.price - a.price

                );

                break;


            case "name-asc":

                list.sort((a,b)=>

                    a.name.localeCompare(b.name)

                );

                break;


            case "name-desc":

                list.sort((a,b)=>

                    b.name.localeCompare(a.name)

                );

                break;


            case "relevance":

            default:

                break;

        }


        renderProducts(list);

    });

}



function renderProducts(list){

    productsGrid.innerHTML = "";


    if(productsCount){

        productsCount.textContent =
        `${list.length} produto${list.length !== 1 ? "s" : ""} encontrado${list.length !== 1 ? "s" : ""}`;

    }


    if(list.length === 0){

        productsGrid.innerHTML = `

            <div class="catalog-empty">

                <h3>Nenhum produto encontrado</h3>

                <p>
                    Tente alterar os filtros.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(product=>{

        productsGrid.appendChild(
            createProductCard(product)
        );

    });

}



function createProductCard(product){

    const card = document.createElement("article");


    card.className = "product-card";


    card.innerHTML = `

        ${product.badge ? `

            <div class="product-badge">

                ${product.badge}

            </div>

        ` : ""}


<a href="produto.html?id=${product.id}" class="product-image">

    <img src="${product.images[0]}" alt="${product.name}">

</a>


        <div class="product-info">


            <span class="product-category">

                ${product.category}

            </span>


            <h3>

                ${product.name}

            </h3>


            <p>

                ${product.description}

            </p>


            <div class="product-price">


                ${product.oldPrice ? `

                    <span class="product-old-price">

                        ${formatPrice(product.oldPrice)}

                    </span>

                ` : ""}


                <span class="product-current-price">

                    ${formatPrice(product.price)}

                </span>


                ${product.installments ? `

                    <span class="product-installments">

                        ou ${product.installments}

                    </span>

                ` : ""}


            </div>


            <div class="product-actions">





<a
    href="https://wa.me/5511999999999?text=${encodeURIComponent(product.whatsapp || `Olá! Tenho interesse no ${product.name}.`)}"
    target="_blank"
    class="btn btn-buy"
>

    Comprar agora

</a>


            </div>


        </div>

    `;


    return card;

}



function formatPrice(value){

    return value.toLocaleString("pt-BR",{

        style:"currency",

        currency:"BRL"

    });

}



window.renderProducts = renderProducts;
window.products = products;