part of 'auth_bloc.dart';

/// Authentication events
abstract class AuthEvent extends BaseEvent {
  const AuthEvent();
}

/// Event to check authentication status on app start
class CheckAuthStatusEvent extends AuthEvent {
  const CheckAuthStatusEvent();
}

/// Event to login
class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  const LoginEvent({
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [email, password];
}

/// Event to login with Google OAuth
class LoginWithGoogleEvent extends AuthEvent {
  const LoginWithGoogleEvent();
}

/// Event to register
class RegisterEvent extends AuthEvent {
  final String name;
  final String email;
  final String password;

  const RegisterEvent({
    required this.name,
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [name, email, password];
}

/// Event to logout
class LogoutEvent extends AuthEvent {
  const LogoutEvent();
}

/// Event to update user profile
class UpdateProfileEvent extends AuthEvent {
  final Map<String, dynamic> profileData;

  const UpdateProfileEvent(this.profileData);

  @override
  List<Object?> get props => [profileData];
}

/// Event to refresh authentication token
class RefreshTokenEvent extends AuthEvent {
  const RefreshTokenEvent();
}
