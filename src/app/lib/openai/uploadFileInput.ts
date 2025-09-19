import { openai } from "./client";
import { OpenAiFileObject } from "@/types/openAi";

export const uploadFileInput = async (
  file: File
): Promise<OpenAiFileObject> => {
  const uploadedFile = await openai.files.create({
    file: file,
    purpose: "assistants",
  });

  const fileObjects: OpenAiFileObject = {
    type: "input_image",
    file_id: uploadedFile.id,
  };

  return fileObjects;
};
