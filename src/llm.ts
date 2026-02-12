import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMessage(
  company: string,
  title: string,
  description: string
): Promise<string> {

  const prompt = `
Write a professional outreach message for this job.

Company: ${company}
Role: ${title}

Job Description:
${description.slice(0, 3000)}

Tone: confident and concise.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content || "";
}
