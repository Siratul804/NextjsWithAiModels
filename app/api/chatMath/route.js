import { NextResponse } from "next/server";
import { Ollama } from "@langchain/ollama";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

// Initialize the Ollama model
const llm = new Ollama({
  model: "qwen2.5-coder:1.5b",
  temperature: 0,
  maxRetries: 2,
});

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

    const examples = [
      {
        input: "2+2",
        output: "4",
      },
      {
        input: "2+3",
        output: "5",
      },
    ];

    const examplePrompt = ChatPromptTemplate.fromTemplate(`Human: {input}
  AI: {output}`);

    const fewShotPrompt = new FewShotChatMessagePromptTemplate({
      examplePrompt,
      examples,
      inputVariables: ["input"],
    });

    const finalPrompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful math problem solver."],
      fewShotPrompt,
      ["human", "{input}"],
    ]);

    const formattedChatPrompt = await finalPrompt.format({
      input: query,
    });

    const response = await llm.invoke(formattedChatPrompt);

    // Invoke the LLM
    // const result = await llm.invoke(query);

    console.log("LLM Result:", response);

    // Return the response as JSON
    return NextResponse.json({ data: response });
  } catch (err) {
    console.error("Error invoking Ollama:", err);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to fetch the response from Ollama." },
      { status: 500 }
    );
  }
}
