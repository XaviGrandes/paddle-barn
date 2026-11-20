// El castellano vive en el HTML; aquí solo el inglés. Al cargar se guarda el texto ES de cada [data-i18n].
const EN = {
  "nav.about": "About", "nav.activities": "Activities", "nav.spots": "Spots", "nav.boards": "Boards", "nav.contact": "Contact",
  "cta.book": "Book", "cta.bookNow": "Book your session", "cta.more": "See activities", "cta.wa": "Book on WhatsApp",
  "cta.ask": "Ask on WhatsApp", "cta.sunrise": "I want to see the sunrise",
  "hero.title": "Paddle in Barcelona",
  "hero.sub": "Paddle boarding and surfing two minutes from the sea. We open at 5:30 so you can watch the sun rise from the water.",
  "about.title": "About us",
  "about.f1.t": "Team", "about.f1.d": "Certified instructors who live the sea every day and teach at your pace, whether it's your first time or you already paddle.",
  "about.f2.t": "Gear", "about.f2.d": "SUP and surf boards, paddles, life vests and wetsuits included. Just bring your swimsuit.",
  "about.f3.t": "Steps from the sea", "about.f3.d": "We're in Barceloneta, two minutes from the beach. Walk out the door and you're in the water.",
  "act.title": "Activities",
  "act.rent.t": "Board rental", "act.rent.d": "SUP or surf boards by the hour. Grab a board and go paddle whenever you like.",
  "act.sup.t": "Paddle surf lessons", "act.sup.d": "Learn balance, paddling technique and sea safety with an instructor.",
  "act.surf.t": "Surf lessons", "act.surf.d": "From your first wave to sharpening your moves. Small groups.",
  "act.guided.t": "Sunrise & sunset tours", "act.guided.d": "Guided routes along the coast in the best light of the day. Our most requested experience.",
  "act.group.t": "Group activities", "act.group.d": "Birthdays, stag & hen parties, teams or friends. We tailor the outing to you.",
  "act.storage.t": "Storage & repair", "act.storage.d": "Leave your board with us by the beach and stop carrying it around. We repair it too.",
  "spots.title": "Where we paddle", "spots.sunrise": "Sunrise at sea",
  "boards.title": "Our boards",
  "boards.b1.t": "Inflatable SUP", "boards.b1.d": "Stable and light. Perfect for beginners and long tours.",
  "boards.b2.t": "Hard SUP", "boards.b2.d": "Faster and more precise. For those who already paddle and want to glide.",
  "boards.b3.t": "Surfboard", "boards.b3.d": "Softboards to learn on and performance boards for the wave days.",
  "sunrise.title": "Sunrise session",
  "sunrise.d": "We open at 5:30 every day. Calm sea, empty beach and the sun rising over the horizon while you paddle. There's no better way to start a day in Barcelona.",
  "info.hours.t": "Opening hours", "info.hours.d": "Every day, 5:30 to 20:00",
  "info.access.t": "Accessibility", "info.access.d": "Wheelchair-accessible restroom and gender-neutral restroom.",
  "info.pay.t": "Payments", "info.pay.d": "Credit card, debit card and NFC mobile payments.",
  "foot.follow": "Follow us", "foot.followD": "Photos from every outing, sea conditions and news.",
  "foot.contact": "Contact", "foot.where": "Find us", "foot.directions": "Get directions →",
  "wa.general": "Hi Paddle Barn! I'd like some info to book.", "wa.activity": "Hi Paddle Barn! I'd like to book: ",
  "status.open": "Open now", "status.closed": "Closed now · opens at 5:30"
};

const ES_EXTRA = {
  "wa.general": "¡Hola Paddle Barn! Me gustaría información para reservar.", "wa.activity": "¡Hola Paddle Barn! Me gustaría reservar: ",
  "status.open": "Abierto ahora", "status.closed": "Cerrado ahora · abrimos a las 5:30"
};

const i18nEls = document.querySelectorAll("[data-i18n]");
const ES = { ...ES_EXTRA };
i18nEls.forEach(el => { ES[el.dataset.i18n] ??= el.textContent; });

let lang = "es";
const t = key => (lang === "en" ? EN : ES)[key] ?? ES[key] ?? key;

function setLang(next) {
  lang = next === "en" ? "en" : "es";
  document.documentElement.lang = lang;
  i18nEls.forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  try { localStorage.setItem("pb-lang", lang); } catch {}
  document.dispatchEvent(new Event("langchange"));
}

let saved = null;
try { saved = localStorage.getItem("pb-lang"); } catch {}
setLang(saved || (navigator.language.startsWith("es") || navigator.language.startsWith("ca") ? "es" : "en"));
document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
