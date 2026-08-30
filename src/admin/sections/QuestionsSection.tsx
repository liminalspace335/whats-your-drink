import { useState } from "react";
import type { AdminQuestion } from "../adminTypes";
import { RESULT_TYPE_LABELS } from "../adminTypes";
import type { DrinkType, TextAlign } from "../../types";
import type { Locale } from "../../lib/db";
import styles from "./QuestionsSection.module.css";

interface Props {
  questions: AdminQuestion[];
  onChange: (questions: AdminQuestion[]) => void;
  locale: Locale;
}

const RESULT_TYPES: DrinkType[] = ["WINE", "FRUIT_PUNCH", "RUM", "CHAMPAGNE", "MOJITO", "COGNAC"];

const ALIGN_OPTIONS: { value: TextAlign; label: string }[] = [
  { value: "left", label: "왼쪽" },
  { value: "center", label: "가운데" },
  { value: "right", label: "오른쪽" },
];

const LOCALE_TEXT_LABEL: Record<Locale, string> = {
  ko: "질문 텍스트 (한국어)",
  en: "질문 텍스트 (English)",
  vi: "질문 텍스트 (Tiếng Việt)",
};

const LOCALE_LABEL_LABEL: Record<Locale, string> = {
  ko: "라벨",
  en: "라벨 (English)",
  vi: "라벨 (Tiếng Việt)",
};

export function QuestionsSection({ questions, onChange, locale }: Props) {
  const isKo = locale === "ko";
  const [openId, setOpenId] = useState<string | null>(questions[0]?.id ?? null);

  const updateQuestionField = (id: string, patch: Partial<Pick<AdminQuestion, "text" | "textAlign">>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const updateOption = (
    qId: string,
    oId: string,
    patch: Partial<{ label: string; resultType: DrinkType; weight: number }>,
  ) => {
    onChange(
      questions.map((q) =>
        q.id !== qId
          ? q
          : { ...q, options: q.options.map((o) => (o.id === oId ? { ...o, ...patch } : o)) },
      ),
    );
  };

  const deleteOption = (qId: string, oId: string) => {
    onChange(
      questions.map((q) =>
        q.id !== qId ? q : { ...q, options: q.options.filter((o) => o.id !== oId) },
      ),
    );
  };

  const addOption = (qId: string) => {
    onChange(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const nextIndex = q.options.length + 1;
        return {
          ...q,
          options: [
            ...q.options,
            {
              id: `${qId}-new-${Date.now()}`,
              code: `O${nextIndex}`,
              label: "새 답변",
              resultType: "WINE" as DrinkType,
              weight: 1,
            },
          ],
        };
      }),
    );
  };

  const addQuestion = () => {
    const nextIndex = questions.length + 1;
    const newQ: AdminQuestion = {
      id: `q-new-${Date.now()}`,
      code: `Q${nextIndex}`,
      text: "새 질문을 입력하세요",
      textAlign: "center",
      options: [],
    };
    onChange([...questions, newQ]);
    setOpenId(newQ.id);
  };

  const deleteQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  return (
    <div>
      <h1 className="admin-section-title">질문 관리</h1>
      <p className="admin-section-desc">
        {isKo ? (
          <>
            질문과 답변은 개수 제한 없이 추가·삭제할 수 있습니다. 순서는 드래그 핸들(⠿)로 바꿀 수
            있고, 답변 옆 드롭다운에서 어떤 결과 타입에 점수를 줄지 정합니다. 실제 스코어링 반영은{" "}
            <b>스코어링 매트릭스</b> 탭에서 한 번에 검증하세요.
          </>
        ) : (
          <>
            질문·답변 구조(개수, 순서, 정렬, 결과 타입)는 한국어를 기준으로 관리됩니다. 여기서는
            선택한 언어의 텍스트만 번역해서 저장합니다.
          </>
        )}
      </p>

      <div className={styles.list}>
        {questions.map((q, qi) => {
          const isOpen = openId === q.id;
          return (
            <div key={q.id} className={`admin-card ${styles.qCard}`}>
              <div className={styles.qHead} onClick={() => setOpenId(isOpen ? null : q.id)}>
                <div className={styles.qHeadLeft}>
                  <span className={styles.grip}>⠿</span>
                  <span className="admin-badge-code">{q.code}</span>
                  <span className={styles.qText}>
                    {qi + 1}. {q.text}
                  </span>
                </div>
                <span className={styles.qToggle}>{isOpen ? "접기" : "펼치기"}</span>
              </div>

              {isOpen && (
                <div className={styles.qBody}>
                  <div className="admin-field">
                    <label className="admin-label">{LOCALE_TEXT_LABEL[locale]}</label>
                    <textarea
                      className="admin-textarea"
                      value={q.text}
                      onChange={(e) => updateQuestionField(q.id, { text: e.target.value })}
                    />
                  </div>

                  {isKo && (
                    <div className="admin-field">
                      <label className="admin-label">텍스트 정렬</label>
                      <div className={styles.alignRow}>
                        {ALIGN_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            className={`${styles.alignBtn} ${
                              q.textAlign === opt.value ? styles.alignBtnActive : ""
                            }`}
                            onClick={() => updateQuestionField(q.id, { textAlign: opt.value })}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="admin-field">
                    <label className="admin-label">답변 ({q.options.length}개)</label>
                    {isKo && (
                      <div className={styles.optionRowHead}>
                        <span />
                        <span className="admin-label">{LOCALE_LABEL_LABEL[locale]}</span>
                        <span className="admin-label">결과 타입</span>
                        <span className="admin-label">점수</span>
                        <span />
                      </div>
                    )}
                    {q.options.map((o) => (
                      <div key={o.id} className={styles.optionRow}>
                        <div className={styles.optionTopLine}>
                          <span className="admin-badge-code">{o.code}</span>
                          <input
                            className="admin-input"
                            value={o.label}
                            onChange={(e) =>
                              updateOption(q.id, o.id, { label: e.target.value })
                            }
                          />
                        </div>
                        {isKo && (
                          <div className={styles.optionBottomLine}>
                            <select
                              className="admin-select"
                              value={o.resultType}
                              onChange={(e) =>
                                updateOption(q.id, o.id, {
                                  resultType: e.target.value as DrinkType,
                                })
                              }
                            >
                              {RESULT_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {RESULT_TYPE_LABELS[t]}
                                </option>
                              ))}
                            </select>
                            <input
                              className="admin-input"
                              type="number"
                              min={0}
                              value={o.weight}
                              onChange={(e) =>
                                updateOption(q.id, o.id, { weight: Number(e.target.value) })
                              }
                            />
                            <button
                              type="button"
                              className={styles.deleteBtn}
                              onClick={() => deleteOption(q.id, o.id)}
                              aria-label="답변 삭제"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {isKo && (
                    <div className={styles.footerRow}>
                      <button type="button" className="admin-btn" onClick={() => addOption(q.id)}>
                        + 답변 추가
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => deleteQuestion(q.id)}
                      >
                        질문 삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isKo && (
        <div style={{ marginTop: "1rem" }}>
          <button type="button" className="admin-btn admin-btn-primary" onClick={addQuestion}>
            + 질문 추가
          </button>
        </div>
      )}
    </div>
  );
}
