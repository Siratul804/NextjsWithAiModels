import { Ollama } from "@langchain/ollama";

const llm = new Ollama({
  model: "qwen2.5-coder:1.5b",
  temperature: 0,
  maxRetries: 2,
});

export const ResLama = async (q) => {
  try {
    // console.log();
    const inputText = q;

    const response = await llm.invoke(inputText);
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Res!");
  }
};
