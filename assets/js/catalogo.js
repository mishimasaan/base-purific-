'use strict';


const productsGrid = document.querySelector('.products-grid');

const productsCount = document.querySelector('#products-count');


let products = [];


document.addEventListener(
    'DOMContentLoaded',
    init
);



async function init() {

    await loadProducts();

}



async function loadProducts() {

    try {

        const response = await fetch(
            'data/produtos.json'
        );


        if (!response.ok) {

            throw new Error(
                `Erro ao carregar produtos: ${response.status}`
            );

        }


        const data = await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                'O arquivo produtos.json precisa conter um array.'
            );

        }


        products = data;


        /*
        Disponibiliza os produtos para o filters.js.
        É importante fazer isso somente depois do fetch.
        */

        window.products = products;

        window.renderProducts = renderProducts;


        /*
        Primeira renderização com todos os produtos.
        */

        renderProducts(products);


        /*
        Avisa ao filters.js que os produtos
        terminaram de carregar.
        */

        document.dispatchEvent(

            new CustomEvent(
                'productsLoaded',
                {

                    detail: {

                        products

                    }

                }
            )

        );

    }

    catch (error) {

        console.error(
            'Erro no catálogo:',
            error
        );


        renderError();

    }

}



function renderProducts(list) {

    if (!productsGrid) {

        console.error(
            'Elemento .products-grid não encontrado.'
        );

        return;

    }


    const safeList = Array.isArray(list)
        ? list
        : [];


    productsGrid.innerHTML = '';


    updateProductsCount(
        safeList.length
    );


    if (safeList.length === 0) {

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


    safeList.forEach(product => {

        const productCard =
            createProductCard(product);


        productsGrid.appendChild(
            productCard
        );

    });

}



function updateProductsCount(total) {

    if (!productsCount) {

        return;

    }


    productsCount.textContent =

        total === 1

            ? '1 produto encontrado'

            : `${total} produtos encontrados`;

}



function createProductCard(product) {

    const card = document.createElement('a');


    card.className = 'product-card';

    card.href = `produto.html?id=${encodeURIComponent(
        product.id
    )}`;


    const productImage = getProductImage(
        product
    );


    card.innerHTML = `

        ${product.badge ? `

            <div class="product-badge">

                ${escapeHTML(product.badge)}

            </div>

        ` : ''}


        <div class="product-image">

            <img
                src="${escapeHTML(productImage)}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
            >

        </div>


        <div class="product-info">

            <span class="product-category">

                ${escapeHTML(product.category)}

            </span>


            <h3>

                ${escapeHTML(product.name)}

            </h3>


            <p>

                ${escapeHTML(product.description)}

            </p>


            <div class="product-price">

                ${product.oldPrice ? `

                    <span class="product-old-price">

                        ${formatPrice(product.oldPrice)}

                    </span>

                ` : ''}


                <span class="product-current-price">

                    ${formatPrice(product.price)}

                </span>


                ${product.installments ? `

                    <span class="product-installments">

                        ou ${escapeHTML(
                            product.installments
                        )}

                    </span>

                ` : ''}

            </div>


            <div class="product-actions">

                <span class="btn btn-buy product-buy">

                    Comprar agora

                </span>

            </div>

        </div>

    `;


    const buyButton = card.querySelector(
        '.product-buy'
    );


    buyButton?.addEventListener(
        'click',
        event => {

            event.preventDefault();

            event.stopPropagation();


            openProductWhatsApp(
                product
            );

        }
    );


    return card;

}



function getProductImage(product) {

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        return String(
            product.images[0]
        );

    }


    if (product.image) {

        return String(
            product.image
        );

    }


    return 'assets/images/placeholder.png';

}



function openProductWhatsApp(product) {

    const productName = String(
        product.name ?? 'produto'
    );


    const message = encodeURIComponent(

        `Olá! Tenho interesse no ${productName}.`

    );


    window.open(

        `https://wa.me/5511999999999?text=${message}`,

        '_blank',

        'noopener,noreferrer'

    );

}



function renderError() {

    if (!productsGrid) {

        return;

    }


    productsGrid.innerHTML = `

        <div class="catalog-empty">

            <h3>
                Não foi possível carregar os produtos
            </h3>

            <p>
                Tente atualizar a página.
            </p>

        </div>

    `;


    updateProductsCount(0);

}



function formatPrice(value) {

    const number = Number(value);


    const safeValue = Number.isFinite(number)
        ? number
        : 0;


    return safeValue.toLocaleString(
        'pt-BR',
        {

            style: 'currency',

            currency: 'BRL'

        }
    );

}



function escapeHTML(value) {

    return String(value ?? '')

        .replace(
            /&/g,
            '&amp;'
        )

        .replace(
            /</g,
            '&lt;'
        )

        .replace(
            />/g,
            '&gt;'
        )

        .replace(
            /"/g,
            '&quot;'
        )

        .replace(
            /'/g,
            '&#039;'
        );

}



window.renderProducts = renderProducts;

window.products = products;