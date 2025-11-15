import 'package:flutter/material.dart';
import '../widgets/notification_overlay.dart';
import '../widgets/screen_effects.dart';
import '../widgets/email_fullscreen.dart';
import '../widgets/typing_text.dart';

/// 인터랙티브 위젯 데모 화면
/// 모든 새로운 인터랙티브 기능을 테스트할 수 있는 화면입니다
class InteractiveWidgetsDemoScreen extends StatelessWidget {
  const InteractiveWidgetsDemoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('인터랙티브 위젯 데모'),
        backgroundColor: const Color(0xFF3B82F6),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 알림 오버레이 섹션
          _buildSection(
            title: '📱 알림 오버레이',
            children: [
              _buildDemoButton(
                context: context,
                label: '이메일 알림',
                color: Colors.blue,
                onPressed: () {
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.email,
                      title: '새 메일 도착',
                      message: 'Maya Kim: [긴급] 랭킹 조작 의심 사례 발견',
                      time: '09:30',
                    ),
                  );
                },
              ),
              _buildDemoButton(
                context: context,
                label: '전화 알림',
                color: Colors.green,
                onPressed: () {
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.phone,
                      title: '부재중 전화',
                      message: 'Maya Kim',
                      time: '14:22',
                    ),
                  );
                },
              ),
              _buildDemoButton(
                context: context,
                label: '알람 알림',
                color: Colors.orange,
                onPressed: () {
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.alarm,
                      title: '알람',
                      message: '회의 시작 10분 전',
                      time: '09:50',
                    ),
                  );
                },
              ),
              _buildDemoButton(
                context: context,
                label: '메시지 알림',
                color: Colors.purple,
                onPressed: () {
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.message,
                      title: 'Kastor',
                      message: '데이터 확인 부탁드립니다',
                      time: '방금',
                    ),
                  );
                },
              ),
              _buildDemoButton(
                context: context,
                label: '시스템 알림',
                color: Colors.grey,
                onPressed: () {
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.system,
                      title: '시스템 알림',
                      message: '데이터 동기화 완료',
                      time: '방금',
                    ),
                  );
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 화면 효과 섹션
          _buildSection(
            title: '✨ 화면 효과',
            children: [
              _buildDemoButton(
                context: context,
                label: '플래시 효과 (충격적인 발견)',
                color: Colors.white,
                textColor: Colors.black,
                onPressed: () {
                  ScreenEffects.flash(context);
                },
              ),
              _buildDemoButton(
                context: context,
                label: '페이드 효과 (장면 전환)',
                color: Colors.black,
                onPressed: () {
                  ScreenEffects.fade(context, color: Colors.black);
                },
              ),
              _buildDemoButton(
                context: context,
                label: '빨간 페이드 (위험/경고)',
                color: Colors.red,
                onPressed: () {
                  ScreenEffects.fade(context, color: Colors.red);
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 진동 효과 섹션
          _buildSection(
            title: '📳 진동 효과',
            children: [
              _buildDemoButton(
                context: context,
                label: '가벼운 진동 (버튼 클릭)',
                color: Colors.lightGreen,
                onPressed: () {
                  ScreenEffects.vibrate(VibrationPattern.light);
                },
              ),
              _buildDemoButton(
                context: context,
                label: '중간 진동 (알림)',
                color: Colors.amber,
                onPressed: () {
                  ScreenEffects.vibrate(VibrationPattern.medium);
                },
              ),
              _buildDemoButton(
                context: context,
                label: '강한 진동 (충격)',
                color: Colors.red,
                onPressed: () {
                  ScreenEffects.vibrate(VibrationPattern.heavy);
                },
              ),
              _buildDemoButton(
                context: context,
                label: '선택 진동 (스크롤)',
                color: Colors.blueGrey,
                onPressed: () {
                  ScreenEffects.vibrate(VibrationPattern.selection);
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 전체화면 이메일 섹션
          _buildSection(
            title: '📧 전체화면 이메일',
            children: [
              _buildDemoButton(
                context: context,
                label: 'Maya의 긴급 이메일',
                color: const Color(0xFF3B82F6),
                onPressed: () {
                  EmailFullScreen.show(
                    context,
                    EmailData(
                      from: 'Maya Kim',
                      subject: '[긴급] 랭킹 조작 의심 사례 발견',
                      body: '''안녕하세요, Kastor님

어제 말씀드린 랭킹 시스템 이상 징후에 대해 조사한 결과를 공유드립니다.

문제의 사용자(ID: ghost_user_47)가 지난 3개월간 비정상적인 패턴을 보이고 있습니다:

1. 승률: 99.8% (정상 범위: 45-65%)
2. 게임 수: 하루 평균 147경기 (정상 범위: 10-30경기)
3. 플레이 시간대: 24시간 연속 활동
4. 반응 속도: 평균 0.1초 (정상 범위: 0.8-2.5초)

이는 명백한 봇 활동이거나 시스템 조작으로 보입니다.

자세한 데이터는 첨부 파일을 확인해 주세요.

감사합니다.
Maya Kim
Data Analyst''',
                      time: '2024년 1월 15일 오전 9:30',
                      isRead: false,
                      avatar: 'assets/characters/maya.svg',
                    ),
                  );
                },
              ),
              _buildDemoButton(
                context: context,
                label: 'CEO의 중요 공지',
                color: Colors.deepPurple,
                onPressed: () {
                  EmailFullScreen.show(
                    context,
                    EmailData(
                      from: 'Sarah Johnson',
                      subject: '[중요] 긴급 전사 회의 소집',
                      body: '''전 직원 귀하

최근 발생한 랭킹 시스템 이상 징후와 관련하여 긴급 전사 회의를 소집합니다.

일시: 2024년 1월 15일 오후 3시
장소: 본사 대회의실
참석자: 전 직원 필수 참석

본 건은 회사의 신뢰성과 직결된 중대한 사안입니다.
모든 직원은 반드시 참석해 주시기 바랍니다.

감사합니다.

Sarah Johnson
CEO''',
                      time: '2024년 1월 15일 오전 10:45',
                      isRead: false,
                    ),
                  );
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 타이핑 효과 섹션
          _buildSection(
            title: '⌨️ 타이핑 효과',
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '타이핑 효과 예시:',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TypingText(
                        text: '안녕하세요! Kastor Data Academy에 오신 것을 환영합니다.',
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                        duration: const Duration(milliseconds: 50),
                        onComplete: () {
                          debugPrint('타이핑 완료!');
                        },
                      ),
                      const SizedBox(height: 16),
                      const Row(
                        children: [
                          Text(
                            'Maya가 입력 중',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey,
                            ),
                          ),
                          SizedBox(width: 8),
                          TypingIndicator(color: Colors.grey),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // 복합 시나리오
          _buildSection(
            title: '🎬 복합 시나리오',
            children: [
              _buildDemoButton(
                context: context,
                label: '에피소드 2 오프닝 시뮬레이션',
                color: const Color(0xFF8B5CF6),
                onPressed: () async {
                  // 1. 아침 알람
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.alarm,
                      title: '알람',
                      message: '기상 시간',
                      time: '07:00',
                    ),
                  );

                  // 2초 대기
                  await Future.delayed(const Duration(seconds: 2));

                  // 2. 페이드 효과 (시간 경과)
                  ScreenEffects.fade(context, color: Colors.black);

                  await Future.delayed(const Duration(milliseconds: 500));

                  // 3. Maya의 긴급 이메일 알림
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.email,
                      title: '새 메일',
                      message: 'Maya Kim: [긴급] 랭킹 조작 의심',
                      time: '09:30',
                    ),
                  );

                  // 4. 중간 진동
                  ScreenEffects.vibrate(VibrationPattern.medium);
                },
              ),
              _buildDemoButton(
                context: context,
                label: '진실 발견 시뮬레이션',
                color: Colors.red,
                onPressed: () async {
                  // 1. 시스템 알림
                  NotificationOverlay.show(
                    context,
                    NotificationData(
                      type: NotificationType.system,
                      title: '데이터 분석 완료',
                      message: '승률 패턴 이상 징후 감지',
                      time: '방금',
                    ),
                  );

                  await Future.delayed(const Duration(milliseconds: 800));

                  // 2. 플래시 효과
                  ScreenEffects.flash(context);

                  // 3. 강한 진동
                  ScreenEffects.vibrate(VibrationPattern.heavy);
                },
              ),
            ],
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required List<Widget> children,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...children,
      ],
    );
  }

  Widget _buildDemoButton({
    required BuildContext context,
    required String label,
    required Color color,
    Color? textColor,
    required VoidCallback onPressed,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            foregroundColor: textColor ?? Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }
}
