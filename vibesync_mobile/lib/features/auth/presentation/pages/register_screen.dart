import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:vibesync_mobile/core/theme/design_tokens.dart';
import 'package:vibesync_mobile/core/constants/route_constants.dart';
import 'package:vibesync_mobile/core/utils/app_router.dart';
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
            // Set authentication status in router
            AppRouter.setAuthenticated(true);
            // Navigate to home
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
                    // Purple circle
                    AnimatedBuilder(
                      animation: _pulseController1,
                      builder: (context, child) {
                        return Positioned(
                          top: -100,
                          left: -100,
                          child: Opacity(
                            opacity: 0.2 * (0.5 + 0.5 * _pulseController1.value),
                            child: Container(
                              width: 400,
                              height: 400,
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
                    // Blue circle
                    AnimatedBuilder(
                      animation: _pulseController2,
                      builder: (context, child) {
                        return Positioned(
                          top: 100,
                          right: -100,
                          child: Opacity(
                            opacity: 0.2 * (0.5 + 0.5 * _pulseController2.value),
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
                  ],
                ),
              ),

              // Content
              SafeArea(
                child: Center(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          // Logo
                          SvgPicture.asset(
                            DesignTokens.logoFullColor,
                            width: 100,
                            height: 100,
                          ),
                          const SizedBox(height: 48),

                          // Name Field
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              'FULL NAME',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: DesignTokens.primaryPurpleLight, // Brand Color
                                letterSpacing: 1.0,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          VibeSyncTextField(
                            hint: 'Your Name',
                            controller: _nameController,
                            keyboardType: TextInputType.name,
                            textInputAction: TextInputAction.next,
                            enabled: !isLoading,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Name is required';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          // Email Field
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              'EMAIL ADDRESS',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: DesignTokens.primaryPurpleLight, // Brand Color
                                letterSpacing: 1.0,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          VibeSyncTextField(
                            hint: 'email@example.com',
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
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
                          const SizedBox(height: 16),

                          // Password Field
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              'PASSWORD',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: DesignTokens.primaryPurpleLight, // Brand Color
                                letterSpacing: 1.0,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          VibeSyncTextField(
                            hint: 'Create a password',
                            controller: _passwordController,
                            obscureText: true,
                            textInputAction: TextInputAction.next,
                            enabled: !isLoading,
                            onChanged: (value) => setState(() {}),
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
                            const SizedBox(height: 8),
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
                          ],
                          const SizedBox(height: 16),

                          // Confirm Password Field
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              'CONFIRM PASSWORD',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: DesignTokens.primaryPurpleLight, // Brand Color
                                letterSpacing: 1.0,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          VibeSyncTextField(
                            hint: 'Re-enter your password',
                            controller: _confirmPasswordController,
                            obscureText: true,
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
                          const SizedBox(height: 16),

                          // Terms
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
                                  activeColor: DesignTokens.primaryPurple, // Brand Color
                                  checkColor: Colors.white,
                                  side: const BorderSide(color: Color(0xFF4B5563)),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                                ),
                              ),
                              const SizedBox(width: DesignTokens.space8),
                              Expanded(
                                child: RichText(
                                  text: const TextSpan(
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF9CA3AF),
                                    ),
                                    children: [
                                      TextSpan(text: 'I agree to the '),
                                      TextSpan(
                                        text: 'Terms of Service',
                                        style: TextStyle(
                                          color: DesignTokens.primaryPurple, // Brand Color
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      TextSpan(text: ' and '),
                                      TextSpan(
                                        text: 'Privacy Policy',
                                        style: TextStyle(
                                          color: DesignTokens.primaryPurple, // Brand Color
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),

                          // Create Account Button (Gradient)
                          GradientButton(
                            text: 'Create Account',
                            onPressed: isLoading ? null : _handleRegister,
                            isLoading: isLoading,
                            gradient: DesignTokens.gradientPrimaryPurplePink,
                          ),
                          const SizedBox(height: 32),

                           // Divider
                          Row(
                            children: [
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withOpacity(0.1),
                                  thickness: 1,
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                child: Text(
                                  'OR SIGN UP WITH',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.grey[600],
                                    letterSpacing: 1.5,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Divider(
                                  color: Colors.white.withOpacity(0.1),
                                  thickness: 1,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),

                          // Google Button
                          VibeSyncButton(
                            text: 'Google',
                            onPressed: isLoading ? null : _handleGoogleSignUp,
                            isOutlined: true,
                            icon: Icons.g_mobiledata,
                            backgroundColor: const Color(0xFF0A0A0F),
                            textColor: Colors.white,
                          ),
                          const SizedBox(height: 48),

                          // Login Link
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Already have an account? ",
                                style: TextStyle(
                                  color: Colors.grey[500],
                                  fontSize: 14,
                                ),
                              ),
                              GestureDetector(
                                onTap: isLoading
                                    ? null
                                    : () {
                                        context.pop();
                                      },
                                child: const Text(
                                  "Sign in",
                                  style: TextStyle(
                                    color: DesignTokens.primaryPurple, // Brand Color
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
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
