import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(query);

    console.log(
      result.response.candidates.map((val) =>
        val.content.parts.map((val) => val.text)
      )
    );

    const res = result.response.candidates.map((val) =>
      val.content.parts.map((val) => val.text)
    );

    return NextResponse.json({ data: res });
  } catch (err) {
    console.error("Error invoking gemini:", err);
    // Return a graceful error response
    return NextResponse.json(
      { error: "Failed to fetch the response from gemini." },
      { status: 500 }
    );
  }
}
