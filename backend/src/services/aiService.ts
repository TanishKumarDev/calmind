// ======================================================================
// AI Service (Gemini)
// Handles therapeutic analysis + response generation
// ======================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateTherapeuticResponse({
  message,
  history,
}: {
  message: string;
  history: any[];
}) {
  const analysisPrompt = `Return JSON only. Analyze message:
  Message: ${message}
  Output fields: emotionalState, themes, riskLevel, recommendedApproach, progressIndicators`;

  const analysisRes = await model.generateContent(analysisPrompt);
  const analysis = JSON.parse(analysisRes.response.text().trim());

  const responsePrompt = `You are a licensed AI therapist. Respond empathetically using CBT-like style.
  User message: ${message}
  Analysis: ${JSON.stringify(analysis)}
  Respond with a supportive, safe message.`;

  const reply = await model.generateContent(responsePrompt);

  return {
    response: reply.response.text().trim(),
    analysis,
  };
}
