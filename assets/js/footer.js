document.addEventListener("DOMContentLoaded",()=>{

    const footer = document.querySelector("#footer");

    if(!footer) return;


    fetch("footer.html")

    .then(response=>response.text())

    .then(html=>{

        footer.innerHTML = html;

    })

    .catch(error=>{

        console.error("Erro ao carregar footer:",error);

    });

});