import { useState } from "react";
import type { AdminQuestion, AdminResultType } from "../adminTypes";
import { RESULT_TYPE_LABELS, RESULT_TYPE_TINTS } from "../adminTypes";
import type { DrinkType } from "../../types";
import styles from "./ScoringSection.module.css";

interface Props {
  questions: AdminQuestion[];
  resultTypes: AdminResultType[];
  onQuestionsChange: (questions: AdminQuestion[]) => void;
}

const RESULT_TYPE_ORDER: DrinkType[] = [
  "WINE",
  "FRUIT_PUNCH",
  "RUM",
  "CHAMPAGNE",
  "MOJITO",
  "COGNAC",
];

const EMPTY_SCORES: Record<DrinkType, number> = {
  WINE: 0,
  FRUIT_PUNCH: 0,
  RUM: 0,
  CHAMPAGNE: 0,
  MOJITO: 0,
  COGNAC: 0,
};

const PRESET_242252 = ["O2", "O4", "O2", "O2", "O5", "O2"];

function computeResult(
  questions: AdminQuestion[],
  selection: Record<string, string>,
  resultTypes: AdminResultType[],
) {
  const scores = { ...EMPTY_SCORES };
  for (const q of questions) {
    const opt = q.options.find((o) => o.id === selection[q.id]);
    if (opt) scores[opt.resultType] += opt.weight;
  }
  const maxScore = Math.max(...Object.values(scores));
  const order = [...resultTypes].sort((a, b) => a.tieBreakPriority - b.tieBreakPriority);
  const winner = order.find((r) => scores[r.type] === maxScore)?.type ?? order[0].type;
  return { scores, winner, maxScore };
}

export function ScoringSection({ questions, resultTypes, onQuestionsChange }: Props) {
  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.options[0]) init[q.id] = q.options[0].id;
    });
    return init;
  });
  const result = computeResult(questions, selection, resultTypes);

  const applyPreset = () => {
    const next: Record<string, string> = { ...selection };
    questions.forEach((q, i) => {
      const code = PRESET_242252[i];
      const opt = q.options.find((o) => o.code === code);
      if (opt) next[q.id] = opt.id;
    });
    setSelection(next);
  };

  const maxScore = result.maxScore;

  const updateOptionType = (questionId: string, optionId: string, resultType: DrinkType) => {
    onQuestionsChange(
      questions.map((q) =>
        q.id !== questionId
          ? q
          : {
              ...q,
              options: q.options.map((o) => (o.id === optionId ? { ...o, resultType } : o)),
            },
      ),
    );
  };

  return (
    <div>
      <h1 className="admin-section-title">스코어링 매트릭스</h1>
      <p className="admin-section-desc">
        질문×답변이 어떤 결과 타입에 점수를 주는지 한눈에 보고, 실제 답변 조합을 넣어 결과가
        의도대로 나오는지 바로 검증할 수 있습니다. <b>표의 각 칩을 클릭하면 그 답변이 어떤
        결과 타입에 점수를 줄지 바로 바꿀 수 있습니다.</b>
      </p>

      <div className={`admin-card ${styles.matrixWrap}`}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>질문</th>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <th key={n}>답변 {n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>
                  <span className="admin-badge-code">{q.code}</span>
                </td>
                {q.options.map((o) => (
                  <td key={o.id}>
                    <select
                      className={styles.chip}
                      style={{ background: RESULT_TYPE_TINTS[o.resultType] }}
                      value={o.resultType}
                      onChange={(e) =>
                        updateOptionType(q.id, o.id, e.target.value as DrinkType)
                      }
                      aria-label={`${q.code} ${o.code} 결과 타입`}
                    >
                      {RESULT_TYPE_ORDER.map((t) => (
                        <option key={t} value={t}>
                          {RESULT_TYPE_LABELS[t]}
                        </option>
                      ))}
                    </select>
                    {o.weight !== 1 && (
                      <span className={styles.weightNote}>×{o.weight}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`admin-card ${styles.simCard}`}>
        <h2 className="admin-section-title" style={{ fontSize: "1.1rem" }}>
          결과 시뮬레이터
        </h2>
        <p className="admin-section-desc" style={{ marginBottom: "1.1rem" }}>
          질문마다 답변을 골라 어떤 결과가 나오는지 확인하세요.
        </p>

        <div className={styles.simGrid}>
          {questions.map((q) => (
            <div key={q.id} className={styles.simRow}>
              <label className="admin-label">
                {q.code} · {q.text.length > 22 ? q.text.slice(0, 22) + "…" : q.text}
              </label>
              <select
                className="admin-select"
                value={selection[q.id] ?? ""}
                onChange={(e) => setSelection({ ...selection, [q.id]: e.target.value })}
              >
                {q.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.code} · {o.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className={styles.simActions}>
          <button type="button" className="admin-btn" onClick={applyPreset}>
            242252 조합 테스트
          </button>
          <span className={styles.presetNote}>
            → 이 조합은 반드시 RUM이 나와야 하는 회귀 테스트 케이스입니다. 아래 결과는 선택을
            바꿀 때마다 바로 갱신됩니다.
          </span>
        </div>

        <div className={styles.resultBox}>
          <div className={styles.scoreBars}>
            {[...resultTypes]
              .sort((a, b) => b.tieBreakPriority - a.tieBreakPriority)
              .map((r) => (
                <div key={r.type} className={styles.scoreRow}>
                  <span className="admin-badge-code">{RESULT_TYPE_LABELS[r.type]}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: maxScore
                          ? `${(result.scores[r.type] / maxScore) * 100}%`
                          : "0%",
                        background: RESULT_TYPE_TINTS[r.type],
                      }}
                    />
                  </div>
                  <span>{result.scores[r.type]}</span>
                </div>
              ))}
          </div>
          <div className={styles.winnerLine}>
            최종 결과 →
            <span style={{ color: RESULT_TYPE_TINTS[result.winner] }}>
              {RESULT_TYPE_LABELS[result.winner]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
