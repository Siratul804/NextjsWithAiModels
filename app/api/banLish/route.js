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
        input: "scroll kore 20/30 second er video pann nai???",
        output: "স্ক্রোল করে ২০/৩০ সেকেন্ড এর ভিডিও পান নাই???",
      },
      {
        input: "ami tomake bhalobashi",
        output: "আমি তোমাকে ভালোবাসি",
      },
      {
        input: "tumi ki korcho?",
        output: "তুমি কি করছো?",
      },
    ];

    const examplePrompt =
      ChatPromptTemplate.fromTemplate(`Human: Convert the following Banglish to Bengali: {input}
      AI: {output}`);

    const fewShotPrompt = new FewShotChatMessagePromptTemplate({
      examplePrompt,
      examples,
      inputVariables: ["input"],
    });

    const finalPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant that converts Banglish text (Bengali written in English letters) to Bengali.",
      ],
      fewShotPrompt,
      ["human", "Convert the following Banglish to Bengali: {input}"],
    ]);

    const formattedChatPrompt = await finalPrompt.format({
      input: query, // Replace with the actual input string.
    });

    const response = await llm.invoke(formattedChatPrompt);

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
