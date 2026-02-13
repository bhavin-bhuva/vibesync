import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'core/theme/design_tokens.dart';
import 'core/utils/app_router.dart';
import 'core/network/api_client.dart';
import 'shared/services/local_storage_service.dart';
import 'shared/services/secure_storage_service.dart';
import 'shared/services/socket_service.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'core/theme/theme_cubit.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services
  final localStorage = LocalStorageService();
  await localStorage.init();
  
  final secureStorage = SecureStorageService();
  final apiClient = ApiClient();
  final socketService = SocketService();
  
  runApp(VibeSyncApp(
    localStorage: localStorage,
    secureStorage: secureStorage,
    apiClient: apiClient,
    socketService: socketService,
  ));
}

class VibeSyncApp extends StatelessWidget {
  final LocalStorageService localStorage;
  final SecureStorageService secureStorage;
  final ApiClient apiClient;
  final SocketService socketService;

  const VibeSyncApp({
    super.key,
    required this.localStorage,
    required this.secureStorage,
    required this.apiClient,
    required this.socketService,
  });

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider<LocalStorageService>.value(value: localStorage),
        RepositoryProvider<SecureStorageService>.value(value: secureStorage),
        RepositoryProvider<ApiClient>.value(value: apiClient),
        RepositoryProvider<SocketService>.value(value: socketService),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider(
            create: (context) => AuthBloc(
              apiClient: apiClient,
              secureStorage: secureStorage,
              localStorage: localStorage,
              socketService: socketService, // Pass socketService to AuthBloc
            )..add(const CheckAuthStatusEvent()),
          ),
          BlocProvider(
            create: (context) => ThemeCubit(localStorage),
          ),
        ],
        child: BlocBuilder<ThemeCubit, ThemeMode>(
          builder: (context, themeMode) {
            return MaterialApp.router(
              title: 'VibeSync',
              debugShowCheckedModeBanner: false,
              theme: ThemeData(
                colorScheme: ColorScheme.fromSeed(
                  seedColor: DesignTokens.primaryPurple,
                  brightness: Brightness.light,
                ),
                textTheme: GoogleFonts.outfitTextTheme(),
                useMaterial3: true,
              ),
              darkTheme: ThemeData(
                colorScheme: ColorScheme.fromSeed(
                  seedColor: DesignTokens.primaryPurple,
                  brightness: Brightness.dark,
                ),
                textTheme: GoogleFonts.outfitTextTheme(
                  ThemeData.dark().textTheme,
                ),
                useMaterial3: true,
              ),
              themeMode: themeMode,
              routerConfig: AppRouter.router,
            );
          },
        ),
    )); // MultiBlocProvider and MultiRepositoryProvider
  }
}

/// Splash screen shown on app launch
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _pulseController1;
  late AnimationController _pulseController2;

  @override
  void initState() {
    super.initState();
    
    // Initialize pulse animations
    _pulseController1 = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);
    
    _pulseController2 = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);

    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _pulseController2.forward();
    });

    _navigateAfterDelay();
  }

  @override
  void dispose() {
    _pulseController1.dispose();
    _pulseController2.dispose();
    super.dispose();
  }

  Future<void> _navigateAfterDelay() async {
    // Minimum splash screen duration
    final minSplashTime = Future.delayed(const Duration(seconds: 2));
    
    if (!mounted) return;
    
    final authBloc = context.read<AuthBloc>();
    
    // Check current state or wait for terminal state
    AuthState authState = authBloc.state;
    if (authState is! Authenticated && authState is! Unauthenticated) {
      try {
        authState = await authBloc.stream.firstWhere(
          (state) => state is Authenticated || state is Unauthenticated,
        );
      } catch (e) {
        // Fallback if stream error
        authState = const Unauthenticated();
      }
    }
    
    // Ensure minimum splash time has passed
    await minSplashTime;
    
    if (!mounted) return;
    
    // Navigate based on resolved state
    if (authState is Authenticated) {
      context.go('/home');
    } else {
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      body: Stack(
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
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                SvgPicture.asset(
                  DesignTokens.logoFullColor,
                  width: 150,
                  height: 150,
                ),
                const SizedBox(height: 48),

                // Loading indicator
                const SizedBox(
                  width: 32,
                  height: 32,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    valueColor: AlwaysStoppedAnimation<Color>(DesignTokens.primaryPurple),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
