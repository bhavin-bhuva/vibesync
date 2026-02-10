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
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => AuthBloc(
            apiClient: apiClient,
            secureStorage: secureStorage,
            localStorage: localStorage,
          )..add(const CheckAuthStatusEvent()),
        ),
      ],
      child: MaterialApp.router(
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
        themeMode: ThemeMode.system,
        routerConfig: AppRouter.router,
      ),
    );
  }
}

/// Splash screen shown on app launch
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateAfterDelay();
  }

  Future<void> _navigateAfterDelay() async {
    // Wait for 2 seconds to show splash screen
    await Future.delayed(const Duration(seconds: 2));
    
    if (!mounted) return;
    
    // Check auth state and navigate accordingly
    final authState = context.read<AuthBloc>().state;
    
    if (authState is Authenticated) {
      context.go('/home');
    } else {
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: DesignTokens.gradientPurpleBlue,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo with glow effect
              Container(
                width: 120,
                height: 120,
                padding: const EdgeInsets.all(DesignTokens.space24),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(DesignTokens.radiusXLarge),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.3),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: DesignTokens.primaryPurple.withValues(alpha: 0.5),
                      blurRadius: 40,
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
              const SizedBox(height: DesignTokens.space32),
              
              // App Name
              const Text(
                'VibeSync',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: DesignTokens.fontWeightBold,
                  color: Colors.white,
                  letterSpacing: -2,
                ),
              ),
              const SizedBox(height: DesignTokens.space8),
              
              // Tagline
              Text(
                'Stay connected, stay in sync',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white.withValues(alpha: 0.9),
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: DesignTokens.space48),
              
              // Loading indicator
              const SizedBox(
                width: 40,
                height: 40,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
