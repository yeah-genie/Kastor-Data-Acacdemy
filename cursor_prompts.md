# Cursor AI Development Prompts
## Kastor Data Academy - Investigation Dashboard

---

## 🎯 프로젝트 개요 (먼저 이걸 Cursor에게 설명)

```
I'm building an educational detective game called "Kastor Data Academy" 
where players investigate data breaches and cyber crimes alongside an AI assistant named Kastor.

Target Audience: 15-25 years old
Platform: Web (React), responsive for PC and mobile
Theme: Cyber detective investigation dashboard
Style: Modern, professional, slightly playful

The game uses a "Detective Dashboard" interface with multiple views:
- 💬 Chat View: Conversation with Kastor and team members
- 📊 Data View: Interactive data analysis and log examination  
- 🗂️ Files View: Evidence collection and review
- 👥 Team View: Character profiles and relationship tracking

The gameplay is narrative-driven with interactive puzzles and choices.
```

---

## 📋 Phase 1: 프로젝트 초기 설정

### Prompt 1-1: 프로젝트 생성

```
Create a new React project for "Kastor Data Academy" with the following setup:

PROJECT STRUCTURE:
- Use Vite + React 18 + TypeScript
- Install these dependencies:
  - react-router-dom (routing)
  - styled-components (styling)
  - framer-motion (animations)
  - lucide-react (icons)
  - zustand (state management)

FOLDER STRUCTURE:
src/
├── components/
│   ├── layout/
│   ├── chat/
│   ├── data/
│   ├── files/
│   └── team/
├── pages/
│   ├── Dashboard.tsx
│   ├── Episode.tsx
│   └── CaseComplete.tsx
├── data/
│   ├── episodes/
│   │   └── episode4.json
│   └── characters.json
├── hooks/
├── utils/
├── types/
└── styles/
    ├── theme.ts
    └── GlobalStyles.ts

THEME CONFIGURATION (src/styles/theme.ts):
export const theme = {
  colors: {
    primary: '#2196F3',
    secondary: '#FF9800',
    success: '#4CAF50',
    danger: '#F44336',
    dark: '#1E1E1E',
    darkGray: '#2D2D2D',
    mediumGray: '#3D3D3D',
    lightGray: '#E0E0E0',
    white: '#FFFFFF',
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Noto Sans KR', sans-serif",
    mono: "'Fira Code', monospace",
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  }
};

Create all necessary configuration files (vite.config.ts, tsconfig.json, etc.)
```

### Prompt 1-2: TypeScript 타입 정의

```
Create comprehensive TypeScript types for the game in src/types/index.ts:

REQUIRED TYPES:

1. Character Type:
interface Character {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'active' | 'suspect' | 'cleared' | 'arrested';
  trustLevel: number; // 1-5
  background: string[];
  suspiciousActivity: string[];
  relatedEvidence: string[];
}

2. Evidence Type:
interface Evidence {
  id: string;
  type: 'document' | 'log' | 'email' | 'image' | 'video';
  title: string;
  content: any;
  dateCollected: string;
  relatedTo: string[]; // character IDs
  importance: 'low' | 'medium' | 'high' | 'critical';
  isNew: boolean;
}

3. Message Type:
interface Message {
  id: string;
  sender: string; // character ID or 'player'
  content: string;
  timestamp: string;
  type: 'text' | 'evidence' | 'system' | 'choice';
  attachments?: Evidence[];
  choices?: Choice[];
}

4. Choice Type:
interface Choice {
  id: string;
  text: string;
  nextScene?: string;
  consequence?: {
    relationshipChange?: { [characterId: string]: number };
    evidenceUnlock?: string[];
    sceneUnlock?: string[];
  };
}

5. Scene Type:
interface Scene {
  id: string;
  type: 'chat' | 'data' | 'files' | 'team' | 'interactive';
  title: string;
  messages?: Message[];
  dataContent?: any;
  interactiveContent?: any;
  nextScene?: string;
  requirements?: {
    evidence?: string[];
    choices?: string[];
  };
}

6. Episode Type:
interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  scenes: Scene[];
  characters: string[]; // character IDs
  evidence: Evidence[];
  learningObjectives: string[];
}

7. GameState Type:
interface GameState {
  currentEpisode: string;
  currentScene: string;
  unlockedScenes: string[];
  collectedEvidence: string[];
  madeChoices: string[];
  characterRelationships: { [characterId: string]: number };
  progress: number; // 0-100
  completedEpisodes: string[];
}

Export all types and create helper functions for type guards.
```

---

## 📋 Phase 2: 기본 레이아웃 구현

### Prompt 2-1: 메인 대시보드 레이아웃

```
Create the main Dashboard layout component (src/components/layout/Dashboard.tsx):

REQUIREMENTS:

1. TOP BAR:
   - Logo/Title: "🔍 Kastor Data Academy"
   - Current case title
   - Progress bar (0-100%)
   - Settings icon

2. NAVIGATION TABS (Bottom on mobile, Side on desktop):
   - 💬 Chat
   - 📊 Data
   - 🗂️ Files
   - 👥 Team
   - Active tab highlighted with primary color
   - Badge for new notifications

3. MAIN CONTENT AREA:
   - Swappable based on active tab
   - Smooth transitions (framer-motion)
   - Responsive padding

4. MOBILE BEHAVIOR:
   - Top bar fixed
   - Bottom navigation fixed
   - Content scrollable in between
   - Swipe gestures to switch tabs

5. DESKTOP BEHAVIOR:
   - Sidebar navigation (left)
   - Content area (right, fills remaining space)
   - Top bar spans full width

Use styled-components and theme.
Make it fully responsive.
Add smooth animations for tab switching.

Example structure:
- DashboardContainer (flexbox)
- TopBar (fixed)
- Sidebar (desktop only, fixed)
- ContentArea (scrollable)
- BottomNav (mobile only, fixed)
```

### Prompt 2-2: 탭 전환 시스템

```
Create a tab switching system with proper routing:

REQUIREMENTS:

1. Use React Router for URL-based tabs:
   - /dashboard (default to chat)
   - /dashboard/chat
   - /dashboard/data
   - /dashboard/files
   - /dashboard/team

2. Create TabContext for global tab state:
   - currentTab
   - setTab(tab)
   - tabHistory (for back navigation)
   - newNotifications (badge counts)

3. Implement smooth transitions:
   - Fade out old content
   - Fade in new content
   - Use framer-motion AnimatePresence

4. Add keyboard shortcuts:
   - Ctrl+1: Chat
   - Ctrl+2: Data
   - Ctrl+3: Files
   - Ctrl+4: Team

5. Mobile swipe gestures:
   - Swipe left/right to change tabs
   - Use touch events

Create reusable TabContainer component that handles all transitions.
```

---

## 📋 Phase 3: Chat View 구현

### Prompt 3-1: 채팅 인터페이스 기본

```
Create the Chat View component (src/components/chat/ChatView.tsx):

REQUIREMENTS:

1. MESSAGE LIST:
   - Scrollable message container
   - Auto-scroll to bottom on new message
   - Different styles for:
     * Kastor messages (left, blue bubble)
     * Player messages (right, gray bubble)
     * Other characters (left, colored by character)
     * System messages (center, subtle)

2. MESSAGE BUBBLE DESIGN:
   - Avatar icon (emoji or small image)
   - Character name above bubble
   - Timestamp (small, gray)
   - Message content
   - Rounded corners
   - Slight shadow
   - Max-width: 70% on desktop, 85% on mobile

3. MESSAGE TYPES:
   - Text message
   - Evidence attachment (card with icon + title)
   - System notification (centered, different style)
   - Typing indicator (animated dots)

4. INPUT AREA (bottom):
   - Text input field
   - Send button
   - Attachment button (for evidence)
   - Disabled when waiting for Kastor response

5. ANIMATIONS:
   - Messages fade in from bottom
   - Typing indicator bouncing dots
   - Smooth scroll behavior

Use styled-components and framer-motion.
Make it look like a modern messaging app (Discord/Slack style).
```

### Prompt 3-2: 선택지 시스템

```
Create an interactive choice system for the Chat View:

REQUIREMENTS:

1. CHOICE DISPLAY:
   - Show choices as large buttons below the last message
   - 2-4 choices typically
   - Each choice is a card with:
     * Choice text
     * Optional icon/emoji
     * Hover effect (scale slightly)
     * Click animation

2. CHOICE BEHAVIOR:
   - When clicked:
     * Display player's choice as a message
     * Disable other choices
     * Trigger next scene/response
     * Update game state

3. CHOICE TYPES:
   - Standard (just text)
   - Consequence indicator (show relationship impact with icon)
   - Timed choice (countdown timer)
   - Required evidence (grayed out if not collected)

4. VISUAL DESIGN:
   - Rounded rectangle buttons
   - Border: 2px solid primary color
   - Hover: Fill with primary color
   - Disabled: Gray, with lock icon

5. MOBILE OPTIMIZATION:
   - Stack vertically
   - Full width buttons
   - Easy tap targets (min 44px height)

Create ChoiceButton component that handles all choice types.
Add animations for appearing and selection.
```

### Prompt 3-3: 증거 첨부 시스템

```
Create an evidence attachment system in Chat:

REQUIREMENTS:

1. EVIDENCE CARD IN CHAT:
   - Appears as an embedded card within message
   - Shows:
     * Evidence icon (based on type)
     * Evidence title
     * "View" button
   - Click to open in Files view

2. KASTOR SHARING EVIDENCE:
   - System message: "💡 Kastor shared evidence"
   - Evidence card appears
   - Badge appears on Files tab
   - Evidence auto-saved to collection

3. EVIDENCE VIEWER MODAL:
   - Opens when clicking evidence card
   - Shows full content
   - Close button
   - Navigate between evidence (if multiple)

4. TYPES OF EVIDENCE DISPLAY:
   - Document: Scrollable text
   - Log file: Syntax-highlighted code
   - Email: Email format with headers
   - Image: Full-size image viewer
   - Data: Table or chart

5. ANIMATIONS:
   - Evidence card slides in
   - Modal fades in with backdrop
   - Smooth transitions

Create EvidenceCard and EvidenceModal components.
Style them to look professional but not boring.
```

---

## 📋 Phase 4: Data View 구현

### Prompt 4-1: 데이터 분석 인터페이스

```
Create the Data Analysis View (src/components/data/DataView.tsx):

REQUIREMENTS:

1. FILTER CONTROLS (Top section):
   - Dropdown selects for:
     * User filter (All, specific users)
     * Time range (All, Today, Last week, Custom)
     * Action type (All, Read, Write, Download, Delete)
   - Search bar
   - Apply Filters button
   - Reset button

2. DATA TABLE:
   - Column headers: Date | Time | User | Action | Location
   - Sortable columns (click header to sort)
   - Row hover effect (highlight)
   - Alternate row colors for readability
   - Suspicious rows marked (red/orange indicator)
   - Pagination (50 rows per page)

3. PATTERN DETECTION ALERT:
   - When pattern detected, show alert box above table:
     * Icon: ⚠️ or 🚨
     * Title: "Pattern Detected!"
     * Description: Brief explanation
     * Action buttons: "Analyze" | "Ask Kastor"
   - Animated entrance (slide down + bounce)

4. INTERACTIVE FEATURES:
   - Click row to see details (expand inline)
   - Select multiple rows to compare
   - Export filtered data (download as CSV)
   - Highlight search terms

5. MOBILE OPTIMIZATION:
   - Horizontal scroll for table
   - Sticky first column (User)
   - Condensed view (hide less important columns)
   - Tap row to see full details in modal

Use react-table or similar library for table functionality.
Style like a professional data analysis tool.
Add loading states and empty states.
```

### Prompt 4-2: 인터랙티브 데이터 퍼즐

```
Create an interactive log analysis puzzle for Data View:

REQUIREMENTS:

1. PUZZLE TYPE: "Find the Pattern"
   - Player must identify suspicious pattern in data
   - Example: Multiple late-night accesses from same account
   
2. PUZZLE INTERFACE:
   - Data table (from DataView)
   - Hint button (reveals clues progressively)
   - "Submit Finding" button
   - Pattern counter: "X patterns found (need Y)"

3. INTERACTION:
   - Player uses filters to narrow down data
   - When correct pattern found, system recognizes it
   - Visual feedback: Matching rows glow/highlight
   - Success modal with points earned

4. HINT SYSTEM:
   - Hint 1: Vague direction ("Check user activity")
   - Hint 2: More specific ("Look at night-time access")
   - Hint 3: Almost gives away ("Filter by 2-4 AM")
   - Each hint costs points

5. KASTOR ASSISTANCE:
   - Click "Ask Kastor" at any time
   - Kastor gives hint in chat style
   - Kastor celebrates when player finds pattern

6. SUCCESS FEEDBACK:
   - Confetti animation (optional)
   - Success sound effect
   - Points display (+50 XP)
   - Evidence unlocked notification
   - Auto-navigate to next scene

Create PuzzleContainer component that wraps DataView.
Make it feel like a detective mini-game.
Balance difficulty: challenging but not frustrating.
```

---

## 📋 Phase 5: Files View 구현

### Prompt 5-1: 증거 파일 브라우저

```
Create the Evidence Files View (src/components/files/FilesView.tsx):

REQUIREMENTS:

1. FOLDER STRUCTURE (Left sidebar or top):
   - 📂 Episode 4: The Data Breach
     ├─ 📂 Suspects
     ├─ 📂 Digital Evidence
     ├─ 📂 Communications
     └─ 📂 Timeline

2. FILE LIST (Main area):
   - Grid or list view toggle
   - Each file shows:
     * Icon (based on type)
     * Filename
     * Date added
     * Importance badge (color-coded)
     * NEW badge if recently added
   - Sort by: Name, Date, Importance
   - Filter by: Type, Importance

3. FILE PREVIEW:
   - Click file to open preview panel (right side)
   - Shows:
     * Full filename
     * Metadata (date, type, related characters)
     * Preview of content
     * "Related Evidence" section (links to other files)
     * Tags
   - Actions:
     * Mark as important (⭐)
     * Add note
     * Share with Kastor

4. FILE TYPES & ICONS:
   - 📄 Document (.txt, .doc)
   - 📊 Data (.csv, .log)
   - 📧 Email (.eml)
   - 🖼️ Image (.jpg, .png)
   - 🎥 Video (.mp4)
   - 🔒 Encrypted (needs unlocking)

5. SEARCH FUNCTIONALITY:
   - Search bar at top
   - Search by filename or content
   - Highlight matching text
   - Filter search results

6. MOBILE OPTIMIZATION:
   - Folder tree collapsible
   - File list takes full width
   - Tap file to open full-screen preview
   - Swipe to close preview

Style like a modern file explorer (macOS Finder / Windows Explorer).
Use smooth transitions for folder opening/closing.
```

### Prompt 5-2: 증거 상세 뷰어

```
Create detailed evidence viewers for each type:

REQUIREMENTS:

1. DOCUMENT VIEWER:
   - Text content in readable font
   - Line numbers (for logs)
   - Syntax highlighting (for code)
   - Search within document
   - Copy text button
   - Print/download option

2. EMAIL VIEWER:
   - Email headers (From, To, Subject, Date)
   - Email body (formatted)
   - Attachments section (if any)
   - Reply chain (if applicable)
   - Flag suspicious elements (red highlight)

3. IMAGE VIEWER:
   - Full-size image display
   - Zoom controls (+ / -)
   - Pan (drag to move)
   - Reset view button
   - Image metadata (resolution, date taken)

4. LOG FILE VIEWER:
   - Monospace font
   - Line numbers
   - Syntax highlighting (JSON, XML, etc.)
   - Filter by log level (INFO, WARN, ERROR)
   - Jump to line
   - Export filtered view

5. DATA TABLE VIEWER:
   - CSV/Excel rendered as table
   - Column sorting
   - Row filtering
   - Chart generation option (simple bar/line chart)
   - Export as CSV

6. ANNOTATION SYSTEM:
   - Player can add notes to any evidence
   - Highlight important sections
   - Add bookmarks
   - Notes saved to game state

Create specialized viewer components for each type.
Use code syntax highlighter (e.g., Prism.js or Highlight.js).
Make viewers feel like professional investigation tools.
```

---

## 📋 Phase 6: Team View 구현

### Prompt 6-1: 캐릭터 프로필 인터페이스

```
Create the Team/Character View (src/components/team/TeamView.tsx):

REQUIREMENTS:

1. CHARACTER LIST (Left side or top):
   - Card-based layout
   - Each card shows:
     * Avatar/emoji
     * Name
     * Role
     * Status badge (Suspect, Cleared, etc.)
     * Trust level (⭐⭐⭐☆☆)
   - Click to view full profile
   - Sort by: Name, Status, Trust Level

2. CHARACTER PROFILE (Main area):
   - Large avatar at top
   - Name and role
   - Status indicator (color-coded)
   - Trust level visualization (progress bar or stars)
   
3. PROFILE TABS:
   - [Background] Personal info, history
   - [Timeline] Activity timeline
   - [Evidence] Related evidence list
   - [Relationships] Connections to others

4. BACKGROUND TAB:
   - Key information (bullet points):
     * Position at company
     * Years employed
     * Personal situation
     * Known facts
   - Suspicious activity section (red/orange)
   - Notes section (player can add)

5. TIMELINE TAB:
   - Vertical timeline of character's actions
   - Each event shows:
     * Time/date
     * Action description
     * Related evidence link
     * Suspicious indicator
   - Events color-coded by importance

6. EVIDENCE TAB:
   - List of evidence related to this character
   - Click to open in Files view
   - Group by type
   - Highlight most important

7. RELATIONSHIPS TAB:
   - Network diagram (simple)
   - Shows connections to other characters
   - Line thickness = relationship strength
   - Interactive: Click connection to see details

8. MOBILE OPTIMIZATION:
   - Character list: Horizontal scroll cards
   - Profile: Full screen when selected
   - Tabs: Horizontal scrollable
   - Back button to return to list

Style like a professional investigation board.
Use graph library (e.g., react-force-graph) for relationships.
Make it feel like a detective's case file.
```

### Prompt 6-2: 관계도 시각화

```
Create an interactive relationship network for Team View:

REQUIREMENTS:

1. NETWORK GRAPH:
   - Nodes = Characters (circles with avatars)
   - Edges = Relationships (lines between nodes)
   - Central node = Currently selected character
   - Related nodes = Others they interact with

2. NODE DESIGN:
   - Circle with character avatar/emoji
   - Name label below
   - Color based on status:
     * Green: Cleared
     * Yellow: Under investigation  
     * Red: Suspect
     * Gray: Neutral
   - Size based on importance
   - Glow effect when suspicious

3. EDGE DESIGN:
   - Line connecting nodes
   - Thickness = strength of connection
   - Color = type of relationship:
     * Blue: Coworkers
     * Green: Friends
     * Red: Conflict
     * Yellow: Suspicious connection
   - Label on hover (describes relationship)

4. INTERACTIONS:
   - Click node: Open that character's profile
   - Hover node: Highlight connections
   - Hover edge: Show relationship details
   - Drag nodes: Rearrange layout
   - Zoom: Mouse wheel or pinch
   - Pan: Drag background

5. LAYOUT OPTIONS:
   - Force-directed (default, organic)
   - Radial (selected character at center)
   - Hierarchical (by company structure)
   - Toggle layout button

6. SUSPICION HIGHLIGHTING:
   - Toggle "Show Suspicious Connections Only"
   - Highlights red edges and nodes
   - Fades out normal relationships

7. MOBILE:
   - Simplified graph
   - Touch gestures for zoom/pan
   - Tap node to select

Use react-force-graph-2d or similar library.
Make it visually striking but not overwhelming.
Animate transitions between layouts.
```

---

## 📋 Phase 7: 게임 로직 & 상태 관리

### Prompt 7-1: 게임 상태 관리 (Zustand)

```
Create game state management using Zustand (src/store/gameStore.ts):

REQUIREMENTS:

1. STATE STRUCTURE:
   - currentEpisode: string
   - currentScene: string
   - sceneHistory: string[]
   - collectedEvidence: Evidence[]
   - characterRelationships: Map<string, number>
   - madeChoices: Choice[]
   - unlockedScenes: string[]
   - gameProgress: number (0-100)
   - currentTab: string

2. ACTIONS:
   - startEpisode(episodeId)
   - goToScene(sceneId)
   - addEvidence(evidence)
   - makeChoice(choice)
   - updateRelationship(characterId, change)
   - unlockScene(sceneId)
   - saveProgress()
   - loadProgress()
   - resetGame()

3. COMPUTED VALUES:
   - getAvailableScenes()
   - getCharacterTrustLevel(characterId)
   - hasEvidence(evidenceId)
   - canAccessScene(sceneId)

4. PERSISTENCE:
   - Auto-save to localStorage every 30 seconds
   - Save on major actions (choice made, evidence collected)
   - Load on app startup
   - Multiple save slots support

5. MIDDLEWARE:
   - Logger (console.log state changes in dev mode)
   - Persist (localStorage sync)
   - DevTools (Redux DevTools integration)

Create clean, typed Zustand store.
Add helper hooks for common operations.
Document all actions with JSDoc comments.
```

### Prompt 7-2: 씬 전환 시스템

```
Create a scene progression system (src/utils/sceneManager.ts):

REQUIREMENTS:

1. SCENE LOADING:
   - loadScene(sceneId): Load scene data from JSON
   - Validate scene requirements (evidence, choices)
   - Preload next scene for smooth transition

2. SCENE TRANSITION:
   - transitionToScene(sceneId, transitionType)
   - Transition types:
     * fade (default)
     * slide-left (moving forward)
     * slide-right (going back)
     * zoom (important reveals)
   - Update game state
   - Trigger animations

3. CONDITIONAL SCENES:
   - checkRequirements(scene): Returns boolean
   - Requirements can be:
     * Evidence collected: ["evidence-1", "evidence-2"]
     * Choices made: ["choice-1"]
     * Character trust: { "kastor": 3 }
   - Alternative scenes if requirements not met

4. BRANCHING LOGIC:
   - getNextScene(currentScene, choice)
   - Handle choice consequences
   - Update relationships
   - Unlock new scenes
   - Award points

5. SCENE HISTORY:
   - Track visited scenes
   - Enable back navigation (where appropriate)
   - Prevent re-visiting completed scenes

6. AUTO-SAVE TRIGGERS:
   - Before scene transition
   - After major choice
   - On evidence collection

Create SceneManager class with all methods.
Handle edge cases (invalid scene, missing requirements).
Add error boundaries for safety.
```

### Prompt 7-3: 진행도 & 성취 시스템

```
Create progress tracking and achievement system:

REQUIREMENTS:

1. PROGRESS CALCULATION:
   - Track: Scenes visited, Evidence collected, Choices made
   - Calculate overall episode progress (0-100%)
   - Display in progress bar
   - Update in real-time

2. ACHIEVEMENTS/MILESTONES:
   - "First Evidence" - Collect your first evidence
   - "Detective's Eye" - Find a hidden pattern
   - "Truth Seeker" - Make correct accusation
   - "Speed Runner" - Complete episode under time
   - "Perfectionist" - Collect all evidence
   
3. ACHIEVEMENT POPUP:
   - Toast notification when earned
   - Shows achievement icon + title
   - Brief description
   - Points/XP earned
   - Sound effect (optional)

4. POINTS SYSTEM:
   - Earn points for:
     * Correct deductions (+50)
     * Finding evidence (+25)
     * Making good choices (+10-30)
     * Completing puzzles (+50-100)
   - Lose points for:
     * Using hints (-10 each)
     * Wrong accusations (-30)
   
5. STATISTICS TRACKING:
   - Time spent on episode
   - Number of hints used
   - Evidence found (X/total)
   - Choices made
   - Accuracy rate

6. END-OF-EPISODE SUMMARY:
   - Show all statistics
   - Grade: S / A / B / C / D
   - Total points
   - Achievements earned
   - Compare with average player

Create AchievementManager and ProgressTracker classes.
Design nice achievement popup with animations.
Store all data in gameStore.
```

---

## 📋 Phase 8: 에피소드 4 데이터 구조

### Prompt 8-1: JSON 데이터 포맷

```
Create Episode 4 data structure in JSON format (src/data/episodes/episode4.json):

STRUCTURE:

{
  "id": "episode-4",
  "number": 4,
  "title": "The Data Breach",
  "description": "1.2TB of company data has been stolen. Find the culprit.",
  "difficulty": 5,
  "estimatedTime": "60-75 minutes",
  "thumbnail": "/images/episodes/ep4-thumbnail.png",
  
  "characters": [
    "kastor",
    "marcus-chen",
    "maya-zhang",
    "camille-beaumont",
    "isabella-torres",
    "alex-reeves",
    "olivia-brennan"
  ],
  
  "scenes": [
    {
      "id": "ep4-opening",
      "type": "cinematic",
      "title": "3:00 AM - Security Breach",
      "autoPlay": true,
      "messages": [
        {
          "id": "msg-1",
          "sender": "system",
          "content": "Legend Arena HQ\nSecurity Operations Center\n3:00 AM",
          "timestamp": "03:00:00",
          "type": "system"
        },
        {
          "id": "msg-2",
          "sender": "camille",
          "content": "Just a quiet night... nothing unusual...",
          "timestamp": "03:00:47",
          "type": "text"
        },
        {
          "id": "msg-3",
          "sender": "system",
          "content": "🚨 WARNING: LARGE DATA TRANSFER DETECTED",
          "timestamp": "03:00:48",
          "type": "alert"
        }
        // ... more messages
      ],
      "nextScene": "ep4-emergency-meeting"
    },
    
    {
      "id": "ep4-emergency-meeting",
      "type": "chat",
      "title": "Emergency Meeting",
      "messages": [
        // Messages with choices
      ],
      "choices": [
        {
          "id": "choice-1",
          "text": "Let's check the system logs first",
          "nextScene": "ep4-log-analysis",
          "consequence": {
            "relationshipChange": {
              "camille": +1
            }
          }
        }
      ]
    },
    
    {
      "id": "ep4-log-analysis",
      "type": "data",
      "title": "Log Analysis",
      "dataContent": {
        "type": "log-table",
        "data": [
          // Log entries
        ],
        "puzzle": {
          "type": "find-pattern",
          "correctPattern": "isabella-late-night-access",
          "hints": [
            "Try filtering by time of day",
            "Look for repeated activity from same user",
            "Check access between 2-4 AM"
          ]
        }
      },
      "nextScene": "ep4-pattern-found"
    }
    
    // ... more scenes
  ],
  
  "evidence": [
    {
      "id": "evidence-server-log",
      "type": "log",
      "title": "Server Access Log",
      "content": "...",
      "dateCollected": "auto",
      "importance": "critical",
      "relatedTo": ["isabella-torres"],
      "unlockedBy": "ep4-emergency-meeting"
    }
    // ... more evidence
  ],
  
  "achievements": [
    {
      "id": "ep4-complete",
      "title": "Data Detective",
      "description": "Complete Episode 4",
      "icon": "🏆",
      "points": 500
    }
  ]
}

Create comprehensive JSON with all scenes, dialogue, choices, and evidence.
Make it easy to add/edit content.
```

---

## 📋 Phase 9: 애니메이션 & 폴리쉬

### Prompt 9-1: 페이지 전환 애니메이션

```
Add smooth animations using Framer Motion:

REQUIREMENTS:

1. TAB SWITCHING:
   - Fade out old tab (duration: 200ms)
   - Fade in new tab (duration: 300ms, delay: 100ms)
   - Slide in from direction based on tab order

2. MESSAGE ANIMATIONS:
   - New messages: Fade + slide from bottom
   - Typing indicator: Bouncing dots
   - Evidence cards: Scale + fade in

3. SCENE TRANSITIONS:
   - Fade to black
   - Show loading spinner (optional)
   - Fade in new scene
   - Total duration: ~1 second

4. MICRO-INTERACTIONS:
   - Buttons: Scale on hover (1.05x)
   - Evidence cards: Lift on hover (shadow increase)
   - Choices: Slight bounce on appear
   - Notifications: Slide in from top/side

5. LOADING STATES:
   - Skeleton screens for data loading
   - Pulse animation
   - Smooth transition to real content

6. SUCCESS FEEDBACK:
   - Checkmark animation (draw SVG path)
   - Gentle bounce
   - Fade out after 2 seconds

7. ERROR STATES:
   - Shake animation for invalid input
   - Red flash for errors
   - Cross icon animation

Create reusable animation variants for Framer Motion.
Keep animations subtle and professional.
Ensure 60fps performance.
Add reduced motion support for accessibility.
```

### Prompt 9-2: 사운드 효과 (선택사항)

```
Add sound effects for better feedback (optional):

REQUIREMENTS:

1. SOUND EVENTS:
   - Message received: Gentle "pop"
   - Message sent: Soft "whoosh"
   - Evidence collected: "ding" or chime
   - Pattern detected: Alert sound
   - Choice selected: Click/tap sound
   - Achievement earned: Success fanfare
   - Error: Subtle "error" beep

2. SOUND MANAGER:
   - Create SoundManager class
   - Preload all sounds
   - Volume control (0-100)
   - Mute toggle
   - Play/stop methods

3. SOUND LIBRARY:
   - Use Web Audio API or Howler.js
   - Keep sounds small (< 50KB each)
   - Format: MP3 or OGG

4. SETTINGS:
   - User can toggle sounds on/off
   - User can adjust volume
   - Save preference to localStorage

5. ACCESSIBILITY:
   - Don't rely solely on sound for feedback
   - Always pair sound with visual feedback
   - Respect user's system sound settings

Find free sound effects from:
- freesound.org
- zapsplat.com
- mixkit.co

Keep sounds subtle and non-intrusive.
Make it optional (can be muted).
```

---

## 📋 Phase 10: 반응형 & 접근성

### Prompt 10-1: 모바일 최적화

```
Optimize all components for mobile devices:

REQUIREMENTS:

1. RESPONSIVE BREAKPOINTS:
   - Mobile: < 768px
   - Tablet: 768px - 1024px  
   - Desktop: > 1024px

2. LAYOUT CHANGES:
   MOBILE:
   - Bottom tab navigation (fixed)
   - Single column layout
   - Full-width content
   - Collapsible sections
   - Large tap targets (min 44px)
   
   TABLET:
   - Side navigation optional
   - Two-column layout where appropriate
   - Larger text
   
   DESKTOP:
   - Full side navigation
   - Multi-column layouts
   - More info on screen

3. TOUCH INTERACTIONS:
   - Swipe to switch tabs
   - Pull to refresh (optional)
   - Long press for context menu
   - Pinch to zoom (images)

4. PERFORMANCE:
   - Lazy load images
   - Virtualize long lists
   - Debounce search input
   - Minimize re-renders

5. MOBILE-SPECIFIC:
   - Hide unnecessary elements
   - Simplify complex visualizations
   - Use bottom sheets instead of modals
   - Sticky headers/footers

Test on actual devices or Chrome DevTools device emulation.
Ensure smooth 60fps scrolling.
```

### Prompt 10-2: 접근성 (a11y)

```
Implement accessibility features:

REQUIREMENTS:

1. KEYBOARD NAVIGATION:
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Escape to close modals
   - Arrow keys for tab switching
   - Skip to content link

2. SCREEN READER SUPPORT:
   - Semantic HTML (nav, main, article, etc.)
   - ARIA labels where needed
   - ARIA live regions for dynamic content
   - Alt text for images
   - Descriptive link text

3. FOCUS MANAGEMENT:
   - Visible focus indicators
   - Focus trap in modals
   - Restore focus after modal close
   - Skip navigation option

4. COLOR CONTRAST:
   - Minimum 4.5:1 for normal text
   - 3:1 for large text
   - Don't rely solely on color
   - Test with color blindness simulator

5. REDUCED MOTION:
   - Respect prefers-reduced-motion
   - Disable animations if preferred
   - Keep essential animations only

6. TEXT SCALING:
   - Support browser zoom up to 200%
   - Use rem/em instead of px for font sizes
   - Ensure layout doesn't break

7. ERROR HANDLING:
   - Clear error messages
   - Associate errors with form fields
   - Announce errors to screen readers

Use eslint-plugin-jsx-a11y for linting.
Test with screen reader (NVDA/VoiceOver).
Run Lighthouse accessibility audit.
```

---

## 📋 Phase 11: 테스트 & 디버깅

### Prompt 11-1: 개발 도구

```
Add development and debugging tools:

REQUIREMENTS:

1. SCENE DEBUGGER (Dev only):
   - Panel showing current scene info
   - Button to jump to any scene
   - Display current game state
   - Test different choices
   - Toggle hotkey: Ctrl+Shift+D

2. CONSOLE COMMANDS:
   - window.game.gotoScene(sceneId)
   - window.game.addEvidence(evidenceId)
   - window.game.unlockAll()
   - window.game.resetProgress()
   - window.game.getState()

3. ERROR BOUNDARIES:
   - Catch React errors gracefully
   - Show friendly error message
   - Log errors to console
   - Offer "Reset" option

4. LOGGING:
   - Log important events in dev mode
   - Scene transitions
   - Choice selections
   - State changes
   - Evidence collection

5. PERFORMANCE MONITORING:
   - React Profiler
   - Measure render times
   - Identify slow components
   - Optimize re-renders

Create DevToolsPanel component (only in dev mode).
Add keyboard shortcuts for quick testing.
```

---

## 📋 Phase 12: 빌드 & 배포

### Prompt 12-1: 프로덕션 빌드

```
Prepare production build:

REQUIREMENTS:

1. BUILD OPTIMIZATION:
   - Code splitting by route
   - Tree shaking
   - Minification
   - Image optimization
   - Remove dev-only code

2. ENVIRONMENT VARIABLES:
   - DEV vs PROD modes
   - API endpoints (if any)
   - Feature flags

3. BUILD SCRIPTS (package.json):
   - npm run dev (development)
   - npm run build (production build)
   - npm run preview (preview build)
   - npm run test (if tests added)

4. ASSET OPTIMIZATION:
   - Compress images (WebP format)
   - Bundle fonts
   - Optimize SVGs
   - Lazy load non-critical assets

5. SERVICE WORKER (optional):
   - Cache static assets
   - Offline support
   - Background sync

Configure Vite for optimal production build.
Target modern browsers (ES2020+).
Analyze bundle size with rollup-plugin-visualizer.
```

### Prompt 12-2: 배포 가이드

```
Create deployment configuration:

DEPLOYMENT OPTIONS:

1. STATIC HOSTING (Recommended):
   - Vercel
   - Netlify  
   - GitHub Pages
   - Cloudflare Pages

2. VERCEL DEPLOYMENT:
   - Install Vercel CLI: npm i -g vercel
   - Run: vercel
   - Follow prompts
   - Auto-deploys on git push

3. NETLIFY DEPLOYMENT:
   - Connect GitHub repo
   - Build command: npm run build
   - Publish directory: dist
   - Auto-deploys on push

4. CUSTOM DOMAIN (optional):
   - Configure DNS
   - Add domain to hosting platform
   - Enable HTTPS

5. CI/CD (optional):
   - GitHub Actions workflow
   - Auto-test on PR
   - Auto-deploy on merge to main

Create deployment guide in README.md.
Include environment variable setup.
Document custom domain configuration.
```

---

## 🎯 최종 체크리스트

### Prompt: 완성도 확인

```
Final checklist before launch:

FUNCTIONALITY:
□ All scenes load correctly
□ Choices work and branch properly
□ Evidence collection works
□ Data analysis puzzle works
□ Character profiles display correctly
□ Progress saves and loads
□ Navigation between tabs smooth

VISUAL POLISH:
□ All animations smooth (60fps)
□ Responsive on mobile/tablet/desktop
□ No visual glitches or layout breaks
□ Loading states for all async operations
□ Empty states for all collections
□ Error states handled gracefully

CONTENT:
□ All text proofread (no typos)
□ All evidence has content
□ All characters have profiles
□ All scenes have next scene
□ Tutorial/onboarding complete

PERFORMANCE:
□ Initial load < 3 seconds
□ Smooth scrolling
□ No memory leaks
□ Optimized images
□ Code split by route

ACCESSIBILITY:
□ Keyboard navigation works
□ Screen reader compatible
□ Color contrast passes WCAG AA
□ Focus indicators visible
□ Alt text on images

TESTING:
□ Test on Chrome
□ Test on Firefox
□ Test on Safari
□ Test on mobile Chrome
□ Test on mobile Safari
□ Test with screen reader
□ Test keyboard-only navigation

Run through entire Episode 4 playthrough.
Fix any bugs found.
Get feedback from test users.
```

---

## 📝 추가 프롬프트 (필요시)

### Kastor 캐릭터 성격 구현

```
Implement Kastor's personality in dialogue:

KASTOR'S TRAITS:
1. Enthusiastic but slightly oblivious
2. Makes dad jokes at inappropriate times
3. Very smart but socially awkward
4. Genuinely wants to help
5. Sometimes misses social cues
6. Compares everything to numbers/data
7. Celebrates small victories loudly

DIALOGUE EXAMPLES:
- "Big news! We found... wait, what did we find again?"
- "This is like finding a needle in a haystack! Except the haystack is data. And the needle is also data. Data everywhere!"
- "You did it! High five! Oh wait, I don't have hands. Virtual high five!"
- "On a scale of 1 to 10, this is definitely a... *calculating* ...7.3!"

When writing Kastor's dialogue:
- Add mild confusion sometimes
- Insert random facts
- Make puns (but not too many)
- Be genuinely excited about evidence
- Occasionally miss the gravity of situations

Make him endearing, not annoying.
Balance humor with helpfulness.
```

---

## 🚀 사용 방법

1. **순서대로 Cursor에게 프롬프트 입력**
   - Phase 1부터 시작
   - 각 프롬프트를 하나씩 완료 후 다음으로

2. **프롬프트 사용 팁**
   - 전체 복붙해도 OK
   - 원하는 부분만 골라서 수정 가능
   - "위 내용 중 X 부분을 Y로 바꿔줘" 추가 요청 가능

3. **문제 발생시**
   - Cursor가 이해 못하면: 더 간단하게 나눠서 요청
   - 버그 발생시: "위 코드에서 에러 발생. 에러 메시지: [에러]"
   - 스타일 수정: "X 컴포넌트의 색상을 Y로 바꿔줘"

4. **점진적 개발**
   - 한 번에 다 만들려고 하지 말기
   - Phase별로 테스트하면서 진행
   - 작동하는 버전을 계속 유지

---

## 📚 참고 자료

**React + TypeScript:**
- React 공식 문서: react.dev
- TypeScript 핸드북: typescriptlang.org/docs

**Styling:**
- Styled Components: styled-components.com
- Framer Motion: framer.com/motion

**Tools:**
- Vite: vitejs.dev
- Zustand: github.com/pmndrs/zustand

**Design Inspiration:**
- Dribbble: Search "detective dashboard"
- Behance: Search "investigation interface"

---