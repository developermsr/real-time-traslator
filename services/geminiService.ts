
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function translateText(text: string): Promise<string> {
  try {
    const prompt = `Translate the following English text to Spanish. Provide only the translation, without any additional explanations, context, or quotation marks.\n\nEnglish: "${text}"\n\nSpanish:`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error in translateText:', error);
    return `[Translation Error]`;
  }
}

export async function detectQuestion(text: string): Promise<boolean> {
  try {
    const prompt = `Analyze the following English text and determine if it is a question. Respond in JSON format.\n\nText: "${text}"`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_question: {
              type: Type.BOOLEAN,
              description: "True if the text is a question, false otherwise."
            }
          },
          propertyOrdering: ["is_question"],
        }
      }
    });
    const result = JSON.parse(response.text);
    return result.is_question || false;
  } catch (error) {
    console.error('Error in detectQuestion:', error);
    // Default to false on error to avoid unnecessary answer generation
    return false;
  }
}

export async function generateAnswer(question: string): Promise<string> {
  try {
    const prompt = `You are a helpful AI assistant. Provide a short, concise, and clear answer in English to the following question. Do not start with phrases like "The answer is" or "Here is the answer".\n\nQuestion: "${question}"`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 100 }
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error in generateAnswer:', error);
    return `[Could not generate an answer]`;
  }
}
