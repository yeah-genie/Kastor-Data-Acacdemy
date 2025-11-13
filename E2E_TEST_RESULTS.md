# E2E 테스트 결과 상세 보고서

**실행 일시**: 2025-11-13
**총 테스트**: 34개
**성공**: 17개 (50%)
**실패**: 17개 (50%)
**브라우저**: Chromium (Headless)

---

## ✅ 성공한 테스트 (17개)

### 1. Landing Page Screenshots (7개)
모든 스크린샷 캡처 테스트 성공

#### ✓ capture hero screenshot - main dashboard
- **파일**: `e2e/capture-screenshots.spec.ts:13`
- **소요 시간**: 16.2초
- **상태**: 성공

#### ✓ capture chat view screenshot
- **파일**: `e2e/capture-screenshots.spec.ts:39`
- **소요 시간**: 15.2초
- **상태**: 성공
- **저장 위치**: `e2e/screenshots/chat-view.png`

#### ✓ capture data view screenshot
- **파일**: `e2e/capture-screenshots.spec.ts:81`
- **소요 시간**: 16.2초
- **상태**: 성공
- **저장 위치**: `e2e/screenshots/data-view.png`

#### ✓ capture files view screenshot
- **파일**: `e2e/capture-screenshots.spec.ts:97`
- **소요 시간**: 16.3초
- **상태**: 성공
- **저장 위치**: `e2e/screenshots/files-view.png`

#### ✓ capture team view screenshot
- **파일**: `e2e/capture-screenshots.spec.ts:113`
- **소요 시간**: 16.4초
- **상태**: 성공
- **저장 위치**: `e2e/screenshots/team-view.png`

#### ✓ capture mobile screenshots
- **파일**: `e2e/capture-screenshots.spec.ts:129`
- **소요 시간**: 15.3초
- **상태**: 성공
- **저장 위치**:
  - `e2e/screenshots/mobile-portrait.png`
  - `e2e/screenshots/mobile-landscape.png`

#### ✓ capture settings modal
- **파일**: `e2e/capture-screenshots.spec.ts:174`
- **소요 시간**: 8.7초
- **상태**: 성공
- **참고**: Settings button을 찾지 못했지만 테스트는 통과 (warning만 표시)

---

### 2. Chat Flow (1개)

#### ✓ should display initial messages
- **파일**: `e2e/chat-flow.spec.ts:54`
- **소요 시간**: 7.4초
- **상태**: 성공
- **검증 내용**: 초기 메시지 2개 표시 확인

---

### 3. Internationalization (i18n) (3개)

#### ✓ should persist language selection across page reloads
- **파일**: `e2e/i18n.spec.ts:258`
- **소요 시간**: 6.1초
- **상태**: 성공
- **검증 내용**: localStorage에 언어 설정 저장 확인

#### ✓ should not have hardcoded strings
- **파일**: `e2e/i18n.spec.ts:341`
- **소요 시간**: 4.8초
- **상태**: 성공
- **검증 내용**: 하드코드된 문자열 없음

---

### 4. Kastor Navigation (1개)

#### ✓ should navigate through tabs and interact with chat
- **파일**: `e2e/kastor-navigation.spec.ts:14`
- **소요 시간**: 9.9초
- **상태**: 성공
- **검증 내용**:
  - 페이지 로드 성공
  - 스크린샷 7개 생성
  - 네비게이션 기본 동작 확인

---

### 5. State Persistence (5개)

#### ✓ should track progress when choices are made
- **파일**: `e2e/state-persistence.spec.ts:26`
- **소요 시간**: 7.9초
- **상태**: 성공
- **참고**: "No choices available to test" 경고 있으나 테스트 통과

#### ✓ should support manual save via Settings
- **파일**: `e2e/state-persistence.spec.ts:156`
- **소요 시간**: 5.5초
- **상태**: 성공
- **참고**: Settings menu를 열지 못했으나 테스트 통과

#### ✓ should auto-save periodically
- **파일**: `e2e/state-persistence.spec.ts:258`
- **소요 시간**: 42.1초
- **상태**: 성공
- **검증 내용**: 35초 대기 후 자동 저장 확인
- **참고**: "State unchanged" 경고

#### ✓ should track collected evidence in state
- **파일**: `e2e/state-persistence.spec.ts:360`
- **소요 시간**: 5.4초
- **상태**: 성공
- **참고**: "No evidence found" 경고

#### ✓ should track scene history
- **파일**: `e2e/state-persistence.spec.ts:406`
- **소요 시간**: 5.5초
- **상태**: 성공
- **참고**: "No scene state found" 경고

---

## ❌ 실패한 테스트 (17개)

### 1. Demo Video Capture (2개) - 브라우저 크래시

#### ✘ record complete demo video
- **파일**: `e2e/capture-demo-video.spec.ts:14`
- **소요 시간**: 5.2초
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **실패 위치**: Line 26
- **원인**:
  - 브라우저 컨텍스트가 예기치 않게 종료됨
  - 비디오 녹화 시작 전 크래시
  - Chromium headless shell 안정성 문제
- **수정 방안**:
  1. 비디오 녹화 설정 조정 필요
  2. 브라우저 launch options 검토
  3. `--single-process` 플래그 제거 고려
  4. 메모리 제한 증가

#### ✘ record quick feature showcase (30 seconds)
- **파일**: `e2e/capture-demo-video.spec.ts:178`
- **소요 시간**: 5.2초
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **실패 위치**: Line 189
- **원인**: 위와 동일
- **수정 방안**: 위와 동일

---

### 2. Chat Flow (6개) - UI 요소 찾기 실패

#### ✘ should show typing indicator when Kastor is typing
- **파일**: `e2e/chat-flow.spec.ts:69`
- **소요 시간**: 37ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **근본 원인**:
  ```
  Uncaught Error: Maximum update depth exceeded
  at DevToolsPanel (http://localhost:5000/src/components/devtools/DevToolsPanel.tsx:95:27)
  ```
- **수정 방안**:
  1. **우선순위 높음**: `DevToolsPanel.tsx:95` 무한 루프 수정 필요
  2. `getSnapshot` 결과를 캐시하도록 수정
  3. 컴포넌트 state 업데이트 로직 검토

#### ✘ should display choices when available
- **파일**: `e2e/chat-flow.spec.ts:97`
- **소요 시간**: 6.3초
- **에러**: `expect(foundChoices).toBe(true)` - Expected: true, Received: false
- **실패 위치**: Line 126
- **원인**: Choice 버튼/요소를 찾을 수 없음
- **캡처된 증거**:
  - Screenshot: `test-results/chat-flow-Chat-Flow-should-display-choices-when-available-chromium/test-failed-1.png`
  - Video: `test-results/.../video.webm`
- **수정 방안**:
  1. Choice 컴포넌트의 셀렉터 확인
  2. 테스트에서 사용하는 `data-testid` 속성 추가
  3. 대기 시간 증가 (`waitForSelector` timeout)
  4. Choice 렌더링 조건 검토

#### ✘ should add player message when choice is clicked
- **파일**: `e2e/chat-flow.spec.ts:130`
- **소요 시간**: 43ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: 이전 테스트 실패로 인한 연쇄 실패
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

#### ✘ should receive response after choice selection
- **파일**: `e2e/chat-flow.spec.ts:161`
- **소요 시간**: 43ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: 이전 테스트 실패로 인한 연쇄 실패
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

#### ✘ should collect evidence and update Files badge
- **파일**: `e2e/chat-flow.spec.ts:187`
- **소요 시간**: 1분
- **원인**: Evidence 요소를 찾을 수 없음
- **로그**: "No evidence found in current scene"
- **수정 방안**:
  1. Evidence 수집 로직 확인
  2. 테스트 데이터에 evidence가 포함되어 있는지 확인
  3. Files badge 업데이트 트리거 검토

#### ✘ should navigate to chat via URL
- **파일**: `e2e/chat-flow.spec.ts:234`
- **소요 시간**: 10.6초
- **원인**: Message input field를 찾을 수 없음
- **로그**:
  ```
  Page has input tags: false
  Page has textarea tags: false
  Checking selector: input[placeholder*="conversation"], found 0 elements
  Checking selector: input, found 0 elements
  Checking selector: textarea, found 0 elements
  ```
- **캡처된 스크린샷**: `e2e/screenshots/07-no-input-found.png`
- **수정 방안**:
  1. `/dashboard/chat` 경로에서 input field가 렌더링되는지 확인
  2. Chat input 컴포넌트의 조건부 렌더링 로직 검토
  3. 테스트에서 `data-testid="chat-input"` 같은 속성 추가
  4. 라우팅 후 컴포넌트 마운트 대기 시간 증가

#### ✘ should scroll to bottom when new message arrives
- **파일**: `e2e/chat-flow.spec.ts:247`
- **소요 시간**: 67ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: 이전 테스트 실패로 인한 연쇄 실패
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

---

### 3. Internationalization (i18n) (4개) - 브라우저 크래시

#### ✘ should detect browser language on first load
- **파일**: `e2e/i18n.spec.ts:24`
- **소요 시간**: 58ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

#### ✘ should change language from Settings menu
- **파일**: `e2e/i18n.spec.ts:50`
- **소요 시간**: 63ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

#### ✘ should translate all UI strings
- **파일**: `e2e/i18n.spec.ts:152`
- **소요 시간**: 8.4초
- **원인**: 번역된 문자열을 찾을 수 없음
- **로그**: "Found 0/4 Korean strings"
- **수정 방안**:
  1. i18n 번역 파일 확인 (`ko.json`, `en.json` 등)
  2. 번역 키가 올바르게 사용되고 있는지 확인
  3. 테스트가 기대하는 번역 문자열 업데이트
  4. 언어 전환 로직 검증

#### ✘ should format dates according to locale
- **파일**: `e2e/i18n.spec.ts:214`
- **소요 시간**: 82ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

#### ✘ should translate ARIA labels for screen readers
- **파일**: `e2e/i18n.spec.ts:290`
- **소요 시간**: 111ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

---

### 4. State Persistence (4개) - UI 요소 및 기능 누락

#### ✘ should update progress bar in GameHUD
- **파일**: `e2e/state-persistence.spec.ts:90`
- **소요 시간**: 44ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

#### ✘ should save game state to localStorage
- **파일**: `e2e/state-persistence.spec.ts:127`
- **소요 시간**: 5.6초
- **원인**: localStorage에 게임 상태 키가 없음
- **로그**: "Game state keys found: []"
- **수정 방안**:
  1. 게임 상태 저장 로직 구현 확인
  2. localStorage 키 이름 확인 (예: `kastor-game-state`)
  3. 상태 저장 트리거 이벤트 검토
  4. 테스트가 기대하는 localStorage 키 업데이트

#### ✘ should support save slot switching
- **파일**: `e2e/state-persistence.spec.ts:216`
- **소요 시간**: 46ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

#### ✘ should restore state after page reload
- **파일**: `e2e/state-persistence.spec.ts:299`
- **소요 시간**: 45ms
- **에러**: `browserContext.newPage: Target page, context or browser has been closed`
- **원인**: React 무한 루프로 인한 페이지 크래시
- **수정 방안**: DevToolsPanel 무한 루프 수정 후 재테스트

---

## 🔴 치명적 이슈 (최우선 수정 필요)

### Issue #1: React 무한 루프 - DevToolsPanel
- **위치**: `src/components/devtools/DevToolsPanel.tsx:95`
- **에러 메시지**:
  ```
  Uncaught Error: Maximum update depth exceeded.
  This can happen when a component repeatedly calls setState
  inside componentWillUpdate or componentDidUpdate.
  React limits the number of nested updates to prevent infinite loops.
  ```
- **추가 경고**:
  ```
  Warning: The result of getSnapshot should be cached to avoid an infinite loop
  at DevToolsPanel (http://localhost:5000/src/components/devtools/DevToolsPanel.tsx:95:27)
  ```
- **영향**: 12개 테스트 실패의 직접적 원인
- **수정 방안**:
  ```typescript
  // 문제가 되는 코드 패턴 (추정)
  const snapshot = getSnapshot(); // 매번 새로운 객체 반환

  // 수정 방안
  const snapshot = useMemo(() => getSnapshot(), [dependencies]);
  // 또는
  const [cachedSnapshot, setCachedSnapshot] = useState(null);
  ```

### Issue #2: 브라우저 안정성
- **현상**: 비디오 녹화 시 브라우저 크래시
- **영향**: 2개 데모 비디오 테스트 실패
- **Chromium 에러 로그**:
  - `ERROR:dbus/bus.cc:408` - D-Bus 연결 실패
  - `ERROR:net/base/address_tracker_linux.cc:242` - NETLINK 소켓 바인딩 실패
  - `ERROR:media/audio/alsa/alsa_util.cc:204` - ALSA 오디오 장치 없음
- **수정 방안**:
  1. `playwright.config.ts` 수정:
     ```typescript
     launchOptions: {
       args: [
         '--disable-gpu',
         '--disable-dev-shm-usage',
         '--disable-setuid-sandbox',
         '--no-sandbox',
         // '--single-process', // 제거 고려
         // '--no-zygote', // 제거 고려
       ],
     }
     ```
  2. 비디오 녹화 비활성화 또는 별도 테스트로 분리

---

## ⚠️ 주요 이슈

### Issue #3: UI 요소 셀렉터 문제
- **영향받는 테스트**: 6개
- **문제 요소**:
  - Chat input field
  - Choice buttons
  - Tab navigation buttons
  - Settings button
  - Evidence cards
- **수정 방안**:
  1. 모든 인터랙티브 요소에 `data-testid` 추가:
     ```tsx
     <input data-testid="chat-input" ... />
     <button data-testid="choice-button" ... />
     <button data-testid="tab-chat" ... />
     ```
  2. 테스트 셀렉터를 data-testid 기반으로 변경:
     ```typescript
     await page.getByTestId('chat-input').fill('message');
     ```

### Issue #4: i18n 번역 누락
- **영향받는 테스트**: 1개 (실제로는 통과로 표시되었지만 내용상 실패)
- **로그**: "Found 0/4 Korean strings"
- **수정 방안**:
  1. `src/locales/ko.json` 파일 확인 및 누락된 번역 추가
  2. i18n 라이브러리 초기화 확인
  3. 테스트가 기대하는 번역 키 확인

### Issue #5: localStorage 게임 상태 저장 미구현
- **영향받는 테스트**: 1개
- **로그**: "Game state keys found: []"
- **수정 방안**:
  1. 게임 상태 저장 기능 구현:
     ```typescript
     const saveGameState = () => {
       const state = {
         progress: currentProgress,
         choices: selectedChoices,
         evidence: collectedEvidence,
         scene: currentScene,
       };
       localStorage.setItem('kastor-game-state', JSON.stringify(state));
     };
     ```
  2. 선택 시, 증거 수집 시 자동 저장 트리거

---

## 📋 수정 우선순위

### P0 - 긴급 (즉시 수정 필요)
1. **DevToolsPanel 무한 루프 수정** - 12개 테스트 차단
   - 파일: `src/components/devtools/DevToolsPanel.tsx:95`

### P1 - 높음 (금주 내 수정)
2. **UI 요소에 data-testid 추가** - 6개 테스트 영향
   - Chat input field
   - Choice buttons
   - Tab buttons
   - Settings button

3. **localStorage 게임 상태 저장 구현** - 1개 테스트 영향

### P2 - 중간 (다음 스프린트)
4. **i18n 번역 완성** - 1개 테스트 영향
5. **비디오 녹화 테스트 안정화** - 2개 테스트 영향

### P3 - 낮음 (향후 개선)
6. Evidence 수집 기능 구현 확인
7. Scene history 추적 구현 확인

---

## 🔧 권장 수정 순서

1. **1단계**: DevToolsPanel.tsx 무한 루프 수정
   - 예상 시간: 1-2시간
   - 영향: 12개 테스트 수정

2. **2단계**: UI 요소에 data-testid 추가
   - 예상 시간: 2-3시간
   - 영향: 6개 테스트 수정

3. **3단계**: localStorage 상태 저장 구현
   - 예상 시간: 3-4시간
   - 영향: 1개 테스트 수정

4. **4단계**: 전체 테스트 재실행 및 검증
   - 예상 시간: 1시간

**예상 총 작업 시간**: 7-10시간

---

## 📁 테스트 아티팩트 위치

- **스크린샷**: `e2e/screenshots/`
- **실패 스크린샷**: `test-results/*/test-failed-*.png`
- **비디오**: `test-results/*/video.webm`
- **HTML 리포트**: `playwright-report/index.html`
- **에러 컨텍스트**: `test-results/*/error-context.md`

---

## 🚀 다음 단계

1. 이 문서를 Cursor AI에 제공하여 P0 이슈 수정
2. 수정 후 테스트 재실행: `npm run test:e2e`
3. 결과 업데이트 및 P1 이슈로 진행
4. 모든 테스트 통과 시 CI/CD 파이프라인에 통합
