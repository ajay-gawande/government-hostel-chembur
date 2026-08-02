document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("eventTrack");
  const dotsContainer = document.getElementById("eventDots");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const cards = Array.from(track.children);
  const total = cards.length;

  let index = 0;

  // 👇 detect cards per view
  function getVisibleCount() {
    return window.innerWidth <= 480 ? 1 : 2;
  }

  function getMaxIndex() {
    return total - getVisibleCount();
  }

  // =====================
  // CREATE DOTS
  // =====================
  function createDots() {
    dotsContainer.innerHTML = "";

    const maxDots = getMaxIndex() + 1;

    for (let i = 0; i <= maxDots - 1; i++) {
      const dot = document.createElement("span");

      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        index = i;
        move();
      });

      dotsContainer.appendChild(dot);
    }
  }

  // =====================
  // UPDATE DOTS
  // =====================
  function updateDots() {
    const dots = dotsContainer.children;

    for (let d of dots) d.classList.remove("active");

    if (dots[index]) dots[index].classList.add("active");
  }

  // =====================
  // BUTTON VISIBILITY
  // =====================
  function updateButtons() {
    const maxIndex = getMaxIndex();

    prevBtn.style.display = index === 0 ? "none" : "block";
    nextBtn.style.display = index >= maxIndex ? "none" : "block";
  }

  // =====================
  // MOVE FUNCTION
  // =====================
  function move() {
    const visible = getVisibleCount();
    const movePercent = 100 / visible;

    track.style.transform = `translateX(-${index * movePercent}%)`;

    updateDots();
    updateButtons();
  }

  // =====================
  // BUTTON EVENTS
  // =====================
  nextBtn.addEventListener("click", () => {
    if (index < getMaxIndex()) {
      index++;
      move();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      move();
    }
  });

  // =====================
  // RESIZE FIX
  // =====================
  window.addEventListener("resize", () => {
    index = 0; // reset to safe position
    createDots();
    move();
  });

  // INIT
  createDots();
  move();
});