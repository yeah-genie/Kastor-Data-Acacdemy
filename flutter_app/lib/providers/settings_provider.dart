import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppSettings {
  final bool soundEnabled;
  final double textSpeed; // 0.5 = slow, 1.0 = normal, 1.5 = fast
  final String language; // 'en' or 'ko'
  final bool vibrationEnabled;

  AppSettings({
    this.soundEnabled = true,
    this.textSpeed = 1.0,
    this.language = 'en',
    this.vibrationEnabled = true,
  });

  AppSettings copyWith({
    bool? soundEnabled,
    double? textSpeed,
    String? language,
    bool? vibrationEnabled,
  }) {
    return AppSettings(
      soundEnabled: soundEnabled ?? this.soundEnabled,
      textSpeed: textSpeed ?? this.textSpeed,
      language: language ?? this.language,
      vibrationEnabled: vibrationEnabled ?? this.vibrationEnabled,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'soundEnabled': soundEnabled,
      'textSpeed': textSpeed,
      'language': language,
      'vibrationEnabled': vibrationEnabled,
    };
  }

  factory AppSettings.fromJson(Map<String, dynamic> json) {
    return AppSettings(
      soundEnabled: json['soundEnabled'] as bool? ?? true,
      textSpeed: (json['textSpeed'] as num?)?.toDouble() ?? 1.0,
      language: json['language'] as String? ?? 'en',
      vibrationEnabled: json['vibrationEnabled'] as bool? ?? true,
    );
  }
}

class SettingsNotifier extends StateNotifier<AppSettings> {
  SettingsNotifier() : super(AppSettings());

  Future<void> loadSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final soundEnabled = prefs.getBool('soundEnabled') ?? true;
      final textSpeed = prefs.getDouble('textSpeed') ?? 1.0;
      final language = prefs.getString('language') ?? 'en';
      final vibrationEnabled = prefs.getBool('vibrationEnabled') ?? true;

      state = AppSettings(
        soundEnabled: soundEnabled,
        textSpeed: textSpeed,
        language: language,
        vibrationEnabled: vibrationEnabled,
      );
    } catch (e) {
      print('Error loading settings: $e');
    }
  }

  Future<void> saveSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('soundEnabled', state.soundEnabled);
      await prefs.setDouble('textSpeed', state.textSpeed);
      await prefs.setString('language', state.language);
      await prefs.setBool('vibrationEnabled', state.vibrationEnabled);
    } catch (e) {
      print('Error saving settings: $e');
    }
  }

  void toggleSound() {
    state = state.copyWith(soundEnabled: !state.soundEnabled);
    saveSettings();
  }

  void setTextSpeed(double speed) {
    state = state.copyWith(textSpeed: speed);
    saveSettings();
  }

  void setLanguage(String lang) {
    state = state.copyWith(language: lang);
    saveSettings();
  }

  void toggleVibration() {
    state = state.copyWith(vibrationEnabled: !state.vibrationEnabled);
    saveSettings();
  }

  void resetToDefaults() {
    state = AppSettings();
    saveSettings();
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, AppSettings>(
  (ref) => SettingsNotifier(),
);
