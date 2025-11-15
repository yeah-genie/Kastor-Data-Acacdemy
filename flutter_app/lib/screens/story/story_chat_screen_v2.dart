import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../providers/story_provider_v2.dart';
import '../../providers/settings_provider.dart';
import '../../widgets/notification_overlay.dart';
import '../../widgets/screen_effects.dart';
import '../../widgets/email_fullscreen.dart';
import '../../widgets/typing_text.dart';
import '../../widgets/realistic_notification.dart';

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
      backgroundColor: const Color(0xFF1A1D2E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A1D2E),
        elevation: 0,
        title: Text(
          settings.language == 'ko' ? 'EP1: 사라진 밸런스 패치' : 'EP1: The Missing Balance Patch',
          style: const TextStyle(
            fontSize: 16,
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
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
                      final prevMessage = index > 0 ? storyState.messages[index - 1] : null;
                      final isPlayerMessage = message.speaker == 'detective';
                      
                      // Check if we should hide avatar (same speaker consecutive messages)
                      final hideAvatar = prevMessage != null && 
                          prevMessage.speaker == message.speaker &&
                          !message.isNarration &&
                          !prevMessage.isNarration;
                      
                      // Check if we should hide time (within 1 minute of previous message)
                      final hideTime = prevMessage != null &&
                          prevMessage.speaker == message.speaker &&
                          message.storyTime == prevMessage.storyTime;

                      // Typing indicator
                      if (message.isTypingIndicator) {
                        return _buildTypingIndicator(message, settings);
                      }

                      // Narration (centered box)
                      if (message.speaker == 'narrator') {
                        return _buildNarrationWidget(message, settings);
                      }

                      // System message (centered notification)
                      if (message.speaker == 'system') {
                        return _buildSystemWidget(message, settings);
                      }

                      // Email card
                      if (message.isEmail) {
                        return _buildEmailCard(message, settings);
                      }

                      // Data log card
                      if (message.isDataLog) {
                        return _buildDataLogCard(message, settings);
                      }

                      // Regular chat message
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: isPlayerMessage
                              ? MainAxisAlignment.end
                              : MainAxisAlignment.start,
                          children: [
                            // Avatar (hide if consecutive message from same person)
                            if (!isPlayerMessage && !hideAvatar) ...[
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      _getSpeakerColor(message.speaker).withOpacity(0.3),
                                      _getSpeakerColor(message.speaker).withOpacity(0.1),
                                    ],
                                  ),
                                  border: Border.all(
                                    color: _getSpeakerColor(message.speaker).withOpacity(0.5),
                                    width: 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: _getSpeakerColor(message.speaker).withOpacity(0.4),
                                      blurRadius: 12,
                                      spreadRadius: 2,
                                    ),
                                  ],
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: SvgPicture.asset(
                                    _getAvatarPath(message.speaker),
                                    width: 44,
                                    height: 44,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                            ] else if (!isPlayerMessage && hideAvatar) ...[
                              const SizedBox(width: 72), // Space for hidden avatar (increased)
                            ],

                            // Message bubble
                            Flexible(
                              child: Column(
                                crossAxisAlignment: isPlayerMessage
                                    ? CrossAxisAlignment.end
                                    : CrossAxisAlignment.start,
                                children: [
                                  // Speaker name (only if not hidden)
                                  if (!isPlayerMessage && !hideAvatar)
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

                                  // Message content with KakaoTalk-style bubble
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      // Time on left for others' messages
                                      if (!isPlayerMessage && !hideTime && message.storyTime != null)
                                        Padding(
                                          padding: const EdgeInsets.only(right: 6, bottom: 2),
                                          child: Text(
                                            message.storyTime!,
                                            style: TextStyle(
                                              fontSize: 10,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ),
                                      
                                      // Bubble
                                      Flexible(
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 14,
                                            vertical: 10,
                                          ),
                                          decoration: BoxDecoration(
                                            color: isPlayerMessage
                                                ? const Color(0xFF00D9FF) // Cyan neon
                                                : const Color(0xFF2D3348), // Dark card
                                            borderRadius: BorderRadius.only(
                                              topLeft: const Radius.circular(18),
                                              topRight: const Radius.circular(18),
                                              bottomLeft: Radius.circular(isPlayerMessage ? 18 : 4),
                                              bottomRight: Radius.circular(isPlayerMessage ? 4 : 18),
                                            ),
                                            boxShadow: isPlayerMessage
                                                ? [
                                                    BoxShadow(
                                                      color: const Color(0xFF00D9FF).withOpacity(0.3),
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
                                            message.text,
                                            style: TextStyle(
                                              fontSize: 15,
                                              color: isPlayerMessage ? const Color(0xFF0A0E1A) : Colors.white,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),

                                      // Time on right for player messages
                                      if (isPlayerMessage && !hideTime && message.storyTime != null)
                                        Padding(
                                          padding: const EdgeInsets.only(left: 6, bottom: 2),
                                          child: Text(
                                            message.storyTime!,
                                            style: TextStyle(
                                              fontSize: 10,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),

                                  // Reaction emoji if present (animated, colorful)
                                  if (message.reaction != null)
                                    Padding(
                                      padding: const EdgeInsets.only(top: 6, left: 12),
                                      child: TweenAnimationBuilder<double>(
                                        tween: Tween(begin: 0.0, end: 1.0),
                                        duration: const Duration(milliseconds: 400),
                                        curve: Curves.elasticOut,
                                        builder: (context, value, child) {
                                          return Transform.scale(
                                            scale: value,
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                              decoration: BoxDecoration(
                                                gradient: LinearGradient(
                                                  begin: Alignment.topLeft,
                                                  end: Alignment.bottomRight,
                                                  colors: [
                                                    const Color(0xFF252A3E),
                                                    const Color(0xFF1E2130),
                                                  ],
                                                ),
                                                borderRadius: BorderRadius.circular(16),
                                                border: Border.all(
                                                  color: const Color(0xFF00D9FF).withOpacity(0.4),
                                                  width: 1.5,
                                                ),
                                                boxShadow: [
                                                  BoxShadow(
                                                    color: const Color(0xFF00D9FF).withOpacity(0.3),
                                                    blurRadius: 8,
                                                    spreadRadius: 1,
                                                  ),
                                                  BoxShadow(
                                                    color: Colors.black.withOpacity(0.3),
                                                    blurRadius: 6,
                                                    offset: const Offset(0, 2),
                                                  ),
                                                ],
                                              ),
                                              child: Text(
                                                message.reaction!,
                                                style: const TextStyle(
                                                  fontSize: 20,
                                                  shadows: [
                                                    Shadow(
                                                      color: Color(0xFF00D9FF),
                                                      blurRadius: 8,
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          );
                                        },
                                      ),
                                    ),
                                ],
                              ),
                            ),

                            // Avatar for player (right side)
                            if (isPlayerMessage && !hideAvatar) ...[
                              const SizedBox(width: 12),
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: const LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Color(0xFF00D9FF),
                                      Color(0xFF00A3CC),
                                    ],
                                  ),
                                  border: Border.all(
                                    color: const Color(0xFF00D9FF),
                                    width: 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF00D9FF).withOpacity(0.5),
                                      blurRadius: 15,
                                      spreadRadius: 3,
                                    ),
                                  ],
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: SvgPicture.asset(
                                    _getAvatarPath('detective'),
                                    width: 44,
                                    height: 44,
                                  ),
                                ),
                              ),
                            ] else if (isPlayerMessage && hideAvatar) ...[
                              const SizedBox(width: 72), // Space for hidden avatar
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
                        ...storyState.currentChoices!.asMap().entries.map((entry) {
                          final choice = entry.value;
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: _ChoiceButton(
                              choice: choice,
                              onPressed: () {
                                ref.read(storyProviderV2.notifier).makeChoice(choice.id);
                              },
                            ),
                          );
                        }),
                      ],
                    ),
                  ),

                // Input or Continue button
                if (!settings.autoTextMode && storyState.currentChoices == null)
                  Container(
                    padding: const EdgeInsets.all(16),
                    width: double.infinity,
                    child: storyState.waitingForInput
                        ? Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _inputController,
                                  autofocus: true,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: Colors.white,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: storyState.inputPrompt ??
                                        (settings.language == 'ko'
                                            ? '이름을 입력하세요...'
                                            : 'Enter your name...'),
                                    hintStyle: TextStyle(
                                      color: Colors.white.withOpacity(0.5),
                                    ),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: const BorderSide(
                                        color: Color(0xFF00D9FF),
                                        width: 2,
                                      ),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide(
                                        color: const Color(0xFF00D9FF).withOpacity(0.5),
                                        width: 2,
                                      ),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: const BorderSide(
                                        color: Color(0xFF00D9FF),
                                        width: 2,
                                      ),
                                    ),
                                    filled: true,
                                    fillColor: const Color(0xFF252A3E),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 16,
                                    ),
                                  ),
                                  onSubmitted: (value) {
                                    if (value.isNotEmpty) {
                                      ref
                                          .read(storyProviderV2.notifier)
                                          .submitDetectiveName(value);
                                      _inputController.clear();
                                    }
                                  },
                                ),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton(
                                onPressed: () {
                                  if (_inputController.text.isNotEmpty) {
                                    ref
                                        .read(storyProviderV2.notifier)
                                        .submitDetectiveName(_inputController.text);
                                    _inputController.clear();
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF00D9FF),
                                  foregroundColor: const Color(0xFF0A0E1A),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 18,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  elevation: 8,
                                  shadowColor: const Color(0xFF00D9FF).withOpacity(0.5),
                                ),
                                child: const Icon(Icons.send, size: 20, weight: 700),
                              ),
                            ],
                          )
                        : ElevatedButton(
                            onPressed: () {
                              ref.read(storyProviderV2.notifier).continueStory();
                            },
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              backgroundColor: const Color(0xFF00D9FF),
                              foregroundColor: const Color(0xFF0A0E1A),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 8,
                              shadowColor: const Color(0xFF00D9FF).withOpacity(0.5),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  settings.language == 'ko' ? 'Continue' : 'Continue',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Icon(Icons.arrow_forward, size: 20, color: Color(0xFF0A0E1A)),
                              ],
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

  // Narration widget (centered, no bubble)
  Widget _buildNarrationWidget(StoryMessage message, AppSettings settings) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          message.text,
          style: TextStyle(
            fontSize: 13,
            fontStyle: FontStyle.italic,
            color: Colors.grey[400],
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  // System message widget (centered notification)
  Widget _buildSystemWidget(StoryMessage message, AppSettings settings) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF3B82F6).withOpacity(0.15),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: const Color(0xFF3B82F6).withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.info_outline,
              size: 16,
              color: Color(0xFF3B82F6),
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                message.text,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF3B82F6),
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Email card widget
  Widget _buildEmailCard(StoryMessage message, AppSettings settings) {
    final emailData = message.emailData!;
    return InkWell(
      onTap: () {
        // 진동 피드백
        ScreenEffects.vibrate(VibrationPattern.light);
        
        // 전체화면 이메일 표시
        EmailFullScreen.show(
          context,
          EmailData(
            from: emailData['from'] ?? 'Unknown',
            subject: emailData['subject'] ?? '',
            body: emailData['body'] ?? '',
            time: message.storyTime ?? message.timestamp.toString(),
            isRead: true,
            avatar: _getAvatarPath(emailData['fromAvatar'] ?? ''),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Email header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFF3B82F6),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                const Icon(Icons.email, color: Colors.white, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        settings.language == 'ko' ? '새 이메일' : 'New Email',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                      Text(
                        emailData['from'] ?? 'Unknown',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                if (message.storyTime != null)
                  Text(
                    message.storyTime!,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),
          // Email body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  emailData['subject'] ?? '',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                if (emailData['body'] != null) ...[
                  const SizedBox(height: 12),
                  const Divider(),
                  const SizedBox(height: 12),
                  Text(
                    emailData['body'],
                    style: const TextStyle(
                      fontSize: 15,
                      color: Colors.black87,
                      height: 1.5,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    ),
    );
  }

  // Data log/chart card widget
  Widget _buildDataLogCard(StoryMessage message, AppSettings settings) {
    final dataLog = message.dataLog!;
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6366F1).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Icon(Icons.bar_chart, color: Colors.white, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        settings.language == 'ko' ? '데이터 로그' : 'Data Log',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                      Text(
                        dataLog['title'] ?? 'Data Analysis',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                if (message.storyTime != null)
                  Text(
                    message.storyTime!,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),
          // Data content
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (dataLog['description'] != null)
                  Text(
                    dataLog['description'],
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.black87,
                      height: 1.5,
                    ),
                  ),
                if (dataLog['data'] != null) ...[
                  const SizedBox(height: 12),
                  Text(
                    dataLog['data'].toString(),
                    style: const TextStyle(
                      fontSize: 13,
                      fontFamily: 'Courier',
                      color: Colors.black87,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Typing indicator
  Widget _buildTypingIndicator(StoryMessage message, AppSettings settings) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TypingIndicator(
        name: message.typingUser ?? 'Kastor',
        accentColor: _getSpeakerColor(message.typingUser ?? 'kastor'),
      ),
    );
  }
}

// Typing dot animation
class _TypingDot extends StatefulWidget {
  final int delay;
  const _TypingDot({required this.delay});

  @override
  State<_TypingDot> createState() => _TypingDotState();
}

class _TypingDotState extends State<_TypingDot> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) {
        _controller.repeat(reverse: true);
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.grey[600]!.withOpacity(0.3 + (_controller.value * 0.7)),
          ),
        );
      },
    );
  }
}

// Choice button widget with hover effect and debouncing
class _ChoiceButton extends StatefulWidget {
  final dynamic choice;
  final VoidCallback onPressed;

  const _ChoiceButton({
    required this.choice,
    required this.onPressed,
  });

  @override
  State<_ChoiceButton> createState() => _ChoiceButtonState();
}

class _ChoiceButtonState extends State<_ChoiceButton> {
  bool _isHovered = false;
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedScale(
        scale: _isHovered ? 1.02 : 1.0,
        duration: const Duration(milliseconds: 150),
        child: ElevatedButton(
          onPressed: _isPressed
              ? null
              : () {
                  setState(() => _isPressed = true);
                  widget.onPressed();
                  Future.delayed(const Duration(milliseconds: 500), () {
                    if (mounted) {
                      setState(() => _isPressed = false);
                    }
                  });
                },
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(
              horizontal: 20,
              vertical: 16,
            ),
            backgroundColor: _isPressed
                ? const Color(0xFF6366F1).withOpacity(0.4)
                : (_isHovered
                    ? const Color(0xFF6366F1).withOpacity(0.3)
                    : const Color(0xFF6366F1).withOpacity(0.2)),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: _isHovered
                    ? const Color(0xFF6366F1).withOpacity(0.8)
                    : const Color(0xFF6366F1).withOpacity(0.5),
                width: _isHovered ? 2 : 1,
              ),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  widget.choice.text,
                  style: const TextStyle(fontSize: 15),
                ),
              ),
              if (_isPressed)
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
              else if (_isHovered)
                const Icon(Icons.arrow_forward, size: 18),
            ],
          ),
        ),
      ),
    );
  }
}
