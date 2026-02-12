import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/utils/base_event.dart';
import '../../../../core/utils/base_state.dart';
import '../../../../shared/services/local_storage_service.dart';
import '../../../../shared/services/secure_storage_service.dart';
import '../../../../shared/services/google_signin_service.dart';
import '../../../../core/constants/storage_keys.dart';

part 'auth_event.dart';
part 'auth_state.dart';

/// BLoC for managing authentication state
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final ApiClient apiClient;
  final SecureStorageService secureStorage;
  final LocalStorageService localStorage;

  AuthBloc({
    required this.apiClient,
    required this.secureStorage,
    required this.localStorage,
  }) : super(const AuthInitial()) {
    on<CheckAuthStatusEvent>(_onCheckAuthStatus);
    on<LoginEvent>(_onLogin);
    on<LoginWithGoogleEvent>(_onLoginWithGoogle);
    on<RegisterEvent>(_onRegister);
    on<LogoutEvent>(_onLogout);
    on<UpdateProfileEvent>(_onUpdateProfile);
    on<RefreshTokenEvent>(_onRefreshToken);
  }

  /// Check if user is authenticated on app start
  Future<void> _onCheckAuthStatus(
    CheckAuthStatusEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading(message: 'Checking authentication...'));

      // Check if we have a stored token
      final token = await secureStorage.getAccessToken();
      final refreshToken = await secureStorage.getRefreshToken();
      
      if (token == null || token.isEmpty) {
        emit(const Unauthenticated(message: 'No authentication token found'));
        return;
      }

      // Set token in API client
      apiClient.setAuthToken(token);

      // Try to fetch user profile to verify token is valid
      final response = await apiClient.get('/users/me');
      
      if (response.statusCode == 200) {
        final user = response.data['user'] ?? response.data;
        
        // Save user data to local storage
        await _saveUserData(user, token, refreshToken: refreshToken);
        
        emit(Authenticated(user: user, token: token));
      } else {
        // Token is invalid, clear it
        await _clearAuthData();
        emit(const Unauthenticated(message: 'Invalid authentication token'));
      }
    } on ApiException catch (e) {
      if (e.isUnauthorized) {
        await _clearAuthData();
        emit(const Unauthenticated(message: 'Session expired'));
      } else {
        emit(AuthError(message: e.message, error: e));
      }
    } catch (e) {
      emit(AuthError(message: 'Failed to check authentication', error: e));
    }
  }

  /// Handle login
  Future<void> _onLogin(
    LoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading(message: 'Logging in...'));

      final response = await apiClient.post(
        '/auth/login',
        data: {
          'email': event.email,
          'password': event.password,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final token = data['token'] ?? data['accessToken'];
        final user = data['user'];
        final refreshToken = data['refreshToken'];

        if (token == null || user == null) {
          emit(const AuthError(message: 'Login failed: Invalid server response'));
          return;
        }

        // Save authentication data
        await _saveUserData(user, token, refreshToken: refreshToken);
        
        // Set token in API client
        apiClient.setAuthToken(token);

        emit(Authenticated(user: user, token: token));
      } else {
        emit(AuthError(
          message: response.data['message'] ?? 'Login failed',
        ));
      }
    } on ApiException catch (e) {
      emit(AuthError(message: e.message, error: e));
    } catch (e) {
      emit(AuthError(message: 'Login failed', error: e));
    }
  }

  /// Handle Google OAuth login
  Future<void> _onLoginWithGoogle(
    LoginWithGoogleEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading(message: 'Logging in with Google...'));

      // Get Google Sign-In service instance
      final googleSignInService = GoogleSignInService();
      
      // Initialize Google Sign-In
      googleSignInService.initialize();
      
      // Sign in with Google and get ID token
      final idToken = await googleSignInService.signIn();
      
      if (idToken == null) {
        // User cancelled the sign-in
        emit(const Unauthenticated(message: 'Google Sign-In cancelled'));
        return;
      }

      // Send ID token to backend
      final response = await apiClient.post(
        '/auth/google/signin',
        data: {
          'idToken': idToken,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data['data'];
        final token = data['tokens']['accessToken'];
        final user = data['user'];
        final refreshToken = data['tokens']['refreshToken'];

        if (token == null || user == null) {
          emit(const AuthError(message: 'Google Sign-In failed: Invalid server response'));
          return;
        }

        // Save authentication data
        await _saveUserData(user, token, refreshToken: refreshToken);
        
        // Set token in API client
        apiClient.setAuthToken(token);

        emit(Authenticated(user: user, token: token));
      } else {
        emit(AuthError(
          message: response.data['error']?['message'] ?? 'Google Sign-In failed',
        ));
      }
    } on ApiException catch (e) {
      emit(AuthError(message: e.message, error: e));
    } catch (e) {
      emit(AuthError(message: 'Google Sign-In failed: ${e.toString()}', error: e));
    }
  }

  /// Handle registration
  Future<void> _onRegister(
    RegisterEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading(message: 'Creating account...'));

      final response = await apiClient.post(
        '/auth/register',
        data: {
          'name': event.name,
          'email': event.email,
          'password': event.password,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data;
        final token = data['token'] ?? data['accessToken'];
        final user = data['user'];
        final refreshToken = data['refreshToken'];

        if (token == null || user == null) {
          emit(const AuthError(message: 'Registration failed: Invalid server response'));
          return;
        }

        // Save authentication data
        await _saveUserData(user, token, refreshToken: refreshToken);
        
        // Set token in API client
        apiClient.setAuthToken(token);

        emit(Authenticated(user: user, token: token));
      } else {
        emit(AuthError(
          message: response.data['message'] ?? 'Registration failed',
        ));
      }
    } on ApiException catch (e) {
      emit(AuthError(message: e.message, error: e));
    } catch (e) {
      emit(AuthError(message: 'Registration failed', error: e));
    }
  }

  /// Handle logout
  Future<void> _onLogout(
    LogoutEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading(message: 'Logging out...'));

      // Call logout API (optional, backend might not require it)
      try {
        await apiClient.post('/auth/logout');
      } catch (e) {
        // Ignore logout API errors, still clear local data
      }

      // Clear all authentication data
      await _clearAuthData();
      
      // Clear API client token
      apiClient.clearAuthToken();

      emit(const Unauthenticated(message: 'Logged out successfully'));
    } catch (e) {
      emit(AuthError(message: 'Logout failed', error: e));
    }
  }

  /// Handle profile update
  Future<void> _onUpdateProfile(
    UpdateProfileEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(const AuthLoading(message: 'Updating profile...'));

      final response = await apiClient.put(
        '/users/me',
        data: event.profileData,
      );

      if (response.statusCode == 200) {
        final user = response.data['user'] ?? response.data;
        
        // Update user data in local storage
        final token = await secureStorage.getAccessToken();
        final refreshToken = await secureStorage.getRefreshToken();
        if (token != null) {
          await _saveUserData(user, token, refreshToken: refreshToken);
        }

        emit(ProfileUpdated(user: user));
        
        // Transition back to authenticated state
        if (token != null) {
          emit(Authenticated(user: user, token: token));
        }
      } else {
        emit(AuthError(
          message: response.data['message'] ?? 'Profile update failed',
        ));
      }
    } on ApiException catch (e) {
      emit(AuthError(message: e.message, error: e));
    } catch (e) {
      emit(AuthError(message: 'Profile update failed', error: e));
    }
  }

  /// Handle token refresh
  Future<void> _onRefreshToken(
    RefreshTokenEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      final refreshToken = await secureStorage.getRefreshToken();
      
      if (refreshToken == null) {
        await _clearAuthData();
        emit(const Unauthenticated(message: 'No refresh token found'));
        return;
      }

      final response = await apiClient.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final newToken = data['token'] ?? data['accessToken'];
        final user = data['user'];

        // Save new token
        await secureStorage.saveTokens(
          accessToken: newToken,
          refreshToken: data['refreshToken'] ?? refreshToken,
        );
        
        // Set new token in API client
        apiClient.setAuthToken(newToken);

        emit(Authenticated(user: user, token: newToken));
      } else {
        await _clearAuthData();
        emit(const Unauthenticated(message: 'Token refresh failed'));
      }
    } on ApiException catch (e) {
      await _clearAuthData();
      emit(AuthError(message: e.message, error: e));
    } catch (e) {
      emit(AuthError(message: 'Token refresh failed', error: e));
    }
  }

  /// Save user data to storage
  Future<void> _saveUserData(Map<String, dynamic> user, String token, {String? refreshToken}) async {
    // Save to secure storage
    await secureStorage.saveTokens(accessToken: token, refreshToken: refreshToken);
    
    // Save to local storage
    await localStorage.setBool(StorageKeys.isLoggedIn, true);
    await localStorage.setString(
      StorageKeys.userId,
      user['id'] ?? user['_id'] ?? '',
    );
    await localStorage.setString(
      StorageKeys.userName,
      user['name'] ?? '',
    );
    await localStorage.setString(
      StorageKeys.userEmail,
      user['email'] ?? '',
    );
    
    if (user['avatar'] != null) {
      await localStorage.setString(StorageKeys.userAvatar, user['avatar']);
    }
    
    if (user['friendCode'] != null) {
      await localStorage.setString(
        StorageKeys.userFriendCode,
        user['friendCode'],
      );
    }
  }

  /// Clear all authentication data
  Future<void> _clearAuthData() async {
    await secureStorage.deleteTokens();
    await localStorage.remove(StorageKeys.isLoggedIn);
    await localStorage.remove(StorageKeys.userId);
    await localStorage.remove(StorageKeys.userName);
    await localStorage.remove(StorageKeys.userEmail);
    await localStorage.remove(StorageKeys.userAvatar);
    await localStorage.remove(StorageKeys.userFriendCode);
    
    // Clear API client token
    apiClient.clearAuthToken();
  }
}
