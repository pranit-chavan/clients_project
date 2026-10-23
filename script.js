/* Bhagwati Egg'swala — site interactions */

// Mobile nav
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

mainNav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Product catalog search, audience filters and useful pack-size sorting.
const catalog = document.querySelector(".products-page .pack-grid");
if (catalog) {
  const cards = Array.from(catalog.querySelectorAll(".pack"));
  const search = document.getElementById("productSearch");
  const sort = document.getElementById("productSort");
  const count = document.getElementById("catalogCount");
  const empty = document.getElementById("catalogEmpty");
  let activeFilter = "all";

  const renderCatalog = () => {
    const term = search.value.trim().toLowerCase();
    cards.forEach((card) => {
      const matchesFilter = activeFilter === "all" || card.dataset.audience === activeFilter;
      const matchesSearch = card.dataset.search.includes(term);
      card.hidden = !(matchesFilter && matchesSearch);
    });
    const ordered = cards.slice().sort((a, b) => Number(a.dataset.count) - Number(b.dataset.count));
    if (sort.value === "high") ordered.reverse();
    ordered.forEach((card) => catalog.appendChild(card));
    const visible = cards.filter((card) => !card.hidden).length;
    count.textContent = `Showing ${visible} ${visible === 1 ? "pack" : "packs"}`;
    empty.hidden = visible !== 0;
  };

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-chip").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      renderCatalog();
    });
  });
  search.addEventListener("input", renderCatalog);
  sort.addEventListener("change", renderCatalog);
  document.getElementById("resetCatalog").addEventListener("click", () => {
    search.value = "";
    sort.value = "default";
    activeFilter = "all";
    document.querySelector('[data-filter="all"]').click();
    search.focus();
  });
}

// WhatsApp order form — builds a prefilled message, no server needed
const WA_NUMBER = "918263059370";

const waForm = document.getElementById("waForm");
if (waForm) {
  waForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("waName").value.trim() || "Customer";
    const pack = document.getElementById("waPack").value;
    const msg = document.getElementById("waMsg").value.trim();

    let text = `Hi Bhagwati Egg'swala! I am ${name}.\nI want to order: ${pack}`;
    if (msg) text += `\nArea / note: ${msg}`;
    text += "\nPlease share delivery details.";

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  });
}

// Reviews slider — slides, arrows, dots, autoplay
const reviewsTrack = document.querySelector(".reviews-track");

if (reviewsTrack) {
  const slides = Array.from(reviewsTrack.children);
  const prevBtn = document.querySelector(".rv-prev");
  const nextBtn = document.querySelector(".rv-next");
  const dotsWrap = document.querySelector(".rv-dots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let timer = null;

  const perView = () => (window.innerWidth <= 760 ? 1 : 2);
  const maxIndex = () => Math.max(0, slides.length - perView());

  function renderDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show reviews page ${i + 1}`);
      dot.addEventListener("click", () => {
        go(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    const offset = slides[index].offsetLeft - slides[0].offsetLeft;
    reviewsTrack.style.transform = `translateX(${-offset}px)`;
    Array.from(dotsWrap.children).forEach((dot, i) =>
      dot.classList.toggle("active", i === index)
    );
  }

  function go(i) {
    index = Math.max(0, Math.min(i, maxIndex()));
    update();
  }

  function next() {
    go(index >= maxIndex() ? 0 : index + 1);
  }
  function prev() {
    go(index <= 0 ? maxIndex() : index - 1);
  }

  function restart() {
    clearInterval(timer);
    if (!reduceMotion.matches && !document.hidden) timer = setInterval(next, 5000);
  }

  prevBtn.addEventListener("click", () => { prev(); restart(); });
  nextBtn.addEventListener("click", () => { next(); restart(); });

  const slider = document.querySelector(".reviews-slider");
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", restart);
  slider.addEventListener("focusin", () => clearInterval(timer));
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget)) restart();
  });
  document.addEventListener("visibilitychange", restart);
  reduceMotion.addEventListener?.("change", restart);

  window.addEventListener("resize", () => {
    renderDots();
    go(Math.min(index, maxIndex()));
  });

  renderDots();
  update();
  restart();
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
