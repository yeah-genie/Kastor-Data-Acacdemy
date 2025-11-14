import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppSettings {
  final bool soundEnabled;
  final double textSpeed; // 0.5 = slow, 1.0 = normal, 1.5 = fast, 2.0 = very fast
  final String language; // 'en' or 'ko'
  final bool vibrationEnabled;
  final bool autoTextMode; // true = auto, false = manual (click to continue)

  AppSettings({
    this.soundEnabled = true,
    this.textSpeed = 0.7, // Slower default speed
    this.language = 'en',
    this.vibrationEnabled = true,
    this.autoTextMode = true,
  });

  AppSettings copyWith({
    bool? soundEnabled,
    double? textSpeed,
    String? language,
    bool? vibrationEnabled,
    bool? autoTextMode,
  }) {
    return AppSettings(
      soundEnabled: soundEnabled ?? this.soundEnabled,
      textSpeed: textSpeed ?? this.textSpeed,
      language: language ?? this.language,
      vibrationEnabled: vibrationEnabled ?? this.vibrationEnabled,
      autoTextMode: autoTextMode ?? this.autoTextMode,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'soundEnabled': soundEnabled,
      'textSpeed': textSpeed,
      'language': language,
      'vibrationEnabled': vibrationEnabled,
      'autoTextMode': autoTextMode,
    };
  }

  factory AppSettings.fromJson(Map<String, dynamic> json) {
    return AppSettings(
      soundEnabled: json['soundEnabled'] as bool? ?? true,
      textSpeed: (json['textSpeed'] as num?)?.toDouble() ?? 0.7,
      language: json['language'] as String? ?? 'en',
      vibrationEnabled: json['vibrationEnabled'] as bool? ?? true,
      autoTextMode: json['autoTextMode'] as bool? ?? true,
    );
  }
}

class SettingsNotifier extends StateNotifier<AppSettings> {
  SettingsNotifier() : super(AppSettings());

  Future<void> loadSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final soundEnabled = prefs.getBool('soundEnabled') ?? true;
      final textSpeed = prefs.getDouble('textSpeed') ?? 0.7;
      final language = prefs.getString('language') ?? 'en';
      final vibrationEnabled = prefs.getBool('vibrationEnabled') ?? true;
      final autoTextMode = prefs.getBool('autoTextMode') ?? true;

      state = AppSettings(
        soundEnabled: soundEnabled,
        textSpeed: textSpeed,
        language: language,
        vibrationEnabled: vibrationEnabled,
        autoTextMode: autoTextMode,
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
      await prefs.setBool('autoTextMode', state.autoTextMode);
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

  void toggleAutoTextMode() {
    state = state.copyWith(autoTextMode: !state.autoTextMode);
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
