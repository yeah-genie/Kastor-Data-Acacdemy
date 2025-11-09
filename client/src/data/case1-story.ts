export interface Message {
  id: string;
  speaker: "detective" | "client" | "system" | "narrator" | "maya" | "chris" | "ryan";
  text: string;
  avatar?: string;
  characterName?: string;
  timestamp?: string;
  photo?: string;
}

export interface DataVisualization {
  type: "chart" | "table" | "log";
  title: string;
  data: any;
}

export interface StoryNode {
  id: string;
  phase: "stage1" | "stage2" | "stage3" | "stage4" | "stage5";
  messages: Message[];
  dataVisualizations?: DataVisualization[];
  question?: {
    id: string;
    text: string;
    choices: {
      id: string;
      text: string;
      isCorrect: boolean;
      nextNode: string;
      feedback: string;
      clueAwarded?: {
        id: string;
        title: string;
        description: string;
      };
      evidenceAwarded?: any;
      pointsAwarded?: number;
    }[];
  };
  autoAdvance?: {
    nextNode: string;
    delay: number;
  };
}

import { case1Evidence } from "./case1-evidence";

export const case1Story: Record<string, StoryNode> = {
  start: {
    id: "start",
    phase: "stage1",
    messages: [
      { id: "m1", speaker: "system", text: "📁 CASE FILE #001: THE MISSING BALANCE PATCH" },
      { id: "m2", speaker: "system", text: "🕐 11:47 PM - Your detective office. An email notification chimes." },
      { id: "m3", speaker: "maya", text: "Detective, we have a major problem. After last night's game update, the character 'Shadow Reaper' became incredibly overpowered - the win rate jumped abnormally and the community thinks someone deliberately manipulated the balance. Many players have stopped playing and I have a meeting tomorrow morning. I need to know what happened.", timestamp: "11:47 PM" },
      { id: "m5", speaker: "narrator", text: "Interesting case! A sudden win rate spike usually means something changed in the game data. What's your theory?" },
    ],
    question: {
      id: "q1",
      text: "🎯 What could cause this problem?",
      choices: [
        { id: "c1", text: "A bug in the update code", isCorrect: true, nextNode: "stage2_start", feedback: "Let's investigate the development team.", pointsAwarded: 10 },
        { id: "c2", text: "Someone deliberately changed the data", isCorrect: true, nextNode: "stage2_start", feedback: "Let's find out who had access.", pointsAwarded: 10 },
        { id: "c3", text: "Players found a new strategy", isCorrect: true, nextNode: "stage2_start", feedback: "Let's talk to the team to find out.", pointsAwarded: 10 },
      ],
    },
  },

  stage2_start: {
    id: "stage2_start",
    phase: "stage2",
    messages: [
      { id: "m10", speaker: "system", text: "📊 STAGE 2: DATA COLLECTION" },
      { id: "m11", speaker: "system", text: "☀️ 8:00 AM - You arrive at the Game Studio headquarters. Large monitors display live game statistics.", photo: "/office-scene.jpg" },
      { id: "m12", speaker: "maya", text: "Good morning, Detective. Let me introduce you to the team.", timestamp: "8:05 AM" },
      { id: "m14", speaker: "maya", text: "This is Chris Park, our Data Analyst. He monitors game stats and player behavior patterns.", timestamp: "8:06 AM" },
      { id: "m15", speaker: "maya", text: "And Ryan Torres, our Junior Server Engineer. He manages our server logs and database access.", timestamp: "8:06 AM" },
      { id: "m16", speaker: "narrator", text: "I've added their basic profiles to your notebook. Time to interview them one by one." },
    ],
    question: {
      id: "q2",
      text: "🔍 Who should we interview first?",
      choices: [
        { id: "c4", text: "Maya", isCorrect: true, nextNode: "maya_interview", feedback: "", evidenceAwarded: [case1Evidence.office_photo, case1Evidence.maya_profile, case1Evidence.chris_profile, case1Evidence.ryan_profile], pointsAwarded: 15 },
        { id: "c5", text: "Chris", isCorrect: true, nextNode: "chris_interview", feedback: "", evidenceAwarded: [case1Evidence.office_photo, case1Evidence.maya_profile, case1Evidence.chris_profile, case1Evidence.ryan_profile], pointsAwarded: 15 },
        { id: "c6", text: "Ryan", isCorrect: true, nextNode: "ryan_interview", feedback: "", evidenceAwarded: [case1Evidence.office_photo, case1Evidence.maya_profile, case1Evidence.chris_profile, case1Evidence.ryan_profile], pointsAwarded: 15 },
      ],
    },
  },

  maya_interview: {
    id: "maya_interview",
    phase: "stage2",
    messages: [
      { id: "m17", speaker: "detective", text: "Maya, can you walk me through what happened last night?", timestamp: "8:10 AM" },
      { id: "m18", speaker: "maya", text: "I stayed late checking all the balance values before the update. I triple-checked everything using my admin01 account... The data looked perfect.", timestamp: "8:11 AM" },
      { id: "m19", speaker: "maya", text: "But honestly... I've been so exhausted lately. Too many late nights. Maybe I missed something? I trust the data, but... my gut is telling me something's off. 😔", timestamp: "8:12 AM" },
      { id: "m20", speaker: "detective", text: "What time did you access the system?", timestamp: "8:13 AM" },
      { id: "m21", speaker: "maya", text: "I logged in at 10:47 PM, reviewed the balance data, then left before midnight. Everything seemed fine when I left.", timestamp: "8:13 AM" },
      { id: "m22", speaker: "narrator", text: "Maya seems burned out - a perfectionist pushed to her limits. Her profile has been updated with personality insights." },
    ],
    question: {
      id: "q3",
      text: "🎯 Who else should we talk to?",
      choices: [
        { id: "c7", text: "Talk to Chris", isCorrect: true, nextNode: "chris_interview", feedback: "", evidenceAwarded: [case1Evidence.maya_dialogue, case1Evidence.maya_profile_updated], pointsAwarded: 10 },
        { id: "c8", text: "Talk to Ryan", isCorrect: true, nextNode: "ryan_interview", feedback: "", evidenceAwarded: [case1Evidence.maya_dialogue, case1Evidence.maya_profile_updated], pointsAwarded: 10 },
      ],
    },
  },

  chris_interview: {
    id: "chris_interview",
    phase: "stage2",
    messages: [
      { id: "m23", speaker: "detective", text: "Chris, did you notice anything unusual about the game data?", timestamp: "8:20 AM" },
      { id: "m24", speaker: "chris", text: "Actually, yes! The win rate patterns looked strange a few days before the patch. Pretty interesting stuff! 😊", timestamp: "8:21 AM" },
      { id: "m25", speaker: "detective", text: "But you didn't report it?", timestamp: "8:22 AM" },
      { id: "m26", speaker: "chris", text: "Ah, well... I was swamped with my own project. Um... I'm working on a personal AI matchmaking algorithm. 🤔", timestamp: "8:22 AM" },
      { id: "m27", speaker: "chris", text: "It's separate from company work, but... I've been using some real game data to test it. You know, for accuracy. 😰", timestamp: "8:23 AM" },
      { id: "m28", speaker: "narrator", text: "Interesting - he's friendly and upbeat on the surface, but his eyes are carefully watching your reaction. His profile has been updated." },
    ],
    question: {
      id: "q4",
      text: "🎯 Who else should we talk to?",
      choices: [
        { id: "c9", text: "Talk to Maya", isCorrect: true, nextNode: "maya_interview", feedback: "", evidenceAwarded: [case1Evidence.chris_dialogue, case1Evidence.chris_profile_updated], pointsAwarded: 10 },
        { id: "c10", text: "Talk to Ryan", isCorrect: true, nextNode: "ryan_interview", feedback: "", evidenceAwarded: [case1Evidence.chris_dialogue, case1Evidence.chris_profile_updated], pointsAwarded: 10 },
      ],
    },
  },

  ryan_interview: {
    id: "ryan_interview",
    phase: "stage2",
    messages: [
      { id: "m29", speaker: "detective", text: "Ryan, I understand you manage the server logs. Can you help us?", timestamp: "8:30 AM" },
      { id: "m30", speaker: "ryan", text: "Actually... I need to confess something. I was the one who anonymously posted about this issue to the gaming community. 😐", timestamp: "8:31 AM" },
      { id: "m31", speaker: "detective", text: "Why did you do that?", timestamp: "8:32 AM" },
      { id: "m32", speaker: "ryan", text: "I'm frustrated with the overtime culture here - the crunch, the pressure. I felt like reporting internally wouldn't change anything. Someone had to speak up. 😤", timestamp: "8:32 AM" },
      { id: "m33", speaker: "ryan", text: "But I can provide you the server access logs. The data doesn't lie. That's what I believe in. 👁️", timestamp: "8:33 AM" },
      { id: "m34", speaker: "narrator", text: "He's principled and honest - willing to risk his job for what he believes is right. His profile has been updated." },
    ],
    question: {
      id: "q5",
      text: "🎯 Who else should we talk to?",
      choices: [
        { id: "c11", text: "Talk to Maya", isCorrect: true, nextNode: "maya_interview", feedback: "", evidenceAwarded: [case1Evidence.ryan_dialogue, case1Evidence.server_logs, case1Evidence.ryan_profile_updated], pointsAwarded: 10 },
        { id: "c12", text: "Talk to Chris", isCorrect: true, nextNode: "chris_interview", feedback: "", evidenceAwarded: [case1Evidence.ryan_dialogue, case1Evidence.server_logs, case1Evidence.ryan_profile_updated], pointsAwarded: 10 },
        { id: "c13", text: "Analyze the server logs", isCorrect: true, nextNode: "stage3_start", feedback: "", evidenceAwarded: [case1Evidence.ryan_dialogue, case1Evidence.server_logs, case1Evidence.ryan_profile_updated], pointsAwarded: 15 },
      ],
    },
  },

  stage3_start: {
    id: "stage3_start",
    phase: "stage3",
    messages: [
      { id: "m35", speaker: "system", text: "🔬 STAGE 3: DATA PREPROCESSING" },
      { id: "m36", speaker: "system", text: "📊 Your office - Time to organize and clean the collected data" },
      { id: "m37", speaker: "narrator", text: "Let me process these server logs. There's a lot of entries here..." },
    ],
    autoAdvance: { nextNode: "analyze_logs", delay: 1000 },
  },

  analyze_logs: {
    id: "analyze_logs",
    phase: "stage3",
    messages: [
      { id: "m38", speaker: "narrator", text: "I've filtered the logs to show only admin01 activity on November 8th. Take a look." },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Server Access Logs - November 8",
      data: {
        entries: [
          { time: "10:47 PM", user: "admin01", action: "Login", ip: "192.168.1.47" },
          { time: "11:12 PM", user: "admin01", action: "Access Balance_DB", ip: "192.168.1.47" },
          { time: "11:15 PM", user: "admin01", action: "MODIFY Shadow_Reaper.attack_power: 100 → 150", ip: "192.168.1.47" },
          { time: "11:58 PM", user: "admin01", action: "Logout", ip: "192.168.1.47" },
        ],
      },
    }],
    question: {
      id: "q6",
      text: "🎯 What do you notice about these logs?",
      choices: [
        { id: "c14", text: "Maya's account was used at 10:47 PM", isCorrect: true, nextNode: "ip_discovery", feedback: "admin01 logged in. Let's check the IP address...", pointsAwarded: 10 },
        { id: "c15", text: "The attack power was changed at 11:15 PM", isCorrect: true, nextNode: "ip_discovery", feedback: "From 100 to 150. But who made that change?", pointsAwarded: 10 },
        { id: "c16", text: "All activity came from IP 192.168.1.47", isCorrect: true, nextNode: "ip_discovery", feedback: "Let's find out whose computer that is.", pointsAwarded: 15 },
      ],
    },
  },

  ip_discovery: {
    id: "ip_discovery",
    phase: "stage3",
    messages: [
      { id: "m39", speaker: "narrator", text: "I cross-referenced the IP addresses with the office network map. Here's what I found..." },
    ],
    dataVisualizations: [{
      type: "table",
      title: "IP Address Analysis",
      data: {
        headers: ["Time", "Event", "IP Address", "Computer Owner"],
        rows: [
          ["10:47 PM", "Maya leaves office (CCTV)", "N/A", "Maya Chen"],
          ["11:12 PM", "admin01 access Balance_DB", "192.168.1.47", "Chris Park"],
          ["11:15 PM", "admin01 modify data", "192.168.1.47", "Chris Park"],
          ["11:58 PM", "admin01 logout", "192.168.1.47", "Chris Park"],
        ],
      },
    }],
    question: {
      id: "q7",
      text: "🎯 What does this tell us?",
      choices: [
        { id: "c17", text: "Maya's account was used after she left", isCorrect: true, nextNode: "stage4_start", feedback: "Someone used her account after 10:47 PM.", evidenceAwarded: case1Evidence.ip_analysis, pointsAwarded: 15 },
        { id: "c18", text: "Chris's computer made the changes", isCorrect: true, nextNode: "stage4_start", feedback: "IP 192.168.1.47 belongs to Chris.", evidenceAwarded: case1Evidence.ip_analysis, pointsAwarded: 15 },
        { id: "c19", text: "Chris used Maya's account without permission", isCorrect: true, nextNode: "stage4_start", feedback: "Let's confront him with this evidence.", evidenceAwarded: case1Evidence.ip_analysis, pointsAwarded: 20 },
      ],
    },
  },

  stage4_start: {
    id: "stage4_start",
    phase: "stage4",
    messages: [
      { id: "m40", speaker: "system", text: "🧩 STAGE 4: EVIDENCE ANALYSIS" },
      { id: "m41", speaker: "system", text: "📊 Combining all the evidence pieces together" },
      { id: "m42", speaker: "narrator", text: "Let's review what we know before we confront Chris..." },
    ],
    autoAdvance: { nextNode: "analyze_evidence", delay: 1000 },
  },

  analyze_evidence: {
    id: "analyze_evidence",
    phase: "stage4",
    messages: [
      { id: "m43", speaker: "detective", text: "Here's what we've discovered:", timestamp: "9:30 AM" },
      { id: "m44", speaker: "detective", text: "1. Shadow Reaper's attack power was changed from 100 to 150 at 11:15 PM", timestamp: "9:31 AM" },
      { id: "m45", speaker: "detective", text: "2. The change was made using Maya's admin01 account", timestamp: "9:31 AM" },
      { id: "m46", speaker: "detective", text: "3. But Maya left the office at 10:47 PM (confirmed by CCTV)", timestamp: "9:31 AM" },
      { id: "m47", speaker: "detective", text: "4. The IP address (192.168.1.47) belongs to Chris's computer", timestamp: "9:32 AM" },
      { id: "m48", speaker: "detective", text: "5. Chris mentioned working on an AI 'research project' that needed game data", timestamp: "9:32 AM" },
      { id: "m49", speaker: "narrator", text: "Chris used Maya's credentials to boost Shadow Reaper's power. But why would he do that?" },
    ],
    dataVisualizations: [{
      type: "chart",
      title: "Shadow Reaper Win Rate Timeline",
      data: {
        labels: ["Nov 7", "Nov 8 (Before)", "Nov 8 (After)", "Nov 9"],
        datasets: [{
          label: "Win Rate %",
          data: [48.5, 49.2, 73.8, 75.1],
          color: "#ef4444",
        }],
      },
    }],
    question: {
      id: "q8",
      text: "🎯 Why would Chris do this?",
      choices: [
        { id: "c20", text: "To create chaos and get the company in trouble", isCorrect: true, nextNode: "stage5_start", feedback: "Let's find out his real motive.", evidenceAwarded: case1Evidence.winrate_chart, pointsAwarded: 10 },
        { id: "c21", text: "To generate dramatic data for his AI research", isCorrect: true, nextNode: "stage5_start", feedback: "This aligns with what he said about his project.", evidenceAwarded: case1Evidence.winrate_chart, pointsAwarded: 10 },
        { id: "c22", text: "By accident while testing something", isCorrect: true, nextNode: "stage5_start", feedback: "Let's ask him directly.", evidenceAwarded: case1Evidence.winrate_chart, pointsAwarded: 10 },
      ],
    },
  },

  stage5_start: {
    id: "stage5_start",
    phase: "stage5",
    messages: [
      { id: "m50", speaker: "system", text: "⚖️ STAGE 5: INSIGHT & RESOLUTION" },
      { id: "m51", speaker: "system", text: "🎯 Conference room - Time to confront the suspect" },
      { id: "m52", speaker: "maya", text: "I've called Chris to the conference room as you requested.", timestamp: "10:00 AM" },
    ],
    autoAdvance: { nextNode: "confront_chris", delay: 1000 },
  },

  confront_chris: {
    id: "confront_chris",
    phase: "stage5",
    messages: [
      { id: "m53", speaker: "detective", text: "Chris, we know you used Maya's account on November 8th at 11:15 PM to change Shadow Reaper's attack power from 100 to 150.", timestamp: "10:05 AM" },
      { id: "m54", speaker: "chris", text: "I... how did you...", timestamp: "10:05 AM" },
      { id: "m55", speaker: "detective", text: "Your computer's IP address, 192.168.1.47, is in the server logs. You accessed the database after Maya had already left the office.", timestamp: "10:06 AM" },
      { id: "m56", speaker: "chris", text: "...", timestamp: "10:06 AM" },
      { id: "m57", speaker: "chris", text: "Okay. You're right. I did it.", timestamp: "10:07 AM" },
      { id: "m58", speaker: "chris", text: "I'm working on an AI matchmaking algorithm. I needed diverse, extreme data to train my model properly.", timestamp: "10:07 AM" },
      { id: "m59", speaker: "chris", text: "I thought if I just temporarily made one character overpowered, I could collect unique player behavior data and then revert it.", timestamp: "10:08 AM" },
      { id: "m60", speaker: "chris", text: "I didn't think it would blow up this badly. I'm sorry.", timestamp: "10:08 AM" },
      { id: "m61", speaker: "maya", text: "Chris! You compromised the entire game for your personal project? How did you even get my password?", timestamp: "10:09 AM" },
      { id: "m62", speaker: "chris", text: "I... saw you type it in once when we were working late together. I know it was wrong. I'm really sorry.", timestamp: "10:10 AM" },
    ],
    question: {
      id: "q9",
      text: "🎯 What should happen next?",
      choices: [
        { id: "c23", text: "Recommend disciplinary action for Chris", isCorrect: true, nextNode: "resolution", feedback: "", pointsAwarded: 20 },
        { id: "c24", text: "Recommend improving security protocols", isCorrect: true, nextNode: "resolution", feedback: "", pointsAwarded: 20 },
        { id: "c25", text: "Both disciplinary action and better security", isCorrect: true, nextNode: "resolution", feedback: "", pointsAwarded: 25 },
      ],
    },
  },

  resolution: {
    id: "resolution",
    phase: "stage5",
    messages: [
      { id: "m62", speaker: "system", text: "📝 CASE RESOLUTION" },
      { id: "m63", speaker: "narrator", text: "Excellent work, Detective! Here's what happened..." },
      { id: "m64", speaker: "detective", text: "Chris Park obtained Maya's admin credentials and deliberately modified Shadow Reaper's attack power to generate extreme gameplay data for his personal AI research project.", timestamp: "10:20 AM" },
      { id: "m65", speaker: "detective", text: "He didn't intend to cause permanent damage, but his unauthorized access violated security protocols and damaged player trust.", timestamp: "10:21 AM" },
      { id: "m66", speaker: "maya", text: "Thank you, Detective. We'll revert the changes immediately and implement mandatory password security training.", timestamp: "10:22 AM" },
      { id: "m67", speaker: "maya", text: "Chris will face disciplinary action, but we'll also improve our access control systems so this can't happen again.", timestamp: "10:23 AM" },
      { id: "m68", speaker: "narrator", text: "🎉 CASE CLOSED!" },
      { id: "m69", speaker: "narrator", text: "🎓 You learned: How to analyze server logs, cross-reference IP addresses, identify unauthorized access patterns, and use data preprocessing to uncover the truth!" },
    ],
    autoAdvance: { nextNode: "end", delay: 3000 },
  },

  end: {
    id: "end",
    phase: "stage5",
    messages: [
      { id: "m70", speaker: "system", text: "✅ CASE #001 COMPLETE" },
    ],
  },
};
