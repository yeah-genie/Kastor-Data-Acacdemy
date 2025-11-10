import { Evidence } from "@/lib/stores/useDetectiveGame";

const mayaImage = "/characters/maya.jpg";
const chrisImage = "/characters/chris.jpg";
const ryanImage = "/characters/ryan.jpg";
const officeImage = "/office-scene.jpg";

export const case1Evidence: Record<string, Evidence> = {
  office_photo: {
    id: "office_photo",
    type: "PHOTO",
    title: "Game Studio Office",
    imageUrl: officeImage,
    caption: "The Game Studio headquarters - a modern office with developers working on multiple monitors.",
    timestamp: Date.now(),
    unlockedByNode: "stage2_start",
  },
  
  maya_profile: {
    id: "maya_profile",
    type: "CHARACTER",
    title: "Maya Chen",
    name: "Maya Chen",
    role: "Senior Game Designer, Balance Patch Lead",
    photo: mayaImage,
    description: "Oversees game balance patches and meta analysis. Has admin01 account access.",
    suspicionLevel: 2,
    timestamp: Date.now() - 2,
    unlockedByNode: "meet_team",
  },
  
  chris_profile: {
    id: "chris_profile",
    type: "CHARACTER",
    title: "Chris Anderson",
    name: "Chris Anderson",
    role: "Data Analyst, Player Behavior Specialist",
    photo: chrisImage,
    description: "Analyzes player behavior and monitors matchmaking algorithms.",
    suspicionLevel: 4,
    timestamp: Date.now() - 1,
    unlockedByNode: "meet_team",
  },
  
  ryan_profile: {
    id: "ryan_profile",
    type: "CHARACTER",
    title: "Ryan Torres",
    name: "Ryan Torres",
    role: "Junior Server Engineer, Log Systems Manager",
    photo: ryanImage,
    description: "Manages game servers and maintains log systems.",
    suspicionLevel: 3,
    timestamp: Date.now(),
    unlockedByNode: "meet_team",
  },
  
  maya_profile_updated: {
    id: "maya_profile",
    type: "CHARACTER",
    title: "Maya Chen",
    name: "Maya Chen",
    role: "Senior Game Designer, Balance Patch Lead",
    photo: mayaImage,
    description: "Oversees game balance patches and meta analysis. Has admin01 account access. Recently worked overtime on the night of the patch.",
    personality: "Perfectionist who trusts data but also values intuition. Recently showing signs of burnout with more frequent mistakes. Seems exhausted and under pressure.",
    suspicionLevel: 2,
    timestamp: Date.now(),
    unlockedByNode: "meet_team",
  },
  
  chris_profile_updated: {
    id: "chris_profile",
    type: "CHARACTER",
    title: "Chris Anderson",
    name: "Chris Anderson",
    role: "Data Analyst, Player Behavior Specialist",
    photo: chrisImage,
    description: "Analyzes player behavior and monitors matchmaking algorithms. Working on a personal AI matchmaking project using game data.",
    personality: "Sociable and optimistic - the team's mood-maker. But beneath the friendly exterior, he's a keen observer who notices details others miss.",
    suspicionLevel: 4,
    timestamp: Date.now(),
    unlockedByNode: "meet_team",
  },
  
  ryan_profile_updated: {
    id: "ryan_profile",
    type: "CHARACTER",
    title: "Ryan Torres",
    name: "Ryan Torres",
    role: "Junior Server Engineer, Log Systems Manager",
    photo: ryanImage,
    description: "Manages game servers and maintains log systems. Has unlimited access to server logs and the technical ability to modify data.",
    personality: "Quiet and introverted. Follows rules strictly and has a strong sense of ethics. Recently frustrated with the company's crunch culture.",
    suspicionLevel: 3,
    timestamp: Date.now(),
    unlockedByNode: "meet_team",
  },
  
  maya_dialogue: {
    id: "maya_dialogue",
    type: "DIALOGUE",
    title: "Interview with Maya",
    character: "Maya Chen",
    summary: "Maya claims she checked all balance values 3 times before the update. She logged in late (10:47 PM) and accessed the balance database. She seems tired and admits she might have made a mistake due to overwork.",
    keyPoints: [
      "Maya worked until midnight checking the update",
      "She triple-checked all balance numbers",
      "She's been under a lot of pressure lately",
      "Has admin01 account access"
    ],
    timestamp: Date.now(),
    unlockedByNode: "maya_interview",
  },
  
  chris_dialogue: {
    id: "chris_dialogue",
    type: "DIALOGUE",
    title: "Interview with Chris",
    character: "Chris Anderson",
    summary: "Chris noticed unusual win rate changes days before but was too busy with his 'research project.' When pressed, he mentioned working on an AI matchmaking experiment unrelated to the company. He seemed nervous when discussing it.",
    keyPoints: [
      "Noticed strange win rate patterns earlier",
      "Working on secret AI matchmaking research",
      "Claims it's unrelated to company work",
      "Became defensive when questioned"
    ],
    timestamp: Date.now(),
    unlockedByNode: "chris_interview",
  },
  
  ryan_dialogue: {
    id: "ryan_dialogue",
    type: "DIALOGUE",
    title: "Interview with Ryan",
    character: "Ryan Torres",
    summary: "Ryan confessed he was the anonymous whistleblower who first posted about the issue to the gaming community. He's frustrated with the company's overtime culture and felt direct reporting wouldn't help. He provided server access logs.",
    keyPoints: [
      "He was the anonymous whistleblower",
      "Frustrated with company culture",
      "Provided crucial server logs",
      "Believes 'data doesn't lie'"
    ],
    timestamp: Date.now(),
    unlockedByNode: "ryan_interview",
  },
  
  server_logs: {
    id: "server_logs",
    type: "DATA",
    title: "Server Access Logs",
    dataType: "log",
    data: {
      entries: [
        { time: "Nov 8, 10:47 PM", user: "admin01", action: "Login", status: "success", ip: "192.168.1.47" },
        { time: "Nov 8, 11:12 PM", user: "admin01", action: "Access Balance_DB", status: "success", ip: "192.168.1.47" },
        { time: "Nov 8, 11:15 PM", user: "admin01", action: "MODIFY Shadow_Reaper.attack_power: 100 → 150", status: "success", ip: "192.168.1.47" },
        { time: "Nov 8, 11:58 PM", user: "admin01", action: "Logout", status: "success", ip: "192.168.1.47" },
      ],
    },
    timestamp: Date.now(),
    unlockedByNode: "ryan_interview",
  },
  
  ip_analysis: {
    id: "ip_analysis",
    type: "DATA",
    title: "IP Address Timeline Analysis",
    dataType: "table",
    data: {
      headers: ["Time", "Event", "IP Address", "User"],
      rows: [
        ["10:47 PM", "Maya leaves office (CCTV)", "N/A", "Maya Chen"],
        ["11:12 PM", "admin01 login", "192.168.1.47", "Unknown"],
        ["11:12 PM", "Chris computer active", "192.168.1.47", "Chris Anderson"],
        ["11:58 PM", "admin01 logout", "192.168.1.47", "Unknown"],
      ],
    },
    timestamp: Date.now(),
    unlockedByNode: "ip_discovery",
  },
  
  winrate_chart: {
    id: "winrate_chart",
    type: "DATA",
    title: "Shadow Reaper Win Rate Trend",
    dataType: "chart",
    data: {
      labels: ["Nov 7", "Nov 8 (Pre-Update)", "Nov 8 (Post-Update)", "Nov 9"],
      datasets: [{
        label: "Win Rate %",
        data: [48.5, 49.2, 73.8, 75.1],
        color: "#ef4444",
      }],
    },
    timestamp: Date.now(),
    unlockedByNode: "analyze_data",
  },
};
