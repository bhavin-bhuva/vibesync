part of 'auth_bloc.dart';

/// Authentication states
abstract class AuthState extends BaseState {
  const AuthState();
}

/// Initial state - checking authentication
class AuthInitial extends AuthState {
  const AuthInitial();
}

/// Loading state - authentication operation in progress
class AuthLoading extends AuthState {
  final String? message;

  const AuthLoading({this.message});

  @override
  List<Object?> get props => [message];
}

/// Authenticated state - user is logged in
class Authenticated extends AuthState {
  final Map<String, dynamic> user;
  final String token;

  const Authenticated({
    required this.user,
    required this.token,
  });

  @override
  List<Object?> get props => [user, token];

  /// Get user ID
  String get userId => user['id'] ?? user['_id'] ?? '';

  /// Get user name
  String get userName => user['name'] ?? '';

  /// Get user email
  String get userEmail => user['email'] ?? '';

  /// Get user avatar
  String? get userAvatar => user['avatar'];

  /// Get user friend code
  String? get friendCode => user['friendCode'];
}

/// Unauthenticated state - user is not logged in
class Unauthenticated extends AuthState {
  final String? message;

  const Unauthenticated({this.message});

  @override
  List<Object?> get props => [message];
}

/// Authentication error state
class AuthError extends AuthState {
  final String message;
  final dynamic error;

  const AuthError({
    required this.message,
    this.error,
  });

  @override
  List<Object?> get props => [message, error];
}

/// Profile updated state
class ProfileUpdated extends AuthState {
  final Map<String, dynamic> user;

  const ProfileUpdated({required this.user});

  @override
  List<Object?> get props => [user];
}
