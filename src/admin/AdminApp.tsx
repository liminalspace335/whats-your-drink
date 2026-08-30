import { useEffect, useState } from "react";
import "./admin.css";
import styles from "./AdminApp.module.css";
import {
  fetchAdminQuestions,
  fetchResultTypes,
  fetchBranding,
  updateQuestion,
  updateOption,
  updateResultType,
  updateBranding,
  upsertTranslation,
  type Locale,
} from "../lib/db";
import type { AdminQuestion, AdminResultType, AdminBranding } from "./adminTypes";
import { QuestionsSection } from "./sections/QuestionsSection";
import { ResultsSection } from "./sections/ResultsSection";
import { ScoringSection } from "./sections/ScoringSection";
import { BrandingSection } from "./sections/BrandingSection";
import { ReportSection } from "./sections/ReportSection";

type Section = "questions" | "results" | "scoring" | "branding" | "report";

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: "questions", label: "질문 관리", icon: "Q" },
  { id: "results", label: "결과 타입", icon: "R" },
  { id: "scoring", label: "스코어링", icon: "S" },
  { id: "branding", label: "브랜딩·CTA", icon: "B" },
  { id: "report", label: "보고서", icon: "D" },
];

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

const SECTION_LABEL: Record<Section, string> = {
  questions: "QUESTIONS",
  results: "RESULT TYPES",
  scoring: "SCORING",
  branding: "BRANDING",
  report: "REPORT",
};

function BrandBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="9" stroke="#8a8c90" strokeWidth="1.3" />
      <circle cx="13" cy="13" r="2.4" fill="#8a8c90" />
    </svg>
  );
}

export default function AdminApp() {
  const [section, setSection] = useState<Section>("questions");
  const [locale, setLocale] = useState<Locale>("ko");
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [resultTypes, setResultTypes] = useState<AdminResultType[]>([]);
  const [branding, setBranding] = useState<AdminBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAdminQuestions(locale), fetchResultTypes(locale), fetchBranding(locale)])
      .then(([qs, rts, b]) => {
        setQuestions(qs);
        setResultTypes(rts);
        setBranding(b);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        showToast("데이터를 불러오지 못했습니다");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleSave = async () => {
    if (!branding) return;
    setSaving(true);
    try {
      const jobs: Promise<unknown>[] = [];

      if (locale === "ko") {
        for (const q of questions) {
          jobs.push(updateQuestion(q.id, { text: q.text, text_align: q.textAlign }));
          for (const o of q.options) {
            jobs.push(
              updateOption(o.id, { label: o.label, result_type: o.resultType, weight: o.weight }),
            );
          }
        }

        for (const r of resultTypes) {
          jobs.push(
            updateResultType(r.type, {
              tie_break_priority: r.tieBreakPriority,
              personality_title: r.personalityTitle,
              about_you: r.aboutYou,
              notes: r.notes,
              scent_description: r.scentDescription,
              why_it_fits: r.whyItFits,
              recommended_for: r.recommendedFor,
            }),
          );
        }

        jobs.push(
          updateBranding({
            cover_brand: branding.coverBrand,
            cover_title: branding.coverTitle,
            cover_subtitle: branding.coverSubtitle,
            next_button: branding.nextButton,
            share_button: branding.shareButton,
            scent_button: branding.scentButton,
            scent_caption: branding.scentCaption,
            share_template: branding.shareTemplate,
            qr_url: branding.qrUrl,
          }),
        );
      } else {
        for (const q of questions) {
          jobs.push(upsertTranslation("question", q.id, locale, "text", q.text));
          for (const o of q.options) {
            jobs.push(upsertTranslation("option", o.id, locale, "label", o.label));
          }
        }

        for (const r of resultTypes) {
          jobs.push(
            upsertTranslation("result_type", r.type, locale, "personality_title", r.personalityTitle),
            upsertTranslation("result_type", r.type, locale, "about_you", r.aboutYou),
            upsertTranslation("result_type", r.type, locale, "notes", r.notes.join(", ")),
            upsertTranslation("result_type", r.type, locale, "scent_description", r.scentDescription),
            upsertTranslation("result_type", r.type, locale, "why_it_fits", r.whyItFits),
            upsertTranslation("result_type", r.type, locale, "recommended_for", r.recommendedFor),
          );
        }

        jobs.push(
          upsertTranslation("branding", "1", locale, "cover_subtitle", branding.coverSubtitle),
          upsertTranslation("branding", "1", locale, "next_button", branding.nextButton),
          upsertTranslation("branding", "1", locale, "share_button", branding.shareButton),
          upsertTranslation("branding", "1", locale, "scent_button", branding.scentButton),
          upsertTranslation("branding", "1", locale, "scent_caption", branding.scentCaption),
          upsertTranslation("branding", "1", locale, "share_template", branding.shareTemplate),
        );
      }

      await Promise.all(jobs);
      showToast("Supabase에 저장되었습니다");
    } catch (err) {
      console.error(err);
      showToast("저장 중 오류가 발생했습니다");
    } finally {
      setSaving(false);
    }
  };

  const testInfo = (
    <>
      <div className={styles.brandRow}>
        <div className={styles.brandMark}>
          <BrandBadge />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>LIMINAL SPACE ADMIN</span>
          <span className={styles.testName}>WHAT'S YOUR DRINK</span>
        </div>
      </div>
      <div className={styles.testMeta}>
        <span className={`${styles.statusPill} ${styles.published}`}>PUBLISHED</span>
      </div>
    </>
  );

  const localeSwitcher = (
    <div className={styles.localeRow}>
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`${styles.localeBtn} ${locale === l.code ? styles.localeBtnActive : ""}`}
          onClick={() => setLocale(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  if (loading || !branding) {
    return (
      <div className="admin-root">
        <main className={styles.main} style={{ padding: "2rem" }}>
          불러오는 중...
        </main>
      </div>
    );
  }

  return (
    <div className="admin-root">
      {/* Mobile: sticky top identity bar */}
      <div className={styles.mobileHeader}>
        <div className={styles.brandRow}>
          <div className={styles.brandMark}>
            <BrandBadge />
          </div>
          <div className={styles.brandText}>
            <span className={styles.testName}>WHAT'S YOUR DRINK</span>
          </div>
        </div>
        <div className={styles.testMeta}>
          <span className={`${styles.statusPill} ${styles.published}`}>PUBLISHED</span>
        </div>
        {localeSwitcher}
      </div>

      {/* Mobile: horizontal scroll section tabs */}
      <nav className={styles.mobileNav}>
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${section === item.id ? styles.active : ""}`}
            onClick={() => setSection(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Desktop: sidebar */}
      <aside className={styles.sidebar}>
        <div>{testInfo}</div>
        {localeSwitcher}

        <nav className={styles.nav}>
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${section === item.id ? styles.active : ""}`}
              onClick={() => setSection(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <p className={styles.footerNote}>
          이 화면은 실제 Supabase 데이터베이스와 연동되어 있습니다. 저장을 누르면 실 데이터가
          바뀝니다.
        </p>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <span className={styles.crumbs}>{SECTION_LABEL[section]}</span>
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <a href={import.meta.env.BASE_URL} className={styles.previewLink}>
              사용자 화면 →
            </a>
            <button
              type="button"
              className={`admin-btn admin-btn-primary ${styles.desktopSaveBtn}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>

        {section === "questions" && (
          <QuestionsSection questions={questions} onChange={setQuestions} locale={locale} />
        )}
        {section === "results" && (
          <ResultsSection resultTypes={resultTypes} onChange={setResultTypes} locale={locale} />
        )}
        {section === "scoring" && locale === "ko" && (
          <ScoringSection
            questions={questions}
            resultTypes={resultTypes}
            onQuestionsChange={setQuestions}
          />
        )}
        {section === "scoring" && locale !== "ko" && (
          <p className="admin-section-desc">
            스코어링은 한국어(원본) 구조를 기준으로만 관리합니다. 상단에서 한국어를 선택해주세요.
          </p>
        )}
        {section === "branding" && (
          <BrandingSection branding={branding} onChange={setBranding} locale={locale} />
        )}
        {section === "report" && <ReportSection />}
      </main>

      {/* Mobile: sticky bottom save bar */}
      <div className={styles.mobileSaveBar}>
        <button type="button" className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
