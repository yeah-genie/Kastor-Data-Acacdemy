import 'package:flutter/material.dart';
import '../../models/achievement.dart';

class AchievementsScreen extends StatelessWidget {
  final List<Achievement> achievements;

  const AchievementsScreen({
    super.key,
    required this.achievements,
  });

  @override
  Widget build(BuildContext context) {
    final unlockedCount =
        achievements.where((a) => a.isUnlocked).length;
    final totalPoints = achievements
        .where((a) => a.isUnlocked)
        .fold(0, (sum, a) => sum + a.points);

    return Scaffold(
      appBar: AppBar(
        title: const Text('업적'),
      ),
      body: Column(
        children: [
          _buildHeader(unlockedCount, totalPoints),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: achievements.length,
              itemBuilder: (context, index) {
                return _buildAchievementCard(
                  context,
                  achievements[index],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(int unlockedCount, int totalPoints) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade700, Colors.blue.shade500],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatItem(
                icon: Icons.emoji_events,
                label: '획득한 업적',
                value: '$unlockedCount/${achievements.length}',
              ),
              _buildStatItem(
                icon: Icons.stars,
                label: '총 포인트',
                value: totalPoints.toString(),
              ),
            ],
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: unlockedCount / achievements.length,
            backgroundColor: Colors.white.withValues(alpha: 0.3),
            valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 32),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.9),
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildAchievementCard(BuildContext context, Achievement achievement) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: achievement.isUnlocked ? 4 : 1,
      child: Opacity(
        opacity: achievement.isUnlocked ? 1.0 : 0.5,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: achievement.isUnlocked
                      ? Colors.amber.shade100
                      : Colors.grey.shade200,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _getIconForAchievement(achievement.type),
                  size: 32,
                  color: achievement.isUnlocked
                      ? Colors.amber.shade700
                      : Colors.grey.shade400,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            achievement.title,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: achievement.isUnlocked
                                  ? Colors.black
                                  : Colors.grey.shade600,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '+${achievement.points}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue.shade700,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      achievement.description,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey.shade700,
                      ),
                    ),
                    if (achievement.isUnlocked && achievement.unlockedAt != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        '획득: ${_formatDate(achievement.unlockedAt!)}',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade500,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getIconForAchievement(AchievementType type) {
    switch (type) {
      case AchievementType.firstCase:
        return Icons.flag;
      case AchievementType.perfectDeduction:
        return Icons.psychology;
      case AchievementType.allEvidence:
        return Icons.folder_special;
      case AchievementType.speedRun:
        return Icons.speed;
      case AchievementType.noHints:
        return Icons.local_fire_department;
      case AchievementType.allEpisodes:
        return Icons.done_all;
      case AchievementType.masterDetective:
        return Icons.emoji_events;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year}.${date.month}.${date.day}';
  }
}
