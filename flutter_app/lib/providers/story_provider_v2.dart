import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/text_utils.dart';
import './settings_provider.dart';
import '../services/audio_service.dart';
import '../services/episode_loader_service.dart';

// Story message for chat display
class StoryMessage {
  final String id;
  final String speaker; // 'kastor', 'detective', 'maya', 'narrator', 'system'
  final String text;
  final DateTime timestamp;
  final String? email; // Email content if this is an email message
  final Map<String, dynamic>? emailData; // Full email data
  final String? reaction; // Emoji reaction from other characters

  StoryMessage({
    required this.id,
    required this.speaker,
    required this.text,
    required this.timestamp,
    this.email,
    this.emailData,
    this.reaction,
  });
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

  @override
  void dispose() {
    _cancelAllTimers();
    super.dispose();
  }

  void _cancelAllTimers() {
    for (final timer in _timers) {
      timer?.cancel();
    }
    _timers.clear();
  }

  Duration _getDelay(int multiplier) {
    final settings = ref.read(settingsProvider);
    return calculateTextDelay(settings.textSpeed, baseDelayMs: 1500 * multiplier);
  }

  bool get _isAutoMode => ref.read(settingsProvider).autoTextMode;

  void _scheduleMessage(Duration delay, VoidCallback callback) {
    _messageQueue++;

    // Update pending messages count
    state = state.copyWith(pendingMessages: _messageQueue);

    Timer? timer;
    timer = Timer(delay, () {
      if (mounted) {
        callback();
        _timers.remove(timer);
        _messageQueue--;
        state = state.copyWith(pendingMessages: _messageQueue);
      }
    });
    _timers.add(timer);
  }

  Future<void> _initializeStory() async {
    try {
      // Get current language from settings
      final language = ref.read(settingsProvider).language;

      // Load episode data
      final episodeData = await _episodeLoader.loadEpisode('episode1', language);

      state = state.copyWith(
        episodeData: episodeData,
        isLoading: false,
      );

      // Start with first scene
      _loadScene('scene_0');
    } catch (e) {
      print('Error initializing story: $e');
      state = state.copyWith(isLoading: false);
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

  void _addMessage(String speaker, String text, {String? email, Map<String, dynamic>? emailData}) {
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
      reaction: reaction,
    );

    state = state.copyWith(
      messages: [...state.messages, message],
    );

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

    // Clear choices
    state = state.copyWith(currentChoices: null);

    // Add player choice as message
    _addMessage('detective', choice.text);

    // Continue to next node
    if (_isAutoMode) {
      _scheduleMessage(_getDelay(1), () {
        _advanceNode();
      });
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
}

// Provider
final storyProviderV2 = NotifierProvider<StoryNotifierV2, StoryState>(
  () => StoryNotifierV2(),
);
