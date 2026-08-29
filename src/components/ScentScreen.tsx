import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { uiKo } from "../data/ui.ko";
import styles from "./ScentScreen.module.css";

const LINKTREE_URL =
  "https://linktr.ee/liminalspace335?utm_source=linktree_profile_share&ltsid=a494376a-1f3e-482a-90f1-48ef88279e9c";

interface Props {
  onBack: () => void;
}

export function ScentScreen({ onBack }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(LINKTREE_URL, {
      width: 480,
      margin: 1,
      color: { dark: "#0b0b0c", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, []);

  return (
    <div className={styles.screen}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← {uiKo.scentBack}
      </button>

      <div className={styles.center}>
        <span className={styles.hint}>SCAN TO EXPLORE</span>

        <a
          href={LINKTREE_URL}
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

        <p className={styles.caption}>{uiKo.scentCaption}</p>
      </div>
    </div>
  );
}
