// Tuning parameters for the typing animation (ported from the original config.js).

export interface TypingConfig {
  baseSpeed: number;
  speedVariation: number;
  autoCompleteChance: number;
  autoCompleteDelay: number;
  mistakeChance: number;
  backspaceDelay: number;
  punctuationDelay: number;
  commonMistakes: Record<string, string[]>;
}

export const TYPING_CONFIG: TypingConfig = {
  baseSpeed: 45,
  speedVariation: 0.7,
  autoCompleteChance: 0.08,
  autoCompleteDelay: 150,
  mistakeChance: 0.03,
  backspaceDelay: 200,
  punctuationDelay: 300,
  commonMistakes: {
    a: ["aq", "qa"],
    e: ["ew", "re"],
    i: ["io", "ui"],
    n: ["nm", "bn"],
    s: ["sa", "sd"],
    t: ["ty", "tr"],
    h: ["hj", "gh"],
  },
};
