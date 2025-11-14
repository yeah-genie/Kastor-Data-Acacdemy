import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../models/statistics.dart';

class StatisticsScreen extends StatelessWidget {
  final Statistics statistics;

  const StatisticsScreen({
    super.key,
    required this.statistics,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('통계'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildOverviewCard(),
            const SizedBox(height: 16),
            _buildAccuracyCard(),
            const SizedBox(height: 16),
            _buildProgressCard(),
            const SizedBox(height: 16),
            _buildDetailsCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '전체 개요',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    icon: Icons.access_time,
                    label: '플레이 시간',
                    value: statistics.totalPlayTime,
                    color: Colors.blue,
                  ),
                ),
                Expanded(
                  child: _buildStatItem(
                    icon: Icons.emoji_events,
                    label: '완료한 에피소드',
                    value: statistics.episodesCompleted.toString(),
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccuracyCard() {
    final accuracy = statistics.accuracy;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '정확도',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  sections: [
                    PieChartSectionData(
                      value: statistics.correctChoices.toDouble(),
                      title: '정답\n${statistics.correctChoices}',
                      color: Colors.green,
                      radius: 100,
                    ),
                    PieChartSectionData(
                      value: (statistics.totalChoicesMade -
                              statistics.correctChoices)
                          .toDouble(),
                      title:
                          '오답\n${statistics.totalChoicesMade - statistics.correctChoices}',
                      color: Colors.red,
                      radius: 100,
                    ),
                  ],
                  centerSpaceRadius: 40,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: Text(
                '정답률: ${accuracy.toStringAsFixed(1)}%',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '수집 진행도',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            _buildProgressItem(
              '증거 수집',
              statistics.evidenceCollected,
              color: Colors.amber,
              icon: Icons.folder_special,
            ),
            const SizedBox(height: 12),
            _buildProgressItem(
              '업적 달성',
              statistics.achievementsUnlocked,
              color: Colors.purple,
              icon: Icons.emoji_events,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '상세 정보',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildDetailRow('총 선택 횟수', statistics.totalChoicesMade.toString()),
            _buildDetailRow('정답 횟수', statistics.correctChoices.toString()),
            _buildDetailRow('사용한 힌트', statistics.hintsUsed.toString()),
            if (statistics.firstPlayedAt != null)
              _buildDetailRow(
                '첫 플레이',
                _formatDate(statistics.firstPlayedAt!),
              ),
            if (statistics.lastPlayedAt != null)
              _buildDetailRow(
                '마지막 플레이',
                _formatDate(statistics.lastPlayedAt!),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 32),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildProgressItem(
    String label,
    int value, {
    required Color color,
    required IconData icon,
  }) {
    return Row(
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Expanded(
                    child: LinearProgressIndicator(
                      value: value / 100,
                      backgroundColor: color.withValues(alpha: 0.2),
                      valueColor: AlwaysStoppedAnimation(color),
                      minHeight: 8,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    value.toString(),
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade700,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.year}.${date.month.toString().padLeft(2, '0')}.${date.day.toString().padLeft(2, '0')}';
  }
}
