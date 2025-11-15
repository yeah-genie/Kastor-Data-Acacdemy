import 'package:flutter/material.dart';

/// 🎓 KASTOR DATA ACADEMY - Neo-Academic Design System
/// "Digital Ivy League 2045" - 고풍스러운 아카데미 × 사이버펑크 데이터 세계

class AcademyColors {
  // Primary (Academic Heritage)
  static const deepAcademyPurple = Color(0xFF2D1B4E);  // 배경 기본
  static const royalPurple = Color(0xFF4C2AFF);        // 주요 액션
  static const creamPaper = Color(0xFFF5F1E8);         // 텍스트 영역
  
  // Secondary (Cyber Future)
  static const neonCyan = Color(0xFF00F6FF);           // 데이터 하이라이트
  static const electricViolet = Color(0xFFB458FF);     // 인터랙티브 요소
  static const hologramGreen = Color(0xFF39FF14);      // 성공/진행 상태
  
  // UI Neutrals
  static const midnight = Color(0xFF1A1625);           // 다크 배경
  static const slate = Color(0xFF8B8B9F);              // 비활성
  static const ghostWhite = Color(0xFFF7F5FF);         // 카드 배경
  
  // Gradients
  static const academicGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [deepAcademyPurple, midnight],
  );
  
  static const neonButtonGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [royalPurple, electricViolet],
  );
  
  static const hologramGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      neonCyan,
      Color(0xFF00F6FF),
      electricViolet,
    ],
  );
}

class AcademyTheme {
  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      
      // Base colors
      colorScheme: ColorScheme.dark(
        primary: AcademyColors.royalPurple,
        secondary: AcademyColors.neonCyan,
        tertiary: AcademyColors.electricViolet,
        surface: AcademyColors.deepAcademyPurple,
        background: AcademyColors.midnight,
        onPrimary: AcademyColors.creamPaper,
        onSecondary: AcademyColors.midnight,
        onSurface: AcademyColors.creamPaper,
        onBackground: AcademyColors.ghostWhite,
      ),
      
      scaffoldBackgroundColor: AcademyColors.deepAcademyPurple,
      
      // Typography (Academic Hierarchy)
      textTheme: const TextTheme(
        // Academic - Serif (고전 학술)
        displayLarge: TextStyle(
          fontFamily: 'Playfair Display',
          fontSize: 57,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.25,
          color: AcademyColors.creamPaper,
        ),
        displayMedium: TextStyle(
          fontFamily: 'Playfair Display',
          fontSize: 45,
          fontWeight: FontWeight.w600,
          color: AcademyColors.creamPaper,
        ),
        displaySmall: TextStyle(
          fontFamily: 'Cinzel',
          fontSize: 36,
          fontWeight: FontWeight.w600,
          color: AcademyColors.creamPaper,
        ),
        
        // Cyber Interface - Sans Serif
        headlineLarge: TextStyle(
          fontFamily: 'Space Grotesk',
          fontSize: 32,
          fontWeight: FontWeight.w600,
          color: AcademyColors.neonCyan,
        ),
        headlineMedium: TextStyle(
          fontFamily: 'Space Grotesk',
          fontSize: 28,
          fontWeight: FontWeight.w500,
          color: AcademyColors.neonCyan,
        ),
        headlineSmall: TextStyle(
          fontFamily: 'Space Grotesk',
          fontSize: 24,
          fontWeight: FontWeight.w500,
          color: AcademyColors.ghostWhite,
        ),
        
        // Body - Readable
        bodyLarge: TextStyle(
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: AcademyColors.ghostWhite,
        ),
        bodyMedium: TextStyle(
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: AcademyColors.ghostWhite,
        ),
        bodySmall: TextStyle(
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: AcademyColors.slate,
        ),
        
        // Data/Code - Monospace
        labelLarge: TextStyle(
          fontFamily: 'JetBrains Mono',
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AcademyColors.neonCyan,
          letterSpacing: 0.5,
        ),
        labelMedium: TextStyle(
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AcademyColors.neonCyan,
        ),
        labelSmall: TextStyle(
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          fontWeight: FontWeight.w400,
          color: AcademyColors.slate,
        ),
      ),
      
      // Card theme
      cardTheme: CardTheme(
        color: AcademyColors.ghostWhite.withOpacity(0.05),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: AcademyColors.slate.withOpacity(0.2),
            width: 1,
          ),
        ),
      ),
      
      // Elevated button (Neo-Academic style)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          foregroundColor: AcademyColors.creamPaper,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      
      // Input decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AcademyColors.midnight.withOpacity(0.5),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(
            color: AcademyColors.slate.withOpacity(0.3),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(
            color: AcademyColors.slate.withOpacity(0.3),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(
            color: AcademyColors.neonCyan,
            width: 2,
          ),
        ),
        labelStyle: const TextStyle(
          fontFamily: 'Inter',
          color: AcademyColors.slate,
        ),
        hintStyle: TextStyle(
          fontFamily: 'Inter',
          color: AcademyColors.slate.withOpacity(0.5),
        ),
      ),
      
      // App bar
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontFamily: 'Playfair Display',
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: AcademyColors.creamPaper,
        ),
        iconTheme: IconThemeData(
          color: AcademyColors.neonCyan,
        ),
      ),
    );
  }
}

/// Neon Glow 효과 생성 헬퍼
class NeonGlow {
  static List<BoxShadow> cyan({double intensity = 0.4, double blur = 10}) {
    return [
      BoxShadow(
        color: AcademyColors.neonCyan.withOpacity(intensity),
        blurRadius: blur,
        spreadRadius: blur / 4,
      ),
    ];
  }
  
  static List<BoxShadow> purple({double intensity = 0.3, double blur = 8}) {
    return [
      BoxShadow(
        color: AcademyColors.royalPurple.withOpacity(intensity),
        blurRadius: blur,
        spreadRadius: blur / 4,
      ),
    ];
  }
  
  static List<BoxShadow> violet({double intensity = 0.35, double blur = 12}) {
    return [
      BoxShadow(
        color: AcademyColors.electricViolet.withOpacity(intensity),
        blurRadius: blur,
        spreadRadius: blur / 3,
      ),
    ];
  }
  
  static List<BoxShadow> hologram() {
    return [
      BoxShadow(
        color: AcademyColors.neonCyan.withOpacity(0.3),
        blurRadius: 15,
        spreadRadius: 2,
      ),
      BoxShadow(
        color: AcademyColors.electricViolet.withOpacity(0.2),
        blurRadius: 25,
        spreadRadius: 5,
      ),
    ];
  }
}
