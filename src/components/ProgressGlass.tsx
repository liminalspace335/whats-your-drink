import styles from "./ProgressGlass.module.css";

interface Props {
  total: number;
  current: number;
}

export function ProgressGlass({ total, current }: Props) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`${styles.tick} ${i < current ? styles.filled : ""}`} />
        ))}
      </div>
      <span className={styles.count}>
        {pad(current)} / {pad(total)}
      </span>
    </div>
  );
}
