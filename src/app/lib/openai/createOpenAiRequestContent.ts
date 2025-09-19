import { OpenAI } from "openai";
import { OpenAiFileObject } from "@/types/openAi";

export const createOpenAiRequestContent = (
  prompt: string,
  fileObject: OpenAiFileObject
): OpenAI.Responses.ResponseInputMessageContentList => {

  const content: OpenAI.Responses.ResponseInputMessageContentList = [
    {
      type: "input_text",
      text: prompt,
    },
    {
      type: "input_file",
      file_id: fileObject.file_id,
    },
  ];

  return content;
};
