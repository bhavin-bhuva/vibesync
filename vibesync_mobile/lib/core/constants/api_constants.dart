/// API constants for VibeSync backend integration
class ApiConstants {
  // Private constructor to prevent instantiation
  ApiConstants._();

  // ============================================================================
  // BASE URLS
  // ============================================================================
  
  /// Base URL for API endpoints
  /// For Android emulator, use 10.0.2.2 instead of localhost
  /// For iOS simulator, use localhost
  /// For production, use actual domain
  static const String baseUrl = 'http://10.0.2.2:3000/api/v1';
  
  /// WebSocket URL for real-time communication
  static const String socketUrl = 'http://10.0.2.2:3000';
  
  /// Production base URL (to be updated)
  static const String productionBaseUrl = 'https://api.vibesync.com/api/v1';
  
  /// Production WebSocket URL (to be updated)
  static const String productionSocketUrl = 'https://api.vibesync.com';

  // ============================================================================
  // AUTH ENDPOINTS
  // ============================================================================
  
  /// User login endpoint
  static const String login = '/auth/login';
  
  /// User registration endpoint
  static const String register = '/auth/register';
  
  /// Token refresh endpoint
  static const String refreshToken = '/auth/refresh';
  
  /// Logout endpoint
  static const String logout = '/auth/logout';
  
  /// Google OAuth endpoint
  static const String googleAuth = '/auth/google';

  // ============================================================================
  // USER ENDPOINTS
  // ============================================================================
  
  /// Get current user endpoint
  static const String currentUser = '/users/me';
  
  /// Update user endpoint
  static const String updateUser = '/users/me';
  
  /// Get user by ID endpoint
  static String getUserById(String id) => '/users/$id';
  
  /// Get user by friend code endpoint
  static String getUserByFriendCode(String code) => '/users/by-code/$code';
  
  /// Upload avatar endpoint
  static const String uploadAvatar = '/users/me/avatar';

  // ============================================================================
  // FRIEND ENDPOINTS
  // ============================================================================
  
  /// Get friends list endpoint
  static const String friends = '/friends';
  
  /// Send friend request endpoint
  static const String sendFriendRequest = '/friends/request';
  
  /// Get friend requests endpoint
  static const String friendRequests = '/friends/requests';
  
  /// Accept friend request endpoint
  static String acceptFriendRequest(String id) => '/friends/request/$id/accept';
  
  /// Decline friend request endpoint
  static String declineFriendRequest(String id) => '/friends/request/$id/decline';
  
  /// Remove friend endpoint
  static String removeFriend(String id) => '/friends/$id';
  
  /// Block user endpoint
  static String blockUser(String id) => '/friends/block/$id';

  // ============================================================================
  // CONVERSATION ENDPOINTS
  // ============================================================================
  
  /// Get all conversations endpoint
  static const String conversations = '/conversations';
  
  /// Get conversation by ID endpoint
  static String getConversation(String id) => '/conversations/$id';
  
  /// Create conversation endpoint
  static const String createConversation = '/conversations';
  
  /// Get messages for conversation endpoint
  static String getMessages(String conversationId) => 
      '/conversations/$conversationId/messages';
  
  /// Mark conversation as read endpoint
  static String markConversationRead(String id) => '/conversations/$id/read';
  
  /// Delete conversation endpoint
  static String deleteConversation(String id) => '/conversations/$id';

  // ============================================================================
  // MESSAGE ENDPOINTS
  // ============================================================================
  
  /// Send message endpoint
  static const String sendMessage = '/messages';
  
  /// Mark message as read endpoint
  static String markMessageRead(String id) => '/messages/$id/read';
  
  /// Delete message endpoint
  static String deleteMessage(String id) => '/messages/$id';
  
  /// Upload media endpoint
  static const String uploadMedia = '/messages/media';
  
  /// Search messages endpoint
  static const String searchMessages = '/messages/search';

  // ============================================================================
  // STATUS ENDPOINTS
  // ============================================================================
  
  /// Get all status updates endpoint
  static const String status = '/status';
  
  /// Create status endpoint
  static const String createStatus = '/status';
  
  /// Mark status as viewed endpoint
  static String markStatusViewed(String id) => '/status/$id/view';
  
  /// Delete status endpoint
  static String deleteStatus(String id) => '/status/$id';
  
  /// Get status viewers endpoint
  static String getStatusViewers(String id) => '/status/$id/views';

  // ============================================================================
  // CALL ENDPOINTS (Future)
  // ============================================================================
  
  /// Initiate call endpoint
  static const String initiateCall = '/calls/initiate';
  
  /// Get call history endpoint
  static const String callHistory = '/calls/history';

  // ============================================================================
  // TIMEOUT SETTINGS
  // ============================================================================
  
  /// Connection timeout duration
  static const Duration connectTimeout = Duration(seconds: 30);
  
  /// Receive timeout duration
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  /// Send timeout duration
  static const Duration sendTimeout = Duration(seconds: 30);

  // ============================================================================
  // HEADERS
  // ============================================================================
  
  /// Content-Type header key
  static const String contentTypeHeader = 'Content-Type';
  
  /// Authorization header key
  static const String authorizationHeader = 'Authorization';
  
  /// Accept header key
  static const String acceptHeader = 'Accept';
  
  /// Application JSON content type
  static const String applicationJson = 'application/json';
  
  /// Multipart form data content type
  static const String multipartFormData = 'multipart/form-data';

  // ============================================================================
  // SOCKET EVENTS
  // ============================================================================
  
  /// Socket connection event
  static const String socketConnect = 'connect';
  
  /// Socket disconnection event
  static const String socketDisconnect = 'disconnect';
  
  /// Socket error event
  static const String socketError = 'error';
  
  /// New message event
  static const String messageNew = 'message:new';
  
  /// Send message event
  static const String messageSend = 'message:send';
  
  /// Message read event
  static const String messageRead = 'message:read';
  
  /// Typing start event
  static const String typingStart = 'typing:start';
  
  /// Typing stop event
  static const String typingStop = 'typing:stop';
  
  /// User online event
  static const String userOnline = 'user:online';
  
  /// User offline event
  static const String userOffline = 'user:offline';
  
  /// Call initiate event
  static const String callInitiate = 'call:initiate';
  
  /// Call accept event
  static const String callAccept = 'call:accept';
  
  /// Call reject event
  static const String callReject = 'call:reject';
  
  /// Call end event
  static const String callEnd = 'call:end';

  // ============================================================================
  // PAGINATION
  // ============================================================================
  
  /// Default page size for pagination
  static const int defaultPageSize = 20;
  
  /// Maximum page size
  static const int maxPageSize = 100;

  // ============================================================================
  // FILE UPLOAD LIMITS
  // ============================================================================
  
  /// Maximum image file size (10 MB)
  static const int maxImageSize = 10 * 1024 * 1024;
  
  /// Maximum video file size (50 MB)
  static const int maxVideoSize = 50 * 1024 * 1024;
  
  /// Maximum file size (20 MB)
  static const int maxFileSize = 20 * 1024 * 1024;
}
