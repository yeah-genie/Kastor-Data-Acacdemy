import { useMemo, useState } from "react";
import DataView, { LogEntry } from "@/components/data/DataView";

const rawEntries: LogEntry[] = [
  {
    id: "log-01",
    date: "2025-11-12",
    time: "01:42:18",
    user: "marcus.chen",
    action: "Read",
    location: "analytics-dashboard",
    details: "Viewed match performance summary for Team Solstice.",
  },
  {
    id: "log-02",
    date: "2025-11-12",
    time: "02:08:51",
    user: "isabella.torres",
    action: "Download",
    location: "secure-vault-03",
    details: "Downloaded vault payload vault-analytics-2025Q4.enc (1.2 TB).",
    suspicious: true,
  },
  {
    id: "log-03",
    date: "2025-11-12",
    time: "02:10:12",
    user: "isabella.torres",
    action: "Download",
    location: "secure-vault-03",
    details: "Downloaded vault payload vault-analytics-2025Q3.enc (870 GB).",
    suspicious: true,
  },
  {
    id: "log-04",
    date: "2025-11-12",
    time: "02:12:31",
    user: "system-daemon",
    action: "Write",
    location: "system-alert-log",
    details: "Alert suppressed: 'Unusual download spike'. Override token: STAFF-441.",
    suspicious: true,
  },
  {
    id: "log-05",
    date: "2025-11-12",
    time: "02:13:27",
    user: "isabella.torres",
    action: "Delete",
    location: "secure-vault-03",
    details: "Deleted audit trail entries 441-889 from vault access logs.",
    suspicious: true,
  },
  {
    id: "log-06",
    date: "2025-11-12",
    time: "03:02:41",
    user: "alex.reeves",
    action: "Read",
    location: "analytics-dashboard",
    details: "Reviewed league balance metrics.",
  },
  {
    id: "log-07",
    date: "2025-11-12",
    time: "03:19:05",
    user: "isabella.torres",
    action: "Delete",
    location: "forensics-staging",
    details: "Removed temp export: analytics-raw-227.csv",
    suspicious: true,
  },
  {
    id: "log-08",
    date: "2025-11-12",
    time: "04:23:18",
    user: "maya.zhang",
    action: "Read",
    location: "player-feedback-hub",
    details: "Accessed retained complaints for review meeting.",
  },
  {
    id: "log-09",
    date: "2025-11-11",
    time: "23:55:49",
    user: "marcus.chen",
    action: "Write",
    location: "analytics-diff-engine",
    details: "Updated anomaly detection ruleset v5.2",
  },
  {
    id: "log-10",
    date: "2025-11-12",
    time: "02:45:52",
    user: "isabella.torres",
    action: "Download",
    location: "secure-vault-03",
    details: "Mirrored competitive ladder dataset (encrypted).",
    suspicious: true,
  },
  {
    id: "log-11",
    date: "2025-11-11",
    time: "20:17:11",
    user: "camille.beaumont",
    action: "Read",
    location: "security-ops",
    details: "Reviewed escalation report for ladder manipulation claims.",
  },
  {
    id: "log-12",
    date: "2025-11-12",
    time: "02:18:11",
    user: "system-daemon",
    action: "Write",
    location: "system-alert-log",
    details: "Alert suppressed: 'Audit log purge detected'. Override token: STAFF-441.",
    suspicious: true,
  },
];

export const DataTab = () => {
  const [askLog, setAskLog] = useState<string | null>(null);
  const entries = useMemo(() => rawEntries, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          background: "rgba(255,255,255,0.02)",
          padding: "1.25rem 1.5rem",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "rgba(255,255,255,0.92)" }}>
          Log Analysis – Vault Exfiltration Puzzle
        </h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
          Filter forensic logs, isolate suspicious activity, and submit the pattern to continue the investigation.
        </p>
        {askLog ? (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              background: "rgba(33, 150, 243, 0.12)",
              border: "1px solid rgba(33, 150, 243, 0.35)",
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.85rem",
            }}
          >
            <strong>Kastor:</strong> “I’m crunching the numbers for those rows: {askLog}.” <em>“Looks like 7.3 on the suspicious scale!”</em>
          </div>
        ) : null}
      </div>

      <DataView
        entries={entries}
        patternLabel="Isabella's late-night vault extraction"
        onAskKastor={({ selectedRows, filters }) => {
          const summary =
            selectedRows.length === 0
              ? "no specific rows, using current filters"
              : selectedRows.map((row) => row.id).join(", ");
          setAskLog(`IDs: ${summary} · filters: ${JSON.stringify(filters)}`);
          setTimeout(() => setAskLog(null), 4000);
        }}
      />
    </div>
  );
};

export default DataTab;
