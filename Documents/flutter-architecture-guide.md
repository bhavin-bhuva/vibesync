# VibeSync Flutter - Architecture Guide

**Last Updated:** February 10, 2026  
**Architecture Pattern:** Clean Architecture + BLoC

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layer Responsibilities](#layer-responsibilities)
3. [Folder Structure](#folder-structure)
4. [State Management](#state-management)
5. [Data Flow](#data-flow)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)

---

## Architecture Overview

VibeSync Flutter follows **Clean Architecture** principles combined with **BLoC** (Business Logic Component) pattern for state management.

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer (UI)                │
│  - Pages, Widgets, BLoC (State Management)      │
└─────────────────────────────────────────────────┘
                      ↓ ↑
┌─────────────────────────────────────────────────┐
│            Domain Layer (Business Logic)         │
│  - Entities, Use Cases, Repository Interfaces   │
└─────────────────────────────────────────────────┘
                      ↓ ↑
┌─────────────────────────────────────────────────┐
│              Data Layer (Data)                   │
│  - Models, Repositories, Data Sources (API)     │
└─────────────────────────────────────────────────┘
```

### Why Clean Architecture?

- ✅ **Separation of Concerns:** Each layer has a single responsibility
- ✅ **Testability:** Easy to unit test each layer independently
- ✅ **Maintainability:** Changes in one layer don't affect others
- ✅ **Scalability:** Easy to add new features
- ✅ **Independence:** Business logic is independent of UI and frameworks

---

## Layer Responsibilities

### 1. Presentation Layer

**Responsibility:** Display UI and handle user interactions

**Components:**
- **Pages:** Full-screen views (e.g., `LoginPage`, `ChatPage`)
- **Widgets:** Reusable UI components (e.g., `MessageBubble`, `CustomButton`)
- **BLoC:** State management and business logic coordination

**Rules:**
- ❌ No direct API calls
- ❌ No business logic
- ✅ Only UI and user interaction handling
- ✅ Communicate with domain layer through BLoC

### 2. Domain Layer

**Responsibility:** Contains business logic and rules

**Components:**
- **Entities:** Core business objects (e.g., `User`, `Message`)
- **Use Cases:** Single-purpose business operations (e.g., `SendMessage`, `LoginUser`)
- **Repository Interfaces:** Contracts for data access

**Rules:**
- ❌ No Flutter/UI dependencies
- ❌ No external library dependencies (except Dart core)
- ✅ Pure Dart code
- ✅ Contains all business rules

### 3. Data Layer

**Responsibility:** Data access and external communication

**Components:**
- **Models:** Data transfer objects with JSON serialization
- **Repositories:** Implementation of domain repository interfaces
- **Data Sources:** API clients, local storage, WebSocket

**Rules:**
- ❌ No business logic
- ✅ Handle data transformation (Model ↔ Entity)
- ✅ Communicate with external services
- ✅ Cache and persist data

---

## Folder Structure

```
lib/
├── core/                           # Shared core functionality
│   ├── theme/
│   │   ├── design_tokens.dart
│   │   ├── light_theme.dart
│   │   ├── dark_theme.dart
│   │   └── theme_provider.dart
│   ├── constants/
│   │   ├── api_constants.dart
│   │   ├── app_constants.dart
│   │   └── storage_keys.dart
│   ├── utils/
│   │   ├── date_formatter.dart
│   │   ├── validators.dart
│   │   └── extensions.dart
│   ├── errors/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   └── network/
│       ├── api_client.dart
│       ├── socket_service.dart
│       └── network_info.dart
│
├── features/                       # Feature modules
│   ├── auth/                       # Authentication feature
│   │   ├── data/
│   │   │   ├── models/
│   │   │   │   ├── user_model.dart
│   │   │   │   └── login_response_model.dart
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository_impl.dart
│   │   │   └── datasources/
│   │   │       ├── auth_remote_datasource.dart
│   │   │       └── auth_local_datasource.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.dart
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository.dart
│   │   │   └── usecases/
│   │   │       ├── login_user.dart
│   │   │       ├── register_user.dart
│   │   │       └── logout_user.dart
│   │   └── presentation/
│   │       ├── bloc/
│   │       │   ├── auth_bloc.dart
│   │       │   ├── auth_event.dart
│   │       │   └── auth_state.dart
│   │       ├── pages/
│   │       │   ├── login_page.dart
│   │       │   └── register_page.dart
│   │       └── widgets/
│   │           ├── login_form.dart
│   │           └── social_auth_buttons.dart
│   │
│   ├── chat/                       # Messaging feature
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   ├── friends/                    # Friend management
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   ├── status/                     # Status feature
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   └── settings/                   # Settings
│       ├── data/
│       ├── domain/
│       └── presentation/
│
├── shared/                         # Shared across features
│   ├── widgets/
│   │   ├── custom_button.dart
│   │   ├── custom_input.dart
│   │   ├── avatar.dart
│   │   ├── loading_indicator.dart
│   │   └── error_widget.dart
│   ├── models/
│   └── services/
│
├── injection_container.dart        # Dependency injection setup
└── main.dart                       # App entry point
```

---

## State Management

### BLoC Pattern

**Why BLoC?**
- ✅ Clear separation of business logic and UI
- ✅ Testable
- ✅ Reactive programming with streams
- ✅ Recommended by Flutter team

### BLoC Components

```
┌──────────────┐
│    Event     │  ← User actions (e.g., LoginButtonPressed)
└──────────────┘
       ↓
┌──────────────┐
│     BLoC     │  ← Business logic coordinator
└──────────────┘
       ↓
┌──────────────┐
│    State     │  → UI updates based on state
└──────────────┘
```

### Example: Auth BLoC

**Events** (`auth_event.dart`):
```dart
abstract class AuthEvent extends Equatable {
  const AuthEvent();
  
  @override
  List<Object?> get props => [];
}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;
  
  const LoginRequested({required this.email, required this.password});
  
  @override
  List<Object?> get props => [email, password];
}

class LogoutRequested extends AuthEvent {}

class AuthStatusChecked extends AuthEvent {}
```

**States** (`auth_state.dart`):
```dart
abstract class AuthState extends Equatable {
  const AuthState();
  
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class Authenticated extends AuthState {
  final User user;
  
  const Authenticated({required this.user});
  
  @override
  List<Object?> get props => [user];
}

class Unauthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;
  
  const AuthError({required this.message});
  
  @override
  List<Object?> get props => [message];
}
```

**BLoC** (`auth_bloc.dart`):
```dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUser loginUser;
  final LogoutUser logoutUser;
  
  AuthBloc({
    required this.loginUser,
    required this.logoutUser,
  }) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<AuthStatusChecked>(_onAuthStatusChecked);
  }
  
  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    final result = await loginUser(
      LoginParams(email: event.email, password: event.password),
    );
    
    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (user) => emit(Authenticated(user: user)),
    );
  }
  
  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await logoutUser(NoParams());
    emit(Unauthenticated());
  }
  
  Future<void> _onAuthStatusChecked(
    AuthStatusChecked event,
    Emitter<AuthState> emit,
  ) async {
    // Check if user is logged in
    // Emit Authenticated or Unauthenticated
  }
}
```

---

## Data Flow

### Complete Data Flow Example: Login

```
1. User taps Login Button
   ↓
2. LoginPage dispatches LoginRequested event to AuthBloc
   ↓
3. AuthBloc calls LoginUser use case
   ↓
4. LoginUser use case calls AuthRepository.login()
   ↓
5. AuthRepositoryImpl calls AuthRemoteDataSource.login()
   ↓
6. AuthRemoteDataSource makes API call via ApiClient
   ↓
7. API returns response
   ↓
8. AuthRemoteDataSource converts response to UserModel
   ↓
9. AuthRepositoryImpl converts UserModel to User entity
   ↓
10. LoginUser returns User to AuthBloc
    ↓
11. AuthBloc emits Authenticated state
    ↓
12. LoginPage rebuilds with new state
    ↓
13. User is navigated to Home screen
```

---

## Code Examples

### 1. Entity (Domain Layer)

```dart
// lib/features/auth/domain/entities/user.dart

import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String name;
  final String email;
  final String? avatar;
  final String friendCode;
  final bool online;
  
  const User({
    required this.id,
    required this.name,
    required this.email,
    this.avatar,
    required this.friendCode,
    required this.online,
  });
  
  @override
  List<Object?> get props => [id, name, email, avatar, friendCode, online];
}
```

### 2. Model (Data Layer)

```dart
// lib/features/auth/data/models/user_model.dart

import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/user.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel extends User {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    super.avatar,
    required super.friendCode,
    required super.online,
  });
  
  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
  
  Map<String, dynamic> toJson() => _$UserModelToJson(this);
  
  factory UserModel.fromEntity(User user) {
    return UserModel(
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      friendCode: user.friendCode,
      online: user.online,
    );
  }
  
  User toEntity() {
    return User(
      id: id,
      name: name,
      email: email,
      avatar: avatar,
      friendCode: friendCode,
      online: online,
    );
  }
}
```

### 3. Repository Interface (Domain Layer)

```dart
// lib/features/auth/domain/repositories/auth_repository.dart

import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login({
    required String email,
    required String password,
  });
  
  Future<Either<Failure, User>> register({
    required String name,
    required String email,
    required String password,
  });
  
  Future<Either<Failure, void>> logout();
  
  Future<Either<Failure, User>> getCurrentUser();
}
```

### 4. Repository Implementation (Data Layer)

```dart
// lib/features/auth/data/repositories/auth_repository_impl.dart

import 'package:dartz/dartz.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import '../datasources/auth_local_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  
  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });
  
  @override
  Future<Either<Failure, User>> login({
    required String email,
    required String password,
  }) async {
    try {
      final userModel = await remoteDataSource.login(
        email: email,
        password: password,
      );
      
      // Save token locally
      await localDataSource.saveToken(userModel.token);
      
      return Right(userModel.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return Left(NetworkFailure());
    }
  }
  
  @override
  Future<Either<Failure, User>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final userModel = await remoteDataSource.register(
        name: name,
        email: email,
        password: password,
      );
      
      await localDataSource.saveToken(userModel.token);
      
      return Right(userModel.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    }
  }
  
  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await localDataSource.deleteToken();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure());
    }
  }
  
  @override
  Future<Either<Failure, User>> getCurrentUser() async {
    try {
      final token = await localDataSource.getToken();
      if (token == null) {
        return Left(CacheFailure());
      }
      
      final userModel = await remoteDataSource.getCurrentUser();
      return Right(userModel.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    }
  }
}
```

### 5. Use Case (Domain Layer)

```dart
// lib/features/auth/domain/usecases/login_user.dart

import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class LoginUser implements UseCase<User, LoginParams> {
  final AuthRepository repository;
  
  LoginUser(this.repository);
  
  @override
  Future<Either<Failure, User>> call(LoginParams params) async {
    return await repository.login(
      email: params.email,
      password: params.password,
    );
  }
}

class LoginParams extends Equatable {
  final String email;
  final String password;
  
  const LoginParams({required this.email, required this.password});
  
  @override
  List<Object?> get props => [email, password];
}
```

### 6. Page (Presentation Layer)

```dart
// lib/features/auth/presentation/pages/login_page.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/auth_bloc.dart';
import '../widgets/login_form.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is Authenticated) {
            // Navigate to home
            Navigator.pushReplacementNamed(context, '/home');
          } else if (state is AuthError) {
            // Show error
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          if (state is AuthLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          
          return const LoginForm();
        },
      ),
    );
  }
}
```

---

## Best Practices

### 1. Naming Conventions

```dart
// ✅ Good
class UserModel extends User {}
class AuthRepository {}
class LoginUser {}
class AuthBloc extends Bloc<AuthEvent, AuthState> {}

// ❌ Bad
class UserDTO {}
class AuthRepo {}
class Login {}
class AuthBLoC {}
```

### 2. File Organization

```dart
// ✅ Good - One class per file
// user.dart
class User {}

// user_model.dart
class UserModel {}

// ❌ Bad - Multiple classes in one file
// models.dart
class User {}
class Message {}
class Conversation {}
```

### 3. Dependency Injection

```dart
// ✅ Good - Use dependency injection
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUser loginUser;
  final LogoutUser logoutUser;
  
  AuthBloc({
    required this.loginUser,
    required this.logoutUser,
  }) : super(AuthInitial());
}

// ❌ Bad - Create dependencies inside class
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthInitial()) {
    final loginUser = LoginUser(AuthRepositoryImpl());
  }
}
```

### 4. Error Handling

```dart
// ✅ Good - Use Either for error handling
Future<Either<Failure, User>> login() async {
  try {
    final user = await api.login();
    return Right(user);
  } catch (e) {
    return Left(ServerFailure());
  }
}

// ❌ Bad - Throw exceptions
Future<User> login() async {
  final user = await api.login(); // Can throw
  return user;
}
```

### 5. Immutability

```dart
// ✅ Good - Immutable entities
class User extends Equatable {
  final String id;
  final String name;
  
  const User({required this.id, required this.name});
  
  User copyWith({String? id, String? name}) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
    );
  }
}

// ❌ Bad - Mutable entities
class User {
  String id;
  String name;
  
  User({required this.id, required this.name});
}
```

### 6. Testing

```dart
// ✅ Good - Test each layer independently

// Domain layer test (no dependencies)
test('should return User when login is successful', () async {
  final mockRepo = MockAuthRepository();
  final useCase = LoginUser(mockRepo);
  
  when(mockRepo.login(any, any)).thenAnswer((_) async => Right(tUser));
  
  final result = await useCase(LoginParams(email: 'test@test.com', password: 'pass'));
  
  expect(result, Right(tUser));
});

// BLoC test
blocTest<AuthBloc, AuthState>(
  'emits [AuthLoading, Authenticated] when login is successful',
  build: () => AuthBloc(loginUser: mockLoginUser),
  act: (bloc) => bloc.add(LoginRequested(email: 'test@test.com', password: 'pass')),
  expect: () => [AuthLoading(), Authenticated(user: tUser)],
);
```

---

## Summary

### Key Principles

1. **Separation of Concerns:** Each layer has a single responsibility
2. **Dependency Rule:** Dependencies point inward (Presentation → Domain ← Data)
3. **Testability:** Each layer can be tested independently
4. **Immutability:** Use immutable data structures
5. **Error Handling:** Use Either type for error handling
6. **Dependency Injection:** Inject dependencies, don't create them

### Benefits

- ✅ **Maintainable:** Easy to understand and modify
- ✅ **Testable:** Each layer can be tested independently
- ✅ **Scalable:** Easy to add new features
- ✅ **Flexible:** Easy to change implementations
- ✅ **Reusable:** Business logic is independent of UI

---

**For more details, refer to:**
- [Flutter Mobile Todo](./flutter-mobile-todo.md)
- [Flutter Quick Start](./flutter-quick-start.md)
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [BLoC Pattern](https://bloclibrary.dev/)
