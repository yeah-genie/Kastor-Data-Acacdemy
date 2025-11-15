import 'package:flutter/material.dart';
import '../theme/academy_theme.dart';
import 'emoji_reaction_picker.dart';

/// 디스코드 스타일 이모지 리액션이 가능한 채팅 메시지 버블
class MessageBubbleWithReaction extends StatefulWidget {
  final String text;
  final bool isPlayerMessage;
  final String? storyTime;
  final bool hideTime;
  final String? reaction;
  final int messageIndex;
  final Function(int messageIndex, String emoji) onReactionAdded;
  final Function(int messageIndex) onReactionRemoved;

  const MessageBubbleWithReaction({
    super.key,
    required this.text,
    required this.isPlayerMessage,
    this.storyTime,
    this.hideTime = false,
    this.reaction,
    required this.messageIndex,
    required this.onReactionAdded,
    required this.onReactionRemoved,
  });

  @override
  State<MessageBubbleWithReaction> createState() =>
      _MessageBubbleWithReactionState();
}

class _MessageBubbleWithReactionState extends State<MessageBubbleWithReaction> {
  bool _showEmojiPicker = false;
  OverlayEntry? _overlayEntry;

  void _showEmojiPickerOverlay(BuildContext context) {
    // 현재 버블의 위치 계산
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final position = renderBox.localToGlobal(Offset.zero);
    final size = renderBox.size;

    _overlayEntry = OverlayEntry(
      builder: (context) => Stack(
        children: [
          // 배경 클릭 시 닫기
          Positioned.fill(
            child: GestureDetector(
              onTap: _hideEmojiPicker,
              child: Container(
                color: Colors.transparent,
              ),
            ),
          ),
          // 이모지 피커
          Positioned(
            left: widget.isPlayerMessage
                ? position.dx + size.width - 280
                : position.dx,
            top: position.dy - 150, // 버블 위에 표시
            child: Material(
              color: Colors.transparent,
              child: EmojiReactionPicker(
                onEmojiSelected: (emoji) {
                  widget.onReactionAdded(widget.messageIndex, emoji);
                },
                onClose: _hideEmojiPicker,
              ),
            ),
          ),
        ],
      ),
    );

    Overlay.of(context).insert(_overlayEntry!);
    setState(() {
      _showEmojiPicker = true;
    });
  }

  void _hideEmojiPicker() {
    _overlayEntry?.remove();
    _overlayEntry = null;
    setState(() {
      _showEmojiPicker = false;
    });
  }

  @override
  void dispose() {
    _hideEmojiPicker();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: widget.isPlayerMessage
          ? CrossAxisAlignment.end
          : CrossAxisAlignment.start,
      children: [
        // Message content with KakaoTalk-style bubble
        Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            // Time on left for others' messages
            if (!widget.isPlayerMessage &&
                !widget.hideTime &&
                widget.storyTime != null)
              Padding(
                padding: const EdgeInsets.only(right: 6, bottom: 2),
                child: Text(
                  widget.storyTime!,
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey[600],
                  ),
                ),
              ),

            // Bubble with long press detection
            Flexible(
              child: GestureDetector(
                onLongPress: () {
                  _showEmojiPickerOverlay(context);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: widget.isPlayerMessage
                        ? AcademyColors.neonCyan
                        : const Color(0xFF2D3348),
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(18),
                      topRight: const Radius.circular(18),
                      bottomLeft: Radius.circular(widget.isPlayerMessage ? 18 : 4),
                      bottomRight: Radius.circular(widget.isPlayerMessage ? 4 : 18),
                    ),
                    boxShadow: widget.isPlayerMessage
                        ? [
                            BoxShadow(
                              color: AcademyColors.neonCyan.withOpacity(0.3),
                              blurRadius: 10,
                              spreadRadius: 1,
                            ),
                          ]
                        : [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                  ),
                  child: Text(
                    widget.text,
                    style: TextStyle(
                      fontSize: 15,
                      color: widget.isPlayerMessage
                          ? AcademyColors.midnight
                          : Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),

            // Time on right for player messages
            if (widget.isPlayerMessage &&
                !widget.hideTime &&
                widget.storyTime != null)
              Padding(
                padding: const EdgeInsets.only(left: 6, bottom: 2),
                child: Text(
                  widget.storyTime!,
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey[600],
                  ),
                ),
              ),
          ],
        ),

        // Reaction emoji if present (Discord-style)
        if (widget.reaction != null)
          Padding(
            padding: const EdgeInsets.only(top: 6, left: 12),
            child: EmojiReaction(
              emoji: widget.reaction!,
              count: 1,
              isReactedByUser: true,
              onTap: () {
                widget.onReactionRemoved(widget.messageIndex);
              },
            ),
          ),
      ],
    );
  }
}
