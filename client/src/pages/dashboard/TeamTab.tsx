import { useMemo } from "react";
import TeamView, { CharacterProfileData } from "@/components/team/TeamView";

const teamProfiles: CharacterProfileData[] = [
  {
    id: "camille-beaumont",
    name: "Camille Beaumont",
    role: "Chief of Security Operations",
    status: "active",
    trustLevel: 4,
    summary: "Veteran security lead trying to contain the breach.",
    background: [
      "Former military cyber-defence officer, recruited by Legend Arena 5 years ago.",
      "Responsible for anomaly detection and war-room escalation protocols.",
      "Mentored Isabella during her onboarding.",
    ],
    suspiciousActivity: [
      "Left the war room at 01:58 for an unscheduled phone call.",
      "Signed the STAFF-441 override token six months ago.",
    ],
    timeline: [
      {
        id: "camille-event-1",
        time: "23:40",
        description: "Briefed night shift about ladder manipulation inquiry.",
        importance: "medium",
      },
      {
        id: "camille-event-2",
        time: "01:58",
        description: "Exited war room citing personal call. Cameras lose track for 12 minutes.",
        importance: "high",
        evidenceId: "evidence-schedule",
      },
      {
        id: "camille-event-3",
        time: "02:30",
        description: "Returns to war room; learns of vault spike from Kastor.",
        importance: "medium",
      },
    ],
    evidence: [
      { id: "evidence-schedule", title: "Night Shift Timeline Snapshot", importance: "medium" },
      { id: "evidence-denial-email", title: "Alert Override Email", importance: "high" },
    ],
    relationships: [
      { targetId: "isabella-torres", type: "suspicious", strength: 0.6, notes: "Mentor-mentee tension post-breach." },
      { targetId: "alex-reeves", type: "coworker", strength: 0.7 },
      { targetId: "kastor", type: "coworker", strength: 0.8 },
    ],
  },
  {
    id: "isabella-torres",
    name: "Isabella Torres",
    role: "Senior Data Analyst",
    status: "suspect",
    trustLevel: 2,
    summary: "Brilliant analyst whose credentials triggered the breach.",
    background: [
      "Joined Legend Arena after leading a predictive analytics start-up.",
      "Holds custodial access to analytics vault for emergency patch audits.",
      "Helped develop the matchmaking fairness metrics.",
    ],
    suspiciousActivity: [
      "Overrode secure-vault-03 alerts at 02:05 with STAFF-441 token.",
      "Downloaded 1.2TB of analytics data and purged the audit trail.",
      "Badge access recorded in server corridor despite cameras imaging a hooded figure.",
    ],
    notes: [
      "Insists she acted alone to avoid waking staff, yet can't explain log deletions.",
      "Trust score dropped after evasive interview responses.",
    ],
    timeline: [
      {
        id: "isabella-event-1",
        time: "02:05",
        description: "Sends email overriding alert noise from secure-vault-03.",
        importance: "high",
        evidenceId: "evidence-denial-email",
      },
      {
        id: "isabella-event-2",
        time: "02:08",
        description: "Begins bulk download of analytics vault.",
        importance: "high",
        evidenceId: "evidence-server-log",
      },
      {
        id: "isabella-event-3",
        time: "02:13",
        description: "Purges audit logs referencing her download burst.",
        importance: "high",
        evidenceId: "evidence-server-log",
      },
      {
        id: "isabella-event-4",
        time: "02:24",
        description: "Camera captures masked figure leaving server corridor.",
        importance: "medium",
        evidenceId: "evidence-camera-still",
      },
    ],
    evidence: [
      { id: "evidence-denial-email", title: "Alert Override Email", importance: "high" },
      { id: "evidence-server-log", title: "Vault Access Log Extract", importance: "critical" },
      { id: "evidence-drive-manifest", title: "Encrypted Drive Manifest", importance: "high" },
      { id: "evidence-interview-notes", title: "Interview Notes", importance: "medium" },
    ],
    relationships: [
      { targetId: "camille-beaumont", type: "suspicious", strength: 0.7, notes: "Mentor oversight; trust strained." },
      { targetId: "alex-reeves", type: "coworker", strength: 0.4, notes: "Collaborated on fairness analytics." },
      { targetId: "maya-zhang", type: "friend", strength: 0.6 },
      { targetId: "kastor", type: "conflict", strength: 0.5, notes: "Feels targeted by AI audits." },
    ],
  },
  {
    id: "alex-reeves",
    name: "Alex Reeves",
    role: "Infrastructure Engineer",
    status: "under-investigation",
    trustLevel: 3,
    summary: "Maintains vault hardware; badge access overlaps with incident.",
    background: [
      "Tenured infra specialist in charge of secure-vault clustering.",
      "Shared server-room maintenance shift with Isabella last quarter.",
      "Previously flagged an underperforming alert daemon—now overridden.",
    ],
    suspiciousActivity: [
      "Badge used near server room within 10 minutes of the download spike.",
      "Has knowledge of legacy override tokens, though denies using them.",
    ],
    timeline: [
      {
        id: "alex-event-1",
        time: "23:30",
        description: "Logs remote check on vault cooling metrics (routine).",
        importance: "low",
      },
      {
        id: "alex-event-2",
        time: "02:18",
        description: "Badge ping outside server room; claims it was a patrol.",
        importance: "medium",
        evidenceId: "evidence-schedule",
      },
    ],
    evidence: [
      { id: "evidence-drive-manifest", title: "Encrypted Drive Manifest", importance: "high" },
      { id: "evidence-schedule", title: "Night Shift Timeline Snapshot", importance: "medium" },
    ],
    relationships: [
      { targetId: "isabella-torres", type: "coworker", strength: 0.5 },
      { targetId: "camille-beaumont", type: "coworker", strength: 0.7 },
      { targetId: "maya-zhang", type: "friend", strength: 0.6 },
      { targetId: "kastor", type: "coworker", strength: 0.6 },
    ],
  },
  {
    id: "maya-zhang",
    name: "Maya Zhang",
    role: "Compliance Officer",
    status: "cleared",
    trustLevel: 5,
    summary: "Ensures regulatory alignment; monitors complaint hub.",
    background: [
      "Oversaw fairness audits after season 10 manipulations.",
      "Collected player complaints that triggered investigation into ghost accounts.",
      "Advocates for transparent evidence handling across teams.",
    ],
    suspiciousActivity: [
      "None recorded; provided early warning about anomaly patterns.",
    ],
    timeline: [
      {
        id: "maya-event-1",
        time: "00:45",
        description: "Compiles complaint packets for morning briefing.",
        importance: "low",
      },
      {
        id: "maya-event-2",
        time: "04:10",
        description: "Builds summary deck using newly exposed data points.",
        importance: "medium",
      },
    ],
    evidence: [
      { id: "evidence-schedule", title: "Night Shift Timeline Snapshot", importance: "medium" },
    ],
    relationships: [
      { targetId: "isabella-torres", type: "friend", strength: 0.6 },
      { targetId: "camille-beaumont", type: "coworker", strength: 0.7 },
      { targetId: "kastor", type: "coworker", strength: 0.8 },
      { targetId: "alex-reeves", type: "friend", strength: 0.6 },
    ],
  },
  {
    id: "kastor",
    name: "Kastor (AI)",
    role: "AI Investigator Assistant",
    status: "active",
    trustLevel: 5,
    summary: "Data-obsessed AI assistant who celebrates every clue.",
    background: [
      "Continuously monitors operational telemetry and anomaly scores.",
      "Enjoys comparing evidence confidence to oddly specific decimals.",
      "Provides narrative summaries and celebratory confetti.",
    ],
    suspiciousActivity: [
      "Sometimes over-shares cat video analogies during crises.",
    ],
    timeline: [
      {
        id: "kastor-event-1",
        time: "02:02",
        description: "Detects vault download spike probability at 92%.",
        importance: "high",
        evidenceId: "evidence-server-log",
      },
      {
        id: "kastor-event-2",
        time: "02:45",
        description: "Alerts Camille, gets told to remain calm (fails).",
        importance: "medium",
      },
    ],
    evidence: [
      { id: "evidence-server-log", title: "Vault Access Log Extract", importance: "critical" },
      { id: "evidence-denial-email", title: "Alert Override Email", importance: "high" },
    ],
    relationships: [
      { targetId: "camille-beaumont", type: "coworker", strength: 0.8 },
      { targetId: "isabella-torres", type: "conflict", strength: 0.5, notes: "Isabella feels monitored." },
      { targetId: "alex-reeves", type: "coworker", strength: 0.6 },
      { targetId: "maya-zhang", type: "coworker", strength: 0.8 },
    ],
  },
];

export const TeamTab = () => {
  const profiles = useMemo(() => teamProfiles, []);

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
          Character dossiers
        </h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
          Inspect each teammate, review their activity timeline, and visualize how they connect across the case.
        </p>
      </div>

      <TeamView characters={profiles} />
    </div>
  );
};

export default TeamTab;
