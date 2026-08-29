import { useEffect, useState } from "react";
import styles from "./AnalyzingScreen.module.css";

const STEPS = ["답변을 분석하는 중", "성향 타입을 매칭하는 중", "당신의 향을 찾는 중"];
const DURATION_MS = 5000;

export function AnalyzingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [fillStarted, setFillStarted] = useState(false);

  useEffect(() => {
    const stepInterval = DURATION_MS / STEPS.length;
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i + 1), stepInterval * (i + 1)),
    );
    const raf = requestAnimationFrame(() => setFillStarted(true));
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.screen}>
      <div className={styles.badgeWrap}>
        <div className={styles.badgeGlow} />
        <div className={styles.badge}>
          <svg width="30" height="30" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="9" stroke="#8a8c90" strokeWidth="1.3" />
            <circle cx="13" cy="13" r="2.4" fill="#8a8c90" />
          </svg>
        </div>
      </div>

      <p className={styles.title}>당신의 향을 찾고 있습니다</p>

      <div className={styles.steps}>
        {STEPS.map((label, i) => {
          const state = i < activeStep ? "done" : i === activeStep ? "active" : "";
          return (
            <div key={label} className={`${styles.step} ${state && styles[state]}`}>
              <span className={styles.stepMark}>{i < activeStep ? "✓" : ""}</span>
              {label}
            </div>
          );
        })}
      </div>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: fillStarted ? "100%" : "0%" }}
        />
      </div>
    </div>
  );
}
