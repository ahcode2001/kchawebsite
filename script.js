document.addEventListener('DOMContentLoaded', () => {

  // ====================================================
  // 1. LANGUAGE SWITCHER
  // ====================================================
  const langSelect = document.getElementById('langChanger');

  document.body.classList.add('lang-en');

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;

      if (selectedLang === 'ms') {
        document.body.classList.remove('lang-en');
        document.body.classList.add('lang-ms');
        document.documentElement.lang = 'ms';
      } else {
        document.body.classList.remove('lang-ms');
        document.body.classList.add('lang-en');
        document.documentElement.lang = 'en';
      }
    });
  }


  // ====================================================
  // 2. MUTED SCROLL-AUTOPLAY VIDEOS
  // ====================================================
  const autoPlayVideos = document.querySelectorAll('.scroll-autoplay-video');

  autoPlayVideos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  });

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, {
    threshold: 0.25
  });

  autoPlayVideos.forEach(video => videoObserver.observe(video));


  // ====================================================
  // 3. POP-OUT TRIGGER (Sachet & Product Box)
  // ====================================================
  const showcaseWrapper = document.querySelector('.product-badge-wrapper');

  if (showcaseWrapper) {
    const popObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showcaseWrapper.classList.add('is-popped');
          popObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -50% 0px",
      threshold: 0
    });

    popObserver.observe(showcaseWrapper);
  }


  // ====================================================
  // 4. LEMON SCROLL ROLL ANIMATION (Desktop + Mobile)
  // ====================================================
  const showcaseSection = document.querySelector('.kcha-showcase-section');
  const lemon = document.querySelector('.pop-lemon');

  if (showcaseSection && lemon) {
    let ticking = false;

    const updateLemonScroll = () => {
      const rect = showcaseSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDistance = windowHeight + rect.height;
      const currentProgress = (windowHeight - rect.top) / totalDistance;
      const progress = Math.min(Math.max(currentProgress, 0), 1);

      const isMobile = window.innerWidth <= 640;
      const startX = isMobile ? 150 : 450;
      const endX = isMobile ? 5 : 15;
      const currentX = startX + (endX - startX) * Math.min(progress * 1.5, 1);
      const rotation = -progress * (isMobile ? 360 : 720);
      const opacity = Math.min(progress * 3, 1);

      lemon.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
      lemon.style.opacity = opacity;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateLemonScroll);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('touchmove', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateLemonScroll);
        ticking = true;
      }
    }, { passive: true });

    updateLemonScroll();
  }


  // ====================================================
  // 5. SMOOTH SCROLL FOR ANCHOR LINKS
  // ====================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 95;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ====================================================
  // 6. SCROLL REVEAL ANIMATION (Fade-in on Scroll)
  // ====================================================
  const revealElements = document.querySelectorAll(
    '.feature-card, .cert-card, .health-card, .pricing-card, .short-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay so cards animate in sequence
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });

  // Add visible state via JS
  const style = document.createElement('style');
  style.textContent = `.is-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);


  // ====================================================
  // 7. STICKY HEADER SHADOW ON SCROLL
  // ====================================================
  const header = document.querySelector('header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }


  // ====================================================
  // 8. MOBILE HAMBURGER MENU (for small screens)
  // ====================================================

  // Inject hamburger button into navbar
  const navbar = document.querySelector('.navbar');
  const navActions = document.querySelector('.nav-actions');

  if (navbar && navActions) {

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger-btn');
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.innerHTML = `
      <span class="ham-line"></span>
      <span class="ham-line"></span>
      <span class="ham-line"></span>
    `;

    // Create mobile menu overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.classList.add('mobile-menu');
    mobileMenu.innerHTML = `
      <div class="mobile-menu-inner">
        <button class="mobile-menu-close" aria-label="Close menu">✕</button>
        <nav class="mobile-nav-links">
          <a href="#hero" class="mobile-nav-link lang-en-item">Home</a>
          <a href="#hero" class="mobile-nav-link lang-ms-item">Utama</a>

          <a href="#benefits" class="mobile-nav-link lang-en-item">Benefits</a>
          <a href="#benefits" class="mobile-nav-link lang-ms-item">Manfaat</a>

          <a href="#pricing" class="mobile-nav-link lang-en-item">Buy Now</a>
          <a href="#pricing" class="mobile-nav-link lang-ms-item">Beli Sekarang</a>

          <a href="#contact" class="mobile-nav-link lang-en-item">Contact</a>
          <a href="#contact" class="mobile-nav-link lang-ms-item">Hubungi Kami</a>
        </nav>

        <div class="mobile-menu-actions">
          <a href="https://wa.me/601120905342?text=Hi%20M-PLAN,%20I%20would%20like%20to%20know%20more%20about%20K-Cha!" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="mobile-wa-btn">
            💬 WhatsApp Us
          </a>
          <a href="https://vt.tiktok.com/ZS9yd7cJ3Vrcq-QupMj/" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="mobile-tiktok-btn">
            🛒 Shop on TikTok
          </a>
        </div>
      </div>
    `;

    // Inject hamburger styles
    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
      .hamburger-btn {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background 0.2s;
        z-index: 200;
      }
      .hamburger-btn:hover { background: rgba(0,0,0,0.05); }
      .ham-line {
        display: block;
        width: 22px;
        height: 2.5px;
        background-color: #414042;
        border-radius: 4px;
        transition: all 0.3s ease;
      }
      .hamburger-btn.is-open .ham-line:nth-child(1) {
        transform: translateY(7.5px) rotate(45deg);
      }
      .hamburger-btn.is-open .ham-line:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      .hamburger-btn.is-open .ham-line:nth-child(3) {
        transform: translateY(-7.5px) rotate(-45deg);
      }

      .mobile-menu {
        display: none;
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .mobile-menu.is-open {
        opacity: 1;
      }
      .mobile-menu-inner {
        position: absolute;
        top: 0; right: 0;
        width: 80%;
        max-width: 300px;
        height: 100%;
        background: #ffffff;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
      }
      .mobile-menu.is-open .mobile-menu-inner {
        transform: translateX(0);
      }
      .mobile-menu-close {
        align-self: flex-end;
        background: #f3f4f6;
        border: none;
        border-radius: 50%;
        width: 36px; height: 36px;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #414042;
        transition: background 0.2s;
      }
      .mobile-menu-close:hover { background: #e5e7eb; }
      .mobile-nav-links {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .mobile-nav-link {
        font-family: 'TT Norms', sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        color: #414042;
        text-decoration: none;
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid #f1f1eb;
        transition: color 0.2s, padding-left 0.2s;
      }
      .mobile-nav-link:hover {
        color: #FFC629;
        padding-left: 1rem;
      }
      .mobile-menu-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid #f1f1eb;
      }
      .mobile-wa-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #22c55e;
        color: #ffffff !important;
        font-family: 'TT Norms', sans-serif;
        font-weight: 700;
        font-size: 0.95rem;
        padding: 0.75rem;
        border-radius: 10px;
        text-decoration: none;
        transition: background 0.2s;
      }
      .mobile-wa-btn:hover { background: #16a34a; }
      .mobile-tiktok-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000000;
        color: #ffffff !important;
        font-family: 'TT Norms', sans-serif;
        font-weight: 700;
        font-size: 0.95rem;
        padding: 0.75rem;
        border-radius: 10px;
        text-decoration: none;
        transition: background 0.2s;
      }
      .mobile-tiktok-btn:hover { background: #1a1a1a; }

      /* Show hamburger on mobile */
      @media (max-width: 768px) {
        .hamburger-btn { display: flex !important; }
        .mobile-menu { display: block; }
        .nav-actions .whatsapp-link,
        .nav-actions .btn-primary,
        .nav-actions .lang-selector { display: none !important; }
      }

      /* Language-aware mobile menu links */
      body.lang-en .lang-ms-item { display: none !important; }
      body.lang-ms .lang-en-item { display: none !important; }
      body.lang-en .lang-en-item { display: block !important; }
      body.lang-ms .lang-ms-item { display: block !important; }
    `;

    document.head.appendChild(menuStyle);
    navbar.appendChild(hamburger);
    document.body.appendChild(mobileMenu);

    // Toggle menu open/close
    const openMenu = () => {
      mobileMenu.style.display = 'block';
      requestAnimationFrame(() => {
        mobileMenu.classList.add('is-open');
      });
      hamburger.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        mobileMenu.style.display = 'none';
      }, 350);
    };

    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close button inside menu
    mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', closeMenu);

    // Close when clicking overlay background
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close when clicking nav links
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }


  // ====================================================
  // 9. LANGUAGE-AWARE MOBILE MENU SYNC
  // ====================================================
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      // Mobile menu lang links already react via CSS body class
      // Add language selector inside mobile menu if needed
    });
  }


  // ====================================================
  // 10. BACK TO TOP BUTTON
  // ====================================================
  const backToTopBtn = document.createElement('button');
  backToTopBtn.classList.add('back-to-top');
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;

  const backToTopStyle = document.createElement('style');
  backToTopStyle.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 24px;
      right: 20px;
      width: 44px;
      height: 44px;
      background: #FFC629;
      color: #ffffff;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 500;
      box-shadow: 0 4px 14px rgba(255, 198, 41, 0.4);
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s;
      pointer-events: none;
    }
    .back-to-top.is-visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .back-to-top:hover {
      background: #E5B022;
    }
    @media (max-width: 768px) {
      .back-to-top {
        bottom: 20px;
        right: 16px;
        width: 40px;
        height: 40px;
      }
    }
  `;

  document.head.appendChild(backToTopStyle);
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ====================================================
  // 11. WHATSAPP FLOATING BUTTON (Mobile)
  // ====================================================
  const waFloat = document.createElement('a');
  waFloat.href = "https://wa.me/601120905342?text=Hi%20M-PLAN,%20I%20would%20like%20to%20know%20more%20about%20K-Cha!";
  waFloat.target = "_blank";
  waFloat.rel = "noopener noreferrer";
  waFloat.classList.add('wa-float-btn');
  waFloat.setAttribute('aria-label', 'Chat on WhatsApp');
  waFloat.innerHTML = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
    </svg>
  `;

  const waFloatStyle = document.createElement('style');
  waFloatStyle.textContent = `
    .wa-float-btn {
      display: none;
      position: fixed;
      bottom: 72px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #25d366;
      color: #ffffff;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45);
      z-index: 499;
      text-decoration: none;
      transition: transform 0.2s ease, background 0.2s;
    }
    .wa-float-btn:hover {
      background: #1ebe5d;
      transform: scale(1.08);
    }
    @media (max-width: 768px) {
      .wa-float-btn { display: flex; }
    }
  `;

  document.head.appendChild(waFloatStyle);
  document.body.appendChild(waFloat);

});