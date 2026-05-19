# AB Labs Analytics on GitHub Pages

This setup keeps `aadityabhatnagar.online` on GitHub Pages and uses Google
Apps Script plus Google Sheets as the free analytics backend.

## What You Get

- Page visits
- Button clicks
- WhatsApp clicks
- Service, portfolio, and blog clicks
- Scroll depth
- Rage clicks and dead clicks
- Device type and screen size
- Referrer/source
- A private `/analytics/` dashboard

Google Analytics still runs too. This free backend is for your own AB Labs
dashboard inside the website.

## No Vercel Env Vars Needed

You do not need:

```text
GA4_PROPERTY_ID
GA_CLIENT_EMAIL
GA_PRIVATE_KEY
GA_CLIENT_ID
GA_CLIENT_SECRET
GA_REFRESH_TOKEN
```

For the GitHub Pages setup, you only need:

```text
Apps Script Web App URL
Dashboard key: 3301
```

## Setup Steps

1. Open Google Drive.
2. Create a new Google Sheet named `AB Labs Analytics`.
3. In that Sheet, open **Extensions > Apps Script**.
4. Delete the default code.
5. Paste the full code from `APPS_SCRIPT_ANALYTICS.gs`.
6. Save the Apps Script project.
7. Click **Deploy > New deployment**.
8. Select **Web app**.
9. Set **Execute as** to `Me`.
10. Set **Who has access** to `Anyone`.
11. Deploy and copy the Web App URL.

The URL will look like:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Connect The Website

Open `assets/site-analytics.js` and set:

```js
var AB_ANALYTICS_ENDPOINT = window.AB_ANALYTICS_ENDPOINT || 'YOUR_APPS_SCRIPT_WEB_APP_URL';
```

Keep this as-is unless you change the Apps Script `SITE_KEY`:

```js
var AB_ANALYTICS_SITE_KEY = window.AB_ANALYTICS_SITE_KEY || 'ab-labs-site';
```

## View The Dashboard

Open:

```text
https://aadityabhatnagar.online/analytics/
```

Paste:

```text
Apps Script Web App URL
Dashboard key: 3301
```

Click **Load data**.

## Notes

- The first few hours may look empty until visitors create events.
- Apps Script is free for normal small-site usage.
- The dashboard key protects the summary view, but the event collector URL is
  public because browser tracking always needs a public endpoint.
- If you change `DASHBOARD_KEY` inside `APPS_SCRIPT_ANALYTICS.gs`, use the new
  key on `/analytics/`.
