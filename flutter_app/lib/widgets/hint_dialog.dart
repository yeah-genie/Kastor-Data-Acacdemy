import 'package:flutter/material.dart';
import '../models/hint_system.dart';

class HintDialog extends StatelessWidget {
  final Hint hint;
  final int remainingPoints;
  final VoidCallback onUseHint;

  const HintDialog({
    super.key,
    required this.hint,
    required this.remainingPoints,
    required this.onUseHint,
  });

  @override
  Widget build(BuildContext context) {
    final canAfford = remainingPoints >= hint.cost;

    return AlertDialog(
      title: Row(
        children: [
          Icon(
            Icons.lightbulb_outline,
            color: _getLevelColor(hint.level),
          ),
          const SizedBox(width: 8),
          const Text('힌트'),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _buildLevelBadge(hint.level),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.amber.shade100,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.stars,
                      size: 16,
                      color: Colors.amber.shade700,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${hint.cost} 포인트',
                      style: TextStyle(
                        color: Colors.amber.shade700,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.blue.shade200),
            ),
            child: Text(
              hint.text,
              style: const TextStyle(fontSize: 15),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '남은 힌트 포인트: $remainingPoints',
            style: TextStyle(
              fontSize: 13,
              color: canAfford ? Colors.grey.shade600 : Colors.red,
            ),
          ),
          if (!canAfford)
            Text(
              '포인트가 부족합니다!',
              style: TextStyle(
                fontSize: 13,
                color: Colors.red.shade700,
                fontWeight: FontWeight.bold,
              ),
            ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('취소'),
        ),
        ElevatedButton(
          onPressed: canAfford
              ? () {
                  onUseHint();
                  Navigator.pop(context);
                }
              : null,
          child: const Text('힌트 사용'),
        ),
      ],
    );
  }

  Widget _buildLevelBadge(HintLevel level) {
    final (label, color) = switch (level) {
      HintLevel.subtle => ('간접적', Colors.green),
      HintLevel.helpful => ('유용한', Colors.orange),
      HintLevel.direct => ('직접적', Colors.red),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color.shade700,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Color _getLevelColor(HintLevel level) {
    return switch (level) {
      HintLevel.subtle => Colors.green,
      HintLevel.helpful => Colors.orange,
      HintLevel.direct => Colors.red,
    };
  }
}

class HintButton extends StatelessWidget {
  final VoidCallback onPressed;
  final int remainingPoints;

  const HintButton({
    super.key,
    required this.onPressed,
    required this.remainingPoints,
  });

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: onPressed,
      icon: const Icon(Icons.lightbulb_outline),
      label: Text('힌트 ($remainingPoints)'),
      backgroundColor: Colors.amber,
    );
  }
}
