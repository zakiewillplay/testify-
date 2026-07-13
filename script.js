/* =============================================================
   NIIB JAMMU — SCRIPT.JS
   Vanilla JS only. No dependencies.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. STICKY HEADER SHADOW ON SCROLL
  ----------------------------------------------------------- */
  const header = document.getElementById('siteHeader');

  const handleHeaderScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run once on load


  /* -----------------------------------------------------------
     2. MOBILE HAMBURGER MENU
  ----------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  // Create a backdrop element for the mobile menu
  const navBackdrop = document.createElement('div');
  navBackdrop.className = 'nav-backdrop';
  document.body.appendChild(navBackdrop);

  const openMenu = () => {
    navLinks.classList.add('is-open');
    hamburgerBtn.classList.add('is-active');
    navBackdrop.classList.add('is-visible');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // lock background scroll
  };

  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-active');
    navBackdrop.classList.remove('is-visible');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  navBackdrop.addEventListener('click', closeMenu);

  // Close mobile menu whenever a nav link is tapped (smooth scroll still fires natively)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* -----------------------------------------------------------
     3. ACTIVE NAV LINK HIGHLIGHT WHILE SCROLLING
  ----------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();


  /* -----------------------------------------------------------
     4. INTERSECTION OBSERVER — FADE-IN ON SCROLL
  ----------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => revealObserver.observe(el));


  /* -----------------------------------------------------------
     5. GALLERY LIGHTBOX
  ----------------------------------------------------------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    const fullSrc = item.getAttribute('data-full');
    const altText = item.querySelector('img').getAttribute('alt');

    lightboxImg.setAttribute('src', fullSrc);
    lightboxImg.setAttribute('alt', altText);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);

  // Click outside the image (on the dark backdrop) closes it
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard support: Esc to close, arrows to navigate
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });


  /* -----------------------------------------------------------
     6. CONTACT FORM — VALIDATION + WHATSAPP HANDOFF
     No backend: on valid submit, we open WhatsApp with a
     pre-filled message containing the lead's details.
  ----------------------------------------------------------- */
  const enquiryForm = document.getElementById('enquiryForm');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const courseInput = document.getElementById('course');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');

  const WHATSAPP_NUMBER = '919797924377';

  // Accepts Indian mobile numbers with optional +91/91 prefix and optional spaces
  const isValidIndianPhone = (value) => {
    const cleaned = value.replace(/[\s-]/g, '');
    return /^(?:\+91|91)?[6-9]\d{9}$/.test(cleaned);
  };

  const setError = (input, errorEl, message) => {
    input.classList.toggle('is-invalid', Boolean(message));
    errorEl.textContent = message || '';
  };

  // Live validation as the user types their phone number
  phoneInput.addEventListener('input', () => {
    if (phoneInput.value.trim() === '') {
      setError(phoneInput, phoneError, '');
      return;
    }
    setError(
      phoneInput,
      phoneError,
      isValidIndianPhone(phoneInput.value) ? '' : 'Enter a valid 10-digit Indian mobile number'
    );
  });

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim().length < 2) {
      setError(nameInput, nameError, 'Please enter your name');
      isValid = false;
    } else {
      setError(nameInput, nameError, '');
    }

    if (!isValidIndianPhone(phoneInput.value)) {
      setError(phoneInput, phoneError, 'Enter a valid 10-digit Indian mobile number');
      isValid = false;
    } else {
      setError(phoneInput, phoneError, '');
    }

    if (!isValid) return;

    // Build the WhatsApp message from the form fields
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const course = courseInput.value;
    const message = messageInput.value.trim();

    let text = `Hi NIIB, my name is ${name} (${phone}).`;
    text += ` I'm interested in the ${course} course.`;
    if (message) text += ` Note: ${message}`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener');

    enquiryForm.reset();
  });


  /* -----------------------------------------------------------
     8. SCROLL PROGRESS BAR
  ----------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();


  /* -----------------------------------------------------------
     9. SUBTLE HERO PARALLAX (desktop/tablet only, skipped
     entirely if the visitor prefers reduced motion)
  ----------------------------------------------------------- */
  const heroSection = document.querySelector('.hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroSection && !prefersReducedMotion) {
    const updateHeroParallax = () => {
      // Only move the background while the hero is actually on screen,
      // and only by a small amount so it reads as depth, not distraction
      const offset = Math.min(window.scrollY * 0.25, 120);
      heroSection.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    };
    window.addEventListener('scroll', updateHeroParallax, { passive: true });
    updateHeroParallax();
  }


  /* -----------------------------------------------------------
     10. COURSE CARD TILT — pointer devices only (mouse/trackpad).
     Touch devices skip this entirely since there's no hover state.
  ----------------------------------------------------------- */
  const supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHoverTilt && !prefersReducedMotion) {
    document.querySelectorAll('.course-card').forEach(card => {
      const maxTilt = 6; // degrees — kept subtle so it feels premium, not gimmicky

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* -----------------------------------------------------------
     11. FOOTER YEAR
  ----------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

/* =============================================================
   IMAGE NOTES FOR DEVELOPER
   -------------------------------------------------------------
   This file has no dependency on images loading successfully,
   but for the best experience, add real photos at:

   assets/img/hero-bg.jpg        -> hero background (1920x1080+)
   assets/img/gallery-1.jpg  ...  gallery-6.jpg -> square-ish photos
     used in the gallery grid and lightbox (recommend 800x800+)

   See the README notes in the project root for full details.
   ============================================================= */
