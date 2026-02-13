/// Storage keys constants for SharedPreferences and SecureStorage
class StorageKeys {
  // Private constructor to prevent instantiation
  StorageKeys._();

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  
  /// JWT access token (stored in secure storage)
  static const String accessToken = 'access_token';
  
  /// JWT refresh token (stored in secure storage)
  static const String refreshToken = 'refresh_token';
  
  /// User ID
  static const String userId = 'user_id';
  
  /// Is user logged in
  static const String isLoggedIn = 'is_logged_in';

  // ============================================================================
  // USER DATA
  // ============================================================================
  
  /// User profile data (JSON string)
  static const String userProfile = 'user_profile';
  
  /// User email
  static const String userEmail = 'user_email';
  
  /// User name
  static const String userName = 'user_name';
  
  /// User avatar URL
  static const String userAvatar = 'user_avatar';
  
  /// User friend code
  static const String userFriendCode = 'user_friend_code';

  // ============================================================================
  // APP SETTINGS
  // ============================================================================
  
  /// Theme mode (light, dark, system)
  static const String themeMode = 'theme_mode';
  
  /// App language
  static const String language = 'language';
  
  /// Notifications enabled
  static const String notificationsEnabled = 'notifications_enabled';
  
  /// Sound enabled
  static const String soundEnabled = 'sound_enabled';
  
  /// Vibration enabled
  static const String vibrationEnabled = 'vibration_enabled';

  // ============================================================================
  // ONBOARDING
  // ============================================================================
  
  /// Has user completed onboarding
  static const String onboardingComplete = 'onboarding_complete';
  
  /// First app launch
  static const String firstLaunch = 'first_launch';

  // ============================================================================
  // PRIVACY SETTINGS
  // ============================================================================
  
  /// Last seen visibility
  static const String lastSeenVisibility = 'last_seen_visibility';
  
  /// Profile photo visibility
  static const String profilePhotoVisibility = 'profile_photo_visibility';
  
  /// Status visibility
  static const String statusVisibility = 'status_visibility';
  
  /// Read receipts enabled
  static const String readReceiptsEnabled = 'read_receipts_enabled';
  
  /// Typing indicators enabled
  static const String typingIndicatorsEnabled = 'typing_indicators_enabled';

  // ============================================================================
  // CACHE
  // ============================================================================
  
  /// Last sync timestamp
  static const String lastSyncTime = 'last_sync_time';
  
  /// Cached conversations (JSON string)
  static const String cachedConversations = 'cached_conversations';
  
  /// Cached friends list (JSON string)
  static const String cachedFriends = 'cached_friends';
  
  /// Cached messages prefix (appended with conversationId)
  static const String cachedMessagesPrefix = 'cached_messages_';

  // ============================================================================
  // FCM / PUSH NOTIFICATIONS
  // ============================================================================
  
  /// FCM device token
  static const String fcmToken = 'fcm_token';
  
  /// Push notifications permission granted
  static const String pushNotificationsGranted = 'push_notifications_granted';

  // ============================================================================
  // BIOMETRIC AUTH
  // ============================================================================
  
  /// Biometric authentication enabled
  static const String biometricEnabled = 'biometric_enabled';
  
  /// Biometric type (fingerprint, face, etc.)
  static const String biometricType = 'biometric_type';
}
