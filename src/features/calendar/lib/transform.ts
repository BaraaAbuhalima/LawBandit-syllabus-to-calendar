import { CalendarEvent, SyllabusEvent } from "@/types/openAi";

export function generateEventColor(
  seed: string | number | null | undefined
): string {
  if (seed === null || seed === undefined) return "#888888";
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const h = Math.abs(hash) % 360;
  const s = 55 + (Math.abs(hash) % 10);
  const l = 72 + (Math.abs(hash) % 8);
  return `hsl(${h} ${s}% ${l}%)`;
}

export function syllabusEventToCalendarEvent(
  event: SyllabusEvent
): CalendarEvent {
  return {
    id: event.id,
    title: `${event.keywords} - ${event.shortDescription}`.trim(),
    date: event.date instanceof Date ? event.date : new Date(event.date),
    allDay: true,
    tooltipId: `evt-${event.id}`,
    tooltipText: event.keywords,
    shortDescription: event.shortDescription,
    fullDescription: event.fullDescription,
    keywords: event.keywords,
    color: generateEventColor(event.keywords || event.id),
  };
}

export function syllabusEventsToCalendarEvents(
  events: SyllabusEvent[]
): CalendarEvent[] {
  return events.map(syllabusEventToCalendarEvent);
}
