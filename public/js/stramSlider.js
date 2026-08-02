document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("streamTrack");
  const dotsContainer = document.getElementById("streamDots");

  let cards = Array.from(track.children);
  const visible = 4;
  let index = visible;

  // =====================
  // 🔁 CLONE FOR LOOP
  // =====================
  const firstClones = cards.slice(0, visible).map(c => c.cloneNode(true));
  const lastClones = cards.slice(-visible).map(c => c.cloneNode(true));

  lastClones.forEach(c => track.prepend(c));
  firstClones.forEach(c => track.appendChild(c));

  cards = Array.from(track.children);

  track.style.transform = `translateX(-${index * (100 / visible)}%)`;

  // =====================
  // 🔵 DOTS
  // =====================
  const realTotal = cards.length - (visible * 2);

  for (let i = 0; i < realTotal; i++) {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i + visible;
      move();
    });

    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.children;

  function updateDots() {
    let realIndex = index - visible;

    if (realIndex >= realTotal) realIndex = 0;
    if (realIndex < 0) realIndex = realTotal - 1;

    [...dots].forEach(d => d.classList.remove("active"));
    if (dots[realIndex]) dots[realIndex].classList.add("active");
  }

  // =====================
  // 🎬 MOVE FUNCTION
  // =====================
  function move() {
    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translateX(-${index * (100 / visible)}%)`;
    updateDots();
  }

  // =====================
  // 🔁 AUTO SLIDE
  // =====================
  let auto = setInterval(() => {
    index++;
    move();
  }, 3000);

  function stopAuto() {
    clearInterval(auto);
  }

  // =====================
  // 🔁 LOOP FIX
  // =====================
  track.addEventListener("transitionend", () => {
    if (index >= cards.length - visible) {
      track.style.transition = "none";
      index = visible;
      track.style.transform = `translateX(-${index * (100 / visible)}%)`;
    }

    if (index < visible) {
      track.style.transition = "none";
      index = cards.length - (visible * 2);
      track.style.transform = `translateX(-${index * (100 / visible)}%)`;
    }
  });

  // =====================
  // 🖱️ DRAG (FIXED)
  // =====================
  let startX = 0;
  let isDragging = false;

  track.addEventListener("mousedown", (e) => {
    e.preventDefault(); // 🔥 IMPORTANT
    isDragging = true;
    startX = e.clientX;
    stopAuto();
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const diff = e.clientX - startX;

    track.style.transition = "none";
    track.style.transform = `translateX(calc(-${index * (100 / visible)}% + ${diff}px))`;
  });

  track.addEventListener("mouseup", (e) => {
    if (!isDragging) return;

    const diff = e.clientX - startX;

    if (diff > 50) index--;
    else if (diff < -50) index++;

    isDragging = false;
    move();
  });

  track.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  // =====================
  // 📱 TOUCH SUPPORT
  // =====================
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopAuto();
  });

  track.addEventListener("touchmove", (e) => {
    const diff = e.touches[0].clientX - startX;

    track.style.transition = "none";
    track.style.transform = `translateX(calc(-${index * (100 / visible)}% + ${diff}px))`;
  });

  track.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 50) index--;
    else if (diff < -50) index++;

    move();
  });

});