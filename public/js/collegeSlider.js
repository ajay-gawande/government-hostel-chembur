document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("track");
  const cards = track.children;

  const visible = 5;
  const step = 2;
  let index = 0;

  const total = cards.length;

  // clone first cards for infinite loop
  for (let i = 0; i < visible; i++) {
    track.appendChild(cards[i].cloneNode(true));
  }

  function slide() {
    index += step;

    track.style.transform = `translateX(-${index * (100 / visible)}%)`;

    if (index >= total) {
      setTimeout(() => {
        track.style.transition = "none";
        index = 0;
        track.style.transform = `translateX(0)`;

        setTimeout(() => {
          track.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    }
  }

  setInterval(slide, 3000);
});



