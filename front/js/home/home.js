/* ===========================================================
   Whitebox — Home (portfólio de João Pedro)
   JavaScript Vanilla. Responsabilidades:
   - Alternância de tema (persistida + respeita o sistema)
   - Menu mobile acessível
   - Destaque da seção ativa na navegação
   - Ano automático no rodapé
   =========================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "wb-theme";

  /* ---------- Tema ---------- */
  var themeToggle = document.getElementById("theme-toggle");

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
    }
  } catch (e) {
    /* localStorage indisponível (ex.: modo privado) — segue sem persistir */
  }

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncToggle() {
    if (!themeToggle) return;
    var isDark = currentTheme() === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
  }

  if (themeToggle) {
    syncToggle();
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      syncToggle();
    });
  }

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("nav--open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("nav--open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------- Seção ativa na navegação ---------- */
  var navLinks = {};
  if (nav) {
    var links = nav.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      navLinks[links[i].getAttribute("href").slice(1)] = links[i];
    }
  }

  var sections = document.querySelectorAll("main section[id]");
  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        for (var id in navLinks) {
          if (Object.prototype.hasOwnProperty.call(navLinks, id)) {
            navLinks[id].classList.remove("is-active");
          }
        }
        var active = navLinks[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Ano no rodapé ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
