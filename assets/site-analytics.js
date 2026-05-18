(function () {
  function sendEvent(name, params) {
    var data = Object.assign({ page_path: location.pathname }, params || {});
    if (typeof window.gtag === 'function') window.gtag('event', name, data);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, data));
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var text = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    if (href.includes('wa.me') || href.includes('whatsapp')) sendEvent('whatsapp_click', { link_text: text, link_url: href });
    else if (href.startsWith('mailto:')) sendEvent('email_click', { link_text: text });
    else if (href.startsWith('tel:')) sendEvent('phone_click', { link_text: text });
    else if (href.includes('/services')) sendEvent('service_click', { link_text: text, link_url: href });
    else if (href.includes('/portfolio') || href.includes('/case-studies/')) sendEvent('portfolio_click', { link_text: text, link_url: href });
    else if (href.includes('/blogs/') || href.includes('/blog.html')) sendEvent('blog_click', { link_text: text, link_url: href });
    else if (href.includes('#contact')) sendEvent('contact_cta_click', { link_text: text, link_url: href });
  });

  document.addEventListener('change', function (event) {
    if (event.target && event.target.name === 'projectPackage') {
      sendEvent('project_option_select', { selected_option: event.target.value });
    }
  });
})();
