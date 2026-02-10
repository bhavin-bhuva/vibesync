import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:vibesync_mobile/core/theme/design_tokens.dart';
import 'package:vibesync_mobile/core/constants/route_constants.dart';
import 'package:vibesync_mobile/shared/widgets/vibesync_button.dart';
import 'package:vibesync_mobile/shared/widgets/vibesync_text_field.dart';
import 'package:vibesync_mobile/features/auth/presentation/bloc/auth_bloc.dart';

/// Registration screen - matches web design with password strength indicator
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _agreedToTerms = false;
  
  late AnimationController _pulseController1;
  late AnimationController _pulseController2;
  late AnimationController _pulseController3;

  @override
  void initState() {
    super.initState();
    
    // Initialize pulse animations
    _pulseController1 = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
    
    _pulseController2 = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
    
    _pulseController3 = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
    
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _pulseController2.forward();
    });
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) _pulseController3.forward();
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _pulseController1.dispose();
    _pulseController2.dispose();
    _pulseController3.dispose();
    super.dispose();
  }

  Map<String, dynamic> _getPasswordStrength(String password) {
    if (password.isEmpty) return {'strength': 0, 'label': ''};
    if (password.length < 6) return {'strength': 1, 'label': 'Weak'};
    if (password.length < 10) return {'strength': 2, 'label': 'Medium'};
    if (password.length >= 10 &&
        RegExp(r'[A-Z]').hasMatch(password) &&
        RegExp(r'[0-9]').hasMatch(password)) {
      return {'strength': 3, 'label': 'Strong'};
    }
    return {'strength': 2, 'label': 'Medium'};
  }

  void _handleRegister() {
    if (!_agreedToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('You must accept the terms and conditions'),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      );
      return;
    }

    if (_formKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
            RegisterEvent(
              name: _nameController.text.trim(),
              email: _emailController.text.trim(),
              password: _passwordController.text,
            ),
          );
    }
  }

  void _handleGoogleSignUp() {
    context.read<AuthBloc>().add(const LoginWithGoogleEvent());
  }

  @override
  Widget build(BuildContext context) {
    final passwordStrength = _getPasswordStrength(_passwordController.text);

    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is Authenticated) {
            context.go(RoutePaths.home);
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: const Color(0xFFEF4444),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            );
          }
        },
        builder: (context, state) {
          final isLoading = state is AuthLoading;

          return Stack(
            children: [
              // Animated Background Mesh
              Positioned.fill(
                child: Stack(
                  children: [
                    AnimatedBuilder(
                      animation: _pulseController1,
                      builder: (context, child) {
                        return Positioned(
                          top: 80,
                          left: 80,
                          child: Opacity(
                            opacity: 0.3 * (0.5 + 0.5 * _pulseController1.value),
                            child: Container(
                              width: 300,
                              height: 300,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: RadialGradient(
                                  colors: [
                                    DesignTokens.primaryPurple.withOpacity(0.6),
                                    DesignTokens.primaryPurple.withOpacity(0),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    AnimatedBuilder(
                      animation: _pulseController2,
                      builder: (context, child) {
                        return Positioned(
                          top: 160,
                          right: 80,
                          child: Opacity(
                            opacity: 0.3 * (0.5 + 0.5 * _pulseController2.value),
                            child: Container(
                              width: 300,
                              height: 300,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: RadialGradient(
                                  colors: [
                                    DesignTokens.accentBlue.withOpacity(0.6),
                                    DesignTokens.accentBlue.withOpacity(0),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    AnimatedBuilder(
                      animation: _pulseController3,
                      builder: (context, child) {
                        return Positioned(
                          bottom: 80,
                          left: MediaQuery.of(context).size.width / 2 - 150,
                          child: Opacity(
                            opacity: 0.3 * (0.5 + 0.5 * _pulseController3.value),
                            child: Container(
                              width: 300,
                              height: 300,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: RadialGradient(
                                  colors: [
                                    DesignTokens.accentPink.withOpacity(0.6),
                                    DesignTokens.accentPink.withOpacity(0),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              // Content
              SafeArea(
                child: Center(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(DesignTokens.space24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Logo with glow
                        Container(
                          width: 80,
                          height: 80,
                          padding: const EdgeInsets.all(DesignTokens.space16),
                          decoration: BoxDecoration(
                            boxShadow: [
                              BoxShadow(
                                color: DesignTokens.primaryPurple.withOpacity(0.5),
                                blurRadius: 30,
                                spreadRadius: 10,
                              ),
                            ],
                          ),
                          child: SvgPicture.asset(
                            DesignTokens.logoWhite,
                            colorFilter: const ColorFilter.mode(
                              Colors.white,
                              BlendMode.srcIn,
                            ),
                          ),
                        ),
                        const SizedBox(height: DesignTokens.space16),

                        // Gradient Text
                        ShaderMask(
                          shaderCallback: (bounds) => DesignTokens.gradientPurpleBlue.createShader(bounds),
                          child: const Text(
                            'VibeSync',
                            style: TextStyle(
                              fontSize: 48,
                              fontWeight: DesignTokens.fontWeightBold,
                              color: Colors.white,
                              letterSpacing: -2,
                            ),
                          ),
                        ),
                        const SizedBox(height: DesignTokens.space8),

                        const Text(
                          'Connect. Chat. Vibe.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                        const SizedBox(height: DesignTokens.space48),

                        // Glass Card
                        Container(
                          constraints: const BoxConstraints(maxWidth: 450),
                          padding: const EdgeInsets.all(DesignTokens.space32),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1F2937).withOpacity(0.75),
                            borderRadius: BorderRadius.circular(DesignTokens.radiusLarge),
                            border: Border.all(
                              color: Colors.white.withOpacity(0.1),
                              width: 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Form(
                            key: _formKey,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Create Account',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: DesignTokens.fontWeightBold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: DesignTokens.space8),
                                const Text(
                                  'Join VibeSync and start connecting',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ),
                                const SizedBox(height: DesignTokens.space32),

                                // Username Field
                                VibeSyncTextField(
                                  label: 'Username',
                                  hint: 'Enter your username',
                                  controller: _nameController,
                                  keyboardType: TextInputType.name,
                                  prefixIcon: Icons.person_outlined,
                                  textInputAction: TextInputAction.next,
                                  enabled: !isLoading,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Username is required';
                                    }
                                    if (value.length < 3) {
                                      return 'Username must be at least 3 characters';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: DesignTokens.space16),

                                // Email Field
                                VibeSyncTextField(
                                  label: 'Email Address',
                                  hint: 'Enter your email',
                                  controller: _emailController,
                                  keyboardType: TextInputType.emailAddress,
                                  prefixIcon: Icons.email_outlined,
                                  textInputAction: TextInputAction.next,
                                  enabled: !isLoading,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Email is required';
                                    }
                                    if (!RegExp(r'\S+@\S+\.\S+').hasMatch(value)) {
                                      return 'Email is invalid';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: DesignTokens.space16),

                                // Password Field with Strength Indicator
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    VibeSyncTextField(
                                      label: 'Password',
                                      hint: 'Create a password',
                                      controller: _passwordController,
                                      obscureText: true,
                                      prefixIcon: Icons.lock_outlined,
                                      textInputAction: TextInputAction.next,
                                      enabled: !isLoading,
                                      onChanged: (value) {
                                        setState(() {}); // Rebuild to update strength indicator
                                      },
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Password is required';
                                        }
                                        if (value.length < 6) {
                                          return 'Password must be at least 6 characters';
                                        }
                                        return null;
                                      },
                                    ),
                                    if (_passwordController.text.isNotEmpty) ...[
                                      const SizedBox(height: DesignTokens.space8),
                                      Row(
                                        children: List.generate(3, (index) {
                                          final strength = passwordStrength['strength'] as int;
                                          final isActive = index < strength;
                                          Color barColor = const Color(0xFF374151);
                                          
                                          if (isActive) {
                                            if (strength == 1) {
                                              barColor = const Color(0xFFEF4444); // Red
                                            } else if (strength == 2) {
                                              barColor = const Color(0xFFF59E0B); // Yellow
                                            } else {
                                              barColor = const Color(0xFF10B981); // Green
                                            }
                                          }
                                          
                                          return Expanded(
                                            child: Container(
                                              height: 4,
                                              margin: EdgeInsets.only(
                                                right: index < 2 ? 4 : 0,
                                              ),
                                              decoration: BoxDecoration(
                                                color: barColor,
                                                borderRadius: BorderRadius.circular(2),
                                              ),
                                            ),
                                          );
                                        }),
                                      ),
                                      const SizedBox(height: DesignTokens.space4),
                                      Text(
                                        'Password strength: ${passwordStrength['label']}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Color(0xFF9CA3AF),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                                const SizedBox(height: DesignTokens.space16),

                                // Confirm Password Field
                                VibeSyncTextField(
                                  label: 'Confirm Password',
                                  hint: 'Re-enter your password',
                                  controller: _confirmPasswordController,
                                  obscureText: true,
                                  prefixIcon: Icons.lock_outlined,
                                  textInputAction: TextInputAction.done,
                                  enabled: !isLoading,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please confirm your password';
                                    }
                                    if (value != _passwordController.text) {
                                      return 'Passwords do not match';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: DesignTokens.space16),

                                // Terms & Conditions
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: Checkbox(
                                        value: _agreedToTerms,
                                        onChanged: isLoading
                                            ? null
                                            : (value) {
                                                setState(() {
                                                  _agreedToTerms = value ?? false;
                                                });
                                              },
                                        activeColor: DesignTokens.primaryPurple,
                                        side: const BorderSide(color: Color(0xFF4B5563)),
                                      ),
                                    ),
                                    const SizedBox(width: DesignTokens.space8),
                                    Expanded(
                                      child: RichText(
                                        text: const TextSpan(
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: Color(0xFFD1D5DB),
                                          ),
                                          children: [
                                            TextSpan(text: 'I agree to the '),
                                            TextSpan(
                                              text: 'Terms of Service',
                                              style: TextStyle(
                                                color: DesignTokens.primaryPurple,
                                              ),
                                            ),
                                            TextSpan(text: ' and '),
                                            TextSpan(
                                              text: 'Privacy Policy',
                                              style: TextStyle(
                                                color: DesignTokens.primaryPurple,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: DesignTokens.space24),

                                // Error Display
                                if (state is AuthError)
                                  Container(
                                    padding: const EdgeInsets.all(DesignTokens.space12),
                                    margin: const EdgeInsets.only(bottom: DesignTokens.space16),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFEF4444).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(DesignTokens.radiusMedium),
                                      border: Border.all(
                                        color: const Color(0xFFEF4444).withOpacity(0.2),
                                      ),
                                    ),
                                    child: Text(
                                      state.message,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: Color(0xFFFCA5A5),
                                      ),
                                    ),
                                  ),

                                // Register Button
                                GradientButton(
                                  text: isLoading ? 'Creating Account...' : 'Create Account',
                                  onPressed: isLoading ? null : _handleRegister,
                                  isLoading: isLoading,
                                  gradient: DesignTokens.gradientPrimaryPurplePink,
                                ),
                                const SizedBox(height: DesignTokens.space24),

                                // Divider
                                Row(
                                  children: [
                                    Expanded(
                                      child: Container(
                                        height: 1,
                                        color: Colors.white.withOpacity(0.1),
                                      ),
                                    ),
                                    const Padding(
                                      padding: EdgeInsets.symmetric(horizontal: DesignTokens.space8),
                                      child: Text(
                                        'Or sign up with',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Color(0xFF9CA3AF),
                                        ),
                                      ),
                                    ),
                                    Expanded(
                                      child: Container(
                                        height: 1,
                                        color: Colors.white.withOpacity(0.1),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: DesignTokens.space24),

                                // Google Sign Up Button
                                VibeSyncButton(
                                  text: 'Sign up with Google',
                                  onPressed: isLoading ? null : _handleGoogleSignUp,
                                  isOutlined: true,
                                  icon: Icons.g_mobiledata,
                                  backgroundColor: const Color(0xFF374151),
                                  textColor: Colors.white,
                                ),
                                const SizedBox(height: DesignTokens.space24),

                                // Login Link
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Text(
                                      'Already have an account? ',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Color(0xFF9CA3AF),
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: isLoading
                                          ? null
                                          : () {
                                              context.pop();
                                            },
                                      style: TextButton.styleFrom(
                                        padding: EdgeInsets.zero,
                                        minimumSize: const Size(0, 0),
                                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      child: const Text(
                                        'Sign in',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: DesignTokens.primaryPurple,
                                          fontWeight: DesignTokens.fontWeightSemiBold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
