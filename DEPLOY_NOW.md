# 🚀 지금 바로 GitHub Pages 배포하기!

## ⚡ 빠른 해결 방법

GitHub에서 수동으로 배포를 실행하세요 (1분이면 완료):

### 방법 1: GitHub Actions에서 수동 실행 (추천)

1. **GitHub 저장소 방문**
   - https://github.com/yeah-genie/Kastor-Data-Academy

2. **Actions 탭 클릭**
   - 상단 메뉴에서 "Actions" 클릭

3. **워크플로우 선택**
   - 왼쪽 사이드바에서 "Deploy to GitHub Pages" 클릭

4. **수동 실행**
   - 오른쪽 상단 "Run workflow" 버튼 클릭
   - Branch: `main` 선택
   - 녹색 "Run workflow" 버튼 다시 클릭

5. **완료!**
   - 3-5분 후 https://yeah-genie.github.io/Kastor-Data-Academy/ 확인

### 방법 2: flutter_app 폴더 파일 수정

워크플로우는 `flutter_app/**` 경로의 변경사항만 트리거합니다.

```bash
# 작은 변경사항 만들기
cd flutter_app
echo "Updated $(date)" >> .deployment

# 커밋 및 푸시
git add .deployment
git commit -m "trigger: Deploy to GitHub Pages"
git push origin main
```

### 방법 3: 워크플로우 파일 수정

`.github/workflows/deploy-web.yml` 파일에서 `paths` 제한 제거:

```yaml
on:
  push:
    branches:
      - main
    # paths 섹션 제거 또는 주석 처리
  workflow_dispatch:
```

## 🔍 배포 상태 확인

1. **GitHub Actions 탭**
   - https://github.com/yeah-genie/Kastor-Data-Academy/actions

2. **워크플로우 실행 클릭**
   - "Deploy to GitHub Pages" 워크플로우 클릭
   - 각 단계의 로그 확인

3. **성공 확인**
   - ✅ 모든 단계가 녹색 체크마크
   - 🌐 배포 완료 메시지 확인

## ⚙️ GitHub Pages 설정 확인

만약 배포가 성공했는데도 사이트가 보이지 않는다면:

1. **Settings 탭 → Pages**
   - https://github.com/yeah-genie/Kastor-Data-Academy/settings/pages

2. **설정 확인**
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. **저장**
   - 변경 사항이 있으면 "Save" 클릭

## 🐛 문제 해결

### "404 - 페이지를 찾을 수 없음"

**원인**: gh-pages 브랜치가 없거나 Pages 설정이 잘못됨

**해결**:
1. Actions에서 워크플로우가 성공했는지 확인
2. gh-pages 브랜치가 생성되었는지 확인
3. Settings → Pages에서 gh-pages 브랜치 선택

### "워크플로우가 실행되지 않음"

**원인**: paths 필터가 변경된 파일과 일치하지 않음

**해결**:
1. 방법 1 사용 (수동 실행)
2. 또는 flutter_app 폴더 내 파일 수정

### "403 권한 에러"

**원인**: GitHub token 권한 부족

**해결**:
1. Settings → Actions → General
2. Workflow permissions
3. "Read and write permissions" 선택
4. "Allow GitHub Actions to create and approve pull requests" 체크
5. Save

## ✅ 현재 상태

- ✅ 모든 코드가 main 브랜치에 머지됨
- ✅ 워크플로우 파일이 올바르게 설정됨
- ✅ 자동 배포 시스템 준비 완료
- ⏳ GitHub Actions 수동 실행 대기 중

## 🎯 다음 단계

1. **지금 바로**: GitHub Actions에서 "Run workflow" 클릭
2. **3-5분 대기**: 빌드 및 배포
3. **확인**: https://yeah-genie.github.io/Kastor-Data-Academy/
4. **앞으로**: flutter_app 폴더 변경 시 자동 배포 ✨

---

**문제가 계속되면?**
- GitHub Actions 로그 확인
- gh-pages 브랜치 확인
- Settings → Pages 설정 확인

모든 준비가 완료되었습니다! 🚀
