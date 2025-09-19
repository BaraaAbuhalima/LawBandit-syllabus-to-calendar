"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Tooltip } from "react-tooltip";
import { CalendarEvent } from "@/types/openAi";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Box, Paper, useTheme } from "@mui/material";

import { useState, useMemo, useCallback } from "react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

export interface CalendarDnDArgs<T = CalendarEvent> {
  event: T;
  date: Date;
  allDay?: boolean;
}

type Props = {
  events: CalendarEvent[];
  onEventDrop: (args: CalendarDnDArgs) => void;
  onSelectEvent: (event: CalendarEvent) => void;
};

export default function SyllabusCalendar({
  events,
  onEventDrop,
  onSelectEvent,
}: Props) {
  const theme = useTheme();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">(
    "month"
  );

  const views = useMemo(
    () => ({ month: true, week: true, day: true, agenda: true }),
    []
  );

  const mapKeywordsToColor = useCallback(
    (keywords: string) => {
      const seed = (keywords || "fallback").toLowerCase();
      let hash = 0;
      for (let i = 0; i < seed.length; i++)
        hash = (hash << 5) - hash + seed.charCodeAt(i);
      const h = Math.abs(hash) % 360;
      const s = 55 + (Math.abs(hash) % 10);
      const l =
        theme.palette.mode === "light"
          ? 72 + (Math.abs(hash) % 8)
          : 48 + (Math.abs(hash) % 8);
      return `hsl(${h} ${s}% ${l}%)`;
    },
    [theme.palette.mode]
  );

  const eventPropGetter = (event: CalendarEvent) => {
    if (!event.color) {
      event.color = mapKeywordsToColor(event.keywords || "");
    }
    return {
      style: {
        backgroundColor: event.color,
        color: theme.palette.getContrastText(event.color),
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "2px 4px",
        fontSize: "0.72rem",
        lineHeight: 1.1,
        cursor: "pointer",
      },
      "data-tooltip-id": event.tooltipId,
      "data-tooltip-content": event.tooltipText,
    } as Record<string, unknown>;
  };

  interface InternalDropArgs {
    event: CalendarEvent;
    start: Date | string;
    end: Date | string;
    allDay?: boolean;
    isAllDay?: boolean;
  }
  const handleDrop = ({ event, start, allDay, isAllDay }: InternalDropArgs) => {
    const startDate = start instanceof Date ? start : new Date(start);
    onEventDrop({ event, date: startDate, allDay: allDay ?? isAllDay });
  };

  return (
    <Paper elevation={6} sx={{ p: 2, width: "100%", mt: 4, borderRadius: 4 }}>
      <Box sx={{ height: { xs: 480, sm: 520, md: 640 } }}>
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor={(e) => e.date}
          endAccessor={(e) => e.date}
          style={{ height: "100%" }}
          date={calendarDate}
          onNavigate={(d) => setCalendarDate(d)}
          eventPropGetter={eventPropGetter}
          onEventDrop={handleDrop}
          resizable
          onEventResize={handleDrop}
          onSelectEvent={onSelectEvent}
          view={view}
          views={views}
          onView={(v) => setView(v as typeof view)}
        />
        {events.map((e) => (
          <Tooltip key={e.id} id={e.tooltipId ?? `evt-${e.id}`} />
        ))}
      </Box>
    </Paper>
  );
}
