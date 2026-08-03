'use strict';


const featuredProducts = document.querySelector("#featured-products");


document.addEventListener("DOMContentLoaded", loadFeaturedProducts);



async function loadFeaturedProducts(){

    if(!featuredProducts) return;


    try{

        const response = await fetch("data/produtos.json");


        if(!response.ok){

            throw new Error("Erro ao carregar produtos");

        }


        const products = await response.json();


        const featured = products
            .filter(product => product.featured)
            .sort((a,b)=>(b.sales || 0) - (a.sales || 0))
            .slice(0,4);



        renderFeatured(featured);


    }

    catch(error){

        console.error(error);

    }

}




function renderFeatured(products){

    featuredProducts.innerHTML = "";


    products.forEach(product=>{


        featuredProducts.innerHTML += `


        <article class="product-card">



            <a href="produto.html?id=${product.id}" class="product-link">


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



                </div>


            </a>





            <div class="product-actions">


                <a
                    href="https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Tenho interesse no ${product.name}.`)}"
                    target="_blank"
                    class="btn btn-buy"
                >

                    Comprar agora

                </a>


            </div>



        </article>


        `;


    });


}




function formatPrice(value){

    return value.toLocaleString("pt-BR",{

        style:"currency",

        currency:"BRL"

    });

}