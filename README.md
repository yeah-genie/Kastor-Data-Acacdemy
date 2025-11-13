# Kastor Data Academy - Flutter App

사이버 수사 게임 Flutter 모바일 애플리케이션

## 프로젝트 구조

```
flutter_app/
├── lib/
│   ├── main.dart                 # 앱 진입점
│   ├── models/                   # 데이터 모델
│   ├── providers/                # 상태 관리 (Riverpod)
│   ├── screens/                  # 화면
│   │   └── dashboard/           # Dashboard 및 탭들
│   ├── widgets/                  # 재사용 위젯
│   ├── services/                 # 서비스
│   ├── utils/                    # 유틸리티
│   └── theme/                    # 테마
└── assets/                       # 리소스 파일
    ├── sounds/
    ├── episodes/
    ├── characters/
    ├── images/
    └── fonts/
```

## 시작하기

### 필요 사항
- Flutter SDK 3.38.0 이상
- Dart 3.10.0 이상

### 설치

1. 의존성 설치
```bash
cd flutter_app
flutter pub get
```

2. 실행
```bash
flutter run
```

## 주요 기능

- ✅ 메인 메뉴 화면
- ✅ Dashboard (5개 탭)
  - Chat: 대화형 인터페이스
  - Data: 데이터 분석
  - Files: 파일 브라우저
  - Team: 캐릭터 관리
  - Progress: 진행률 추적
- ✅ 상태 관리 (Riverpod)
- ✅ 로컬 저장소 (SharedPreferences)
- ✅ JSON 직렬화

## 기술 스택

- **Flutter**: 크로스 플랫폼 UI 프레임워크
- **Riverpod**: 상태 관리
- **Google Fonts**: 폰트
- **SharedPreferences**: 로컬 저장소
- **JSON Serialization**: 데이터 직렬화

## 라이선스

MIT
