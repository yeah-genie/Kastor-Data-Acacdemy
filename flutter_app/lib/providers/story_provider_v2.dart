import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/text_utils.dart';
import './settings_provider.dart';
import '../services/audio_service.dart';
import '../services/episode_loader_service.dart';
import '../services/save_load_service.dart';
import '../services/notification_service.dart';
import '../widgets/notification_overlay.dart';
import '../widgets/screen_effects.dart';
import '../widgets/email_fullscreen.dart';

// Story message for chat display
class StoryMessage {
  final String id;
  final String speaker; // 'kastor', 'detective', 'maya', 'narrator', 'system'
  final String text;
  final DateTime timestamp;
  final String? storyTime; // Time in story (e.g., "09:30", "14:45")
  final String? email; // Email content if this is an email message
  final Map<String, dynamic>? emailData; // Full email data
  final Map<String, dynamic>? dataLog; // Data log/chart content
  final String? reaction; // Emoji reaction from other characters
  final String? typingUser; // Who is typing (for typing indicator)

  StoryMessage({
    required this.id,
    required this.speaker,
    required this.text,
    required this.timestamp,
    this.storyTime,
    this.email,
    this.emailData,
    this.dataLog,
    this.reaction,
    this.typingUser,
  });

  bool get isNarration => speaker == 'narrator' || speaker == 'system';
  bool get isEmail => emailData != null;
  bool get isDataLog => dataLog != null;
  bool get isTypingIndicator => typingUser != null;
}

// Story choice for interactive decisions
class StoryChoice {
  final String id;
  final String text;
  final String nextSceneId;
  final int? points;

  StoryChoice({
    required this.id,
    required this.text,
    required this.nextSceneId,
    this.points,
  });
}

// Current story state
class StoryState {
  final List<StoryMessage> messages;
  final List<StoryChoice>? currentChoices;
  final String currentSceneId;
  final int currentNodeIndex;
  final int investigationPoints;
  final String? detectiveName;
  final bool waitingForInput;
  final String? inputPrompt;
  final int pendingMessages; // Number of messages queued for auto mode
  final Map<String, dynamic>? episodeData; // Loaded episode JSON data
  final bool isLoading;
  final List<String> choicesMade; // 사용자가 선택한 결정들
  final int totalScore; // 총 점수
  final bool episodeCompleted; // 에피소드 완료 여부
  final String currentEpisodeId; // 현재 에피소드 ID

  StoryState({
    required this.messages,
    this.currentChoices,
    required this.currentSceneId,
    this.currentNodeIndex = 0,
    this.investigationPoints = 0,
    this.detectiveName,
    this.waitingForInput = false,
    this.inputPrompt,
    this.pendingMessages = 0,
    this.episodeData,
    this.isLoading = false,
    this.choicesMade = const [],
    this.totalScore = 0,
    this.episodeCompleted = false,
    this.currentEpisodeId = '',
  });

  StoryState copyWith({
    List<StoryMessage>? messages,
    List<StoryChoice>? currentChoices,
    String? currentSceneId,
    int? currentNodeIndex,
    int? investigationPoints,
    String? detectiveName,
    bool? waitingForInput,
    String? inputPrompt,
    int? pendingMessages,
    Map<String, dynamic>? episodeData,
    bool? isLoading,
    List<String>? choicesMade,
    int? totalScore,
    bool? episodeCompleted,
    String? currentEpisodeId,
  }) {
    return StoryState(
      messages: messages ?? this.messages,
      currentChoices: currentChoices ?? this.currentChoices,
      currentSceneId: currentSceneId ?? this.currentSceneId,
      currentNodeIndex: currentNodeIndex ?? this.currentNodeIndex,
      investigationPoints: investigationPoints ?? this.investigationPoints,
      detectiveName: detectiveName ?? this.detectiveName,
      waitingForInput: waitingForInput ?? this.waitingForInput,
      inputPrompt: inputPrompt ?? this.inputPrompt,
      pendingMessages: pendingMessages ?? this.pendingMessages,
      episodeData: episodeData ?? this.episodeData,
      isLoading: isLoading ?? this.isLoading,
      choicesMade: choicesMade ?? this.choicesMade,
      totalScore: totalScore ?? this.totalScore,
      episodeCompleted: episodeCompleted ?? this.episodeCompleted,
      currentEpisodeId: currentEpisodeId ?? this.currentEpisodeId,
    );
  }
}

// Story provider V2 - loads from JSON based on language
class StoryNotifierV2 extends Notifier<StoryState> {
  final EpisodeLoaderService _episodeLoader = EpisodeLoaderService();
  bool _isInitialized = false;
  final List<Timer?> _timers = [];
  int _messageQueue = 0;
  Map<String, dynamic>? _currentScene;

  @override
  StoryState build() {
    if (!_isInitialized) {
      _isInitialized = true;
      Future.microtask(() => _initializeStory());
    }
    return StoryState(
      messages: [],
      currentSceneId: 'scene_0',
      isLoading: true,
    );
  }


  void _cancelAllTimers() {
    for (final timer in _timers) {
      timer?.cancel();
    }
    _timers.clear();
  }

  Duration _getDelay(int multiplier, {String? messageText}) {
    final settings = ref.read(settingsProvider);
    
    // 메시지 길이에 따라 딜레이 조정
    int baseDelay = 1500 * multiplier;
    
    if (messageText != null) {
      // 짧은 메시지 (20자 이하): 1초
      // 중간 메시지 (20-50자): 2초
      // 긴 메시지 (50자 이상): 3초
      final length = messageText.length;
      if (length <= 20) {
        baseDelay = 1000;
      } else if (length <= 50) {
        baseDelay = 2000;
      } else {
        baseDelay = 3000;
      }
    }
    
    return calculateTextDelay(settings.textSpeed, baseDelayMs: baseDelay);
  }

  bool get _isAutoMode => ref.read(settingsProvider).autoTextMode;

  void _scheduleMessage(Duration delay, VoidCallback callback) {
    _messageQueue++;

    // Update pending messages count
    state = state.copyWith(pendingMessages: _messageQueue);

    Timer? timer;
    timer = Timer(delay, () {
      callback();
      _timers.remove(timer);
      _messageQueue--;
      state = state.copyWith(pendingMessages: _messageQueue);
    });
    _timers.add(timer);
  }

  Future<void> _initializeStory() async {
    try {
      // Get current language from settings
      final language = ref.read(settingsProvider).language;

      // Load episode data
      final episodeData = await _episodeLoader.loadEpisode('episode1', language);

      if (episodeData == null) {
        throw Exception('Failed to load episode data');
      }

      state = state.copyWith(
        episodeData: episodeData,
        isLoading: false,
        currentEpisodeId: 'episode1',
      );

      // Start with first scene
      _loadScene('scene_0');
    } catch (e) {
      print('Error initializing story: $e');
      final errorMessage = StoryMessage(
        id: 'error_${DateTime.now().millisecondsSinceEpoch}',
        speaker: 'system',
        text: '❌ 에피소드 로드 실패. 다시 시도해주세요.',
        timestamp: DateTime.now(),
      );
      state = state.copyWith(
        isLoading: false,
        messages: [errorMessage],
      );
    }
  }

  void _loadScene(String sceneId) {
    if (state.episodeData == null) return;

    final scene = _episodeLoader.getScene(state.episodeData!, sceneId);
    if (scene == null) {
      print('Scene $sceneId not found');
      return;
    }

    _currentScene = scene;
    state = state.copyWith(
      currentSceneId: sceneId,
      currentNodeIndex: 0,
    );

    // Start processing nodes
    _processNextNode();
  }

  void _processNextNode() {
    if (_currentScene == null) return;

    final nodes = _episodeLoader.getSceneNodes(_currentScene!);
    if (state.currentNodeIndex >= nodes.length) {
      // Scene complete
      print('Scene ${state.currentSceneId} complete');
      return;
    }

    final node = nodes[state.currentNodeIndex];
    final nodeType = node['type'] as String;

    switch (nodeType) {
      case 'dialogue':
      case 'narration':
        _processDialogueNode(node);
        break;

      case 'email':
        _processEmailNode(node);
        break;

      case 'choice':
        _processChoiceNode(node);
        break;

      case 'input':
        _processInputNode(node);
        break;

      default:
        print('Unknown node type: $nodeType');
        _advanceNode();
    }
  }

  void _processDialogueNode(Map<String, dynamic> node) {
    final speaker = node['speaker'] as String? ?? 'narrator';
    final text = node['text'] as String;

    _addMessage(speaker, text);

    // Auto advance in auto mode
    if (_isAutoMode && !state.waitingForInput) {
      _scheduleMessage(_getDelay(1), () {
        _advanceNode();
      });
    }
  }

  void _processEmailNode(Map<String, dynamic> node) {
    final text = node['text'] as String;
    final emailData = node['data'] as Map<String, dynamic>?;

    _addMessage('system', text, email: text, emailData: emailData);

    // Auto advance
    if (_isAutoMode) {
      _scheduleMessage(_getDelay(2), () {
        _advanceNode();
      });
    }
  }

  void _processChoiceNode(Map<String, dynamic> node) {
    final text = node['text'] as String;
    final choicesData = node['choices'] as List<dynamic>?;

    if (choicesData != null) {
      final choices = choicesData.map((c) {
        final choiceMap = c as Map<String, dynamic>;
        return StoryChoice(
          id: choiceMap['id'] as String,
          text: choiceMap['text'] as String,
          nextSceneId: choiceMap['nextSceneId'] as String? ?? '',
          points: choiceMap['points'] as int?,
        );
      }).toList();

      state = state.copyWith(currentChoices: choices);
      _addMessage('system', text);
    }
  }

  void _processInputNode(Map<String, dynamic> node) {
    final text = node['text'] as String;

    state = state.copyWith(
      waitingForInput: true,
      inputPrompt: text,
    );

    _addMessage('system', text);
  }

  void _advanceNode() {
    state = state.copyWith(currentNodeIndex: state.currentNodeIndex + 1);
    _processNextNode();
  }

  // Trigger scroll to bottom (called from UI)
  void triggerScroll() {
    // UI will listen to message changes and scroll automatically
    state = state.copyWith();
  }

  void _addMessage(String speaker, String text, {String? email, Map<String, dynamic>? emailData, Map<String, dynamic>? dataLog}) {
    // Convert text expressions to emojis
    final convertedText = convertTextToEmoji(text);

    // Add contextual reaction based on message content
    final reaction = getContextualReaction(speaker, convertedText);

    final message = StoryMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
      speaker: speaker,
      text: convertedText,
      timestamp: DateTime.now(),
      email: email,
      emailData: emailData,
      dataLog: dataLog,
      reaction: reaction,
    );

    state = state.copyWith(
      messages: [...state.messages, message],
    );

    // 증거보관함에 자동 저장 (이메일이나 데이터 로그)
    if (emailData != null || dataLog != null) {
      final evidenceId = message.id;
      SaveLoadService.saveEvidence(evidenceId);
      
      // OS 알림 트리거 (중요 증거 발견)
      if (emailData != null) {
        NotificationService().showMessageNotification(
          characterName: emailData['from'] ?? 'Unknown',
          message: emailData['subject'] ?? '새 이메일이 도착했습니다',
        );
      }
    }

    // Play notification sound if enabled
    _playMessageSound(speaker);
  }

  void _playMessageSound(String speaker) {
    final settings = ref.read(settingsProvider);

    // Only play sound if enabled in settings
    if (!settings.soundEnabled) return;

    final audioService = AudioService();

    // Different sounds for different message types
    if (speaker == 'system') {
      audioService.playSFX(SoundEffect.achievementUnlocked);
    } else if (speaker == 'narrator') {
      audioService.playSFX(SoundEffect.notification);
    } else {
      audioService.playSFX(SoundEffect.notification);
    }
  }

  // Manual mode: advance to next message
  void continueStory() {
    if (_isAutoMode) return; // Only works in manual mode
    if (state.waitingForInput) return; // Don't advance during input
    if (state.currentChoices != null) return; // Don't advance during choices

    _advanceNode();
  }

  void submitDetectiveName(String name) {
    if (!state.waitingForInput) return;
    if (name.trim().isEmpty) return; // 빈 값 방지

    state = state.copyWith(
      detectiveName: name,
      waitingForInput: false,
      inputPrompt: null,
    );

    _addMessage('detective', name);

    if (_isAutoMode) {
      _scheduleMessage(_getDelay(1), () {
        _advanceNode();
      });
    } else {
      // Manual 모드에서도 자동으로 다음 노드로 진행
      _advanceNode();
    }
  }

  void makeChoice(String choiceId) {
    if (state.currentChoices == null) return;

    final choice = state.currentChoices!.firstWhere(
      (c) => c.id == choiceId,
      orElse: () => state.currentChoices!.first,
    );

    // Add investigation points if any
    if (choice.points != null) {
      state = state.copyWith(
        investigationPoints: state.investigationPoints + (choice.points ?? 0),
      );
    }

    // 선택 기록 추가
    final updatedChoices = List<String>.from(state.choicesMade)..add(choice.text);
    state = state.copyWith(
      choicesMade: updatedChoices,
      currentChoices: null,
    );

    // Add player choice as message
    _addMessage('detective', choice.text);

    // 자동 저장
    _autoSave();

    // Continue to next node
    if (_isAutoMode) {
      _scheduleMessage(_getDelay(1), () {
        _advanceNode();
      });
    } else {
      // Manual 모드에서도 선택 후 자동 진행
      _advanceNode();
    }
  }

  // Reload episode with new language
  Future<void> reloadWithLanguage(String language) async {
    _cancelAllTimers();

    state = state.copyWith(
      messages: [],
      currentNodeIndex: 0,
      isLoading: true,
    );

    final episodeData = await _episodeLoader.loadEpisode('episode1', language);

    state = state.copyWith(
      episodeData: episodeData,
      isLoading: false,
    );

    _loadScene('scene_0');
  }

  // Interactive effects (to be called from UI)
  // These methods expose BuildContext-dependent widgets
  // Usage: ref.read(storyProviderV2.notifier).showNotificationEffect(context, ...)
  
  void showNotificationEffect(BuildContext context, NotificationData data) {
    NotificationOverlay.show(context, data);
  }

  void showRealisticNotification(
    BuildContext context, {
    required String appName,
    required String title,
    required String body,
    String? icon,
    Color? accentColor,
    VoidCallback? onTap,
  }) {
    // Import required in file: import '../widgets/realistic_notification.dart';
    // RealisticNotification.show(
    //   context,
    //   appName: appName,
    //   title: title,
    //   body: body,
    //   icon: icon,
    //   accentColor: accentColor ?? const Color(0xFF00D9FF),
    //   onTap: onTap,
    // );
  }

  void showFlashEffect(BuildContext context) {
    ScreenEffects.flash(context);
  }

  void showFadeEffect(BuildContext context, {Color? color}) {
    ScreenEffects.fade(context, color: color ?? Colors.black);
  }

  void vibrateEffect(VibrationPattern pattern) {
    ScreenEffects.vibrate(pattern);
  }

  void showEmailFullscreen(BuildContext context, EmailData email) {
    EmailFullScreen.show(context, email);
  }

  // 이모지 리액션 추가 (메시지 인덱스 기반)
  void addReactionToMessage(int messageIndex, String emoji) {
    if (messageIndex < 0 || messageIndex >= state.messages.length) return;

    final updatedMessages = List<StoryMessage>.from(state.messages);
    final originalMessage = updatedMessages[messageIndex];

    // 새로운 메시지 객체 생성 (reaction 추가)
    updatedMessages[messageIndex] = StoryMessage(
      id: originalMessage.id,
      speaker: originalMessage.speaker,
      text: originalMessage.text,
      timestamp: originalMessage.timestamp,
      storyTime: originalMessage.storyTime,
      email: originalMessage.email,
      emailData: originalMessage.emailData,
      dataLog: originalMessage.dataLog,
      reaction: emoji,
      typingUser: originalMessage.typingUser,
    );

    state = state.copyWith(messages: updatedMessages);
  }

  // 이모지 리액션 제거
  void removeReactionFromMessage(int messageIndex) {
    if (messageIndex < 0 || messageIndex >= state.messages.length) return;

    final updatedMessages = List<StoryMessage>.from(state.messages);
    final originalMessage = updatedMessages[messageIndex];

    // 새로운 메시지 객체 생성 (reaction 제거)
    updatedMessages[messageIndex] = StoryMessage(
      id: originalMessage.id,
      speaker: originalMessage.speaker,
      text: originalMessage.text,
      timestamp: originalMessage.timestamp,
      storyTime: originalMessage.storyTime,
      email: originalMessage.email,
      emailData: originalMessage.emailData,
      dataLog: originalMessage.dataLog,
      reaction: null,
      typingUser: originalMessage.typingUser,
    );

    state = state.copyWith(messages: updatedMessages);
  }

  // 자동 저장
  Future<void> _autoSave() async {
    if (state.episodeData == null) return;

    await SaveLoadService.saveProgress(
      episodeId: state.currentEpisodeId,
      sceneId: state.currentSceneId,
      nodeIndex: state.currentNodeIndex,
      detectiveName: state.detectiveName,
      investigationPoints: state.investigationPoints,
      choicesMade: state.choicesMade,
      totalScore: state.totalScore,
      messages: state.messages.map((m) => {
        'speaker': m.speaker,
        'text': m.text,
        'storyTime': m.storyTime,
      }).toList(),
    );
  }

  // 저장된 진행 상황 불러오기
  Future<void> loadSavedProgress() async {
    final savedProgress = await SaveLoadService.loadProgress();
    if (savedProgress == null) return;

    state = state.copyWith(isLoading: true);

    // 에피소드 데이터 로드
    final language = ref.read(settingsProvider).language;
    final episodeData = await _episodeLoader.loadEpisode(savedProgress.episodeId, language);

    if (episodeData == null) return;

    state = state.copyWith(
      currentEpisodeId: savedProgress.episodeId,
      currentSceneId: savedProgress.sceneId,
      currentNodeIndex: savedProgress.nodeIndex,
      detectiveName: savedProgress.detectiveName,
      investigationPoints: savedProgress.investigationPoints,
      choicesMade: savedProgress.choicesMade,
      totalScore: savedProgress.totalScore,
      episodeData: episodeData,
      isLoading: false,
    );

    _loadScene(savedProgress.sceneId);
  }

  // 에피소드 완료 처리
  void completeEpisode() {
    final finalScore = state.investigationPoints * 10 + state.choicesMade.length * 5;
    
    state = state.copyWith(
      episodeCompleted: true,
      totalScore: finalScore,
    );
  }

  // 에피소드 재시작
  Future<void> restartEpisode() async {
    await SaveLoadService.clearProgress();
    
    _cancelAllTimers();
    
    state = StoryState(
      messages: [],
      currentSceneId: 'scene_0',
      isLoading: true,
      currentEpisodeId: 'episode1',
    );

    await _initializeStory();
  }
}

// Provider
final storyProviderV2 = NotifierProvider<StoryNotifierV2, StoryState>(
  () => StoryNotifierV2(),
);
