const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsWrap = carousel.querySelector("[data-carousel-dots]");
  const count = carousel.querySelector("[data-carousel-count]");
  let activeIndex = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project media ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsWrap?.appendChild(dot);
    return dot;
  });

  function pauseVideos() {
    carousel.querySelectorAll("video").forEach((video) => video.pause());
  }

  function playActiveVideo() {
    const activeVideo = slides[activeIndex]?.querySelector("video");
    if (!activeVideo) return;

    activeVideo.muted = true;
    activeVideo.play().catch(() => {
      // Some browsers still wait for user interaction before autoplay.
    });
  }

  function showSlide(index) {
    pauseVideos();
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });

    if (count) {
      count.textContent = `${activeIndex + 1} / ${slides.length}`;
    }

    playActiveVideo();
  }

  prevButton?.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton?.addEventListener("click", () => showSlide(activeIndex + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1);
  });

  showSlide(0);
});
