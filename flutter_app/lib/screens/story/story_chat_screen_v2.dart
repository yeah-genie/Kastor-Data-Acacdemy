import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../providers/story_provider_v2.dart';
import '../../providers/settings_provider.dart';
import '../../widgets/notification_overlay.dart';
import '../../widgets/screen_effects.dart';
import '../../widgets/email_fullscreen.dart';
import '../../widgets/typing_text.dart';
import '../../widgets/typing_indicator.dart';
import '../../widgets/realistic_notification.dart';
import '../../widgets/emoji_reaction_picker.dart';
import '../../widgets/hologram_loading.dart';
import '../../widgets/data_insights_panel.dart';
import '../../widgets/suggested_questions.dart';
import 'episode_ending_screen.dart';

class StoryChatScreenV2 extends ConsumerStatefulWidget {
  const StoryChatScreenV2({super.key});

  @override
  ConsumerState<StoryChatScreenV2> createState() => _StoryChatScreenV2State();
}

class _StoryChatScreenV2State extends ConsumerState<StoryChatScreenV2> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _inputController = TextEditingController();
  int? _showingEmojiPickerForMessageIndex;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  bool _isProcessingChoice = false;

  @override
  void dispose() {
    _scrollController.dispose();
    _inputController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    // Listen to story state changes and auto-scroll
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.listen(storyProviderV2, (previous, next) {
        // 메시지 추가 시 스크롤
        if (previous?.messages.length != next.messages.length) {
          _scrollToBottom();
        }
        
        // 에피소드 완료 시 자동으로 EpisodeEndingScreen 표시
        if (previous?.episodeCompleted == false && next.episodeCompleted == true) {
          print('🎉 Episode completed - navigating to ending screen');
          
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (mounted) {
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(
                  builder: (context) => EpisodeEndingScreen(
                    episodeTitle: 'Episode 1: The Missing Balance Patch',
                    totalScore: next.totalScore,
                    investigationPoints: next.investigationPoints,
                    choicesMade: next.choicesMade,
                    detectiveName: next.detectiveName ?? 'Detective',
                    onReplay: () {
                      ref.read(storyProviderV2.notifier).restartEpisode();
                      Navigator.of(context).pop();
                    },
                    onNextEpisode: () {
                      // TODO: Episode 2 구현 시 추가
                      Navigator.of(context).popUntil((route) => route.isFirst);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Episode 2 coming soon! 🚀'),
                        ),
                      );
                    },
                    onHome: () {
                      Navigator.of(context).popUntil((route) => route.isFirst);
                    },
                  ),
                ),
              );
            }
          });
        }
      });
    });
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

  // 로딩 최적화를 위한 debounce 함수
  void _handleChoiceWithDebounce(String choiceId) {
    if (_isProcessingChoice) return;

    setState(() => _isProcessingChoice = true);
    ref.read(storyProviderV2.notifier).makeChoice(choiceId);

    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() => _isProcessingChoice = false);
      }
    });
  }

  void _handleSuggestedQuestion(String question) {
    // 추천 질문을 탭했을 때 자동으로 처리
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(question),
        duration: const Duration(seconds: 1),
        behavior: SnackBarBehavior.floating,
      ),
    );
    // TODO: 실제로는 AI가 답변하도록 구현
  }

  @override
  Widget build(BuildContext context) {
    final storyState = ref.watch(storyProviderV2);
    final settings = ref.watch(settingsProvider);
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 900; // 900px 미만을 모바일로 간주

    // Scroll to bottom when new messages arrive
    if (storyState.messages.isNotEmpty) {
      _scrollToBottom();
    }

    // 데스크톱: 2-패널 레이아웃
    // 모바일: Drawer + 채팅
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: const Color(0xFF1A1D2E),
      // 모바일용 Drawer
      drawer: isMobile
          ? Drawer(
              backgroundColor: Colors.transparent,
              child: const DataInsightsPanel(),
            )
          : null,
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A1D2E),
        elevation: 0,
        leading: isMobile
            ? IconButton(
                icon: const Icon(Icons.menu),
                onPressed: () {
                  _scaffoldKey.currentState?.openDrawer();
                },
              )
            : null,
        automaticallyImplyLeading: isMobile,
        title: Text(
          settings.language == 'ko' ? 'EP1: 사라진 밸런스 패치' : 'EP1: The Missing Balance Patch',
          style: TextStyle(
            fontSize: isMobile ? 14 : 16,
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          // Notifications (모바일에서만 간소화)
          if (!isMobile)
            IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // TODO: 알림 목록 화면으로 이동
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    settings.language == 'ko' ? '알림이 없습니다' : 'No notifications',
                  ),
                  duration: const Duration(seconds: 1),
                ),
              );
            },
          ),
          // Settings menu (모바일에서는 더 간소화)
          if (!isMobile)
            PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (String value) async {
              if (value == 'en' || value == 'ko') {
                ref.read(settingsProvider.notifier).setLanguage(value);
                await ref.read(storyProviderV2.notifier).reloadWithLanguage(value);
              }
            },
            itemBuilder: (BuildContext context) => [
              PopupMenuItem(
                value: 'header',
                enabled: false,
                child: Text(
                  settings.language == 'ko' ? '언어 설정' : 'Language',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
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
          // Investigation points - Responsive padding (항상 표시)
          Padding(
            padding: EdgeInsets.symmetric(horizontal: isMobile ? 8.0 : 16.0),
            child: Center(
              child: Container(
                padding: EdgeInsets.symmetric(
                  horizontal: isMobile ? 8 : 12,
                  vertical: isMobile ? 4 : 6,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.star, size: isMobile ? 14 : 16, color: const Color(0xFFFBBF24)),
                    SizedBox(width: isMobile ? 2 : 4),
                    Text(
                      '${storyState.investigationPoints}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: isMobile ? 12 : 14,
                        color: const Color(0xFFFBBF24),
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
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const CircularProgressIndicator(
                    color: Color(0xFF00D9FF),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    settings.language == 'ko' ? '에피소드 로딩 중...' : 'Loading Episode...',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.7),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            )
          : Row(
              children: [
                // 데스크톱: 왼쪽 데이터 패널
                if (!isMobile) const DataInsightsPanel(),

                // 채팅 영역 (데스크톱에서는 오른쪽, 모바일에서는 전체)
                Expanded(
                  child: _buildChatArea(storyState, settings, isMobile),
                ),
              ],
            ),
    );
  }

  Widget _buildChatArea(dynamic storyState, dynamic settings, bool isMobile) {
    return Column(
              children: [
                // Message list
                Expanded(
                  child: storyState.messages.isEmpty
                      ? _buildEmptyState(settings, isMobile)
                      : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: storyState.messages.length,
                    itemBuilder: (context, index) {
                      final message = storyState.messages[index];
                      final prevMessage = index > 0 ? storyState.messages[index - 1] : null;
                      final isPlayerMessage = message.speaker == 'detective';
                      final screenWidth = MediaQuery.of(context).size.width;
                      // 메시지 UI 요소 크기 기준 (아바타, 패딩 등) - 600px 기준
                      final isSmallScreen = screenWidth < 600;
                      final avatarSize = isSmallScreen ? 48.0 : 60.0;

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
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: isPlayerMessage
                              ? MainAxisAlignment.end
                              : MainAxisAlignment.start,
                          children: [
                            // Avatar (hide if consecutive message from same person) - Responsive size
                            if (!isPlayerMessage && !hideAvatar) ...[
                              Container(
                                width: avatarSize,
                                height: avatarSize,
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
                                    width: isSmallScreen ? 1.5 : 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: _getSpeakerColor(message.speaker).withOpacity(0.4),
                                      blurRadius: isSmallScreen ? 8 : 12,
                                      spreadRadius: isSmallScreen ? 1 : 2,
                                    ),
                                  ],
                                ),
                                child: Padding(
                                  padding: EdgeInsets.all(isSmallScreen ? 6.0 : 8.0),
                                  child: SvgPicture.asset(
                                    _getAvatarPath(message.speaker),
                                    width: avatarSize - (isSmallScreen ? 12 : 16),
                                    height: avatarSize - (isSmallScreen ? 12 : 16),
                                  ),
                                ),
                              ),
                              SizedBox(width: isSmallScreen ? 8 : 12),
                            ] else if (!isPlayerMessage && hideAvatar) ...[
                              SizedBox(width: avatarSize + (isSmallScreen ? 8 : 12)), // Space for hidden avatar
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
                                      
                                      // Bubble - 길게 누르기로 이모지 리액션
                                      Flexible(
                                        child: GestureDetector(
                                          onLongPress: () {
                                            // 이모지 피커 표시 (간단 버전 - BottomSheet)
                                            showModalBottomSheet(
                                              context: context,
                                              backgroundColor: Colors.transparent,
                                              builder: (context) => Container(
                                                padding: const EdgeInsets.all(16),
                                                decoration: BoxDecoration(
                                                  color: const Color(0xFF1A1D2E),
                                                  borderRadius: const BorderRadius.vertical(
                                                    top: Radius.circular(20),
                                                  ),
                                                  border: Border.all(
                                                    color: const Color(0xFF00D9FF).withOpacity(0.3),
                                                    width: 2,
                                                  ),
                                                ),
                                                child: Column(
                                                  mainAxisSize: MainAxisSize.min,
                                                  children: [
                                                    const Text(
                                                      '리액션 추가',
                                                      style: TextStyle(
                                                        fontSize: 16,
                                                        fontWeight: FontWeight.bold,
                                                        color: Color(0xFF00D9FF),
                                                      ),
                                                    ),
                                                    const SizedBox(height: 16),
                                                    Wrap(
                                                      spacing: 12,
                                                      runSpacing: 12,
                                                      children: ['😂', '❤️', '👍', '👎', '😮', '😢', '🔥', '✨']
                                                          .map((emoji) => GestureDetector(
                                                                onTap: () {
                                                                  ref.read(storyProviderV2.notifier)
                                                                      .addReactionToMessage(index, emoji);
                                                                  Navigator.pop(context);
                                                                },
                                                                child: Container(
                                                                  width: 50,
                                                                  height: 50,
                                                                  decoration: BoxDecoration(
                                                                    color: const Color(0xFF2D3348),
                                                                    borderRadius: BorderRadius.circular(12),
                                                                  ),
                                                                  child: Center(
                                                                    child: Text(
                                                                      emoji,
                                                                      style: const TextStyle(fontSize: 28),
                                                                    ),
                                                                  ),
                                                                ),
                                                              ))
                                                          .toList(),
                                                    ),
                                                    const SizedBox(height: 16),
                                                  ],
                                                ),
                                              ),
                                            );
                                          },
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

                                  // Reaction emoji if present (animated, colorful) - 탭하면 제거
                                  if (message.reaction != null)
                                    Padding(
                                      padding: const EdgeInsets.only(top: 6, left: 12),
                                      child: GestureDetector(
                                        onTap: () {
                                          ref.read(storyProviderV2.notifier).removeReactionFromMessage(index);
                                        },
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
                                    ),
                                ],
                              ),
                            ),

                            // Avatar for player (right side) - REMOVED
                          ],
                        ),
                      );
                    },
                  ),
                ),

                // 추천 질문 (메시지가 3개 이하일 때만 표시)
                if (storyState.messages.length <= 3 &&
                    (storyState.currentChoices == null ||
                        storyState.currentChoices!.isEmpty))
                  SuggestedQuestions(
                    onQuestionTap: _handleSuggestedQuestion,
                  ),

                // Choices section - 개선된 스크롤 가능 버전 + 로딩 최적화
                if (storyState.currentChoices != null && storyState.currentChoices!.isNotEmpty)
                  Container(
                    constraints: const BoxConstraints(
                      maxHeight: 280, // 최대 높이 제한
                    ),
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
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // 헤더 (고정)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.touch_app,
                                size: 18,
                                color: Color(0xFF6366F1),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                settings.language == 'ko' ? '선택하세요:' : 'Choose:',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const Spacer(),
                              Text(
                                '${storyState.currentChoices!.length}개',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[400],
                                ),
                              ),
                            ],
                          ),
                        ),
                        // 선택지 리스트 (스크롤 가능)
                        Flexible(
                          child: ListView.builder(
                            shrinkWrap: true,
                            padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                            itemCount: storyState.currentChoices!.length,
                            itemBuilder: (context, index) {
                              final choice = storyState.currentChoices![index];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: _ChoiceButton(
                                  choice: choice,
                                  isProcessing: _isProcessingChoice,
                                  onPressed: () {
                                    _handleChoiceWithDebounce(choice.id);
                                  },
                                ),
                              );
                            },
                          ),
                        ),
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
                                  if (_inputController.text.trim().isNotEmpty) {
                                    ref
                                        .read(storyProviderV2.notifier)
                                        .submitDetectiveName(_inputController.text.trim());
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
                                  elevation: 2,
                                ),
                                child: const Icon(Icons.send, size: 20, weight: 700),
                              ),
                            ],
                          )
                        : ElevatedButton(
                            onPressed: storyState.isLoading ? null : () {
                              ref.read(storyProviderV2.notifier).continueStory();
                              Future.delayed(const Duration(milliseconds: 100), () {
                                _scrollToBottom();
                              });
                            },
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              backgroundColor: storyState.isLoading ? Colors.grey : const Color(0xFF00D9FF),
                              foregroundColor: const Color(0xFF0A0E1A),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 2,
                            ),
                            child: storyState.isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : Row(
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

  // Empty state widget - 초기 화면
  Widget _buildEmptyState(dynamic settings, bool isMobile) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(isMobile ? 24 : 48),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF6366F1).withOpacity(0.1),
                border: Border.all(
                  color: const Color(0xFF6366F1).withOpacity(0.3),
                  width: 2,
                ),
              ),
              child: const Icon(
                Icons.chat_bubble_outline,
                size: 64,
                color: Color(0xFF6366F1),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              settings.language == 'ko' ? '대화를 시작하세요' : 'Start Conversation',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              settings.language == 'ko'
                  ? 'Kastor가 사건 해결을 도와드립니다'
                  : 'Kastor will help you solve the case',
              style: TextStyle(
                fontSize: 16,
                color: Colors.white.withOpacity(0.7),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            SuggestedQuestions(
              onQuestionTap: _handleSuggestedQuestion,
            ),
          ],
        ),
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

  // Email card widget - 중요 증거 하이라이트
  Widget _buildEmailCard(StoryMessage message, AppSettings settings) {
    final emailData = message.emailData!;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return Transform.scale(
          scale: 0.9 + (value * 0.1),
          child: Opacity(
            opacity: value,
            child: InkWell(
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
                  border: Border.all(
                    color: const Color(0xFF3B82F6).withOpacity(0.5),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF3B82F6).withOpacity(0.3),
                      blurRadius: 12,
                      spreadRadius: 2,
                    ),
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
            ),
          ),
        );
      },
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
      child: CharacterTypingIndicator(
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
  final bool isProcessing;

  const _ChoiceButton({
    required this.choice,
    required this.onPressed,
    this.isProcessing = false,
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
          onPressed: _isPressed || widget.isProcessing
              ? null
              : () {
                  setState(() => _isPressed = true);
                  widget.onPressed();
                  // 스크롤 트리거
                  Future.delayed(const Duration(milliseconds: 300), () {
                    final context = this.context;
                    if (mounted && context.mounted) {
                      final state = context.findAncestorStateOfType<_StoryChatScreenV2State>();
                      state?._scrollToBottom();
                    }
                  });
                  Future.delayed(const Duration(milliseconds: 500), () {
                    if (mounted) {
                      setState(() => _isPressed = false);
                    }
                  });
                },
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(
              horizontal: 20,
              vertical: 18,
            ),
            minimumSize: const Size(double.infinity, 56),
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
              if (_isPressed || widget.isProcessing)
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
