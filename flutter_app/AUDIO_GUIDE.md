# 🎵 오디오 파일 가이드

AudioService가 구현되어 있습니다. 다음 사운드 파일을 추가해야 합니다:

## 📂 파일 위치
`flutter_app/assets/sounds/`

## 🎶 필요한 사운드 파일

### 효과음 (SFX)
1. `button_click.mp3` - 버튼 클릭 소리 (짧은 '딸깍' 소리)
2. `evidence_found.mp3` - 증거 발견 (성취감 있는 '띠링~')
3. `case_complete.mp3` - 사건 완료 (팡파레 또는 승리 소리)
4. `correct.mp3` - 정답 (긍정적인 '땡!')
5. `wrong.mp3` - 오답 (부정적인 '땡땡~')
6. `notification.mp3` - 알림 (부드러운 벨 소리)
7. `achievement.mp3` - 업적 달성 (웅장한 '짠!')

### 배경 음악 (BGM)
1. `bgm_main_menu.mp3` - 메인 메뉴 (차분한 사이버펑크 앰비언트)
2. `bgm_investigation.mp3` - 수사 중 (긴장감 있는 미스터리 음악)
3. `bgm_suspense.mp3` - 긴박한 장면 (서스펜스풀한 음악)
4. `bgm_victory.mp3` - 승리 (밝고 경쾌한 음악)

## 🔊 사운드 사양 권장
- 포맷: MP3 (호환성 최고)
- 비트레이트: 128kbps (용량 절약)
- 효과음: 1-3초 길이
- BGM: 1-2분 길이 (루프 가능하게)
- 볼륨: 정규화된 오디오 (-3dB 피크)

## 🎹 무료 사운드 리소스
1. **Freesound.org** - 무료 효과음
2. **Incompetech.com** - 무료 배경음악 (Kevin MacLeod)
3. **Zapsplat.com** - 무료 사운드 이펙트
4. **Bensound.com** - 무료 배경음악

## ⚙️ pubspec.yaml 확인
\`\`\`yaml
flutter:
  assets:
    - assets/sounds/
\`\`\`

## 🧪 테스트 방법
\`\`\`dart
// 효과음 테스트
AudioService().playSFX(SoundEffect.buttonClick);

// 배경음악 테스트
AudioService().playBGM(BackgroundMusic.mainMenu.fileName);
\`\`\`

## 📝 임시 해결책
실제 사운드 파일이 없어도 앱은 정상 작동합니다.
오류는 콘솔에만 표시되며 앱 크래시는 발생하지 않습니다.

## 🎯 통합 위치
AudioService는 다음 위치에서 자동으로 호출됩니다:
- ✅ 미니게임 (정답/오답 효과음)
- ✅ 버튼 클릭 (UI 인터랙션)
- ⏳ 메시지 수신 (알림 소리) - TODO
- ⏳ 에피소드 완료 (승리 음악) - TODO
- ⏳ 업적 달성 (성취 소리) - TODO
