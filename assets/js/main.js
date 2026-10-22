/* ==========================================================================
   H2O Cleaning Services — site behaviour
   1. Small helpers          5. Before / after sliders
   2. Header + mobile menu   6. "Our work" tabs
   3. Scroll reveals         7. Quote buttons -> pre-select a service
   4. Mobile sticky bar      8. Quote form (FormSubmit AJAX)
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- 1. Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 2. Header shadow + mobile menu ---------- */
  const header = $("#siteHeader");
  const onScrollHeader = () => header && header.classList.toggle("shadow-[0_8px_24px_-12px_rgba(2,24,69,.6)]", window.scrollY > 10);
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  const menu = $("#mobileMenu");
  const openBtn = $("#menuOpen");
  const closeBtn = $("#menuClose");

  const openMenu = () => {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
    document.body.style.overflow = "hidden";
    openBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => menu.classList.add("menu-open"));
    closeBtn.focus();
  };
  const closeMenu = () => {
    menu.classList.remove("menu-open", "flex");
    menu.classList.add("hidden");
    document.body.style.overflow = "";
    openBtn.setAttribute("aria-expanded", "false");
  };
  if (menu && openBtn && closeBtn) {
    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", () => { closeMenu(); openBtn.focus(); });
    $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.classList.contains("hidden")) { closeMenu(); openBtn.focus(); } });
  }

  /* ---------- 3. Scroll reveals ---------- */
  const revealEls = $$("[data-reveal], .steps-line");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("steps-line")) entry.target.classList.replace("scale-x-0", "scale-x-100");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => { el.classList.add("is-visible"); el.classList.replace("scale-x-0", "scale-x-100"); });
  }

  /* ---------- 4. Mobile sticky Call / Quote bar ---------- */
  const sticky = $("#stickyBar");
  const hero = $("#top");
  const quote = $("#quote");
  let quoteInView = false;
  const updateSticky = () => {
    if (!sticky || !hero) return;
    const pastHero = window.scrollY > hero.offsetHeight * 0.7;
    const show = pastHero && !quoteInView;
    sticky.classList.toggle("translate-y-[150%]", !show);
  };
  if (quote && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { quoteInView = e.isIntersecting; updateSticky(); }, { threshold: 0.15 }).observe(quote);
  }
  window.addEventListener("scroll", updateSticky, { passive: true });
  updateSticky();

  /* ---------- 5. Before / after sliders ---------- */
  const sliders = $$("[data-ba]").map((el) => {
    const range = $('input[type="range"]', el);
    let dragging = false;
    let introRunning = false;

    const set = (pct) => {
      const v = Math.max(0, Math.min(100, pct));
      el.style.setProperty("--pos", v + "%");
      if (range) range.value = Math.round(v);
    };
    const fromPointer = (e) => {
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };

    el.addEventListener("pointerdown", (e) => {
      introRunning = false;
      dragging = true;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);
      fromPointer(e);
    });
    el.addEventListener("pointermove", (e) => { if (dragging) fromPointer(e); });
    const stop = () => { dragging = false; el.classList.remove("is-dragging"); };
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);
    if (range) range.addEventListener("input", () => { introRunning = false; set(+range.value); });

    // Hero "squeegee" sweep: dirty -> clean, once, then hand over to the visitor
    const intro = () => {
      if (reduceMotion) return set(50);
      set(100);
      introRunning = true;
      const from = 100, to = 32, dur = 1700, start = performance.now() + 900;
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        if (!introRunning) return;
        const t = Math.max(0, Math.min(1, (now - start) / dur));
        set(from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(tick); else introRunning = false;
      };
      requestAnimationFrame(tick);
    };

    if (el.hasAttribute("data-intro")) intro(); else set(50);
    return { el, set };
  });

  /* ---------- 6. "Our work" tabs ---------- */
  const tabs = $$(".work-tab");
  const selectTab = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    if (panel && !reduceMotion) panel.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" });
    // reset that panel's slider to the middle
    const s = sliders.find((x) => panel && panel.contains(x.el));
    if (s) s.set(50);
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next, true);
    });
  });

  /* ---------- 7. "Quote for this" buttons pre-select a service ---------- */
  $$("[data-quote-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-quote-service");
      const box = $$('#serviceChips input[name="service"]').find((i) => i.value === value);
      if (box) {
        box.checked = true;
        const chip = box.nextElementSibling;
        if (chip && !reduceMotion) chip.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 500, delay: 650 });
      }
      quote.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      setTimeout(() => $("#f-name")?.focus({ preventScroll: true }), 700);
    });
  });

  /* ---------- 8. Quote form ---------- */
  const form = $("#quoteForm");
  const success = $("#formSuccess");
  const errorBox = $("#formError");
  const submitBtn = $("#quoteSubmit");

  const fieldError = (input, show) => {
    input.classList.toggle("is-invalid", show);
    input.setAttribute("aria-invalid", show);
    const msg = input.parentElement.querySelector(".field-error");
    if (msg) msg.classList.toggle("hidden", !show);
  };
  const validate = () => {
    const name = $("#f-name"), phone = $("#f-phone"), email = $("#f-email");
    const checks = [
      [name, name.value.trim().length > 1],
      [phone, phone.value.replace(/[^\d+]/g, "").length >= 6],
      [email, !email.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
    ];
    checks.forEach(([el, ok]) => fieldError(el, !ok));
    const firstBad = checks.find(([, ok]) => !ok);
    if (firstBad) firstBad[0].focus();
    return !firstBad;
  };
  const setLoading = (on) => {
    submitBtn.disabled = on;
    $(".btn-label", submitBtn).textContent = on ? "Sending…" : "Send quote request";
    $(".btn-icon", submitBtn).classList.toggle("hidden", on);
    $(".btn-spinner", submitBtn).classList.toggle("hidden", !on);
  };

  if (form) {
    $$("input, textarea", form).forEach((el) => el.addEventListener("input", () => fieldError(el, false)));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.classList.add("hidden");
      if (!validate()) return;

      const data = new FormData(form);
      if (data.get("_honey")) return showSuccess(); // bot filled the hidden field

      // tidy the email: one "Services" line instead of repeated checkboxes
      const services = data.getAll("service");
      data.delete("service");
      data.set("services", services.length ? services.join(", ") : "Not specified");
      if (!data.get("email")) data.delete("_autoresponse");

      setLoading(true);
      try {
        const endpoint = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
        const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: data });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) !== "true") throw new Error(json.message || "Request failed");
        showSuccess();
      } catch (err) {
        errorBox.textContent = "Your request didn't send. Check your connection and try again, or call us on 07781 417777.";
        errorBox.classList.remove("hidden");
      } finally {
        setLoading(false);
      }
    });
  }

  function showSuccess() {
    form.classList.add("hidden");
    success.classList.remove("hidden");
    success.focus();
  }
  $("#formReset")?.addEventListener("click", () => {
    form.reset();
    success.classList.add("hidden");
    form.classList.remove("hidden");
    $("#f-name").focus();
  });
})();
