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

/// Gets a contextual emoji reaction based on message content
String? getContextualReaction(String speaker, String text, {double probability = 0.20}) {
  // Detective messages don't get reactions
  if (speaker == 'detective') {
    return null;
  }

  // Narrator and system messages don't get reactions
  if (speaker == 'narrator' || speaker == 'system') {
    return null;
  }

  // Random chance to show reaction (20% probability)
  final random = DateTime.now().millisecondsSinceEpoch % 100;
  if (random >= probability * 100) {
    return null;
  }

  // Context-aware reactions based on message content
  final lowercaseText = text.toLowerCase();

  // Excitement, celebration
  if (lowercaseText.contains('!') && (lowercaseText.contains('great') ||
      lowercaseText.contains('awesome') || lowercaseText.contains('perfect'))) {
    return ['🎉', '🙌', '✨', '💯'][random % 4];
  }

  // Questions, confusion
  if (lowercaseText.contains('?') || lowercaseText.contains('what') ||
      lowercaseText.contains('how') || lowercaseText.contains('why')) {
    return ['🤔', '❓', '🧐'][random % 3];
  }

  // Agreement, understanding
  if (lowercaseText.contains('yeah') || lowercaseText.contains('yes') ||
      lowercaseText.contains('right') || lowercaseText.contains('exactly')) {
    return ['👍', '💯', '✅'][random % 3];
  }

  // Surprise, shock
  if (lowercaseText.contains('wow') || lowercaseText.contains('oh!') ||
      lowercaseText.contains('ooh')) {
    return ['😮', '😲', '🤯'][random % 3];
  }

  // Happy, laughing (already converted to emoji)
  if (lowercaseText.contains('😄') || lowercaseText.contains('😁') ||
      lowercaseText.contains('😊')) {
    return ['😄', '😁', '👏'][random % 3];
  }

  // Thinking, analyzing
  if (lowercaseText.contains('think') || lowercaseText.contains('maybe') ||
      lowercaseText.contains('could')) {
    return ['🤔', '💭', '💡'][random % 3];
  }

  // Important, urgent
  if (lowercaseText.contains('important') || lowercaseText.contains('urgent') ||
      lowercaseText.contains('quickly')) {
    return ['❗', '⚠️', '🚨'][random % 3];
  }

  // Fire, hot topic
  if (lowercaseText.contains('data') || lowercaseText.contains('evidence') ||
      lowercaseText.contains('clue')) {
    return ['🔥', '💡', '🎯'][random % 3];
  }

  // Default: occasional neutral reactions
  final neutralReactions = ['👍', '😊', '✨', '💬'];
  return random % 2 == 0 ? neutralReactions[random % 4] : null;
}

/// Calculate delay based on text speed setting
/// textSpeed: 0.5 = slow, 0.7 = slower (default), 1.0 = normal, 1.5 = fast, 2.0 = very fast
Duration calculateTextDelay(double textSpeed, {int baseDelayMs = 1500}) {
  // Invert the speed (slower speed = longer delay)
  final delayMs = (baseDelayMs / textSpeed).round();
  return Duration(milliseconds: delayMs);
}
