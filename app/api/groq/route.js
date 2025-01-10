import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY, // This is the default and can be omitted
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
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        model: "llama3-8b-8192",
      });

      console.log(chatCompletion.choices[0].message.content);
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
