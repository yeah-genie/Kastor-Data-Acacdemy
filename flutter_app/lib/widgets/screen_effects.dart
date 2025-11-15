import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum VibrationPattern {
  light,
  medium,
  heavy,
  selection,
}

class ScreenEffects {
  // Flash effect - 화면 플래시
  static void flash(BuildContext context, {Color color = Colors.white}) {
    final overlay = Overlay.of(context);
    late OverlayEntry entry;

    entry = OverlayEntry(
      builder: (context) => _FlashOverlay(
        color: color,
        onComplete: () => entry.remove(),
      ),
    );

    overlay.insert(entry);
    HapticFeedback.heavyImpact();
  }

  // Fade effect - 페이드 인/아웃
  static void fade(
    BuildContext context, {
    Color? color,
    Duration duration = const Duration(milliseconds: 500),
  }) {
    final overlay = Overlay.of(context);
    late OverlayEntry entry;

    entry = OverlayEntry(
      builder: (context) => _FadeOverlay(
        color: color ?? Colors.black,
        duration: duration,
        onComplete: () => entry.remove(),
      ),
    );

    overlay.insert(entry);
  }

  // Shake effect - 화면 흔들림
  static void shake(BuildContext context) {
    HapticFeedback.heavyImpact();
    // TODO: Implement shake animation if needed
  }

  // Vibrate - 진동
  static void vibrate(VibrationPattern pattern) {
    switch (pattern) {
      case VibrationPattern.light:
        HapticFeedback.lightImpact();
        break;
      case VibrationPattern.medium:
        HapticFeedback.mediumImpact();
        break;
      case VibrationPattern.heavy:
        HapticFeedback.heavyImpact();
        break;
      case VibrationPattern.selection:
        HapticFeedback.selectionClick();
        break;
    }
  }

  // Screen blur - 화면 블러
  static OverlayEntry blur(BuildContext context, {double sigma = 5.0}) {
    final overlay = Overlay.of(context);
    final entry = OverlayEntry(
      builder: (context) => Container(
        color: Colors.black.withOpacity(0.3),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
          child: Container(
            color: Colors.transparent,
          ),
        ),
      ),
    );

    overlay.insert(entry);
    return entry;
  }
}

// Flash overlay widget
class _FlashOverlay extends StatefulWidget {
  final Color color;
  final VoidCallback onComplete;

  const _FlashOverlay({
    required this.color,
    required this.onComplete,
  });

  @override
  State<_FlashOverlay> createState() => _FlashOverlayState();
}

class _FlashOverlayState extends State<_FlashOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    );

    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);

    _controller.forward().then((_) {
      _controller.reverse().then((_) {
        widget.onComplete();
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _animation,
      child: Container(
        color: widget.color.withOpacity(0.7),
      ),
    );
  }
}

// Fade overlay widget
class _FadeOverlay extends StatefulWidget {
  final Color color;
  final Duration duration;
  final VoidCallback onComplete;

  const _FadeOverlay({
    required this.color,
    required this.duration,
    required this.onComplete,
  });

  @override
  State<_FadeOverlay> createState() => _FadeOverlayState();
}

class _FadeOverlayState extends State<_FadeOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );

    _animation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _controller.forward().then((_) {
      widget.onComplete();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _animation,
      child: Container(
        color: widget.color,
      ),
    );
  }
}

// Import for blur effect
import 'dart:ui';
