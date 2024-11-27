import { NextResponse } from "next/server";
import { Ollama } from "@langchain/ollama";

// Initialize the Ollama model
const llm = new Ollama({
  model: "qwen2.5-coder:1.5b",
  temperature: 0,
  maxRetries: 2,
});

// export async function GET(request) {
//   try {
//     // Fetch a response from the model
//     const result = await llm.invoke("What is cat?");
//     // Return the response as JSON
//     return NextResponse.json({ data: result });
//   } catch (err) {
//     console.error("Error invoking Ollama:", err);
//     // Return a graceful error response
//     return NextResponse.json(
//       { error: "Failed to fetch the response from Ollama." },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    // Parse the request body
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

    // Invoke the LLM
    const result = await llm.invoke(query);

    console.log("LLM Result:", result);

    // Return the response as JSON
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("Error invoking Ollama:", err);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to fetch the response from Ollama." },
      { status: 500 }
    );
  }
}
