const track = document.querySelector(".menu-track");
const cards = document.querySelectorAll(".day-card");
const dotsContainer = document.querySelector(".menu-dots");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let index = 0;
let visibleCards = getVisibleCards();
let totalSlides = cards.length - visibleCards + 1;
let autoSlide;

function getVisibleCards() {
  if (window.innerWidth <= 768) return 1;
  return 2;
}


function createDots() {
  dotsContainer.innerHTML = "";

  for (let i = 0; i < totalSlides; i++) {
    let dot = document.createElement("span");

    if (i === index) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      updateSlider();
      resetAutoSlide();
    });

    dotsContainer.appendChild(dot);
  }
}


function updateSlider() {

  if (window.innerWidth <= 768) {
    //  MOBILE (NO CUT ISSUE)
    track.style.transform = `translateX(-${index * 100}%)`;

  } else {
    //DESKTOP (2 CARDS WITH GAP)
    const gap = 20; // MUST MATCH CSS gap
    const cardWidth = cards[0].offsetWidth + gap;

    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  // UPDATE DOTS
  const dots = document.querySelectorAll(".menu-dots span");
  dots.forEach(d => d.classList.remove("active"));

  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

/* NEXT */
function nextSlide() {
  index++;
  if (index >= totalSlides) index = 0;
  updateSlider();
}

/* PREV */
function prevSlide() {
  index--;
  if (index < 0) index = totalSlides - 1;
  updateSlider();
}

/*  AUTO SLIDE */
function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 5000); // 2 sec
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

/* BUTTON EVENTS (IMPORTANT FIX) */
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });
}

/* 🔷 RESPONSIVE FIX */
window.addEventListener("resize", () => {
  visibleCards = getVisibleCards();
  totalSlides = cards.length - visibleCards + 1;

  index = 0;

  createDots();
  updateSlider();
});

/* 🔷 INIT */
createDots();
updateSlider();
startAutoSlide();