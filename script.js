(function () {
    "use strict";

    var header = document.getElementById("site-header");
    var menuBtn = document.getElementById("menu-btn");
    var navLinks = document.getElementById("nav-links");
    var links = navLinks.querySelectorAll("a");
    var mobileQuery = window.matchMedia("(max-width: 860px)");

    /* ---------- Mobile menu ---------- */
    function setMenu(open) {
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        navLinks.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
    }

    menuBtn.addEventListener("click", function () {
        setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });

    links.forEach(function (link) {
        link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
            setMenu(false);
            menuBtn.focus();
        }
    });

    function onBreakpoint(e) { if (!e.matches) setMenu(false); }
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", onBreakpoint);
    else mobileQuery.addListener(onBreakpoint);

    /* ---------- Header background on scroll ---------- */
    function onScroll() {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- Highlight the current section in the nav ---------- */
    var sections = document.querySelectorAll("main section[id]");
    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) {
                    var active = link.getAttribute("href") === "#" + entry.target.id;
                    link.classList.toggle("is-active", active && !link.classList.contains("nav-cta"));
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        sections.forEach(function (s) { observer.observe(s); });
    }

    /* ---------- Contact form ---------- */
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, message) {
        var field = input.closest(".field");
        field.classList.toggle("has-error", Boolean(message));
        document.getElementById(input.id + "-error").textContent = message || "";
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate(input) {
        var value = input.value.trim();
        var message = "";
        if (!value) message = "Enter your " + input.name + ".";
        else if (input.type === "email" && !emailPattern.test(value)) message = "Enter a valid email address.";
        else if (input.name === "message" && value.length < 10) message = "Write at least 10 characters.";
        setError(input, message);
        return !message;
    }

    var inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(function (input) {
        input.addEventListener("blur", function () { validate(input); });
        input.addEventListener("input", function () {
            if (input.closest(".field").classList.contains("has-error")) validate(input);
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        status.textContent = "";
        status.style.color = "";

        var firstInvalid = null;
        inputs.forEach(function (input) {
            if (!validate(input) && !firstInvalid) firstInvalid = input;
        });

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        /* Replace this block with a real fetch() to your form endpoint. */
        form.reset();
        status.textContent = "Message sent. We'll reply within one business day.";
    });

    /* ---------- Footer year ---------- */
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
})();
