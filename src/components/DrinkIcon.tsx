import type { DrinkType } from "../types";

interface Props {
  type: DrinkType;
  size?: number;
  className?: string;
}

const shared = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Glyph({ type }: { type: DrinkType }) {
  switch (type) {
    case "WINE":
      return (
        <>
          <path d="M30 14 C30 34 36 46 48 46 C60 46 66 34 66 14" {...shared} />
          <line x1="30" y1="14" x2="66" y2="14" {...shared} />
          <line x1="48" y1="46" x2="48" y2="80" {...shared} />
          <line x1="32" y1="80" x2="64" y2="80" {...shared} />
        </>
      );
    case "FRUIT_PUNCH":
      return (
        <>
          <path d="M30 22 L66 22 L61 76 L35 76 Z" {...shared} />
          <line x1="52" y1="24" x2="68" y2="2" {...shared} />
          <circle cx="72" cy="18" r="7" {...shared} />
          <line x1="72" y1="11" x2="72" y2="25" {...shared} />
          <line x1="65.5" y1="14.5" x2="78.5" y2="21.5" {...shared} />
        </>
      );
    case "RUM":
      return (
        <>
          <path d="M28 30 L68 30 L63 78 L33 78 Z" {...shared} />
          <rect x="40" y="44" width="17" height="17" transform="rotate(8 48.5 52.5)" {...shared} />
        </>
      );
    case "CHAMPAGNE":
      return (
        <>
          <path d="M40 16 C40 30 42 40 48 40 C54 40 56 30 56 16" {...shared} />
          <line x1="40" y1="16" x2="56" y2="16" {...shared} />
          <line x1="48" y1="40" x2="48" y2="80" {...shared} />
          <line x1="37" y1="80" x2="59" y2="80" {...shared} />
          <circle cx="46" cy="32" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="50.5" cy="26" r="1" fill="currentColor" stroke="none" />
          <circle cx="47" cy="20" r="0.9" fill="currentColor" stroke="none" />
        </>
      );
    case "MOJITO":
      return (
        <>
          <path d="M34 18 L62 18 L59 80 L37 80 Z" {...shared} />
          <line x1="50" y1="20" x2="63" y2="0" {...shared} />
          <path d="M38 14 C34 10 36 5 41 6 C42 10 41 13 38 14 Z" {...shared} />
          <path d="M45 10 C42 5 45 1 49 3 C49 7 48 10 45 10 Z" {...shared} />
        </>
      );
    case "COGNAC":
      return (
        <>
          <path d="M28 40 C28 58 36 70 48 70 C60 70 68 58 68 40 C68 31 59 26 48 26 C37 26 28 31 28 40 Z" {...shared} />
          <line x1="48" y1="70" x2="48" y2="80" {...shared} />
          <line x1="36" y1="80" x2="60" y2="80" {...shared} />
        </>
      );
  }
}

export function DrinkIcon({ type, size = 88, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label={type.replace("_", " ")}
    >
      <Glyph type={type} />
    </svg>
  );
}
