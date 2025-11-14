import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/text_utils.dart';
import './settings_provider.dart';

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
  final int investigationPoints;
  final String? detectiveName;
  final bool waitingForInput;
  final String? inputPrompt;

  StoryState({
    required this.messages,
    this.currentChoices,
    required this.currentSceneId,
    this.investigationPoints = 0,
    this.detectiveName,
    this.waitingForInput = false,
    this.inputPrompt,
  });

  StoryState copyWith({
    List<StoryMessage>? messages,
    List<StoryChoice>? currentChoices,
    String? currentSceneId,
    int? investigationPoints,
    String? detectiveName,
    bool? waitingForInput,
    String? inputPrompt,
  }) {
    return StoryState(
      messages: messages ?? this.messages,
      currentChoices: currentChoices ?? this.currentChoices,
      currentSceneId: currentSceneId ?? this.currentSceneId,
      investigationPoints: investigationPoints ?? this.investigationPoints,
      detectiveName: detectiveName ?? this.detectiveName,
      waitingForInput: waitingForInput ?? this.waitingForInput,
      inputPrompt: inputPrompt ?? this.inputPrompt,
    );
  }
}

// Story provider to manage Episode 1 story progression
class StoryNotifier extends Notifier<StoryState> {
  @override
  StoryState build() {
    _initializeStory();
    return StoryState(messages: [], currentSceneId: 'scene_0_start');
  }

  Duration _getDelay(int multiplier) {
    final settings = ref.read(settingsProvider);
    return calculateTextDelay(settings.textSpeed, baseDelayMs: 1500 * multiplier);
  }

  bool get _isAutoMode => ref.read(settingsProvider).autoTextMode;

  void _initializeStory() {
    // Scene 0: Partnership - Start with initial messages
    _addMessage('kastor', '(snoring) Zzzzz...');

    if (_isAutoMode) {
      Future.delayed(_getDelay(1), () {
        _addMessage('narrator', '[Door opens — Detective enters]');
      });

      Future.delayed(_getDelay(2), () {
        _addMessage('detective', '...Is this the right place?');
      });

      Future.delayed(_getDelay(3), () {
        _addMessage('kastor', 'Hm? (stretches) Oh! New recruit?');
      });

      Future.delayed(_getDelay(4), () {
        _addMessage('detective', 'Starting as a detective today.');
      });

      Future.delayed(_getDelay(5), () {
        _addMessage('kastor', 'Detective? You don\'t look like one.');
      });

      Future.delayed(_getDelay(6), () {
        _addMessage('detective', 'It\'s my first day!');
      });

      Future.delayed(_getDelay(7), () {
        _addMessage('kastor', 'Shows. It\'s written all over your face. (grins)');
      });

      Future.delayed(_getDelay(8), () {
        _addMessage('detective', '(This guy...)');
      });

      Future.delayed(_getDelay(9), () {
        _addMessage('kastor', 'I\'m Kastor! Your partner!');
      });

      Future.delayed(_getDelay(10), () {
        _addMessage('kastor', 'Nice to meet you... wait, what\'s your name again?');
      });

      Future.delayed(_getDelay(11), () {
        _addMessage('detective', 'No, MY name.');
      });

      Future.delayed(_getDelay(12), () {
        _addMessage('kastor', 'Oh~ YOUR name! What is it?');
        // Set waiting for name input
        state = state.copyWith(
          waitingForInput: true,
          inputPrompt: '[INPUT: Name]',
        );
      });
    }
  }

  void _addMessage(String speaker, String text, {String? email, Map<String, dynamic>? emailData}) {
    // Convert text expressions to emojis
    final convertedText = convertTextToEmoji(text);

    // Add random reaction
    final reaction = getRandomReaction(speaker);

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
  }

  // Manual mode: advance to next message
  void continueStory() {
    if (_isAutoMode) return; // Only works in manual mode

    // Trigger next message based on current scene
    // This would need more sophisticated state management in production
    if (state.messages.isEmpty) {
      _initializeStory();
    }
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
      Future.delayed(_getDelay(1), () {
        _addMessage('kastor', 'Cool name! Spelled right?');
      });

      Future.delayed(_getDelay(2), () {
        _addMessage('detective', 'I just typed it myself.');
      });

      Future.delayed(_getDelay(3), () {
        _addMessage('kastor', 'Perfect! Name tags are non-refundable.');
      });

      Future.delayed(_getDelay(4), () {
        _addMessage('detective', 'What...?');
      });

      Future.delayed(_getDelay(5), () {
        _addMessage('narrator', '[Email notification — DING!]');
      });

      Future.delayed(_getDelay(6), () {
        _addMessage('kastor', 'Ooh! Mail!');
      });

      Future.delayed(_getDelay(7), () {
        _addMessage('detective', 'Already?');
      });

      Future.delayed(_getDelay(8), () {
        _addMessage('kastor', 'Lucky you! No cases = boredom central. Click it!');
      });

      Future.delayed(_getDelay(9), () {
        // Show email
        _showMayaEmail();
      });
    }
  }

  void _showMayaEmail() {
    final emailData = {
      'from': 'Maya Zhang (Director, Legend Arena)',
      'subject': 'URGENT! Need Help!',
      'body': '''Hello detectives!

Our character Shadow's win rate jumped from 50% to 85% in ONE DAY!

We didn't patch him! I have NO idea why this happened! 😰

The community is exploding! If we lose player trust, the game is finished!

PLEASE HELP US!''',
    };

    _addMessage(
      'system',
      '📧 New Email Arrived',
      email: emailData['body'],
      emailData: emailData,
    );

    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      _addMessage('kastor', 'Ooh! Gaming case! Fun stuff!');
    });

    Future.delayed(const Duration(milliseconds: 2400), () {
      if (!mounted) return;
      _addMessage('detective', 'Shadow suddenly got way stronger...');
    });

    Future.delayed(const Duration(milliseconds: 3200), () {
      if (!mounted) return;
      _addMessage('kastor', '35% jump! That\'s insane!');
    });

    Future.delayed(const Duration(milliseconds: 4000), () {
      if (!mounted) return;
      _addMessage('detective', 'Is that a lot?');
    });

    Future.delayed(const Duration(milliseconds: 4800), () {
      if (!mounted) return;
      _addMessage('kastor', 'Imagine... eating half a chicken, then suddenly eating THREE whole chickens.');
    });

    Future.delayed(const Duration(milliseconds: 5600), () {
      if (!mounted) return;
      _addMessage('detective', '...What kind of analogy is that?');
    });

    Future.delayed(const Duration(milliseconds: 6400), () {
      if (!mounted) return;
      _addMessage('kastor', 'Didn\'t work? Okay, pizza then—');
    });

    Future.delayed(const Duration(milliseconds: 7200), () {
      if (!mounted) return;
      _addMessage('detective', 'NO! I get it! It\'s a lot!');
    });

    Future.delayed(const Duration(milliseconds: 8000), () {
      if (!mounted) return;
      _addMessage('kastor', '(laughs) See? Food analogies work!');
    });

    Future.delayed(const Duration(milliseconds: 9000), () {
      if (!mounted) return;
      _showHypothesisChoices();
    });
  }

  void _showHypothesisChoices() {
    _addMessage('kastor', 'Alright! First quest! Form a hypothesis!');

    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      _addMessage('detective', 'A hypothesis?');
    });

    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      _addMessage('kastor', 'Yep. Detectives can\'t just guess randomly. We need a starting theory to guide our search.');
    });

    Future.delayed(const Duration(milliseconds: 2400), () {
      if (!mounted) return;
      _addMessage('detective', 'Like a direction?');
    });

    Future.delayed(const Duration(milliseconds: 3200), () {
      if (!mounted) return;
      _addMessage('kastor', 'Exactly! Think of it like... choosing which door to open first in a mystery game.');
    });

    Future.delayed(const Duration(milliseconds: 4000), () {
      if (!mounted) return;
      _addMessage('kastor', 'So! Three possibilities. Pick one based on Maya\'s email!');

      // Show choices
      state = state.copyWith(
        currentChoices: [
          StoryChoice(
            id: 'choice_A',
            text: 'A) Official Patch (but undocumented)\nTheory: Maybe the team DID patch Shadow but forgot to write it down?',
            nextSceneId: 'scene_1_choice_A',
          ),
          StoryChoice(
            id: 'choice_B',
            text: 'B) Rare Bug\nTheory: Could be a random glitch that accidentally made Shadow stronger?',
            nextSceneId: 'scene_1_choice_B',
          ),
          StoryChoice(
            id: 'choice_C',
            text: 'C) Unauthorized Modification\nTheory: Someone secretly changed Shadow\'s stats on purpose?',
            nextSceneId: 'scene_1_choice_C',
            points: 10,
          ),
        ],
      );
    });
  }

  void selectChoice(StoryChoice choice) {
    // Clear choices
    state = state.copyWith(currentChoices: null);

    // Add detective's choice as message
    _addMessage('detective', choice.text);

    // Award points if any
    if (choice.points != null) {
      state = state.copyWith(
        investigationPoints: state.investigationPoints + choice.points!,
      );
    }

    // Process choice
    if (choice.id == 'choice_C') {
      _handleChoiceC();
    } else if (choice.id == 'choice_A') {
      _handleChoiceA();
    } else if (choice.id == 'choice_B') {
      _handleChoiceB();
    }
  }

  void _handleChoiceC() {
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      _addMessage('kastor', 'Ooh! Crime vibes! I like your thinking!');
    });

    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      _addMessage('detective', 'Just... a feeling.');
    });

    Future.delayed(const Duration(milliseconds: 2400), () {
      if (!mounted) return;
      _addMessage('kastor', 'Detectives can\'t work on feelings alone~');
    });

    Future.delayed(const Duration(milliseconds: 3200), () {
      if (!mounted) return;
      _addMessage('detective', 'Then what?');
    });

    Future.delayed(const Duration(milliseconds: 4000), () {
      if (!mounted) return;
      _addMessage('kastor', 'DATA! Numbers don\'t lie!');
    });

    Future.delayed(const Duration(milliseconds: 4800), () {
      if (!mounted) return;
      _addMessage('detective', 'But people do?');
    });

    Future.delayed(const Duration(milliseconds: 5600), () {
      if (!mounted) return;
      _addMessage('kastor', 'All the time! That\'s why we check the evidence first. Let\'s call Maya!');
    });

    Future.delayed(const Duration(milliseconds: 6400), () {
      if (!mounted) return;
      _addMessage('system', '🎵 MINI CELEBRATION — Case accepted! +10 points');

      // Start Scene 2
      _startScene2();
    });
  }

  void _handleChoiceA() {
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      _addMessage('kastor', 'Smart choice! Always check the official records first.');
    });

    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      _addMessage('kastor', 'It\'s like reading the instruction manual before taking apart a machine.');
    });

    Future.delayed(const Duration(milliseconds: 2400), () {
      if (!mounted) return;
      _addMessage('system', '🎵 MINI CELEBRATION — +5 Investigation Points');

      // Start Scene 2
      _startScene2();
    });
  }

  void _handleChoiceB() {
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      _addMessage('kastor', 'Bugs are always possible!');
    });

    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      _addMessage('kastor', 'But a 35% win rate increase is too specific for a random bug.');
    });

    Future.delayed(const Duration(milliseconds: 2400), () {
      if (!mounted) return;
      _addMessage('kastor', 'Something feels intentional. Let\'s investigate deeper!');

      // Start Scene 2
      _startScene2();
    });
  }

  void _startScene2() {
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (!mounted) return;
      _addMessage('narrator', '[Phone dialing sound]');
    });

    Future.delayed(const Duration(milliseconds: 2000), () {
      if (!mounted) return;
      _addMessage('maya', 'Hello? Detectives?');
    });

    Future.delayed(const Duration(milliseconds: 2800), () {
      if (!mounted) return;
      _addMessage('detective', 'Yes. We got your email. Can you tell us everything?');
    });

    Future.delayed(const Duration(milliseconds: 3600), () {
      if (!mounted) return;
      _addMessage('maya', 'Shadow\'s win rate spiked on Day 28. We definitely didn\'t patch him. The community thinks we\'re lying!');
    });

    Future.delayed(const Duration(milliseconds: 4400), () {
      if (!mounted) return;
      _addMessage('kastor', 'Can you send us the game data? Patch notes, server logs, player statistics?');
    });

    Future.delayed(const Duration(milliseconds: 5200), () {
      if (!mounted) return;
      _addMessage('maya', 'Sending now! Please hurry — every hour we wait, we lose more players!');
    });

    Future.delayed(const Duration(milliseconds: 6000), () {
      if (!mounted) return;
      _addMessage('detective', 'We\'ll figure this out.');
    });

    Future.delayed(const Duration(milliseconds: 6800), () {
      if (!mounted) return;
      _addMessage('system', '📊 Data Received!\n\nCheck the Files tab for:\n• Win rate graph\n• Patch notes\n• Server logs');

      state = state.copyWith(currentSceneId: 'scene_3_graph_analysis');
    });
  }

  void addUserMessage(String text) {
    _addMessage('detective', text);
  }
}

final storyProvider = NotifierProvider<StoryNotifier, StoryState>(() {
  return StoryNotifier();
});
