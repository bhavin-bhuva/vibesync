import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:vibesync_mobile/core/constants/route_constants.dart';
import 'package:vibesync_mobile/main.dart';
import 'package:vibesync_mobile/features/home/presentation/pages/home_screen.dart';
import 'package:vibesync_mobile/features/auth/presentation/pages/login_screen.dart';
import 'package:vibesync_mobile/features/auth/presentation/pages/register_screen.dart';
import 'package:vibesync_mobile/features/messages/presentation/pages/chat_screen.dart';
import 'package:vibesync_mobile/features/conversations/data/models/conversation_model.dart';
import 'package:vibesync_mobile/features/friends/presentation/pages/add_friend_screen.dart';

/// App router configuration using GoRouter
class AppRouter {
  // Private constructor
  AppRouter._();

  /// Check if user is authenticated
  /// This will be replaced with actual auth check from AuthBloc
  static bool _isAuthenticated = false;

  /// Set authentication status
  static void setAuthenticated(bool value) {
    _isAuthenticated = value;
  }

  /// Router configuration
  static final GoRouter router = GoRouter(
    initialLocation: RoutePaths.splash,
    debugLogDiagnostics: true,
    routes: [
      // ========================================================================
      // SPLASH SCREEN
      // ========================================================================
      GoRoute(
        path: RoutePaths.splash,
        name: RouteNames.splash,
        builder: (context, state) => const SplashScreen(),
      ),

      // ========================================================================
      // AUTHENTICATION ROUTES (Public)
      // ========================================================================
      GoRoute(
        path: RoutePaths.login,
        name: RouteNames.login,
        builder: (context, state) => const LoginScreen(),
      ),

      GoRoute(
        path: RoutePaths.register,
        name: RouteNames.register,
        builder: (context, state) => const RegisterScreen(),
      ),

      GoRoute(
        path: RoutePaths.forgotPassword,
        name: RouteNames.forgotPassword,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Forgot Password - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.onboarding,
        name: RouteNames.onboarding,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Onboarding - Coming Soon')),
        ),
      ),

      // ========================================================================
      // MAIN APP ROUTES (Protected)
      // ========================================================================
      GoRoute(
        path: RoutePaths.home,
        name: RouteNames.home,
        builder: (context, state) => const HomeScreen(),
      ),

      GoRoute(
        path: RoutePaths.conversations,
        name: RouteNames.conversations,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Conversations - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.friends,
        name: RouteNames.friends,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Friends - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.status,
        name: RouteNames.status,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Status - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.calls,
        name: RouteNames.calls,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Calls - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.settings,
        name: RouteNames.settings,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Settings - Coming Soon')),
        ),
      ),

      // ========================================================================
      // CHAT ROUTES (Protected)
      // ========================================================================
      GoRoute(
        path: RoutePaths.chatDetail,
        name: RouteNames.chatDetail,
        builder: (context, state) {
          final conversationId = state.pathParameters['conversationId']!;
          final conversation = state.extra is Conversation ? state.extra as Conversation : null;
          return ChatScreen(
            conversationId: conversationId,
            conversation: conversation,
          );
        },
      ),

      // ========================================================================
      // FRIEND ROUTES (Protected)
      // ========================================================================
      GoRoute(
        path: RoutePaths.addFriend,
        name: RouteNames.addFriend,
        builder: (context, state) => const AddFriendScreen(),
      ),

      GoRoute(
        path: RoutePaths.friendRequests,
        name: RouteNames.friendRequests,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Friend Requests - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.scanQr,
        name: RouteNames.scanQr,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Scan QR - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.myQr,
        name: RouteNames.myQr,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('My QR Code - Coming Soon')),
        ),
      ),

      // ========================================================================
      // PROFILE & SETTINGS ROUTES (Protected)
      // ========================================================================
      GoRoute(
        path: RoutePaths.profile,
        name: RouteNames.profile,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Profile - Coming Soon')),
        ),
      ),

      GoRoute(
        path: RoutePaths.editProfile,
        name: RouteNames.editProfile,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Edit Profile - Coming Soon')),
        ),
      ),

      // ========================================================================
      // ERROR ROUTES
      // ========================================================================
      GoRoute(
        path: RoutePaths.notFound,
        name: RouteNames.notFound,
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('404 - Page Not Found')),
        ),
      ),
    ],

    // Redirect logic for authentication
    redirect: (context, state) {
      final isGoingToLogin = state.matchedLocation == RoutePaths.login;
      final isGoingToRegister = state.matchedLocation == RoutePaths.register;
      final isGoingToSplash = state.matchedLocation == RoutePaths.splash;
      final isGoingToOnboarding = state.matchedLocation == RoutePaths.onboarding;
      final isGoingToForgotPassword =
          state.matchedLocation == RoutePaths.forgotPassword;

      // Allow access to public routes
      if (isGoingToSplash ||
          isGoingToLogin ||
          isGoingToRegister ||
          isGoingToOnboarding ||
          isGoingToForgotPassword) {
        return null;
      }

      // If not authenticated, redirect to login
      if (!_isAuthenticated) {
        return RoutePaths.login;
      }

      // If authenticated and trying to access login/register, redirect to home
      if (_isAuthenticated && (isGoingToLogin || isGoingToRegister)) {
        return RoutePaths.home;
      }

      // Allow access
      return null;
    },

    // Error handling
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Error: ${state.error}',
              style: const TextStyle(fontSize: 18),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go(RoutePaths.home),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );
}
