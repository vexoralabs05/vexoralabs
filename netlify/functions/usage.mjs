

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { google } = require("googleapis");

const ALLOWED_ORIGINS = new Set([
  "https://vexoralabs.com.lk",
  "https://www.vexoralabs.com.lk",
]);

const PRIVATE_SUBSCRIPTION_HOST = "sg3.vpnlanka.store";

function response(data, status, origin) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Vary": "Origin",
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }

  return new Response(JSON.stringify(data), { status, headers });
}

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findColumn(headers, aliases) {
  return headers.findIndex((header) =>
    aliases.includes(normalizeHeader(header))
  );
}

function parseDate(value) {
  if (!value) return 0;
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseUsageHeader(header) {
  const values = {};

  for (const item of header.split(";")) {
    const [key, value] = item.trim().split("=");
    if (key && value !== undefined) {
      values[key.trim().toLowerCase()] = value.trim();
    }
  }

  const upload = Number(values.upload || 0);
  const download = Number(values.download || 0);
  const total = Number(values.total || 0);
  const expire = Number(values.expire || 0);

  if (![upload, download, total, expire].every(Number.isFinite)) {
    throw new Error("Invalid usage data");
  }

  const used = upload + download;
  const remaining = total > 0 ? Math.max(total - used, 0) : null;

  let status = "active";

  if (expire > 0 && Date.now() >= expire * 1000) {
    status = "expired";
  } else if (total > 0 && used >= total) {
    status = "limit_reached";
  }

  const toGB = (bytes) =>
    Number((bytes / (1024 ** 3)).toFixed(2));

  return {
    uploadGB: toGB(upload),
    downloadGB: toGB(download),
    usedGB: toGB(used),
    totalGB: total > 0 ? toGB(total) : null,
    remainingGB: remaining === null ? null : toGB(remaining),
    expiry: expire > 0
      ? new Date(expire * 1000).toISOString()
      : null,
    status,
  };
}

async function getCustomer(portalId) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const credentialsJSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!sheetId || !credentialsJSON) {
    throw new Error("Backend configuration missing");
  }

  const credentials = JSON.parse(credentialsJSON);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties.title",
  });

  const sheetNames = (metadata.data.sheets || [])
    .map((sheet) => sheet.properties.title);

  const results = await Promise.all(
    sheetNames.map(async (sheetName) => {
      const escapedName = sheetName.replace(/'/g, "''");

      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${escapedName}'!A:Z`,
      });

      const rows = result.data.values || [];
      if (rows.length < 2) return [];

      const headers = rows[0];

      const portalColumn = findColumn(headers, ["portalid"]);
      const urlColumn = findColumn(headers, [
        "subscribtionusagelink",
        "subscriptionusagelink",
      ]);
      const nameColumn = findColumn(headers, ["name"]);
      const packageColumn = findColumn(headers, ["isppackagename"]);
      const dateColumn = findColumn(headers, ["date"]);

      if (portalColumn < 0 || urlColumn < 0) return [];

      return rows.slice(1)
        .filter((row) =>
          String(row[portalColumn] || "").trim() === portalId
        )
        .map((row) => ({
          name: row[nameColumn] || "Customer",
          packageName: row[packageColumn] || "VPN Package",
          date: row[dateColumn] || "",
          subscriptionUrl: String(row[urlColumn] || "").trim(),
        }))
        .filter((customer) => customer.subscriptionUrl);
    })
  );

  const matches = results.flat();

  if (matches.length === 0) return null;

  matches.sort((a, b) =>
    parseDate(b.date) - parseDate(a.date)
  );

  return matches[0];
}

export default async (req) => {
  const origin = req.headers.get("origin") || "";

  if (req.method === "OPTIONS") {
    if (!ALLOWED_ORIGINS.has(origin)) {
      return response({ error: "Not allowed" }, 403, origin);
    }

    return response({}, 204, origin);
  }

  if (req.method !== "POST") {
    return response({ error: "Method not allowed" }, 405, origin);
  }

  if (!ALLOWED_ORIGINS.has(origin)) {
    return response({ error: "Not allowed" }, 403, origin);
  }

  try {
    const body = await req.json();
    const portalId = String(body.portalId || "").trim();

    if (!/^[A-Za-z0-9_-]{8,128}$/.test(portalId)) {
      return response({ error: "Invalid request" }, 400, origin);
    }

    const customer = await getCustomer(portalId);

    if (!customer) {
      return response({ error: "Usage information unavailable" }, 404, origin);
    }

    const subscription = new URL(customer.subscriptionUrl);

    if (
      subscription.protocol !== "https:" ||
      subscription.hostname !== PRIVATE_SUBSCRIPTION_HOST
    ) {
      throw new Error("Invalid subscription host");
    }

    const upstream = await fetch(subscription, {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      headers: {
        "Accept": "text/plain",
      },
    });

    if (!upstream.ok) {
      throw new Error("Subscription provider unavailable");
    }

    const usageHeader = upstream.headers.get("subscription-userinfo");

    if (!usageHeader) {
      throw new Error("Usage header unavailable");
    }

    const usage = parseUsageHeader(usageHeader);

    return response({
      customerName: customer.name,
      packageName: customer.packageName,
      ...usage,
      updatedAt: new Date().toISOString(),
    }, 200, origin);

  } catch {
    // Do not log customer tokens, subscription URLs or credentials.
    return response(
      { error: "Unable to retrieve usage information" },
      500,
      origin
    );
  }
};
