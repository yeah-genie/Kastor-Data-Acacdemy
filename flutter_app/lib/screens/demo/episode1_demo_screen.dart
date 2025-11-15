import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../story/story_chat_screen_v2.dart';
import '../../widgets/win_rate_chart.dart';
import '../../providers/settings_provider.dart';

/// Demo screen to showcase Episode 1 with all new features:
/// - Language switching (Korean/English)
/// - Character avatars
/// - Chat UI
/// - Data visualization
class Episode1DemoScreen extends ConsumerWidget {
  const Episode1DemoScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          settings.language == 'ko'
              ? '캐스터 데이터 아카데미'
              : 'Kastor Data Academy',
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              _showInfoDialog(context, settings.language);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Welcome card
            Card(
              color: const Color(0xFF6366F1).withOpacity(0.2),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      settings.language == 'ko'
                          ? '🎮 에피소드 1: 사라진 밸런스 패치'
                          : '🎮 Episode 1: The Missing Balance Patch',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      settings.language == 'ko'
                          ? '셰도우 캐릭터의 승률이 하루 만에 50%에서 85%로 급등했습니다! 캐스터와 함께 이 미스터리를 풀어보세요.'
                          : 'Shadow\'s win rate jumped from 50% to 85% in just one day! Solve this mystery with Kastor.',
                      style: const TextStyle(
                        fontSize: 16,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.language, size: 20, color: Color(0xFFFBBF24)),
                        const SizedBox(width: 8),
                        Text(
                          settings.language == 'ko'
                              ? '언어 전환 기능 지원'
                              : 'Language switching supported',
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.chat_bubble_outline, size: 20, color: Color(0xFFFBBF24)),
                        const SizedBox(width: 8),
                        Text(
                          settings.language == 'ko'
                              ? '채팅 방식 스토리 진행'
                              : 'Chat-based story progression',
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.insert_chart, size: 20, color: Color(0xFFFBBF24)),
                        const SizedBox(width: 8),
                        Text(
                          settings.language == 'ko'
                              ? '실시간 데이터 시각화'
                              : 'Real-time data visualization',
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Data visualization preview
            Text(
              settings.language == 'ko'
                  ? '📊 데이터 미리보기'
                  : '📊 Data Preview',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            ShadowWinRateChart(language: settings.language),

            const SizedBox(height: 16),

            CharacterComparisonChart(
              title: settings.language == 'ko'
                  ? '캐릭터별 승률 비교'
                  : 'Character Win Rate Comparison',
              characters: [
                CharacterWinRate(
                  name: 'Shadow',
                  winRate: 85.0,
                  color: const Color(0xFFEF4444), // Red - suspicious
                ),
                CharacterWinRate(
                  name: 'Luna',
                  winRate: 52.0,
                  color: const Color(0xFF3B82F6), // Blue
                ),
                CharacterWinRate(
                  name: 'Striker',
                  winRate: 49.5,
                  color: const Color(0xFF10B981), // Green
                ),
                CharacterWinRate(
                  name: 'Mage',
                  winRate: 51.2,
                  color: const Color(0xFF8B5CF6), // Purple
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Start button
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const StoryChatScreenV2(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 20),
                backgroundColor: const Color(0xFF6366F1),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.play_arrow, size: 28),
                  const SizedBox(width: 12),
                  Text(
                    settings.language == 'ko'
                        ? '에피소드 시작하기'
                        : 'Start Episode',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Language switch button
            OutlinedButton(
              onPressed: () {
                final newLang = settings.language == 'ko' ? 'en' : 'ko';
                ref.read(settingsProvider.notifier).setLanguage(newLang);
              },
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                side: const BorderSide(color: Color(0xFF6366F1), width: 2),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.language),
                  const SizedBox(width: 12),
                  Text(
                    settings.language == 'ko'
                        ? 'Switch to English 🇺🇸'
                        : '한국어로 전환 🇰🇷',
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Features list
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      settings.language == 'ko'
                          ? '✨ 새로운 기능'
                          : '✨ New Features',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildFeatureItem(
                      icon: Icons.translate,
                      title: settings.language == 'ko'
                          ? '언어 전환'
                          : 'Language Switching',
                      description: settings.language == 'ko'
                          ? '한국어와 영어 사이에서 자유롭게 전환'
                          : 'Switch freely between Korean and English',
                    ),
                    const Divider(height: 24),
                    _buildFeatureItem(
                      icon: Icons.person,
                      title: settings.language == 'ko'
                          ? '캐릭터 아바타'
                          : 'Character Avatars',
                      description: settings.language == 'ko'
                          ? '캐스터, 탐정, 마야의 귀여운 아바타'
                          : 'Cute avatars for Kastor, Detective, and Maya',
                    ),
                    const Divider(height: 24),
                    _buildFeatureItem(
                      icon: Icons.chat,
                      title: settings.language == 'ko'
                          ? '채팅 UI'
                          : 'Chat UI',
                      description: settings.language == 'ko'
                          ? '메신저처럼 편한 대화 인터페이스'
                          : 'Comfortable conversation interface like a messenger',
                    ),
                    const Divider(height: 24),
                    _buildFeatureItem(
                      icon: Icons.insert_chart,
                      title: settings.language == 'ko'
                          ? '데이터 시각화'
                          : 'Data Visualization',
                      description: settings.language == 'ko'
                          ? '승률 추이와 비교 차트'
                          : 'Win rate trends and comparison charts',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureItem({
    required IconData icon,
    required String title,
    required String description,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: const Color(0xFF6366F1)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[400],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showInfoDialog(BuildContext context, String language) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          language == 'ko' ? '정보' : 'Information',
        ),
        content: Text(
          language == 'ko'
              ? '이것은 캐스터 데이터 아카데미 에피소드 1의 개선된 버전입니다.\n\n'
                  '• 한국어/영어 지원\n'
                  '• 캐릭터 아바타\n'
                  '• 채팅 인터페이스\n'
                  '• 데이터 시각화\n\n'
                  '즐거운 학습 되세요!'
              : 'This is the improved version of Kastor Data Academy Episode 1.\n\n'
                  '• Korean/English support\n'
                  '• Character avatars\n'
                  '• Chat interface\n'
                  '• Data visualization\n\n'
                  'Enjoy learning!',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(language == 'ko' ? '확인' : 'OK'),
          ),
        ],
      ),
    );
  }
}
