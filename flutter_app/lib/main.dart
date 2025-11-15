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
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1), // Indigo
          brightness: Brightness.dark,
        ),
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme,
        ),
        useMaterial3: true,
      ),
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
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF1E1B4B),
                Color(0xFF312E81),
                Color(0xFF4C1D95),
              ],
            ),
          ),
          child: const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(
                  color: Colors.white,
                ),
                SizedBox(height: 24),
                Text(
                  'Loading...',
                  style: TextStyle(color: Colors.white70, fontSize: 16),
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
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF1E1B4B), // Dark indigo
              Color(0xFF312E81), // Indigo
              Color(0xFF4C1D95), // Purple
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo/Title
                Text(
                  'KASTOR',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        letterSpacing: 8,
                        color: Colors.white,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Data Academy',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        letterSpacing: 4,
                        color: Colors.white70,
                      ),
                ),
                const SizedBox(height: 16),
                // Welcome message for first-time users
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: Text(
                    settings.language == 'ko'
                        ? '🎮 데이터 과학을 스토리로 배우세요!'
                        : '🎮 Learn Data Science Through Stories!',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 16,
                      color: Color(0xFFFBBF24),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                // Language toggle
                TextButton.icon(
                  onPressed: () {
                    final newLang = settings.language == 'ko' ? 'en' : 'ko';
                    ref.read(settingsProvider.notifier).setLanguage(newLang);
                  },
                  icon: const Icon(Icons.language, size: 18, color: Colors.white70),
                  label: Text(
                    settings.language == 'ko' ? 'English 🇺🇸' : '한국어 🇰🇷',
                    style: const TextStyle(color: Colors.white70),
                  ),
                ),
                const SizedBox(height: 32),

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
      width: 280,
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovered = true),
        onExit: (_) => setState(() => _isHovered = false),
        child: ElevatedButton(
          onPressed: widget.isLoading ? null : widget.onPressed,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
            backgroundColor: widget.onPressed != null && !widget.isLoading
                ? (_isHovered
                    ? Colors.white.withOpacity(0.15)
                    : Colors.white.withOpacity(0.1))
                : Colors.white.withOpacity(0.05),
            foregroundColor:
                widget.onPressed != null && !widget.isLoading ? Colors.white : Colors.white38,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: widget.onPressed != null && !widget.isLoading
                    ? (_isHovered
                        ? const Color(0xFF6366F1).withOpacity(0.8)
                        : const Color(0xFF6366F1).withOpacity(0.5))
                    : Colors.white12,
                width: _isHovered ? 2 : 1,
              ),
            ),
          ),
          child: widget.isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white70,
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(widget.icon, size: 20),
                    const SizedBox(width: 12),
                    Text(
                      widget.text,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );

    if (widget.tooltip != null) {
      return Tooltip(
        message: widget.tooltip!,
        child: button,
      );
    }

    return button;
  }
}
