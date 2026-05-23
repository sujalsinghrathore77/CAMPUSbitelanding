// main.js – interactivity for Campus Bite landing page

// ─── Scroll Reveal ───────────────────────────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // For stagger children, add class to parent and let CSS delay handle it
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────
function initFAQ() {
  const faqList = document.getElementById('faq-list');
  if (!faqList) return;

  faqList.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const item = btn.parentElement;
    const isActive = item.classList.contains('active');

    // Collapse all
    faqList.querySelectorAll('.faq-item').forEach((el) => {
      el.classList.remove('active');
      const q = el.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked item
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  // Scroll FAQ into view from hero CTA
  const scrollBtn = document.getElementById('faq-scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      document.getElementById('faq-accordion')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const closeBtn = document.getElementById('faq-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

// ─── Mobile Menu ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    menu.classList.toggle('open');
  });

  // Close on link tap
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      menu.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('active');
      menu.classList.remove('open');
    }
  });
}

// ─── Footer Year ─────────────────────────────────────────────────────────────
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── Sticky Header shadow on scroll ──────────────────────────────────────────
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.position = 'fixed';
      header.style.background = 'rgba(253,248,242,0.9)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.webkitBackdropFilter = 'blur(12px)';
      header.style.borderBottom = '1px solid rgba(0,0,0,0.07)';
      header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
    } else {
      header.style.position = 'absolute';
      header.style.background = '';
      header.style.backdropFilter = '';
      header.style.webkitBackdropFilter = '';
      header.style.borderBottom = '';
      header.style.boxShadow = '';
    }
  }, { passive: true });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initFAQ();
  initMobileMenu();
  setFooterYear();
  initHeaderScroll();
  initScrollReveal();
  initCounters();
  initHowDeck();
  initWipeTransition();
  initBadgeSpring();
  initScrollAirplane();
});

// ─── Scroll Reveal (IMPROVEMENT 1) ───────────────────────────────────────────
function initScrollReveal() {
  const sections = ['#hero', '#how', '#vendors', '#reviews', '#download', '#faq'];

  sections.forEach((selector) => {
    const sectionEl = document.querySelector(selector);
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = sectionEl.querySelectorAll('.scroll-reveal');
            elements.forEach((el) => {
              el.classList.add('visible');
            });
            // Stop observing this section after it's revealed once
            observer.unobserve(sectionEl);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionEl);
  });
}

// ─── Animated Stats Counters (IMPROVEMENT 2) ─────────────────────────────────
function animateCounter(el, startVal, targetVal, duration, decimals = 0, prefix = '', suffix = '') {
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth ease-out cubic progress
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = startVal + (targetVal - startVal) * easeProgress;
    
    el.textContent = prefix + currentValue.toFixed(decimals) + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Ensure it lands exactly on the target value
      el.textContent = prefix + targetVal.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const statsConfig = [
    { id: 'stat-pickup', start: 0, target: 4, duration: 1000, decimals: 0, prefix: '', suffix: ' min' },
    { id: 'stat-orders', start: 0, target: 180, duration: 1500, decimals: 0, prefix: '+', suffix: '' },
    { id: 'stat-campuses', start: 0, target: 24, duration: 1000, decimals: 0, prefix: '', suffix: '' },
    { id: 'stat-rating', start: 0, target: 4.9, duration: 1200, decimals: 1, prefix: '', suffix: '★' }
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const config = statsConfig.find((s) => s.id === card.id);
          if (config) {
            const valueEl = card.querySelector('.stat-value');
            if (valueEl) {
              animateCounter(valueEl, config.start, config.target, config.duration, config.decimals, config.prefix, config.suffix);
            }
          }
          // Disconnect observer for this card so it only runs once
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.15 }
  );

  statsConfig.forEach((stat) => {
    const cardEl = document.getElementById(stat.id);
    if (cardEl) {
      observer.observe(cardEl);
    }
  });
}

// ─── HOW IT WORKS — Card Deck Controller (FEATURE 2) ─────────────────────────
function initHowDeck() {
  const scrollDriver = document.getElementById('how-scroll-driver');
  const stage = document.getElementById('hiw-deck-stage');
  const dots = document.getElementById('hiw-progress-dots');
  if (!scrollDriver || !stage) return;

  const cards = stage.querySelectorAll('.hiw-card-deck');
  const dotBtns = dots ? dots.querySelectorAll('.hiw-dot') : [];
  const totalCards = cards.length;
  let currentIndex = 0;
  const isDesktop = () => window.innerWidth >= 768;

  function setActiveCard(index) {
    if (index < 0 || index >= totalCards || index === currentIndex) return;
    currentIndex = index;

    cards.forEach((card, i) => {
      if (i <= currentIndex) {
        card.classList.add('deck-active');
      } else {
        card.classList.remove('deck-active');
      }
    });

    dotBtns.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // ─── Desktop: scroll-driven ───
  if (isDesktop()) {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = scrollDriver.getBoundingClientRect();
        const driverHeight = scrollDriver.offsetHeight;
        const viewportH = window.innerHeight;

        // scrollProgress: 0 when top of driver is at top of viewport
        //                 1 when bottom of driver reaches bottom of viewport
        const scrolled = -rect.top;
        const scrollableDistance = driverHeight - viewportH;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

        // Map scroll progress to card index
        const rawIndex = Math.floor(progress * totalCards);
        const targetIndex = Math.min(rawIndex, totalCards - 1);

        if (targetIndex !== currentIndex) {
          setActiveCard(targetIndex);
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ─── Mobile: tap-to-advance ───
  stage.addEventListener('click', (e) => {
    if (isDesktop()) return;
    const nextIndex = (currentIndex + 1) % totalCards;
    setActiveCard(nextIndex);
  });

  // ─── Dot navigation (all screen sizes) ───
  dotBtns.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = parseInt(dot.dataset.dot, 10);
      setActiveCard(target);
    });
  });
}

// ─── DIAGONAL WIPE TRANSITION (FEATURE 4) ────────────────────────────────────
function initWipeTransition() {
  const overlay = document.getElementById('wipe-overlay');
  if (!overlay) return;

  const blocks = overlay.querySelectorAll('.wipe-block');
  let isAnimating = false;

  function playWipe(targetEl) {
    if (isAnimating) return;
    isAnimating = true;

    // Phase 1: wipe-in (blocks cover viewport)
    blocks.forEach((b) => {
      b.classList.remove('wipe-out');
      b.classList.add('wipe-in');
    });

    // After wipe covers viewport, scroll instantly
    setTimeout(() => {
      // Temporarily disable smooth scroll for instant jump
      document.documentElement.style.scrollBehavior = 'auto';
      targetEl.scrollIntoView({ block: 'start' });

      // Small delay to let the paint settle, then wipe-out
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = '';

        blocks.forEach((b) => {
          b.classList.remove('wipe-in');
          b.classList.add('wipe-out');
        });

        // Cleanup after wipe-out completes
        setTimeout(() => {
          blocks.forEach((b) => {
            b.classList.remove('wipe-out');
          });
          isAnimating = false;
        }, 450);
      });
    }, 380);
  }

  // Intercept all in-page nav link clicks
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const targetEl = document.querySelector(hash);
      if (!targetEl) return;

      e.preventDefault();
      playWipe(targetEl);

      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileBtn = document.getElementById('mobile-menu-btn');
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (mobileBtn) mobileBtn.classList.remove('active');
    });
  });
}

// ─── BADGE / PILL SPRING ANIMATION (FEATURE 3) ──────────────────────────────
function initBadgeSpring() {
  const badges = document.querySelectorAll('.hiw-badge, .hero-badge, .faq-hero-badge');
  if (!badges.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('badge-spring-active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  badges.forEach((badge) => observer.observe(badge));
}


// ─── SCROLL-ANIMATED PAPER AIRPLANE (FEATURE 5) ──────────────────────────────
function initScrollAirplane() {
  const container = document.getElementById('vendors');
  const plane = document.getElementById('scroll-plane-element');
  const trailPath = document.getElementById('scroll-plane-trail-path');
  const trailSvg = document.getElementById('scroll-plane-trail-svg');

  if (!container || !plane || !trailPath || !trailSvg) return;

  // Let's check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let progress = 0;
  let interpolatedProgress = 0;
  let pathLength = 0;

  function calculateProgress() {
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.pageYOffset;
    const containerHeight = rect.height;
    const windowHeight = window.innerHeight;

    // Start: when container's top enters bottom of viewport
    const start = containerTop - windowHeight;
    // End: when container's bottom leaves top of viewport
    const end = containerTop + containerHeight;

    const currentScroll = window.pageYOffset;
    let p = (currentScroll - start) / (end - start);
    p = Math.max(0, Math.min(1, p));
    return p;
  }

  function updateTrailGeometry() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    trailSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const startX = -100;
    const endX = width + 100;

    let d = "";
    for (let i = 0; i <= 100; i++) {
      const p = i / 100;
      const x = startX + p * (endX - startX);
      
      // Parabolic Y flight trajectory: 40px (start) rises to -240px (apex) then dips to 80px
      const yOffset = 1200 * p * p - 1160 * p + 40;
      const y = height / 2 + yOffset;

      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        d += `L ${x} ${y}`;
      }
    }

    trailPath.setAttribute('d', d);
    pathLength = trailPath.getTotalLength();
    trailPath.style.strokeDasharray = pathLength;
    
    // Position path immediately
    const initialProgress = calculateProgress();
    trailPath.style.strokeDashoffset = pathLength * (1 - initialProgress);
  }

  // Handle resizing dynamically
  window.addEventListener('resize', updateTrailGeometry);
  updateTrailGeometry();

  // Animation Frame Loop
  function tick() {
    progress = calculateProgress();
    
    // Buttery-smooth lerp (linear interpolation) chase loop
    interpolatedProgress += (progress - interpolatedProgress) * 0.08;

    if (Math.abs(progress - interpolatedProgress) < 0.0001) {
      interpolatedProgress = progress;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const startX = -100;
    const endX = width + 100;
    const currentX = startX + interpolatedProgress * (endX - startX);
    
    // Parabolic trajectory
    const currentY = 1200 * Math.pow(interpolatedProgress, 2) - 1160 * interpolatedProgress + 40;
    
    // Linear rotation (20deg to -10deg)
    const currentRot = 20 - interpolatedProgress * 30;

    // Apply exact positioning coordinates
    plane.style.transform = `translate(${currentX}px, ${height / 2 + currentY}px) rotate(${currentRot}deg)`;

    // Sync trail drawing
    if (pathLength > 0) {
      const offset = pathLength * (1 - interpolatedProgress);
      trailPath.style.strokeDashoffset = offset;
    }

    requestAnimationFrame(tick);
  }

  // Launch smooth rendering thread
  requestAnimationFrame(tick);
}


