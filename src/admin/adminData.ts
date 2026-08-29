import { quizKo } from "../data/quiz.ko";
import { resultsKo } from "../data/results.ko";
import { TIE_BREAK_ORDER } from "../lib/scoring";
import type { AdminQuestion, AdminResultType, AdminBranding } from "./adminTypes";
import type { DrinkType } from "../types";

export function buildInitialQuestions(): AdminQuestion[] {
  return quizKo.map((q, qi) => ({
    id: q.id,
    code: `Q${qi + 1}`,
    text: q.text,
    options: q.options.map((o, oi) => ({
      id: o.id,
      code: `O${oi + 1}`,
      label: o.label,
      resultType: o.type,
      weight: 1,
    })),
  }));
}

export function buildInitialResultTypes(): AdminResultType[] {
  const order: DrinkType[] = ["WINE", "FRUIT_PUNCH", "RUM", "CHAMPAGNE", "MOJITO", "COGNAC"];
  return order.map((type) => {
    const r = resultsKo[type];
    return {
      type,
      code: type,
      tieBreakPriority: TIE_BREAK_ORDER.indexOf(type) + 1,
      personalityTitle: r.personalityTitle,
      aboutYou: r.aboutYou,
      notes: r.notes,
      scentDescription: r.scentDescription,
      whyItFits: r.whyItFits,
      recommendedFor: r.recommendedFor,
    };
  });
}

export function buildInitialBranding(): AdminBranding {
  return {
    coverBrand: "LIMINAL SPACE",
    coverTitle: "WHAT'S YOUR DRINK",
    coverSubtitle: ": 술로 알아보는 나의 향 타입",
    nextButton: "다음",
    shareButton: "친구한테 공유하기",
    scentButton: "나의 향 시향하기",
    scentCaption: "LIMINAL SPACE에서 당신의 향을 찾아보세요.",
    shareTemplate: "LIMINAL SPACE WHAT'S YOUR DRINK에서 나는 {{result}} 타입이 나왔어.",
    qrUrl:
      "https://linktr.ee/liminalspace335?utm_source=linktree_profile_share&ltsid=a494376a-1f3e-482a-90f1-48ef88279e9c",
  };
}
