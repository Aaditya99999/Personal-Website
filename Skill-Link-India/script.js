const categories = [
  {
    icon: "🎨",
    name: "Graphic Design",
    description: "Logos, posters, social media creatives, branding, and business graphics."
  },
  {
    icon: "🎬",
    name: "Video Editing",
    description: "Reels, YouTube videos, ads, event edits, and professional video cuts."
  },
  {
    icon: "📣",
    name: "Digital Marketing",
    description: "Online ads, social media growth, SEO basics, and promotion support."
  },
  {
    icon: "💻",
    name: "Website Development",
    description: "Business websites, landing pages, portfolio sites, and online forms."
  },
  {
    icon: "🏠",
    name: "Home Services",
    description: "Local help for repair, maintenance, cleaning, and household tasks."
  },
  {
    icon: "🛍️",
    name: "Product Sellers",
    description: "Connect with sellers offering products for personal and business needs."
  },
  {
    icon: "🧑‍💼",
    name: "Freelancers",
    description: "Hire independent professionals for creative, technical, and business work."
  },
  {
    icon: "🛠️",
    name: "Local Skilled Workers",
    description: "Find local workers and skilled people for practical on-ground needs."
  }
];

const providers = [
  {
    name: "Rahul Designs",
    category: "Graphic Design",
    rating: "4.8",
    location: "Delhi",
    description: "Brand logos, posters, thumbnails, and clean social media creatives."
  },
  {
    name: "Priya Edits",
    category: "Video Editing",
    rating: "4.9",
    location: "Mumbai",
    description: "Fast editing for reels, YouTube videos, business ads, and events."
  },
  {
    name: "Ajmer Web Studio",
    category: "Website Development",
    rating: "4.7",
    location: "Rajasthan",
    description: "Modern websites, landing pages, lead forms, and WhatsApp integration."
  },
  {
    name: "Smart Home Services",
    category: "Home Services",
    rating: "4.6",
    location: "Jaipur",
    description: "Reliable local support for household maintenance and small repair tasks."
  },
  {
    name: "Growth Spark Media",
    category: "Digital Marketing",
    rating: "4.8",
    location: "Pune",
    description: "Social media strategy, campaign setup, content plans, and lead generation."
  },
  {
    name: "Local Craft Sellers",
    category: "Product Sellers",
    rating: "4.5",
    location: "India",
    description: "Connect with product sellers for custom, local, and business products."
  },
  {
    name: "Nisha Freelancer Hub",
    category: "Freelancers",
    rating: "4.7",
    location: "Bengaluru",
    description: "Freelance writing, design, admin help, and project-based support."
  },
  {
    name: "Reliable Local Workers",
    category: "Local Skilled Workers",
    rating: "4.6",
    location: "Lucknow",
    description: "Practical skilled help for local work, setup support, and daily needs."
  }
];

const categoryGrid = document.getElementById("categoryGrid");
const providerGrid = document.getElementById("providerGrid");
const filterRow = document.getElementById("filterRow");
const providerSearch = document.getElementById("providerSearch");
const noResults = document.getElementById("noResults");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

let activeCategory = "All";

function initials(name) {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function whatsappLink(providerName = "") {
  const message = providerName
    ? `Hi Skill Link India, I want to contact ${providerName}.`
    : "Hi Skill Link India, I want to know more about your services.";
  return `https://wa.me/916370266358?text=${encodeURIComponent(message)}`;
}

function renderCategories() {
  if (!categoryGrid) return;

  categoryGrid.innerHTML = categories
    .map(category => `
      <article class="category-card reveal">
        <div class="category-icon" aria-hidden="true">${category.icon}</div>
        <h3>${category.name}</h3>
        <p>${category.description}</p>
      </article>
    `)
    .join("");
}

function renderFilters() {
  if (!filterRow) return;

  const filterCategories = ["All", ...new Set(providers.map(provider => provider.category))];

  filterRow.innerHTML = filterCategories
    .map(category => `
      <button class="filter-btn ${category === activeCategory ? "active" : ""}" data-category="${category}" type="button">
        ${category}
      </button>
    `)
    .join("");
}

function renderProviders() {
  if (!providerGrid) return;

  const query = providerSearch?.value.trim().toLowerCase() || "";

  const filteredProviders = providers.filter(provider => {
    const matchesCategory = activeCategory === "All" || provider.category === activeCategory;
    const searchableText = `${provider.name} ${provider.category} ${provider.location} ${provider.description}`.toLowerCase();
    const matchesSearch = searchableText.includes(query);
    return matchesCategory && matchesSearch;
  });

  providerGrid.innerHTML = filteredProviders
    .map(provider => `
      <article class="provider-card reveal visible">
        <div class="provider-top">
          <div class="provider-avatar" aria-hidden="true">${initials(provider.name)}</div>
          <div>
            <h3>${provider.name}</h3>
            <p>${provider.category}</p>
          </div>
        </div>
        <p>${provider.description}</p>
        <div class="provider-meta" aria-label="Provider details">
          <span>⭐ ${provider.rating}</span>
          <span>📍 ${provider.location}</span>
          <span>${provider.category}</span>
        </div>
        <a class="btn btn-primary" target="_blank" rel="noopener" href="${whatsappLink(provider.name)}">Contact Now</a>
      </article>
    `)
    .join("");

  if (noResults) {
    noResults.hidden = filteredProviders.length > 0;
  }
}

function setupFilters() {
  filterRow?.addEventListener("click", event => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    activeCategory = button.dataset.category;
    renderFilters();
    renderProviders();
  });

  providerSearch?.addEventListener("input", renderProviders);
}

function setupMobileMenu() {
  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks?.addEventListener("click", event => {
    if (event.target.tagName !== "A") return;
    navLinks.classList.remove("open");
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
}

function setupContactForm() {
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    formSuccess.hidden = false;
    contactForm.reset();

    setTimeout(() => {
      formSuccess.hidden = true;
    }, 4500);
  });
}

function setupFaq() {
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.querySelector("span").textContent = isOpen ? "−" : "+";
    });
  });
}

function setupRevealAnimation() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(element => observer.observe(element));
}

function setupActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-links a[href^='#']");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navItems.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach(section => observer.observe(section));
}

function setCurrentYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

renderCategories();
renderFilters();
renderProviders();
setupFilters();
setupMobileMenu();
setupContactForm();
setupFaq();
setupRevealAnimation();
setupActiveNavigation();
setCurrentYear();
