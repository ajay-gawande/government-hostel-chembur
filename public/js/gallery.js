const activeFilter = document.querySelector(".filters a.active");

if (activeFilter) {
    setTimeout(() => {
        activeFilter.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".hostel-gallery-image");

    images.forEach(img => {

        function setClass() {

            const parent = img.parentElement;

            parent.classList.remove(
                "hostel-portrait",
                "hostel-landscape"
            );


            if (img.naturalHeight > img.naturalWidth) {

                parent.classList.add("hostel-portrait");

            } else {

                parent.classList.add("hostel-landscape");

            }

        }


        if (img.complete) {

            setClass();

        } else {

            img.onload = setClass;

        }

    });

});


document.addEventListener("DOMContentLoaded",()=>{


    const button = document.getElementById("seeMoreBtn");

    const extraImages = document.querySelectorAll(".extra-image");


    if(button){


        button.addEventListener("click",()=>{


            extraImages.forEach(img=>{

                if(img.style.display === "block"){

                    img.style.display="none";

                    button.innerText="See More Images";


                }else{

                    img.style.display="block";

                    button.innerText="Show Less";

                }

            });


        });


    }


});


const swiper = new Swiper(".videoSwiper", {
    loop: true,
    spaceBetween: 25,

 

    navigation: {
        nextEl: ".event-btn.next",
        prevEl: ".event-btn.prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        }
    }
});