(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';

  if (hasGsap && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger, window.ScrollToPlugin);
  }

  const ready = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
      return;
    }

    callback();
  };

  const animateIn = () => {
    if (!hasGsap || prefersReducedMotion) {
      document.body.style.opacity = '1';
      document.body.style.transform = 'none';
      return;
    }

    window.gsap.set(document.body, { opacity: 0 });
    window.gsap.to(document.body, {
      opacity: 1,
      duration: 0.45,
      ease: 'power2.out'
    });
  };

  const createWipeLayer = () => {
    let layer = document.querySelector('.gsap-transition-layer');

    if (layer) {
      return layer;
    }

    layer = document.createElement('div');
    layer.className = 'gsap-transition-layer';
    Object.assign(layer.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      background: 'linear-gradient(135deg, rgba(15, 15, 17, 0.96), rgba(222, 0, 67, 0.22) 45%, rgba(168, 203, 231, 0.18))',
      transform: 'translateY(100%)',
      willChange: 'transform'
    });

    document.body.appendChild(layer);
    return layer;
  };

  const animateOut = (nextUrl) => {
    if (!hasGsap || prefersReducedMotion) {
      window.location.assign(nextUrl);
      return;
    }

    const layer = createWipeLayer();

    window.gsap.to(document.body, {
      opacity: 0,
      duration: 0.25,
      ease: 'power1.out'
    });

    window.gsap.to(layer, {
      yPercent: 0,
      duration: 0.35,
      ease: 'power3.inOut',
      onComplete: () => window.location.assign(nextUrl)
    });
  };

  const scrollToElement = (element) => {
    if (!hasGsap || prefersReducedMotion || typeof window.ScrollToPlugin === 'undefined') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const nav = document.querySelector('.nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const offsetY = navHeight ? navHeight + 12 : 16;

    window.gsap.to(window, {
      duration: 0.85,
      scrollTo: {
        y: element,
        offsetY
      },
      ease: 'power2.out'
    });
  };

  const setupInternalNavigation = () => {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      if (
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        link.href.startsWith('mailto:') ||
        link.href.startsWith('tel:') ||
        link.href.startsWith('javascript:')
      ) {
        return;
      }

      let url;

      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const samePage = url.pathname === window.location.pathname && url.search === window.location.search;

      if (samePage) {
        const hash = url.hash;

        if (hash && hash !== '#') {
          const target = document.querySelector(hash);
          if (target) {
            event.preventDefault();
            scrollToElement(target);
          }
          return;
        }

        if (!hash || hash === '#') {
          event.preventDefault();
          scrollToElement(document.body);
        }

        return;
      }

      event.preventDefault();
      animateOut(url.href);
    });
  };

  const setupHomeSnap = () => {
    if (!document.body.classList.contains('home-shell')) return;

    const sections = Array.from(document.querySelectorAll('main > section'));
    if (!sections.length) return;

    // Only enable scroll-snap on larger screens to avoid jarring snaps on small scrolls
    const enableSnap = window.matchMedia('(min-width: 900px)').matches;
    if (enableSnap) {
      const main = document.querySelector('main');
      const nav = document.querySelector('.nav');
      const navHeight = nav ? nav.offsetHeight : 0;

      // Apply snap to the main container so elements above it (like a header) are not affected
      if (main) {
        main.style.scrollBehavior = 'smooth';
        main.style.scrollSnapType = 'y proximity';
        // Ensure snap aligns below the nav so the nav stays visible when scrolling
        main.style.scrollPaddingTop = `${navHeight + 8}px`;
      }

      sections.forEach((section) => {
        section.style.scrollSnapAlign = 'start';
      });
    }

    if (!hasGsap || prefersReducedMotion || typeof window.ScrollTrigger === 'undefined') return;

    sections.forEach((section) => {
      window.gsap.from(section, {
        opacity: 0,
        y: 44,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    const heroElements = ['.nav', '.hero .name', '.hero .bio', '.portrait-wrap', '.contact h2', '.buttons'];
    heroElements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (!element) return;

      window.gsap.from(element, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        delay: index * 0.04,
        ease: 'power2.out'
      });
    });

    const portrait = document.querySelector('.portrait-wrap');
    if (portrait) {
      window.gsap.to(portrait, {
        y: -26,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    const bgImage = document.querySelector('.bg-img');
    if (bgImage) {
      window.gsap.to(bgImage, {
        y: 64,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  };

  const setupProjectCardObserver = () => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!cards.length) return;

    const options = {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: 0.55
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('in-view');
        } else {
          el.classList.remove('in-view');
        }
      });
    }, options);

    cards.forEach((c) => observer.observe(c));

    // Fallback for scroll-only interactions when the pointer stays still.
    // Calculate the card closest to viewport center and mark it `in-view`.
    let rafPending = false;

    const updateNearestCard = () => {
      rafPending = false;
      const centerY = window.innerHeight / 2;
      let nearest = null;
      let nearestDistance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - centerY);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = card;
        }
      });

      if (nearest) {
        cards.forEach((c) => c.classList.toggle('in-view', c === nearest));
      }
    };

    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(updateNearestCard);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // run once to set initial state
    updateNearestCard();
  };

  const setupProjectCardTapState = () => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isTouchDevice) return;

    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        const alreadyActive = card.classList.contains('is-active');

        if (!alreadyActive) {
          event.preventDefault();
          cards.forEach((current) => current.classList.remove('is-active'));
          card.classList.add('is-active');
        }
      });
    });
  };

  const init = () => {
    animateIn();
    setupInternalNavigation();
    setupHomeSnap();
    setupProjectCardObserver();
    setupProjectCardTapState();

    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        animateIn();
      }
    });
  };

  ready(init);
})();