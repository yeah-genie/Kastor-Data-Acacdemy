import 'package:flutter/material.dart';
import '../../models/story_content.dart';
import '../../widgets/character_avatar.dart';
import '../../widgets/animated_widgets.dart';
import '../../services/audio_service.dart';

class StoryChatScreen extends StatefulWidget {
  final EpisodeStory story;

  const StoryChatScreen({
    super.key,
    required this.story,
  });

  @override
  State<StoryChatScreen> createState() => _StoryChatScreenState();
}

class _StoryChatScreenState extends State<StoryChatScreen> {
  final List<ChatMessage> _messages = [];
  final ScrollController _scrollController = ScrollController();
  final AudioService _audioService = AudioService();

  int _currentSceneIndex = 0;
  int _currentNodeIndex = 0;
  bool _showMenu = false;

  @override
  void initState() {
    super.initState();
    _loadNextNode();
  }

  void _loadNextNode() {
    if (_currentSceneIndex >= widget.story.scenes.length) {
      // 에피소드 완료
      return;
    }

    final scene = widget.story.scenes[_currentSceneIndex];
    if (_currentNodeIndex >= scene.nodes.length) {
      // 다음 씬으로
      _currentSceneIndex++;
      _currentNodeIndex = 0;
      _loadNextNode();
      return;
    }

    final node = scene.nodes[_currentNodeIndex];
    _processNode(node);
  }

  void _processNode(StoryNode node) {
    setState(() {
      switch (node.type) {
        case StoryNodeType.dialogue:
        case StoryNodeType.narration:
          _messages.add(ChatMessage(
            speaker: node.speaker ?? 'Narrator',
            text: node.text ?? '',
            isNarration: node.type == StoryNodeType.narration,
          ));
          _audioService.playSFX(SoundEffect.notification);
          break;

        case StoryNodeType.choice:
          _messages.add(ChatMessage(
            speaker: 'System',
            text: node.text ?? '선택하세요',
            choices: node.choices,
          ));
          break;

        case StoryNodeType.celebration:
          _messages.add(ChatMessage(
            speaker: 'System',
            text: node.text ?? '',
            isCelebration: true,
            data: node.data,
          ));
          _audioService.playSFX(SoundEffect.achievementUnlocked);
          break;

        case StoryNodeType.email:
        case StoryNodeType.phoneCall:
          _messages.add(ChatMessage(
            speaker: node.speaker ?? 'Unknown',
            text: node.text ?? '',
            data: node.data,
            isSpecial: true,
          ));
          break;

        case StoryNodeType.input:
          _messages.add(ChatMessage(
            speaker: 'System',
            text: node.text ?? '입력하세요',
            needsInput: true,
          ));
          return; // 입력 대기

        default:
          break;
      }

      _currentNodeIndex++;
    });

    // 자동 스크롤
    Future.delayed(const Duration(milliseconds: 300), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });

    // 선택지가 아니면 자동으로 다음 노드
    if (node.type != StoryNodeType.choice &&
        node.type != StoryNodeType.input) {
      Future.delayed(const Duration(milliseconds: 1500), () {
        _loadNextNode();
      });
    }
  }

  void _onChoiceSelected(Choice choice) {
    _audioService.playSFX(SoundEffect.buttonClick);

    setState(() {
      _messages.add(ChatMessage(
        speaker: 'Detective',
        text: choice.text,
        isUserChoice: true,
      ));
    });

    if (choice.isCorrect == true) {
      _audioService.playSFX(SoundEffect.correct);
    }

    Future.delayed(const Duration(milliseconds: 500), () {
      _loadNextNode();
    });
  }

  void _onInputSubmitted(String text) {
    setState(() {
      _messages.add(ChatMessage(
        speaker: 'Detective',
        text: text,
        isUserChoice: true,
      ));
    });

    Future.delayed(const Duration(milliseconds: 500), () {
      _loadNextNode();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.story.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              // 에피소드 정보
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          Column(
            children: [
              Expanded(
                child: ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  itemCount: _messages.length,
                  itemBuilder: (context, index) {
                    return _buildMessage(_messages[index]);
                  },
                ),
              ),
              _buildInputArea(),
            ],
          ),
          if (_showMenu) _buildMenuOverlay(),
        ],
      ),
    );
  }

  Widget _buildMessage(ChatMessage message) {
    if (message.isNarration) {
      return FadeInWidget(
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            message.text,
            style: TextStyle(
              fontStyle: FontStyle.italic,
              color: Colors.grey.shade700,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    if (message.isCelebration) {
      return FadeInWidget(
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 8),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.amber.shade400, Colors.orange.shade400],
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.celebration, color: Colors.white),
              const SizedBox(width: 8),
              Text(
                message.text,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              if (message.data?['points'] != null) ...[
                const SizedBox(width: 8),
                Text(
                  '+${message.data!['points']}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ],
            ],
          ),
        ),
      );
    }

    if (message.choices != null) {
      return FadeInWidget(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ...message.choices!.map((choice) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: ElevatedButton(
                  onPressed: () => _onChoiceSelected(choice),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                    alignment: Alignment.centerLeft,
                  ),
                  child: Text(choice.text),
                ),
              );
            }),
          ],
        ),
      );
    }

    if (message.needsInput) {
      return FadeInWidget(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: TextField(
            decoration: InputDecoration(
              hintText: message.text,
              border: const OutlineInputBorder(),
              suffixIcon: const Icon(Icons.send),
            ),
            onSubmitted: _onInputSubmitted,
          ),
        ),
      );
    }

    // 일반 대화
    final isUser = message.isUserChoice;
    return FadeInWidget(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          mainAxisAlignment:
              isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser) ...[
              CharacterAvatar(
                characterName: message.speaker,
                size: 40,
              ),
              const SizedBox(width: 8),
            ],
            Flexible(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isUser ? Colors.blue.shade100 : Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (!isUser)
                      Text(
                        message.speaker,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    if (!isUser) const SizedBox(height: 4),
                    Text(message.text),
                  ],
                ),
              ),
            ),
            if (isUser) const SizedBox(width: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            iconSize: 32,
            color: Colors.grey.shade700,
            onPressed: () {
              setState(() {
                _showMenu = !_showMenu;
              });
              _audioService.playSFX(SoundEffect.buttonClick);
            },
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                '다음 내용을 보려면 + 버튼을 누르세요',
                style: TextStyle(color: Colors.grey),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuOverlay() {
    return GestureDetector(
      onTap: () {
        setState(() {
          _showMenu = false;
        });
      },
      child: Container(
        color: Colors.black.withValues(alpha: 0.5),
        child: Align(
          alignment: Alignment.bottomLeft,
          child: SlideInWidget(
            direction: SlideDirection.fromBottom,
            duration: const Duration(milliseconds: 300),
            child: Container(
              margin: const EdgeInsets.only(bottom: 80, left: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 8,
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildMenuItem(Icons.bar_chart, '데이터 분석', () {
                    // 데이터 탭으로
                  }),
                  _buildMenuItem(Icons.folder, '파일', () {
                    // 파일 탭으로
                  }),
                  _buildMenuItem(Icons.people, '팀', () {
                    // 팀 탭으로
                  }),
                  _buildMenuItem(Icons.assessment, '진행률', () {
                    // 진행률 탭으로
                  }),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: () {
        setState(() {
          _showMenu = false;
        });
        onTap();
        _audioService.playSFX(SoundEffect.buttonClick);
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.blue.shade100,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: Colors.blue.shade700),
            ),
            const SizedBox(width: 12),
            Text(
              label,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}

class ChatMessage {
  final String speaker;
  final String text;
  final bool isNarration;
  final bool isCelebration;
  final bool isUserChoice;
  final bool isSpecial;
  final bool needsInput;
  final List<Choice>? choices;
  final Map<String, dynamic>? data;

  ChatMessage({
    required this.speaker,
    required this.text,
    this.isNarration = false,
    this.isCelebration = false,
    this.isUserChoice = false,
    this.isSpecial = false,
    this.needsInput = false,
    this.choices,
    this.data,
  });
}
