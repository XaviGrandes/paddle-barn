const PHONE = "34651634586";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Header sólido + menú móvil ---------- */
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const toggleMenu = open => {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));

/* ---------- Título del hero letra a letra ---------- */
function splitLetters() {
  document.querySelectorAll("[data-split]").forEach(el => {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(" ").map((word, w) =>
      `<span style="white-space:nowrap" aria-hidden="true">${[...word].map((c, i) =>
        `<span class="ch" style="--n:${w * 6 + i}">${c}</span>`).join("")}</span>`
    ).join(" ");
  });
}

/* ---------- Enlaces de WhatsApp con mensaje según actividad e idioma ---------- */
function updateWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach(a => {
    const key = a.dataset.wa;
    const msg = key ? t("wa.activity") + t(key) : t("wa.general");
    a.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  });
}

/* ---------- Abierto / cerrado (hora de Madrid, 5:30–20:00 todos los días) ---------- */
function isOpenAt(h, m) {
  const mins = h * 60 + m;
  return mins >= 5 * 60 + 30 && mins < 20 * 60;
}
console.assert(isOpenAt(5, 30) && isOpenAt(19, 59) && !isOpenAt(5, 29) && !isOpenAt(20, 0), "isOpenAt");

function updateStatus() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const get = type => +parts.find(p => p.type === type).value;
  const open = isOpenAt(get("hour"), get("minute"));
  const el = document.getElementById("status");
  el.classList.toggle("open", open);
  el.textContent = t(open ? "status.open" : "status.closed");
}

function onLang() { splitLetters(); updateWhatsApp(); updateStatus(); }
document.addEventListener("langchange", onLang);
onLang();
setInterval(updateStatus, 60000);
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Slider del hero ---------- */
const slides = document.querySelectorAll(".slide");
const thumbs = document.querySelectorAll(".thumbs button");
const progress = document.getElementById("progress");
const counter = document.getElementById("counter");
const DURATION = 6000;
let current = 0, timer;

function goTo(i) {
  slides[current].classList.remove("is-active");
  thumbs[current].classList.remove("is-active");
  current = (i + slides.length) % slides.length;
  slides[current].classList.add("is-active");
  thumbs[current].classList.add("is-active");
  counter.textContent = String(current + 1).padStart(2, "0");
  if (reduceMotion) return;
  progress.classList.remove("run");
  void progress.offsetWidth; // reinicia la animación de la barra
  progress.style.setProperty("--dur", DURATION + "ms");
  progress.classList.add("run");
  clearTimeout(timer);
  timer = setTimeout(() => goTo(current + 1), DURATION);
}
thumbs.forEach((b, i) => b.addEventListener("click", () => goTo(i)));
goTo(0);

/* ---------- Reveal al hacer scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---------- Texto fantasma + header al hacer scroll ---------- */
const ghosts = document.querySelectorAll(".ghost");
let ticking = false;
function onScroll() {
  header.classList.toggle("is-solid", scrollY > 60);
  if (!reduceMotion) {
    ghosts.forEach(g => {
      const r = g.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const progress = (innerHeight - r.top) / (innerHeight + r.height); // 0 → 1 mientras la sección cruza la pantalla
      g.style.setProperty("--shift", `${(0.5 - progress) * 40}vw`);
    });
  }
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- Carrusel de spots ---------- */
const track = document.getElementById("track");
const step = () => track.querySelector(".spot").offsetWidth + 28;
document.querySelector(".arrow.prev").addEventListener("click", () => track.scrollBy({ left: -step() }));
document.querySelector(".arrow.next").addEventListener("click", () => {
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
  track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step() });
});
