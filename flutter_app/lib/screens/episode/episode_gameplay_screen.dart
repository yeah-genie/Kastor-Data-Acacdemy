import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/game_state_provider.dart';

class EpisodeGameplayScreen extends ConsumerStatefulWidget {
  final int episodeNumber;

  const EpisodeGameplayScreen({
    super.key,
    required this.episodeNumber,
  });

  @override
  ConsumerState<EpisodeGameplayScreen> createState() =>
      _EpisodeGameplayScreenState();
}

class _EpisodeGameplayScreenState
    extends ConsumerState<EpisodeGameplayScreen> {
  int _currentSceneIndex = 0;
  bool _showingChoices = false;
  bool _showingDocument = false;
  String _documentContent = '';
  String _documentTitle = '';

  @override
  Widget build(BuildContext context) {
    final scenes = _getEpisodeScenes();
    final currentScene = scenes[_currentSceneIndex];

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF0F0C29), // Deep dark blue
              Color(0xFF302B63), // Dark purple
              Color(0xFF24243E), // Dark indigo
            ],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Background scene image placeholder
              if (currentScene.backgroundImage != null)
                Positioned.fill(
                  child: Opacity(
                    opacity: 0.3,
                    child: Image.asset(
                      currentScene.backgroundImage!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          const SizedBox(),
                    ),
                  ),
                ),

              // Main content
              Column(
                children: [
                  // Top bar
                  _buildTopBar(),

                  // Scene content
                  Expanded(
                    child: Column(
                      children: [
                        const Spacer(),

                        // Dialogue box
                        _buildDialogueBox(currentScene),

                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ],
              ),

              // Document overlay
              if (_showingDocument) _buildDocumentOverlay(),

              // Choices overlay
              if (_showingChoices && currentScene.choices != null)
                _buildChoicesOverlay(currentScene.choices!),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.black.withOpacity(0.7),
            Colors.black.withOpacity(0.3),
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.arrow_back, color: Colors.white),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Episode ${widget.episodeNumber}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                LinearProgressIndicator(
                  value: (_currentSceneIndex + 1) / _getEpisodeScenes().length,
                  backgroundColor: Colors.white.withOpacity(0.2),
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    Color(0xFF6366F1),
                  ),
                  minHeight: 4,
                  borderRadius: BorderRadius.circular(2),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          IconButton(
            onPressed: () => _showMenu(),
            icon: const Icon(Icons.menu, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildDialogueBox(SceneData scene) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 24),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF6366F1).withOpacity(0.3),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6366F1).withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Speaker name
          if (scene.speaker != null) ...[
            Row(
              children: [
                if (scene.speakerAvatar != null)
                  Container(
                    width: 40,
                    height: 40,
                    margin: const EdgeInsets.only(right: 12),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                      ),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.3),
                        width: 2,
                      ),
                    ),
                    child: const Icon(
                      Icons.person,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                Text(
                  scene.speaker!,
                  style: const TextStyle(
                    color: Color(0xFF6366F1),
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
          ],

          // Dialogue text
          Text(
            scene.dialogue,
            style: TextStyle(
              color: Colors.white.withOpacity(0.95),
              fontSize: 16,
              height: 1.6,
            ),
          ),

          const SizedBox(height: 20),

          // Action buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              // Show choices button
              if (scene.choices != null)
                ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _showingChoices = true;
                    });
                  },
                  icon: const Icon(Icons.chat_bubble_outline, size: 18),
                  label: const Text('Choose'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),

              const SizedBox(width: 12),

              // View document button
              if (scene.documentContent != null)
                ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _showingDocument = true;
                      _documentContent = scene.documentContent!;
                      _documentTitle = scene.documentTitle ?? 'Document';
                    });
                  },
                  icon: const Icon(Icons.description, size: 18),
                  label: const Text('View'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF8B5CF6),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),

              const SizedBox(width: 12),

              // Next button
              if (scene.choices == null)
                ElevatedButton.icon(
                  onPressed: _nextScene,
                  icon: const Icon(Icons.arrow_forward, size: 18),
                  label: const Text('Next'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white.withOpacity(0.1),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: BorderSide(
                        color: Colors.white.withOpacity(0.3),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChoicesOverlay(List<ChoiceOption> choices) {
    return Container(
      color: Colors.black.withOpacity(0.9),
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(24),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E1B4B), Color(0xFF312E81)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: const Color(0xFF6366F1).withOpacity(0.5),
              width: 2,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Make Your Choice',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 24),
              ...choices.map((choice) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ElevatedButton(
                    onPressed: () {
                      _handleChoice(choice);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white.withOpacity(0.1),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.all(20),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: const Color(0xFF6366F1).withOpacity(0.5),
                        ),
                      ),
                      minimumSize: const Size(double.infinity, 60),
                    ),
                    child: Text(
                      choice.text,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDocumentOverlay() {
    return Container(
      color: Colors.black.withOpacity(0.95),
      child: SafeArea(
        child: Column(
          children: [
            // Document header
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      _documentTitle,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      setState(() {
                        _showingDocument = false;
                      });
                    },
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                ],
              ),
            ),

            // Document content
            Expanded(
              child: Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: SingleChildScrollView(
                  child: Text(
                    _documentContent,
                    style: const TextStyle(
                      color: Colors.black87,
                      fontSize: 14,
                      height: 1.6,
                      fontFamily: 'Courier',
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _nextScene() {
    final scenes = _getEpisodeScenes();
    if (_currentSceneIndex < scenes.length - 1) {
      setState(() {
        _currentSceneIndex++;
        _showingChoices = false;
      });
    } else {
      _completeEpisode();
    }
  }

  void _handleChoice(ChoiceOption choice) {
    // Record choice in game state
    ref.read(gameStateProvider.notifier).makeChoice(
          choice.id,
          'episode_${widget.episodeNumber}_scene_$_currentSceneIndex',
        );

    // Show feedback if available
    if (choice.feedback != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(choice.feedback!),
          behavior: SnackBarBehavior.floating,
          backgroundColor: const Color(0xFF6366F1),
        ),
      );
    }

    setState(() {
      _showingChoices = false;
    });

    // Move to next scene
    _nextScene();
  }

  void _completeEpisode() {
    ref
        .read(gameStateProvider.notifier)
        .completeEpisode('episode${widget.episodeNumber}');

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1B4B),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: const Color(0xFF6366F1).withOpacity(0.5),
            width: 2,
          ),
        ),
        title: const Row(
          children: [
            Icon(Icons.celebration, color: Color(0xFFF59E0B), size: 32),
            SizedBox(width: 12),
            Text(
              'Case Closed!',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
        content: Text(
          'You successfully completed Episode ${widget.episodeNumber}!\n\nThe truth has been revealed.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              Navigator.of(context).pop(); // Go back to episode selection
            },
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  void _showMenu() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1B4B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.save, color: Colors.white),
              title:
                  const Text('Save Progress', style: TextStyle(color: Colors.white)),
              onTap: () {
                ref.read(gameStateProvider.notifier).saveGameState();
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Progress saved')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.exit_to_app, color: Colors.white),
              title: const Text('Exit Episode',
                  style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
      ),
    );
  }

  List<SceneData> _getEpisodeScenes() {
    // This is a simplified version - in production, this would load from assets/JSON
    switch (widget.episodeNumber) {
      case 1:
        return _getEpisode1Scenes();
      case 2:
        return _getEpisode2Scenes();
      case 3:
        return _getEpisode3Scenes();
      default:
        return [];
    }
  }

  List<SceneData> _getEpisode1Scenes() {
    return [
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            'A run-down detective office. Dust on the desk. Someone\'s sleeping.',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue: 'Zzzzz...',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'DETECTIVE',
        dialogue: '...Is this the right place?',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue: 'Hm? Oh! New person?',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue: 'I\'m Kastor. Your partner!',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue: 'Email notification - DING!',
      ),
      SceneData(
        speaker: 'Email',
        dialogue:
            'FROM: Maya Zhang\nSUBJECT: URGENT! Need Help!\n\n"Hello detectives!\n\nI\'m Maya, director of Legend Arena.\n\nWe have a HUGE problem! 😰\n\nOur character Shadow\'s win rate jumped from 50% to 85% in ONE DAY!\n\nWe didn\'t patch him! I have no idea why this happened!\n\nPlayers are furious! The community is exploding!\n\nIf we lose player trust... the game is finished!\n\nPLEASE HELP US!"',
        documentContent:
            'FROM: Maya Zhang\nSUBJECT: URGENT! Need Help!\n\nHello detectives!\n\nI\'m Maya, director of Legend Arena.\n\nWe have a HUGE problem! Our character Shadow\'s win rate jumped from 50% to 85% in ONE DAY!\n\nWe didn\'t patch him! I have no idea why this happened!\n\nPlayers are furious! The community is exploding!\n\nIf we lose player trust... the game is finished!\n\nPLEASE HELP US!',
        documentTitle: 'Email from Maya Zhang',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue: 'So! Three possibilities! Pick one!',
        speakerAvatar: 'kastor',
        choices: [
          ChoiceOption(
            id: 'official_patch',
            text: 'A) Official patch',
            feedback: 'Interesting choice, but let\'s investigate further...',
          ),
          ChoiceOption(
            id: 'rare_bug',
            text: 'B) Rare bug',
            feedback: 'Possible, but we need more evidence.',
          ),
          ChoiceOption(
            id: 'data_modification',
            text: 'C) Secret data modification',
            feedback: 'Ooh! Crime vibes! I like it!',
          ),
        ],
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue:
            'Data received. Open the graph! The red line (Shadow) rockets up at Day 28...',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            'After investigating server logs, you discover admin01 (Kaito Nakamura) modified Shadow\'s data at 23:47 and played as player "Noctis" shortly after.',
      ),
      SceneData(
        speaker: 'KAITO',
        dialogue:
            'That\'s... I just... I\'m sorry... I just wanted to win.',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            'Case Summary: Kaito modified Shadow using dev access, then played as Noctis.\n\nMotivation: Prove himself after repeated losses.\n\n🎉 CASE CLOSED!',
      ),
    ];
  }

  List<SceneData> _getEpisode2Scenes() {
    return [
      SceneData(
        speaker: 'KASTOR',
        dialogue: 'Legend Arena again. Ranking chaos.',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'Email',
        dialogue:
            'FROM: Marcus Chen\nSUBJECT: Urgent - Rankings Destroyed\n\n"Detectives,\n\nWe need you again.\nTop players\' scores are dropping.\nUnknown accounts are dominating rankings.\nBut these accounts... they don\'t exist.\nGhost users. Hundreds of them.\n\nPlease help.\n- Marcus"',
        documentContent:
            'FROM: Marcus Chen\nSUBJECT: Urgent - Rankings Destroyed\n\nDetectives,\n\nWe need you again.\nTop players\' scores are dropping.\nUnknown accounts are dominating rankings.\nBut these accounts... they don\'t exist.\nGhost users. Hundreds of them.\n\nPlease help.\n- Marcus',
        documentTitle: 'Email from Marcus Chen',
      ),
      SceneData(
        speaker: 'DETECTIVE',
        dialogue: 'Ghost users?',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue:
            'Accounts that look real but aren\'t. This is more sophisticated than Episode 1.',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            'After analyzing bot patterns and tracing account creation, you discover Elena Petrova, Head of Security, was manipulated by an unknown person "CodeMaster_X" over a year-long social engineering campaign.',
      ),
      SceneData(
        speaker: 'ELENA',
        dialogue:
            'He seemed so understanding... But then he showed me logs. Everything I\'d done. All the evidence. Said he\'d report me unless I installed a backdoor...',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue:
            'Someone who planned this a year in advance. Who manipulated Elena. Who stole our data. Who\'s still out there.',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            '🎉 CASE PARTIALLY SOLVED!\n\nElena was let go, but the mastermind "CodeMaster_X" remains at large...',
      ),
    ];
  }

  List<SceneData> _getEpisode3Scenes() {
    return [
      SceneData(
        speaker: 'MARCUS',
        dialogue: 'The finals were... off. There\'s no way Phoenix should have lost.',
      ),
      SceneData(
        speaker: 'JAKE',
        dialogue:
            'We trained for three months. Twelve hours a day... But in the finals, my hands didn\'t feel like my own. It was like they had a script!',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue: 'Let\'s analyze 126 matches worth of data. Find what\'s wrong.',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            'The finals matches show complete anomalies - Phoenix suddenly playing like beginners while Dark Horses played beyond pro level.',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            'After examining timeline analysis, betting patterns, and interviewing Coach Harrison Webb, you uncover a sophisticated match-fixing operation.',
      ),
      SceneData(
        speaker: 'COACH HARRISON',
        dialogue:
            'Experience trumps talent, you see. I simply read patterns. But this is... circumstantial, at best.',
      ),
      SceneData(
        speaker: 'KASTOR',
        dialogue:
            'The timing, the betting accounts, the code modifications... Everything points to you, Coach.',
        speakerAvatar: 'kastor',
      ),
      SceneData(
        speaker: 'NARRATOR',
        dialogue:
            '🎉 CASE CLOSED!\n\nCoach Harrison Webb arrested for match-fixing. The connection to previous cases becomes clearer...',
      ),
    ];
  }
}

class SceneData {
  final String? speaker;
  final String dialogue;
  final String? speakerAvatar;
  final String? backgroundImage;
  final List<ChoiceOption>? choices;
  final String? documentContent;
  final String? documentTitle;

  SceneData({
    this.speaker,
    required this.dialogue,
    this.speakerAvatar,
    this.backgroundImage,
    this.choices,
    this.documentContent,
    this.documentTitle,
  });
}

class ChoiceOption {
  final String id;
  final String text;
  final String? feedback;

  ChoiceOption({
    required this.id,
    required this.text,
    this.feedback,
  });
}
