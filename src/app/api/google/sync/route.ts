import { NextRequest, NextResponse } from "next/server";
import { calendarClient, getOAuthClient } from "@/lib/google/client";
import { calendar_v3 } from "googleapis";
interface SimplifiedEventItem {
  summary?: string | null;
  start?: { date?: string; dateTime?: string };
}

const TOKEN_COOKIE = "google_tokens";

interface StoredTokens {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

interface IncomingEvent {
  id: number;
  title: string;
  date: string;
  allDay: boolean;
  shortDescription: string;
  fullDescription: string;
  keywords: string;
}

export async function POST(req: NextRequest) {
  const rawTokens = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!rawTokens) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  let tokens: StoredTokens;
  try {
    tokens = JSON.parse(
      Buffer.from(rawTokens, "base64").toString("utf8")
    ) as StoredTokens;
  } catch {
    return NextResponse.json({ error: "Corrupt token store" }, { status: 400 });
  }
  if (!tokens.refresh_token) {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 401 }
    );
  }

  const now = Date.now();
  let refreshedTokens = false;
  if (!tokens.expiry_date || tokens.expiry_date < now + 60_000) {
    try {
      const oauth = getOAuthClient();
      oauth.setCredentials({ refresh_token: tokens.refresh_token });
      const refreshed = await oauth.refreshAccessToken();
      const creds = refreshed.credentials;
      if (creds.access_token) {
        tokens.access_token = creds.access_token;
      }
      if (typeof creds.expiry_date === "number") {
        tokens.expiry_date = creds.expiry_date;
      }
      refreshedTokens = true;
    } catch (e) {
      console.error("Token refresh failed", e);
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 401 }
      );
    }
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.events)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const events: IncomingEvent[] = body.events;
  if (events.length === 0) {
    return NextResponse.json({
      inserted: 0,
      total: 0,
      results: [],
      note: "No events supplied",
    });
  }

  const calendar = calendarClient(tokens);
  const existingKeys = new Set<string>();
  try {
    const dates = events.map((e) => new Date(e.date));
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    const timeMin = new Date(
      min.getFullYear(),
      min.getMonth(),
      min.getDate(),
      0,
      0,
      0
    ).toISOString();
    const timeMax = new Date(
      max.getFullYear(),
      max.getMonth(),
      max.getDate() + 1,
      0,
      0,
      0
    ).toISOString();
    let pageToken: string | undefined = undefined;
    do {
      const resp = await calendar.events.list({
        calendarId: "primary",
        timeMin,
        timeMax,
        singleEvents: true,
        maxResults: 2500,
        pageToken,
      });
      const data = resp.data as calendar_v3.Schema$Events;
      const items = (data.items as SimplifiedEventItem[] | undefined) || [];
      for (const it of items) {
        const summary = (it.summary || "").trim();
        let dateKey: string | undefined;
        if (it.start?.date) {
          dateKey = it.start.date;
        } else if (it.start?.dateTime) {
          dateKey = it.start.dateTime.substring(0, 10);
        }
        if (summary && dateKey) {
          existingKeys.add(`${summary}|${dateKey}`);
        }
      }
      pageToken = data.nextPageToken || undefined;
    } while (pageToken);
  } catch (e) {
    console.warn("Prefetch for dedupe failed", e);
  }

  const results: {
    id?: string;
    status: "ok" | "error" | "skipped";
    summary?: string;
    htmlLink?: string;
    errorMessage?: string;
  }[] = [];
  for (const ev of events) {
    try {
      const startDate = new Date(ev.date);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const localDateStr = `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
      const nextDayDateStr = `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}-${String(startDate.getDate() + 1).padStart(2, "0")}`;
      const dedupeKey = `${ev.title.trim()}|${localDateStr}`;
      if (existingKeys.has(dedupeKey)) {
        results.push({ status: "skipped", summary: ev.title });
        continue;
      }

      const gEvent = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: ev.title,
          description: `${ev.fullDescription}\n\nKeywords: ${ev.keywords}`,
          start: ev.allDay
            ? { date: localDateStr }
            : { dateTime: startDate.toISOString() },
          end: ev.allDay
            ? { date: nextDayDateStr }
            : { dateTime: endDate.toISOString() },
        },
      });
      results.push({
        id: gEvent.data.id ?? undefined,
        status: "ok",
        summary: ev.title,
        htmlLink: gEvent.data.htmlLink ?? undefined,
      });
      existingKeys.add(dedupeKey);
    } catch (e) {
      let msg = "Unknown error";
      if (e && typeof e === "object") {
        const objErr = e as Record<string, unknown>;
        const nestedErrorsVal = objErr["errors"];
        if (Array.isArray(nestedErrorsVal)) {
          const first = nestedErrorsVal[0];
          if (
            first &&
            typeof first === "object" &&
            "message" in first &&
            typeof (first as Record<string, unknown>)["message"] === "string"
          ) {
            msg = (first as Record<string, unknown>)["message"] as string;
          }
        }
        const messageVal = objErr["message"];
        if (typeof messageVal === "string") {
          msg = messageVal;
        }
      }
      console.error("Event insert failed", msg);
      results.push({ status: "error", summary: ev.title, errorMessage: msg });
    }
  }
  const successCount = results.filter((r) => r.status === "ok").length;
  let rootCause: string | undefined;
  let helpLink: string | undefined;
  if (successCount === 0 && results.every((r) => r.status === "error")) {
    const disabledMsg = results.find(
      (r) =>
        r.errorMessage &&
        /has not been used in project|is disabled/i.test(r.errorMessage)
    );
    if (disabledMsg) {
      rootCause = "CALENDAR_API_DISABLED";
      helpLink =
        "https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=836078430097";
    }
  }
  const res = NextResponse.json({
    inserted: successCount,
    total: results.length,
    results,
    rootCause,
    helpLink,
  });
  if (refreshedTokens) {
    try {
      const payload = JSON.stringify(tokens);
      res.cookies.set({
        name: TOKEN_COOKIE,
        value: Buffer.from(payload).toString("base64"),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    } catch (e) {
      console.error("Failed to persist refreshed tokens", e);
    }
  }
  return res;
}
