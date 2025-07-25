import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generatePortfolioFeedback(
  prompt: string,
  portfolioContext?: string
): Promise<string> {
  try {
    const systemPrompt = `You are an experienced career advisor and portfolio reviewer. You provide constructive, actionable feedback on portfolios, resumes, and career development. Your responses are professional, encouraging, and specific.

Portfolio Context: ${portfolioContext || 'Professional software developer portfolio'}

Guidelines for feedback:
- Be specific and actionable
- Highlight strengths first
- Suggest concrete improvements
- Consider current industry trends
- Keep responses conversational but professional
- Focus on practical advice`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${prompt}`;

    // Corrected API call
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text
      || "I apologize, but I couldn't generate a response at this time. Please try again.";
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate AI response. Please check your API configuration.');
  }
}

export async function analyzePortfolioSection(
  section: string,
  content: any
): Promise<string> {
  try {
    const prompt = `Analyze this ${section} section of a portfolio and provide specific feedback:

${JSON.stringify(content, null, 2)}

Please provide:
1. What's working well
2. Areas for improvement
3. Specific suggestions
4. Industry best practices

Keep the response concise but thorough.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text
      || "Unable to analyze this section at the moment.";
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    throw new Error('Failed to analyze portfolio section.');
  }
}
