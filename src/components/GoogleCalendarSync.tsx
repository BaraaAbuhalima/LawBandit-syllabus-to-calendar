"use client";

import { useEffect, useState, useRef } from "react";
import { Button, Stack, Alert, CircularProgress, Tooltip } from "@mui/material";
import { CalendarEvent } from "@/types/openAi";

interface Props {
  events: CalendarEvent[];
}

interface SyncResponse {
  inserted: number;
  total: number;
  results?: { status: string }[];
}

export default function GoogleCalendarSync({ events }: Props) {
  
  const [authorized, setAuthorized] = useState(false);
  const [expired, setExpired] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const autoSyncPending = useRef(false);

  useEffect(() => {
    let active = true;
    fetch("/api/google/status")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setAuthorized(!!data.authorized);
        setExpired(!!data.expired);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const runSync = async () => {
    if (!events.length) return;
    setSyncing(true);
    setResultMsg(null);
    try {
      const res = await fetch("/api/google/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: events.map((e) => ({
            id: e.id,
            title: e.title,
            date: e.date.toISOString(),
            allDay: e.allDay,
            shortDescription: e.shortDescription,
            fullDescription: e.fullDescription,
            keywords: e.keywords,
          })),
        }),
      });
      const data: SyncResponse & { error?: string } = await res.json();
      if (res.ok) {
        const skipped =
          data.results?.filter((r) => r.status === "skipped").length || 0;
        const errors =
          data.results?.filter((r) => r.status === "error").length || 0;
        setResultMsg(
          `Inserted ${data.inserted}. Skipped ${skipped}. Errors ${errors}.`
        );
      } else if (res.status === 401) {
        setAuthorized(false);
        setResultMsg("Authorization expired. Please reconnect.");
      } else {
        setResultMsg(data.error || "Sync failed");
      }
    } catch {
      setResultMsg("Network error");
    } finally {
      setSyncing(false);
      autoSyncPending.current = false;
    }
  };

  const authorize = async () => {
    try {
      const resp = await fetch("/api/google/auth?popup=1");
      const data = await resp.json();
      if (!resp.ok) {
        setResultMsg(
          data.missing
            ? `Missing env vars: ${data.missing.join(", ")}`
            : data.error || "Auth init failed"
        );
        return;
      }
      if (!data.url) {
        setResultMsg("No auth URL returned");
        return;
      }
      autoSyncPending.current = true; 
      const w = 500;
      const h = 600;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(
        data.url,
        "google-oauth",
        `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no`
      );
      if (!popup) return;
      const handler = (evt: MessageEvent) => {
        if (!evt.data || evt.data.source !== "google-oauth") return;
        setAuthorized(true);
        setExpired(false);
        setResultMsg("Connected to Google Calendar");
        window.removeEventListener("message", handler);
        if (autoSyncPending.current) runSync();
      };
      window.addEventListener("message", handler);
    } catch {
      setResultMsg("Auth request failed");
    }
  };

  if (!events.length) return null;

  return (
    <Stack
      spacing={1}
      direction={{ xs: "column", sm: "row" }}
      sx={{ mt: 2 }}
      alignItems="center"
    >
      {!authorized && (
        <Button variant="outlined" onClick={authorize} color="primary">
          Connect Google Calendar
        </Button>
      )}
      {authorized && (
        <Tooltip
          title={
            expired
              ? "Session will refresh automatically on sync"
              : "Authorized"
          }
        >
          <span>
            <Button
              variant="contained"
              onClick={runSync}
              disabled={syncing}
              startIcon={syncing ? <CircularProgress size={16} /> : undefined}
            >
              {syncing ? "Syncing…" : "Sync to Google"}
            </Button>
          </span>
        </Tooltip>
      )}
      {resultMsg && (
        <Alert
          severity={resultMsg.includes("Inserted") ? "success" : "warning"}
        >
          {resultMsg}
        </Alert>
      )}
    </Stack>
  );
}
