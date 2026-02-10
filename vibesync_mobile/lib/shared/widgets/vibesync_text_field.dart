import 'package:flutter/material.dart';
import '../../core/theme/design_tokens.dart';

/// Custom text input field with VibeSync dark theme branding
class VibeSyncTextField extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? errorText;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final bool obscureText;
  final bool enabled;
  final int? maxLines;
  final int? maxLength;
  final IconData? prefixIcon;
  final IconData? suffixIcon;
  final VoidCallback? onSuffixIconTap;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;
  final String? Function(String?)? validator;
  final TextInputAction? textInputAction;
  final FocusNode? focusNode;
  final bool autofocus;

  const VibeSyncTextField({
    super.key,
    this.label,
    this.hint,
    this.errorText,
    this.controller,
    this.keyboardType,
    this.obscureText = false,
    this.enabled = true,
    this.maxLines = 1,
    this.maxLength,
    this.prefixIcon,
    this.suffixIcon,
    this.onSuffixIconTap,
    this.onChanged,
    this.onTap,
    this.validator,
    this.textInputAction,
    this.focusNode,
    this.autofocus = false,
  });

  @override
  State<VibeSyncTextField> createState() => _VibeSyncTextFieldState();
}

class _VibeSyncTextFieldState extends State<VibeSyncTextField> {
  late bool _obscureText;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.obscureText;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: DesignTokens.fontWeightMedium,
              color: Color(0xFFD1D5DB), // Light gray for dark theme
            ),
          ),
          const SizedBox(height: DesignTokens.space8),
        ],
        TextFormField(
          controller: widget.controller,
          keyboardType: widget.keyboardType,
          obscureText: _obscureText,
          enabled: widget.enabled,
          maxLines: widget.obscureText ? 1 : widget.maxLines,
          maxLength: widget.maxLength,
          onChanged: widget.onChanged,
          onTap: widget.onTap,
          validator: widget.validator,
          textInputAction: widget.textInputAction,
          focusNode: widget.focusNode,
          autofocus: widget.autofocus,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: DesignTokens.fontWeightRegular,
            color: Colors.white,
          ),
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: const TextStyle(
              color: Color(0xFF6B7280), // Medium gray
              fontSize: 16,
            ),
            errorText: widget.errorText,
            errorMaxLines: 2,
            errorStyle: const TextStyle(
              color: Color(0xFFFCA5A5), // Light red
              fontSize: 12,
            ),
            prefixIcon: widget.prefixIcon != null
                ? Icon(
                    widget.prefixIcon,
                    color: const Color(0xFF9CA3AF), // Gray
                    size: DesignTokens.iconMedium,
                  )
                : null,
            suffixIcon: widget.obscureText
                ? IconButton(
                    icon: Icon(
                      _obscureText ? Icons.visibility_off : Icons.visibility,
                      color: const Color(0xFF9CA3AF),
                      size: DesignTokens.iconMedium,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscureText = !_obscureText;
                      });
                    },
                  )
                : (widget.suffixIcon != null
                    ? IconButton(
                        icon: Icon(
                          widget.suffixIcon,
                          color: const Color(0xFF9CA3AF),
                          size: DesignTokens.iconMedium,
                        ),
                        onPressed: widget.onSuffixIconTap,
                      )
                    : null),
            filled: true,
            fillColor: widget.enabled
                ? Colors.white.withOpacity(0.05) // Very subtle white overlay
                : const Color(0xFF1F2937),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: DesignTokens.space16,
              vertical: DesignTokens.space16,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
              borderSide: const BorderSide(
                color: Color(0xFF4B5563), // Dark gray border
                width: 1,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
              borderSide: const BorderSide(
                color: Color(0xFF4B5563),
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
              borderSide: const BorderSide(
                color: DesignTokens.primaryPurple,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
              borderSide: const BorderSide(
                color: Color(0xFFEF4444), // Red
                width: 1,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
              borderSide: const BorderSide(
                color: Color(0xFFEF4444),
                width: 2,
              ),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
              borderSide: const BorderSide(
                color: Color(0xFF374151),
                width: 1,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
