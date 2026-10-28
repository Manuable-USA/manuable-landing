(function () {
  var header = document.querySelector('.lp-header');
  var burger = document.querySelector('.lp-burger');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Alto del header fijo, para que las secciones no queden tapadas al hacer scroll.
  function syncHeaderHeight() {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  burger.addEventListener('click', function () {
    setMenu(!header.classList.contains('is-open'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Scroll suave a cada sección desde cualquier enlace interno (menú, footer, CTAs).
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    var top = id === 'inicio' ? 0 : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    history.pushState(null, '', '#' + id);
  });

  // Resalta en el menú la sección visible.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.navlink[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(function (s, i, arr) { return s && arr.indexOf(s) === i; })
    .sort(function (a, b) { return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });

  function updateActive() {
    var offset = header.offsetHeight + 24;
    var current = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top - offset <= 0) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
    header.classList.toggle('is-scrolled', window.scrollY > 4);
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) setMenu(false);
    syncHeaderHeight();
  });

  syncHeaderHeight();
  updateActive();
})();
