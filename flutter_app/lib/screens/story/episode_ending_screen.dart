import 'package:flutter/material.dart';
import '../../theme/academy_theme.dart';

/// 에피소드 완료 화면 - Neo-Academic 스타일
class EpisodeEndingScreen extends StatelessWidget {
  final String episodeTitle;
  final int totalScore;
  final int investigationPoints;
  final List<String> choicesMade;
  final String detectiveName;
  final VoidCallback onReplay;
  final VoidCallback onNextEpisode;
  final VoidCallback onHome;

  const EpisodeEndingScreen({
    super.key,
    required this.episodeTitle,
    required this.totalScore,
    required this.investigationPoints,
    required this.choicesMade,
    required this.detectiveName,
    required this.onReplay,
    required this.onNextEpisode,
    required this.onHome,
  });

  String _getGradeEmoji(int score) {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🥇';
    if (score >= 70) return '🥈';
    if (score >= 60) return '🥉';
    return '📊';
  }

  String _getGradeText(int score) {
    if (score >= 90) return 'S급 탐정';
    if (score >= 80) return 'A급 탐정';
    if (score >= 70) return 'B급 탐정';
    if (score >= 60) return 'C급 탐정';
    return '견습 탐정';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AcademyColors.academicGradient,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 40),

                // 완료 배지
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0.0, end: 1.0),
                  duration: const Duration(milliseconds: 800),
                  curve: Curves.elasticOut,
                  builder: (context, value, child) {
                    return Transform.scale(
                      scale: value,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              AcademyColors.neonCyan.withOpacity(0.3),
                              AcademyColors.electricViolet.withOpacity(0.3),
                            ],
                          ),
                          boxShadow: NeonGlow.cyan(intensity: 0.8, blur: 30),
                        ),
                        child: Center(
                          child: Text(
                            _getGradeEmoji(totalScore),
                            style: const TextStyle(fontSize: 60),
                          ),
                        ),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 24),

                // 축하 메시지
                Text(
                  '사건 해결 완료!',
                  style: TextStyle(
                    fontFamily: 'Playfair Display',
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: AcademyColors.creamPaper,
                    shadows: [
                      Shadow(
                        color: AcademyColors.neonCyan.withOpacity(0.5),
                        blurRadius: 10,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 8),

                Text(
                  episodeTitle,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontFamily: 'Cinzel',
                    fontSize: 18,
                    color: AcademyColors.slate.withOpacity(0.9),
                    letterSpacing: 1,
                  ),
                ),

                const SizedBox(height: 32),

                // 점수 카드
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AcademyColors.deepAcademyPurple.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AcademyColors.neonCyan.withOpacity(0.3),
                      width: 2,
                    ),
                    boxShadow: NeonGlow.cyan(intensity: 0.3, blur: 15),
                  ),
                  child: Column(
                    children: [
                      // 등급
                      Text(
                        _getGradeText(totalScore),
                        style: const TextStyle(
                          fontFamily: 'Cinzel',
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AcademyColors.neonCyan,
                        ),
                      ),

                      const SizedBox(height: 16),

                      // 점수 표시
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _ScoreItem(
                            icon: '⭐',
                            label: '총점',
                            value: '$totalScore점',
                          ),
                          _ScoreItem(
                            icon: '🔍',
                            label: '수사력',
                            value: '$investigationPoints',
                          ),
                          _ScoreItem(
                            icon: '📝',
                            label: '선택',
                            value: '${choicesMade.length}개',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // 탐정 이름
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: AcademyColors.midnight.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AcademyColors.electricViolet.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        '🕵️',
                        style: TextStyle(fontSize: 20),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '탐정 $detectiveName',
                        style: TextStyle(
                          fontFamily: 'Space Grotesk',
                          fontSize: 16,
                          color: AcademyColors.creamPaper,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // 선택한 결정들 요약
                if (choicesMade.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AcademyColors.midnight.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: AcademyColors.slate.withOpacity(0.3),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.description,
                              size: 20,
                              color: AcademyColors.electricViolet,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '주요 결정 기록',
                              style: TextStyle(
                                fontFamily: 'Space Grotesk',
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: AcademyColors.creamPaper,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        ...choicesMade.take(5).map((choice) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '• ',
                                    style: TextStyle(
                                      color: AcademyColors.neonCyan,
                                      fontSize: 16,
                                    ),
                                  ),
                                  Expanded(
                                    child: Text(
                                      choice,
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: AcademyColors.slate,
                                        height: 1.4,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )),
                        if (choicesMade.length > 5)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              '외 ${choicesMade.length - 5}개 결정...',
                              style: TextStyle(
                                fontSize: 12,
                                color: AcademyColors.slate.withOpacity(0.7),
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                ],

                // 액션 버튼들
                Column(
                  children: [
                    // 다음 에피소드
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: onNextEpisode,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AcademyColors.neonCyan,
                          foregroundColor: AcademyColors.midnight,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 2,
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '다음 에피소드',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward, size: 20),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // 다시하기
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: OutlinedButton(
                        onPressed: onReplay,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AcademyColors.electricViolet,
                          side: BorderSide(
                            color: AcademyColors.electricViolet.withOpacity(0.5),
                            width: 2,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.replay, size: 20),
                            SizedBox(width: 8),
                            Text(
                              '다시 도전하기',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // 홈으로
                    TextButton(
                      onPressed: onHome,
                      child: Text(
                        '홈으로 돌아가기',
                        style: TextStyle(
                          fontSize: 14,
                          color: AcademyColors.slate,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ScoreItem extends StatelessWidget {
  final String icon;
  final String label;
  final String value;

  const _ScoreItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          icon,
          style: const TextStyle(fontSize: 32),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: AcademyColors.slate.withOpacity(0.8),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AcademyColors.creamPaper,
          ),
        ),
      ],
    );
  }
}
