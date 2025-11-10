# Episode 1: The Missing Balance Patch (Interactive Version)
## Data Detective Academy - Case #001

---

## 📋 Case Overview

**Case Title:** The Missing Balance Patch
**Case Number:** #001
**Difficulty:** Beginner
**Key Learning:** Sudden changes in data always have a cause. Check system logs and permission records to discover hidden manipulations.

**Synopsis:**
A specific character's win rate has abnormally surged in a popular online game. The Shadow character's win rate jumped from 50% to 85% overnight, but no official patches were released. Analyze win rate graphs, patch logs, and server records to uncover the insider's manipulation!

---

## 🎭 Characters

### Main Characters

**Kastor**
- Role: Senior Detective, Your Mentor
- Personality: Laid-back but sharp. Likes to test rookies with tough questions.
- Quote: "Detectives work with data, not feelings~"

**Detective (Player)**
- Role: New Detective, First Day
- Your role: Analyze data, interview suspects, solve the case

### Client

**Maya Chen**
- Role: Senior Game Designer, Balance Patch Lead
- Company: Game Studio
- Situation: Desperate for help as player trust is collapsing
- Quote: "If we lose player trust... the game could die!"

### Suspects & Witnesses

**Ryan Nakamura** ⚠️
- Role: Balance Designer
- Account: admin01
- Personality: Passionate about game balance, competitive player
- Background: Participates in company tournaments
- Suspicion Level: ★★★★★

**Daniel Schmidt**
- Role: Senior Admin, Ryan's Mentor
- Account: admin02
- Personality: Trusting and supportive
- Background: Mentored Ryan for one year
- Suspicion Level: ★☆☆☆☆

**Alex Torres (ShadowFan99)**
- Role: Shadow Main Player
- IGN: ShadowFan99
- Personality: Enthusiastic gamer
- Background: Played on Day 28 from 7-9 PM
- Suspicion Level: ★☆☆☆☆

---

## 🎬 Scene 0: First Meeting

**[Setting: Run-down office. Papers scattered everywhere.]**

**Kastor:** (sleeping) "Zzz..."

**[Detective opens door and enters]**

**Detective:** "Is this the right place?"

**Kastor:** "Huh?" (waking up) "Oh, the newbie?"

**Detective:** "I'm the new detective."

**Kastor:** "You don't look like a detective."

**Detective:** "It's my first day!"

**Kastor:** "Yeah, I can tell. What's your name?"

**[PLAYER INPUT: Name Entry]**

**Kastor:** "Got it. I'm Kastor."

**Kastor:** "Alright, we've got our first case. Ready to dive in?"

---

## 🎬 Scene 1: Client Email & Maya's Call

### Email Arrives

**Kastor:** "Mail's here!"

**[Opens email]**

```
From: Maya Chen
Subject: URGENT! Please help!

The Shadow character's win rate jumped from 50% to 85% overnight!
We didn't release any patches... This is a disaster!
```

**📧 EVIDENCE ADDED: Maya's Request Email**

### Question Time

**Q: What's your initial assessment?**

A) "So it suddenly became overpowered" ✓ (10 points)
B) "It's probably just a bug" (5 points)

### Maya's Phone Call

**[Phone rings]**

**Maya:** "Hello! Is this the detective?"

**Detective:** "Yes, I received your email."

**Maya:** "This is a complete disaster! Players are rioting, the community is exploding with complaints..."

**Maya:** "If we lose player trust... the game could die!"

**Detective:** "Calm down. Tell me exactly what happened."

**Maya:** "We have a character called Shadow, and starting on Day 28, it suddenly became way too strong."

**Maya:** "But we didn't release any official patches!"

**Kastor:** "Interesting. Can you send us the data?"

**Maya:** "Yes! I'll send it right now!"

**💬 EVIDENCE ADDED: Maya's Testimony - "No Official Patch"**
**📊 EVIDENCE ADDED: Character Performance Data**

### Detective's Deduction

**Q: What could be causing this?**

A) "Three possibilities: Hidden patch, bug, or someone tampered with it" ✓ (15 points)
B) "Definitely a hidden patch" (5 points)

**Kastor:** "Three possibilities. Hidden patch, bug, or..."

**Kastor:** "Someone tampered with it."

**Detective:** "I'm guessing the last one."

**Kastor:** "Just a hunch? Detectives work with data, not feelings~"

---

## 🎬 Scene 2: Graph Analysis (INTERACTIVE)

**Kastor:** "Alright, data's in! Time for you to analyze it."

**Kastor:** "Shadow, Phoenix, Viper. What looks suspicious?"

### 📊 Interactive Graph Analysis

**[PLAYER ACTION: Analyze the win rate graph]**

```
Win Rate Data:

Day 24-27: Shadow 49.5-50.2% (Normal)
Day 28:    Shadow 84.7% (ABNORMAL!)
Day 29-30: Shadow 85.1-85.3% (Sustained)

Phoenix: Gradual increase from 52.3% to 56.1%
Viper: Gradual decrease from 48.2% to 46.8%
```

**Question:** Which character shows an abnormal pattern?

**[PLAYER SELECTS: Shadow (Red line)] ✓**

### Analysis Results

**Detective:** "The red line starting from Day 28..."

**Kastor:** "Like a rollercoaster, right?"

**Detective:** "It shot straight up!"

**[INTERACTIVE: Zoom in on Day 28 spike]**

```
📈 Detailed Analysis:
Day 27: Win Rate 50.2% (Normal)
Day 28: Win Rate 84.7% (ABNORMAL!)
Day 29: Win Rate 85.1% (Sustained)
```

**📈 EVIDENCE ADDED: Shadow Win Rate Spike Graph**

**Kastor:** "Exactly! Something's definitely fishy."

**Detective:** "Phoenix went up a bit too though?"

**Kastor:** "That's a healthy increase. Shadow's is a rocket launch."

**💡 LOGIC THOUGHT UNLOCKED: "Shadow's Unnatural Power Spike"**

**Kastor:** "Not bad for a rookie. Took you 10 minutes."

---

## 🎬 Scene 3: Document Investigation (INTERACTIVE)

**Kastor:** "Let's check the official patch notes."

### 📄 Interactive Document Examination

**[PLAYER ACTION: Click on suspicious sections]**

```
╔══════════════════════════════════════╗
║      DAY 28 PATCH NOTES              ║
╠══════════════════════════════════════╣
║ Phoenix: Cooldown -2 seconds ✓       ║
║ Viper: Bug fix (hitbox) ✓            ║
║ Shadow: No changes listed ⚠️          ║
╚══════════════════════════════════════╝
```

**Detective:** "It says Shadow wasn't changed."

**📄 EVIDENCE ADDED: Official Patch Notes - Day 28**

**Kastor:** "But the win rate went up. Suspicious. Let's check the server logs!"

### 🔍 Server Log Search

**Kastor:** "Search for 'Shadow' in the logs around Day 28."

**[PLAYER ACTION: Filter logs by keyword and date]**

```
╔════════════════════════════════════════════════════════╗
║           SERVER LOGS - DAY 28                         ║
╠════════════════════════════════════════════════════════╣
║ [Day 28 19:20] admin01 - Shadow data accessed (READ)  ║
║ [Day 28 23:47] admin01 - Shadow data modified (WRITE) ⚠️ ║
║ [Day 28 23:52] admin01 - Log deletion attempt (FAILED) 🚨 ║
╚════════════════════════════════════════════════════════╝
```

**Detective:** "Wait, someone modified it!"

**Kastor:** "And at 11 PM. Plus they tried to delete the logs."

**📝 EVIDENCE ADDED: Server Log - Unauthorized Modification**

**💡 LOGIC THOUGHT UNLOCKED: "Someone Tampered After Hours"**

---

## 🎬 Scene 3.5: Logic Connection (INTERACTIVE)

**Kastor:** "Time to connect the dots. What do these clues tell us?"

### 🧩 Interactive Logic Matrix

**[PLAYER ACTION: Connect two logic thoughts]**

```
Available Thoughts:
┌─────────────────────────────────────┐
│ 1. Shadow's Unnatural Power Spike   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 2. No Official Patch Released       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 3. Someone Tampered After Hours     │
└─────────────────────────────────────┘
```

**[CORRECT CONNECTION: 1 + 2 = New Deduction] ✓**

**Detective:** "The official patch notes say Shadow wasn't changed..."

**Detective:** "But the win rate proves it WAS changed!"

**💡 NEW LOGIC UNLOCKED: "Unauthorized Patch Occurred"**

**Detective:** "Someone modified Shadow's data secretly after work hours!"

**Kastor:** "Bingo! Now we need to find out WHO."

**Detective:** "Maya should know who admin01 is!"

### Calling Maya

**[Phone call]**

**Detective:** "Maya, I checked the official documentation."

**Maya:** "Yes, we didn't touch Shadow."

**Detective:** "But the server logs show modification records by admin01."

**Maya:** "...What? Then someone secretly...?"

**Maya:** "admin01... Hold on, let me check."

**Maya:** "admin01 is Ryan Nakamura. He's our balance designer..."

**👤 PROFILE ADDED: Ryan Nakamura - Balance Designer**

**Detective:** "Did he work late that night?"

**Maya:** "No! Day 28 was a no-overtime day!"

**Maya:** "From home... did he log in secretly?"

**💬 EVIDENCE UPDATED: Maya's Testimony - "Ryan Shouldn't Have Been Working"**

**Kastor:** "Highly likely. We need to dig deeper."

---

## 🎬 Scene 4: Timeline Reconstruction (INTERACTIVE)

**Kastor:** "Let's filter admin01's activity logs!"

**Kastor:** "Arrange these events in chronological order."

### ⏰ Interactive Timeline Builder

**[PLAYER ACTION: Drag and drop events to correct positions]**

```
Scrambled Events:
• Shadow data modified
• Home login detected
• Shadow data accessed
• Office logout
• Office login
• Log deletion attempt
```

**[CORRECT ORDER:]**

```
╔═══════════════════════════════════════════════════╗
║          RYAN'S ACTIVITY TIMELINE                 ║
╠═══════════════════════════════════════════════════╣
║ 19:15 - Office login                              ║
║ 19:20 - Shadow data accessed                      ║
║ 19:45 - Office logout                             ║
║ 23:35 - Home login ⚠️                              ║
║ 23:47 - Shadow data modified 🚨                    ║
║ 23:52 - Log deletion attempt 🚨                    ║
╚═══════════════════════════════════════════════════╝
```

**⏰ EVIDENCE ADDED: Ryan's Activity Timeline**

**Detective:** "He logged back in from home after leaving work!"

**Kastor:** "This was planned. But wait..."

**Kastor:** "There's also admin02. Logged in at 10:30 PM."

### Comparing Timelines

```
admin02 (Daniel):
22:30 - Login
22:35 - Server health check
22:40 - Logout

admin01 (Ryan):
23:35 - Login
23:47 - Shadow modified
```

**Detective:** "admin02 left before admin01 logged in."

**Kastor:** "Let's interview Daniel to confirm."

### Daniel Interview

**[Call connects]**

**Daniel:** "Hello? You were looking for me?"

**Detective:** "Daniel Schmidt? I have a few questions."

**Daniel:** "Sure, of course!"

**Q: What do you want to ask Daniel?**

A) "What were you doing on Day 28 at 10:30 PM?" ✓
B) "Do you know Ryan well?" ✓

### Daniel's Testimony

**Detective:** "You logged in on Day 28 at 10:30 PM, correct?"

**Daniel:** "Oh, yes! There was an emergency server check."

**Detective:** "What did you do?"

**Daniel:** "Just checked the server status. About 10 minutes?"

**💬 TESTIMONY ADDED: Daniel's Statement**

**Detective:** "Do you know what Ryan was doing that night?"

**Daniel:** "Ryan? He probably went home."

**Daniel:** "We left together. Around 7 PM?"

**Kastor:** "But Ryan logged back in at 11:35 PM."

**Daniel:** "...What? From home?"

**Daniel:** "That can't be right... Ryan's a good kid!"

**Detective:** "Are you sure?"

**Daniel:** "Yes! I've been his mentor for a year. He's hardworking and kind!"

**👤 PROFILE ADDED: Daniel Schmidt - Senior Admin, Ryan's Mentor**

**Kastor:** "Understood. Thanks for your help."

**[Call ends]**

**Detective:** "Daniel seems to know nothing."

**Kastor:** "Yeah. Ryan acted alone."

---

## 🎬 Scene 5: IP Investigation & Database Search (INTERACTIVE)

**Kastor:** "admin01's IP trace is back!"

**Detective:** "192.168.45.178?"

**Kastor:** "This IP also played the game. Let's search it."

### 🔍 Interactive Database Search

**[PLAYER ACTION: Search player database by IP]**

```
╔════════════════════════════════════════════════════╗
║          DATABASE SEARCH INTERFACE                 ║
╠════════════════════════════════════════════════════╣
║ Search Type: IP Address                            ║
║ Search Value: [Enter IP...]                        ║
║                                                     ║
║ > 192.168.45.178                          [SEARCH] ║
╚════════════════════════════════════════════════════╝
```

**[SEARCH RESULTS:]**

```
╔════════════════════════════════════════════════════╗
║               🔍 SEARCH RESULTS                     ║
╠════════════════════════════════════════════════════╣
║ IGN: Noctis                        [SUSPICIOUS]    ║
║ IP: 192.168.45.178 ✓                               ║
║ Main Character: Shadow (95% pick rate)             ║
║ Day 28 Session: 23:50~01:30                        ║
║ Win Rate: 48% → 88% 🚨                              ║
║                                                     ║
║ ⚠️ Started playing 3 minutes after modification!   ║
╚════════════════════════════════════════════════════╝
```

**🎮 EVIDENCE ADDED: Noctis Player Profile**

**Detective:** "Started playing 3 minutes after the modification!"

**Kastor:** "Suspicious timing. But there's another Shadow player."

```
Additional Player Found:
IGN: ShadowFan99
Main Character: Shadow (87% pick rate)
Day 28 Session: 19:00~21:00
Win Rate: 62% → 65%
```

**Detective:** "ShadowFan99 also benefited."

**Kastor:** "Let's interview both. You choose who to call first."

**Q: Who should we interview first?**

A) "Interview ShadowFan99 (Alex) first" ✓ (10 points)
B) "Interview Noctis (Ryan) first" (5 points)

---

## 🎬 Scene 5A: Alex Interview (INTERACTIVE)

**[Call - Alex]**

**Alex:** "Hello? What's this about?"

**Detective:** "Alex Torres? I have some questions about the game."

**Alex:** "Sure! I'm a Shadow main!"

### 📋 Interactive Testimony Analysis

```
╔════════════════════════════════════════════════════╗
║              ALEX'S TESTIMONY                      ║
╠════════════════════════════════════════════════════╣
║ 1. "I played Shadow on Day 28 from 7 PM to 9 PM!"  ║
║ 2. "Shadow got so strong that day, it was awesome!"║
║ 3. "I stopped at 9 PM and did homework after that."║
║ 4. "I didn't log in again that night!"             ║
╚════════════════════════════════════════════════════╝
```

**Q: Which statement do you want to press?**

A) Press: "Shadow got so strong that day" ✓
B) Press: "I didn't log in again that night" ✓

### Pressing Statement 2

**Detective:** "You noticed Shadow became stronger?"

**Alex:** "Yeah! Suddenly I was winning way more matches!"

**Alex:** "I thought it was just me getting better, but..."

**Detective:** "But what?"

**Alex:** "Other Shadow players were dominating too!"

### Pressing Statement 4

**Detective:** "Can you prove you didn't log in after 9 PM?"

**Alex:** "Check the logs! I have nothing to hide!"

**[PLAYER ACTION: Check game logs]**

```
╔════════════════════════════════════════════════════╗
║         GAME LOGS - ShadowFan99                    ║
╠════════════════════════════════════════════════════╣
║ 19:02 - Login                                      ║
║ 20:58 - Logout ✓                                   ║
║ [No further activity]                              ║
╚════════════════════════════════════════════════════╝
```

**✅ EVIDENCE ADDED: Alex's Alibi - Logged out at 9 PM**

**Detective:** "You're right. You logged out at 9 PM."

**Alex:** "See? It wasn't me! I just played the game!"

**Detective:** "Understood. Thank you."

**[Call ends]**

**Kastor:** "Alex is clear. Now for Ryan..."

---

## 🎬 Scene 5B: Ryan Confrontation (INTERACTIVE)

**[Call - Ryan]**

**Detective:** "Ryan Nakamura?"

**Ryan:** "Yes... what's going on?" (nervous voice)

### ⚖️ Interactive Confrontation Sequence

**Ryan's Testimony - "I Was Just Working Late":**

```
╔════════════════════════════════════════════════════╗
║              RYAN'S TESTIMONY                      ║
╠════════════════════════════════════════════════════╣
║ 1. "I sometimes log in from home to check things." ║
║ 2. "Day 28 was a normal work day for me."          ║
║ 3. "I left the office around 7 PM with Daniel."    ║
║ 4. "I didn't do anything unusual that night."      ║
║ 5. "I don't know why Shadow's win rate changed."   ║
╚════════════════════════════════════════════════════╝
```

### [PLAYER ACTION: Find contradictions and present evidence]

**Press Statement 1:**

**Detective:** "You log in from home often?"

**Ryan:** "Y-yes... when there are urgent issues..."

**Kastor:** "But Day 28 had no reported issues."

**Ryan:** "I... I was just being proactive!"

**Press Statement 3:**

**Detective:** "You left with Daniel at 7 PM?"

**Ryan:** "Yes, Daniel can confirm this..."

### [! CONTRADICTION DETECTED !]

**[PRESENT Evidence: "Ryan's Home Login - 23:35"]**

**Detective:** "But the logs show you logged in at 11:35 PM from home!"

**Ryan:** "...Who told you that?"

**Kastor:** "The server logs don't lie."

**Ryan:** "I, I was just... doing a routine check..."

### [UPDATE TESTIMONY - New statement added]

**Ryan:** "I only did a routine server check from home."

### [! CONTRADICTION DETECTED !]

**[PRESENT Evidence: "Shadow Modified at 23:47"]**

**Detective:** "At 11:47 PM, you modified Shadow's data."

**Ryan:** "......"

**Press Statement 5:**

**Detective:** "You said you don't know why Shadow changed."

### [! CONTRADICTION DETECTED !]

**[PRESENT Evidence: "Noctis Player Profile - IP Match"]**

**Detective:** "And 3 minutes later, you logged into the game as Noctis from the same IP."

**Ryan:** "......"

**Kastor:** "We have all the evidence. The IP matches, the timing's perfect, and you modified the data."

**[CASE BREAKTHROUGH!]**

---

## 🎬 Scene 5C: Evidence Chain Assembly (INTERACTIVE)

**Kastor:** "Show him the complete evidence chain!"

### 🔗 Interactive Evidence Chain

**[PLAYER ACTION: Arrange evidence in chronological order]**

```
╔════════════════════════════════════════════════════╗
║           EVIDENCE CHAIN ASSEMBLY                  ║
╠════════════════════════════════════════════════════╣
║                                                     ║
║  Drag events into correct order:                   ║
║                                                     ║
║  [ ] Ryan logged in from home (23:35)              ║
║  [ ] Ryan modified Shadow data (23:47)             ║
║  [ ] Ryan logged into game as Noctis (23:50)      ║
║  [ ] Noctis's win rate skyrocketed (48%→88%)      ║
║  [ ] Ryan attempted to delete logs (23:52)         ║
║                                                     ║
╚════════════════════════════════════════════════════╝
```

**[EVIDENCE CHAIN COMPLETE!] ✓**

```
╔════════════════════════════════════════════════════╗
║         COMPLETE EVIDENCE CHAIN                    ║
╠════════════════════════════════════════════════════╣
║ 1. Ryan logged in from home (23:35)                ║
║ 2. Ryan modified Shadow data (23:47)               ║
║ 3. Ryan logged into game as Noctis (23:50)        ║
║ 4. Noctis's win rate skyrocketed (48%→88%)        ║
║ 5. Ryan attempted to delete logs (23:52)           ║
╚════════════════════════════════════════════════════╝
```

**Detective:** "The evidence proves you illegally modified Shadow to boost your own gameplay."

**Ryan:** "......"

**Ryan:** "...I'm sorry."

**[CASE BREAKTHROUGH!]**

---

## 🎬 Scene 6: Motive & Resolution

**Detective:** "Why did you do it?"

### 🎯 Interactive Motive Investigation

**Ryan's Confession:**

```
╔════════════════════════════════════════════════════╗
║              RYAN'S CONFESSION                     ║
╠════════════════════════════════════════════════════╣
║ "I wanted to win in the company tournaments."      ║
║ "I love Shadow but my skill wasn't good enough."   ║
║ "I thought a small buff wouldn't hurt anyone."     ║
║ "I didn't think it would cause this much chaos."   ║
╚════════════════════════════════════════════════════╝
```

**📝 EVIDENCE ADDED: Ryan's Confession**

**Q: How do you respond to Ryan?**

A) "You betrayed your company's trust!" (10 points)
B) "I understand, but it was still wrong." ✓ (15 points)
C) "Everyone makes mistakes." (10 points)

**Ryan:** "I really am sorry. There's no excuse for what I did."

**Kastor:** "Alright, let's compile the final report."

---

## 🎬 Scene 6.5: Final Case Report Assembly (INTERACTIVE)

**Kastor:** "Put together the complete picture of what happened."

### 📋 Interactive Case Summary

**[PLAYER ACTION: Fill in the case report]**

```
╔════════════════════════════════════════════════════╗
║           CASE REPORT - CASE #001                  ║
╠════════════════════════════════════════════════════╣
║                                                     ║
║ WHO: [Select suspect]                              ║
║   ○ Ryan Nakamura ✓                                ║
║   ○ Daniel Schmidt                                 ║
║   ○ Alex Torres                                    ║
║   ○ Maya Chen                                      ║
║                                                     ║
║ WHEN: [Select time]                                ║
║   ○ Day 27, 19:20                                  ║
║   ○ Day 28, 23:47 PM ✓                             ║
║   ○ Day 28, 22:30                                  ║
║   ○ Day 29, 01:00                                  ║
║                                                     ║
║ HOW: [Select method]                               ║
║   ○ Unauthorized data modification ✓               ║
║   ○ Bug exploitation                               ║
║   ○ Official patch mistake                         ║
║   ○ Hacking attack                                 ║
║                                                     ║
║ WHY: [Select motive]                               ║
║   ○ Personal competitive advantage ✓               ║
║   ○ Testing game balance                           ║
║   ○ Sabotaging the company                         ║
║   ○ Accidental mistake                             ║
║                                                     ║
╠════════════════════════════════════════════════════╣
║ EVIDENCE:                                          ║
║ ✓ Server logs showing modification                 ║
║ ✓ IP address match with Noctis                     ║
║ ✓ Timeline of events                               ║
║ ✓ Win rate data spike                              ║
║ ✓ Ryan's confession                                ║
╚════════════════════════════════════════════════════╝
```

**[CASE REPORT COMPLETE!] ✓**

---

## 🎬 Scene 7: Character Reactions

### Maya's Response

**[Maya calls]**

**Maya:** "It really... was Ryan?"

**Detective:** "Yes. He confessed."

**Maya:** "...I'm disappointed. But I understand the pressure he felt."

**Maya:** "Thank you so much for your help!"

**[CLIENT SATISFACTION: ★★★★★]**

### Daniel's Response

**[Daniel calls]**

**Daniel:** "Ryan... really did it?"

**Detective:** "Yes. The evidence was clear."

**Daniel:** "I trusted him... but thank you for finding the truth."

### Alex's Response

**[Alex messages]**

**Alex:** "You caught the culprit? Thank goodness! Thanks!"

---

## 🎬 Scene 8: Case Evaluation & Grading

```
╔════════════════════════════════════════════════════╗
║          CASE EVALUATION SCREEN                    ║
╠════════════════════════════════════════════════════╣
║                                                     ║
║                      S                             ║
║                                                     ║
║         Outstanding Detective Work!                ║
║                                                     ║
╠════════════════════════════════════════════════════╣
║ Evidence Collected:     12/12 ✓                    ║
║ Logic Connections Made:  5/5 ✓                     ║
║ Contradictions Found:    3/3 ✓                     ║
║ Interview Accuracy:     100% ✓                     ║
║ Time Taken:            Optimal                     ║
╠════════════════════════════════════════════════════╣
║                                                     ║
║         FINAL GRADE: S RANK 🏆                      ║
║                                                     ║
╚════════════════════════════════════════════════════╝
```

### Case Closed

**Kastor:** "First case solved perfectly! 100 points!"

**Detective:** "I feel accomplished!"

**Kastor:** "That's the detective high! Ready for the next case?"

**Detective:** "Already?!"

**Kastor:** "Detectives are busy~ Get used to it!"

```
╔════════════════════════════════════════════════════╗
║            [CASE #001 COMPLETE]                    ║
║                                                     ║
║         [NEXT CASE UNLOCKED]                       ║
╚════════════════════════════════════════════════════╝
```

---

## 📊 Interactive Mechanics Summary

### Player Interactions

1. **Scene 2: Graph Analysis**
   - Click on data points to reveal details
   - Identify abnormal patterns
   - Zoom functionality for detailed view

2. **Scene 3: Document Examination**
   - Click on suspicious sections
   - Filter server logs by keyword and date
   - Interactive log search interface

3. **Scene 3.5: Logic Connection**
   - Connect related thoughts
   - Form deductions from evidence
   - Unlock new logical conclusions

4. **Scene 4: Timeline Reconstruction**
   - Drag-and-drop events
   - Arrange in chronological order
   - Identify suspicious timing patterns

5. **Scene 5: Database Search**
   - Search by IP address
   - Analyze player profiles
   - Correlate timing with evidence

6. **Scene 5A/5B: Testimony System**
   - Press statements for more details
   - Present evidence to find contradictions
   - Build case against suspect

7. **Scene 6.5: Case Report Assembly**
   - Multiple choice selections
   - WHO, WHEN, HOW, WHY format
   - Evidence checklist verification

---

## 🏆 Ace Attorney Elements Integrated

### Evidence System
- **Court Record**: All evidence stored in notebook
- **Evidence Collection**: Automatic during investigation
- **Evidence Presentation**: Present to expose lies

### Investigation Mechanics
- **Press Testimony**: Dig deeper into statements
- **Present Evidence**: Contradict false claims
- **Logic Connections**: Connect clues to form conclusions

### Interactive Puzzles
- **Graph Analysis**: Data-driven investigation
- **Timeline Reconstruction**: Sequence events correctly
- **Database Search**: Digital forensics
- **Case Report**: Final deduction assembly

### Grading System
Performance-based scoring:
- **S Rank**: Perfect investigation (100%)
- **A Rank**: Excellent work (80-99%)
- **B Rank**: Good job (60-79%)
- **C Rank**: Case solved (below 60%)

---

## 📈 Evidence Collected (12 Total)

1. ✓ Maya's Request Email
2. ✓ Maya's Testimony - "No Official Patch"
3. ✓ Character Performance Data
4. ✓ Shadow Win Rate Spike Graph
5. ✓ Official Patch Notes - Day 28
6. ✓ Server Log - Unauthorized Modification
7. ✓ Ryan's Profile
8. ✓ Maya's Testimony - "Ryan Shouldn't Have Been Working"
9. ✓ Ryan's Activity Timeline
10. ✓ Daniel's Profile & Statement
11. ✓ Noctis Player Profile
12. ✓ Alex's Alibi
13. ✓ Ryan's Confession

---

## 🎯 Key Learning Points

**1. Data Analysis**
- Sudden spikes indicate external intervention
- Compare normal patterns with anomalies
- Visual data reveals hidden truths

**2. Log Tracking**
- Server logs are reliable evidence
- Timestamps reveal suspicious activity
- Failed deletion attempts leave traces

**3. Change Detection**
- Official records vs actual changes
- Discrepancies point to manipulation
- Multiple data sources provide verification

**4. Investigation Process**
- Gather data → Analyze patterns → Form hypothesis
- Interview witnesses → Collect evidence → Confront suspect
- Build logical chain → Present proof → Solve case

**5. Digital Forensics**
- IP tracking connects accounts
- Activity timelines reveal planning
- Database records preserve truth

---

## 💡 Takeaway

> "Sudden changes in data always have a cause. Check system logs and permission records to discover hidden manipulations."

**Case Solved!**

---

**END OF EPISODE 1**

*Thank you for playing Data Detective Academy!*

---

## 📝 Technical Implementation Notes

### Story Structure
- **50+ story nodes** with branching paths
- **Multiple choice questions** with point rewards
- **Evidence notifications** throughout investigation
- **Logic thought unlocks** for deduction progression

### Interactive Components
- GraphAnalysisInteractive.tsx
- DocumentExamination.tsx
- LogicConnectionPuzzle.tsx
- TimelineReconstruction.tsx
- DatabaseSearch.tsx (NEW)
- TestimonyPress.tsx
- CaseReportAssembly.tsx (NEW)

### Character Profiles
- Ryan Nakamura (Culprit)
- Daniel Schmidt (Witness)
- Alex Torres (Innocent)
- Maya Chen (Client)

### Evidence Types
- DOCUMENT: Emails, patch notes, logs
- DATA: Charts, tables, databases
- DIALOGUE: Testimonies, interviews
- CHARACTER: Profile cards

---

*Document Version: 1.0*
*Last Updated: 2025-11-10*
