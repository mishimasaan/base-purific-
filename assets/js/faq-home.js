const faqItems = document.querySelectorAll(".faq-item");


faqItems.forEach(item => {

    item.addEventListener("click",()=>{

        item.classList.toggle("active");

        const icon = item.querySelector(".faq-question span:last-child");

        if(item.classList.contains("active")){

            icon.textContent = "−";

        }else{

            icon.textContent = "+";

        }

    });

});