/**
 * Defines the "flavors" or styles that the AI can use to tailor the prompt.
 * Each flavor contains specific instructions for lighting, camera, and mood.
 */
export const PROMPT_FLAVORS = {
  CINEMATIC: `
    Focus on narrative depth, emotional resonance, and high-end film aesthetics.
    - Lighting: Use terms like "chiaroscuro", "rembrandt", "volumetric fog", "practical lights".
    - Camera: "Anamorphic lens", "shallow depth of field", "rack focus", "dolly smooth".
    - Color: "Teal and orange", "muted tones", "film grain", "technicolor".
    - Structure: Setup -> Conflict -> Resolution (micro-story).
  `,
  PRODUCT: `
    Focus on clarity, desirability, and clean visuals.
    - Lighting: "Softbox", "three-point lighting", "studio high-key", "edge lighting".
    - Camera: "Macro lens", "slow pan", "orbit", "sharp focus".
    - Background: "Infinite white", "blurred lifestyle", "clean gradient".
    - Energy: "Premium", "sleek", "modern", "trustworthy".
  `,
  SOCIAL: `
    Focus on engagement, pacing, and immediate impact.
    - Style: "Trending", "vibrant", "high contrast", "immersive".
    - Camera: "POV", "handheld (stabilized)", "drone fpv", "whip pan".
    - Pacing: "Fast cuts", "dynamic transitions", "loopable".
    - Aspect: Often vertical (9:16), but ensure subject is centered.
  `
};

/**
 * A default negative prompt to filter out common low-quality artifacts.
 * This is appended to every generated prompt.
 */
export const NEGATIVE_PROMPT_DEFAULT = "blurry, distorted, low quality, watermark, text, bad anatomy, ugly, pixelated, oversaturated, shaky camera (unless specified)";
