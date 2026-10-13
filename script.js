console.log("Lion Photography is ready!");

/* ===== PREMIUM GALLERY MODAL ===== */
const gallery = document.querySelector(".gallery");

if (gallery) {
  let currentIndex = 0;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Detail foto");

  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Tutup foto">&times;</button>
      <button class="lightbox-prev" aria-label="Foto sebelumnya">&#10094;</button>
      <figure class="lightbox-figure">
        <img class="lightbox-image" src="" alt="">
        <figcaption class="lightbox-caption">
          <h3 class="lightbox-title"></h3>
          <p class="lightbox-category"></p>
          <p class="lightbox-location"></p>
          <p class="lightbox-story"></p>
          <p class="lightbox-counter"></p>
        </figcaption>
      </figure>
      <button class="lightbox-next" aria-label="Foto berikutnya">&#10095;</button>
    </div>
  `;

  const modalImage = lightbox.querySelector(".lightbox-image");
  const modalTitle = lightbox.querySelector(".lightbox-title");
  const modalCategory = lightbox.querySelector(".lightbox-category");
  const modalCounter = lightbox.querySelector(".lightbox-counter");
  const modalLocation = lightbox.querySelector(".lightbox-location");
  const modalStory = lightbox.querySelector(".lightbox-story");

  function getVisiblePhotos() {
    return [...gallery.querySelectorAll(".photo-card img")].filter(
      (photo) =>
        !photo.closest(".photo-card").classList.contains("filter-hidden")
    );
  }

  function showPhoto(index) {
    const visiblePhotos = getVisiblePhotos();
    if (!visiblePhotos.length) return;

    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;

    const photo = visiblePhotos[currentIndex];
    const card = photo.closest(".photo-card");
    modalImage.src = photo.currentSrc || photo.src;
    modalImage.alt = photo.alt || "Foto portfolio";

    const overlayTitle = card.querySelector(".photo-overlay");
    const heading = overlayTitle?.querySelector("h3, h2, h4");

    modalTitle.textContent =
      heading?.textContent.trim() || photo.alt || "Lion Photography";

    const category = card.dataset.category || "Photography";
    modalCategory.textContent =
      category.charAt(0).toUpperCase() + category.slice(1);

    modalLocation.textContent = card.dataset.location
      ? `📍 ${card.dataset.location}`
      : "";

    modalStory.textContent = card.dataset.story || "";
    modalCounter.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
  }

  function openLightbox(photo) {
    const visiblePhotos = getVisiblePhotos();
    const index = visiblePhotos.indexOf(photo);
    if (index === -1) return;

    if (!lightbox.isConnected) document.body.appendChild(lightbox);

    showPhoto(index);
    lightbox.classList.add("lightbox-active");
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("lightbox-active");
    document.body.classList.remove("lightbox-open");
  }

  gallery.addEventListener("click", (event) => {
    const photo = event.target.closest(".photo-card img");
    if (photo) openLightbox(photo);
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(currentIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("lightbox-active")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
    if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
  });
}

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll(
  ".hero .eyebrow, .hero h1, .hero .intro, .hero .cta, " +
  ".section-heading, .gallery img, .contact .eyebrow, " +
  ".contact h2, .contact .cta, " +
  ".about-content .eyebrow, .about-content h2, .about-description, .about-signature"
);

revealElements.forEach((element) => element.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

/* ===== PHOTO FILTER ===== */
const filterButtons = document.querySelectorAll(".filter-btn");
const photoCards = document.querySelectorAll(".photo-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === button);
    });

    photoCards.forEach((card) => {
      const shouldShow =
        selectedFilter === "all" ||
        card.dataset.category === selectedFilter;

      card.classList.toggle("filter-hidden", !shouldShow);
    });
  });
});

/* ===== CUSTOM CURSOR ===== */
const customCursor = document.querySelector(".custom-cursor");
const cursorDot = document.querySelector(".cursor-dot");

const canUseCustomCursor =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (customCursor && cursorDot && canUseCustomCursor) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    customCursor.style.left = `${cursorX}px`;
    customCursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.addEventListener("mouseover", (event) => {
    const target = event.target.closest("a, button, .photo-card, .gallery img");
    customCursor.classList.toggle("cursor-hover", !!target);
  });

  document.addEventListener("mouseleave", () => {
    customCursor.style.opacity = "0";
    cursorDot.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    customCursor.style.opacity = "1";
    cursorDot.style.opacity = "1";
  });
}

/* ===== BACK TO TOP ===== */
const backToTopButton = document.querySelector("#backToTop");

if (backToTopButton) {
  const updateBackToTop = () => {
    backToTopButton.classList.toggle("is-visible", window.scrollY > 350);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  });

  updateBackToTop();
}

/* ===== PREMIUM PHOTOGRAPHY STATISTICS ===== */
const statsSection = document.querySelector(".stats-section");
const statCounters = document.querySelectorAll(
  ".stats-section .counter"
);

if (statsSection) {
  const statsRevealElements = statsSection.querySelectorAll(
    ".stats-heading, .stat-item, .stats-footer"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let statsAnimated = false;

  function animateCounter(element) {
    const target = Number(element.dataset.target);

    if (!Number.isFinite(target) || target < 0) return;

    if (prefersReducedMotion) {
      element.textContent = String(target);
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function updateCounter(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      element.textContent = String(
        Math.round(target * eased)
      );

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = String(target);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function revealStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    if (prefersReducedMotion) {
      statsRevealElements.forEach((element) => {
        element.classList.add("visible");
      });
    } else {
      statsRevealElements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("visible");
        }, index * 120);
      });
    }

    statCounters.forEach(animateCounter);
  }

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealStats();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    statsObserver.observe(statsSection);
  } else {
    revealStats();
  }
}