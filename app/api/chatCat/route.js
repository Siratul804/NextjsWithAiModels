import { NextResponse } from "next/server";
import { Ollama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
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

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant that only tell about {input_language}. You are advised to talk about to {output_language} only. If human tells about any other topic without {output_language} then just say : I am sorry , I don't know the answer. Remember don't tell anything if that does not match with the keyword cat. If there is any keyword not related with cat just say: I don't know the answer",
      ],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(llm);
    const res = await chain.invoke({
      input_language: "Cats",
      output_language: "Cats",
      input: query,
    });

    // Invoke the LLM
    // const result = await llm.invoke(query);

    console.log("LLM Result:", res);

    // Return the response as JSON
    return NextResponse.json({ data: res });
  } catch (err) {
    console.error("Error invoking Ollama:", err);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to fetch the response from Ollama." },
      { status: 500 }
    );
  }
}
