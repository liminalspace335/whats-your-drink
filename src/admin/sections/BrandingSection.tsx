import type { AdminBranding } from "../adminTypes";
import type { Locale } from "../../lib/db";
import styles from "./BrandingSection.module.css";

interface Props {
  branding: AdminBranding;
  onChange: (branding: AdminBranding) => void;
  locale: Locale;
}

export function BrandingSection({ branding, onChange, locale }: Props) {
  const isKo = locale === "ko";
  const set = (patch: Partial<AdminBranding>) => onChange({ ...branding, ...patch });

  return (
    <div>
      <h1 className="admin-section-title">브랜딩 · CTA 설정</h1>
      <p className="admin-section-desc">
        {isKo
          ? "커버 문구, 버튼 텍스트, 공유 메시지, QR 대상 링크를 관리합니다. 언어별 텍스트는 상단 언어 선택에서 따로 작성할 수 있습니다."
          : "브랜드명, 테스트 타이틀, QR 링크는 언어에 상관없이 공통으로 사용되어 한국어 기준으로만 관리합니다. 여기서는 선택한 언어의 문구만 번역해서 저장합니다."}
      </p>

      <div className={styles.grid}>
        {isKo && (
          <div className={`admin-card ${styles.card}`}>
            <h2 className={styles.cardTitle}>커버 화면</h2>
            <div className="admin-field">
              <label className="admin-label">브랜드명</label>
              <input
                className="admin-input"
                value={branding.coverBrand}
                onChange={(e) => set({ coverBrand: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">테스트 타이틀</label>
              <input
                className="admin-input"
                value={branding.coverTitle}
                onChange={(e) => set({ coverTitle: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">부제</label>
              <input
                className="admin-input"
                value={branding.coverSubtitle}
                onChange={(e) => set({ coverSubtitle: e.target.value })}
              />
            </div>
          </div>
        )}

        {!isKo && (
          <div className={`admin-card ${styles.card}`}>
            <h2 className={styles.cardTitle}>커버 화면</h2>
            <div className="admin-field">
              <label className="admin-label">부제</label>
              <input
                className="admin-input"
                value={branding.coverSubtitle}
                onChange={(e) => set({ coverSubtitle: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className={`admin-card ${styles.card}`}>
          <h2 className={styles.cardTitle}>버튼 · CTA 텍스트</h2>
          <div className="admin-field">
            <label className="admin-label">다음 버튼</label>
            <input
              className="admin-input"
              value={branding.nextButton}
              onChange={(e) => set({ nextButton: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">공유 버튼</label>
            <input
              className="admin-input"
              value={branding.shareButton}
              onChange={(e) => set({ shareButton: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">시향 버튼</label>
            <input
              className="admin-input"
              value={branding.scentButton}
              onChange={(e) => set({ scentButton: e.target.value })}
            />
          </div>
        </div>

        <div className={`admin-card ${styles.card} ${styles.fullWidth}`}>
          <h2 className={styles.cardTitle}>공유 메시지 템플릿</h2>
          <div className="admin-field">
            <label className="admin-label">템플릿 ({"{{result}}"} 은 결과명으로 치환됩니다)</label>
            <textarea
              className="admin-textarea"
              value={branding.shareTemplate}
              onChange={(e) => set({ shareTemplate: e.target.value })}
            />
            <p className={styles.helpText}>
              미리보기: {branding.shareTemplate.replace("{{result}}", "RUM")}
            </p>
          </div>
        </div>

        <div className={`admin-card ${styles.card} ${styles.fullWidth}`}>
          <h2 className={styles.cardTitle}>시향 CTA · QR</h2>
          <div className="admin-field">
            <label className="admin-label">QR 캡션</label>
            <input
              className="admin-input"
              value={branding.scentCaption}
              onChange={(e) => set({ scentCaption: e.target.value })}
            />
          </div>
          {isKo && (
            <div className="admin-field">
              <label className="admin-label">QR 대상 URL (Linktree)</label>
              <div className={styles.qrPreviewRow}>
                <div className={styles.qrThumb}>QR</div>
                <input
                  className="admin-input"
                  value={branding.qrUrl}
                  onChange={(e) => set({ qrUrl: e.target.value })}
                />
              </div>
              <p className={styles.helpText}>
                이 URL을 바꾸면 사용자 사이트의 QR 코드가 자동으로 다시 생성됩니다. QR 링크는
                언어에 상관없이 공통입니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
