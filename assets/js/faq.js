document.addEventListener("DOMContentLoaded",()=>{

    const questions=document.querySelectorAll(".faq-questionx");

    const filters=document.querySelectorAll(".faq-filterx-button");

    const items=document.querySelectorAll(".faq-itemx");



    function closeItem(item){

        item.classList.remove("open");

        const question=item.querySelector(".faq-questionx");

        const toggle=item.querySelector(".faq-togglex");

        question.setAttribute("aria-expanded","false");

        toggle.textContent="+";

    }



    function openItem(item){

        item.classList.add("open");

        const question=item.querySelector(".faq-questionx");

        const toggle=item.querySelector(".faq-togglex");

        question.setAttribute("aria-expanded","true");

        toggle.textContent="−";

    }



    questions.forEach(question=>{

        question.addEventListener("click",()=>{

            const item=question.closest(".faq-itemx");

            const isOpen=item.classList.contains("open");

            items.forEach(otherItem=>{

                if(otherItem!==item){

                    closeItem(otherItem);

                }

            });

            if(isOpen){

                closeItem(item);

            }else{

                openItem(item);

            }

        });

    });



    filters.forEach(filter=>{

        filter.addEventListener("click",()=>{

            filters.forEach(button=>{

                button.classList.remove("active");

            });

            filter.classList.add("active");

            const category=filter.dataset.category;

            items.forEach(item=>{

                const show=
                    category==="todos"||
                    item.dataset.category===category;

                if(show){

                    item.style.display="block";

                    requestAnimationFrame(()=>{

                        item.style.opacity="1";

                        item.style.transform="translateY(0)";

                    });

                }else{

                    closeItem(item);

                    item.style.opacity="0";

                    item.style.transform="translateY(8px)";

                    setTimeout(()=>{

                        item.style.display="none";

                    },200);

                }

            });

        });

    });

});