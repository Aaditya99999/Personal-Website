// Toggle mobile menu
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// Sticky header shadow on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
  } else {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
  }
});

// Animate elements on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const animItems = document.querySelectorAll('.stat-card, .practice-card, .testi-card, .why-feat, .service-block, .faq-item, .team-card');
  animItems.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
});

// Appointment form WhatsApp redirect
function submitAppointment(e) {
  e.preventDefault();
  const name = document.getElementById('apptName')?.value || '';
  const caseType = document.getElementById('apptCase')?.value || 'legal matter';
  const phone = document.getElementById('apptPhone')?.value || '';
  const message = document.getElementById('apptMessage')?.value || '';

  const waText = encodeURIComponent(
    `Hello, my name is ${name}. I need legal help regarding ${caseType}. My phone number is ${phone}. ${message ? 'Details: ' + message : ''}`
  );
  window.open(`https://wa.me/917357397888?text=${waText}`, '_blank');
  document.getElementById('apptForm')?.reset();
  showSuccess();
}

function showSuccess() {
  const banner = document.getElementById('successBanner');
  if (banner) {
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 5000);
  }
}
