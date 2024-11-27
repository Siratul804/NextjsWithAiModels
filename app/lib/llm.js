import { Ollama } from "@langchain/ollama";
// import { PromptTemplate } from "@langchain/core/prompts";
const llm = new Ollama({
  model: "qwen2.5-coder:1.5b",
  temperature: 0,
  maxRetries: 2,
});
// import { ChatPromptTemplate } from "@langchain/core/prompts";

export const ResLama = async (q) => {
  try {
    const inputText = q;

    //easyToUse (String Model)
    // const template = "Tell me a trick of {language} from {topic}";

    // const promptTemplate = PromptTemplate.fromTemplate(template);

    // const formatedpromptTemplate = await promptTemplate.format({
    //   language: inputText,
    //   topic: "array",
    // });

    /// Next Task Chat Model Template

    // const aiMsg = await llm.invoke([
    //   [
    //     "system",
    //     "You are a helpful assistant that translates English to French. Translate the user sentence.",
    //   ],
    //   ["human", inputText],
    // ]);
    // console.log(aiMsg);

    // const prompt = ChatPromptTemplate.fromMessages([
    //   [
    //     "system",
    //     "You are a helpful assistant that translates {input_language} to {output_language}.",
    //   ],
    //   ["human", "{input}"],
    // ]);

    // const chain = prompt.pipe(llm);
    // const res = await chain.invoke({
    //   input_language: "English",
    //   output_language: "German",
    //   input: inputText,
    // });

    // console.log(res);

    const response = await llm.invoke(inputText);
    // const response = await llm.invoke(formatedpromptTemplate);
    // const response = await llm.invoke(inputText);
    // return aiMsg;
    // return res;
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Res!");
  }
};
