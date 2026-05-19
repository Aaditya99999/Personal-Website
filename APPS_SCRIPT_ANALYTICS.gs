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

  var days = Math.max(1, Math.min(90, Number(params.days || 30)));
  return json_(buildSummary_(days));
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

function buildSummary_(days) {
  var sheet = getEventsSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return emptySummary_(days);
  }

  var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  var rows = values.map(rowToObject_).filter(function (item) {
    var date = new Date(item.timestamp);
    return item.timestamp && !isNaN(date.getTime()) && date >= cutoff;
  });

  var sessions = uniqueCount_(rows, 'session_id');
  var pageViews = rows.filter(function (item) { return item.event_name === 'ab_page_view'; });
  var activeUsers = Math.max(sessions, uniqueCount_(pageViews, 'session_id'));
  var uxNames = ['dead_click', 'rage_click', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_90', 'scroll_100'];
  var whatsappClicks = rows.filter(function (item) {
    return item.event_name === 'project_whatsapp_submit' || item.event_name === 'whatsapp_click';
  }).length;

  return {
    ok: true,
    range: days === 1 ? 'today' : 'last ' + days + ' days',
    days: days,
    updatedAt: new Date().toISOString(),
    overview: {
      activeUsers: activeUsers,
      sessions: sessions,
      views: pageViews.length,
      events: rows.length,
      whatsappClicks: whatsappClicks,
      whatsappConversionRate: pageViews.length ? Math.round((whatsappClicks / pageViews.length) * 1000) / 10 : 0
    },
    events: topCounts_(rows, 'event_name', 'event', 10),
    uxSignals: topCounts_(rows.filter(function (item) {
      return uxNames.indexOf(item.event_name) !== -1;
    }), 'event_name', 'event', 10),
    pages: topCounts_(pageViews, 'page_path', 'path', 10, 'views'),
    sources: topSources_(pageViews),
    devices: topCounts_(rows, 'device_type', 'device', 8, 'sessions'),
    topButtons: topButtons_(rows),
    packageChoices: packageChoices_(rows),
    deadClicks: deadClickDetails_(rows),
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

function emptySummary_(days) {
  return {
    ok: true,
    range: days === 1 ? 'today' : 'last ' + days + ' days',
    days: days,
    updatedAt: new Date().toISOString(),
    overview: { activeUsers: 0, sessions: 0, views: 0, events: 0, whatsappClicks: 0, whatsappConversionRate: 0 },
    events: [],
    uxSignals: [],
    pages: [],
    sources: [],
    devices: [],
    topButtons: [],
    packageChoices: [],
    deadClicks: [],
    daily: [],
    recent: []
  };
}

function topButtons_(rows) {
  var buttonEvents = [
    'project_whatsapp_submit',
    'whatsapp_click',
    'hero_hire_me_click',
    'start_project_click',
    'footer_start_project_click',
    'hero_portfolio_click',
    'portfolio_card_click',
    'portfolio_click',
    'service_card_click',
    'service_click',
    'phone_click',
    'email_click'
  ];

  var mapped = rows.filter(function (item) {
    return buttonEvents.indexOf(item.event_name) !== -1;
  }).map(function (item) {
    return {
      button: item.link_text || item.button_text || readableButtonName_(item.event_name),
      event: item.event_name,
      page: item.page_path || '/',
      section: item.section || 'unknown'
    };
  });

  return topCounts_(mapped, 'button', 'button', 12);
}

function packageChoices_(rows) {
  var choices = rows.filter(function (item) {
    return item.event_name === 'project_option_select' && item.selected_option;
  }).map(function (item) {
    return { choice: item.selected_option };
  });

  return topCounts_(choices, 'choice', 'choice', 10);
}

function deadClickDetails_(rows) {
  var details = rows.filter(function (item) {
    return item.event_name === 'dead_click';
  }).map(function (item) {
    return {
      location: (item.page_path || '/') + ' / ' + (item.section || 'unknown') + ' / ' + (item.device_type || 'unknown')
    };
  });

  return topCounts_(details, 'location', 'location', 12);
}

function readableButtonName_(eventName) {
  var names = {
    project_whatsapp_submit: 'Send Project on WhatsApp',
    whatsapp_click: 'WhatsApp',
    hero_hire_me_click: 'Hire Me',
    start_project_click: 'Start Project',
    footer_start_project_click: 'Footer Start Project',
    hero_portfolio_click: 'View Portfolio',
    portfolio_card_click: 'Portfolio card',
    portfolio_click: 'Portfolio',
    service_card_click: 'Service card',
    service_click: 'Services',
    phone_click: 'Phone',
    email_click: 'Email'
  };
  return names[eventName] || eventName;
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
