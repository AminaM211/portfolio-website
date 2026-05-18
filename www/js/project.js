// ---- AOS Initialisatie ----
AOS.init({
    duration: 1000, // animatie duurtijd in ms
    once: true      // animatie maar één keer afspelen
});

// ---- Navigatie en Footer Includen ----
Promise.all([
    fetch("nav.html").then(res => res.text()),
    fetch("footer.html").then(res => res.text())
]).then(([navHtml, footerHtml]) => {
    document.getElementById("nav-placeholder").innerHTML = navHtml;
    document.getElementById("footer-placeholder").innerHTML = footerHtml;
});

// ---- Scroll Progress Bar ----
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('progress-bar').style.width = scrollPercent + "%";
});

// ---- Hero en TOC Scroll Functionaliteit ----
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero2');
    const toc = document.querySelector('.toc1');

    if (window.scrollY > hero.scrollHeight - 200) {
        toc.classList.add('black');
    } else {
        toc.classList.remove('black');
    }
});

// ---- TOC Boven de Footer Houden ----
const tocEl = document.querySelector('.toc1');
const footerEl = document.getElementById('footer-placeholder');

function stickToc() {
    if (!tocEl || !footerEl) return;

    const footerTopInView = footerEl.getBoundingClientRect().top;
    const overlap = window.innerHeight - footerTopInView - 50;

    if (overlap > 0) {
        tocEl.style.top = 'auto';          
        tocEl.style.bottom = overlap + 'px';
    } else {
        tocEl.style.bottom = 'auto';
        tocEl.style.top = '';
    }
}

window.addEventListener('scroll', stickToc, { passive: true });
window.addEventListener('resize', stickToc);
stickToc();

