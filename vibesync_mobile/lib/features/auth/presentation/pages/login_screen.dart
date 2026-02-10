import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:vibesync_mobile/core/theme/design_tokens.dart';
import 'package:vibesync_mobile/core/constants/route_constants.dart';
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
                    // Blue circle
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
                    // Pink circle
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
                        // Logo with glow effect
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

                        // Gradient Text "VibeSync"
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

                        // Subtitle
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
                                // Title
                                const Text(
                                  'Welcome Back',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: DesignTokens.fontWeightBold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: DesignTokens.space8),
                                const Text(
                                  'Sign in to continue your conversations',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ),
                                const SizedBox(height: DesignTokens.space32),

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

                                // Password Field
                                VibeSyncTextField(
                                  label: 'Password',
                                  hint: 'Enter your password',
                                  controller: _passwordController,
                                  obscureText: true,
                                  prefixIcon: Icons.lock_outlined,
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
                                const SizedBox(height: DesignTokens.space16),

                                // Remember Me & Forgot Password
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        SizedBox(
                                          width: 20,
                                          height: 20,
                                          child: Checkbox(
                                            value: _rememberMe,
                                            onChanged: isLoading
                                                ? null
                                                : (value) {
                                                    setState(() {
                                                      _rememberMe = value ?? false;
                                                    });
                                                  },
                                            activeColor: DesignTokens.primaryPurple,
                                            side: const BorderSide(color: Color(0xFF4B5563)),
                                          ),
                                        ),
                                        const SizedBox(width: DesignTokens.space8),
                                        const Text(
                                          'Remember me',
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: Color(0xFFD1D5DB),
                                          ),
                                        ),
                                      ],
                                    ),
                                    TextButton(
                                      onPressed: isLoading
                                          ? null
                                          : () {
                                              context.push(RoutePaths.forgotPassword);
                                            },
                                      child: const Text(
                                        'Forgot password?',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: DesignTokens.primaryPurple,
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

                                // Login Button
                                GradientButton(
                                  text: isLoading ? 'Signing in...' : 'Sign In',
                                  onPressed: isLoading ? null : _handleLogin,
                                  isLoading: isLoading,
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
                                        'Or continue with',
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

                                // Google Sign In Button
                                VibeSyncButton(
                                  text: 'Continue with Google',
                                  onPressed: isLoading ? null : _handleGoogleLogin,
                                  isOutlined: true,
                                  icon: Icons.g_mobiledata,
                                  backgroundColor: const Color(0xFF374151),
                                  textColor: Colors.white,
                                ),
                                const SizedBox(height: DesignTokens.space24),

                                // Sign Up Link
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Text(
                                      "Don't have an account? ",
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Color(0xFF9CA3AF),
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: isLoading
                                          ? null
                                          : () {
                                              context.push(RoutePaths.register);
                                            },
                                      style: TextButton.styleFrom(
                                        padding: EdgeInsets.zero,
                                        minimumSize: const Size(0, 0),
                                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      child: const Text(
                                        'Sign up',
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
