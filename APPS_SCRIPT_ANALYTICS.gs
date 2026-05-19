/*
  AB Labs Analytics for GitHub Pages

  Paste this whole file into Google Apps Script, deploy it as a Web App, and use
  the Web App URL as your AB_ANALYTICS_ENDPOINT in assets/site-analytics.js.
*/

var DASHBOARD_KEY = '3301';
var SITE_KEY = 'ab-labs-site';
var EVENTS_SHEET = 'Events';
var HEADERS = [
  'timestamp',
  'event_name',
  'page_path',
  'page_title',
  'section',
  'link_text',
  'link_url',
  'button_text',
  'selected_option',
  'field_name',
  'scroll_depth',
  'seconds_on_page',
  'device_type',
  'screen_size',
  'session_id',
  'referrer',
  'landing_url',
  'url',
  'user_agent'
];

function doPost(e) {
  try {
    var payload = parsePayload_(e);
    if (!payload || payload.site_key !== SITE_KEY) {
      return json_({ ok: false, error: 'Invalid site key' });
    }

    var sheet = getEventsSheet_();
    var row = HEADERS.map(function (key) {
      if (key === 'timestamp') return payload.timestamp || new Date().toISOString();
      return payload[key] || '';
    });

    sheet.appendRow(row);
    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message || error) });
  }
}

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  if (params.mode !== 'summary') {
    return json_({ ok: true, service: 'AB Labs Analytics', message: 'Use mode=summary with your dashboard key.' });
  }

  if (params.key !== DASHBOARD_KEY) {
    return json_({ ok: false, error: 'Invalid dashboard key' }, 403);
  }

  return json_(buildSummary_());
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  return JSON.parse(e.postData.contents);
}

function getEventsSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(EVENTS_SHEET);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(EVENTS_SHEET);
  }

  var currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var hasHeaders = currentHeaders.some(function (value) { return value; });
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function buildSummary_() {
  var sheet = getEventsSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return emptySummary_();
  }

  var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  var rows = values.map(rowToObject_).filter(function (item) {
    var date = new Date(item.timestamp);
    return item.timestamp && !isNaN(date.getTime()) && date >= cutoff;
  });

  var sessions = uniqueCount_(rows, 'session_id');
  var pageViews = rows.filter(function (item) { return item.event_name === 'ab_page_view'; });
  var activeUsers = Math.max(sessions, uniqueCount_(pageViews, 'session_id'));
  var uxNames = ['dead_click', 'rage_click', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_90', 'scroll_100'];

  return {
    ok: true,
    range: 'last 30 days',
    updatedAt: new Date().toISOString(),
    overview: {
      activeUsers: activeUsers,
      sessions: sessions,
      views: pageViews.length,
      events: rows.length
    },
    events: topCounts_(rows, 'event_name', 'event', 10),
    uxSignals: topCounts_(rows.filter(function (item) {
      return uxNames.indexOf(item.event_name) !== -1;
    }), 'event_name', 'event', 10),
    pages: topCounts_(pageViews, 'page_path', 'path', 10, 'views'),
    sources: topSources_(pageViews),
    devices: topCounts_(rows, 'device_type', 'device', 8, 'sessions'),
    daily: dailyUsers_(rows),
    recent: rows.slice(-25).reverse()
  };
}

function rowToObject_(row) {
  var object = {};
  HEADERS.forEach(function (key, index) {
    object[key] = row[index];
  });
  return object;
}

function emptySummary_() {
  return {
    ok: true,
    range: 'last 30 days',
    updatedAt: new Date().toISOString(),
    overview: { activeUsers: 0, sessions: 0, views: 0, events: 0 },
    events: [],
    uxSignals: [],
    pages: [],
    sources: [],
    devices: [],
    daily: [],
    recent: []
  };
}

function topCounts_(rows, sourceKey, labelKey, limit, valueKey) {
  var counts = {};
  rows.forEach(function (item) {
    var key = item[sourceKey] || 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.keys(counts)
    .map(function (key) {
      var result = {};
      result[labelKey] = key;
      result[valueKey || 'count'] = counts[key];
      return result;
    })
    .sort(function (a, b) {
      return (b[valueKey || 'count'] || 0) - (a[valueKey || 'count'] || 0);
    })
    .slice(0, limit || 10);
}

function topSources_(rows) {
  var mapped = rows.map(function (item) {
    var source = 'Direct';
    if (item.referrer) {
      try {
        source = new URL(item.referrer).hostname.replace(/^www\./, '');
      } catch (error) {
        source = item.referrer;
      }
    }
    return { source: source };
  });
  return topCounts_(mapped, 'source', 'source', 10, 'sessions');
}

function dailyUsers_(rows) {
  var byDate = {};
  rows.forEach(function (item) {
    var date = new Date(item.timestamp);
    if (isNaN(date.getTime())) return;
    var key = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    byDate[key] = byDate[key] || {};
    byDate[key][item.session_id || 'unknown'] = true;
  });

  return Object.keys(byDate).sort().slice(-14).map(function (date) {
    return { date: date, users: Object.keys(byDate[date]).length };
  });
}

function uniqueCount_(rows, key) {
  var seen = {};
  rows.forEach(function (item) {
    if (item[key]) seen[item[key]] = true;
  });
  return Object.keys(seen).length;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
