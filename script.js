(function () {
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  var backdrop = document.getElementById("nav-backdrop");
  var yearEl = document.getElementById("year");
  var header = document.querySelector(".site-header");
  var savedScrollY = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var logo = document.querySelector(".logo--enter");
  if (logo) {
    if (reduceMotion) {
      logo.classList.add("is-ready");
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          logo.classList.add("is-ready");
        });
      });
    }
  }

  var hero = document.querySelector(".hero");
  var heroGrid = document.getElementById("hero-grid");
  var mqParallax = window.matchMedia("(min-width: 901px)");
  if (hero && heroGrid && !reduceMotion) {
    function parallaxVars(mx, my) {
      heroGrid.style.setProperty("--mx", String(mx));
      heroGrid.style.setProperty("--my", String(my));
    }
    hero.addEventListener(
      "mousemove",
      function (e) {
        if (!mqParallax.matches) return;
        var r = hero.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        var my = ((e.clientY - r.top) / r.height - 0.5) * 2;
        parallaxVars(mx, my);
      },
      { passive: true }
    );
    hero.addEventListener("mouseleave", function () {
      parallaxVars(0, 0);
    });
    mqParallax.addEventListener("change", function () {
      if (!mqParallax.matches) parallaxVars(0, 0);
    });
  }

  /* Scroll reveal */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll("[data-reveal]");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  /* Header shadow on scroll */
  function updateHeaderScroll() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    header.classList.toggle("is-scrolled", y > 12);
  }
  if (header) {
    updateHeaderScroll();
    window.addEventListener("scroll", updateHeaderScroll, { passive: true });
  }

  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    menu.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("nav-drawer-open", open);

    if (backdrop) {
      backdrop.hidden = !open;
      backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }

    if (open) {
      savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = "-" + savedScrollY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScrollY);
    }
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setOpen(false);
      toggle.focus();
    });
  }

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 961px)").matches) {
      setOpen(false);
    }
  });
})();
