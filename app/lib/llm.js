import { Ollama } from "@langchain/ollama";
// import { PromptTemplate } from "@langchain/core/prompts";
const llm = new Ollama({
  model: "qwen2.5-coder:1.5b",
  temperature: 0,
  maxRetries: 2,
});

export const ResLama = async (q) => {
  try {
    const inputText = q;
    // //one input (String Model)
    // const inputPrompt = new PromptTemplate({
    //   inputVariables: ["language"],
    //   template: "Tell me a trick of {language}",
    // });

    // const formatedInputPrompt = await inputPrompt.format({
    //   language: inputText,
    // });

    //multi input(String Model)
    // const multiInputPrompt = new PromptTemplate({
    //   inputVariables: ["language", "topic"],
    //   template: "Tell me a trick of {language} from {topic}",
    // });

    // const formatedMultiInputPrompt = await multiInputPrompt.format({
    //   language: inputText,
    //   topic: "function",
    // });

    //easyToUse (String Model)
    // const template = "Tell me a trick of {language} from {topic}";

    // const promptTemplate = PromptTemplate.fromTemplate(template);

    // const formatedpromptTemplate = await promptTemplate.format({
    //   language: inputText,
    //   topic: "array",
    // });

    /// Next Task Chat Model Template

    // const response = await llm.invoke(inputText);
    // const response = await llm.invoke(formatedInputPrompt);
    // const response = await llm.invoke(formatedMultiInputPrompt);
    // const response = await llm.invoke(formatedpromptTemplate);
    const response = await llm.invoke(inputText);
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Res!");
  }
};
