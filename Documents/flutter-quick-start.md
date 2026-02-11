# VibeSync Flutter - Quick Start Guide

**Last Updated:** February 10, 2026

This guide will help you get started with the VibeSync Flutter mobile app development.

---

## Prerequisites

### Required Software
- **Flutter SDK:** 3.16.0 or higher
- **Dart SDK:** 3.2.0 or higher (comes with Flutter)
- **Android Studio:** Latest version with Android SDK
- **Xcode:** Latest version (macOS only, for iOS development)
- **VS Code or Android Studio:** With Flutter/Dart plugins
- **Git:** For version control

### Verify Installation
```bash
# Check Flutter installation
flutter doctor

# Expected output should show:
# ✓ Flutter (Channel stable, 3.x.x)
# ✓ Android toolchain
# ✓ Xcode (macOS only)
# ✓ VS Code or Android Studio
```

---

## Project Setup

### 1. Create Flutter Project

```bash
# Navigate to the vibesync directory
cd /home/wot-bhavin/Documents/learning/vibesync

# Create new Flutter project
flutter create vibesync_mobile

# Navigate to project
cd vibesync_mobile
```

### 2. Configure Project Structure

Create the following folder structure:

```
lib/
├── core/
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
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── friends/
│   ├── chat/
│   ├── status/
│   ├── calls/
│   └── settings/
├── shared/
│   ├── widgets/
│   ├── models/
│   └── services/
└── main.dart
```

### 3. Update pubspec.yaml

Replace the dependencies section in `pubspec.yaml`:

```yaml
name: vibesync_mobile
description: VibeSync mobile application built with Flutter
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5
  
  # Navigation
  go_router: ^13.0.0
  
  # Network
  dio: ^5.4.0
  socket_io_client: ^2.0.3
  connectivity_plus: ^5.0.2
  
  # Storage
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0
  
  # JSON
  json_annotation: ^4.8.1
  
  # UI
  google_fonts: ^6.1.0
  cached_network_image: ^3.3.1
  flutter_svg: ^2.0.9
  
  # Utilities
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.8
  json_serializable: ^6.7.1

flutter:
  uses-material-design: true
```

### 4. Install Dependencies

```bash
flutter pub get
```

---

## Initial Configuration

### 1. Configure Android

Edit `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.vibesync.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    
    <application
        android:label="VibeSync"
        android:icon="@mipmap/ic_launcher">
        <!-- ... -->
    </application>
</manifest>
```

### 2. Configure iOS

Edit `ios/Runner/Info.plist`:

```xml
<dict>
    <!-- ... existing keys ... -->
    
    <!-- Permissions -->
    <key>NSCameraUsageDescription</key>
    <string>VibeSync needs camera access to scan QR codes and make video calls</string>
    
    <key>NSMicrophoneUsageDescription</key>
    <string>VibeSync needs microphone access for voice and video calls</string>
    
    <key>NSPhotoLibraryUsageDescription</key>
    <string>VibeSync needs photo library access to share images</string>
    
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>VibeSync needs permission to save photos</string>
</dict>
```

---

## Create Core Files

### 1. Design Tokens (`lib/core/theme/design_tokens.dart`)

```dart
import 'package:flutter/material.dart';

class DesignTokens {
  // Colors - Primary
  static const Color primaryPurple = Color(0xFF8B5CF6); // hsl(262, 83%, 58%)
  static const Color primaryPurpleDark = Color(0xFF7C3AED);
  
  // Colors - Secondary
  static const Color secondaryBlue = Color(0xFF38BDF8); // hsl(198, 93%, 60%)
  static const Color accentPink = Color(0xFFF472B6); // hsl(330, 85%, 65%)
  
  // Colors - Semantic
  static const Color success = Color(0xFF22C55E);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  
  // Spacing
  static const double space4 = 4.0;
  static const double space8 = 8.0;
  static const double space12 = 12.0;
  static const double space16 = 16.0;
  static const double space24 = 24.0;
  static const double space32 = 32.0;
  static const double space48 = 48.0;
  static const double space64 = 64.0;
  
  // Border Radius
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 12.0;
  static const double radiusLarge = 16.0;
  static const double radiusFull = 9999.0;
  
  // Typography
  static const String fontFamily = 'Outfit';
}
```

### 2. API Constants (`lib/core/constants/api_constants.dart`)

```dart
class ApiConstants {
  // TODO: Update with your actual backend URL
  static const String baseUrl = 'http://localhost:3000/api/v1';
  static const String socketUrl = 'http://localhost:3000';
  
  // Auth Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String refreshToken = '/auth/refresh';
  static const String googleAuth = '/auth/google';
  
  // User Endpoints
  static const String currentUser = '/users/me';
  static const String updateUser = '/users/me';
  
  // Friend Endpoints
  static const String friends = '/friends';
  static const String friendRequests = '/friends/requests';
  static const String sendFriendRequest = '/friends/request';
  
  // Conversation Endpoints
  static const String conversations = '/conversations';
  
  // Message Endpoints
  static const String messages = '/messages';
  
  // Status Endpoints
  static const String status = '/status';
  
  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
```

### 3. Main App (`lib/main.dart`)

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme/design_tokens.dart';

void main() {
  runApp(const VibeSyncApp());
}

class VibeSyncApp extends StatelessWidget {
  const VibeSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
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
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble_outline,
              size: 80,
              color: DesignTokens.primaryPurple,
            ),
            const SizedBox(height: 24),
            Text(
              'VibeSync',
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: DesignTokens.primaryPurple,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Stay connected, stay in sync',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## Running the App

### Run on Android Emulator

```bash
# List available devices
flutter devices

# Run on Android emulator
flutter run
```

### Run on iOS Simulator (macOS only)

```bash
# Open iOS simulator
open -a Simulator

# Run on iOS simulator
flutter run
```

### Run on Physical Device

```bash
# Connect device via USB and enable USB debugging

# Run on connected device
flutter run
```

### Hot Reload

While the app is running:
- Press `r` to hot reload
- Press `R` to hot restart
- Press `q` to quit

---

## Development Workflow

### 1. Create a Feature

```bash
# Example: Create auth feature structure
mkdir -p lib/features/auth/{data,domain,presentation}
mkdir -p lib/features/auth/data/{models,repositories,datasources}
mkdir -p lib/features/auth/domain/{entities,repositories,usecases}
mkdir -p lib/features/auth/presentation/{bloc,pages,widgets}
```

### 2. Generate Code (for JSON serialization)

```bash
# Watch for changes and auto-generate
flutter pub run build_runner watch --delete-conflicting-outputs

# Or one-time generation
flutter pub run build_runner build --delete-conflicting-outputs
```

### 3. Run Tests

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/features/auth/auth_test.dart

# Run with coverage
flutter test --coverage
```

### 4. Analyze Code

```bash
# Run static analysis
flutter analyze

# Format code
flutter format lib/
```

---

## Backend Integration

### 1. Update API Base URL

Edit `lib/core/constants/api_constants.dart`:

```dart
// For local development
static const String baseUrl = 'http://10.0.2.2:3000/api/v1'; // Android emulator
// OR
static const String baseUrl = 'http://localhost:3000/api/v1'; // iOS simulator

// For production
static const String baseUrl = 'https://api.vibesync.com/api/v1';
```

### 2. Test API Connection

Create a simple test in your app to verify backend connectivity:

```dart
// lib/core/network/api_client.dart
import 'package:dio/dio.dart';
import '../constants/api_constants.dart';

class ApiClient {
  late final Dio _dio;
  
  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: ApiConstants.connectTimeout,
      receiveTimeout: ApiConstants.receiveTimeout,
    ));
  }
  
  Future<void> testConnection() async {
    try {
      final response = await _dio.get('/health'); // Adjust endpoint
      print('Backend connected: ${response.statusCode}');
    } catch (e) {
      print('Backend connection failed: $e');
    }
  }
}
```

---

## Common Commands

```bash
# Create new Flutter project
flutter create project_name

# Get dependencies
flutter pub get

# Update dependencies
flutter pub upgrade

# Run app
flutter run

# Build APK (Android)
flutter build apk --release

# Build App Bundle (Android)
flutter build appbundle --release

# Build iOS
flutter build ios --release

# Clean build
flutter clean

# Doctor (check setup)
flutter doctor

# List devices
flutter devices

# Install app on device
flutter install

# View logs
flutter logs
```

---

## Debugging Tips

### Enable Debug Mode

```dart
// In main.dart
void main() {
  // Enable debug logging
  debugPrint('App started');
  
  runApp(const VibeSyncApp());
}
```

### Use Flutter DevTools

```bash
# Run app in debug mode
flutter run

# Open DevTools in browser (URL will be shown in terminal)
```

### Common Issues

**Issue:** "Gradle build failed"
```bash
# Solution:
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter run
```

**Issue:** "CocoaPods not installed" (iOS)
```bash
# Solution:
sudo gem install cocoapods
cd ios
pod install
cd ..
flutter run
```

**Issue:** "Unable to connect to backend"
```bash
# For Android emulator, use:
# 10.0.2.2 instead of localhost

# For iOS simulator, use:
# localhost works fine
```

---

## Next Steps

1. ✅ Complete project setup (this guide)
2. 📋 Implement design system (themes, colors, typography)
3. 📋 Create reusable UI components (buttons, inputs, etc.)
4. 📋 Setup state management (BLoC/Provider)
5. 📋 Implement authentication flow
6. 📋 Build core features (messaging, friends, status)
7. 📋 Integrate with backend APIs
8. 📋 Add real-time functionality (WebSocket)
9. 📋 Implement calls (WebRTC)
10. 📋 Test and polish

---

## Resources

### Official Documentation
- [Flutter Docs](https://docs.flutter.dev/)
- [Dart Docs](https://dart.dev/guides)
- [Material Design 3](https://m3.material.io/)

### Packages Documentation
- [flutter_bloc](https://pub.dev/packages/flutter_bloc)
- [dio](https://pub.dev/packages/dio)
- [go_router](https://pub.dev/packages/go_router)
- [socket_io_client](https://pub.dev/packages/socket_io_client)

### Learning Resources
- [Flutter Cookbook](https://docs.flutter.dev/cookbook)
- [Flutter Samples](https://flutter.github.io/samples/)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)

### VibeSync Documentation
- [Main Todo](./todo.md)
- [Flutter Mobile Todo](./flutter-mobile-todo.md)
- [PRD](./vibesync-prd.md)
- [Tech Rules](./vibesync-tech-rules.md)

---

**Happy Coding! 🚀**

For questions or issues, refer to the main todo list or project documentation.
