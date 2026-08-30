import { useState } from "react";
import type { ResultContent } from "../types";
import type { Ui } from "../data/ui.ko";
import { markSubmissionShared } from "../lib/db";
import { DrinkIcon } from "./DrinkIcon";
import styles from "./ResultScreen.module.css";

interface Props {
  ui: Ui;
  result: ResultContent;
  submissionId: string | null;
  onScent: () => void;
}

export function ResultScreen({ ui, result, submissionId, onScent }: Props) {
  const [copied, setCopied] = useState(false);

  const buildShareUrl = () => {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin);
    if (submissionId) url.searchParams.set("ref", submissionId);
    return url.toString();
  };

  const handleShare = async () => {
    const text = ui.shareText(result.displayName);
    const shareUrl = buildShareUrl();
    const shareData = { title: ui.brand, text, url: shareUrl };

    if (submissionId) {
      markSubmissionShared(submissionId).catch(() => {
        // best-effort tracking — sharing itself should not fail on this
      });
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share sheet — no action needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore in this sample
    }
  };

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className="eyebrow">{ui.personalityTypeLabel}</span>
        <h1 className={styles.resultName}>{result.displayName}</h1>
        <div className={styles.iconWrap}>
          <DrinkIcon type={result.type} size={44} className={styles.icon} />
        </div>
        <p className={styles.personalityTitle}>{result.personalityTitle}</p>
      </header>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{ui.sectionAboutYou}</span>
        <p className={styles.sectionBody}>{result.aboutYou}</p>
      </section>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{ui.sectionNotes}</span>
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
        <span className={`eyebrow ${styles.sectionLabel}`}>{ui.sectionScent}</span>
        <p className={styles.sectionBody}>{result.scentDescription}</p>
      </section>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{ui.sectionWhy}</span>
        <p className={styles.sectionBody}>{result.whyItFits}</p>
      </section>

      <section className={styles.section}>
        <span className={`eyebrow ${styles.sectionLabel}`}>{ui.sectionRecommend}</span>
        <p className={styles.sectionBody}>{result.recommendedFor}</p>
      </section>

      <hr className="divider" />

      <div className={styles.ctaBlock}>
        <button type="button" className="btn btn-outline" onClick={handleShare}>
          {copied ? ui.shareCopied : ui.shareButton}
        </button>
        <button type="button" className="btn btn-primary" onClick={onScent}>
          {ui.scentButton}
        </button>
      </div>
    </div>
  );
}
