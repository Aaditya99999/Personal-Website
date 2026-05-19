(function () {
  var GA_ID = 'G-DZZZLY06Q4';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + GA_ID + '"]')) {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gaScript);
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  function sendEvent(name, params) {
    var data = Object.assign({ page_path: location.pathname }, params || {});
    window.gtag('event', name, data);
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
