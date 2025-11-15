# GitHub Pages 활성화 가이드

## 문제 상황
- GitHub Actions 워크플로우는 정상 작동 (배포 성공 ✅)
- gh-pages 브랜치에 빌드 결과물이 정상적으로 푸시됨 ✅
- 하지만 GitHub Pages가 비활성화 상태 ❌

## 해결 방법

### 1. 저장소 Settings 페이지 이동
```bash
https://github.com/yeah-genie/Kastor-Data-Academy/settings/pages
```

### 2. GitHub Pages 활성화
**Settings** → **Pages** 섹션에서:

1. **Source** 설정:
   - "Deploy from a branch" 선택
   
2. **Branch** 설정:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - **Save** 버튼 클릭

### 3. 배포 확인 (2-3분 소요)
- Pages 설정 후 자동으로 배포 시작
- 상단에 초록색 알림 표시: "Your site is live at..."
- URL: `https://yeah-genie.github.io/Kastor-Data-Academy/`

### 4. 배포 상태 확인
```bash
# GitHub CLI로 확인
gh run list --workflow=pages-build-deployment

# 또는 웹에서 확인
https://github.com/yeah-genie/Kastor-Data-Academy/actions
```

## 현재 상태

### ✅ 정상 작동 중
1. **GitHub Actions 워크플로우**: `.github/workflows/deploy-web.yml`
   - Flutter 빌드 ✅
   - gh-pages 브랜치에 푸시 ✅
   - base-href 설정 정확함: `/Kastor-Data-Academy/`

2. **빌드 파일**:
   - `flutter_app/build/web/` 생성 완료
   - `.nojekyll` 파일 포함 (Jekyll 우회)
   - 모든 에셋 포함 (characters, episodes, icons 등)

3. **gh-pages 브랜치**:
   - 최신 커밋 존재
   - index.html 및 모든 리소스 정상

### ❌ 필요한 작업
- **GitHub Pages 설정 활성화** (수동 설정 필요)

## 대체 방법

만약 GitHub Pages 활성화가 안 되면:

### Option A: GitHub CLI 사용
```bash
# Pages 활성화 (권한 있는 경우)
gh api repos/yeah-genie/Kastor-Data-Academy/pages \
  -X POST \
  -f source[branch]=gh-pages \
  -f source[path]=/
```

### Option B: 저장소 재설정
1. Settings → Danger Zone → Transfer ownership (취소 가능)
2. Pages 비활성화 후 재활성화
3. gh-pages 브랜치 다시 선택

## 배포 후 테스트

웹사이트가 활성화되면:

1. **메인 페이지 로드 확인**
   ```
   https://yeah-genie.github.io/Kastor-Data-Academy/
   ```

2. **에셋 로드 확인** (브라우저 개발자 도구 Console)
   - Characters SVG 로드 확인
   - Episodes JSON 로드 확인
   - Icons PNG 로드 확인

3. **기능 테스트**
   - "시작하기" 버튼 클릭
   - Episode 1 플레이
   - 저장/로드 기능
   - 설정 변경 (언어, 텍스트 속도)

## 자주 묻는 질문

### Q: 403 오류가 계속 나타나면?
A: GitHub Pages가 활성화되지 않았거나, 브랜치 설정이 잘못되었을 가능성이 높습니다.

### Q: 페이지가 비어 있으면?
A: base-href 설정 문제일 수 있습니다. 하지만 현재 워크플로우는 정확하게 설정되어 있습니다.

### Q: 에셋이 404를 반환하면?
A: 
1. `.nojekyll` 파일 존재 확인
2. pubspec.yaml의 assets 경로 확인
3. 빌드 출력물에 에셋 포함 여부 확인

## 추가 참고자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Flutter Web 배포 가이드](https://docs.flutter.dev/deployment/web)
- [GitHub Actions Marketplace](https://github.com/marketplace/actions/github-pages-action)

## 성공 시 예상 결과

```
🎉 Deployment successful!
🌐 Your app is live at: https://yeah-genie.github.io/Kastor-Data-Academy/
⏰ Build time: 2025-11-15 04:33:12 UTC

GitHub Pages Status: ✅ Live
- Source: gh-pages branch
- Last deployed: just now
- Build logs: All checks passed
```
