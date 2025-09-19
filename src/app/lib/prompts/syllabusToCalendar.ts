const syllabusToCalendarPrompt = `You will be given the plain text of a syllabus. Identify TABLE ROWS
or LINES that look like schedule entries (they contain a date, a week number,
a weekday, keywords such as assignment, due, reading, exam, project, quiz).\n\n
Return ONLY a valid JSON array of objects.Do NOT wrap it in \`\`\`json or any code block 
if you don't find a date for an event extract it from the week + the year and which semester it is (spring/fall).
Each object MUST have:
- "week" (string),
- "date" (string "MM-dd-yyyy" ),
- "fullDescription" (string, a full description of the task),
- "shortDescription" (string, maximum 5 words description of the task),
- "keywords" (a string , e.g. "exam","assignment","task","quiz"). in other words it describe the activity 
If you cannot find a any week/date...etc, set it to null. 
Do not include any explanation or text outside the JSON array.
`;

export const getSyllabusToCalendarPrompt = () => syllabusToCalendarPrompt;
