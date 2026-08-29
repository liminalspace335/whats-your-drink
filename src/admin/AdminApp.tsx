import { useState } from "react";
import "./admin.css";
import styles from "./AdminApp.module.css";
import { buildInitialQuestions, buildInitialResultTypes, buildInitialBranding } from "./adminData";
import { QuestionsSection } from "./sections/QuestionsSection";
import { ResultsSection } from "./sections/ResultsSection";
import { ScoringSection } from "./sections/ScoringSection";
import { BrandingSection } from "./sections/BrandingSection";

type Section = "questions" | "results" | "scoring" | "branding";

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: "questions", label: "질문 관리", icon: "Q" },
  { id: "results", label: "결과 타입", icon: "R" },
  { id: "scoring", label: "스코어링", icon: "S" },
  { id: "branding", label: "브랜딩·CTA", icon: "B" },
];

const SECTION_LABEL: Record<Section, string> = {
  questions: "QUESTIONS",
  results: "RESULT TYPES",
  scoring: "SCORING",
  branding: "BRANDING",
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
  const [questions, setQuestions] = useState(buildInitialQuestions);
  const [resultTypes, setResultTypes] = useState(buildInitialResultTypes);
  const [branding, setBranding] = useState(buildInitialBranding);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
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
        <span className={styles.langsRow}>ko · en · vi</span>
      </div>
    </>
  );

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
        <div>
          {testInfo}
        </div>

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
          이 화면은 더미 데이터 기반 샘플입니다. 실제 저장·배포는 백엔드 연동 후 동작합니다.
        </p>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <span className={styles.crumbs}>
            {SECTION_LABEL[section]}
          </span>
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <a href={import.meta.env.BASE_URL} className={styles.previewLink}>
              사용자 화면 →
            </a>
            <button
              type="button"
              className={`admin-btn admin-btn-primary ${styles.desktopSaveBtn}`}
              onClick={() => showToast("변경사항이 임시 저장되었습니다 (샘플 — 실제 저장 아님)")}
            >
              저장
            </button>
          </div>
        </div>

        {section === "questions" && (
          <QuestionsSection questions={questions} onChange={setQuestions} />
        )}
        {section === "results" && (
          <ResultsSection resultTypes={resultTypes} onChange={setResultTypes} />
        )}
        {section === "scoring" && (
          <ScoringSection
            questions={questions}
            resultTypes={resultTypes}
            onQuestionsChange={setQuestions}
          />
        )}
        {section === "branding" && (
          <BrandingSection branding={branding} onChange={setBranding} />
        )}
      </main>

      {/* Mobile: sticky bottom save bar */}
      <div className={styles.mobileSaveBar}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => showToast("변경사항이 임시 저장되었습니다 (샘플 — 실제 저장 아님)")}
        >
          저장
        </button>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
