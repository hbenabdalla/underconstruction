/* ==========================================================================
   KBM — IBM Software Solutions · Site interactions
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    initHeaderScroll();
    initMobileNav();
    initSmoothAnchors();
    initScrollReveal();
    initAccordion();
    initCountUp();
    initMarquee();
  }

  /* ---- Footer year ---- */
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---- Sticky header background on scroll ---- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var toggle = function () {
      if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  function initMobileNav() {
    var btn = document.getElementById("navToggle");
    var nav = document.getElementById("navPrimary");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        btn.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Smooth-scroll for in-page anchors (with fixed-header offset) ---- */
  function initSmoothAnchors() {
    var headerEl = document.getElementById("siteHeader");
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = headerEl ? headerEl.offsetHeight + 8 : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ---- Reveal-on-scroll via IntersectionObserver ---- */
  function initScrollReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Capabilities accordion ---- */
  function initAccordion() {
    var list = document.getElementById("capList");
    if (!list) return;
    var items = list.querySelectorAll(".cap-item");

    items.forEach(function (item) {
      var trigger = item.querySelector(".cap-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (other) { other.classList.remove("is-open"); });
        if (!isOpen) item.classList.add("is-open");
      });
    });

    // Open the first item by default for an inviting first impression
    if (items.length) items[0].classList.add("is-open");
  }

  /* ---- Count-up numbers in the stat strip ---- */
  function initCountUp() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1200;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---- Duplicate marquee content for a seamless infinite loop ---- */
  function initMarquee() {
    var track = document.getElementById("marqueeTrack");
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }
})();
