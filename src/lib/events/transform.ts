import { SyllabusEvent, CalendarEvent } from "@/types/openAi";
import {
  generateEventColor,
  syllabusEventToCalendarEvent,
  syllabusEventsToCalendarEvents as coreSyllabusEventsToCalendarEvents,
} from "@/features/calendar/lib/transform";

export { generateEventColor, syllabusEventToCalendarEvent };

export function syllabusEventsToCalendarEvents(
  events: SyllabusEvent[]
): CalendarEvent[] {
  return coreSyllabusEventsToCalendarEvents(events);
}
