document.addEventListener("DOMContentLoaded", () => {

  const slider = document.querySelector(".image-slider");
  if (!slider) return;

  let scrollAmount = 0;

  setInterval(() => {

    const cardWidth = slider.querySelector(".img-box").offsetWidth + 10;

    scrollAmount += cardWidth;

    if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
      scrollAmount = 0;
    }

    slider.scrollTo({
      left: scrollAmount,
      behavior: "smooth"
    });

  }, 3000); // every 3 sec

});