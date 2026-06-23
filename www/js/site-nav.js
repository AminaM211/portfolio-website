(() => {
  const resumeHref = 'https://amina-moutalibova.be/images/resume.pdf';
  const links = [
    { key: 'projects', href: 'projects.html', label: 'Projects' },
    { key: 'contact', href: 'contact.html', label: 'Contact' },
    { key: 'resume', href: resumeHref, label: 'Open Resume', external: true }
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
      ? '<span class="resume-text resume-text--mobile">Resume</span><span class="resume-text resume-text--desktop">Open Resume</span>'
      : link.label;
    return '<a' + classAttr + ' href="' + link.href + '"' + currentAttr + targetAttr + '>' + label + '</a>';
  }

  function renderDefault(logo, activeKey) {
    return [
      '<header class="nav">',
      '  <div class="logo" aria-label="logo"><a href="index.html"><img src="./images/vectors/logo-' + logo + '.svg" alt="Amina Moutalibova logo"></a></div>',
      '  <nav class="nav-links" aria-label="Main navigation">',
      '    ' + links.map((link) => navLink(link, activeKey, 'default')).join(''),
      '  </nav>',
      '</header>'
    ].join('');
  }

  function renderCaseStudy(activeKey) {
    return [
      '<header class="case-nav">',
      '  <a class="case-logo" href="index.html" aria-label="Amina Moutalibova home">',
      '    <img src="./images/vectors/logo-black.svg" alt="Amina Moutalibova logo">',
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
})();
