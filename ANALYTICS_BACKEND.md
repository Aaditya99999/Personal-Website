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
GA_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GA_CLIENT_SECRET=your-google-oauth-client-secret
GA_REFRESH_TOKEN=your-google-oauth-refresh-token
ANALYTICS_DASHBOARD_KEY=choose-a-private-dashboard-password
```

If service account keys are allowed, you can use these instead of OAuth:

```text
GA_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

## Google Setup With OAuth

1. Open Google Cloud Console.
2. Create or select a project.
3. Enable **Google Analytics Data API**.
4. Configure the OAuth consent screen.
5. Create an OAuth Client ID.
6. Use the OAuth client ID and secret as `GA_CLIENT_ID` and `GA_CLIENT_SECRET`.
7. Generate a refresh token for the Google account that has access to the GA4 property.
8. Put that refresh token in `GA_REFRESH_TOKEN`.
9. Open Google Analytics.
10. Go to **Admin**.
11. Open your GA4 property.
12. Find your GA4 **Property ID** and put it in `GA4_PROPERTY_ID`.

## If Service Account Key Creation Is Disabled

That is okay. Use the OAuth variables above:

```text
GA_CLIENT_ID
GA_CLIENT_SECRET
GA_REFRESH_TOKEN
```

You do not need:

```text
GA_CLIENT_EMAIL
GA_PRIVATE_KEY
```

## Vercel Setup

1. Import this GitHub repo into Vercel.
2. Add the environment variables above.
3. Deploy.
4. Open `/analytics/`.
5. Enter the value from `ANALYTICS_DASHBOARD_KEY`.

## Important

If the site stays only on GitHub Pages, `/api/analytics` will not run. GitHub Pages is static and cannot execute the backend. Deploy the site to Vercel, or host the API separately and update the fetch URL in `analytics/index.html`.
