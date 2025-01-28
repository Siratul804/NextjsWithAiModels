import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
export async function POST(req) {
  try {
    const body = await req.json();
    const { query } = body;

    // Validate input
    if (!query) {
      return NextResponse.json(
        { error: "Query is required in the request body." },
        { status: 400 }
      );
    }

    console.log("Received query:", query);

    async function main() {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "deepseek-chat",
      });

      console.log(completion.choices[0].message.content);
    }

    main();

    return NextResponse.json({ data: query });
  } catch (err) {
    console.error("Error invoking gemini:", err);
    // Return a graceful error response
    return NextResponse.json(
      { error: "Failed to fetch the response from gemini." },
      { status: 500 }
    );
  }
}
