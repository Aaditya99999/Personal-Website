const { BetaAnalyticsDataClient } = require('@google-analytics/data').v1beta;
const { OAuth2Client } = require('google-auth-library');

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedPayload = null;
let cachedAt = 0;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function hasOAuthCredentials() {
  return Boolean(process.env.GA_CLIENT_ID && process.env.GA_CLIENT_SECRET && process.env.GA_REFRESH_TOKEN);
}

function getServiceAccountClient() {
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = (process.env.GA_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing GA OAuth credentials or service account credentials.');
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey
    }
  });
}

function numberValue(row, index) {
  return Number(row.metricValues[index] && row.metricValues[index].value ? row.metricValues[index].value : 0);
}

function dimensionValue(row, index) {
  return row.dimensionValues[index] && row.dimensionValues[index].value ? row.dimensionValues[index].value : '';
}

function rows(response, mapper) {
  return (response.rows || []).map(mapper);
}

async function getOAuthAccessToken() {
  const oauthClient = new OAuth2Client(
    process.env.GA_CLIENT_ID,
    process.env.GA_CLIENT_SECRET
  );
  oauthClient.setCredentials({ refresh_token: process.env.GA_REFRESH_TOKEN });
  const token = await oauthClient.getAccessToken();
  return typeof token === 'string' ? token : token.token;
}

async function runOAuthReport(propertyId, request) {
  const accessToken = await getOAuthAccessToken();
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.assign({
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }]
    }, request))
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error && data.error.message ? data.error.message : 'Google Analytics API request failed.');
  }
  return data;
}

async function runServiceAccountReport(client, propertyId, request) {
  const [response] = await client.runReport(Object.assign({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }]
  }, request));

  return response;
}

async function runReport(client, propertyId, request) {
  if (hasOAuthCredentials()) return runOAuthReport(propertyId, request);
  return runServiceAccountReport(client, propertyId, request);
}

async function getAnalyticsPayload() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) throw new Error('Missing GA4_PROPERTY_ID.');

  const client = hasOAuthCredentials() ? null : getServiceAccountClient();
  const [
    overview,
    pages,
    events,
    sources,
    devices,
    daily
  ] = await Promise.all([
    runReport(client, propertyId, {
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'eventCount' }
      ]
    }),
    runReport(client, propertyId, {
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' }
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10
    }),
    runReport(client, propertyId, {
      dimensions: [{ name: 'eventName' }],
      metrics: [
        { name: 'eventCount' },
        { name: 'activeUsers' }
      ],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 30
    }),
    runReport(client, propertyId, {
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [
        { name: 'sessions' },
        { name: 'activeUsers' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10
    }),
    runReport(client, propertyId, {
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [
        { name: 'sessions' },
        { name: 'activeUsers' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10
    }),
    runReport(client, propertyId, {
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' }
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
      limit: 31
    })
  ]);

  const overviewRow = overview.rows && overview.rows[0];
  const eventRows = rows(events, (row) => ({
    event: dimensionValue(row, 0),
    count: numberValue(row, 0),
    users: numberValue(row, 1)
  }));
  const uxEvents = ['dead_click', 'rage_click', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_90', 'scroll_100', 'form_field_focus'];

  return {
    updatedAt: new Date().toISOString(),
    range: 'Last 30 days',
    overview: {
      activeUsers: overviewRow ? numberValue(overviewRow, 0) : 0,
      sessions: overviewRow ? numberValue(overviewRow, 1) : 0,
      views: overviewRow ? numberValue(overviewRow, 2) : 0,
      events: overviewRow ? numberValue(overviewRow, 3) : 0
    },
    pages: rows(pages, (row) => ({
      path: dimensionValue(row, 0),
      views: numberValue(row, 0),
      users: numberValue(row, 1)
    })),
    events: eventRows,
    uxSignals: eventRows.filter((row) => uxEvents.includes(row.event)),
    sources: rows(sources, (row) => ({
      source: dimensionValue(row, 0),
      sessions: numberValue(row, 0),
      users: numberValue(row, 1)
    })),
    devices: rows(devices, (row) => ({
      device: dimensionValue(row, 0),
      sessions: numberValue(row, 0),
      users: numberValue(row, 1)
    })),
    daily: rows(daily, (row) => ({
      date: dimensionValue(row, 0),
      users: numberValue(row, 0),
      sessions: numberValue(row, 1)
    }))
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const expectedToken = process.env.ANALYTICS_DASHBOARD_KEY;
  const receivedToken = req.headers['x-analytics-token'];

  if (!expectedToken || receivedToken !== expectedToken) {
    json(res, 401, { error: 'Analytics dashboard key required.' });
    return;
  }

  try {
    if (cachedPayload && Date.now() - cachedAt < CACHE_TTL_MS) {
      json(res, 200, cachedPayload);
      return;
    }

    cachedPayload = await getAnalyticsPayload();
    cachedAt = Date.now();
    json(res, 200, cachedPayload);
  } catch (error) {
    json(res, 500, {
      error: 'Could not load analytics data.',
      detail: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};
