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
