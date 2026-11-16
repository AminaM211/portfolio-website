(() => {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const isEnglishFolder = /(?:^|\/)en\//.test(window.location.pathname);
  const pagePrefix = isEnglishFolder ? '../' : './';
  const hasExistingLangSwitcher = !!document.querySelector('.lang-switcher');
  const langScrollKey = 'portfolio-lang-scroll-position';

  const restoreScrollPosition = () => {
    try {
      const savedScroll = Number(localStorage.getItem(langScrollKey));
      if (!Number.isFinite(savedScroll) || savedScroll < 0) {
        localStorage.removeItem(langScrollKey);
        return;
      }

      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: 'auto' });
      });

      setTimeout(() => {
        window.scrollTo({ top: savedScroll, behavior: 'auto' });
      }, 60);

      localStorage.removeItem(langScrollKey);
    } catch (error) {
      console.warn('Language switch scroll restore blocked:', error);
    }
  };

  const navLabels = isEnglishFolder
    ? {
        projects: 'Projects',
        contact: 'Contact',
        resume: 'Open Resume',
        resumeMobile: 'Resume'
      }
    : {
        projects: 'Projecten',
        contact: 'Contact',
        resume: 'CV openen',
        resumeMobile: 'CV'
      };

  const langSwitcherStyleId = 'lang-switcher-style';
  if (!document.getElementById(langSwitcherStyleId)) {
    const style = document.createElement('style');
    style.id = langSwitcherStyleId;
    style.textContent = `
      .lang-switcher {
        position: fixed !important;
        top: 16px;
        right: 18px;
        left: auto;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(21, 21, 21, 0.1);
        backdrop-filter: blur(4px);
      }
      .lang-switcher a,
      .lang-switcher span {
        color: #1d1d1d;
        text-decoration: none;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .lang-switcher a[aria-current="page"] {
        color: var(--accent, #de0043);
      }
      .lang-switcher span {
        opacity: 0.7;
      }
    `;
    document.head.appendChild(style);
  }

  const ensureVisibleLangSwitcher = () => {
    document.querySelectorAll('.lang-switcher').forEach((switcher) => {
      switcher.style.position = 'fixed';
      switcher.style.top = '16px';
      switcher.style.right = '18px';
      switcher.style.left = 'auto';
      switcher.style.zIndex = '2147483647';
      switcher.style.display = 'flex';
      switcher.style.alignItems = 'center';
      switcher.style.gap = '8px';
      switcher.style.padding = '8px 12px';
      switcher.style.borderRadius = '8px';
      switcher.style.background = 'rgba(255, 255, 255, 0.5)';
      switcher.style.border = '1px solid rgba(21, 21, 21, 0.1)';
      switcher.style.backdropFilter = 'blur(3px)';
    });
  };

  const languageLinks = isEnglishFolder
    ? { nl: '../' + currentFile, en: currentFile }
    : { nl: currentFile, en: 'en/' + currentFile };

  const createFloatingLanguageSwitcher = () => {
    if (document.querySelector('.lang-switcher')) {
      ensureVisibleLangSwitcher();
      return;
    }

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.innerHTML = [
      '<a href="' + languageLinks.nl + '" ' + (isEnglishFolder ? '' : 'aria-current="page"') + '>NL</a>',
      '<span aria-hidden="true">/</span>',
      '<a href="' + languageLinks.en + '" ' + (isEnglishFolder ? 'aria-current="page"' : '') + '>EN</a>'
    ].join('');

    document.body.appendChild(switcher);
    ensureVisibleLangSwitcher();
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('.lang-switcher a');
    if (!link) return;

    try {
      localStorage.setItem(langScrollKey, String(window.scrollY || window.pageYOffset || 0));
    } catch (error) {
      console.warn('Language switch scroll save blocked:', error);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreScrollPosition, { once: true });
  } else {
    restoreScrollPosition();
  }

  const resumeHref = 'https://aminam211.github.io/portfolio-website/www/images/resume.pdf';
  const links = [
    { key: 'projects', href: pagePrefix + 'projects.html', label: navLabels.projects },
    { key: 'contact', href: pagePrefix + 'contact.html', label: navLabels.contact },
    { key: 'resume', href: resumeHref, label: navLabels.resume, external: true }
  ];

  function navLink(link, activeKey, variant) {
    const isResume = link.key === 'resume';
    const isActive = activeKey === link.key;
    const classes = [];
    if (variant === 'default') classes.push('primary');
    if (isActive && variant === 'default') classes.push('active');
    const classAttr = classes.length ? ' class="' + classes.join(' ') + '"' : '';
    const currentAttr = isActive && !isResume ? ' aria-current="page"' : '';
    const targetAttr = isResume ? ' target="_blank" rel="noreferrer"' : '';
    const label = isResume
      ? '<span class="resume-text resume-text--mobile">' + navLabels.resumeMobile + '</span><span class="resume-text resume-text--desktop">' + navLabels.resume + '</span>'
      : link.label;
    return '<a' + classAttr + ' href="' + link.href + '"' + currentAttr + targetAttr + '>' + label + '</a>';
  }

  function renderDefault(logo, activeKey) {
    return [
      '<header class="nav">',
      '  <div class="logo" aria-label="logo"><a href="' + pagePrefix + 'index.html"><img src="' + pagePrefix + 'images/vectors/logo-' + logo + '.svg" alt="Amina Moutalibova logo"></a></div>',
      '  <nav class="nav-links" aria-label="Main navigation">',
      '    ' + links.map((link) => navLink(link, activeKey, 'default')).join(''),
      '  </nav>',
      '</header>'
    ].join('');
  }

  function renderCaseStudy(activeKey) {
    return [
      '<header class="case-nav">',
      '  <a class="case-logo" href="' + pagePrefix + 'index.html" aria-label="Amina Moutalibova home">',
      '    <img src="' + pagePrefix + 'images/vectors/logo-black.svg" alt="Amina Moutalibova logo">',
      '  </a>',
      '  <nav class="case-nav__links" aria-label="Main navigation">',
      '    ' + links.map((link) => navLink(link, activeKey, 'case-study')).join(''),
      '  </nav>',
      '</header>'
    ].join('');
  }

  const renderers = {
    default: renderDefault,
    'case-study': renderCaseStudy
  };

  document.querySelectorAll('[data-site-nav]').forEach((slot) => {
    const variant = slot.dataset.navVariant || 'default';
    const logo = slot.dataset.navLogo || 'black';
    const active = slot.dataset.navActive || '';
    const render = renderers[variant] || renderDefault;
    if (variant === 'default') {
      slot.outerHTML = render(logo, active);
      return;
    }
    slot.outerHTML = render(active);
  });

  createFloatingLanguageSwitcher();
})();
