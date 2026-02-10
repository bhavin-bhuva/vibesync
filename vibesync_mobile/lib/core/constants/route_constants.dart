/// Route names constants for navigation
class RouteNames {
  // Private constructor to prevent instantiation
  RouteNames._();

  // ============================================================================
  // AUTHENTICATION ROUTES
  // ============================================================================
  
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String onboarding = '/onboarding';

  // ============================================================================
  // MAIN APP ROUTES
  // ============================================================================
  
  static const String home = '/home';
  static const String conversations = '/conversations';
  static const String friends = '/friends';
  static const String status = '/status';
  static const String calls = '/calls';
  static const String settings = '/settings';

  // ============================================================================
  // CHAT ROUTES
  // ============================================================================
  
  static const String chat = '/chat';
  static const String chatDetail = '/chat/:conversationId';

  // ============================================================================
  // FRIEND ROUTES
  // ============================================================================
  
  static const String addFriend = '/add-friend';
  static const String friendRequests = '/friend-requests';
  static const String scanQr = '/scan-qr';
  static const String myQr = '/my-qr';
  static const String friendProfile = '/friend/:userId';

  // ============================================================================
  // STATUS ROUTES
  // ============================================================================
  
  static const String createStatus = '/create-status';
  static const String viewStatus = '/view-status/:userId';
  static const String myStatus = '/my-status';

  // ============================================================================
  // CALL ROUTES
  // ============================================================================
  
  static const String voiceCall = '/voice-call/:conversationId';
  static const String videoCall = '/video-call/:conversationId';
  static const String incomingCall = '/incoming-call';
  static const String callHistory = '/call-history';

  // ============================================================================
  // PROFILE & SETTINGS ROUTES
  // ============================================================================
  
  static const String profile = '/profile';
  static const String editProfile = '/edit-profile';
  static const String accountSettings = '/account-settings';
  static const String privacySettings = '/privacy-settings';
  static const String notificationSettings = '/notification-settings';
  static const String appearanceSettings = '/appearance-settings';
  static const String about = '/about';

  // ============================================================================
  // UTILITY ROUTES
  // ============================================================================
  
  static const String error = '/error';
  static const String notFound = '/not-found';
}

/// Route paths for GoRouter configuration
class RoutePaths {
  // Private constructor to prevent instantiation
  RoutePaths._();

  // Authentication
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String onboarding = '/onboarding';

  // Main app
  static const String home = '/home';
  static const String conversations = '/conversations';
  static const String friends = '/friends';
  static const String status = '/status';
  static const String calls = '/calls';
  static const String settings = '/settings';

  // Chat
  static const String chat = '/chat';
  static const String chatDetail = '/chat/:conversationId';

  // Friends
  static const String addFriend = '/add-friend';
  static const String friendRequests = '/friend-requests';
  static const String scanQr = '/scan-qr';
  static const String myQr = '/my-qr';
  static const String friendProfile = '/friend/:userId';

  // Status
  static const String createStatus = '/create-status';
  static const String viewStatus = '/view-status/:userId';
  static const String myStatus = '/my-status';

  // Calls
  static const String voiceCall = '/voice-call/:conversationId';
  static const String videoCall = '/video-call/:conversationId';
  static const String incomingCall = '/incoming-call';
  static const String callHistory = '/call-history';

  // Profile & Settings
  static const String profile = '/profile';
  static const String editProfile = '/edit-profile';
  static const String accountSettings = '/account-settings';
  static const String privacySettings = '/privacy-settings';
  static const String notificationSettings = '/notification-settings';
  static const String appearanceSettings = '/appearance-settings';
  static const String about = '/about';

  // Utility
  static const String error = '/error';
  static const String notFound = '/not-found';
}
