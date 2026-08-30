import type { Ui } from "../data/ui.ko";
import styles from "./Cover.module.css";

interface Props {
  ui: Ui;
  onSelectLanguage: (code: string) => void;
}

export function Cover({ ui, onSelectLanguage }: Props) {
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <span className={styles.mark}>PERFUME PERSONALITY TEST</span>
      </div>

      <div className={styles.hero}>
        <p className={styles.brand}>{ui.brand}</p>
        <h1 className={styles.title}>{ui.title}</h1>
        <p className={styles.subtitle}>{ui.subtitle}</p>
      </div>

      <nav className={styles.langs} aria-label="언어 선택">
        {ui.languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={styles.langBtn}
            onClick={() => onSelectLanguage(lang.code)}
          >
            <span className={styles.langLabel}>{lang.label}</span>
            <span className={styles.arrow}>→</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
