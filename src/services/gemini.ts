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
export const generateVideoPrompt = async (userIdea: string, apiKey: string, style: keyof typeof PROMPT_FLAVORS | null = null) => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  let finalInstruction = SYSTEM_INSTRUCTION;

  // If a specific style is selected, we override the "Analyze" step to force that style
  if (style) {
    finalInstruction += `\n\nIMPORTANT: The user has explicitly selected the "${style}" style. Skip the analysis step and strictly apply the ${style} flavor defined above.`;
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: finalInstruction
  });

  const result = await model.generateContent(userIdea);
  const response = await result.response;
  return response.text();
};
