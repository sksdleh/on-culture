const header = document.querySelector("[data-header]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const mobilePanel = document.querySelector("[data-mobile-panel]");
    const tabs = [...document.querySelectorAll("[data-filter]")];
    const cards = [...document.querySelectorAll("[data-category]")];

    function syncHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
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
        const filter = tab.dataset.filter;

        tabs.forEach((item) => {
          item.setAttribute("aria-selected", String(item === tab));
        });

        cards.forEach((card) => {
          const categories = card.dataset.category.split(" ");
          card.hidden = filter !== "all" && !categories.includes(filter);
        });
      });
    });
