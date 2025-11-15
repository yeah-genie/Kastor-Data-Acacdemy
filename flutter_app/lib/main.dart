import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'providers/game_state_provider.dart';
import 'providers/settings_provider.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/episode/episode_selection_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/tutorial/tutorial_screen.dart';
import 'screens/demo/episode1_demo_screen.dart';
import 'screens/inventory/inventory_screen.dart';
import 'theme/academy_theme.dart';

void main() {
  runApp(
    const ProviderScope(
      child: KastorDataAcademyApp(),
    ),
  );
}

class KastorDataAcademyApp extends ConsumerWidget {
  const KastorDataAcademyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'Kastor Data Academy',
      theme: AcademyTheme.theme,
      home: const HomePage(),
    );
  }
}

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  bool _isLoading = true;
  bool _isNavigating = false;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Load saved game state and settings on app start
    await Future.wait([
      ref.read(gameStateProvider.notifier).loadGameState(),
      ref.read(settingsProvider.notifier).loadSettings(),
    ]);

    setState(() {
      _isLoading = false;
    });

    // Check if tutorial has been completed
    final prefs = await SharedPreferences.getInstance();
    final tutorialCompleted = prefs.getBool('tutorial_completed') ?? false;

    if (!tutorialCompleted && mounted) {
      // Show tutorial on first launch
      await Future.delayed(const Duration(milliseconds: 500));
      if (mounted) {
        _navigateWithDebounce(() {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => const TutorialScreen(),
            ),
          );
        });
      }
    }
  }

  void _navigateWithDebounce(VoidCallback callback) {
    if (_isNavigating) return;
    setState(() {
      _isNavigating = true;
    });
    callback();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _isNavigating = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final gameState = ref.watch(gameStateProvider);
    final settings = ref.watch(settingsProvider);

    if (_isLoading) {
      return Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: AcademyColors.academicGradient,
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo with hologram glow
                Container(
                  width: 150,
                  height: 150,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: NeonGlow.hologram(),
                  ),
                  child: const Text(
                    '🎓',
                    style: TextStyle(fontSize: 100),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 40),
                const CircularProgressIndicator(
                  color: AcademyColors.neonCyan,
                  strokeWidth: 3,
                ),
                const SizedBox(height: 24),
                const Text(
                  'KASTOR DATA ACADEMY',
                  style: TextStyle(
                    fontFamily: 'Playfair Display',
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: AcademyColors.creamPaper,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Est. 2025',
                  style: TextStyle(
                    fontFamily: 'Cinzel',
                    fontSize: 14,
                    color: AcademyColors.slate.withOpacity(0.7),
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AcademyColors.academicGradient,
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 40),
                  
                  // 🎓 Logo with Hologram Glow
                  TweenAnimationBuilder<double>(
                    tween: Tween(begin: 0.8, end: 1.0),
                    duration: const Duration(seconds: 2),
                    curve: Curves.easeInOut,
                    builder: (context, value, child) {
                      return Transform.scale(
                        scale: value,
                        child: Container(
                          width: 150,
                          height: 150,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            boxShadow: NeonGlow.hologram(),
                          ),
                          child: const Text(
                            '🎓',
                            style: TextStyle(fontSize: 100),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      );
                    },
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Academy Title (Serif)
                  const Text(
                    'KASTOR DATA',
                    style: TextStyle(
                      fontFamily: 'Playfair Display',
                      fontSize: 42,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 6,
                      color: AcademyColors.creamPaper,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'ACADEMY',
                    style: TextStyle(
                      fontFamily: 'Cinzel',
                      fontSize: 32,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 8,
                      color: AcademyColors.creamPaper,
                    ),
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Established year (Vintage detail)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: AcademyColors.slate.withOpacity(0.5),
                      ),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Est. 2025',
                      style: TextStyle(
                        fontFamily: 'Cinzel',
                        fontSize: 12,
                        letterSpacing: 2,
                        color: AcademyColors.slate.withOpacity(0.8),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Motto (Academic Latin style)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Text(
                      settings.language == 'ko'
                          ? '데이터로 진실을 밝히다'
                          : 'Veritas per Data',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Cinzel',
                        fontSize: 14,
                        fontStyle: FontStyle.italic,
                        color: AcademyColors.neonCyan.withOpacity(0.8),
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Language toggle (Cyber UI)
                  TextButton.icon(
                    onPressed: () {
                      final newLang = settings.language == 'ko' ? 'en' : 'ko';
                      ref.read(settingsProvider.notifier).setLanguage(newLang);
                    },
                    icon: Icon(
                      Icons.language,
                      size: 18,
                      color: AcademyColors.neonCyan.withOpacity(0.7),
                    ),
                    label: Text(
                      settings.language == 'ko' ? 'English 🇺🇸' : '한국어 🇰🇷',
                      style: TextStyle(
                        fontFamily: 'Space Grotesk',
                        color: AcademyColors.neonCyan.withOpacity(0.7),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 40),

                  // Menu Options
                  _MenuButton(
                    text: settings.language == 'ko' ? '🎮 시작하기' : '🎮 Start Game',
                    icon: Icons.play_arrow,
                    isLoading: _isNavigating,
                    onPressed: () {
                      _navigateWithDebounce(() {
                        ref.read(gameStateProvider.notifier).resetGame();
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => const Episode1DemoScreen(),
                          ),
                        );
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  _MenuButton(
                    text: settings.language == 'ko' ? '📖 이어하기' : '📖 Continue',
                  icon: Icons.trending_up,
                  isLoading: _isNavigating,
                  tooltip: gameState.currentEpisode == null
                      ? (settings.language == 'ko'
                          ? '저장된 진행 상황이 없습니다'
                          : 'No saved progress')
                      : null,
                  onPressed: gameState.currentEpisode != null && !_isNavigating
                      ? () {
                          _navigateWithDebounce(() {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => const DashboardScreen(),
                              ),
                            );
                          });
                        }
                      : null,
                ),
                  const SizedBox(height: 16),
                  _MenuButton(
                    text: settings.language == 'ko' ? '📚 에피소드 목록' : '📚 Episodes',
                  icon: Icons.list,
                  isLoading: _isNavigating,
                  onPressed: () {
                    _navigateWithDebounce(() {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const EpisodeSelectionScreen(),
                        ),
                      );
                    });
                  },
                ),
                  const SizedBox(height: 16),
                  _MenuButton(
                    text: settings.language == 'ko' ? '📦 증거 보관함' : '📦 Evidence Vault',
                  icon: Icons.inventory_2,
                  isLoading: _isNavigating,
                  onPressed: () {
                    _navigateWithDebounce(() {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const InventoryScreen(),
                        ),
                      );
                    });
                  },
                ),
                  const SizedBox(height: 16),
                  _MenuButton(
                    text: settings.language == 'ko' ? '⚙️ 설정' : '⚙️ Settings',
                  icon: Icons.settings,
                  isLoading: _isNavigating,
                  onPressed: () {
                    _navigateWithDebounce(() {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const SettingsScreen(),
                        ),
                      );
                    });
                  },
                  ),

                  // Progress indicator
                  if (gameState.gameProgress > 0) ...[
                  const SizedBox(height: 60),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 60),
                    child: Column(
                      children: [
                        Text(
                          '진행률: ${(gameState.gameProgress * 100).toStringAsFixed(0)}%',
                          style: const TextStyle(color: Colors.white70),
                        ),
                        const SizedBox(height: 8),
                        LinearProgressIndicator(
                          value: gameState.gameProgress,
                          backgroundColor: Colors.white24,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF6366F1),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class _MenuButton extends StatefulWidget {
  final String text;
  final IconData icon;
  final VoidCallback? onPressed;
  final bool isLoading;
  final String? tooltip;

  const _MenuButton({
    required this.text,
    required this.icon,
    this.onPressed,
    this.isLoading = false,
    this.tooltip,
  });

  @override
  State<_MenuButton> createState() => _MenuButtonState();
}

class _MenuButtonState extends State<_MenuButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final button = SizedBox(
      width: 320,
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovered = true),
        onExit: (_) => setState(() => _isHovered = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          decoration: BoxDecoration(
            gradient: widget.onPressed != null && !widget.isLoading && _isHovered
                ? AcademyColors.neonButtonGradient
                : null,
            color: widget.onPressed != null && !widget.isLoading && !_isHovered
                ? Colors.white.withOpacity(0.05)
                : (widget.onPressed == null ? AcademyColors.slate.withOpacity(0.1) : null),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: widget.onPressed != null && !widget.isLoading
                  ? (_isHovered ? AcademyColors.neonCyan : AcademyColors.slate.withOpacity(0.5))
                  : AcademyColors.slate.withOpacity(0.2),
              width: _isHovered ? 2 : 1,
            ),
            boxShadow: _isHovered && widget.onPressed != null
                ? NeonGlow.cyan(intensity: 0.5, blur: 15)
                : null,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: widget.isLoading ? null : widget.onPressed,
              borderRadius: BorderRadius.circular(8),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 24),
                child: widget.isLoading
                    ? const Center(
                        child: SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation(AcademyColors.neonCyan),
                          ),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            widget.icon,
                            size: 20,
                            color: widget.onPressed != null
                                ? (_isHovered ? AcademyColors.creamPaper : AcademyColors.neonCyan)
                                : AcademyColors.slate,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            widget.text,
                            style: TextStyle(
                              fontFamily: 'Space Grotesk',
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                              color: widget.onPressed != null
                                  ? (_isHovered ? AcademyColors.creamPaper : AcademyColors.neonCyan)
                                  : AcademyColors.slate,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ),
        ),
      ),
    );

    if (widget.tooltip != null) {
      return Tooltip(
        message: widget.tooltip!,
        decoration: BoxDecoration(
          color: AcademyColors.midnight,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AcademyColors.neonCyan.withOpacity(0.3)),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Inter',
          color: AcademyColors.creamPaper,
        ),
        child: button,
      );
    }

    return button;
  }
}
