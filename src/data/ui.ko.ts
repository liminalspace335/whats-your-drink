import type { AdminBranding } from "../admin/adminTypes";

export const uiKo = {
  brand: "LIMINAL SPACE",
  title: "WHAT'S YOUR DRINK",
  subtitle: ": 술로 알아보는 나의 향 타입",
  languages: [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "vi", label: "Tiếng Việt" },
  ],
  next: "다음",
  personalityTypeLabel: "PERSONALITY TYPE",
  sectionAboutYou: "이런 사람",
  sectionNotes: "향 노트",
  sectionScent: "향",
  sectionWhy: "왜 이 향이 어울릴까요?",
  sectionRecommend: "이런 사람에게 추천",
  shareButton: "친구한테 공유하기",
  scentButton: "나의 향 시향하기",
  shareText: (resultName: string) =>
    `LIMINAL SPACE WHAT'S YOUR DRINK에서 나는 ${resultName} 타입이 나왔어.`,
  shareCopied: "링크를 복사했어요",
  scentCaption: "LIMINAL SPACE에서 당신의 향을 찾아보세요.",
  scentBack: "결과로 돌아가기",
  qrUrl:
    "https://linktr.ee/liminalspace335?utm_source=linktree_profile_share&ltsid=a494376a-1f3e-482a-90f1-48ef88279e9c",
};

export type Ui = typeof uiKo;

export function buildUi(branding: AdminBranding): Ui {
  return {
    ...uiKo,
    brand: branding.coverBrand,
    title: branding.coverTitle,
    subtitle: branding.coverSubtitle,
    next: branding.nextButton,
    shareButton: branding.shareButton,
    scentButton: branding.scentButton,
    scentCaption: branding.scentCaption,
    qrUrl: branding.qrUrl,
    shareText: (resultName: string) => branding.shareTemplate.replace("{{result}}", resultName),
  };
}
