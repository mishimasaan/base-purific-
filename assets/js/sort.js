'use strict';

document.addEventListener("sortChange", handleSort);

function handleSort(event){

    const sort = event.detail.sort;

    let list = [...window.products];

    switch(sort){

        case "price-asc":

            list.sort((a,b)=>a.price-b.price);

            break;

        case "price-desc":

            list.sort((a,b)=>b.price-a.price);

            break;

        case "name-asc":

            list.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));

            break;

        case "name-desc":

            list.sort((a,b)=>b.name.localeCompare(a.name,"pt-BR"));

            break;

        case "discount":

            list.sort((a,b)=>{

                const discountA = (a.oldPrice || a.price) - a.price;
                const discountB = (b.oldPrice || b.price) - b.price;

                return discountB - discountA;

            });

            break;

        case "recent":

            list.sort((a,b)=>b.id-a.id);

            break;

        case "popular":

            list.sort((a,b)=>(b.sales || 0)-(a.sales || 0));

            break;

        default:

            break;

    }

    window.renderProducts(list);

}