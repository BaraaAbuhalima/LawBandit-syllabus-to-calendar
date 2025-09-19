const syllabusToCalenderPrompt = `You will be given the plain text of a syllabus. Identify TABLE ROWS or LINES that look like schedule entries (they contain a date, a week number like "Week 3", a weekday, or keywords such as assignment, due, reading, exam, project, quiz).\n\n
   Return ONLY a valid JSON array of objects. 
Each object MUST have:
- "week" (string),
- "date" (string),
- "description" (string, the full line text),
- "keywords" (a string , e.g. "exam","assignment","task"). in other words it describe the activity 

If you cannot find a week/date, set it to null. 
Do not include any explanation or text outside the JSON array.
`;

export const BuildSyllabusToCalendarPrompt = (syllabusText?: string) => {
  if (syllabusText) {
    return `${syllabusToCalenderPrompt}
        
        Syllabus:
        ${syllabusText}`;
  }
  return syllabusToCalenderPrompt;
};
