export type OpenAiFileObject = {
  type: "input_file" | "input_image";
  file_id: string;
};
export type SyllabusScheduleEntry = {
  week: string | null;
  date: string | null;
  fullDescription: string | null;
  shortDescription: string | null;
  keywords: string | null;
};

export type CalendarEvent = {
  id: number;
  title: string;
  date: Date; 
  allDay: boolean;
  tooltipId: string;
  tooltipText: string;
  shortDescription: string;
  fullDescription: string;
  keywords: string;
  color: string;
};
export type SyllabusEvent = {
  id: number;
  date: Date;
  shortDescription: string;
  fullDescription: string;
  keywords: string;
};
