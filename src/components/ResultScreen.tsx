import { useState } from "react";
import type { ResultContent } from "../types";
import { uiKo } from "../data/ui.ko";
import { DrinkIcon } from "./DrinkIcon";
import styles from "./ResultScreen.module.css";

interface Props {
  result: ResultContent;
  onScent: () => void;
}

export function ResultScreen({ result, onScent }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = uiKo.shareText(result.displayName);
    const shareData = { title: uiKo.brand, text, url: window.location.href };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share sheet — no action needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore in this sample
    }
  };

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className="eyebrow">{uiKo.personalityTypeLabel}</span>
        <h1 className={styles.resultName}>{result.displayName}</h1>
        <div className={styles.iconWrap}>
          <DrinkIcon type={result.type} size={44} className={styles.icon} />
        </div>
        <p className={styles.personalityTitle}>{result.personalityTitle}</p>
      </header>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{uiKo.sectionAboutYou}</span>
        <p className={styles.sectionBody}>{result.aboutYou}</p>
      </section>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{uiKo.sectionNotes}</span>
        <p className={styles.notes}>
          {result.notes.map((note, i) => (
            <span key={note}>
              {i > 0 && <span className={styles.noteSep}>·</span>}
              {note}
            </span>
          ))}
        </p>
      </section>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{uiKo.sectionScent}</span>
        <p className={styles.sectionBody}>{result.scentDescription}</p>
      </section>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{uiKo.sectionWhy}</span>
        <p className={styles.sectionBody}>{result.whyItFits}</p>
      </section>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{uiKo.sectionRecommend}</span>
        <p className={styles.sectionBody}>{result.recommendedFor}</p>
      </section>

      <hr className="divider" />

      <div className={styles.ctaBlock}>
        <button type="button" className="btn btn-outline" onClick={handleShare}>
          {copied ? uiKo.shareCopied : uiKo.shareButton}
        </button>
        <button type="button" className="btn btn-primary" onClick={onScent}>
          {uiKo.scentButton}
        </button>
      </div>
    </div>
  );
}
