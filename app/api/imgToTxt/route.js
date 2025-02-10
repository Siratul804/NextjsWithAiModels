import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filename } = req.body;
    const filePath = path.join(process.cwd(), "public", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "File not found" });
    }

    const data = fs.readFileSync(filePath);

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/Salesforce/blip-image-captioning-base",
      {
        headers: {
          Authorization: process.env.HF_API_KEY,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
