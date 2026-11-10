// Next Plus · interazioni
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const header = $("#header");

  // Menu del test nell'header
  const test = $("#test"), testBtn = $("#test-btn");
  testBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = test.classList.toggle("is-open");
    testBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => { if (!test.contains(e.target)) { test.classList.remove("is-open"); testBtn.setAttribute("aria-expanded", false); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { test.classList.remove("is-open"); closeDrawer(); } });

  // Menu mobile
  const burger = $("#burger"), drawer = $("#drawer");
  const closeDrawer = () => { drawer.hidden = true; burger.setAttribute("aria-expanded", false); document.body.style.overflow = ""; };
  burger.addEventListener("click", () => {
    const open = drawer.hidden;
    drawer.hidden = !open;
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$("#drawer a").forEach((a) => a.addEventListener("click", closeDrawer));

  // Sezione attiva: evidenziata nell'header (desktop) e scritta sotto l'header (mobile)
  const sections = $$("main section[data-title]");
  const navLinks = $$("[data-nav]");
  const where = $("#where"), whereBar = $("#where-bar");
  const mobilebar = $(".mobilebar");
  function onScroll() {
    const y = scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    let current = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.35) current = s;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${current.id}`));
    if (where.textContent !== current.dataset.title) where.textContent = current.dataset.title;
    const max = document.documentElement.scrollHeight - innerHeight;
    whereBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    // la barra in basso compare dopo la prima schermata, sparisce sul modulo
    const form = $("#contatti").getBoundingClientRect();
    mobilebar.classList.toggle("is-on", y > innerHeight * 0.6 && form.top > innerHeight * 0.6);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // «Chiedi informazioni» su un corso: scende al modulo con il corso già scelto
  const corso = $("#corso"), form = $("#form");
  $$("[data-course]").forEach((b) => b.addEventListener("click", () => {
    corso.value = b.dataset.course;
    $("#contatti").scrollIntoView({ behavior: "smooth" });
    form.classList.remove("is-highlight"); void form.offsetWidth; form.classList.add("is-highlight");
    setTimeout(() => $("input[name=nome]").focus({ preventScroll: true }), 700);
  }));

  // Modulo: controllo dei campi. È un'anteprima: va collegato al modulo del sito (Contact Form 7).
  const msg = $("#form-msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("input[required], select[required]", form).forEach((f) => {
      const bad = f.type === "checkbox" ? !f.checked : !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      (f.type === "checkbox" ? f.parentElement : f).classList.toggle("is-error", bad);
      if (bad) ok = false;
    });
    msg.className = "form__msg " + (ok ? "ok" : "err");
    msg.textContent = ok ? "Grazie! Questa è un'anteprima: sul sito vero la richiesta arriverà a plus@nextschool.it." : "Controlla i campi evidenziati.";
  });

  // Comparsa morbida
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }), { threshold: 0.15 });
  $$(".course__head, .item, .nudge, .steps li, .why__list li, .form, .contact__info").forEach((el, i) => {
    el.classList.add("reveal"); el.style.transitionDelay = `${(i % 3) * 0.08}s`; io.observe(el);
  });
})();
