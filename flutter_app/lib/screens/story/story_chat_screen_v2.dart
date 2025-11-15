import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../providers/story_provider_v2.dart';
import '../../providers/settings_provider.dart';

class StoryChatScreenV2 extends ConsumerStatefulWidget {
  const StoryChatScreenV2({super.key});

  @override
  ConsumerState<StoryChatScreenV2> createState() => _StoryChatScreenV2State();
}

class _StoryChatScreenV2State extends ConsumerState<StoryChatScreenV2> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _inputController = TextEditingController();

  @override
  void dispose() {
    _scrollController.dispose();
    _inputController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _getAvatarPath(String speaker) {
    switch (speaker.toLowerCase()) {
      case 'kastor':
        return 'assets/characters/kastor.svg';
      case 'detective':
        return 'assets/characters/detective.svg';
      case 'maya':
        return 'assets/characters/maya.svg';
      case 'narrator':
        return 'assets/characters/narrator.svg';
      case 'system':
        return 'assets/characters/system.svg';
      default:
        return 'assets/characters/narrator.svg';
    }
  }

  Color _getSpeakerColor(String speaker) {
    switch (speaker.toLowerCase()) {
      case 'kastor':
        return const Color(0xFF6366F1); // Indigo
      case 'detective':
        return const Color(0xFF10B981); // Green
      case 'maya':
        return const Color(0xFFEC4899); // Pink
      case 'narrator':
        return const Color(0xFF64748B); // Slate
      case 'system':
        return const Color(0xFF3B82F6); // Blue
      default:
        return const Color(0xFF64748B);
    }
  }

  String _getSpeakerDisplayName(String speaker, String language) {
    final names = {
      'kastor': {'en': 'Kastor', 'ko': '캐스터'},
      'detective': {'en': 'Detective', 'ko': '탐정'},
      'maya': {'en': 'Maya', 'ko': '마야'},
      'narrator': {'en': 'Narrator', 'ko': '나레이터'},
      'system': {'en': 'System', 'ko': '시스템'},
    };

    return names[speaker.toLowerCase()]?[language] ?? speaker;
  }

  @override
  Widget build(BuildContext context) {
    final storyState = ref.watch(storyProviderV2);
    final settings = ref.watch(settingsProvider);

    // Scroll to bottom when new messages arrive
    if (storyState.messages.isNotEmpty) {
      _scrollToBottom();
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          settings.language == 'ko' ? '에피소드 1: 사라진 밸런스 패치' : 'Episode 1: The Missing Balance Patch',
        ),
        actions: [
          // Language switcher
          PopupMenuButton<String>(
            icon: const Icon(Icons.language),
            onSelected: (String lang) async {
              ref.read(settingsProvider.notifier).setLanguage(lang);
              await ref.read(storyProviderV2.notifier).reloadWithLanguage(lang);
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(
                value: 'en',
                child: Row(
                  children: [
                    Text('🇺🇸'),
                    SizedBox(width: 8),
                    Text('English'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'ko',
                child: Row(
                  children: [
                    Text('🇰🇷'),
                    SizedBox(width: 8),
                    Text('한국어'),
                  ],
                ),
              ),
            ],
          ),
          // Investigation points
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.star, size: 16, color: Color(0xFFFBBF24)),
                    const SizedBox(width: 4),
                    Text(
                      '${storyState.investigationPoints}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFFBBF24),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      body: storyState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Message list
                Expanded(
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: storyState.messages.length,
                    itemBuilder: (context, index) {
                      final message = storyState.messages[index];
                      final isPlayerMessage = message.speaker == 'detective';

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: isPlayerMessage
                              ? MainAxisAlignment.end
                              : MainAxisAlignment.start,
                          children: [
                            if (!isPlayerMessage) ...[
                              // Avatar for non-player messages
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _getSpeakerColor(message.speaker).withOpacity(0.2),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(6.0),
                                  child: SvgPicture.asset(
                                    _getAvatarPath(message.speaker),
                                    width: 28,
                                    height: 28,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                            ],

                            // Message bubble
                            Flexible(
                              child: Column(
                                crossAxisAlignment: isPlayerMessage
                                    ? CrossAxisAlignment.end
                                    : CrossAxisAlignment.start,
                                children: [
                                  // Speaker name
                                  if (!isPlayerMessage)
                                    Padding(
                                      padding: const EdgeInsets.only(bottom: 4, left: 12),
                                      child: Text(
                                        _getSpeakerDisplayName(message.speaker, settings.language),
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: _getSpeakerColor(message.speaker),
                                        ),
                                      ),
                                    ),

                                  // Message content
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 12,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isPlayerMessage
                                          ? const Color(0xFF10B981).withOpacity(0.2)
                                          : _getSpeakerColor(message.speaker).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isPlayerMessage
                                            ? const Color(0xFF10B981).withOpacity(0.3)
                                            : _getSpeakerColor(message.speaker).withOpacity(0.3),
                                        width: 1,
                                      ),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        // Email header if present
                                        if (message.emailData != null) ...[
                                          Container(
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFF3B82F6).withOpacity(0.1),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    const Icon(
                                                      Icons.email,
                                                      size: 16,
                                                      color: Color(0xFF3B82F6),
                                                    ),
                                                    const SizedBox(width: 8),
                                                    Expanded(
                                                      child: Text(
                                                        message.emailData!['from'] ?? 'Unknown',
                                                        style: const TextStyle(
                                                          fontWeight: FontWeight.bold,
                                                          fontSize: 14,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  message.emailData!['subject'] ?? '',
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.w600,
                                                    fontSize: 13,
                                                  ),
                                                ),
                                                if (message.emailData!['body'] != null) ...[
                                                  const SizedBox(height: 8),
                                                  Text(
                                                    message.emailData!['body'],
                                                    style: const TextStyle(fontSize: 13),
                                                  ),
                                                ],
                                              ],
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                        ],

                                        // Message text
                                        Text(
                                          message.text,
                                          style: const TextStyle(fontSize: 15),
                                        ),

                                        // Reaction emoji if present
                                        if (message.reaction != null)
                                          Padding(
                                            padding: const EdgeInsets.only(top: 8),
                                            child: Text(
                                              message.reaction!,
                                              style: const TextStyle(fontSize: 20),
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),

                                  // Timestamp
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4, left: 12, right: 12),
                                    child: Text(
                                      '${message.timestamp.hour}:${message.timestamp.minute.toString().padLeft(2, '0')}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            if (isPlayerMessage) ...[
                              const SizedBox(width: 12),
                              // Avatar for player messages
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: const Color(0xFF10B981).withOpacity(0.2),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(6.0),
                                  child: SvgPicture.asset(
                                    _getAvatarPath('detective'),
                                    width: 28,
                                    height: 28,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      );
                    },
                  ),
                ),

                // Choices section
                if (storyState.currentChoices != null && storyState.currentChoices!.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withOpacity(0.1),
                      border: Border(
                        top: BorderSide(
                          color: const Color(0xFF6366F1).withOpacity(0.3),
                          width: 2,
                        ),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          settings.language == 'ko' ? '선택하세요:' : 'Choose:',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 12),
                        ...storyState.currentChoices!.map((choice) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: ElevatedButton(
                              onPressed: () {
                                ref.read(storyProviderV2.notifier).makeChoice(choice.id);
                              },
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 16,
                                ),
                                backgroundColor: const Color(0xFF6366F1).withOpacity(0.2),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Text(
                                choice.text,
                                style: const TextStyle(fontSize: 15),
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  ),

                // Input section
                if (storyState.waitingForInput)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.1),
                      border: Border(
                        top: BorderSide(
                          color: const Color(0xFF10B981).withOpacity(0.3),
                          width: 2,
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _inputController,
                            decoration: InputDecoration(
                              hintText: storyState.inputPrompt ??
                                  (settings.language == 'ko' ? '입력하세요...' : 'Type here...'),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.1),
                            ),
                            onSubmitted: (value) {
                              if (value.isNotEmpty) {
                                ref.read(storyProviderV2.notifier).submitDetectiveName(value);
                                _inputController.clear();
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          onPressed: () {
                            if (_inputController.text.isNotEmpty) {
                              ref.read(storyProviderV2.notifier)
                                  .submitDetectiveName(_inputController.text);
                              _inputController.clear();
                            }
                          },
                          icon: const Icon(Icons.send),
                          style: IconButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),

                // Continue button (for manual mode)
                if (!settings.autoTextMode &&
                    !storyState.waitingForInput &&
                    storyState.currentChoices == null)
                  Container(
                    padding: const EdgeInsets.all(16),
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        ref.read(storyProviderV2.notifier).continueStory();
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: const Color(0xFF6366F1),
                      ),
                      child: Text(
                        settings.language == 'ko' ? '계속 →' : 'Continue →',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ),

                // Pending messages indicator
                if (storyState.pendingMessages > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          settings.language == 'ko'
                              ? '${storyState.pendingMessages}개 메시지 대기 중...'
                              : '${storyState.pendingMessages} message(s) pending...',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
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
