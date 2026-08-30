import { supabase } from "./supabaseClient";
import type { DrinkType, QuizQuestion } from "../types";
import type { AdminQuestion, AdminResultType, AdminBranding } from "../admin/adminTypes";

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("id, text, display_order, question_options(id, label, result_type, display_order)")
    .order("display_order", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((q) => ({
    id: q.id,
    text: q.text,
    options: [...q.question_options]
      .sort((a, b) => a.display_order - b.display_order)
      .map((o) => ({ id: o.id, label: o.label, type: o.result_type as DrinkType })),
  }));
}

export async function fetchAdminQuestions(): Promise<AdminQuestion[]> {
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, code, text, display_order, question_options(id, code, label, result_type, weight, display_order)",
    )
    .order("display_order", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((q) => ({
    id: q.id,
    code: q.code,
    text: q.text,
    options: [...q.question_options]
      .sort((a, b) => a.display_order - b.display_order)
      .map((o) => ({
        id: o.id,
        code: o.code,
        label: o.label,
        resultType: o.result_type as DrinkType,
        weight: o.weight,
      })),
  }));
}

export async function fetchResultTypes(): Promise<AdminResultType[]> {
  const { data, error } = await supabase
    .from("result_types")
    .select("*")
    .order("tie_break_priority", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((r) => ({
    type: r.type as DrinkType,
    code: r.type,
    tieBreakPriority: r.tie_break_priority,
    personalityTitle: r.personality_title,
    aboutYou: r.about_you,
    notes: r.notes ?? [],
    scentDescription: r.scent_description,
    whyItFits: r.why_it_fits,
    recommendedFor: r.recommended_for,
  }));
}

export async function fetchBranding(): Promise<AdminBranding> {
  const { data, error } = await supabase.from("branding").select("*").eq("id", 1).single();
  if (error) throw error;

  return {
    coverBrand: data.cover_brand,
    coverTitle: data.cover_title,
    coverSubtitle: data.cover_subtitle,
    nextButton: data.next_button,
    shareButton: data.share_button,
    scentButton: data.scent_button,
    scentCaption: data.scent_caption,
    shareTemplate: data.share_template,
    qrUrl: data.qr_url,
  };
}

export async function updateQuestionText(id: string, text: string) {
  const { error } = await supabase.from("questions").update({ text }).eq("id", id);
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
