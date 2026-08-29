import type { AdminBranding } from "../adminTypes";
import styles from "./BrandingSection.module.css";

interface Props {
  branding: AdminBranding;
  onChange: (branding: AdminBranding) => void;
}

export function BrandingSection({ branding, onChange }: Props) {
  const set = (patch: Partial<AdminBranding>) => onChange({ ...branding, ...patch });

  return (
    <div>
      <h1 className="admin-section-title">브랜딩 · CTA 설정</h1>
      <p className="admin-section-desc">
        커버 문구, 버튼 텍스트, 공유 메시지, QR 대상 링크를 관리합니다. 언어별로 별도 관리되며
        여기서는 한국어 기준으로 보여드립니다.
      </p>

      <div className={styles.grid}>
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
              이 URL을 바꾸면 사용자 사이트의 QR 코드가 자동으로 다시 생성됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
