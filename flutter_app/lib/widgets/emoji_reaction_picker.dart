import 'package:flutter/material.dart';
import '../theme/academy_theme.dart';

/// 디스코드 스타일 이모지 리액션 피커
class EmojiReactionPicker extends StatelessWidget {
  final Function(String) onEmojiSelected;
  final VoidCallback onClose;

  const EmojiReactionPicker({
    super.key,
    required this.onEmojiSelected,
    required this.onClose,
  });

  // 자주 사용하는 이모지 (디스코드 스타일)
  static const List<String> quickEmojis = [
    '😂', '❤️', '👍', '👎', '😮', '😢',
    '😡', '🎉', '🔥', '✨', '💯', '👀',
    '🤔', '😅', '🙏', '💀', '🎊', '⭐',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AcademyColors.deepAcademyPurple.withOpacity(0.95),
            AcademyColors.midnight.withOpacity(0.95),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AcademyColors.neonCyan.withOpacity(0.3),
          width: 2,
        ),
        boxShadow: NeonGlow.cyan(intensity: 0.5, blur: 20),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '리액션 추가',
                style: TextStyle(
                  fontFamily: 'Space Grotesk',
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AcademyColors.neonCyan,
                ),
              ),
              IconButton(
                icon: const Icon(
                  Icons.close,
                  size: 18,
                  color: AcademyColors.slate,
                ),
                onPressed: onClose,
                constraints: const BoxConstraints(),
                padding: EdgeInsets.zero,
              ),
            ],
          ),
          const SizedBox(height: 8),
          
          // Emoji Grid
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: quickEmojis.map((emoji) {
              return _EmojiButton(
                emoji: emoji,
                onTap: () {
                  onEmojiSelected(emoji);
                  onClose();
                },
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _EmojiButton extends StatefulWidget {
  final String emoji;
  final VoidCallback onTap;

  const _EmojiButton({
    required this.emoji,
    required this.onTap,
  });

  @override
  State<_EmojiButton> createState() => _EmojiButtonState();
}

class _EmojiButtonState extends State<_EmojiButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: _isHovered
                ? AcademyColors.neonCyan.withOpacity(0.2)
                : AcademyColors.slate.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: _isHovered
                  ? AcademyColors.neonCyan.withOpacity(0.5)
                  : Colors.transparent,
              width: 2,
            ),
          ),
          child: Center(
            child: Text(
              widget.emoji,
              style: TextStyle(
                fontSize: _isHovered ? 26 : 24,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 메시지에 붙는 이모지 리액션 표시
class EmojiReaction extends StatelessWidget {
  final String emoji;
  final int count;
  final bool isReactedByUser;
  final VoidCallback onTap;

  const EmojiReaction({
    super.key,
    required this.emoji,
    required this.count,
    this.isReactedByUser = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          gradient: isReactedByUser
              ? LinearGradient(
                  colors: [
                    AcademyColors.neonCyan.withOpacity(0.2),
                    AcademyColors.electricViolet.withOpacity(0.2),
                  ],
                )
              : null,
          color: isReactedByUser ? null : AcademyColors.slate.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isReactedByUser
                ? AcademyColors.neonCyan.withOpacity(0.6)
                : AcademyColors.slate.withOpacity(0.3),
            width: isReactedByUser ? 2 : 1,
          ),
          boxShadow: isReactedByUser
              ? [
                  BoxShadow(
                    color: AcademyColors.neonCyan.withOpacity(0.3),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              emoji,
              style: const TextStyle(fontSize: 16),
            ),
            if (count > 1) ...[
              const SizedBox(width: 4),
              Text(
                count.toString(),
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isReactedByUser
                      ? AcademyColors.neonCyan
                      : AcademyColors.slate,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
