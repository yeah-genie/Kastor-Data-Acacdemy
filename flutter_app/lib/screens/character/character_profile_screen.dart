import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../models/character_data.dart';
import '../../providers/settings_provider.dart';

/// 인물 프로필 상세 화면
class CharacterProfileScreen extends ConsumerWidget {
  final CharacterData character;

  const CharacterProfileScreen({
    super.key,
    required this.character,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final isKo = settings.language == 'ko';

    return Scaffold(
      backgroundColor: const Color(0xFF1A1D2E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A1D2E),
        title: Text(
          isKo ? character.nameKo : character.name,
          style: const TextStyle(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 프로필 헤더
            Center(
              child: Column(
                children: [
                  // 아바타
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [
                          _getSuspicionColor(character.suspicionLevel).withOpacity(0.3),
                          _getSuspicionColor(character.suspicionLevel).withOpacity(0.1),
                        ],
                      ),
                      border: Border.all(
                        color: _getSuspicionColor(character.suspicionLevel),
                        width: 3,
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: SvgPicture.asset(
                        character.avatar,
                        width: 88,
                        height: 88,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // 이름
                  Text(
                    isKo ? character.nameKo : character.name,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // 역할
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      isKo ? character.roleKo : character.role,
                      style: const TextStyle(
                        color: Color(0xFF6366F1),
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // 의심 수준
            _buildSectionCard(
              title: isKo ? '의심 수준' : 'Suspicion Level',
              icon: Icons.warning_amber_outlined,
              child: Row(
                children: [
                  Icon(
                    Icons.security,
                    color: _getSuspicionColor(character.suspicionLevel),
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _getSuspicionText(character.suspicionLevel, isKo),
                    style: TextStyle(
                      color: _getSuspicionColor(character.suspicionLevel),
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const Spacer(),
                  Container(
                    width: 100,
                    height: 8,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: Colors.white.withOpacity(0.1),
                    ),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: _getSuspicionLevel(character.suspicionLevel),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(4),
                          color: _getSuspicionColor(character.suspicionLevel),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 설명
            _buildSectionCard(
              title: isKo ? '인물 정보' : 'Profile',
              icon: Icons.person_outline,
              child: Text(
                isKo ? character.descriptionKo : character.description,
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.white.withOpacity(0.9),
                  height: 1.6,
                ),
              ),
            ),

            const SizedBox(height: 16),

            // 알려진 사실들
            _buildSectionCard(
              title: isKo ? '알려진 사실' : 'Known Facts',
              icon: Icons.fact_check_outlined,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: List.generate(
                  character.knownFacts.length,
                  (index) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const Color(0xFF6366F1).withOpacity(0.2),
                          ),
                          child: Center(
                            child: Text(
                              '${index + 1}',
                              style: const TextStyle(
                                color: Color(0xFF6366F1),
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            isKo
                                ? character.knownFactsKo[index]
                                : character.knownFacts[index],
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.9),
                              height: 1.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // 최근 대화
            if (character.recentDialogues.isNotEmpty)
              _buildSectionCard(
                title: isKo ? '최근 대화' : 'Recent Dialogues',
                icon: Icons.chat_bubble_outline,
                child: Column(
                  children: List.generate(
                    character.recentDialogues.length,
                    (index) {
                      final dialogue = character.recentDialogues[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.1),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  isKo ? dialogue.speakerKo : dialogue.speaker,
                                  style: const TextStyle(
                                    color: Color(0xFF6366F1),
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const Spacer(),
                                Text(
                                  dialogue.time,
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.5),
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              isKo ? dialogue.textKo : dialogue.text,
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.9),
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF1E1B4B).withOpacity(0.6),
            const Color(0xFF0F172A).withOpacity(0.6),
          ],
        ),
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
              Icon(icon, color: const Color(0xFF6366F1), size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Color _getSuspicionColor(String level) {
    switch (level) {
      case 'high':
        return const Color(0xFFEF4444);
      case 'medium':
        return const Color(0xFFFBBF24);
      case 'low':
      default:
        return const Color(0xFF10B981);
    }
  }

  String _getSuspicionText(String level, bool isKo) {
    switch (level) {
      case 'high':
        return isKo ? '높음' : 'High';
      case 'medium':
        return isKo ? '보통' : 'Medium';
      case 'low':
      default:
        return isKo ? '낮음' : 'Low';
    }
  }

  double _getSuspicionLevel(String level) {
    switch (level) {
      case 'high':
        return 0.8;
      case 'medium':
        return 0.5;
      case 'low':
      default:
        return 0.2;
    }
  }
}
