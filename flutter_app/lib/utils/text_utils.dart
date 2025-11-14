/// Converts text expressions to emojis
String convertTextToEmoji(String text) {
  final Map<RegExp, String> replacements = {
    RegExp(r'\(laughs?\)', caseSensitive: false): '😄',
    RegExp(r'\(grins?\)', caseSensitive: false): '😁',
    RegExp(r'\(sighs?\)', caseSensitive: false): '😮‍💨',
    RegExp(r'\(smiles?\)', caseSensitive: false): '😊',
    RegExp(r'\(snoring?\)', caseSensitive: false): '😴',
    RegExp(r'\(stretches?\)', caseSensitive: false): '🙆',
    RegExp(r'\(winks?\)', caseSensitive: false): '😉',
    RegExp(r'\(surprised?\)', caseSensitive: false): '😲',
    RegExp(r'\(confused?\)', caseSensitive: false): '😕',
    RegExp(r'\(worried?\)', caseSensitive: false): '😟',
    RegExp(r'\(thinking?\)', caseSensitive: false): '🤔',
    RegExp(r'\(nervous?\)', caseSensitive: false): '😅',
    RegExp(r'\(angry?\)', caseSensitive: false): '😠',
    RegExp(r'\(excited?\)', caseSensitive: false): '🤩',
    RegExp(r'\(shocked?\)', caseSensitive: false): '😱',
    RegExp(r'\(sad?\)', caseSensitive: false): '😢',
    RegExp(r'\(happy?\)', caseSensitive: false): '😄',
    RegExp(r'\(crying?\|cries?\)', caseSensitive: false): '😭',
    RegExp(r'\(yawns?\)', caseSensitive: false): '🥱',
    RegExp(r'\(sleepy?\)', caseSensitive: false): '😴',
    RegExp(r'\(nods?\)', caseSensitive: false): '👍',
    RegExp(r'\(shrugs?\)', caseSensitive: false): '🤷',
    RegExp(r'\(waves?\)', caseSensitive: false): '👋',
    RegExp(r'\(claps?\)', caseSensitive: false): '👏',
    RegExp(r'\(thumbs up\)', caseSensitive: false): '👍',
  };

  String result = text;
  replacements.forEach((pattern, emoji) {
    result = result.replaceAll(pattern, emoji);
  });

  return result;
}

/// Gets a random emoji reaction for characters
String? getRandomReaction(String speaker, {double probability = 0.15}) {
  // Random chance to show reaction
  if (DateTime.now().millisecondsSinceEpoch % 100 < probability * 100) {
    final reactions = [
      '👍', '😄', '😊', '🤔', '😮', '👏', '💯', '🎯',
      '✨', '🔥', '💡', '❓', '❗', '😅', '🙌'
    ];

    // Return random reaction
    final index = DateTime.now().millisecondsSinceEpoch % reactions.length;
    return reactions[index];
  }

  return null;
}

/// Calculate delay based on text speed setting
/// textSpeed: 0.5 = slow, 0.7 = slower (default), 1.0 = normal, 1.5 = fast, 2.0 = very fast
Duration calculateTextDelay(double textSpeed, {int baseDelayMs = 1500}) {
  // Invert the speed (slower speed = longer delay)
  final delayMs = (baseDelayMs / textSpeed).round();
  return Duration(milliseconds: delayMs);
}
