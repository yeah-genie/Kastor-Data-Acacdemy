import { MindMapNode, MindMapConnection } from "@/components/CaseFileMindMap";

export const case1MindMapNodes: MindMapNode[] = [
  // Main node
  {
    id: "case-file",
    label: "Case File",
    sublabel: "The Glitch",
    type: "main",
    position: { top: "50%", left: "50%" },
    color: "cyan"
  },

  // Category nodes
  {
    id: "evidence-collection",
    label: "Evidence",
    sublabel: "5 items",
    type: "category",
    position: { top: "20%", left: "30%" },
    color: "cyan"
  },
  {
    id: "interviews",
    label: "Interviews",
    sublabel: "3 suspects",
    type: "category",
    position: { top: "80%", left: "35%" },
    color: "orange"
  },
  {
    id: "timeline-analysis",
    label: "Timeline",
    sublabel: "Day 28 Focus",
    type: "category",
    position: { top: "25%", left: "70%" },
    color: "cyan"
  },

  // Evidence detail nodes
  {
    id: "win-rate-graph",
    label: "Win Rate Graph",
    sublabel: "Shadow Anomaly",
    type: "detail",
    category: "evidence",
    icon: "analytics",
    position: { top: "10%", left: "10%" },
    color: "cyan"
  },
  {
    id: "patch-notes",
    label: "Patch Notes",
    sublabel: "Day 28 Update",
    type: "detail",
    category: "evidence",
    icon: "description",
    position: { top: "2%", left: "45%" },
    color: "cyan"
  },
  {
    id: "server-logs",
    label: "Server Logs",
    sublabel: "Admin Activity",
    type: "detail",
    category: "evidence",
    icon: "terminal",
    position: { top: "40%", left: "15%" },
    color: "cyan"
  },
  {
    id: "database-query",
    label: "Player Database",
    sublabel: "IP Trace",
    type: "detail",
    category: "evidence",
    icon: "database",
    position: { top: "30%", left: "5%" },
    color: "cyan"
  },
  {
    id: "code-changes",
    label: "Code Changes",
    sublabel: "Shadow Stats",
    type: "detail",
    category: "evidence",
    icon: "code",
    position: { top: "15%", left: "25%" },
    color: "cyan"
  },

  // Interview detail nodes
  {
    id: "maya-interview",
    label: "Maya Zhang",
    sublabel: "Game Director",
    type: "detail",
    category: "interview",
    icon: "person",
    position: { top: "60%", left: "10%" },
    color: "orange"
  },
  {
    id: "kaito-interview",
    label: "Kaito Nakamura",
    sublabel: "Main Suspect",
    type: "detail",
    category: "interview",
    icon: "gavel",
    position: { top: "90%", left: "15%" },
    color: "orange"
  },
  {
    id: "ryan-interview",
    label: "Ryan Nakamura",
    sublabel: "Data Analyst",
    type: "detail",
    category: "interview",
    icon: "encrypted",
    position: { top: "75%", left: "5%" },
    color: "orange"
  },

  // Timeline detail nodes
  {
    id: "incident-time",
    label: "Incident Time",
    sublabel: "23:47 PM",
    type: "detail",
    category: "timeline",
    icon: "schedule",
    position: { top: "10%", left: "85%" },
    color: "cyan"
  },
  {
    id: "login-pattern",
    label: "Login Pattern",
    sublabel: "Home Access",
    type: "detail",
    category: "timeline",
    icon: "login",
    position: { top: "45%", left: "85%" },
    color: "cyan"
  },
  {
    id: "event-sequence",
    label: "Event Sequence",
    sublabel: "7 Events",
    type: "detail",
    category: "timeline",
    icon: "swap_horiz",
    position: { top: "55%", left: "75%" },
    color: "cyan"
  },

  // Conclusion node
  {
    id: "conclusion",
    label: "Conclusion",
    sublabel: "Final Report",
    type: "category",
    position: { top: "80%", left: "70%" },
    color: "gray",
    locked: true
  }
];

export const case1MindMapConnections: MindMapConnection[] = [
  // Main to categories
  { from: "case-file", to: "evidence-collection", color: "rgba(6, 220, 249, 0.6)" },
  { from: "case-file", to: "interviews", color: "rgba(255, 140, 0, 0.6)" },
  { from: "case-file", to: "timeline-analysis", color: "rgba(6, 220, 249, 0.6)" },

  // Evidence category to details
  { from: "evidence-collection", to: "win-rate-graph", color: "rgba(6, 220, 249, 0.6)" },
  { from: "evidence-collection", to: "patch-notes", color: "rgba(6, 220, 249, 0.6)" },
  { from: "evidence-collection", to: "server-logs", color: "rgba(6, 220, 249, 0.6)" },
  { from: "evidence-collection", to: "database-query", color: "rgba(6, 220, 249, 0.6)" },
  { from: "evidence-collection", to: "code-changes", color: "rgba(6, 220, 249, 0.6)" },

  // Interview category to details
  { from: "interviews", to: "maya-interview", color: "rgba(255, 140, 0, 0.6)" },
  { from: "interviews", to: "kaito-interview", color: "rgba(255, 140, 0, 0.6)" },
  { from: "interviews", to: "ryan-interview", color: "rgba(255, 140, 0, 0.6)" },

  // Timeline category to details
  { from: "timeline-analysis", to: "incident-time", color: "rgba(6, 220, 249, 0.6)" },
  { from: "timeline-analysis", to: "login-pattern", color: "rgba(6, 220, 249, 0.6)" },
  { from: "timeline-analysis", to: "event-sequence", color: "rgba(6, 220, 249, 0.6)" },

  // Cross-category connections
  { from: "win-rate-graph", to: "patch-notes", color: "rgba(255, 255, 255, 0.3)" },
  { from: "server-logs", to: "incident-time", color: "rgba(255, 255, 255, 0.3)" },
  { from: "database-query", to: "kaito-interview", color: "rgba(255, 255, 255, 0.3)" },
  { from: "code-changes", to: "event-sequence", color: "rgba(255, 255, 255, 0.3)" },

  // Paths to conclusion
  { from: "server-logs", to: "conclusion", color: "rgba(90, 93, 106, 0.6)" },
  { from: "kaito-interview", to: "conclusion", color: "rgba(90, 93, 106, 0.6)" },
  { from: "event-sequence", to: "conclusion", color: "rgba(90, 93, 106, 0.6)" },
  { from: "patch-notes", to: "conclusion", color: "rgba(90, 93, 106, 0.6)" }
];
