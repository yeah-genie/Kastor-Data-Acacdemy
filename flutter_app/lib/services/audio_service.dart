import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';

class AudioService {
  static final AudioService _instance = AudioService._internal();
  factory AudioService() => _instance;
  AudioService._internal();

  final AudioPlayer _bgmPlayer = AudioPlayer();
  final AudioPlayer _sfxPlayer = AudioPlayer();

  bool _isBgmEnabled = true;
  bool _isSfxEnabled = true;
  double _bgmVolume = 0.7;
  double _sfxVolume = 1.0;

  Future<void> initialize() async {
    await _bgmPlayer.setReleaseMode(ReleaseMode.loop);
  }

  // BGM 관리
  Future<void> playBGM(String audioFile) async {
    if (!_isBgmEnabled) return;

    try {
      await _bgmPlayer.stop();
      await _bgmPlayer.play(AssetSource('sounds/$audioFile'));
      await _bgmPlayer.setVolume(_bgmVolume);
    } catch (e) {
      debugPrint('BGM 재생 실패: $e');
    }
  }

  Future<void> stopBGM() async {
    await _bgmPlayer.stop();
  }

  Future<void> pauseBGM() async {
    await _bgmPlayer.pause();
  }

  Future<void> resumeBGM() async {
    if (_isBgmEnabled) {
      await _bgmPlayer.resume();
    }
  }

  // 효과음 재생
  Future<void> playSFX(SoundEffect effect) async {
    if (!_isSfxEnabled) return;

    try {
      await _sfxPlayer.play(
        AssetSource('sounds/${effect.fileName}'),
        volume: _sfxVolume,
      );
    } catch (e) {
      debugPrint('효과음 재생 실패: $e');
    }
  }

  // 설정
  void setBgmEnabled(bool enabled) {
    _isBgmEnabled = enabled;
    if (!enabled) {
      stopBGM();
    }
  }

  void setSfxEnabled(bool enabled) {
    _isSfxEnabled = enabled;
  }

  void setBgmVolume(double volume) {
    _bgmVolume = volume.clamp(0.0, 1.0);
    _bgmPlayer.setVolume(_bgmVolume);
  }

  void setSfxVolume(double volume) {
    _sfxVolume = volume.clamp(0.0, 1.0);
  }

  bool get isBgmEnabled => _isBgmEnabled;
  bool get isSfxEnabled => _isSfxEnabled;
  double get bgmVolume => _bgmVolume;
  double get sfxVolume => _sfxVolume;

  void dispose() {
    _bgmPlayer.dispose();
    _sfxPlayer.dispose();
  }
}

enum SoundEffect {
  buttonClick('button_click.mp3'),
  evidenceFound('evidence_found.mp3'),
  caseComplete('case_complete.mp3'),
  correct('correct.mp3'),
  wrong('wrong.mp3'),
  notification('notification.mp3'),
  achievementUnlocked('achievement.mp3');

  final String fileName;
  const SoundEffect(this.fileName);
}

enum BackgroundMusic {
  mainMenu('bgm_main_menu.mp3'),
  investigation('bgm_investigation.mp3'),
  suspense('bgm_suspense.mp3'),
  victory('bgm_victory.mp3');

  final String fileName;
  const BackgroundMusic(this.fileName);
}
