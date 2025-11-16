import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../widgets/win_rate_chart.dart';
import '../providers/settings_provider.dart';
import '../providers/story_provider_v2.dart';

/// 데이터 인사이트 패널 - 데스크톱 왼쪽 / 모바일 Drawer에 표시
class DataInsightsPanel extends ConsumerWidget {
  const DataInsightsPanel({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 900;

    return Container(
      width: isMobile ? double.infinity : 380,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF1E1B4B),
            Color(0xFF0F172A),
          ],
        ),
        border: !isMobile
            ? Border(
                right: BorderSide(
                  color: const Color(0xFF6366F1).withOpacity(0.2),
                  width: 1,
                ),
              )
            : null,
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header + 모바일 닫기 버튼
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.analytics,
                      color: Color(0xFF6366F1),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      settings.language == 'ko' ? '데이터 분석' : 'Data Insights',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  // 모바일 전용: 닫기 버튼
                  if (isMobile)
                    IconButton(
                      onPressed: () {
                        Navigator.of(ref.context).pop();
                      },
                      icon: const Icon(Icons.close, color: Colors.white70),
                      tooltip: settings.language == 'ko' ? '닫기' : 'Close',
                    ),
                ],
              ),
              const SizedBox(height: 24),

              // Case Info
              _buildInfoCard(
                title: settings.language == 'ko' ? '사건 개요' : 'Case Overview',
                icon: Icons.folder_special,
                children: [
                  _buildInfoRow(
                    '사건명' if settings.language == 'ko' else 'Case',
                    'The Missing Balance Patch',
                  ),
                  const SizedBox(height: 8),
                  _buildInfoRow(
                    '의뢰인' if settings.language == 'ko' else 'Client',
                    'Maya Zhang',
                  ),
                  const SizedBox(height: 8),
                  _buildInfoRow(
                    '상태' if settings.language == 'ko' else 'Status',
                    '조사 중' if settings.language == 'ko' else 'Investigating',
                    valueColor: const Color(0xFFFBBF24),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Shadow Win Rate Chart
              _buildInfoCard(
                title: settings.language == 'ko' ? 'Shadow 승률 추이' : 'Shadow Win Rate Trend',
                icon: Icons.trending_up,
                children: [
                  ShadowWinRateChart(
                    language: settings.language,
                    width: isMobile ? screenWidth - 80 : 340,
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Character Comparison
              _buildInfoCard(
                title: settings.language == 'ko' ? '캐릭터 승률 비교' : 'Character Win Rates',
                icon: Icons.bar_chart,
                children: [
                  CharacterComparisonChart(
                    title: '',
                    characters: [
                      CharacterWinRate(
                        name: 'Shadow',
                        winRate: 85.0,
                        color: const Color(0xFFEF4444),
                      ),
                      CharacterWinRate(
                        name: 'Luna',
                        winRate: 52.0,
                        color: const Color(0xFF3B82F6),
                      ),
                      CharacterWinRate(
                        name: 'Striker',
                        winRate: 49.5,
                        color: const Color(0xFF10B981),
                      ),
                      CharacterWinRate(
                        name: 'Mage',
                        winRate: 51.2,
                        color: const Color(0xFF8B5CF6),
                      ),
                    ],
                    width: isMobile ? screenWidth - 80 : 340,
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Key Evidence
              _buildInfoCard(
                title: settings.language == 'ko' ? '핵심 증거' : 'Key Evidence',
                icon: Icons.gavel,
                children: [
                  _buildEvidenceItem(
                    '🎮',
                    'Shadow 캐릭터' if settings.language == 'ko' else 'Shadow Character',
                    '급격한 승률 상승' if settings.language == 'ko' else 'Sudden win rate spike',
                  ),
                  const SizedBox(height: 8),
                  _buildEvidenceItem(
                    '📊',
                    '게임 로그' if settings.language == 'ko' else 'Game Logs',
                    '패턴 분석 필요' if settings.language == 'ko' else 'Pattern analysis needed',
                  ),
                  const SizedBox(height: 8),
                  _buildEvidenceItem(
                    '🔍',
                    '밸런스 패치' if settings.language == 'ko' else 'Balance Patch',
                    '의심스러운 타이밍' if settings.language == 'ko' else 'Suspicious timing',
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Quick Tips
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFF6366F1).withOpacity(0.3),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.lightbulb_outline,
                          color: Color(0xFFFBBF24),
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          settings.language == 'ko' ? '💡 팁' : '💡 Tips',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFBBF24),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      settings.language == 'ko'
                          ? '데이터를 자세히 살펴보고 Kastor와 대화하며 단서를 찾아보세요!'
                          : 'Examine the data carefully and chat with Kastor to find clues!',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.white.withOpacity(0.8),
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),

              // 모바일 전용: 설정 섹션
              if (isMobile) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.1),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.settings_outlined,
                            color: Color(0xFF6366F1),
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            settings.language == 'ko' ? '설정' : 'Settings',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // 언어 전환 버튼
                      InkWell(
                        onTap: () {
                          final newLanguage = settings.language == 'ko' ? 'en' : 'ko';
                          ref.read(settingsProvider.notifier).setLanguage(newLanguage);
                          ref.read(storyProviderV2.notifier).reloadWithLanguage(newLanguage);
                        },
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: Colors.white.withOpacity(0.1),
                            ),
                          ),
                          child: Row(
                            children: [
                              Text(
                                settings.language == 'ko' ? '🇰🇷' : '🇺🇸',
                                style: const TextStyle(fontSize: 20),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  settings.language == 'ko' ? '한국어 ↔ English' : 'English ↔ 한국어',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.white.withOpacity(0.9),
                                  ),
                                ),
                              ),
                              Icon(
                                Icons.language,
                                color: const Color(0xFF6366F1),
                                size: 18,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoCard({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF6366F1), size: 18),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: Colors.white.withOpacity(0.6),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: valueColor ?? Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildEvidenceItem(String emoji, String title, String description) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
