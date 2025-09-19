import { openai } from "@/app/lib/openai/client";
import { getOpenAiRequestContent } from "@/app/lib/openai/getOpenAiRequestContent";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: `File too large: ${(file.size / (1024 * 1024)).toFixed(
            2
          )} MB. Max 5.00 MB`,
        },
        { status: 413 }
      );
    }
    const content = await getOpenAiRequestContent(file);
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    const resultText = response.output_text;
    return NextResponse.json({ result: resultText });
  } catch (error: unknown) {
    let message = "Unknown error";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
