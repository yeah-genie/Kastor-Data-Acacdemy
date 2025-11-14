# APK 빌드 가이드

## 🚀 GitHub Actions 자동 빌드

이 프로젝트는 GitHub Actions를 사용하여 자동으로 APK를 빌드합니다.

### 자동 빌드 트리거

APK는 다음 상황에서 자동으로 빌드됩니다:

1. **`main` 브랜치에 푸시할 때**
2. **`claude/**` 브랜치에 푸시할 때** (현재 개발 브랜치)
3. **Pull Request가 생성될 때**
4. **수동으로 실행할 때**

### APK 다운로드 방법

#### 방법 1: GitHub Actions Artifacts

1. GitHub 저장소로 이동
2. **Actions** 탭 클릭
3. **Build Flutter APK** 워크플로우 선택
4. 최근 빌드 실행 클릭
5. 하단의 **Artifacts** 섹션에서 APK 다운로드

#### 방법 2: 직접 링크 (푸시 후)

푸시하면 자동으로 빌드가 시작됩니다:
```
https://github.com/yeah-genie/Kastor-Data-Academy/actions
```

### 수동으로 빌드 트리거

1. GitHub 저장소의 **Actions** 탭
2. **Build Flutter APK** 워크플로우 선택
3. **Run workflow** 버튼 클릭
4. 브랜치 선택 후 **Run workflow** 실행

---

## 📱 APK 설치 방법

### Android 기기에 설치

1. 다운로드한 APK 파일을 Android 기기로 전송
2. 파일 관리자에서 APK 파일 찾기
3. APK 파일 클릭하여 설치 시작
4. **"출처를 알 수 없는 앱"** 경고가 나오면:
   - **설정 > 보안 > 알 수 없는 출처 허용** 활성화
   - 또는 해당 앱에만 설치 허용

### 주의사항

- 이 APK는 **디버그/테스트 빌드**이므로 Google Play 스토어에 배포할 수 없습니다
- 프로덕션 배포를 위해서는 서명된 릴리스 APK가 필요합니다

---

## 🔧 로컬에서 빌드하기

로컬 컴퓨터에서 직접 빌드하려면:

### 사전 요구사항

- Flutter SDK 3.38.0 이상
- Android SDK
- Java 17

### 빌드 명령어

```bash
cd flutter_app

# 디버그 APK
flutter build apk --debug

# 릴리스 APK (최적화됨)
flutter build apk --release

# APK 파일 위치
# build/app/outputs/flutter-apk/app-release.apk
```

---

## 🔥 Firebase App Distribution (선택사항)

Firebase App Distribution을 사용하면 테스터들에게 자동으로 APK를 배포할 수 있습니다.

### 설정 방법

1. Firebase 프로젝트 생성
2. Firebase CLI 설치:
   ```bash
   npm install -g firebase-tools
   ```

3. Firebase 로그인:
   ```bash
   firebase login
   ```

4. App Distribution 설정:
   ```bash
   firebase appdistribution:distribute \
     flutter_app/build/app/outputs/flutter-apk/app-release.apk \
     --app YOUR_APP_ID \
     --groups testers
   ```

5. GitHub Secrets에 다음 추가:
   - `FIREBASE_TOKEN`: Firebase CI 토큰
   - `FIREBASE_APP_ID`: Firebase 앱 ID

---

## 📊 빌드 상태

현재 빌드 상태는 GitHub Actions 페이지에서 확인할 수 있습니다:

[![Build Status](https://github.com/yeah-genie/Kastor-Data-Academy/actions/workflows/build-flutter-apk.yml/badge.svg)](https://github.com/yeah-genie/Kastor-Data-Academy/actions/workflows/build-flutter-apk.yml)

---

## 💡 팁

### APK 크기 줄이기

```bash
# App Bundle 빌드 (Google Play 업로드용)
flutter build appbundle --release

# 특정 아키텍처만 빌드
flutter build apk --split-per-abi
```

### 빌드 문제 해결

```bash
# 캐시 삭제
flutter clean

# 의존성 재설치
flutter pub get

# 다시 빌드
flutter build apk --release
```

---

## 📞 문제가 있나요?

- GitHub Issues에 문제 보고
- Actions 로그 확인하여 빌드 오류 디버깅
