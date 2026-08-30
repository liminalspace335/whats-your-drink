import type { AdminBranding } from "../admin/adminTypes";
import type { Locale } from "../lib/db";

export const uiKo = {
  brand: "LIMINAL SPACE",
  title: "WHAT'S YOUR DRINK",
  subtitle: ": 술로 알아보는 나의 향 타입",
  languages: [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "vi", label: "Tiếng Việt" },
  ],
  coverEyebrow: "PERFUME PERSONALITY TEST",
  analyzingTitle: "당신의 향을 찾고 있습니다",
  analyzingSteps: ["답변을 분석하는 중", "성향 타입을 매칭하는 중", "당신의 향을 찾는 중"],
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

// Fixed UI chrome — section headers, labels — that live in code rather than
// the admin (the admin only edits DB-backed content: questions, results,
// branding). Keyed by locale so en/vi visitors see fully localized chrome.
const CHROME_LABELS: Record<Locale, Pick<
  Ui,
  | "coverEyebrow"
  | "analyzingTitle"
  | "analyzingSteps"
  | "personalityTypeLabel"
  | "sectionAboutYou"
  | "sectionNotes"
  | "sectionScent"
  | "sectionWhy"
  | "sectionRecommend"
  | "shareCopied"
  | "scentBack"
>> = {
  ko: {
    coverEyebrow: "PERFUME PERSONALITY TEST",
    analyzingTitle: "당신의 향을 찾고 있습니다",
    analyzingSteps: ["답변을 분석하는 중", "성향 타입을 매칭하는 중", "당신의 향을 찾는 중"],
    personalityTypeLabel: "PERSONALITY TYPE",
    sectionAboutYou: "이런 사람",
    sectionNotes: "향 노트",
    sectionScent: "향",
    sectionWhy: "왜 이 향이 어울릴까요?",
    sectionRecommend: "이런 사람에게 추천",
    shareCopied: "링크를 복사했어요",
    scentBack: "결과로 돌아가기",
  },
  en: {
    coverEyebrow: "PERFUME PERSONALITY TEST",
    analyzingTitle: "Finding your scent",
    analyzingSteps: ["Reading your answers", "Matching your personality type", "Finding your scent"],
    personalityTypeLabel: "PERSONALITY TYPE",
    sectionAboutYou: "You're the type who",
    sectionNotes: "Fragrance notes",
    sectionScent: "The scent",
    sectionWhy: "Why this scent fits you",
    sectionRecommend: "Made for",
    shareCopied: "Link copied",
    scentBack: "Back to result",
  },
  vi: {
    coverEyebrow: "PERFUME PERSONALITY TEST",
    analyzingTitle: "Đang tìm mùi hương của bạn",
    analyzingSteps: ["Đang phân tích câu trả lời", "Đang ghép loại tính cách", "Đang tìm mùi hương của bạn"],
    personalityTypeLabel: "PERSONALITY TYPE",
    sectionAboutYou: "Con người bạn",
    sectionNotes: "Tầng hương",
    sectionScent: "Mùi hương",
    sectionWhy: "Vì sao mùi hương này hợp với bạn",
    sectionRecommend: "Dành cho",
    shareCopied: "Đã sao chép liên kết",
    scentBack: "Quay lại kết quả",
  },
};

export function buildUi(branding: AdminBranding, locale: Locale = "ko"): Ui {
  return {
    ...uiKo,
    ...CHROME_LABELS[locale],
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
