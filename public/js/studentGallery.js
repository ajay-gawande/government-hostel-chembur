document.addEventListener("DOMContentLoaded", () => {

  const images = JSON.parse(
    document.getElementById("gallery-data").dataset.images
  );

  if (!images || images.length === 0) return;

  function optimizeCloudinary(url, width = 800) {
    return url.replace(
      "/upload/",
      `/upload/f_auto,q_auto,w_${width}/`
    );
  }

  const imgElements = [
    document.querySelector(".img1"),
    document.querySelector(".img2"),
    document.querySelector(".img3")
  ];

  let imageIndex = 0;

  // Load first 3 images
  imgElements.forEach((img) => {
    img.src = optimizeCloudinary(images[imageIndex], 800);
    imageIndex = (imageIndex + 1) % images.length;
  });

  let currentBox = 0;

  // Replace one image every 2 seconds
  setInterval(() => {

    imgElements[currentBox].src = optimizeCloudinary(
      images[imageIndex],
      800
    );

    imageIndex = (imageIndex + 1) % images.length;
    currentBox = (currentBox + 1) % imgElements.length;

  }, 2000);

});

// hostel life
document.addEventListener("DOMContentLoaded", () => {
  const data = document.getElementById("right-data");
  if (!data) return;

  const images = JSON.parse(data.dataset.images);
  if (!images || images.length === 0) return;

  const imgTag = document.getElementById("lifeImage");

  let index = 0;

  setInterval(() => {
    index = (index + 1) % images.length;

    imgTag.style.opacity = 0;

    setTimeout(() => {
      imgTag.src = images[index].url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_800/"
      );
      imgTag.style.opacity = 1;
    }, 200);

  }, 3000);
});