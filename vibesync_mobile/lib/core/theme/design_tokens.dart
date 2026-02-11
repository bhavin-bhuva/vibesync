import 'package:flutter/material.dart';

/// Design tokens for VibeSync mobile app
/// Based on the VibeSync brand kit
class DesignTokens {
  // Private constructor to prevent instantiation
  DesignTokens._();

  // ============================================================================
  // COLORS - Primary (from VibeSync Brand Kit)
  // ============================================================================
  
  /// Primary purple color - #A259FF - hsl(262, 83%, 58%)
  /// Usage: Primary brand color, CTAs, headings, main UI elements
  static const Color primaryPurple = Color(0xFFA259FF);
  
  /// Primary purple dark variant
  static const Color primaryPurpleDark = Color(0xFF8B3FE6);
  
  /// Primary purple light variant
  static const Color primaryPurpleLight = Color(0xFFB87AFF);

  // ============================================================================
  // COLORS - Secondary (from VibeSync Brand Kit)
  // ============================================================================
  
  /// Secondary blue color - #6CD7FF - hsl(198, 93%, 60%)
  /// Usage: Secondary elements, links, trust indicators, highlights
  static const Color secondaryBlue = Color(0xFF6CD7FF);
  
  /// Secondary blue dark variant
  static const Color secondaryBlueDark = Color(0xFF4AC5ED);
  
  /// Accent pink color - #FF64AA - hsl(330, 85%, 65%)
  /// Usage: Accent elements, notifications, energy, warmth
  static const Color accentPink = Color(0xFFFF64AA);
  
  /// Accent yellow color - #FFC850 - hsl(45, 100%, 65%)
  /// Usage: Highlights, optimism, calls-to-attention
  static const Color accentYellow = Color(0xFFFFC850);
  
  /// Accent blue (alias for secondaryBlue) - for consistency
  static const Color accentBlue = secondaryBlue;

  // ============================================================================
  // COLORS - Semantic (from VibeSync Brand Kit)
  // ============================================================================
  
  /// Success green color - #50C878
  static const Color success = Color(0xFF50C878);
  
  /// Warning orange color - #FFA500
  static const Color warning = Color(0xFFFFA500);
  
  /// Error red color - #FF5C5C
  static const Color error = Color(0xFFFF5C5C);
  
  /// Info blue color - #6CD7FF (same as secondary blue)
  static const Color info = Color(0xFF6CD7FF);

  // ============================================================================
  // COLORS - Neutral (Light Theme)
  // ============================================================================
  
  static const Color gray50 = Color(0xFFF9FAFB);
  static const Color gray100 = Color(0xFFF3F4F6);
  static const Color gray200 = Color(0xFFE5E7EB);
  static const Color gray300 = Color(0xFFD1D5DB);
  static const Color gray400 = Color(0xFF9CA3AF);
  static const Color gray500 = Color(0xFF6B7280);
  static const Color gray600 = Color(0xFF4B5563);
  static const Color gray700 = Color(0xFF374151);
  static const Color gray800 = Color(0xFF1F2937);
  static const Color gray900 = Color(0xFF111827);

  // ============================================================================
  // SPACING
  // ============================================================================
  
  /// Base spacing unit: 4px
  static const double space4 = 4.0;
  
  /// 8px spacing
  static const double space8 = 8.0;
  
  /// 12px spacing
  static const double space12 = 12.0;
  
  /// 16px spacing
  static const double space16 = 16.0;
  
  /// 24px spacing
  static const double space24 = 24.0;
  
  /// 32px spacing
  static const double space32 = 32.0;
  
  /// 48px spacing
  static const double space48 = 48.0;
  
  /// 64px spacing
  static const double space64 = 64.0;

  // ============================================================================
  // BORDER RADIUS
  // ============================================================================
  
  /// Small border radius: 8px
  static const double radiusSmall = 8.0;
  
  /// Medium border radius: 12px
  static const double radiusMedium = 12.0;
  
  /// Large border radius: 16px
  static const double radiusLarge = 16.0;
  
  /// Extra large border radius: 24px
  static const double radiusXLarge = 24.0;
  
  /// Full/circular border radius
  static const double radiusFull = 9999.0;

  // ============================================================================
  // TYPOGRAPHY
  // ============================================================================
  
  /// Font family: Outfit (from Google Fonts)
  static const String fontFamily = 'Outfit';
  
  /// Font weight: Regular (400)
  static const FontWeight fontWeightRegular = FontWeight.w400;
  
  /// Font weight: Medium (500)
  static const FontWeight fontWeightMedium = FontWeight.w500;
  
  /// Font weight: Semi-bold (600)
  static const FontWeight fontWeightSemiBold = FontWeight.w600;
  
  /// Font weight: Bold (700)
  static const FontWeight fontWeightBold = FontWeight.w700;

  // ============================================================================
  // ELEVATION / SHADOWS
  // ============================================================================
  
  /// Small elevation (2dp)
  static const double elevationSmall = 2.0;
  
  /// Medium elevation (4dp)
  static const double elevationMedium = 4.0;
  
  /// Large elevation (8dp)
  static const double elevationLarge = 8.0;
  
  /// Extra large elevation (16dp)
  static const double elevationXLarge = 16.0;

  // ============================================================================
  // ANIMATION DURATIONS
  // ============================================================================
  
  /// Fast animation: 150ms
  static const Duration animationFast = Duration(milliseconds: 150);
  
  /// Normal animation: 300ms
  static const Duration animationNormal = Duration(milliseconds: 300);
  
  /// Slow animation: 500ms
  static const Duration animationSlow = Duration(milliseconds: 500);

  // ============================================================================
  // ICON SIZES
  // ============================================================================
  
  /// Small icon size: 16px
  static const double iconSmall = 16.0;
  
  /// Medium icon size: 24px
  static const double iconMedium = 24.0;
  
  /// Large icon size: 32px
  static const double iconLarge = 32.0;
  
  /// Extra large icon size: 48px
  static const double iconXLarge = 48.0;

  // ============================================================================
  // AVATAR SIZES
  // ============================================================================
  
  /// Small avatar size: 32px
  static const double avatarSmall = 32.0;
  
  /// Medium avatar size: 48px
  static const double avatarMedium = 48.0;
  
  /// Large avatar size: 64px
  static const double avatarLarge = 64.0;
  
  /// Extra large avatar size: 96px
  static const double avatarXLarge = 96.0;

  // ============================================================================
  // BUTTON HEIGHTS
  // ============================================================================
  
  /// Small button height: 36px
  static const double buttonHeightSmall = 36.0;
  
  /// Medium button height: 48px
  static const double buttonHeightMedium = 48.0;
  
  /// Large button height: 56px
  static const double buttonHeightLarge = 56.0;
  
  /// Default button height (same as medium)
  static const double buttonHeight = buttonHeightMedium;

  // ============================================================================
  // INPUT HEIGHTS
  // ============================================================================
  
  /// Small input height: 40px
  static const double inputHeightSmall = 40.0;
  
  /// Medium input height: 48px
  static const double inputHeightMedium = 48.0;
  
  /// Large input height: 56px
  static const double inputHeightLarge = 56.0;

  // ============================================================================
  // ASSET PATHS - Logos
  // ============================================================================
  
  /// Full color logo (gradient)
  static const String logoFullColor = 'assets/images/logos/vibesync-logo-full-color.svg';
  
  /// White logo (for dark backgrounds)
  static const String logoWhite = 'assets/images/logos/vibesync-logo-white.svg';
  
  /// Black logo (for light backgrounds)
  static const String logoBlack = 'assets/images/logos/vibesync-logo-black.svg';
  
  /// Purple monochrome logo
  static const String logoPurple = 'assets/images/logos/vibesync-logo-purple.svg';

  // ============================================================================
  // GRADIENTS
  // ============================================================================
  
  /// Primary gradient: Purple to Pink
  /// Usage: Primary CTAs, hero sections, premium elements
  static const LinearGradient gradientPrimaryPurplePink = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryPurple, accentPink],
  );
  
  /// Secondary gradient: Purple to Blue
  /// Usage: Secondary buttons, backgrounds, accents
  static const LinearGradient gradientPurpleBlue = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryPurple, secondaryBlue],
  );
  
  /// Accent gradient: Pink to Yellow
  /// Usage: Highlights, special features, success states
  static const LinearGradient gradientPinkYellow = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [accentPink, accentYellow],
  );

  // ============================================================================
  // DARK THEME BACKGROUNDS (from Brand Kit)
  // ============================================================================
  
  /// Primary dark background
  static const Color darkBackgroundPrimary = Color(0xFF0A0A14);
  
  /// Secondary dark background
  static const Color darkBackgroundSecondary = Color(0xFF1A0A2E);
  
  /// Tertiary dark background
  static const Color darkBackgroundTertiary = Color(0xFF2A1A3E);
}

