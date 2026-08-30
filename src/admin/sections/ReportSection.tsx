import { useEffect, useState } from "react";
import { fetchSubmissionReport, type SubmissionReportRow } from "../../lib/db";
import { RESULT_TYPE_LABELS, RESULT_TYPE_TINTS } from "../adminTypes";
import styles from "./ReportSection.module.css";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportSection() {
  const [rows, setRows] = useState<SubmissionReportRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissionReport()
      .then(setRows)
      .catch((err) => {
        console.error(err);
        setError("보고서를 불러오지 못했습니다.");
      });
  }, []);

  const total = rows?.length ?? 0;
  const sharedCount = rows?.filter((r) => r.shared).length ?? 0;
  const totalReferrals = rows?.reduce((sum, r) => sum + r.referralCount, 0) ?? 0;

  return (
    <div>
      <h1 className="admin-section-title">보고서</h1>
      <p className="admin-section-desc">
        사용자가 6개 질문에 모두 답하고 결과를 받을 때마다 여기에 기록됩니다. 결과를 친구에게
        공유했는지, 그 공유 링크를 통해 실제로 사이트에 새로 들어온 방문이 있었는지 확인할 수
        있습니다.
      </p>

      <div className={styles.summaryRow}>
        <div className={`admin-card ${styles.statCard}`}>
          <div className={styles.statLabel}>전체 응답 수</div>
          <div className={styles.statValue}>{total}</div>
        </div>
        <div className={`admin-card ${styles.statCard}`}>
          <div className={styles.statLabel}>공유한 응답</div>
          <div className={styles.statValue}>{sharedCount}</div>
        </div>
        <div className={`admin-card ${styles.statCard}`}>
          <div className={styles.statLabel}>공유로 유입된 방문</div>
          <div className={styles.statValue}>{totalReferrals}</div>
        </div>
      </div>

      <div className={`admin-card ${styles.tableWrap}`}>
        {error && <div className={styles.emptyState}>{error}</div>}
        {!error && rows && rows.length === 0 && (
          <div className={styles.emptyState}>아직 완료된 응답이 없습니다.</div>
        )}
        {!error && rows && rows.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>일시</th>
                <th>결과</th>
                <th>공유 여부</th>
                <th>공유로 유입된 방문</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>
                    <span
                      className={styles.pill}
                      style={{ background: RESULT_TYPE_TINTS[row.resultType], color: "#fff" }}
                    >
                      {RESULT_TYPE_LABELS[row.resultType]}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.pill} ${row.shared ? styles.pillYes : styles.pillNo}`}>
                      {row.shared ? "공유함" : "공유 안 함"}
                    </span>
                  </td>
                  <td>{row.referralCount > 0 ? `${row.referralCount}명 유입` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
