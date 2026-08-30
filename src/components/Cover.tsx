import { uiKo } from "../data/ui.ko";
import styles from "./Cover.module.css";

interface Props {
  onSelectLanguage: (code: string) => void;
}

export function Cover({ onSelectLanguage }: Props) {
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <span className={styles.mark}>PERFUME PERSONALITY TEST</span>
      </div>

      <div className={styles.hero}>
        <p className={styles.brand}>{uiKo.brand}</p>
        <h1 className={styles.title}>{uiKo.title}</h1>
        <p className={styles.subtitle}>{uiKo.subtitle}</p>
      </div>

      <nav className={styles.langs} aria-label="언어 선택">
        {uiKo.languages.map((lang) => (
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
