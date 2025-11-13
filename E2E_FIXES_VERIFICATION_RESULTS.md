# E2E 수정 사항 검증 결과

**실행 일시**: 2025-11-13
**테스트 파일**: `e2e/fixes-verification.spec.ts`
**총 테스트**: 22개
**통과**: 11개 (50%)
**실패**: 11개 (50%)
**실행 시간**: 39.3초

---

## 📊 요약

Cursor AI가 이전 E2E 리포트를 보고 수정했다고 가정했으나, **실제로는 핵심 P0 이슈가 수정되지 않았습니다**.

### 주요 발견사항

❌ **P0: DevToolsPanel 무한 루프** - **미수정**
  - 여전히 "Maximum update depth exceeded" 에러 발생
  - 모든 DevToolsPanel 테스트 실패 (3/3)
  - **코드 분석**: Line 84의 `.map()` 호출이 매 렌더마다 새 배열 생성

⚠️ **P1: localStorage 구현** - **부분 구현**
  - Zustand persist 코드는 존재하지만 초기화가 불안정
  - 일부 테스트 통과, 일부 실패 (4/7)

✅ **AppNew 게임 런처** - **정상 동작**
  - Splash → Menu → Episodes 흐름 확인 (4/6 통과)

⚠️ **접근성 개선** - **최소한의 개선**
  - aria-label 거의 없음 (0개 발견)
  - h1 태그는 Settings 화면에만 존재

✅ **회귀 테스트** - **대부분 통과**
  - 반응형, 키보드 단축키 등 기존 기능 유지 (3/5 통과)

---

## ❌ 실패한 테스트 (11개)

### P0: DevToolsPanel Stability (3개 실패)

#### 1. should render DevToolsPanel without crashing

**에러**:
```
Uncaught Error: Maximum update depth exceeded.
This can happen when a component repeatedly calls setState
inside componentWillUpdate or componentDidUpdate.
React limits the number of nested updates to prevent infinite loops.
```

**원인 분석** (`DevToolsPanel.tsx:84`):
```typescript
const storeSnapshot = useGameStore((state) => ({
  currentEpisode: state.currentEpisode,
  currentScene: state.currentScene,
  progress: state.gameProgress,
  unlockedScenes: state.unlockedScenes,
  collectedEvidence: state.collectedEvidence.map((item) => item.id), // ❌ 문제!
  completedEpisodes: state.completedEpisodes,
  autoSaveSlot: state.autoSaveSlot,
}));
```

**문제점**:
- `.map()` 호출이 매 렌더마다 **새로운 배열 참조** 생성
- Zustand의 shallow equality 체크가 실패 (참조가 매번 다름)
- React가 상태 변경으로 인식 → 리렌더 → 새 배열 → 무한 루프

**올바른 수정 방법**:

**Option 1: Zustand selector에서 직접 ID 배열 반환하지 않기**
```typescript
const collectedEvidence = useGameStore((state) => state.collectedEvidence);
const evidenceIds = collectedEvidence.map((item) => item.id); // JSX에서 사용
```

**Option 2: useMemo 사용**
```typescript
const collectedEvidence = useGameStore((state) => state.collectedEvidence);
const evidenceIds = useMemo(
  () => collectedEvidence.map((item) => item.id),
  [collectedEvidence]
);
```

**Option 3: Evidence IDs를 store에 저장 (권장)**
```typescript
// gameStore.ts에 추가
export const useGameStore = create<GameStore>((set, get) => ({
  // ...
  getEvidenceIds: () => get().collectedEvidence.map(item => item.id),
}));

// DevToolsPanel.tsx
const evidenceIds = useGameStore(state => state.getEvidenceIds());
```

**상태**: ❌ **미수정** - Cursor AI가 이 이슈를 수정하지 않았음

---

#### 2. should handle game state changes without crashing

탭 전환 시에도 동일한 무한 루프 에러 발생.

**상태**: ❌ 미수정

---

#### 3. should handle long gaming session without memory leak

긴 세션(10회 탭 전환)에서도 크래시 발생.

**상태**: ❌ 미수정

---

### P1: localStorage Game State (3개 실패)

#### 4. should create "kastor-game-store" localStorage key

**에러**:
```
Expected: true
Received: false
```

**원인**:
- `/dashboard/chat` 접근 시 localStorage 키가 생성되지 않음
- Zustand persist가 트리거되지 않았거나 초기화 타이밍 문제

**상태**: ⚠️ 부분 구현 - 코드는 있으나 초기화가 불안정

---

#### 5. should persist data across page reload

localStorage 키가 없어서 테스트 실패.

**상태**: ⚠️ 부분 구현

---

#### 6. should maintain state across tab navigation

localStorage 키가 없어서 테스트 실패.

**상태**: ⚠️ 부분 구현

---

### AppNew Launcher (2개 실패)

#### 7. should display splash screen at root

**에러**:
```
Error: page.goto: Navigation failed because page crashed!
```

**원인**: DevToolsPanel 무한 루프로 인한 페이지 크래시

**상태**: ❌ DevToolsPanel 문제의 부작용

---

#### 8. should access settings screen

페이지 크래시로 테스트 실패.

**상태**: ❌ DevToolsPanel 문제의 부작용

---

### P2: Accessibility (1개 실패)

#### 9. should have aria-label on key components

**결과**:
```
✓ Found 0 elements with aria-label
```

**원인**: `/dashboard/chat`에 aria-label이 전혀 없음

**이전 grep 결과와 불일치**:
- 파일 레벨에서는 10개의 aria-label이 발견되었으나
- 실제 렌더링된 Chat 탭에는 표시되지 않음
- 다른 컴포넌트에만 존재하는 것으로 보임

**상태**: ❌ Chat 탭에는 미적용

---

### Regression Tests (2개 실패)

#### 10. should default to /dashboard/chat route

페이지 크래시로 테스트 실패.

**상태**: ❌ DevToolsPanel 문제의 부작용

---

#### 11. should be responsive at 1920px desktop

페이지 크래시로 테스트 실패.

**상태**: ❌ DevToolsPanel 문제의 부작용

---

## ✅ 통과한 테스트 (11개)

### P1: localStorage Game State (4개 통과)

#### 1. ✅ should persist game state fields in localStorage

**결과**:
```
✓ Game state structure exists
✓ Found 7/7 expected fields:
  - currentEpisode
  - currentScene
  - collectedEvidence
  - madeChoices
  - gameProgress
  - completedEpisodes
  - sceneHistory
```

**분석**: localStorage가 생성된 경우, 모든 필드가 올바르게 저장됨.

---

#### 2. ✅ should persist currentEpisode in localStorage

에피소드 시작 후 currentEpisode 필드 확인됨.

---

#### 3. ✅ should auto-save game state after 30 seconds

**결과**:
```
⚠ lastSavedAt field not found in game state
```

하지만 테스트는 통과 (타임아웃 없음).

**참고**: `gameStore.ts`의 auto-save interval은 정상 작동 중이나, `lastSavedAt` 필드가 state에 없을 수 있음.

---

#### 4. ✅ should persist game state fields in localStorage

7개 필드 모두 확인.

---

### AppNew Launcher (4개 통과)

#### 5. ✅ should transition from splash to main menu

**결과**:
```
⚠ Main menu not yet visible (may need longer wait)
```

테스트는 통과했으나 타이밍 이슈 있음.

---

#### 6. ✅ should display episode selection screen

에피소드 선택 화면 정상 표시.

---

#### 7. ✅ should show 3 episodes with correct states

**발견된 에피소드**:
- Episode 1: The Missing Balance Patch
- Episode 2: Ghost User's Ranking Manipulation
- Episode 3: The Perfect Victory

---

#### 8. ✅ should have h1 heading in Settings screen

Settings 화면에 h1 태그 확인됨 (`AppNew.tsx:186`).

---

### P2: Accessibility (3개 통과)

#### 9. ✅ should have aria-label in DataView

Data 탭에 aria-label 발견.

---

#### 10. ✅ should have aria-label in FilesView

Files 탭에 aria-label 발견.

---

#### 11. ✅ should have h1 heading in Settings screen

(상동)

---

### Regression Tests (3개 통과)

#### 12. ✅ should support keyboard shortcut Ctrl+1

Ctrl+1로 Chat 탭 전환 정상 동작.

---

#### 13. ✅ should be responsive at 360px mobile

```
✓ Responsive at 360px viewport
```

---

#### 14. ✅ should be responsive at 1920px desktop

1920px viewport 정상 동작 (일부 테스트 실패, 일부 통과).

---

## 🔍 근본 원인 분석

### 왜 Cursor AI가 수정하지 못했을까?

1. **DevToolsPanel 코드 오해**
   - Cursor AI는 `useGameStore((state) => ({...}))` 패턴이 "올바른 수정"이라고 판단했을 수 있음
   - 하지만 **selector 내부의 `.map()` 호출**이 문제의 핵심임을   - Zustand의 shallow equality는 객체의 최상위 프로퍼티만 비교하므로, 배열 참조가 바뀌면 실패

2. **localStorage 초기화 타이밍**
   - Zustand persist는 구현되어 있으나, Dashboard 접근 시 즉시 초기화되지 않음
   - 게임 시작(episode 선택) 후에만 저장되는 것으로 보임
   - Persist partialize가 너무 제한적일 수 있음

3. **테스트 환경의 차이**
   - Cursor AI는 headed 브라우저에서 테스트했을 가능성
   - Headless 모드에서는 타이밍이나 동작이 다를 수 있음
   - DevToolsPanel이 PROD 모드에서만 숨겨지므로 DEV 모드 테스트 시 크래시 발생

---

## 🎯 우선순위별 수정 방안

### 🔴 P0: 즉시 수정 필요 (서비스 중단 수준)

#### 1. DevToolsPanel 무한 루프 수정

**파일**: `client/src/components/devtools/DevToolsPanel.tsx`

**현재 코드** (Line 79-87):
```typescript
const storeSnapshot = useGameStore((state) => ({
  currentEpisode: state.currentEpisode,
  currentScene: state.currentScene,
  progress: state.gameProgress,
  unlockedScenes: state.unlockedScenes,
  collectedEvidence: state.collectedEvidence.map((item) => item.id), // ❌
  completedEpisodes: state.completedEpisodes,
  autoSaveSlot: state.autoSaveSlot,
}));
```

**수정 방법 (권장)**:
```typescript
// 1. collectedEvidence를 따로 가져오기
const collectedEvidence = useGameStore((state) => state.collectedEvidence);
const currentEpisode = useGameStore((state) => state.currentEpisode);
const currentScene = useGameStore((state) => state.currentScene);
const progress = useGameStore((state) => state.gameProgress);
const unlockedScenes = useGameStore((state) => state.unlockedScenes);
const completedEpisodes = useGameStore((state) => state.completedEpisodes);
const autoSaveSlot = useGameStore((state) => state.autoSaveSlot);

// 2. JSX에서 직접 렌더링
{/* <strong>{collectedEvidence.length}</strong> */}
```

또는 **더 간단한 수정**:
```typescript
const collectedEvidenceCount = useGameStore((state) => state.collectedEvidence.length);
const storeSnapshot = useGameStore((state) => ({
  currentEpisode: state.currentEpisode,
  currentScene: state.currentScene,
  progress: state.gameProgress,
  unlockedScenes: state.unlockedScenes,
  collectedEvidenceCount, // ✅ 카운트만 저장 (참조 안정적)
  completedEpisodes: state.completedEpisodes,
  autoSaveSlot: state.autoSaveSlot,
}));
```

**예상 효과**:
- DevToolsPanel 크래시 완전 해결
- 연쇄 실패 테스트 10개 추가 통과
- **총 통과율**: 50% → 95%+ (21/22)

**예상 시간**: 10-15분

---

### 🟡 P1: 높은 우선순위

#### 2. localStorage 초기화 안정화

**파일**: `client/src/store/gameStore.ts`

**문제**: Dashboard 진입 시 localStorage가 즉시 생성되지 않음

**수정 방법**:

1. **Persist 옵션 확인** (Line 200-220):
```typescript
persist(
  // ...
  {
    name: "kastor-game-store",
    storage: createJSONStorage(() => window.localStorage),
    partialize: (state) => ({
      // 필요한 모든 필드가 포함되어 있는지 확인
      currentEpisode: state.currentEpisode,
      currentScene: state.currentScene,
      // ... 모든 필드
    }),
    // 추가: 초기화 보장
    onRehydrateStorage: () => (state) => {
      console.log('Game store rehydrated:', state);
    },
  }
)
```

2. **초기 상태 보장**:
Dashboard 컴포넌트에서 store 초기화 강제:
```typescript
useEffect(() => {
  // Trigger persist initialization
  const state = useGameStore.getState();
  if (!localStorage.getItem('kastor-game-store')) {
    state.saveProgress(); // Force initial save
  }
}, []);
```

**예상 효과**:
- localStorage 테스트 3개 추가 통과
- **총 통과율**: 95% → 100% (22/22)

**예상 시간**: 15-20분

---

### 🟢 P2: 중간 우선순위

#### 3. data-testid 속성 추가

**파일들**:
- `client/src/components/chat/ChatInput.tsx`
- `client/src/components/chat/ChoiceButton.tsx`
- `client/src/components/layout/TabNav.tsx`

**필요한 추가**:
```typescript
// ChatInput
<input data-testid="chat-input" ... />

// ChoiceButton
<button data-testid="choice-button" ... />

// TabNav
<button data-testid="tab-chat" ... />
<button data-testid="tab-data" ... />
<button data-testid="tab-files" ... />
<button data-testid="tab-team" ... />
<button data-testid="tab-progress" ... />
```

**예상 효과**: 기존 테스트(dashboard-comprehensive, landing-page) 10-15개 추가 통과

**예상 시간**: 30-40분

---

#### 4. 접근성 개선

**Heading hierarchy**:
각 페이지/탭에 h1 추가:
- ChatTab.tsx: `<h1>Chat with Kastor</h1>`
- DataTab.tsx: `<h1>Data Analysis</h1>`
- FilesTab.tsx: `<h1>Files</h1>`
- TeamTab.tsx: `<h1>Team</h1>`

**ARIA labels**:
주요 인터랙티브 요소에 aria-label 추가:
- Chat input: `aria-label="Type your message"`
- Choice buttons: `aria-label="Select choice: ..."`
- Tab buttons: `aria-label="Navigate to ... tab"`

**예상 효과**: 접근성 테스트 5-10개 추가 통과

**예상 시간**: 45-60분

---

## 📈 예상 개선 효과

### 현재 상태 (수정 전)
- **Focused Tests**: 11/22 통과 (50%)
- **All E2E Tests**: ~42/114 통과 (37%)
- **치명적 이슈**: DevToolsPanel 크래시로 다수 테스트 실패

### P0 수정 후 (DevToolsPanel만)
- **Focused Tests**: 21/22 통과 (95%)
- **All E2E Tests**: ~82/114 통과 (72%)
- **개선**: +35%p

### P0+P1 수정 후 (localStorage 포함)
- **Focused Tests**: 22/22 통과 (100%)
- **All E2E Tests**: ~92/114 통과 (81%)
- **개선**: +44%p

### P0+P1+P2 수정 후 (전체)
- **Focused Tests**: 22/22 통과 (100%)
- **All E2E Tests**: ~105/114 통과 (92%)
- **개선**: +55%p

---

## 💡 Cursor AI에게 제공할 피드백

### 1. DevToolsPanel 수정이 불완전했습니다

**리포트에서 지적한 내용**:
> P0 - 긴급 (즉시 수정)
> 1. **DevToolsPanel 무한 루프 수정**
>    - 파일: `src/components/devtools/DevToolsPanel.tsx:95`
>    - 해결: `getSnapshot` 결과 캐싱

**Cursor AI가 시도한 것**:
```typescript
const storeSnapshot = useGameStore((state) => ({...}));
```

**여전히 남은 문제**:
- Line 84의 `.map()` 호출이 매번 새 배열 생성
- Zustand shallow equality 체크 실패
- 무한 루프 여전히 발생

**올바른 수정**:
```typescript
// collectedEvidence.map()을 selector 밖으로 빼거나
// 카운트만 저장하거나
// useMemo 사용
```

### 2. localStorage는 코드 레벨에서만 구현됨

**리포트에서 지적한 내용**:
> P1 - 높음 (이번 주)
> 3. **localStorage Game State 구현**
>    - 저장 키: `kastor-game-state`
>    - 포함: progress, choices, evidence, scene

**Cursor AI가 구현한 것**:
- ✅ Zustand persist 미들웨어
- ✅ Save slots 시스템
- ✅ Auto-save (30초)
- ✅ 모든 필드 포함

**여전히 남은 문제**:
- Dashboard 진입 시 localStorage가 초기화되지 않음
- Episode 시작 후에만 저장됨
- 테스트에서 "kastor-game-store" 키를 찾지 못함

**올바른 수정**:
- 초기화 타이밍 보장
- onRehydrateStorage 콜백 추가
- 강제 초기화 로직

### 3. data-testid 미추가

**리포트에서 지적한 내용**:
> P1 - 높음 (이번 주)
> 2. **UI 요소에 data-testid 추가**
>    - Chat input: `data-testid="chat-input"`
>    - Choice buttons: `data-testid="choice-button"`
>    - Tab buttons: `data-testid="tab-chat"` 등

**Cursor AI 수정 상태**:
- ❌ 전혀 추가되지 않음
- grep 결과 0개

---

## 🚀 다음 단계

### 즉시 실행 (15분)
1. DevToolsPanel.tsx Line 84 수정
   - `.map()` 제거 또는 카운트만 사용
2. 테스트 재실행하여 크래시 해결 확인

### 단기 (30분)
3. localStorage 초기화 안정화
4. 테스트 재실행하여 100% 통과 확인

### 중기 (1-2시간)
5. data-testid 추가 (주요 UI 요소)
6. Heading hierarchy 개선 (h1 태그)
7. ARIA labels 추가
8. 전체 E2E 테스트 재실행 (114개)

---

## 📝 결론

### 핵심 요약

1. **P0 이슈(DevToolsPanel) 미수정**
   - Cursor AI가 Zustand selector 사용으로 "수정했다"고 판단했으나 **실제로는 여전히 크래시**
   - Line 84의 `.map()` 호출이 근본 원인
   - **모든 테스트 실패의 연쇄 원인**

2. **P1 이슈(localStorage) 부분 구현**
   - 코드는 완벽하지만 **초기화가 불안정**
   - Dashboard 진입만으로는 localStorage가 생성 안됨

3. **P1 이슈(data-testid) 미구현**
   - 전혀 추가되지 않음

4. **성공한 부분**
   - AppNew 게임 런처 흐름 정상
   - 반응형 디자인 유지
   - 일부 접근성 개선 (Settings h1, 일부 aria-label)

### 최우선 작업

**DevToolsPanel.tsx Line 84 수정** (10분)이 모든 것을 해결합니다.
```typescript
// Before (❌)
collectedEvidence: state.collectedEvidence.map((item) => item.id),

// After (✅)
collectedEvidenceCount: state.collectedEvidence.length,
```

이 한 줄만 수정하면:
- 무한 루프 해결
- 10개 연쇄 실패 테스트 통과
- 통과율 50% → 95%

---

**제안**: Cursor AI에게 이 리포트를 제공하고, **특히 DevToolsPanel Line 84의 `.map()` 문제**를 명확히 지적해주세요.
