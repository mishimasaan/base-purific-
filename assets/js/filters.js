'use strict';

document.addEventListener("DOMContentLoaded",()=>{

    const categoryInputs = document.querySelectorAll(
        ".filter-group:nth-child(2) input"
    );

    const brandInputs = document.querySelectorAll(
        ".filter-group:nth-child(3) input"
    );

    const priceRange = document.querySelector(
        ".filter-group input[type='range']"
    );


    function applyFilters(){

        const categories = [];

        categoryInputs.forEach(input=>{

            if(input.checked){

                categories.push(
                    input.parentElement.textContent.trim()
                );

            }

        });



        const brands = [];

        brandInputs.forEach(input=>{

            if(input.checked){

                brands.push(
                    input.parentElement.textContent.trim()
                );

            }

        });



        const price = priceRange
            ? Number(priceRange.value)
            : null;



        document.dispatchEvent(

            new CustomEvent("filterChange",{

                detail:{

                    categories,

                    brands,

                    price

                }

            })

        );

    }



    categoryInputs.forEach(input=>{

        input.addEventListener(
            "change",
            applyFilters
        );

    });



    brandInputs.forEach(input=>{

        input.addEventListener(
            "change",
            applyFilters
        );

    });



    if(priceRange){

        priceRange.addEventListener(
            "input",
            applyFilters
        );

    }


});