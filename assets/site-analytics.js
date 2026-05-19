(function () {
  var GA_ID = 'G-DZZZLY06Q4';
  var sessionKey = 'ab_labs_session_id';
  var startedAt = Date.now();
  var sentScroll = {};
  var clickTrail = [];

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

  function getSessionId() {
    try {
      var existing = sessionStorage.getItem(sessionKey);
      if (existing) return existing;
      var fresh = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(sessionKey, fresh);
      return fresh;
    } catch (error) {
      return 's_' + Date.now().toString(36);
    }
  }

  function deviceType() {
    var width = window.innerWidth || document.documentElement.clientWidth || 0;
    if (width < 680) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function cleanText(value) {
    return (value || '').trim().replace(/\s+/g, ' ').slice(0, 120);
  }

  function sectionName(element) {
    var section = element && element.closest ? element.closest('section, header, footer, main') : null;
    if (!section) return 'page';
    if (section.id) return section.id;
    if (section.classList.contains('hero')) return 'hero';
    if (section.classList.contains('site-footer')) return 'footer';
    if (section.classList.contains('site-header')) return 'header';
    var heading = section.querySelector('h1, h2, h3, .eyebrow');
    return cleanText(heading && heading.textContent).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || section.tagName.toLowerCase();
  }

  function baseParams(params) {
    return Object.assign({
      page_path: location.pathname,
      page_title: document.title,
      device_type: deviceType(),
      screen_size: (window.innerWidth || 0) + 'x' + (window.innerHeight || 0),
      session_id: getSessionId()
    }, params || {});
  }

  function sendEvent(name, params) {
    var data = baseParams(params);
    window.gtag('event', name, data);
    window.dataLayer.push(Object.assign({ event: name }, data));
  }

  function namedClickEvent(link, href, text) {
    var path = location.pathname;
    var inHero = Boolean(link.closest('.hero'));
    var inFooter = Boolean(link.closest('footer'));
    var isStartProject = href.includes('/start-project') || text.toLowerCase().includes('start project');

    if (inHero && href.includes('/portfolio')) return 'hero_portfolio_click';
    if (inHero && (href.includes('#contact') || text.toLowerCase().includes('hire me'))) return 'hero_hire_me_click';
    if (href.includes('wa.me') || href.toLowerCase().includes('whatsapp')) {
      if (link.id === 'whatsappProjectLink' || text.toLowerCase().includes('send project')) return 'project_whatsapp_submit';
      return 'whatsapp_click';
    }
    if (href.startsWith('mailto:')) return 'email_click';
    if (href.startsWith('tel:')) return 'phone_click';
    if (isStartProject) return inFooter ? 'footer_start_project_click' : 'start_project_click';
    if (href.includes('/services')) return link.closest('.service-card, .card, article') ? 'service_card_click' : 'service_click';
    if (href.includes('/portfolio') || href.includes('/case-studies/')) return link.closest('.project-card, .portfolio-card, .card, article') ? 'portfolio_card_click' : 'portfolio_click';
    if (href.includes('/blogs/') || href.includes('/blog/')) return link.closest('.blog-card, article, .card') ? 'blog_card_click' : 'blog_click';
    if (href.includes('#contact')) return 'contact_cta_click';
    if (path.includes('/analytics/') && href.includes('google')) return 'analytics_tool_click';
    return 'link_click';
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    page_path: location.pathname,
    page_title: document.title
  });

  sendEvent('ab_page_view', {
    referrer: document.referrer || '',
    landing_url: location.href
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    var button = event.target.closest('button');
    var target = link || button;
    var now = Date.now();
    var x = event.clientX || 0;
    var y = event.clientY || 0;

    clickTrail = clickTrail.filter(function (item) { return now - item.time < 1800; });
    clickTrail.push({ time: now, x: x, y: y });
    var nearbyClicks = clickTrail.filter(function (item) {
      return Math.abs(item.x - x) < 28 && Math.abs(item.y - y) < 28;
    }).length;
    if (nearbyClicks >= 3) {
      sendEvent('rage_click', { section: sectionName(target || document.body), click_x: x, click_y: y });
      clickTrail = [];
    }

    if (!target) {
      sendEvent('dead_click', {
        section: sectionName(event.target),
        element_tag: event.target && event.target.tagName ? event.target.tagName.toLowerCase() : 'unknown',
        click_x: x,
        click_y: y
      });
      return;
    }

    if (button && button.classList.contains('menu-button')) {
      sendEvent('mobile_menu_open', { section: 'header', button_text: cleanText(button.textContent) || 'menu' });
      return;
    }

    if (!link) return;

    var href = link.getAttribute('href') || '';
    var text = cleanText(link.textContent);
    var eventName = namedClickEvent(link, href, text);
    sendEvent(eventName, {
      link_text: text,
      link_url: href,
      section: sectionName(link)
    });
  });

  document.addEventListener('change', function (event) {
    var target = event.target;
    if (!target) return;
    if (target.name === 'projectPackage') {
      sendEvent('project_option_select', {
        selected_option: target.value,
        section: sectionName(target)
      });
    } else if (target.matches('select')) {
      sendEvent('form_select_change', {
        field_name: target.name || target.id || 'select',
        selected_option: cleanText(target.value),
        section: sectionName(target)
      });
    }
  });

  document.addEventListener('focusin', function (event) {
    var target = event.target;
    if (!target || !target.matches('input, select, textarea')) return;
    sendEvent('form_field_focus', {
      field_name: target.name || target.id || target.type || 'field',
      field_type: target.tagName.toLowerCase(),
      section: sectionName(target)
    });
  });

  window.addEventListener('scroll', function () {
    var doc = document.documentElement;
    var scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    var depth = Math.round((window.scrollY / scrollable) * 100);
    [25, 50, 75, 90, 100].forEach(function (mark) {
      if (depth >= mark && !sentScroll[mark]) {
        sentScroll[mark] = true;
        sendEvent('scroll_' + mark, { scroll_depth: mark });
      }
    });
  }, { passive: true });

  [30, 60, 120].forEach(function (seconds) {
    window.setTimeout(function () {
      sendEvent('time_' + seconds + '_seconds', {
        seconds_on_page: seconds
      });
    }, seconds * 1000);
  });

  window.addEventListener('pagehide', function () {
    sendEvent('page_exit', {
      seconds_on_page: Math.round((Date.now() - startedAt) / 1000)
    });
  });
})();
