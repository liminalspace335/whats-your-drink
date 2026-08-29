export type DrinkType = "WINE" | "FRUIT_PUNCH" | "RUM" | "CHAMPAGNE" | "MOJITO" | "COGNAC";

export interface QuizOption {
  id: string;
  label: string;
  type: DrinkType;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface ResultContent {
  type: DrinkType;
  displayName: string;
  personalityTitle: string;
  aboutYou: string;
  notes: string[];
  scentDescription: string;
  whyItFits: string;
  recommendedFor: string;
}

export type Screen =
  | { name: "cover" }
  | { name: "quiz"; step: number }
  | { name: "result"; type: DrinkType }
  | { name: "scent"; type: DrinkType };
