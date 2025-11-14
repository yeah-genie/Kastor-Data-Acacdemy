import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/settings_provider.dart';
import '../../providers/game_state_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);

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
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(24),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                    const SizedBox(width: 16),
                    Text(
                      'Settings',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ],
                ),
              ),

              // Settings List
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Audio Section
                      _SectionHeader(title: 'Audio'),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.volume_up,
                        title: 'Sound Effects',
                        subtitle:
                            settings.soundEnabled ? 'Enabled' : 'Disabled',
                        trailing: Switch(
                          value: settings.soundEnabled,
                          onChanged: (_) {
                            ref.read(settingsProvider.notifier).toggleSound();
                          },
                          activeColor: const Color(0xFF6366F1),
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Gameplay Section
                      _SectionHeader(title: 'Gameplay'),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.speed,
                        title: 'Text Speed',
                        subtitle: _getTextSpeedLabel(settings.textSpeed),
                        trailing: const SizedBox.shrink(),
                        child: Column(
                          children: [
                            const SizedBox(height: 16),
                            Slider(
                              value: settings.textSpeed,
                              min: 0.5,
                              max: 2.0,
                              divisions: 3,
                              activeColor: const Color(0xFF6366F1),
                              inactiveColor: Colors.white.withOpacity(0.2),
                              label: _getTextSpeedLabel(settings.textSpeed),
                              onChanged: (value) {
                                ref
                                    .read(settingsProvider.notifier)
                                    .setTextSpeed(value);
                              },
                            ),
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 16),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Slow',
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.6),
                                      fontSize: 12,
                                    ),
                                  ),
                                  Text(
                                    'Normal',
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.6),
                                      fontSize: 12,
                                    ),
                                  ),
                                  Text(
                                    'Fast',
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.6),
                                      fontSize: 12,
                                    ),
                                  ),
                                  Text(
                                    'Very Fast',
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.6),
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.vibration,
                        title: 'Vibration',
                        subtitle: settings.vibrationEnabled
                            ? 'Enabled'
                            : 'Disabled',
                        trailing: Switch(
                          value: settings.vibrationEnabled,
                          onChanged: (_) {
                            ref
                                .read(settingsProvider.notifier)
                                .toggleVibration();
                          },
                          activeColor: const Color(0xFF6366F1),
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Language Section
                      _SectionHeader(title: 'Language'),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.language,
                        title: 'Language',
                        subtitle: settings.language == 'en'
                            ? 'English'
                            : '한국어',
                        trailing: const Icon(
                          Icons.chevron_right,
                          color: Colors.white54,
                        ),
                        onTap: () => _showLanguageDialog(context, ref),
                      ),

                      const SizedBox(height: 32),

                      // Data Section
                      _SectionHeader(title: 'Data'),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.refresh,
                        title: 'Reset Settings',
                        subtitle: 'Restore default settings',
                        trailing: const Icon(
                          Icons.chevron_right,
                          color: Colors.white54,
                        ),
                        onTap: () => _showResetSettingsDialog(context, ref),
                      ),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.delete_forever,
                        title: 'Reset Game Progress',
                        subtitle: 'Delete all saved data',
                        iconColor: const Color(0xFFEF4444),
                        trailing: const Icon(
                          Icons.chevron_right,
                          color: Color(0xFFEF4444),
                        ),
                        onTap: () => _showResetGameDialog(context, ref),
                      ),

                      const SizedBox(height: 32),

                      // About Section
                      _SectionHeader(title: 'About'),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.info_outline,
                        title: 'Version',
                        subtitle: '1.0.0',
                        trailing: const SizedBox.shrink(),
                      ),
                      const SizedBox(height: 16),
                      _SettingCard(
                        icon: Icons.code,
                        title: 'Developed by',
                        subtitle: 'Kastor Data Academy Team',
                        trailing: const SizedBox.shrink(),
                      ),

                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getTextSpeedLabel(double speed) {
    if (speed <= 0.5) return 'Slow';
    if (speed <= 1.0) return 'Normal';
    if (speed <= 1.5) return 'Fast';
    return 'Very Fast';
  }

  void _showLanguageDialog(BuildContext context, WidgetRef ref) {
    final currentLanguage = ref.read(settingsProvider).language;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1B4B),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: const Color(0xFF6366F1).withOpacity(0.5),
            width: 2,
          ),
        ),
        title: const Text(
          'Select Language',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: const Text('English', style: TextStyle(color: Colors.white)),
              leading: Radio<String>(
                value: 'en',
                groupValue: currentLanguage,
                onChanged: (value) {
                  if (value != null) {
                    ref.read(settingsProvider.notifier).setLanguage(value);
                    Navigator.pop(context);
                  }
                },
                activeColor: const Color(0xFF6366F1),
              ),
            ),
            ListTile(
              title: const Text('한국어', style: TextStyle(color: Colors.white)),
              leading: Radio<String>(
                value: 'ko',
                groupValue: currentLanguage,
                onChanged: (value) {
                  if (value != null) {
                    ref.read(settingsProvider.notifier).setLanguage(value);
                    Navigator.pop(context);
                  }
                },
                activeColor: const Color(0xFF6366F1),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _showResetSettingsDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1B4B),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: const Color(0xFF6366F1).withOpacity(0.5),
            width: 2,
          ),
        ),
        title: const Text(
          'Reset Settings?',
          style: TextStyle(color: Colors.white),
        ),
        content: const Text(
          'This will restore all settings to their default values.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(settingsProvider.notifier).resetToDefaults();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Settings reset to defaults')),
              );
            },
            child: const Text(
              'Reset',
              style: TextStyle(color: Color(0xFFEF4444)),
            ),
          ),
        ],
      ),
    );
  }

  void _showResetGameDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1B4B),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: const Color(0xFFEF4444).withOpacity(0.5),
            width: 2,
          ),
        ),
        title: const Row(
          children: [
            Icon(Icons.warning, color: Color(0xFFEF4444)),
            SizedBox(width: 12),
            Text(
              'Reset Game?',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
        content: const Text(
          'This will permanently delete all your game progress, including completed episodes and collected evidence. This action cannot be undone!',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(gameStateProvider.notifier).resetGame();
              Navigator.pop(context);
              Navigator.pop(context); // Go back to main menu
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Game progress has been reset'),
                  backgroundColor: Color(0xFFEF4444),
                ),
              );
            },
            child: const Text(
              'Reset',
              style: TextStyle(
                  color: Color(0xFFEF4444), fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(
        color: Colors.white.withOpacity(0.6),
        fontSize: 14,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.2,
      ),
    );
  }
}

class _SettingCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Widget trailing;
  final Widget? child;
  final VoidCallback? onTap;
  final Color? iconColor;

  const _SettingCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.trailing,
    this.child,
    this.onTap,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: (iconColor ?? const Color(0xFF6366F1))
                            .withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        icon,
                        color: iconColor ?? const Color(0xFF6366F1),
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            subtitle,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.6),
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    trailing,
                  ],
                ),
                if (child != null) child!,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
