 // nav & footer includen + robuuste mobiele toggle
    Promise.all([
      fetch("nav.html").then(res => res.text()),
      fetch("footer.html").then(res => res.text())
    ]).then(([navHtml, footerHtml]) => {
      document.getElementById("nav-placeholder").innerHTML = navHtml;
      document.getElementById("footer-placeholder").innerHTML = footerHtml;
    });

    // Scroll smooth naar tagline (fix: uniek target-id)
    document.getElementById("tag")?.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("tagline");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });

    // init unicorn
    document.addEventListener('DOMContentLoaded', () => {
      if (window.UnicornStudio && typeof UnicornStudio.init === 'function') {
        UnicornStudio.init();
      }
    });

    AOS.init({ duration: 1000, once: true });

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);
      const bar = document.getElementById('progress-bar');
      if (bar) bar.style.width = scrollPercent + "%";
    });
    // on hover van project card, display:none voor de cover-image 
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const coverImage = card.querySelector('.cover-image');
        if (coverImage) coverImage.style.display = 'none';
      });
      card.addEventListener('mouseleave', () => {
        const coverImage = card.querySelector('.cover-image');
        if (coverImage) coverImage.style.display = 'block';
      });
    });


    window.addEventListener("load", () => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("content").style.display = "block";
    });