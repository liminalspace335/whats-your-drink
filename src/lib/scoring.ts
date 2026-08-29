import type { DrinkType, QuizOption } from "../types";

export const TIE_BREAK_ORDER: DrinkType[] = [
  "WINE",
  "FRUIT_PUNCH",
  "RUM",
  "CHAMPAGNE",
  "MOJITO",
  "COGNAC",
];

function tallyScores(selectedOptions: QuizOption[]): Record<DrinkType, number> {
  const scores: Record<DrinkType, number> = {
    WINE: 0,
    FRUIT_PUNCH: 0,
    RUM: 0,
    CHAMPAGNE: 0,
    MOJITO: 0,
    COGNAC: 0,
  };

  for (const option of selectedOptions) {
    scores[option.type] += 1;
  }

  return scores;
}

export function scoreAnswers(selectedOptions: QuizOption[]): DrinkType {
  const scores = tallyScores(selectedOptions);
  const maxScore = Math.max(...Object.values(scores));
  const winners = TIE_BREAK_ORDER.filter((type) => scores[type] === maxScore);
  return winners[0];
}

export function scoreAnswersDetailed(selectedOptions: QuizOption[]) {
  const scores = tallyScores(selectedOptions);
  const maxScore = Math.max(...Object.values(scores));
  const winner = TIE_BREAK_ORDER.filter((type) => scores[type] === maxScore)[0];
  return { scores, winner, maxScore };
}
