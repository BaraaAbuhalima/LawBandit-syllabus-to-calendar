import { uploadFileInput } from "./uploadFileInput";
import { createOpenAiRequestContent } from "@/app/lib/openai/createOpenAiRequestContent";
import { getSyllabusToCalendarPrompt } from "@/app/lib/prompts/syllabusToCalendar";

export const getOpenAiRequestContent = async (file: File) => {
  const prompt = getSyllabusToCalendarPrompt();
  const fileObject = await uploadFileInput(file);
  return createOpenAiRequestContent(prompt, fileObject);
};
