import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Ui } from "../data/ui.ko";
import styles from "./ScentScreen.module.css";

interface Props {
  ui: Ui;
  onBack: () => void;
}

export function ScentScreen({ ui, onBack }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(ui.qrUrl, {
      width: 480,
      margin: 1,
      color: { dark: "#0b0b0c", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [ui.qrUrl]);

  return (
    <div className={styles.screen}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← {ui.scentBack}
      </button>

      <div className={styles.center}>
        <span className={styles.hint}>SCAN TO EXPLORE</span>

        <a
          href={ui.qrUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.qrLink}
          aria-label="LIMINAL SPACE Linktree로 이동"
        >
          <div className={styles.qrCard}>
            <div className={styles.qrInner}>
              {qrDataUrl && <img src={qrDataUrl} alt="LIMINAL SPACE Linktree QR 코드" />}
            </div>
          </div>
        </a>

        <p className={styles.caption}>{ui.scentCaption}</p>
      </div>
    </div>
  );
}
