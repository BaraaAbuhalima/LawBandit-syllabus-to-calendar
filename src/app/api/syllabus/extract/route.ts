import { openai } from "@/app/lib/openai/client";
import { getOpenAiRequestContent } from "@/app/lib/openai/getOpenAiRequestContent";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
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
