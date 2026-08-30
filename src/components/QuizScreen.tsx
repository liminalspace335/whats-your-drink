import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import type { QuizQuestion, QuizOption } from "../types";
import { uiKo } from "../data/ui.ko";
import { ProgressGlass } from "./ProgressGlass";
import { BeakerBadge } from "./BeakerBadge";
import styles from "./QuizScreen.module.css";

interface Props {
  question: QuizQuestion;
  stepIndex: number;
  total: number;
  canGoBack: boolean;
  initialSelectedId?: string;
  onNext: (option: QuizOption) => void;
  onBack: () => void;
  onExit: () => void;
}

export function QuizScreen({
  question,
  stepIndex,
  total,
  canGoBack,
  initialSelectedId,
  onNext,
  onBack,
  onExit,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
  const controls = useAnimation();
  const prevQuestionId = useRef<string | null>(null);

  useEffect(() => {
    setSelectedId(initialSelectedId ?? null);

    // React StrictMode replays this effect once for the same question.id on
    // first mount — guard so that replay doesn't retrigger the slide-in.
    if (prevQuestionId.current === question.id) {
      controls.set({ opacity: 1, x: 0 });
      return;
    }

    const isFirst = prevQuestionId.current === null;
    prevQuestionId.current = question.id;

    if (isFirst) {
      controls.set({ opacity: 1, x: 0 });
    } else {
      controls.set({ opacity: 0, x: 22 });
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  return (
    <div className={styles.screen}>
      <div className={styles.topNav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="이전 질문"
        >
          ←
        </button>
        <ProgressGlass total={total} current={stepIndex + 1} />
        <button type="button" className={styles.navBtn} onClick={onExit} aria-label="테스트 종료">
          ×
        </button>
      </div>

      <div className={styles.body}>
        <BeakerBadge fillLevel={stepIndex} total={total} />

        <motion.div animate={controls} style={{ width: "100%" }}>
          <h2 className={styles.question}>{question.text}</h2>

          <div className={styles.options} role="radiogroup" aria-label={question.text}>
            {question.options.map((option, i) => {
              const selected = option.id === selectedId;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`${styles.option} ${selected ? styles.selected : ""}`}
                  onClick={() => setSelectedId(option.id)}
                >
                  <span className={styles.index}>{i + 1}</span>
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={`btn btn-primary ${styles.nextBtn} ${selectedId ? styles.visible : ""}`}
          disabled={!selectedId}
          onClick={() => {
            const option = question.options.find((o) => o.id === selectedId);
            if (option) {
              onNext(option);
            }
          }}
        >
          {uiKo.next}
        </button>
      </div>
    </div>
  );
}
