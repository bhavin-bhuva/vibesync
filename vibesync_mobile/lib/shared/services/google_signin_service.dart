import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

/// Service for handling Google Sign-In authentication
class GoogleSignInService {
  static final GoogleSignInService _instance = GoogleSignInService._internal();
  factory GoogleSignInService() => _instance;
  GoogleSignInService._internal();

  GoogleSignIn? _googleSignIn;
  bool _initialized = false;

  /// Initialize Google Sign-In with client ID
  void initialize({String? clientId}) {
    if (_initialized) return;

    // Use the provided client ID or default to the web client ID
    final webClientId = clientId ?? '348273673914-rdrtto0s352opterf5kahqanfg75aiji.apps.googleusercontent.com';

    try {
      _googleSignIn = GoogleSignIn(
        scopes: [
          'email',
          'profile',
        ],
        // For web, you need to provide the client ID
        // For Android/iOS, it's configured in the platform-specific files
        clientId: kIsWeb ? webClientId : null,
      );

      _initialized = true;
    } catch (e) {
      print('Error initializing Google Sign-In: $e');
      rethrow;
    }
  }

  /// Sign in with Google and return the ID token
  Future<String?> signIn() async {
    try {
      // Ensure initialized
      if (!_initialized || _googleSignIn == null) {
        initialize();
      }

      if (_googleSignIn == null) {
        throw Exception('Google Sign-In not initialized');
      }

      // Trigger the sign-in flow
      final GoogleSignInAccount? account = await _googleSignIn!.signIn();
      
      if (account == null) {
        // User cancelled the sign-in
        return null;
      }

      // Get authentication details
      final GoogleSignInAuthentication auth = await account.authentication;
      
      // Return the ID token
      return auth.idToken;
    } catch (error) {
      print('Error signing in with Google: $error');
      rethrow;
    }
  }

  /// Sign out from Google
  Future<void> signOut() async {
    try {
      if (!_initialized || _googleSignIn == null) return;
      await _googleSignIn!.signOut();
    } catch (error) {
      print('Error signing out from Google: $error');
      rethrow;
    }
  }

  /// Disconnect Google account
  Future<void> disconnect() async {
    try {
      if (!_initialized || _googleSignIn == null) return;
      await _googleSignIn!.disconnect();
    } catch (error) {
      print('Error disconnecting Google account: $error');
      rethrow;
    }
  }

  /// Check if user is currently signed in
  Future<bool> isSignedIn() async {
    if (!_initialized || _googleSignIn == null) return false;
    return await _googleSignIn!.isSignedIn();
  }

  /// Get current user
  GoogleSignInAccount? get currentUser {
    if (!_initialized || _googleSignIn == null) return null;
    return _googleSignIn!.currentUser;
  }
}
