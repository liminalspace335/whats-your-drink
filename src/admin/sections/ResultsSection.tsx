import { useState } from "react";
import type { AdminResultType } from "../adminTypes";
import { RESULT_TYPE_LABELS, RESULT_TYPE_TINTS } from "../adminTypes";
import { DrinkIcon } from "../../components/DrinkIcon";
import type { Locale } from "../../lib/db";
import styles from "./ResultsSection.module.css";

interface Props {
  resultTypes: AdminResultType[];
  onChange: (resultTypes: AdminResultType[]) => void;
  locale: Locale;
}

const LOCALE_NOTE_LABEL: Record<Locale, string> = {
  ko: "향 노트 (쉼표로 구분)",
  en: "향 노트 (English, 쉼표로 구분)",
  vi: "향 노트 (Tiếng Việt, 쉼표로 구분)",
};

export function ResultsSection({ resultTypes, onChange, locale }: Props) {
  const isKo = locale === "ko";
  const [openType, setOpenType] = useState<string | null>(resultTypes[0]?.type ?? null);

  const update = (type: string, patch: Partial<AdminResultType>) => {
    onChange(resultTypes.map((r) => (r.type === type ? { ...r, ...patch } : r)));
  };

  const sorted = [...resultTypes].sort((a, b) => a.tieBreakPriority - b.tieBreakPriority);

  return (
    <div>
      <h1 className="admin-section-title">결과 타입 관리</h1>
      <p className="admin-section-desc">
        결과 타입 콘텐츠와 이미지, 동점 시 우선순위를 관리합니다. 우선순위 숫자가 낮을수록 동점일
        때 먼저 선택됩니다 (1 = 최우선).
      </p>

      <div className={styles.list}>
        {sorted.map((r) => {
          const isOpen = openType === r.type;
          return (
            <div key={r.type} className={`admin-card ${styles.rCard}`}>
              <div className={styles.rHead} onClick={() => setOpenType(isOpen ? null : r.type)}>
                <div className={styles.rHeadLeft}>
                  <span
                    className={styles.dot}
                    style={{ background: RESULT_TYPE_TINTS[r.type] }}
                  />
                  <DrinkIcon type={r.type} size={24} />
                  <div className={styles.rTextCol}>
                    <div className={styles.rName}>{RESULT_TYPE_LABELS[r.type]}</div>
                    <div className={styles.rSub}>{r.personalityTitle}</div>
                  </div>
                </div>
                <span className="admin-badge-code" style={{ flexShrink: 0 }}>
                  우선순위 {r.tieBreakPriority}
                </span>
              </div>

              {isOpen && (
                <div className={styles.rBody}>
                  <div className="admin-field">
                    <label className="admin-label">Personality Title</label>
                    <input
                      className="admin-input"
                      value={r.personalityTitle}
                      onChange={(e) => update(r.type, { personalityTitle: e.target.value })}
                    />
                  </div>

                  <div className="admin-field">
                    <label className="admin-label">{LOCALE_NOTE_LABEL[locale]}</label>
                    <input
                      className={`admin-input ${styles.notesInput}`}
                      value={r.notes.join(", ")}
                      onChange={(e) =>
                        update(r.type, {
                          notes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>

                  <div className={`admin-field ${styles.fullSpan}`}>
                    <label className="admin-label">이런 사람</label>
                    <textarea
                      className="admin-textarea"
                      value={r.aboutYou}
                      onChange={(e) => update(r.type, { aboutYou: e.target.value })}
                    />
                  </div>

                  <div className={`admin-field ${styles.fullSpan}`}>
                    <label className="admin-label">향</label>
                    <textarea
                      className="admin-textarea"
                      value={r.scentDescription}
                      onChange={(e) => update(r.type, { scentDescription: e.target.value })}
                    />
                  </div>

                  <div className={`admin-field ${styles.fullSpan}`}>
                    <label className="admin-label">왜 이 향이 어울릴까요?</label>
                    <textarea
                      className="admin-textarea"
                      value={r.whyItFits}
                      onChange={(e) => update(r.type, { whyItFits: e.target.value })}
                    />
                  </div>

                  <div className={`admin-field ${styles.fullSpan}`}>
                    <label className="admin-label">이런 사람에게 추천</label>
                    <textarea
                      className="admin-textarea"
                      value={r.recommendedFor}
                      onChange={(e) => update(r.type, { recommendedFor: e.target.value })}
                    />
                  </div>

                  {isKo && (
                    <div className="admin-field">
                      <label className="admin-label">동점 우선순위</label>
                      <div className={styles.priorityRow}>
                        <input
                          className="admin-input"
                          type="number"
                          min={1}
                          max={resultTypes.length}
                          value={r.tieBreakPriority}
                          onChange={(e) =>
                            update(r.type, { tieBreakPriority: Number(e.target.value) })
                          }
                          style={{ maxWidth: "5rem" }}
                        />
                        <span className={styles.priorityNote}>1이 가장 먼저 선택됨</span>
                      </div>
                    </div>
                  )}

                  {isKo && (
                    <div className="admin-field">
                      <label className="admin-label">이미지 에셋</label>
                      <button type="button" className="admin-btn">
                        이미지 업로드 (준비 중)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
