'use strict';


const productsGrid = document.querySelector(".products-grid");
const productsCount = document.querySelector("#products-count");

const priceFilter = document.querySelector("#price-filter");
const priceValue = document.querySelector("#price-value");


let products = [];
let currentProducts = [];




document.addEventListener("DOMContentLoaded", init);






async function init(){


    await loadProducts();


    setupSorting();

    setupFilters();

    setupPriceFilter();


}









async function loadProducts(){


    try{


        const response = await fetch("data/produtos.json");



        if(!response.ok){

            throw new Error("Erro ao carregar produtos.");

        }



        products = await response.json();



        setupPriceRange();



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


    }

    else{


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





        applyPrice(list);



    });



}









function setupSorting(){


    document.addEventListener("sortChange",(e)=>{


        let list = [...currentProducts];




        switch(e.detail.sort){


            case "featured":


                list = list.filter(product => product.featured);


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


        }



        applyPrice(list);



    });



}









function setupPriceRange(){


    if(!priceFilter || products.length === 0) return;



    const max = Math.max(

        ...products.map(product => product.price)

    );



    priceFilter.max = Math.ceil(max);



    priceFilter.value = Math.ceil(max);




    if(priceValue){

        priceValue.textContent =
        `Até ${formatPrice(max)}`;

    }



}









function setupPriceFilter(){


    if(!priceFilter) return;



    priceFilter.addEventListener("input",()=>{


        const value = Number(priceFilter.value);



        if(priceValue){


            priceValue.textContent =
            `Até ${formatPrice(value)}`;


        }



        renderProducts(

            products.filter(product =>

                product.price <= value

            )

        );



    });



}









function applyPrice(list){


    if(!priceFilter){


        renderProducts(list);

        return;


    }



    const maxPrice = Number(priceFilter.value);



    const filtered = list.filter(product =>


        product.price <= maxPrice


    );



    renderProducts(filtered);



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


                <h3>

                    Nenhum produto encontrado

                </h3>


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


    const card = document.createElement("a");



    card.className = "product-card";


    card.href = `produto.html?id=${product.id}`;





    card.innerHTML = `


        ${product.badge ? `


        <div class="product-badge">

            ${product.badge}

        </div>


        ` : ""}







        <div class="product-image">


            <img

                src="${product.images[0]}"

                alt="${product.name}"

            >


        </div>







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


                <span class="btn btn-buy product-buy">

                    Comprar agora

                </span>


            </div>



        </div>



    `;






    const buyButton = card.querySelector(".product-buy");



    buyButton.addEventListener("click",(e)=>{


        e.preventDefault();

        e.stopPropagation();




        const message = encodeURIComponent(

            `Olá! Tenho interesse no ${product.name}.`

        );



        window.open(

            `https://wa.me/5511999999999?text=${message}`,

            "_blank"

        );


    });




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