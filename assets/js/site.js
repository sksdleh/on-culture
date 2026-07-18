const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const tabs = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-category]")];
const snapSections = [...document.querySelectorAll("main > section")];
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll("[data-hero-dot]")];
const programGrid = document.querySelector("[data-program-grid]");
const HERO_DELAY = 5200;
const PROGRAM_DELAY = 5200;

let isSectionScrolling = false;
let touchStartY = 0;
let touchStartX = 0;
let currentHeroIndex = 0;
let heroTimer;
let programTimer;
let currentProgramFilter = "all";
let currentProgramPage = 0;

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function getCurrentSectionIndex() {
  const currentY = window.scrollY;

  return snapSections.reduce((closestIndex, section, index) => {
    const closestDistance = Math.abs(snapSections[closestIndex].offsetTop - currentY);
    const sectionDistance = Math.abs(section.offsetTop - currentY);

    return sectionDistance < closestDistance ? index : closestIndex;
  }, 0);
}

function scrollToSection(index) {
  const nextIndex = Math.max(0, Math.min(index, snapSections.length - 1));
  const target = snapSections[nextIndex];

  if (!target || isSectionScrolling) return;

  isSectionScrolling = true;
  window.scrollTo({
    top: target.offsetTop,
    behavior: "smooth",
  });

  window.setTimeout(() => {
    isSectionScrolling = false;
  }, 900);
}

function moveSection(direction) {
  const currentIndex = getCurrentSectionIndex();
  scrollToSection(currentIndex + direction);
}

function showHeroSlide(index) {
  if (!heroSlides.length) return;

  currentHeroIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentHeroIndex);
  });

  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentHeroIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function startHeroSlider() {
  window.clearInterval(heroTimer);

  if (heroSlides.length < 2) return;

  heroTimer = window.setInterval(() => {
    showHeroSlide(currentHeroIndex + 1);
  }, HERO_DELAY);
}

function getProgramPageSize() {
  if (window.matchMedia("(max-width: 720px)").matches) return 1;
  if (window.matchMedia("(max-width: 1020px)").matches) return 2;
  return 3;
}

function getFilteredProgramCards() {
  return cards.filter((card) => {
    const categories = card.dataset.category.split(" ");
    return currentProgramFilter === "all" || categories.includes(currentProgramFilter);
  });
}

function syncProgramCarousel(animate = false) {
  if (!programGrid || !cards.length) return;

  programGrid.classList.add("is-ready");

  const pageSize = getProgramPageSize();
  const filteredCards = getFilteredProgramCards();
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
  const startIndex = Math.min(currentProgramPage, totalPages - 1) * pageSize;
  const visibleCards = filteredCards.slice(startIndex, startIndex + pageSize);

  currentProgramPage = Math.min(currentProgramPage, totalPages - 1);

  cards.forEach((card) => {
    const isVisible = visibleCards.includes(card);
    card.hidden = !isVisible;
    card.classList.toggle("is-program-visible", isVisible);
  });

  if (animate) {
    programGrid.classList.remove("is-sliding");
    window.requestAnimationFrame(() => {
      programGrid.classList.add("is-sliding");
    });
  }
}

function startProgramSlider() {
  window.clearInterval(programTimer);

  if (!programGrid || !cards.length) return;

  programTimer = window.setInterval(() => {
    const pageSize = getProgramPageSize();
    const totalPages = Math.ceil(getFilteredProgramCards().length / pageSize);

    if (totalPages < 2) return;

    currentProgramPage = (currentProgramPage + 1) % totalPages;
    syncProgramCarousel(true);
  }, PROGRAM_DELAY);
}

function closeMenu() {
  document.body.classList.remove("is-menu-open");
  header.classList.remove("is-open");
  mobilePanel.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "메뉴 열기");
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
showHeroSlide(0);
startHeroSlider();
syncProgramCarousel();
startProgramSlider();

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showHeroSlide(Number(dot.dataset.heroDot));
    startHeroSlider();
  });
});

window.addEventListener(
  "wheel",
  (event) => {
    if (document.body.classList.contains("is-menu-open")) return;
    if (Math.abs(event.deltaY) < 24 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

    event.preventDefault();
    if (isSectionScrolling) return;

    moveSection(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false }
);

window.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.touches[0];
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
  },
  { passive: true }
);

window.addEventListener(
  "touchend",
  (event) => {
    if (document.body.classList.contains("is-menu-open")) return;

    const touch = event.changedTouches[0];
    const distanceY = touchStartY - touch.clientY;
    const distanceX = touchStartX - touch.clientX;

    if (Math.abs(distanceY) < 54 || Math.abs(distanceY) < Math.abs(distanceX)) return;

    moveSection(distanceY > 0 ? 1 : -1);
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  currentProgramPage = 0;
  syncProgramCarousel();
  startProgramSlider();
});

toggle.addEventListener("click", () => {
  const isOpen = mobilePanel.classList.toggle("is-open");
  document.body.classList.toggle("is-menu-open", isOpen);
  header.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

mobilePanel.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentProgramFilter = tab.dataset.filter;
    currentProgramPage = 0;

    tabs.forEach((item) => {
      item.setAttribute("aria-selected", String(item === tab));
    });

    syncProgramCarousel(true);
    startProgramSlider();
  });
});
