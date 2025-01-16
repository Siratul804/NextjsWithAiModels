import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const userCode = body?.code; // Extract the 'code' field from the body

    if (!userCode || typeof userCode !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing 'code' in request body." },
        { status: 400 }
      );
    }

    async function generateReview(code) {
      const retries = 3;

      const systemPrompt = `You are an expert code reviewer. Analyze the code and return ONLY a JSON object with this exact structure:
          {
            "suggestions": [
              {
                "title": "string",
                "description": "string",
                "code": "string",
                "lineNumber": number
              }
            ],
            "issues": [
              {
                "title": "string",
                "description": "string",
                "severity": "high|medium|low",
                "code": "string",
                "lineNumber": number
              }
            ],
            "improvements": [
              {
                "title": "string",
                "description": "string",
                "code": "string",
                "lineNumber": number
              }
            ]
          }`;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`Attempt ${attempt}: Generating AI review...`);
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: code },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1500,
            top_p: 0.65,
            stream: false,
            stop: null,
          });

          const aiResponse = chatCompletion.choices[0].message.content;

          try {
            const jsonStart = aiResponse.indexOf("{");
            const jsonEnd = aiResponse.lastIndexOf("}") + 1;
            const cleanJson = aiResponse.slice(jsonStart, jsonEnd);
            const parsedResponse = JSON.parse(cleanJson);

            const validatedResponse = {
              suggestions: Array.isArray(parsedResponse.suggestions)
                ? parsedResponse.suggestions.map((s) => ({
                    ...s,
                    lineNumber:
                      typeof s.lineNumber === "number" ? s.lineNumber : null,
                  }))
                : [],
              issues: Array.isArray(parsedResponse.issues)
                ? parsedResponse.issues.map((i) => ({
                    ...i,
                    lineNumber:
                      typeof i.lineNumber === "number" ? i.lineNumber : null,
                    severity: ["high", "medium", "low"].includes(i.severity)
                      ? i.severity
                      : "medium",
                  }))
                : [],
              improvements: Array.isArray(parsedResponse.improvements)
                ? parsedResponse.improvements.map((i) => ({
                    ...i,
                    lineNumber:
                      typeof i.lineNumber === "number" ? i.lineNumber : null,
                  }))
                : [],
            };

            console.log("AI Review Generated Successfully:", validatedResponse);
            return validatedResponse;
          } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            throw new Error("Invalid response format from AI");
          }
        } catch (error) {
          console.error(
            `Attempt ${attempt} - Error generating AI answer:`,
            error.message
          );
          if (attempt === retries) {
            console.error("Max retries reached. Failed to generate AI answer.");
            return {
              suggestions: [],
              issues: [
                {
                  title: "Error Generating Review",
                  description:
                    "An error occurred while generating the AI response after multiple attempts.",
                  severity: "high",
                  code: null,
                  lineNumber: null,
                },
              ],
              improvements: [],
            };
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    const validatedResponse = await generateReview(userCode);
    return NextResponse.json(validatedResponse);
  } catch (err) {
    console.error("Error invoking Groq:", err);
    return NextResponse.json(
      { error: "Failed to fetch the response from Groq." },
      { status: 500 }
    );
  }
}
