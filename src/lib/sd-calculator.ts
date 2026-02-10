/**
 * SD-Index™ Calculator - Automated Silence Index Calculation
 * Milestone 2: Auto-calculate when Notion formula is empty
 * 
 * SD-Index = Symbiotic Depth Index (0-10)
 * Measures: Silence depth, contemplative quality, environmental factors
 */

interface SDIndexInput {
  lux: number | null;
  texture: string | null;
  noise: string[];
}

/**
 * Calculate SD-Index from environmental sensor data
 * Based on Sabrina's specification in M2
 */
export function calculateSDIndex(input: SDIndexInput): number {
  let score = 5.0; // Base Score (Scale 0-10)
  
  // 1. Tanizaki Factor (Light) - Requires 'Lux' (Number)
  const lux = input.lux || 1000;
  if (lux < 100) {
    score *= 1.2;      // Candle light - enhances contemplation
  } else if (lux < 500) {
    score *= 1.1;      // Dim room - good for reflection
  } else if (lux > 2000) {
    score *= 0.9;      // Harsh sunlight - reduces depth
  }
  
  // 2. Kawabata Factor (Texture) - Requires 'Texture' (Select/Multi-select)
  const texture = input.texture || "";
  const textureStr = Array.isArray(texture) 
    ? texture.join(" ") 
    : texture;
  
  if (textureStr.toLowerCase().includes("snow")) {
    score *= 1.3; // Snow enhances silence
  }
  if (textureStr.toLowerCase().includes("moss")) {
    score *= 1.2; // Moss enhances depth
  }
  if (textureStr.toLowerCase().includes("concrete")) {
    score *= 0.8; // Concrete reduces organic depth
  }
  
  // 3. Noise Factor (Interference)
  const noiseArray = input.noise || [];
  const noiseStr = noiseArray.join(" ").toLowerCase();
  
  if (noiseStr.includes("construction") || noiseStr.includes("traffic")) {
    score *= 0.6; // Heavy Penalty - destroys contemplative space
  }
  
  // Cap result between 0 and 10, return with 1 decimal
  return parseFloat(Math.min(Math.max(score, 0), 10).toFixed(1));
}

/**
 * Check if SD-Index needs auto-calculation
 * Use calculated value if Notion formula is empty/0
 */
export function getSDIndex(notionValue: number | null, input: SDIndexInput): number {
  // If Notion has a value (formula result), use it
  if (notionValue !== null && notionValue > 0) {
    return notionValue;
  }
  
  // Otherwise, auto-calculate
  return calculateSDIndex(input);
}
