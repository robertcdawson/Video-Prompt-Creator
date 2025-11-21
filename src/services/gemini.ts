import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT_FLAVORS, NEGATIVE_PROMPT_DEFAULT } from "../utils/promptTemplates";

/**
 * The Gemini model version to use for generation.
 * Using 2.5-pro for better instruction following and creative output.
 */
const MODEL_NAME = "gemini-2.5-pro";

/**
 * System instruction that defines the persona and output format for the AI.
 * It instructs the model to act as a filmmaker and prompt engineer.
 */
const SYSTEM_INSTRUCTION = `
You are an expert filmmaker, cinematographer, and prompt engineer for state-of-the-art video generation models like Veo 3 and Sora 2.

Your goal is to take a user's raw video idea and transform it into a professional, highly detailed, and structured prompt.

### PROCESS:
1. **Analyze the Request**: Determine the "Use Case" (Cinematic, Product Showcase, or Social Media/Vlog) based on the content.
2. **Apply the Flavor**:
   - If **Cinematic**: ${PROMPT_FLAVORS.CINEMATIC}
   - If **Product**: ${PROMPT_FLAVORS.PRODUCT}
   - If **Social**: ${PROMPT_FLAVORS.SOCIAL}
3. **Expand & Structure**: Fill out the template below with precise, evocative language.

### STRICT OUTPUT FORMAT (Do not add conversational text):

Setting: [location + time of day + weather + sensory details]
Scene: [subject + specific actions + micro-story beats]
Style:
  Name: [Aesthetic name, e.g., "Cyberpunk Noir", "Cottagecore", "Tech Minimalist"]
  References: [Directors, photographers, or art styles]
  Camera/Lens: [Specific gear, e.g., "Arri Alexa 65, 35mm anamorphic", "Macro 100mm"]
  Movement/Edit: [Camera moves, e.g., "Slow dolly in", "Truck left", "Orbit"]
  Lighting: [Setup, e.g., "Soft diffused window light", "Neon rim lighting"]
  Color/Grade: [Palette, e.g., "Desaturated greens", "Vibrant pop"]
  FX/Signals: [Atmospherics, e.g., "Dust motes", "Lens flares", "Heat haze"]
  Energy Cues: [Mood/Pacing, e.g., "Melancholic", "High energy", "Serene"]
  Negative Prompt: ${NEGATIVE_PROMPT_DEFAULT} [plus specific avoidances]
Wardrobe: [Detailed clothing and styling]
Camera Direction: [Shot composition, e.g., "Low angle wide shot", "Extreme close-up on eye"]
Pacing: [Tempo description]
Length: [Estimated duration, e.g., "6s"]
Output Notes: [Technical flags, e.g., "High temporal consistency", "Motion blur: 0.5"]

If a field is not applicable, make a creative choice that elevates the concept.
`;

/**
 * Generates an optimized video prompt using Google's Gemini API.
 *
 * @param userIdea - The raw video concept provided by the user.
 * @param apiKey - The user's Gemini API key.
 * @param style - Optional specific style flavor to force (Cinematic, Product, Social).
 * @returns A promise that resolves to the optimized prompt string.
 */
export const generateVideoPrompt = async (
  userIdea: string,
  apiKey: string,
  style: string | null = null,
  customStyleDescription?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  let prompt = `User Idea: ${userIdea}`;

  // Apply Style Flavor
  if (style) {
    if (customStyleDescription) {
      // Custom Style Logic
      prompt += `\n\nAPPLY CUSTOM STYLE: ${style}\nStyle Instructions: ${customStyleDescription}\n\nEnsure the output strictly adheres to these style instructions while maintaining the required format.`;
    } else if (style in PROMPT_FLAVORS) {
      // Predefined Style Logic
      const flavor = PROMPT_FLAVORS[style as keyof typeof PROMPT_FLAVORS];
      prompt += `\n\nAPPLY STYLE: ${style}\nFocus on: ${flavor.focus}\nKey Elements: ${flavor.keywords.join(', ')}`;
    }
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

const STYLE_OPTIMIZER_INSTRUCTION = `
You are an expert visual style consultant for AI video generation.
Your goal is to take a user's brief style name and rough description and expand it into a rich, evocative, and technically precise visual style definition.

Input:
- Style Name: [e.g. "Cyberpunk"]
- Description: [e.g. "Neon lights, dark, rain"]

Output:
- A single, comprehensive paragraph describing the visual style.
- Include details on: Lighting, Color Palette, Atmosphere, Camera/Lens characteristics, and Textures.
- Do NOT include "Scene" or "Subject" details, only the *aesthetic* style.
- Keep it under 100 words.
`;

export const optimizeStyleDescription = async (
  styleName: string,
  rawDescription: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is required");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: STYLE_OPTIMIZER_INSTRUCTION
  });

  const prompt = `Style Name: ${styleName}\nDescription: ${rawDescription}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
