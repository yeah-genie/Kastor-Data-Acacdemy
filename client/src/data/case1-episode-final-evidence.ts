import { Evidence } from "@/lib/stores/useDetectiveGame";

const mayaImage = "/characters/maya.jpg";
const kaitoImage = "/characters/kaito.jpg";
const lukasImage = "/characters/lukas.jpg";
const diegoImage = "/characters/diego.jpg";

export const case1EpisodeFinalEvidence: Record<string, Evidence> = {
  maya_email: {
    id: "maya_email",
    type: "DOCUMENT",
    title: "Maya's Request Email",
    content: "From: Maya Zhang\nSubject: URGENT! Please help!\n\nThe Shadow character's win rate jumped from 50% to 85% overnight! We didn't release any patches... This is a disaster!",
    timestamp: Date.now(),
    unlockedByNode: "email_arrives",
  },

  maya_testimony_no_patch: {
    id: "maya_testimony_no_patch",
    type: "DIALOGUE",
    title: "Maya's Testimony",
    character: "Maya Zhang",
    summary: "Maya confirms no official patches were released for Shadow character.",
    keyPoints: [
      "Shadow win rate jumped from 50% to 85%",
      "No official patches were released",
      "Day 28 was when the change occurred",
      "Player community is in uproar"
    ],
    timestamp: Date.now(),
    unlockedByNode: "call_maya",
  },

  character_performance_data: {
    id: "character_performance_data",
    type: "DATA",
    title: "Character Performance Data",
    dataType: "chart",
    data: {
      series: [
        {
          name: "Shadow",
          data: [
            { day: 24, winRate: 49.5 },
            { day: 25, winRate: 50.1 },
            { day: 26, winRate: 49.8 },
            { day: 27, winRate: 50.2 },
            { day: 28, winRate: 84.7 },
            { day: 29, winRate: 85.1 },
            { day: 30, winRate: 85.3 },
          ],
        },
      ],
    },
    timestamp: Date.now(),
    unlockedByNode: "call_maya",
  },

  shadow_winrate_spike: {
    id: "shadow_winrate_spike",
    type: "DATA",
    title: "Shadow Win Rate Spike Graph",
    dataType: "chart",
    data: {
      day27: 50.2,
      day28: 84.7,
      day29: 85.1,
      spike: true,
    },
    timestamp: Date.now(),
    unlockedByNode: "graph_analysis_result",
  },

  patch_notes_day28: {
    id: "patch_notes_day28",
    type: "DOCUMENT",
    title: "Official Patch Notes - Day 28",
    content: "Day 28 Patch Notes:\n\nPhoenix: Cooldown -2 seconds ✓\nViper: Bug fix (hitbox) ✓\nShadow: No changes listed ⚠️",
    timestamp: Date.now(),
    unlockedByNode: "document_result",
  },

  server_log_modification: {
    id: "server_log_modification",
    type: "DATA",
    title: "Server Log - Unauthorized Modification",
    dataType: "log",
    data: {
      logs: [
        { time: "19:20", event: "admin01 - Shadow data accessed (READ)" },
        { time: "23:47", event: "admin01 - Shadow data modified (WRITE)", suspicious: true },
        { time: "23:52", event: "admin01 - Log deletion attempt (FAILED)", suspicious: true },
      ],
    },
    timestamp: Date.now(),
    unlockedByNode: "found_tampering",
  },

  kaito_profile: {
    id: "kaito_profile",
    type: "CHARACTER",
    title: "Kaito Nakamura",
    name: "Kaito Nakamura",
    role: "Balance Designer",
    photo: kaitoImage,
    description: "Balance designer responsible for character adjustments. Has admin01 account access.",
    personality: "Passionate about game balance. Competitive player who participates in company tournaments.",
    suspicionLevel: 5,
    timestamp: Date.now(),
    unlockedByNode: "call_maya_admin",
  },

  maya_testimony_kaito: {
    id: "maya_testimony_kaito",
    type: "DIALOGUE",
    title: "Maya's Testimony - Kaito Shouldn't Have Been Working",
    character: "Maya Zhang",
    summary: "Maya reveals that Day 28 was a no-overtime day and Kaito shouldn't have been logged in.",
    keyPoints: [
      "admin01 is Kaito Nakamura",
      "Day 28 was a no-overtime day",
      "Kaito shouldn't have been working",
      "He may have logged in from home secretly"
    ],
    timestamp: Date.now(),
    unlockedByNode: "call_maya_admin",
  },

  kaito_activity_timeline: {
    id: "kaito_activity_timeline",
    type: "DATA",
    title: "Kaito's Activity Timeline",
    dataType: "log",
    data: {
      events: [
        { time: "19:15", event: "Office login" },
        { time: "19:20", event: "Shadow data accessed" },
        { time: "19:45", event: "Office logout" },
        { time: "23:35", event: "Home login", suspicious: true },
        { time: "23:47", event: "Shadow data modified", suspicious: true },
        { time: "23:52", event: "Log deletion attempt", suspicious: true },
      ],
    },
    timestamp: Date.now(),
    unlockedByNode: "timeline_result",
  },

  lukas_profile: {
    id: "lukas_profile",
    type: "CHARACTER",
    title: "Lukas Schmidt",
    name: "Lukas Schmidt",
    role: "Senior Admin, Kaito's Mentor",
    photo: lukasImage,
    description: "Senior system administrator. Has been Kaito's mentor for a year. Performed emergency server check on Day 28 at 10:30 PM.",
    personality: "Trusting and supportive mentor. Believes in Kaito's integrity and work ethic.",
    suspicionLevel: 1,
    timestamp: Date.now(),
    unlockedByNode: "lukas_question_2",
  },

  lukas_testimony: {
    id: "lukas_testimony",
    type: "DIALOGUE",
    title: "Lukas's Statement",
    character: "Lukas Schmidt",
    summary: "Lukas confirms he left the office with Kaito around 7 PM and did an emergency server check at 10:30 PM.",
    keyPoints: [
      "Emergency server check at 10:30 PM (Day 28)",
      "Left office with Kaito around 7 PM",
      "Kaito is hardworking and kind",
      "Didn't know Kaito logged in from home"
    ],
    timestamp: Date.now(),
    unlockedByNode: "lukas_question_1",
  },

  noctis_profile: {
    id: "noctis_profile",
    type: "DATA",
    title: "Noctis Player Profile",
    dataType: "table",
    data: {
      ign: "Noctis",
      ip: "192.168.45.178",
      mainCharacter: "Shadow (95% pick rate)",
      session: "Day 28: 23:50~01:30",
      winRate: "48% → 88%",
      suspicious: true,
    },
    timestamp: Date.now(),
    unlockedByNode: "found_noctis",
  },

  diego_profile: {
    id: "diego_profile",
    type: "CHARACTER",
    title: "Diego Torres",
    name: "Diego Torres",
    role: "Shadow Main Player (ShadowFan99)",
    photo: diegoImage,
    description: "Enthusiastic Shadow player. Played on Day 28 from 7 PM to 9 PM. Has clean alibi.",
    personality: "Passionate gamer who loves playing Shadow. Innocent bystander who benefited from the buff.",
    suspicionLevel: 0,
    timestamp: Date.now(),
    unlockedByNode: "diego_press_2",
  },

  diego_alibi: {
    id: "diego_alibi",
    type: "DATA",
    title: "Diego's Alibi - Logged out at 9 PM",
    dataType: "log",
    data: {
      ign: "ShadowFan99",
      logs: [
        { time: "19:02", event: "Login" },
        { time: "20:58", event: "Logout" },
      ],
      noFurtherActivity: true,
    },
    timestamp: Date.now(),
    unlockedByNode: "diego_press_2",
  },

  kaito_home_login: {
    id: "kaito_home_login",
    type: "DATA",
    title: "Kaito's Home Login - 23:35",
    dataType: "log",
    data: {
      time: "23:35",
      location: "Home",
      account: "admin01 (Kaito Nakamura)",
      suspicious: true,
    },
    timestamp: Date.now(),
    unlockedByNode: "kaito_testimony",
  },

  shadow_modification_log: {
    id: "shadow_modification_log",
    type: "DATA",
    title: "Shadow Data Modification Log",
    dataType: "log",
    data: {
      time: "23:47",
      action: "WRITE",
      target: "Shadow character data",
      account: "admin01 (Kaito Nakamura)",
      suspicious: true,
    },
    timestamp: Date.now(),
    unlockedByNode: "kaito_testimony",
  },

  kaito_confession: {
    id: "kaito_confession",
    type: "DIALOGUE",
    title: "Kaito's Confession",
    character: "Kaito Nakamura",
    summary: "Kaito confesses to illegally buffing Shadow to win company tournaments.",
    keyPoints: [
      "Wanted to win in company tournaments",
      "Loved Shadow but lacked skill",
      "Thought small buff wouldn't hurt anyone",
      "Didn't anticipate the chaos it would cause",
      "Sincerely apologetic"
    ],
    timestamp: Date.now(),
    unlockedByNode: "kaito_motive",
  },
};
