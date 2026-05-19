# AB Labs Analytics Backend Setup

This backend lets `/analytics/` show real Google Analytics data directly on the website.

## What It Uses

- Vercel Serverless Function: `/api/analytics`
- Google Analytics Data API
- GA4 property data
- A private dashboard key entered on `/analytics/`

## Required Environment Variables

Set these in Vercel project settings:

```text
GA4_PROPERTY_ID=123456789
GA_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
ANALYTICS_DASHBOARD_KEY=choose-a-private-dashboard-password
```

## Google Setup

1. Open Google Cloud Console.
2. Create or select a project.
3. Enable **Google Analytics Data API**.
4. Create a **Service Account**.
5. Create a JSON key for that service account.
6. Copy the service account email into `GA_CLIENT_EMAIL`.
7. Copy the private key into `GA_PRIVATE_KEY`.
8. Open Google Analytics.
9. Go to **Admin**.
10. Open your GA4 property.
11. Go to **Property access management**.
12. Add the service account email as **Viewer**.
13. Find your GA4 **Property ID** and put it in `GA4_PROPERTY_ID`.

## Vercel Setup

1. Import this GitHub repo into Vercel.
2. Add the environment variables above.
3. Deploy.
4. Open `/analytics/`.
5. Enter the value from `ANALYTICS_DASHBOARD_KEY`.

## Important

If the site stays only on GitHub Pages, `/api/analytics` will not run. GitHub Pages is static and cannot execute the backend. Deploy the site to Vercel, or host the API separately and update the fetch URL in `analytics/index.html`.
