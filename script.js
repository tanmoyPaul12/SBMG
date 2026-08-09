/**
 * Swachh Bharat Mission (Grameen) - Unakoti District
 * Interactive Script for Arrow Carousels & Lightbox Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Image Carousels across all sections
  initCarousels();

  // Initialize Lightbox Modal
  initLightbox();

  // Initialize Master Gallery Filter
  initGalleryFilter();

  // Smooth scroll for nav links
  initSmoothScroll();
});

/* ==========================================================================
   Image Carousel Functionality
   ========================================================================== */
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach((carousel, carouselIdx) => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    const counterEl = carousel.querySelector('.carousel-counter');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    if (slides.length === 0) return;

    let currentIndex = 0;

    // Create Dots if dotsContainer exists
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateCarousel() {
      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      if (counterEl) {
        counterEl.textContent = `Image ${currentIndex + 1} of ${slides.length}`;
      }

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    }

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateCarousel();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Attach click to slide images to open Lightbox
    slides.forEach((slide, idx) => {
      const img = slide.querySelector('img');
      if (img) {
        img.addEventListener('click', () => {
          openLightboxFromCarousel(slides, idx);
        });
      }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (touchEndX < touchStartX - 40) {
        goToSlide(currentIndex + 1);
      }
      if (touchEndX > touchStartX + 40) {
        goToSlide(currentIndex - 1);
      }
    }

    // Initial setup
    updateCarousel();
  });
}

/* ==========================================================================
   Lightbox Gallery Modal Functionality
   ========================================================================== */
let globalGalleryItems = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
  const nextBtn = lightbox.querySelector('.lightbox-arrow.next');

  // Collect all gallery images across the page into global array
  const allImgs = document.querySelectorAll('img[data-lightbox]');
  globalGalleryItems = Array.from(allImgs).map(img => ({
    src: img.src,
    caption: img.getAttribute('data-caption') || img.alt || ''
  }));

  allImgs.forEach((img, idx) => {
    img.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  function openLightbox(index) {
    if (globalGalleryItems.length === 0) return;
    currentLightboxIndex = (index + globalGalleryItems.length) % globalGalleryItems.length;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxContent() {
    const item = globalGalleryItems[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.caption} (${currentLightboxIndex + 1} / ${globalGalleryItems.length})`;
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % globalGalleryItems.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + globalGalleryItems.length) % globalGalleryItems.length;
    updateLightboxContent();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });
}

function openLightboxFromCarousel(slideElements, slideIndex) {
  const currentImg = slideElements[slideIndex].querySelector('img');
  if (!currentImg) return;

  const src = currentImg.src;
  const matchIndex = globalGalleryItems.findIndex(item => item.src === src);
  const targetIndex = matchIndex >= 0 ? matchIndex : 0;

  const lightbox = document.getElementById('lightboxModal');
  if (lightbox) {
    currentLightboxIndex = targetIndex;
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const item = globalGalleryItems[currentLightboxIndex];

    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.caption} (${currentLightboxIndex + 1} / ${globalGalleryItems.length})`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* ==========================================================================
   Master Gallery Filter
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterValue === 'all' || cat === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Smooth Scrolling & Nav Active Link Update
   ========================================================================== */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
}
