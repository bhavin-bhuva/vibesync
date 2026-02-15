import 'package:flutter/material.dart';
import '../../core/theme/design_tokens.dart';

/// Custom button widget with VibeSync dark theme branding
class VibeSyncButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isOutlined;
  final IconData? icon;
  final Color? backgroundColor;
  final Color? textColor;
  final double? width;

  const VibeSyncButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isOutlined = false,
    this.icon,
    this.backgroundColor,
    this.textColor,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: DesignTokens.buttonHeight,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: isOutlined
              ? Colors.transparent
              : (backgroundColor ?? const Color(0xFF374151)),
          foregroundColor: textColor ?? Colors.white,
          disabledBackgroundColor: const Color(0xFF1F2937),
          disabledForegroundColor: const Color(0xFF6B7280),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
            side: isOutlined
                ? BorderSide(
                    color: backgroundColor ?? const Color(0xFF4B5563),
                    width: 1,
                  )
                : BorderSide.none,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: DesignTokens.space24,
            vertical: DesignTokens.space12,
          ),
        ),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(textColor ?? Colors.white),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: DesignTokens.iconMedium),
                    const SizedBox(width: DesignTokens.space8),
                  ],
                  Text(
                    text,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: DesignTokens.fontWeightMedium,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

/// Gradient button widget with VibeSync branding
class GradientButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final Gradient? gradient;
  final double? width;

  const GradientButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
    this.gradient,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: DesignTokens.buttonHeight,
      child: Container(
        decoration: BoxDecoration(
          gradient: isLoading || onPressed == null
              ? null
              : (gradient ?? DesignTokens.gradientPurpleBlue),
          color: isLoading || onPressed == null
              ? const Color(0xFF1F2937)
              : null,
          borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
        ),
        child: ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            foregroundColor: Colors.white,
            disabledBackgroundColor: Colors.transparent,
            disabledForegroundColor: const Color(0xFF6B7280),
            elevation: 0,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: DesignTokens.space24,
              vertical: DesignTokens.space12,
            ),
          ),
          child: isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, size: DesignTokens.iconMedium),
                      const SizedBox(width: DesignTokens.space8),
                    ],
                    Text(
                      text,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: DesignTokens.fontWeightSemiBold,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
