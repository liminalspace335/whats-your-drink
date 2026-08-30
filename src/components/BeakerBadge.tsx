import { useEffect, useRef, useState } from "react";
import styles from "./BeakerBadge.module.css";

interface Props {
  /** number of questions already completed (0..total) */
  fillLevel: number;
  total: number;
}

const BEAKER_PATH = "M16,12 L16,62 Q16,70 24,70 L40,70 Q48,70 48,62 L48,12";
const BEAKER_CLIP_PATH = "M16,12 L16,62 Q16,70 24,70 L40,70 Q48,70 48,62 L48,12 Z";
const INNER_TOP = 14;
const INNER_BOTTOM = 68;
const INNER_HEIGHT = INNER_BOTTOM - INNER_TOP;
const MAX_FILL_FRACTION = 0.8;

export function BeakerBadge({ fillLevel, total }: Props) {
  const [isDropping, setIsDropping] = useState(false);
  const prevLevel = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (prevLevel.current === fillLevel) return;
    const isFirst = prevLevel.current === null;
    prevLevel.current = fillLevel;

    if (!isFirst) {
      setIsDropping(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsDropping(false), 700);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [fillLevel]);

  const fraction = Math.min(fillLevel / total, 1) * MAX_FILL_FRACTION;
  const liquidHeight = INNER_HEIGHT * fraction;
  const liquidY = INNER_BOTTOM - liquidHeight;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={`${styles.badge} ${isDropping ? styles.dropping : ""}`}>
        <svg width="54" height="54" viewBox="0 0 64 80" className={styles.svg}>
          <defs>
            <clipPath id="beakerClip">
              <path d={BEAKER_CLIP_PATH} />
            </clipPath>
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9cbcf" />
              <stop offset="100%" stopColor="#84868a" />
            </linearGradient>
          </defs>

          <g clipPath="url(#beakerClip)">
            <rect
              className={styles.liquid}
              x="10"
              width="44"
              style={{ y: liquidY, height: 80 - liquidY }}
              fill="url(#liquidGrad)"
            />
            <g className={styles.surfaceGroup} style={{ transform: `translateY(${liquidY}px)` }}>
              <ellipse
                className={styles.surfaceHighlight}
                cx="32"
                cy="0"
                rx="15"
                ry="2.4"
                fill="rgba(255,255,255,0.45)"
              />
            </g>
          </g>

          {/* beaker outline */}
          <path d={BEAKER_PATH} fill="none" stroke="#8a8c90" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="15" y1="12" x2="49" y2="12" stroke="#8a8c90" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="47" y1="12" x2="52" y2="6" stroke="#8a8c90" strokeWidth="1.6" strokeLinecap="round" />

          {/* graduation ticks */}
          <line x1="40" y1="30" x2="45" y2="30" stroke="#8a8c90" strokeWidth="1" opacity="0.55" />
          <line x1="40" y1="44" x2="45" y2="44" stroke="#8a8c90" strokeWidth="1" opacity="0.55" />
          <line x1="40" y1="58" x2="45" y2="58" stroke="#8a8c90" strokeWidth="1" opacity="0.55" />

          {/* dropper / pipette — enlarged and drawn outside the beaker's own bounds so it reads clearly */}
          <g className={styles.dropper}>
            <line x1="54" y1="-14" x2="46" y2="10" stroke="#7c7e82" strokeWidth="2.4" strokeLinecap="round" />
            <g className={styles.dropperBulb}>
              <ellipse cx="55" cy="-16" rx="7" ry="8.5" fill="#eef0f1" stroke="#7c7e82" strokeWidth="2" />
            </g>
          </g>

          {/* falling drops */}
          <circle className={`${styles.drop} ${styles.drop1}`} cx="45" cy="12" r="2.4" fill="#8a8c90" />
          <circle className={`${styles.drop} ${styles.drop2}`} cx="47" cy="12" r="1.9" fill="#9a9ca0" />

          {/* ripple on impact */}
          <ellipse
            className={styles.ripple}
            cx="32"
            cy={liquidY}
            rx="10"
            ry="2.6"
            fill="none"
            stroke="rgba(138,140,144,0.6)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
