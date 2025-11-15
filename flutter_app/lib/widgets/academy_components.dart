import 'package:flutter/material.dart';
import 'dart:ui';
import '../theme/academy_theme.dart';

/// 🎓 Neo-Academic Button - Glassmorphism + Neon Border
class AcademyButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isLoading;
  final AcademyButtonStyle style;

  const AcademyButton({
    super.key,
    required this.text,
    this.onPressed,
    this.icon,
    this.isLoading = false,
    this.style = AcademyButtonStyle.primary,
  });

  @override
  State<AcademyButton> createState() => _AcademyButtonState();
}

class _AcademyButtonState extends State<AcademyButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        decoration: BoxDecoration(
          gradient: widget.style == AcademyButtonStyle.primary
              ? AcademyColors.neonButtonGradient
              : null,
          color: widget.style == AcademyButtonStyle.ghost
              ? Colors.white.withOpacity(0.05)
              : null,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: widget.style == AcademyButtonStyle.primary
                ? AcademyColors.neonCyan
                : AcademyColors.slate.withOpacity(0.5),
            width: _isHovered ? 2 : 1,
          ),
          boxShadow: _isHovered
              ? (widget.style == AcademyButtonStyle.primary
                  ? NeonGlow.cyan(intensity: 0.6, blur: 20)
                  : [])
              : (widget.style == AcademyButtonStyle.primary
                  ? NeonGlow.cyan()
                  : []),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: widget.isLoading ? null : widget.onPressed,
            borderRadius: BorderRadius.circular(8),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: widget.isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation(
                          AcademyColors.creamPaper,
                        ),
                      ),
                    )
                  : Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (widget.icon != null) ...[
                          Icon(
                            widget.icon,
                            size: 20,
                            color: widget.style == AcademyButtonStyle.primary
                                ? AcademyColors.creamPaper
                                : AcademyColors.neonCyan,
                          ),
                          const SizedBox(width: 8),
                        ],
                        Text(
                          widget.text,
                          style: TextStyle(
                            fontFamily: 'Space Grotesk',
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: widget.style == AcademyButtonStyle.primary
                                ? AcademyColors.creamPaper
                                : AcademyColors.neonCyan,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ),
    );
  }
}

enum AcademyButtonStyle {
  primary,  // Neon gradient
  ghost,    // Glassmorphism
}

/// 📄 Mission Card - Vintage → Hologram transition
class MissionCard extends StatefulWidget {
  final String title;
  final String subtitle;
  final String? description;
  final IconData? icon;
  final String? emoji;
  final VoidCallback? onTap;
  final bool isLocked;
  final bool isCompleted;

  const MissionCard({
    super.key,
    required this.title,
    required this.subtitle,
    this.description,
    this.icon,
    this.emoji,
    this.onTap,
    this.isLocked = false,
    this.isCompleted = false,
  });

  @override
  State<MissionCard> createState() => _MissionCardState();
}

class _MissionCardState extends State<MissionCard>
    with SingleTickerProviderStateMixin {
  bool _isHovered = false;
  late AnimationController _scanController;

  @override
  void initState() {
    super.initState();
    _scanController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _scanController.dispose();
    super.dispose();
  }

  void _onHover(bool hover) {
    setState(() => _isHovered = hover);
    if (hover && !widget.isLocked) {
      _scanController.forward();
    } else {
      _scanController.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => _onHover(true),
      onExit: (_) => _onHover(false),
      child: GestureDetector(
        onTap: widget.isLocked ? null : widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            // Inactive: 크림색 종이 / Active: 투명 glassmorphism
            color: _isHovered && !widget.isLocked
                ? AcademyColors.royalPurple.withOpacity(0.1)
                : AcademyColors.creamPaper,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: _isHovered && !widget.isLocked
                  ? AcademyColors.neonCyan
                  : AcademyColors.deepAcademyPurple,
              width: _isHovered ? 2 : 2,
            ),
            boxShadow: _isHovered && !widget.isLocked
                ? NeonGlow.hologram()
                : [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
          ),
          child: Stack(
            children: [
              // Hologram scan line effect
              if (_isHovered && !widget.isLocked)
                AnimatedBuilder(
                  animation: _scanController,
                  builder: (context, child) {
                    return Positioned(
                      left: 0,
                      right: 0,
                      top: _scanController.value * 200,
                      child: Container(
                        height: 2,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.transparent,
                              AcademyColors.neonCyan.withOpacity(0.8),
                              Colors.transparent,
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AcademyColors.neonCyan.withOpacity(0.5),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),

              // Content
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Icon/Emoji
                  Row(
                    children: [
                      if (widget.emoji != null)
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: _isHovered && !widget.isLocked
                                ? AcademyColors.neonCyan.withOpacity(0.2)
                                : AcademyColors.deepAcademyPurple.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: Text(
                              widget.emoji!,
                              style: const TextStyle(fontSize: 28),
                            ),
                          ),
                        )
                      else if (widget.icon != null)
                        Icon(
                          widget.icon,
                          size: 32,
                          color: _isHovered && !widget.isLocked
                              ? AcademyColors.neonCyan
                              : AcademyColors.deepAcademyPurple,
                        ),
                      const Spacer(),
                      if (widget.isLocked)
                        Icon(
                          Icons.lock,
                          color: AcademyColors.slate,
                          size: 20,
                        )
                      else if (widget.isCompleted)
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AcademyColors.hologramGreen.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.check,
                            color: AcademyColors.hologramGreen,
                            size: 16,
                          ),
                        ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Title (Academic serif)
                  Text(
                    widget.title,
                    style: TextStyle(
                      fontFamily: 'Playfair Display',
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: _isHovered && !widget.isLocked
                          ? AcademyColors.creamPaper
                          : AcademyColors.deepAcademyPurple,
                    ),
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Subtitle (Cyber sans-serif)
                  Text(
                    widget.subtitle,
                    style: TextStyle(
                      fontFamily: 'Space Grotesk',
                      fontSize: 14,
                      color: _isHovered && !widget.isLocked
                          ? AcademyColors.neonCyan
                          : AcademyColors.slate,
                    ),
                  ),
                  
                  if (widget.description != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      widget.description!,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        color: _isHovered && !widget.isLocked
                            ? AcademyColors.ghostWhite.withOpacity(0.8)
                            : AcademyColors.slate.withOpacity(0.7),
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// 🎓 Academy Card with Glassmorphism
class AcademyCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final bool hasGlow;

  const AcademyCard({
    super.key,
    required this.child,
    this.padding,
    this.hasGlow = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
        boxShadow: hasGlow ? NeonGlow.cyan(intensity: 0.2) : null,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: child,
        ),
      ),
    );
  }
}
