import { supabase } from "./supabaseClient";
import type { DrinkType, QuizQuestion, TextAlign } from "../types";
import type { AdminQuestion, AdminResultType, AdminBranding } from "../admin/adminTypes";

export type Locale = "ko" | "en" | "vi";
export type TranslatableLocale = Exclude<Locale, "ko">;

const TRANSLATABLE_BRANDING_FIELDS = [
  "cover_subtitle",
  "next_button",
  "share_button",
  "scent_button",
  "scent_caption",
  "share_template",
] as const;

async function fetchTranslationMap(locale: Locale): Promise<Record<string, string>> {
  if (locale === "ko") return {};
  const { data, error } = await supabase
    .from("translations")
    .select("entity_type, entity_id, field_key, value")
    .eq("locale", locale);
  if (error) throw error;

  const map: Record<string, string> = {};
  for (const t of data ?? []) {
    map[`${t.entity_type}:${t.entity_id}:${t.field_key}`] = t.value;
  }
  return map;
}

export async function upsertTranslation(
  entityType: string,
  entityId: string,
  locale: TranslatableLocale,
  fieldKey: string,
  value: string,
) {
  const { error } = await supabase
    .from("translations")
    .upsert(
      { entity_type: entityType, entity_id: entityId, locale, field_key: fieldKey, value },
      { onConflict: "entity_type,entity_id,locale,field_key" },
    );
  if (error) throw error;
}

export async function fetchQuizQuestions(locale: Locale = "ko"): Promise<QuizQuestion[]> {
  const [{ data, error }, tmap] = await Promise.all([
    supabase
      .from("questions")
      .select(
        "id, text, text_align, display_order, question_options(id, label, result_type, display_order)",
      )
      .order("display_order", { ascending: true }),
    fetchTranslationMap(locale),
  ]);
  if (error) throw error;

  return (data ?? []).map((q) => ({
    id: q.id,
    text: tmap[`question:${q.id}:text`] ?? q.text,
    textAlign: q.text_align as TextAlign,
    options: [...q.question_options]
      .sort((a, b) => a.display_order - b.display_order)
      .map((o) => ({
        id: o.id,
        label: tmap[`option:${o.id}:label`] ?? o.label,
        type: o.result_type as DrinkType,
      })),
  }));
}

export async function fetchAdminQuestions(locale: Locale = "ko"): Promise<AdminQuestion[]> {
  const [{ data, error }, tmap] = await Promise.all([
    supabase
      .from("questions")
      .select(
        "id, code, text, text_align, display_order, question_options(id, code, label, result_type, weight, display_order)",
      )
      .order("display_order", { ascending: true }),
    fetchTranslationMap(locale),
  ]);
  if (error) throw error;

  return (data ?? []).map((q) => ({
    id: q.id,
    code: q.code,
    text: tmap[`question:${q.id}:text`] ?? q.text,
    textAlign: q.text_align as TextAlign,
    options: [...q.question_options]
      .sort((a, b) => a.display_order - b.display_order)
      .map((o) => ({
        id: o.id,
        code: o.code,
        label: tmap[`option:${o.id}:label`] ?? o.label,
        resultType: o.result_type as DrinkType,
        weight: o.weight,
      })),
  }));
}

export async function fetchResultTypes(locale: Locale = "ko"): Promise<AdminResultType[]> {
  const [{ data, error }, tmap] = await Promise.all([
    supabase.from("result_types").select("*").order("tie_break_priority", { ascending: true }),
    fetchTranslationMap(locale),
  ]);
  if (error) throw error;

  const field = (type: string, key: string, fallback: string) =>
    tmap[`result_type:${type}:${key}`] ?? fallback;

  return (data ?? []).map((r) => ({
    type: r.type as DrinkType,
    code: r.type,
    tieBreakPriority: r.tie_break_priority,
    personalityTitle: field(r.type, "personality_title", r.personality_title),
    aboutYou: field(r.type, "about_you", r.about_you),
    notes: tmap[`result_type:${r.type}:notes`]
      ? tmap[`result_type:${r.type}:notes`].split(",").map((s) => s.trim()).filter(Boolean)
      : r.notes ?? [],
    scentDescription: field(r.type, "scent_description", r.scent_description),
    whyItFits: field(r.type, "why_it_fits", r.why_it_fits),
    recommendedFor: field(r.type, "recommended_for", r.recommended_for),
  }));
}

export async function fetchBranding(locale: Locale = "ko"): Promise<AdminBranding> {
  const [{ data, error }, tmap] = await Promise.all([
    supabase.from("branding").select("*").eq("id", 1).single(),
    fetchTranslationMap(locale),
  ]);
  if (error) throw error;

  const field = (key: (typeof TRANSLATABLE_BRANDING_FIELDS)[number], fallback: string) =>
    tmap[`branding:1:${key}`] ?? fallback;

  return {
    coverBrand: data.cover_brand,
    coverTitle: data.cover_title,
    coverSubtitle: field("cover_subtitle", data.cover_subtitle),
    nextButton: field("next_button", data.next_button),
    shareButton: field("share_button", data.share_button),
    scentButton: field("scent_button", data.scent_button),
    scentCaption: field("scent_caption", data.scent_caption),
    shareTemplate: field("share_template", data.share_template),
    qrUrl: data.qr_url,
  };
}

export async function updateQuestion(
  id: string,
  patch: Partial<{ text: string; text_align: TextAlign }>,
) {
  const { error } = await supabase.from("questions").update(patch).eq("id", id);
  if (error) throw error;
}

export async function updateOption(
  id: string,
  patch: Partial<{ label: string; result_type: DrinkType; weight: number }>,
) {
  const { error } = await supabase.from("question_options").update(patch).eq("id", id);
  if (error) throw error;
}

export async function updateResultType(type: DrinkType, patch: Record<string, unknown>) {
  const { error } = await supabase.from("result_types").update(patch).eq("type", type);
  if (error) throw error;
}

export async function updateBranding(patch: Record<string, unknown>) {
  const { error } = await supabase.from("branding").update(patch).eq("id", 1);
  if (error) throw error;
}

export async function insertSubmission(
  answers: { question_id: string; option_id: string }[],
  resultType: DrinkType,
): Promise<string> {
  const { data, error } = await supabase
    .from("submissions")
    .insert({ answers, result_type: resultType })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function markSubmissionShared(id: string) {
  const { error } = await supabase
    .from("submissions")
    .update({ shared: true, shared_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function insertReferralVisit(submissionId: string) {
  const { error } = await supabase
    .from("referral_visits")
    .insert({ submission_id: submissionId, user_agent: navigator.userAgent });
  if (error) throw error;
}

export interface SubmissionReportRow {
  id: string;
  createdAt: string;
  resultType: DrinkType;
  shared: boolean;
  sharedAt: string | null;
  referralCount: number;
}

export async function fetchSubmissionReport(): Promise<SubmissionReportRow[]> {
  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("id, created_at, result_type, shared, shared_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;

  const { data: referrals, error: refError } = await supabase
    .from("referral_visits")
    .select("submission_id");
  if (refError) throw refError;

  const counts = new Map<string, number>();
  for (const r of referrals ?? []) {
    if (!r.submission_id) continue;
    counts.set(r.submission_id, (counts.get(r.submission_id) ?? 0) + 1);
  }

  return (submissions ?? []).map((s) => ({
    id: s.id,
    createdAt: s.created_at,
    resultType: s.result_type as DrinkType,
    shared: s.shared,
    sharedAt: s.shared_at,
    referralCount: counts.get(s.id) ?? 0,
  }));
}
