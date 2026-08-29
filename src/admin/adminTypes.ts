import type { DrinkType } from "../types";

export interface AdminOption {
  id: string;
  code: string;
  label: string;
  resultType: DrinkType;
  weight: number;
}

export interface AdminQuestion {
  id: string;
  code: string;
  text: string;
  options: AdminOption[];
}

export interface AdminResultType {
  type: DrinkType;
  code: string;
  tieBreakPriority: number;
  personalityTitle: string;
  aboutYou: string;
  notes: string[];
  scentDescription: string;
  whyItFits: string;
  recommendedFor: string;
}

export interface AdminBranding {
  coverBrand: string;
  coverTitle: string;
  coverSubtitle: string;
  nextButton: string;
  shareButton: string;
  scentButton: string;
  scentCaption: string;
  shareTemplate: string;
  qrUrl: string;
}

export const RESULT_TYPE_LABELS: Record<DrinkType, string> = {
  WINE: "WINE",
  FRUIT_PUNCH: "FRUIT PUNCH",
  RUM: "RUM",
  CHAMPAGNE: "CHAMPAGNE",
  MOJITO: "MOJITO",
  COGNAC: "COGNAC",
};

export const RESULT_TYPE_TINTS: Record<DrinkType, string> = {
  WINE: "#8a3b46",
  FRUIT_PUNCH: "#c46a2e",
  RUM: "#8a6a3b",
  CHAMPAGNE: "#a6903f",
  MOJITO: "#3f7a5c",
  COGNAC: "#6b4a30",
};
