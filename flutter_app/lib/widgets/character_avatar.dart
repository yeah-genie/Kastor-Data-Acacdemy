import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CharacterAvatar extends StatelessWidget {
  final String characterName;
  final CharacterEmotion emotion;
  final double size;
  final bool showName;

  const CharacterAvatar({
    super.key,
    required this.characterName,
    this.emotion = CharacterEmotion.neutral,
    this.size = 80,
    this.showName = false,
  });

  String _getSvgAssetPath(String name) {
    // Map character names to SVG file names
    final nameMap = {
      'kastor': 'kastor',
      'detective': 'detective',
      'maya': 'maya',
      'narrator': 'narrator',
      'system': 'system',
    };

    final lowerName = name.toLowerCase();
    final svgName = nameMap[lowerName] ?? 'system';
    return 'assets/characters/$svgName.svg';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: _getBackgroundColor(characterName),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipOval(
            child: SvgPicture.asset(
              _getSvgAssetPath(characterName),
              width: size,
              height: size,
              fit: BoxFit.cover,
              placeholderBuilder: (context) => Center(
                child: Text(
                  _getInitial(characterName),
                  style: TextStyle(
                    fontSize: size * 0.4,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ),
        if (showName) ...[
          const SizedBox(height: 8),
          Text(
            characterName,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }

  String _getInitial(String name) {
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  Color _getBackgroundColor(String name) {
    // 캐릭터별 배경 색상
    final colorMap = {
      'kastor': Colors.purple.shade100,
      'detective': Colors.blue.shade100,
      'maya': Colors.pink.shade100,
      'narrator': Colors.grey.shade100,
      'system': Colors.indigo.shade100,
    };

    return colorMap[name.toLowerCase()] ?? Colors.grey.shade200;
  }

  List<Color> _getGradientColors(String name) {
    // 캐릭터별 고유 색상
    final colorMap = {
      'Kastor': [Colors.purple.shade400, Colors.purple.shade700],
      'Detective': [Colors.blue.shade400, Colors.blue.shade700],
      'Maya': [Colors.pink.shade400, Colors.pink.shade700],
      'Kaito': [Colors.teal.shade400, Colors.teal.shade700],
      'Lukas': [Colors.orange.shade400, Colors.orange.shade700],
      'Diego': [Colors.green.shade400, Colors.green.shade700],
    };

    return colorMap[name] ??
        [Colors.grey.shade400, Colors.grey.shade700];
  }
}

enum CharacterEmotion {
  neutral,
  happy,
  sad,
  surprised,
  angry,
  thinking,
}

class CharacterDialog extends StatelessWidget {
  final String characterName;
  final String message;
  final CharacterEmotion emotion;
  final VoidCallback? onTap;

  const CharacterDialog({
    super.key,
    required this.characterName,
    required this.message,
    this.emotion = CharacterEmotion.neutral,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CharacterAvatar(
              characterName: characterName,
              emotion: emotion,
              size: 48,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    characterName,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    message,
                    style: const TextStyle(fontSize: 15),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CharacterPortrait extends StatelessWidget {
  final String characterName;
  final CharacterEmotion emotion;
  final double size;

  const CharacterPortrait({
    super.key,
    required this.characterName,
    this.emotion = CharacterEmotion.neutral,
    this.size = 120,
  });

  String _getSvgAssetPath(String name) {
    final nameMap = {
      'kastor': 'kastor',
      'detective': 'detective',
      'maya': 'maya',
      'narrator': 'narrator',
      'system': 'system',
    };

    final lowerName = name.toLowerCase();
    final svgName = nameMap[lowerName] ?? 'system';
    return 'assets/characters/$svgName.svg';
  }

  Color _getBackgroundColor(String name) {
    final colorMap = {
      'kastor': Colors.purple.shade100,
      'detective': Colors.blue.shade100,
      'maya': Colors.pink.shade100,
      'narrator': Colors.grey.shade100,
      'system': Colors.indigo.shade100,
    };

    return colorMap[name.toLowerCase()] ?? Colors.grey.shade200;
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // 배경 원
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: _getBackgroundColor(characterName),
          ),
          child: ClipOval(
            child: SvgPicture.asset(
              _getSvgAssetPath(characterName),
              width: size,
              height: size,
              fit: BoxFit.cover,
              placeholderBuilder: (context) => Center(
                child: Text(
                  _getInitial(characterName),
                  style: TextStyle(
                    fontSize: size * 0.4,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ),
        // 감정 아이콘
        Positioned(
          bottom: 0,
          right: 0,
          child: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.grey.shade300, width: 2),
            ),
            child: Icon(
              _getEmotionIcon(emotion),
              size: size * 0.2,
              color: _getEmotionColor(emotion),
            ),
          ),
        ),
      ],
    );
  }

  String _getInitial(String name) {
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  List<Color> _getGradientColors(String name) {
    final colorMap = {
      'Kastor': [Colors.purple.shade400, Colors.purple.shade700],
      'Detective': [Colors.blue.shade400, Colors.blue.shade700],
      'Maya': [Colors.pink.shade400, Colors.pink.shade700],
      'Kaito': [Colors.teal.shade400, Colors.teal.shade700],
      'Lukas': [Colors.orange.shade400, Colors.orange.shade700],
      'Diego': [Colors.green.shade400, Colors.green.shade700],
    };

    return colorMap[name] ??
        [Colors.grey.shade400, Colors.grey.shade700];
  }

  IconData _getEmotionIcon(CharacterEmotion emotion) {
    return switch (emotion) {
      CharacterEmotion.neutral => Icons.sentiment_neutral,
      CharacterEmotion.happy => Icons.sentiment_very_satisfied,
      CharacterEmotion.sad => Icons.sentiment_dissatisfied,
      CharacterEmotion.surprised => Icons.sentiment_neutral,
      CharacterEmotion.angry => Icons.sentiment_very_dissatisfied,
      CharacterEmotion.thinking => Icons.psychology,
    };
  }

  Color _getEmotionColor(CharacterEmotion emotion) {
    return switch (emotion) {
      CharacterEmotion.neutral => Colors.grey,
      CharacterEmotion.happy => Colors.green,
      CharacterEmotion.sad => Colors.blue,
      CharacterEmotion.surprised => Colors.orange,
      CharacterEmotion.angry => Colors.red,
      CharacterEmotion.thinking => Colors.purple,
    };
  }
}
