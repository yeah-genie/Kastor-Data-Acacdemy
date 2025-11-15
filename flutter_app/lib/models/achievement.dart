class Achievement {
  final String id;
  final String title;
  final String titleKo;
  final String description;
  final String descriptionKo;
  final String icon; // 이모지로 변경
  final int points;
  final bool isUnlocked;
  final DateTime? unlockedAt;

  Achievement({
    required this.id,
    required this.title,
    required this.titleKo,
    required this.description,
    required this.descriptionKo,
    required this.icon,
    required this.points,
    this.isUnlocked = false,
    this.unlockedAt,
  });

  Achievement copyWith({
    String? id,
    String? title,
    String? titleKo,
    String? description,
    String? descriptionKo,
    String? icon,
    int? points,
    bool? isUnlocked,
    DateTime? unlockedAt,
  }) {
    return Achievement(
      id: id ?? this.id,
      title: title ?? this.title,
      titleKo: titleKo ?? this.titleKo,
      description: description ?? this.description,
      descriptionKo: descriptionKo ?? this.descriptionKo,
      icon: icon ?? this.icon,
      points: points ?? this.points,
      isUnlocked: isUnlocked ?? this.isUnlocked,
      unlockedAt: unlockedAt ?? this.unlockedAt,
    );
  }

  factory Achievement.fromJson(Map<String, dynamic> json) {
    return Achievement(
      id: json['id'] as String,
      title: json['title'] as String,
      titleKo: json['titleKo'] as String,
      description: json['description'] as String,
      descriptionKo: json['descriptionKo'] as String,
      icon: json['icon'] as String,
      points: json['points'] as int,
      isUnlocked: json['isUnlocked'] as bool? ?? false,
      unlockedAt: json['unlockedAt'] != null
          ? DateTime.parse(json['unlockedAt'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'titleKo': titleKo,
      'description': description,
      'descriptionKo': descriptionKo,
      'icon': icon,
      'points': points,
      'isUnlocked': isUnlocked,
      'unlockedAt': unlockedAt?.toIso8601String(),
    };
  }
}
