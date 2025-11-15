import 'package:flutter/material.dart';
import '../theme/academy_theme.dart';
import 'dart:math' as math;

/// Neo-Academic 스타일 홀로그램 로딩 화면
class HologramLoadingScreen extends StatefulWidget {
  final String? message;

  const HologramLoadingScreen({
    super.key,
    this.message,
  });

  @override
  State<HologramLoadingScreen> createState() => _HologramLoadingScreenState();
}

class _HologramLoadingScreenState extends State<HologramLoadingScreen>
    with TickerProviderStateMixin {
  late AnimationController _rotationController;
  late AnimationController _pulseController;
  late AnimationController _scanController;

  @override
  void initState() {
    super.initState();

    // 회전 애니메이션 (네온 링)
    _rotationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    // 펄스 애니메이션 (로고 글로우)
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    // 스캔 라인 애니메이션
    _scanController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _rotationController.dispose();
    _pulseController.dispose();
    _scanController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            AcademyColors.midnight,
            AcademyColors.deepAcademyPurple,
            AcademyColors.midnight,
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 홀로그램 로고 with 회전 네온 링
            SizedBox(
              width: 200,
              height: 200,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // 회전하는 네온 링 (외부)
                  AnimatedBuilder(
                    animation: _rotationController,
                    builder: (context, child) {
                      return Transform.rotate(
                        angle: _rotationController.value * 2 * math.pi,
                        child: Container(
                          width: 180,
                          height: 180,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              width: 3,
                              color: Colors.transparent,
                            ),
                            gradient: SweepGradient(
                              colors: [
                                AcademyColors.neonCyan,
                                AcademyColors.electricViolet,
                                AcademyColors.hologramGreen,
                                AcademyColors.neonCyan,
                              ],
                              stops: const [0.0, 0.33, 0.66, 1.0],
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AcademyColors.neonCyan.withOpacity(0.5),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                  // 회전하는 네온 링 (내부, 반대 방향)
                  AnimatedBuilder(
                    animation: _rotationController,
                    builder: (context, child) {
                      return Transform.rotate(
                        angle: -_rotationController.value * 2 * math.pi * 0.7,
                        child: Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              width: 2,
                              color: Colors.transparent,
                            ),
                            gradient: SweepGradient(
                              colors: [
                                AcademyColors.electricViolet,
                                AcademyColors.hologramGreen,
                                AcademyColors.electricViolet,
                              ],
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AcademyColors.electricViolet
                                    .withOpacity(0.4),
                                blurRadius: 15,
                                spreadRadius: 3,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                  // 중앙 로고 (펄스 효과)
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      final glowIntensity = 0.5 + (_pulseController.value * 0.5);
                      return Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              AcademyColors.neonCyan.withOpacity(0.8),
                              AcademyColors.deepAcademyPurple.withOpacity(0.4),
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AcademyColors.neonCyan
                                  .withOpacity(glowIntensity),
                              blurRadius: 30 * glowIntensity,
                              spreadRadius: 10 * glowIntensity,
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            '🎓',
                            style: TextStyle(fontSize: 50),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // 로딩 텍스트
            Text(
              widget.message ?? 'Loading Episode...',
              style: const TextStyle(
                fontFamily: 'Playfair Display',
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: AcademyColors.neonCyan,
                shadows: [
                  Shadow(
                    color: AcademyColors.neonCyan,
                    blurRadius: 20,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // 사이버 프로그레스 바
            SizedBox(
              width: 300,
              child: Column(
                children: [
                  // 스캔 라인 효과
                  AnimatedBuilder(
                    animation: _scanController,
                    builder: (context, child) {
                      return Stack(
                        children: [
                          // 배경 바
                          Container(
                            height: 4,
                            decoration: BoxDecoration(
                              color: AcademyColors.slate.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          // 진행 바 (전체)
                          Container(
                            height: 4,
                            decoration: BoxDecoration(
                              gradient: AcademyColors.cyberGradient,
                              borderRadius: BorderRadius.circular(2),
                              boxShadow: [
                                BoxShadow(
                                  color: AcademyColors.neonCyan.withOpacity(0.5),
                                  blurRadius: 10,
                                  spreadRadius: 2,
                                ),
                              ],
                            ),
                          ),
                          // 스캔 라인 (움직이는 밝은 부분)
                          Positioned(
                            left: 300 * _scanController.value - 50,
                            child: Container(
                              width: 50,
                              height: 4,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.transparent,
                                    AcademyColors.hologramGreen.withOpacity(0.8),
                                    Colors.transparent,
                                  ],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: AcademyColors.hologramGreen
                                        .withOpacity(0.6),
                                    blurRadius: 20,
                                    spreadRadius: 5,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),

                  const SizedBox(height: 12),

                  // 하단 텍스트
                  Text(
                    'Initializing Data Stream...',
                    style: TextStyle(
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      color: AcademyColors.hologramGreen.withOpacity(0.8),
                      letterSpacing: 2,
                    ),
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

/// 작은 인라인 홀로그램 로딩 인디케이터
class HologramLoadingIndicator extends StatefulWidget {
  final double size;

  const HologramLoadingIndicator({
    super.key,
    this.size = 24,
  });

  @override
  State<HologramLoadingIndicator> createState() =>
      _HologramLoadingIndicatorState();
}

class _HologramLoadingIndicatorState extends State<HologramLoadingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.rotate(
            angle: _controller.value * 2 * math.pi,
            child: Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: SweepGradient(
                  colors: [
                    AcademyColors.neonCyan,
                    AcademyColors.electricViolet,
                    AcademyColors.neonCyan,
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: AcademyColors.neonCyan.withOpacity(0.5),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
