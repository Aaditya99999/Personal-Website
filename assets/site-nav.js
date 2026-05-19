(function () {
  const menuHtml = `
    <a href="/services/">Services</a>
    <a href="/about/">About</a>
    <a href="/portfolio/">Portfolio</a>
    <a href="/case-studies/">Case Studies</a>
    <a href="/blog/">Blog</a>
    <a href="/#faq">FAQ</a>
    <a href="/start-project/">Contact Me</a>
  `;

  function injectStyles() {
    if (document.querySelector("style[data-site-nav]")) return;

    const style = document.createElement("style");
    style.setAttribute("data-site-nav", "true");
    style.textContent = `
      .nav-shell {
        position: relative;
        overflow: visible !important;
      }

      .menu-button {
        display: none;
        place-items: center;
        width: 42px;
        height: 42px;
        padding: 0;
        border: 1px solid rgba(222, 216, 206, 0.9);
        border-radius: 999px;
        color: var(--green, #294d33);
        background: #fff;
        cursor: pointer;
        flex: 0 0 auto;
      }

      .menu-button::before,
      .menu-button::after {
        display: none !important;
      }

      .menu-button span {
        display: block;
        width: 18px;
        height: 2px;
        margin: 2px 0;
        background: currentColor;
        border-radius: 999px;
        transition: transform 180ms ease, opacity 180ms ease;
      }

      .mobile-menu {
        display: none;
        position: absolute;
        top: calc(100% + 10px);
        left: 0;
        right: 0;
        z-index: 80;
        padding: 10px;
        color: var(--ink, #171717);
        background: #fff;
        border: 1px solid var(--line, #ded8ce);
        border-radius: 20px;
        box-shadow: 0 24px 70px rgba(41, 77, 51, 0.18);
      }

      .mobile-menu a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 46px;
        padding: 12px 14px;
        color: var(--green, #294d33);
        border-radius: 14px;
        font-size: 14px;
        font-weight: 900;
        text-decoration: none;
      }

      .mobile-menu a::after {
        content: "+";
        display: inline-grid;
        place-items: center;
        width: 24px;
        height: 24px;
        color: var(--green, #294d33);
        background: rgba(245, 169, 0, 0.2);
        border-radius: 999px;
      }

      .mobile-menu a:hover,
      .mobile-menu a:focus-visible {
        background: rgba(245, 169, 0, 0.14);
        outline: none;
      }

      .nav-shell.menu-open .mobile-menu {
        display: grid;
        gap: 2px;
      }

      .nav-shell.menu-open .menu-button span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }

      .nav-shell.menu-open .menu-button span:nth-child(2) {
        opacity: 0;
      }

      .nav-shell.menu-open .menu-button span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }

      @media (max-width: 980px), (orientation: portrait) {
        .nav-shell {
          padding-right: 58px !important;
        }

        .nav-links,
        .nav-cta {
          display: none !important;
        }

        .menu-button {
          display: inline-grid !important;
          position: fixed;
          top: 28px;
          right: 28px;
          z-index: 100;
          transform: none;
        }

        .mobile-menu {
          position: fixed;
          top: 82px;
          left: 14px;
          right: 14px;
        }
      }

      @media (min-width: 921px) {
        .mobile-menu {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function closeMenu(nav, button) {
    nav.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
  }

  function setupNav(nav, index) {
    let button = nav.querySelector(".menu-button");
    let menu = nav.querySelector(".mobile-menu");

    if (!button) {
      button = document.createElement("button");
      button.className = "menu-button";
      button.type = "button";
      button.setAttribute("aria-label", "Open menu");
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = "<span></span><span></span><span></span>";
      nav.appendChild(button);
    }

    if (!menu) {
      menu = document.createElement("div");
      menu.className = "mobile-menu";
      menu.setAttribute("aria-label", "Mobile navigation");
      menu.innerHTML = menuHtml;
      nav.appendChild(menu);
    }

    const menuId = menu.id || `mobile-menu-${index + 1}`;
    menu.id = menuId;
    button.setAttribute("aria-controls", menuId);

    button.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(nav, button);
      });
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) closeMenu(nav, button);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu(nav, button);
    });
  }

  function init() {
    injectStyles();
    document.querySelectorAll(".nav-shell").forEach(setupNav);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
