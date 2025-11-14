# Episode 1: The Missing Balance Patch

### Final Script (EN) — Toggle Scenes

### Scene 0.1 — Office

NARRATOR: A run-down detective office. Dust on the desk. Someone's sleeping.

KASTOR: (snoring) "Zzzzz..."

[Door opens — Detective enters]

DETECTIVE: "...Is this the right place?"

KASTOR: (wakes) "Hm?" (stretches) "Oh! New person?"

DETECTIVE: "I'm the new detective."

KASTOR: "Detective? You don't look like one."

DETECTIVE: "It's my first day!"

KASTOR: "I can tell. It's written all over your face."

DETECTIVE: (This guy...)

KASTOR: "I'm Kastor. Your partner!" (grins)

DETECTIVE: "Nice to meet you, I guess?"

KASTOR: "Name?"

[INPUT: Name]

DETECTIVE: "[Name]"

KASTOR: "Cool name! Spell it right?"

DETECTIVE: "I just typed it myself, so yes."

KASTOR: "Good! No refunds on name tags."

DETECTIVE: "What?"

KASTOR: "Kidding~ But seriously, we're broke."

DETECTIVE: (What kind of agency is this...)

🎵 MINI CELEBRATION — Partnership formed!

### Scene 0.2 — First Case Arrives

[Email notification sound — DING!]

KASTOR: "Ooh! Mail!"

DETECTIVE: "Already?"

KASTOR: "Yep! You're lucky! No cases = boring."

DETECTIVE: "Is that... good luck?"

KASTOR: "Obviously! Now click it!"

[EMAIL OPENS — Animation]

FROM: Maya Zhang

SUBJECT: URGENT! Need Help!

"Hello detectives!

I'm Maya, director of Legend Arena.

We have a HUGE problem! 😰

Our character Shadow's win rate jumped from 50% to 85% in ONE DAY!

We didn't patch him! I have no idea why this happened!

Players are furious! The community is exploding!

If we lose player trust... the game is finished!

PLEASE HELP US!"

KASTOR: "Ooh! Game case! Fun!"

DETECTIVE: "Shadow got way stronger overnight..."

KASTOR: "35% jump! That's insane!"

DETECTIVE: "Is that a lot?"

KASTOR: "It's like... eating half a chicken, then suddenly eating THREE chickens."

DETECTIVE: "...What kind of analogy is that?"

KASTOR: "Didn't work? Okay, imagine—"

DETECTIVE: "NO! I get it! It's a lot!"

KASTOR: (laughs) "See? Food analogies work!"

DETECTIVE: (Why food...)

KASTOR: "So! Three possibilities! Pick one!"

[INTERACTIVE CHOICE — First hypothesis]

Options: A) Official patch B) Rare bug C) Secret data modification

[If C]

KASTOR: "Ooh! Crime vibes! I like it!"

DETECTIVE: "Just... a feeling."

KASTOR: "Detectives can't work on feelings~"

DETECTIVE: "Then what?"

KASTOR: "DATA! Numbers don't lie!"

DETECTIVE: "People do?"

KASTOR: "All the time! Let's go check!"

🎵 MINI CELEBRATION — Case accepted! +10 points

### Scene 0.3 — Call Maya

[Phone dialing]

MAYA: "Hello? Is this the detective?"

DETECTIVE: "Yes, we got your email. Tell us everything."

MAYA: "Shadow's win rate spiked on Day 28. We didn't patch him. Community's on fire."

KASTOR: "Can you send data? Patch notes, server logs."

MAYA: "I'll send them now! Please hurry!"

### Scene 1.1 — Graph Analysis Setup

KASTOR: "Data received. Open the graph!"

[Interactive line graph — Shadow, Phoenix, Viper]

DETECTIVE: "The red line (Shadow) rockets up at Day 28..."

KASTOR: "Exactly. Rollercoaster to space."

DETECTIVE: "Phoenix also rises slightly."

KASTOR: "Gentle hill vs rocket. Pick the most suspicious."

[Choice → Shadow]

🎵 MINI CELEBRATION — Key observation

KASTOR: "Quick summary — Shadow's line shoots up on Day 28. That means something changed fast, so we check notes and logs first."

### Scene 1.2 — Document Check

[Official Patch Notes]

Day 28: Phoenix cooldown -2s. Shadow — No changes.

[Server Logs]

23:47 admin01 — Modified Shadow

23:52 admin01 — Attempted to clear logs (failed)

DETECTIVE: "There's a modification at 23:47!"

KASTOR: "Not in the official notes. Someone went rogue."

Call Maya → "admin01 = Kaito Nakamura (junior balance). No overtime that day."

[Auth Audit Logs]
2025-10-28T23:45:12Z auth.session START user=admin01 session_id=SED-ABC123 ip=203.0.113.45 device_fingerprint=DFP:7a9c...
2025-10-28T23:47:02Z auth.action MODIFY character=Shadow field=base_stats session_id=SED-ABC123 author=admin01
2025-10-28T23:47:03Z auth.action ATTEMPT_CLEAR_LOGS session_id=SED-ABC123 author=admin01 result=FAILED
2025-10-28T23:50:03Z auth.session LOGIN user=Noctis session_id=PLR-XYZ789 ip=203.0.113.45 device_fingerprint=DFP:7a9c...

KASTOR: "Look — same IP and device fingerprint. It's like the same phone being used to edit the game's numbers and then to play. Super suspicious."

NOTE: Kaito was a junior balance designer with access to internal staging tools. Production edits normally require approval, but audit logs show a debug token (`debug_token=DBG-3344`) was used during the modification window, allowing a direct change. Whether that token was used by Kaito or stolen will be part of the investigation.

### Scene 2 — Timeline & Lukas Interview

[Filter admin01]

19:15 Office login → 19:20 Shadow data view → 19:45 logout

23:35 Home login → 23:47 Shadow modified → 23:52 log deletion attempt

Call LUKAS: "I only checked at 22:30. Kaito's a good kid... a home login at 23:35? That doesn't add up." Shock.

### Scene 3 — IP Tracking & Diego Interview

IP 203.0.113.45 (corporate VPN exit IP), which was used by player Noctis (Shadow main, 95%).

Day 28 playtime: 23:50–01:30. Win rate jumped from 48% to 88% during that session.

Another player, ShadowFan99, was online earlier (19:00–21:00) and has an alibi.

KASTOR: "In simple words — the same public IP was used to change Shadow and then to play as Noctis. Think of it like the same computer signing both the edit log and the game session. That's why it looks fishy."

Call DIEGO: "It wasn't me — I stopped playing at nine o'clock!" Relief.

### Scene 4 — Confrontation with Kaito

DETECTIVE: "23:35 home login. 23:47 Shadow mod. 23:50 Noctis log-in."

KAITO: "Me? That's ridiculous."

KASTOR: "IP matches. Timeline matches. Logs match."
KASTOR: "That basically means the same device was used to change the character and then to play it — like finding the same phone at both spots."

KAITO: "That's... I just..." → "I'm sorry... I just wanted to win."

### Scene 5 — Case Summary & Outcomes

Summary: Kaito modified Shadow using dev access, then played as Noctis.

Motivation: Kaito believed he was acting on his own to prove himself after repeated losses — later evidence (and Episode 5) will show he was manipulated by an external operator (The Fixer).

Outcomes (choose):

- Discipline + process improvements
- Rollback + transparent announcement + redeploy
- Internal action only

MAYA: Disappointed but understanding. LUKAS: Betrayed. DIEGO: Relieved.

🎉 MAJOR CELEBRATION — Case Closed

### Scene 5 — Case Summary & Outcomes

Summary: Kaito modified Shadow using dev access, then played as Noctis.

Motivation: Kaito believed he was acting on his own to prove himself after repeated losses — later evidence (and Episode 5) will show he was manipulated by an external operator (The Fixer).

Outcomes (choose):

- Discipline + process improvements
- Rollback + transparent announcement + redeploy
- Internal action only

MAYA: Disappointed but understanding. LUKAS: Betrayed. DIEGO: Relieved.

🎉 MAJOR CELEBRATION — Case Closed
---

### 🕵️‍♂️ BONUS: Behind The Scenes

### Scene X — The Fixer's Playbook (Episode 1 실제 배후)

**[CLASSIFIED — Unlocked after completing Episode 3]**

```
=== OPERATION: SHADOW TEST ===
Objective: Test run and insider recruitment.
Target: Legend Arena
Status: COMPLETED

PHASE 1 — Target Selection:
The subject identified was Kaito Nakamura, a junior balance designer. He showed a high competitive drive, wanted recognition, and felt his ideas were often ignored — traits that made him vulnerable.

PHASE 2 — Indirect Contact:
Anonymous forum posts were placed to amplify calls for a "Shadow" nerf. The goal was to create an echo chamber so Kaito would start to sympathize with the idea that decisive action was needed. The emotional trigger was framed as "Don't you want to be a hero?" to push him toward taking matters into his own hands.

PHASE 3 — The Email:
We found a message in Kaito's inbox from shadow_balance_truth@protonmail.com. The mail, dated Day 26 at 18:32, claimed it had "been watching the data" and attached a supposedly balanced patch (balance_patch_v2.8_final.json). The tone pushed Kaito to act, suggesting the team wouldn't listen and that sometimes "heroes have to act alone." 

PHASE 4 — Execution Trigger:
Psychological pressure convinced Kaito he was making a personal, corrective choice. In reality, he was following The Fixer's script.

PHASE 5 — Observation:
The operation was monitored in real time. The Fixer logged company response patterns, mapped security gaps, and confirmed the detectives were active and effective.

RESULTS:
Kaito was terminated internally; the company's reputation took damage and security weaknesses were exposed. Unexpectedly, Kaito confessed, which altered how the Fixer adjusted future plans. The detective team was marked as a potential threat by the Fixer's observers.

NOTES:
Kaito was stronger-willed than expected. The detective shows clear pattern recognition ability. Kastor's analytical skills are noted as a risk. The Fixer plans to adapt for future operations.

NEXT PHASE:
Episode 2 will focus on the Ghost User case, increasing complexity to test the detectives further.

[Encrypted message fragment]
F-7743: "Phase 1 complete. Subjects identified. Moving to Phase 2. Stand by."
```

KASTOR: (reviewing recovered logs much later) "This was planned from the start..."

DETECTIVE: "Kaito was just... a test subject?"

KASTOR: "And so were we. Someone's been watching all along."

DETECTIVE: "The Fixer..."

KASTOR: "Now you understand why we need to find them."

🎵 [REVELATION +50 points] — The bigger picture revealed

🎉 MAJOR CELEBRATION — Case Closed

### Character Profiles (Updated)

- Detective (Player): Earnest, eager; straight-man reactions; growth from confused→confident.
- Kastor: Playful, random; sharp at key moments; catchphrases "Too easy~", "99%!".
- Maya Zhang: Perfectionist; panics then professional; values player trust.
- Kaito Nakamura (Noctis): Confident→insecure→honest; loves Shadow; motivation: to win.
- Lukas Schmidt: Kind, trusting; loyal; shocked by betrayal.
- Diego Torres (ShadowFan99): High energy; hates injustice; pure gamer.

### 전체 톤

- 친구 같은 AI 파트너 `Kastor`와 함께 사건을 해결하는 “데이터 탐정 훈련” 테마
- 각 장면마다 “미션 카드”와 “단서 수집 체크리스트” 제공
- 장면 끝마다 짧은 복습 퀴즈 또는 미니게임으로 몰입 유지
- 정답을 맞히면 즉시 보상(스탬프, XP, 힌트 토큰), 틀리면 힌트 버튼 안내

---

[Episode 1 — PDF 버전 (인쇄용 스크립트)](https://www.notion.so/Episode-1-PDF-3b8a369c651c4316baa819d89116dfbf?pvs=21)

[Interactive Casefile — Detective Mode](https://www.notion.so/Interactive-Casefile-Detective-Mode-9ae90bdf94914adf885e880ad0f31b54?pvs=21)