import { SyllabusEvent, CalendarEvent } from "@/types/openAi";
import { syllabusEventsToCalendarEvents } from "@/lib/events/transform";

export function mapParsedEntries(raw: unknown): CalendarEvent[] {
  if (!Array.isArray(raw)) return [];
  const syllabusEvents: SyllabusEvent[] = raw.map((e, index) => {
    const obj = e as Record<string, unknown>;
    return {
      id: index,
      date: new Date(String(obj.date)),
      shortDescription: String(obj.shortDescription ?? ""),
      fullDescription: String(obj.fullDescription ?? ""),
      keywords: String(obj.keywords ?? ""),
    };
  });
  return syllabusEventsToCalendarEvents(syllabusEvents);
}

export default mapParsedEntries;
