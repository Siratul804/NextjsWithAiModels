import { NextResponse } from "next/server";
import { Ollama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { Document } from "@langchain/core/documents";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

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

    const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question.
    Context : {context}
    Question : {input}
    `);

    // const chain = prompt.pipe(llm);

    const chain = await createStuffDocumentsChain({
      llm: llm,
      prompt,
    });

    //Docs

    // const docA = new Document({
    //   pageContent:
    //     "LangChain Expression Language, or LCEL, is a declarative way to easily compose chains together.",
    // });

    // const docB = new Document({
    //   pageContent: "siratul is a man !",
    // });

    const loader = new PlaywrightWebBaseLoader(
      "https://js.langchain.com/v0.1/docs/expression_language/"
    );

    const docs = await loader.load();

    // console.log(docs);

    const res = await chain.invoke({
      input: query,
      context: docs,
    });

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
