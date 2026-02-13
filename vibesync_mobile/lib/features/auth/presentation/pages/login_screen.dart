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

/// Login screen with email/password and OAuth options - matches web design
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = false;
  
  late AnimationController _pulseController1;
  late AnimationController _pulseController2;
  late AnimationController _pulseController3;

  @override
  void initState() {
    super.initState();
    
    // Initialize pulse animations for background circles
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
    
    // Stagger the animations
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _pulseController2.forward();
    });
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) _pulseController3.forward();
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _pulseController1.dispose();
    _pulseController2.dispose();
    _pulseController3.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
            LoginEvent(
              email: _emailController.text.trim(),
              password: _passwordController.text,
            ),
          );
    }
  }

  void _handleGoogleLogin() {
    context.read<AuthBloc>().add(const LoginWithGoogleEvent());
  }

  @override
  Widget build(BuildContext context) {
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
                          const SizedBox(height: 24),

                          // Password Field
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'PASSWORD',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: DesignTokens.primaryPurpleLight, // Brand Color
                                  letterSpacing: 1.0,
                                ),
                              ),
                              GestureDetector(
                                onTap: isLoading
                                    ? null
                                    : () {
                                        context.push(RoutePaths.forgotPassword);
                                      },
                                child: Text(
                                  'Forgot?',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.normal,
                                    color: DesignTokens.accentPink, // Brand Color
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          VibeSyncTextField(
                            hint: '••••••••',
                            controller: _passwordController,
                            obscureText: true,
                            textInputAction: TextInputAction.done,
                            enabled: !isLoading,
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
                          const SizedBox(height: 32),

                          // Sign In Button (Gradient - Brand Color)
                          GradientButton(
                            text: 'Sign In',
                            onPressed: isLoading ? null : _handleLogin,
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
                                  'OR CONTINUE WITH',
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
                            onPressed: isLoading ? null : _handleGoogleLogin,
                            isOutlined: true,
                            icon: Icons.g_mobiledata, 
                            backgroundColor: const Color(0xFF0A0A0F),
                            textColor: Colors.white,
                          ),
                          const SizedBox(height: 48),

                          // Create Account Link
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "New here? ",
                                style: TextStyle(
                                  color: Colors.grey[500],
                                  fontSize: 14,
                                ),
                              ),
                              GestureDetector(
                                onTap: isLoading
                                    ? null
                                    : () {
                                        context.push(RoutePaths.register);
                                      },
                                child: const Text(
                                  "Create account",
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
