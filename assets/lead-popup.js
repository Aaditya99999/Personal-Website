// Floating WhatsApp button + "Get a Free Quote" popup form.
// Include once per page: <script src="/assets/lead-popup.js" defer></script>
(function () {
  if (document.getElementById('leadPopup')) return;
  var PHONE = '917357397888';
  var AUTO_OPEN_MS = 20000;
  var WA_MESSAGE = "Hi Aaditya, I visited your website and want to discuss a project.";

  var css = `
  .lp-wa { position: fixed; right: 20px; bottom: 20px; z-index: 900; width: 58px; height: 58px; border-radius: 50%; background: #25d366; color: #fff; display: grid; place-items: center; box-shadow: 0 8px 24px rgba(0,0,0,.22); transition: transform .2s; }
  .lp-wa:hover { transform: scale(1.08); }
  .lp-wa svg { width: 32px; height: 32px; fill: currentColor; }
  .lp-trigger { position: fixed; right: 88px; bottom: 28px; z-index: 900; border: 0; border-radius: 999px; padding: 11px 18px; background: #294d33; color: #fff; font: 700 14px Inter, system-ui, sans-serif; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,.18); }
  .lp-trigger:hover { background: #3d6545; }
  .lp-modal { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 16px; background: rgba(23,23,23,.6); }
  .lp-modal[hidden] { display: none; }
  .lp-card { position: relative; width: 100%; max-width: 440px; max-height: calc(100vh - 32px); overflow-y: auto; background: #fff; color: #171717; border-radius: 18px; padding: 28px 24px 22px; box-shadow: 0 20px 60px rgba(0,0,0,.3); font-family: Inter, system-ui, sans-serif; animation: lp-in .25s ease-out; }
  @keyframes lp-in { from { opacity: 0; transform: translateY(16px); } }
  .lp-badge { display: inline-block; margin-bottom: 10px; padding: 4px 10px; border-radius: 999px; background: #f1eee8; color: #294d33; font-size: 12px; font-weight: 700; }
  .lp-card h2 { margin: 0 0 6px; font-size: 23px; line-height: 1.2; }
  .lp-sub { margin: 0 0 16px; color: #66645f; font-size: 14px; }
  .lp-close { position: absolute; top: 10px; right: 12px; border: 0; background: none; font-size: 28px; line-height: 1; color: #66645f; cursor: pointer; }
  .lp-card label { display: block; margin-bottom: 11px; font-size: 13px; font-weight: 600; }
  .lp-card input, .lp-card select, .lp-card textarea { display: block; width: 100%; box-sizing: border-box; margin-top: 5px; padding: 10px 12px; border: 1px solid #ded8ce; border-radius: 10px; font: 14px Inter, system-ui, sans-serif; background: #f7f6f2; color: #171717; }
  .lp-card input:focus, .lp-card select:focus, .lp-card textarea:focus { outline: 2px solid #294d33; outline-offset: 1px; }
  .lp-submit { width: 100%; margin-top: 4px; border: 0; border-radius: 999px; padding: 14px; background: #f5a900; color: #171717; font: 800 15px Inter, system-ui, sans-serif; cursor: pointer; }
  .lp-submit:hover { background: #ffbd2f; }
  .lp-trust { margin: 12px 0 0; text-align: center; color: #66645f; font-size: 12px; }
  @media (max-width: 560px) { .lp-trigger { right: 84px; bottom: 30px; padding: 10px 14px; font-size: 13px; } }
  `;

  var waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.96-3.48-.23-.36a9.44 9.44 0 1 1 8 4.42m8.03-17.47A11.3 11.3 0 0 0 12.05.7 11.36 11.36 0 0 0 2.22 17.72L.6 23.6l6.02-1.58a11.33 11.33 0 0 0 5.43 1.38h.01A11.36 11.36 0 0 0 23.4 12.05a11.3 11.3 0 0 0-3.32-8.03"/></svg>';

  var html = `
  <a class="lp-wa" href="https://wa.me/${PHONE}?text=${encodeURIComponent(WA_MESSAGE)}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${waIcon}</a>
  <button class="lp-trigger" type="button" id="leadPopupOpen">Get a Free Quote</button>
  <div class="lp-modal" id="leadPopup" role="dialog" aria-modal="true" aria-labelledby="leadPopupTitle" hidden>
    <form class="lp-card" id="leadPopupForm">
      <button class="lp-close" type="button" id="leadPopupClose" aria-label="Close">&times;</button>
      <span class="lp-badge">Reply within 24 hours</span>
      <h2 id="leadPopupTitle">Get a free project quote</h2>
      <p class="lp-sub">Tell me what you need. I will reply on WhatsApp with a clear plan and price.</p>
      <label>Your name<input name="name" required autocomplete="name"></label>
      <label>WhatsApp number<input name="phone" type="tel" required autocomplete="tel" pattern="[0-9+ \\-]{8,15}" placeholder="+91"></label>
      <label>What do you need?<select name="service" required>
        <option value="">Choose one</option>
        <option>Business website</option>
        <option>Clinic / doctor website</option>
        <option>EMR / clinic software</option>
        <option>WhatsApp or AI automation</option>
        <option>Landing page</option>
        <option>SEO setup</option>
        <option>Something else</option>
      </select></label>
      <label>Budget<select name="budget">
        <option>Not sure yet</option>
        <option>Under ₹15,000</option>
        <option>₹15,000 – ₹40,000</option>
        <option>₹40,000 – ₹1,00,000</option>
        <option>Above ₹1,00,000</option>
      </select></label>
      <label>Project details (optional)<textarea name="details" rows="3" placeholder="Business type, pages, deadline..."></textarea></label>
      <button class="lp-submit" type="submit">Get My Free Quote on WhatsApp</button>
      <p class="lp-trust">No spam. Your details go only to Aaditya.</p>
    </form>
  </div>`;

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap);

    var modal = document.getElementById('leadPopup');
    var form = document.getElementById('leadPopupForm');

    function toggle(open) {
      modal.hidden = !open;
      if (open) {
        form.elements.name.focus();
        try { sessionStorage.setItem('leadPopupSeen', '1'); } catch (e) {}
      }
    }

    document.getElementById('leadPopupOpen').addEventListener('click', function () { toggle(true); });
    document.getElementById('leadPopupClose').addEventListener('click', function () { toggle(false); });
    modal.addEventListener('click', function (e) { if (e.target === modal) toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) toggle(false); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var lines = [
        'Hi Aaditya, I want a free quote.',
        '',
        'Name: ' + f.name.value.trim(),
        'Phone: ' + f.phone.value.trim(),
        'Service: ' + f.service.value,
        'Budget: ' + f.budget.value,
        'Page: ' + location.pathname
      ];
      if (f.details.value.trim()) lines.push('Details: ' + f.details.value.trim());
      if (typeof window.gtag === 'function') window.gtag('event', 'lead_popup_submit', { service: f.service.value });
      var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(lines.join('\n'));
      form.reset();
      toggle(false);
      // Mobile and in-app browsers often block new tabs; fall back to opening WhatsApp in this tab.
      var win = window.open(url, '_blank');
      if (win) win.opener = null;
      else window.location.href = url;
    });

    // Auto-open once per session after the visitor has spent some time on the page.
    var seen = false;
    try { seen = sessionStorage.getItem('leadPopupSeen') === '1'; } catch (e) {}
    if (!seen) setTimeout(function () { if (modal.hidden) toggle(true); }, AUTO_OPEN_MS);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
