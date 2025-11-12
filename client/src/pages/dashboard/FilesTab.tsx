import { useMemo, useState } from "react";
import FilesView, { EvidenceFile, EvidenceFolder } from "@/components/files/FilesView";

const folders: EvidenceFolder[] = [
  {
    id: "ep4-root",
    name: "Episode 4 · The Data Breach",
    icon: "📂",
    parentId: null,
  },
  {
    id: "ep4-suspects",
    name: "Suspects",
    parentId: "ep4-root",
  },
  {
    id: "ep4-digital",
    name: "Digital Evidence",
    parentId: "ep4-root",
  },
  {
    id: "ep4-comms",
    name: "Communications",
    parentId: "ep4-root",
  },
  {
    id: "ep4-timeline",
    name: "Timeline",
    parentId: "ep4-root",
  },
];

const evidenceFiles: EvidenceFile[] = [
  {
    id: "evidence-denial-email",
    folderId: "ep4-comms",
    title: "Email · Midnight Vault Alert Override",
    type: "email",
    content: {
      from: "isabella.torres@legendarena.gg",
      to: "security-ops@legendarena.gg",
      subject: "RE: Vault Alert Noise",
      date: "2025-11-12 02:05",
      body: `Camille,

We have another wave of false positives coming from secure-vault-03—likely the same phantom job from last week. I'm overriding the alerts for the next few hours while I recalibrate. Let me handle it—no need to wake the on-call.

- Isabella`,
    },
    importance: "high",
    dateAdded: "2025-11-12T03:35:12.000Z",
    relatedTo: ["isabella-torres"],
    related: ["evidence-server-log"],
    tags: ["email", "override", "vault"],
    description: "Isabella silences vault alerts minutes before the data exfiltration.",
    isNew: true,
    isLocked: false,
  },
  {
    id: "evidence-server-log",
    folderId: "ep4-digital",
    title: "Secure Vault · Access Log Extract",
    type: "log",
    content: `02:08:51 DOWNLOAD user=isabella.torres payload=vault-analytics-2025Q4.enc
02:10:12 DOWNLOAD user=isabella.torres payload=vault-analytics-2025Q3.enc
02:13:27 DELETE   user=isabella.torres target=audit-log entries=441-889
02:18:11 WRITE    user=system-daemon alert=SUPPRESSED token=STAFF-441`,
    importance: "critical",
    dateAdded: "2025-11-12T03:38:32.000Z",
    relatedTo: ["isabella-torres"],
    related: ["evidence-denial-email", "evidence-drive-manifest"],
    tags: ["log", "download", "delete"],
    description: "Night shift download burst followed by log deletion.",
    isNew: false,
    notes: ["Pattern matches late-night attack signature.", "Need to cross-link with badge movement."],
  },
  {
    id: "evidence-drive-manifest",
    folderId: "ep4-digital",
    title: "Encrypted Drive Manifest",
    type: "document",
    content: `Device ID: LA-VALKYRIE-07
Encryption: AES-512 custom variant
Checksum: 77b1e4b5a2d9
Notes: Drive removed from server room at 03:22.
Responsible custodian: isabella.torres`,
    importance: "high",
    dateAdded: "2025-11-12T04:02:20.000Z",
    relatedTo: ["isabella-torres", "alex-reeves"],
    related: ["evidence-server-log"],
    tags: ["hardware", "manifest"],
    description: "Physical drive manifest corresponding to remote download.",
    isNew: false,
  },
  {
    id: "evidence-schedule",
    folderId: "ep4-timeline",
    title: "Night Shift Timeline Snapshot",
    type: "data",
    content: [
      { time: "01:58", event: "Camille left war room", actor: "camille-beaumont" },
      { time: "02:05", event: "Alert override email sent", actor: "isabella-torres" },
      { time: "02:08", event: "Vault download spike begins", actor: "isabella-torres" },
      { time: "02:13", event: "Audit logs purged", actor: "isabella-torres" },
      { time: "02:22", event: "Badge access server room", actor: "unknown" },
    ],
    importance: "medium",
    dateAdded: "2025-11-12T04:10:41.000Z",
    relatedTo: ["isabella-torres", "camille-beaumont"],
    tags: ["timeline"],
    description: "Key events between 02:00 and 02:30.",
  },
  {
    id: "evidence-interview-notes",
    folderId: "ep4-suspects",
    title: "Interview Notes · Isabella Torres",
    type: "document",
    content: `Summary: Isabella insists the download spike was a maintenance test. Unable to explain drive removal.

Key points:
- Claims to have acted alone to avoid waking staff.
- Confirms badge was with her entire night.
- Hesitates when asked about STAFF-441 override token.`,
    importance: "medium",
    dateAdded: "2025-11-12T05:25:02.000Z",
    relatedTo: ["isabella-torres"],
    tags: ["interview", "suspect"],
    description: "Interview summary capturing contradictions.",
    notes: ["Cross-reference override token with SR security policies."],
  },
  {
    id: "evidence-camera-still",
    folderId: "ep4-digital",
    title: "Camera Still · Server Corridor",
    type: "image",
    content: "/public/office-scene.jpg",
    importance: "low",
    dateAdded: "2025-11-12T03:45:13.000Z",
    relatedTo: ["unknown"],
    tags: ["image", "movement"],
    description: "Blurry image captured 02:24 showing figure with duffel bag.",
    thumbnail: "/public/office-scene.jpg",
  },
];

export const FilesTab = () => {
  const [notesLog, setNotesLog] = useState<string | null>(null);
  const files = useMemo(() => evidenceFiles, []);

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
          Evidence Locker · Episode 4
        </h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
          Browse the digital dossier. Sort by folder, search tags, and open files to reveal deeper details.
        </p>
        {notesLog ? (
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
            <strong>Notebook update:</strong> {notesLog}
          </div>
        ) : null}
      </div>

      <FilesView
        folders={folders}
        files={files}
        onMarkImportant={(id, important) => {
          setNotesLog(`Evidence ${id} marked as ${important ? "critical" : "normal"}.`);
          setTimeout(() => setNotesLog(null), 3000);
        }}
        onAddNote={(id) => {
          setNotesLog(`Added a note for evidence ${id}.`);
          setTimeout(() => setNotesLog(null), 3000);
        }}
        onShare={(id) => {
          setNotesLog(`Shared evidence ${id} with Kastor.`);
          setTimeout(() => setNotesLog(null), 3000);
        }}
        onOpenInFiles={(id) => {
          setNotesLog(`Opening evidence ${id} in dedicated viewer...`);
          setTimeout(() => setNotesLog(null), 3000);
        }}
      />
    </div>
  );
};

export default FilesTab;
