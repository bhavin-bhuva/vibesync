# VibeSync - Flutter Mobile App Todo List

**Last Updated:** February 10, 2026, 18:20 IST  
**Status:** Phase 0 Complete ✅ | Phase 1 Ready to Start 🚀  
**Platform:** iOS & Android (Flutter)

> This todo list outlines the complete implementation plan for the VibeSync mobile application using Flutter. It references the existing [PRD](vibesync-prd.md), [Technical Rules](vibesync-tech-rules.md), and leverages the existing backend infrastructure.

---

## Legend

- ✅ **Completed**
- 🔄 **In Progress**
- 📋 **Planned**
- ⚠️ **Blocked/Needs Decision**
- 🔥 **High Priority**
- 💡 **Nice to Have**
- 📱 **Mobile Specific**

---

## Table of Contents

1. [Phase 0: Project Setup & Planning](#phase-0-project-setup--planning) ✅
2. [Phase 1: Core Infrastructure](#phase-1-core-infrastructure) 🔄
3. [Phase 2: Authentication & User Management](#phase-2-authentication--user-management)
4. [Phase 3: Friend Management](#phase-3-friend-management)
5. [Phase 4: Messaging & Real-time Communication](#phase-4-messaging--real-time-communication)
6. [Phase 5: Status Feature](#phase-5-status-feature)
7. [Phase 6: Voice & Video Calls](#phase-6-voice--video-calls)
8. [Phase 7: Advanced Features](#phase-7-advanced-features)
9. [Phase 8: Polish & Optimization](#phase-8-polish--optimization)
10. [Phase 9: Testing & QA](#phase-9-testing--qa)
11. [Phase 10: Deployment & Release](#phase-10-deployment--release)

---

## Phase 0: Project Setup & Planning

**Status:** ✅ COMPLETED (February 10, 2026)  
**Documentation:** See [flutter-phase0-complete.md](flutter-phase0-complete.md) and [flutter-brand-assets-integration.md](flutter-brand-assets-integration.md)

### Environment Setup
- [x] ✅ Install Flutter SDK (latest stable version) - v3.29.3 installed
- [x] ✅ Install Android Studio with Android SDK - Installed
- [ ] � Install Xcode (macOS only for iOS development) - Not applicable (Linux)
- [x] ✅ Setup Flutter development tools (VS Code/Android Studio plugins) - VS Code configured
- [ ] ⚠️ Configure Android emulator - Android SDK cmdline-tools needed (can be fixed later)
- [ ] � Configure iOS simulator (macOS only) - Not applicable (Linux)
- [ ] 📋 Setup physical device testing (Android & iOS)

### Project Initialization
- [x] ✅ Create new Flutter project: `flutter create vibesync_mobile`
- [x] ✅ Configure project structure following Flutter best practices - Clean Architecture
- [x] ✅ Setup version control (Git) - link to main VibeSync repo
- [x] ✅ Create `.gitignore` for Flutter - Auto-generated
- [x] ✅ Initialize `pubspec.yaml` with project metadata
- [ ] 📋 Setup monorepo structure (optional: integrate with existing repo)

### Package Management
- [x] ✅ Add core dependencies to `pubspec.yaml`:
  - [x] ✅ `flutter_bloc` (state management) - v8.1.6
  - [x] ✅ `dio` (HTTP client) - v5.4.0
  - [x] ✅ `socket_io_client` (WebSocket/real-time) - v2.0.3
  - [x] ✅ `shared_preferences` (local storage) - v2.5.3
  - [x] ✅ `flutter_secure_storage` (secure token storage) - v9.2.4
  - [x] ✅ `go_router` (navigation) - v13.2.5
  - [x] ✅ `json_annotation` & `json_serializable` (JSON serialization) - v4.9.0 & v6.9.5
  - [x] ✅ `equatable` (value equality) - v2.0.5
  - [x] ✅ `intl` (internationalization) - v0.19.0
  - [x] ✅ `connectivity_plus` (network status) - v5.0.2
- [x] ✅ Add UI/UX dependencies:
  - [x] ✅ `google_fonts` (typography - Outfit font) - v6.3.2
  - [x] ✅ `cached_network_image` (image caching) - v3.3.1
  - [x] ✅ `flutter_svg` (SVG support) - v2.2.2
  - [ ] 📋 `shimmer` (loading skeletons)
  - [ ] 📋 `lottie` (animations)
- [ ] 📋 Add feature-specific dependencies:
  - [ ] 📋 `qr_code_scanner` (QR scanning)
  - [ ] 📋 `qr_flutter` (QR generation)
  - [ ] 📋 `image_picker` (media selection)
  - [ ] 📋 `permission_handler` (permissions)
  - [ ] 📋 `camera` (camera access)
  - [ ] 📋 `video_player` (video playback)
  - [ ] 📋 `agora_rtc_engine` or `webrtc_flutter` (calls)
  - [ ] 📋 `emoji_picker_flutter` (emoji support)

### Project Configuration
- [ ] � Configure Android:
  - Update `android/app/build.gradle` (minSdkVersion: 21, targetSdkVersion: 34)
  - Configure app name, package name
  - Setup permissions in `AndroidManifest.xml`
  - Configure ProGuard rules
- [ ] � Configure iOS:
  - Update `ios/Runner/Info.plist` (permissions, app name)
  - Configure bundle identifier
  - Setup deployment target (iOS 12.0+)
  - Configure signing & capabilities
- [ ] 📋 Setup app icons and splash screens
- [ ] 📋 Configure deep linking
- [ ] 📋 Setup Firebase (Analytics, Crashlytics, Cloud Messaging)

### Design System Setup
- [x] ✅ Create design tokens file (`lib/core/theme/design_tokens.dart`)
  - [x] ✅ Color palette (primary, secondary, accent, semantic colors) - 100% brand alignment
  - [x] ✅ Typography scale (Outfit font family)
  - [x] ✅ Spacing system (4px base unit: 4, 8, 12, 16, 24, 32, 48, 64)
  - [x] ✅ Border radius values (8, 12, 16, 24, 9999)
  - [x] ✅ Shadow/elevation definitions
  - [x] ✅ Gradient definitions (Purple-Pink, Purple-Blue, Pink-Yellow)
  - [x] ✅ Asset paths for logos
  - [x] ✅ Dark theme background colors (#0A0A14, #1A0A2E, #2A1A3E)
  - [x] ✅ Animation durations (150ms, 300ms, 500ms)
  - [x] ✅ Icon sizes (16, 24, 32, 48)
  - [x] ✅ Avatar sizes (32, 48, 64, 96)
  - [x] ✅ Button heights (36, 48, 56)
  - [x] ✅ Input heights (40, 48, 56)
- [x] ✅ Create theme configuration:
  - [x] ✅ Light theme (Material 3)
  - [x] ✅ Dark theme (Material 3)
  - [x] ✅ System theme mode support
  - [x] ✅ Google Fonts integration (Outfit)
- [ ] � Create reusable UI components:
  - [ ] 📋 Custom buttons (primary, secondary, icon)
  - [ ] 📋 Input fields (text, password, search)
  - [ ] 📋 Avatar widget
  - [ ] 📋 Loading indicators
  - [ ] 📋 Error states
  - [ ] 📋 Empty states
- [ ] 📋 Implement glassmorphic design system
- [ ] 📋 Create animation utilities

### Architecture Setup
- [x] ✅ Setup folder structure (Clean Architecture):
  ```
  lib/
  ├── core/
  │   ├── theme/          ✅ design_tokens.dart
  │   ├── constants/      ✅ api_constants.dart
  │   ├── utils/          ✅ (empty, ready)
  │   ├── errors/         ✅ (empty, ready)
  │   └── network/        ✅ (empty, ready)
  ├── features/
  │   ├── auth/           ✅ (data/domain/presentation structure)
  │   ├── friends/        ✅ (structure created)
  │   ├── chat/           ✅ (structure created)
  │   ├── status/         ✅ (structure created)
  │   ├── calls/          ✅ (structure created)
  │   └── settings/       ✅ (structure created)
  ├── shared/
  │   ├── widgets/        ✅ (empty, ready)
  │   ├── models/         ✅ (empty, ready)
  │   └── services/       ✅ (empty, ready)
  └── main.dart           ✅ (splash screen implemented)
  ```
- [ ] � Setup dependency injection (GetIt or similar)
- [ ] � Create base classes:
  - [ ] 📋 Base API client
  - [ ] 📋 Base repository
  - [ ] 📋 Base use case
  - [ ] 📋 Base state classes
- [ ] 📋 Setup error handling framework
- [ ] 📋 Create logging utility

### Brand Assets Integration
- [x] ✅ Copy brand assets from Documents/brandkit:
  - [x] ✅ `vibesync-logo-full-color.svg` → `assets/images/logos/`
  - [x] ✅ `vibesync-logo-white.svg` → `assets/images/logos/`
  - [x] ✅ `vibesync-logo-black.svg` → `assets/images/logos/`
  - [x] ✅ `vibesync-logo-purple.svg` → `assets/images/logos/`
  - [x] ✅ `vibesync-brand-kit.json` → `assets/`
- [x] ✅ Update design tokens with exact brand colors:
  - [x] ✅ Primary Purple: #A259FF (was #8B5CF6)
  - [x] ✅ Secondary Blue: #6CD7FF (was #38BDF8)
  - [x] ✅ Accent Pink: #FF64AA (was #F472B6)
  - [x] ✅ Accent Yellow: #FFC850 (NEW)
  - [x] ✅ Success Green: #50C878 (was #22C55E)
  - [x] ✅ Warning Orange: #FFA500 (was #F59E0B)
  - [x] ✅ Error Red: #FF5C5C (was #EF4444)
  - [x] ✅ Info Blue: #6CD7FF (matches secondary)
- [x] ✅ Configure assets in pubspec.yaml
- [x] ✅ Create splash screen with VibeSync logo:
  - [x] ✅ Purple-Blue gradient background
  - [x] ✅ VibeSync logo (SVG with white color filter)
  - [x] ✅ App name and tagline
  - [x] ✅ Loading indicator
  - [x] ✅ Version number
  - [x] ✅ Purple glow shadow effect
- [x] ✅ Test app running on Chrome web

### API Constants Setup
- [x] ✅ Create API constants file (`lib/core/constants/api_constants.dart`)
  - [x] ✅ Base URLs (development & production)
  - [x] ✅ WebSocket URLs
  - [x] ✅ All auth endpoints
  - [x] ✅ All user endpoints
  - [x] ✅ All friend endpoints
  - [x] ✅ All conversation endpoints
  - [x] ✅ All message endpoints
  - [x] ✅ All status endpoints
  - [x] ✅ Call endpoints (future)
  - [x] ✅ Socket.IO event names
  - [x] ✅ Timeout settings
  - [x] ✅ Header constants
  - [x] ✅ Pagination settings
  - [x] ✅ File upload limits

---

## Phase 1: Core Infrastructure

### API Service Layer
- [ ] 🔥 Create API client with Dio:
  - Base URL configuration
  - Request/response interceptors
  - Error handling
  - Retry logic
  - Timeout configuration
- [ ] 🔥 Implement authentication interceptor:
  - Add JWT token to headers
  - Handle token refresh
  - Handle 401 unauthorized
- [ ] 🔥 Create API endpoints constants
- [ ] 📋 Implement request/response logging (debug mode)
- [ ] 📋 Add network connectivity checking

### WebSocket/Real-time Service
- [ ] 🔥 Setup Socket.IO client
- [ ] 🔥 Implement connection manager:
  - Connect/disconnect logic
  - Authentication with JWT
  - Reconnection strategy
  - Connection state management
- [ ] 🔥 Create event handlers:
  - Message events
  - Presence events
  - Typing events
  - Call events
- [ ] 📋 Implement offline queue for messages
- [ ] 📋 Add connection status indicator

### Local Storage
- [ ] 🔥 Setup SharedPreferences wrapper
- [ ] 🔥 Setup FlutterSecureStorage for tokens
- [ ] 🔥 Create storage keys constants
- [ ] 📋 Implement local database (SQLite/Hive):
  - Messages cache
  - Conversations cache
  - User data cache
- [ ] 📋 Create cache invalidation strategy

### State Management
- [ ] 🔥 **Decision:** Choose state management (BLoC, Provider, Riverpod, GetX)
- [ ] 🔥 Setup state management architecture
- [ ] 🔥 Create base BLoC/Provider classes
- [ ] 🔥 Implement app-level state:
  - Authentication state
  - Theme state
  - Network state
  - User state
- [ ] 📋 Create state persistence logic

### Navigation
- [ ] 🔥 Setup GoRouter configuration
- [ ] 🔥 Define route paths and names
- [ ] 🔥 Implement route guards (authentication)
- [ ] 🔥 Create navigation service
- [ ] 📋 Implement deep linking
- [ ] 📋 Add route transitions/animations

### Data Models
- [ ] 🔥 Create model classes:
  - User model
  - Message model
  - Conversation model
  - Friend request model
  - Status model
  - Call model
- [ ] 🔥 Add JSON serialization annotations
- [ ] 🔥 Generate serialization code: `flutter pub run build_runner build`
- [ ] 📋 Add model validation
- [ ] 📋 Create model extensions/helpers

---

## Phase 2: Authentication & User Management

### Login Screen
- [ ] 🔥 Create login UI:
  - Email input field
  - Password input field
  - "Remember me" checkbox
  - Login button
  - "Forgot password" link
  - "Sign up" link
  - Google OAuth button
- [ ] 🔥 Implement form validation
- [ ] 🔥 Create login BLoC/state management
- [ ] 🔥 Integrate with backend login API
- [ ] 🔥 Handle JWT token storage
- [ ] 🔥 Implement error handling and user feedback
- [ ] 📋 Add loading states
- [ ] 📋 Implement biometric authentication (fingerprint/face ID)

### Registration Screen
- [ ] 🔥 Create registration UI:
  - Name input field
  - Email input field
  - Password input field
  - Confirm password field
  - Terms & conditions checkbox
  - Register button
  - "Already have account" link
  - Google OAuth button
- [ ] 🔥 Implement form validation:
  - Email format validation
  - Password strength validation
  - Password match validation
- [ ] 🔥 Create registration BLoC
- [ ] 🔥 Integrate with backend registration API
- [ ] 🔥 Handle auto-login after registration
- [ ] 📋 Add password strength indicator
- [ ] 📋 Implement email verification flow

### OAuth Integration
- [ ] 🔥 Setup Google Sign-In package
- [ ] 🔥 Configure Google OAuth (Android)
- [ ] 🔥 Configure Google OAuth (iOS)
- [ ] 🔥 Implement Google sign-in flow
- [ ] 🔥 Integrate with backend OAuth endpoint
- [ ] 📋 Add error handling for OAuth failures

### Authentication State Management
- [ ] 🔥 Create AuthBloc/AuthProvider:
  - Login action
  - Logout action
  - Token refresh action
  - Authentication status
- [ ] 🔥 Implement token refresh logic
- [ ] 🔥 Handle session expiration
- [ ] 🔥 Create authentication repository
- [ ] 📋 Implement auto-logout on token expiry
- [ ] 📋 Add session timeout warning

### Onboarding Flow
- [ ] 📋 Create splash screen
- [ ] 📋 Create onboarding screens (intro slides)
- [ ] 📋 Implement skip/next navigation
- [ ] 📋 Save onboarding completion status

### Profile Management
- [ ] 🔥 Create profile view screen
- [ ] 🔥 Create profile edit screen:
  - Name field
  - Status message field
  - Avatar upload
  - Save button
- [ ] 🔥 Implement avatar upload:
  - Image picker integration
  - Image cropping
  - Upload to backend/S3
- [ ] 🔥 Integrate with user update API
- [ ] 📋 Add profile photo preview
- [ ] 📋 Implement photo deletion

---

## Phase 3: Friend Management

### Add Friend Screen
- [ ] 🔥 Create add friend UI:
  - Tab navigation (QR Scan / Friend Code)
  - Scan QR button
  - Friend code input
  - Submit button
- [ ] 🔥 Implement friend code input:
  - Auto-formatting (XXXX-XXXX-XXXXX-XX format)
  - Validation
  - Submit action
- [ ] 🔥 Create friend request BLoC
- [ ] 🔥 Integrate with send friend request API
- [ ] 📋 Add success/error notifications
- [ ] 📋 Prevent self-friending

### QR Code Scanner
- [ ] 🔥 Implement QR scanner:
  - Camera permission handling
  - QR code detection
  - Visual scanning interface
  - Scanning animation
- [ ] 🔥 Parse QR code data (userId, userName, friendCode)
- [ ] 🔥 Auto-send friend request on successful scan
- [ ] 🔥 Handle camera permission denied
- [ ] 📋 Add flashlight toggle
- [ ] 📋 Add gallery image scanning

### My QR Code Display
- [ ] 🔥 Create QR code display screen/modal:
  - Generate QR code with user data
  - Display user name and friend code
  - Share button
- [ ] 🔥 Implement QR code generation
- [ ] 📋 Add QR code download/save
- [ ] 📋 Add QR code share functionality

### Friend Requests
- [ ] 🔥 Create friend requests screen:
  - List of pending requests
  - Accept button
  - Decline button
  - Request sender info (avatar, name)
- [ ] 🔥 Implement accept friend request
- [ ] 🔥 Implement decline friend request
- [ ] 🔥 Integrate with backend friend request APIs
- [ ] 🔥 Add real-time friend request notifications
- [ ] 📋 Add request expiration (optional)
- [ ] 📋 Implement bulk actions

### Friends List
- [ ] 🔥 Create friends list screen:
  - List of all friends
  - Online/offline status indicator
  - Last seen timestamp
  - Search functionality
  - Alphabetical sorting
- [ ] 🔥 Fetch friends from API
- [ ] 🔥 Implement search/filter
- [ ] 🔥 Add pull-to-refresh
- [ ] 📋 Implement friend removal
- [ ] 📋 Add friend blocking
- [ ] 📋 Create friend profile view

---

## Phase 4: Messaging & Real-time Communication

### Conversations List
- [ ] 🔥 Create conversations screen:
  - List of all conversations
  - Last message preview
  - Timestamp (relative)
  - Unread count badge
  - Online status indicator
  - Avatar display
  - Swipe actions (archive, delete)
- [ ] 🔥 Fetch conversations from API
- [ ] 🔥 Implement real-time conversation updates
- [ ] 🔥 Sort by most recent activity
- [ ] 🔥 Add pull-to-refresh
- [ ] 📋 Implement search conversations
- [ ] 📋 Add conversation pinning
- [ ] 📋 Implement conversation archiving

### Chat Screen
- [ ] 🔥 Create chat screen UI:
  - App bar with contact info
  - Message list (scrollable)
  - Message input field
  - Send button
  - Attachment button
  - Back button
- [ ] 🔥 Implement message list:
  - Differentiate sent/received messages
  - Message bubbles styling
  - Timestamp display
  - Read receipts
  - Delivery status
  - Auto-scroll to latest
- [ ] 🔥 Create message input:
  - Text input field
  - Send on button click
  - Send on enter (optional)
  - Character counter (optional)
- [ ] 🔥 Fetch message history from API
- [ ] 🔥 Implement pagination/infinite scroll
- [ ] 📋 Add message reactions
- [ ] 📋 Implement message long-press menu (copy, delete, forward)
- [ ] 📋 Add reply-to message feature

### Real-time Messaging
- [ ] 🔥 Implement WebSocket message sending
- [ ] 🔥 Listen for incoming messages
- [ ] 🔥 Update UI on new messages
- [ ] 🔥 Implement message delivery confirmation
- [ ] 🔥 Implement read receipts:
  - Mark messages as read when viewed
  - Update sender's message status
- [ ] 📋 Implement typing indicators:
  - Emit typing events
  - Display "typing..." indicator
- [ ] 📋 Add message queue for offline sending

### Message Features
- [ ] 📋 Implement emoji picker
- [ ] 📋 Add emoji reactions to messages
- [ ] 📋 Implement message search
- [ ] 📋 Add message forwarding
- [ ] 📋 Implement message deletion:
  - Delete for me
  - Delete for everyone
- [ ] 📋 Add message editing
- [ ] 📋 Implement message pinning
- [ ] 📋 Add message copy functionality

### Media Sharing
- [ ] 🔥 Implement image sharing:
  - Image picker integration
  - Image preview before send
  - Image upload to backend/S3
  - Image display in chat
  - Image full-screen view
- [ ] 📋 Implement video sharing:
  - Video picker
  - Video preview
  - Video upload
  - Video player in chat
- [ ] 📋 Implement file sharing:
  - File picker
  - File upload
  - File download
  - File preview
- [ ] 📋 Add media gallery view
- [ ] 📋 Implement image compression
- [ ] 📋 Add video compression

### Conversation Features
- [ ] 📋 Create conversation settings screen:
  - Mute notifications
  - Custom wallpaper
  - Clear chat history
  - Block user
  - Report user
- [ ] 📋 Implement conversation info screen:
  - Participant details
  - Shared media
  - Conversation actions
- [ ] 📋 Add conversation export

---

## Phase 5: Status Feature

### Status List Screen
- [ ] 🔥 Create status list UI:
  - My status section
  - Recent updates section
  - Viewed updates section
  - Status rings (viewed/unviewed indicator)
  - Timestamp display
- [ ] 🔥 Fetch status updates from API
- [ ] 🔥 Differentiate viewed/unviewed statuses
- [ ] 🔥 Add pull-to-refresh
- [ ] 📋 Implement status count indicator
- [ ] 📋 Add status privacy settings

### Status Viewer
- [ ] 🔥 Create full-screen status viewer:
  - Image/video display
  - Progress bars for multiple statuses
  - User info (avatar, name)
  - Timestamp
  - Close button
  - Pause/resume on tap
- [ ] 🔥 Implement auto-advance:
  - Between statuses from same user
  - To next user after completion
- [ ] 🔥 Mark status as viewed automatically
- [ ] 🔥 Implement swipe gestures:
  - Swipe right to go back
  - Swipe left to skip
- [ ] 📋 Add status reply feature
- [ ] 📋 Show viewer list (for own status)

### Status Creation
- [ ] 🔥 Create status upload screen:
  - Media picker (image/video)
  - Media preview
  - Caption input (optional)
  - Privacy settings
  - Post button
- [ ] 🔥 Implement media selection:
  - Camera capture
  - Gallery selection
  - Multiple media support
- [ ] 🔥 Upload status to backend/S3
- [ ] 🔥 Integrate with create status API
- [ ] 📋 Add text-only status
- [ ] 📋 Implement status filters/effects
- [ ] 📋 Add drawing/stickers on status

### Status Management
- [ ] 🔥 Implement 24-hour auto-deletion (backend)
- [ ] 🔥 View own status
- [ ] 📋 Delete own status
- [ ] 📋 View status analytics (view count, viewers)
- [ ] 📋 Implement status privacy controls:
  - Everyone
  - Friends only
  - Specific friends
  - Exclude specific friends

---

## Phase 6: Voice & Video Calls

### Call Infrastructure
- [ ] 🔥 **Decision:** Choose WebRTC library (agora_rtc_engine, webrtc_flutter, or jitsi_meet)
- [ ] 🔥 Setup WebRTC/call service
- [ ] 🔥 Configure signaling server integration
- [ ] 🔥 Implement peer connection management
- [ ] 📋 Setup TURN/STUN servers
- [ ] 📋 Implement call quality monitoring

### Voice Calls
- [ ] 🔥 Create voice call UI:
  - Caller/receiver info
  - Call duration timer
  - Mute/unmute button
  - Speaker toggle
  - End call button
  - Avatar display
- [ ] 🔥 Implement call initiation:
  - From chat screen
  - From contacts
  - Signaling via WebSocket
- [ ] 🔥 Implement incoming call screen:
  - Caller info
  - Accept button
  - Decline button
  - Ringtone
- [ ] 🔥 Handle call acceptance/rejection
- [ ] 🔥 Implement audio streaming
- [ ] 🔥 Add mute/unmute functionality
- [ ] 📋 Implement call hold
- [ ] 📋 Add call transfer (future)

### Video Calls
- [ ] 🔥 Create video call UI:
  - Remote video view (full screen)
  - Local video preview (small overlay)
  - Call controls overlay
  - Camera toggle
  - Mute/unmute
  - End call button
  - Switch camera (front/back)
- [ ] 🔥 Implement video call initiation
- [ ] 🔥 Handle incoming video calls
- [ ] 🔥 Implement video streaming
- [ ] 🔥 Add camera toggle functionality
- [ ] 🔥 Implement camera switch (front/back)
- [ ] 📋 Add screen sharing (future)
- [ ] 📋 Implement picture-in-picture mode

### Call Notifications
- [ ] 🔥 Implement incoming call notifications:
  - Full-screen incoming call UI
  - Notification when app in background
  - Ringtone/vibration
- [ ] 🔥 Handle call notifications when app is closed
- [ ] 📋 Add custom ringtones
- [ ] 📋 Implement call notification actions (accept/decline from notification)

### Call History
- [ ] 🔥 Create call history screen:
  - List of all calls
  - Call type (voice/video)
  - Call status (missed, incoming, outgoing)
  - Call duration
  - Timestamp
  - Redial button
- [ ] 🔥 Fetch call history from API
- [ ] 🔥 Implement redial functionality
- [ ] 📋 Add call history filtering
- [ ] 📋 Implement call history deletion

### Call Features
- [ ] 📋 Implement call waiting
- [ ] 📋 Add call recording (with consent)
- [ ] 📋 Implement group calls (future)
- [ ] 📋 Add call quality indicators
- [ ] 📋 Implement call feedback

---

## Phase 7: Advanced Features

### Settings Screen
- [ ] 🔥 Create settings screen:
  - Profile section
  - Account settings
  - Privacy settings
  - Notifications settings
  - Appearance settings
  - About section
  - Logout button
- [ ] 🔥 Implement theme toggle:
  - Light theme
  - Dark theme
  - System theme
  - Theme persistence
- [ ] 📋 Add language selection
- [ ] 📋 Implement font size settings
- [ ] 📋 Add data usage settings

### Privacy Settings
- [ ] 📋 Create privacy settings screen:
  - Last seen visibility
  - Profile photo visibility
  - Status visibility
  - Read receipts toggle
  - Typing indicators toggle
  - Blocked users list
- [ ] 📋 Implement privacy controls
- [ ] 📋 Add blocked users management

### Notification Settings
- [ ] 🔥 Setup Firebase Cloud Messaging (FCM)
- [ ] 🔥 Implement push notification handling:
  - Message notifications
  - Friend request notifications
  - Call notifications
- [ ] 🔥 Create notification settings screen:
  - Enable/disable notifications
  - Notification sounds
  - Vibration settings
  - Notification preview
- [ ] 📋 Implement notification channels (Android)
- [ ] 📋 Add custom notification sounds
- [ ] 📋 Implement notification grouping

### Account Settings
- [ ] 📋 Create account settings screen:
  - Change password
  - Email verification
  - Two-factor authentication
  - Account deletion
  - Data export
- [ ] 📋 Implement change password flow
- [ ] 📋 Add email verification
- [ ] 📋 Implement 2FA setup
- [ ] 📋 Add account deletion with confirmation
- [ ] 📋 Implement data export (GDPR compliance)

### Group Chats (Future)
- [ ] 📋 Design group chat data models
- [ ] 📋 Create group creation screen
- [ ] 📋 Implement group chat UI
- [ ] 📋 Add group management:
  - Add/remove members
  - Group admin permissions
  - Group settings
  - Group info screen
- [ ] 📋 Implement group messaging
- [ ] 📋 Add group calls

### Search & Discovery
- [ ] 📋 Implement global search:
  - Search messages
  - Search contacts
  - Search conversations
- [ ] 📋 Add search filters
- [ ] 📋 Implement search history
- [ ] 📋 Add recent searches

---

## Phase 8: Polish & Optimization

### UI/UX Enhancements
- [ ] 🔥 Implement loading states:
  - Shimmer loading skeletons
  - Progress indicators
  - Pull-to-refresh indicators
- [ ] 🔥 Add empty states:
  - No conversations
  - No friends
  - No status updates
  - No call history
- [ ] 🔥 Implement error states:
  - Network errors
  - API errors
  - Permission errors
  - Error retry actions
- [ ] 📋 Add success animations
- [ ] 📋 Implement haptic feedback
- [ ] 📋 Add micro-interactions

### Animations & Transitions
- [ ] 🔥 Implement page transitions
- [ ] 🔥 Add list item animations
- [ ] 📋 Create custom animations:
  - Message send animation
  - Typing indicator animation
  - Status progress animation
- [ ] 📋 Add Lottie animations for key actions
- [ ] 📋 Implement hero animations

### Accessibility
- [ ] 📋 Add semantic labels for screen readers
- [ ] 📋 Implement proper contrast ratios
- [ ] 📋 Add font scaling support
- [ ] 📋 Ensure touch targets are 44x44 minimum
- [ ] 📋 Add keyboard navigation support
- [ ] 📋 Implement voice-over support

### Performance Optimization
- [ ] 🔥 Implement image caching
- [ ] 🔥 Optimize list rendering (ListView.builder)
- [ ] 🔥 Implement lazy loading for images
- [ ] 🔥 Add pagination for long lists
- [ ] 📋 Optimize app size:
  - Remove unused resources
  - Enable code shrinking
  - Compress images
  - Use vector graphics where possible
- [ ] 📋 Implement memory leak detection
- [ ] 📋 Optimize network requests:
  - Request batching
  - Response caching
  - Compression
- [ ] 📋 Add app startup optimization

### Offline Support
- [ ] 🔥 Implement offline message queue
- [ ] 🔥 Cache conversations and messages locally
- [ ] 🔥 Add offline indicator
- [ ] 📋 Implement sync on reconnection
- [ ] 📋 Add conflict resolution for offline changes
- [ ] 📋 Cache user profiles and avatars

### Error Handling & Logging
- [ ] 🔥 Setup Crashlytics (Firebase)
- [ ] 🔥 Implement global error handler
- [ ] 🔥 Add error logging
- [ ] 📋 Implement error reporting
- [ ] 📋 Add user-friendly error messages
- [ ] 📋 Create error retry mechanisms

---

## Phase 9: Testing & QA

### Unit Testing
- [ ] 📋 Setup unit testing framework
- [ ] 📋 Write unit tests for:
  - Models
  - Repositories
  - BLoCs/Providers
  - Utilities
  - Services
- [ ] 📋 Achieve 70%+ code coverage

### Widget Testing
- [ ] 📋 Write widget tests for:
  - UI components
  - Screens
  - Forms
  - Navigation
- [ ] 📋 Test user interactions
- [ ] 📋 Test state changes

### Integration Testing
- [ ] 📋 Setup integration testing
- [ ] 📋 Write integration tests for:
  - Authentication flow
  - Messaging flow
  - Friend management flow
  - Status flow
  - Call flow
- [ ] 📋 Test API integrations
- [ ] 📋 Test WebSocket connections

### Manual Testing
- [ ] 🔥 Test on Android devices:
  - Various screen sizes
  - Different Android versions
  - Different manufacturers
- [ ] 🔥 Test on iOS devices:
  - Various iPhone models
  - Different iOS versions
  - iPad (if supported)
- [ ] 📋 Test edge cases:
  - Poor network conditions
  - No network
  - Low storage
  - Low battery
  - Interruptions (calls, notifications)
- [ ] 📋 Test accessibility features
- [ ] 📋 Perform security testing

### Beta Testing
- [ ] 📋 Setup TestFlight (iOS)
- [ ] 📋 Setup Google Play Internal Testing (Android)
- [ ] 📋 Recruit beta testers
- [ ] 📋 Create feedback collection system
- [ ] 📋 Monitor beta usage and crashes
- [ ] 📋 Incorporate beta feedback

---

## Phase 10: Deployment & Release

### Pre-Release Preparation
- [ ] 🔥 Finalize app icons (Android & iOS)
- [ ] 🔥 Create app screenshots for stores
- [ ] 🔥 Write app description
- [ ] 🔥 Prepare promotional graphics
- [ ] 📋 Create app preview video
- [ ] 📋 Prepare privacy policy URL
- [ ] 📋 Prepare terms of service URL

### Android Release
- [ ] 🔥 Generate release keystore
- [ ] 🔥 Configure app signing
- [ ] 🔥 Update version code and version name
- [ ] 🔥 Build release APK/AAB:
  ```bash
  flutter build appbundle --release
  ```
- [ ] 🔥 Create Google Play Console account
- [ ] 🔥 Create app listing:
  - App name
  - Description
  - Screenshots
  - Feature graphic
  - Category
  - Content rating
- [ ] 🔥 Upload AAB to Play Console
- [ ] 📋 Setup internal testing track
- [ ] 📋 Setup closed testing track
- [ ] 📋 Setup open testing track
- [ ] 📋 Submit for production review
- [ ] 📋 Publish to Google Play Store

### iOS Release
- [ ] 🔥 Create Apple Developer account
- [ ] 🔥 Create App ID and certificates
- [ ] 🔥 Configure app signing
- [ ] 🔥 Update version and build number
- [ ] 🔥 Build release IPA:
  ```bash
  flutter build ipa --release
  ```
- [ ] 🔥 Create App Store Connect listing:
  - App name
  - Subtitle
  - Description
  - Keywords
  - Screenshots
  - App preview video
  - Category
  - Age rating
- [ ] 🔥 Upload build to App Store Connect
- [ ] 📋 Submit for TestFlight beta testing
- [ ] 📋 Submit for App Store review
- [ ] 📋 Publish to App Store

### Post-Release
- [ ] 🔥 Monitor crash reports (Crashlytics)
- [ ] 🔥 Monitor user reviews
- [ ] 🔥 Track analytics:
  - User acquisition
  - User engagement
  - Feature usage
  - Retention rates
- [ ] 📋 Respond to user feedback
- [ ] 📋 Plan updates and bug fixes
- [ ] 📋 Create release notes for updates

### App Store Optimization (ASO)
- [ ] 📋 Optimize app title and subtitle
- [ ] 📋 Optimize app description with keywords
- [ ] 📋 A/B test app icons
- [ ] 📋 A/B test screenshots
- [ ] 📋 Monitor and improve conversion rate
- [ ] 📋 Encourage user reviews

---

## Technical Specifications

### Minimum Requirements
- **Android:** API 21 (Android 5.0 Lollipop) and above
- **iOS:** iOS 12.0 and above
- **Flutter SDK:** 3.16.0 or higher
- **Dart SDK:** 3.2.0 or higher

### Target Devices
- **Android:** Phones and tablets (7" - 10")
- **iOS:** iPhone 6s and newer, iPad (optional)

### Performance Targets
- **App startup time:** < 2 seconds
- **Screen transition time:** < 300ms
- **Message send latency:** < 500ms
- **Image load time:** < 1 second
- **App size:** < 50MB (Android), < 100MB (iOS)
- **Memory usage:** < 200MB average
- **Battery drain:** < 5% per hour of active use

### Backend Integration
- **Base URL:** `https://api.vibesync.com` (or your backend URL)
- **WebSocket URL:** `wss://api.vibesync.com` (or your WebSocket URL)
- **API Version:** v1
- **Authentication:** JWT tokens
- **Real-time:** Socket.IO

### Design System Reference
- **Color Palette:** See `brandkit/vibesync-brand-kit.json`
- **Typography:** Outfit font family (Google Fonts)
- **Primary Color:** `hsl(262, 83%, 58%)` - Purple
- **Secondary Color:** `hsl(198, 93%, 60%)` - Blue
- **Accent Color:** `hsl(330, 85%, 65%)` - Pink
- **Spacing:** 4px base unit (8, 12, 16, 24, 32, 48, 64)
- **Border Radius:** 8px (small), 12px (medium), 16px (large)

---

## Dependencies Reference

### Core Dependencies
```yaml
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
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # JSON Serialization
  json_annotation: ^4.8.1
  
  # UI/UX
  google_fonts: ^6.1.0
  cached_network_image: ^3.3.1
  flutter_svg: ^2.0.9
  shimmer: ^3.0.0
  lottie: ^3.0.0
  
  # Media
  image_picker: ^1.0.7
  camera: ^0.10.5
  video_player: ^2.8.2
  
  # QR Code
  qr_code_scanner: ^1.0.1
  qr_flutter: ^4.1.0
  
  # Permissions
  permission_handler: ^11.2.0
  
  # Calls (choose one)
  agora_rtc_engine: ^6.3.0
  # OR
  # flutter_webrtc: ^0.9.48
  
  # Utilities
  intl: ^0.19.0
  emoji_picker_flutter: ^2.0.0
  url_launcher: ^6.2.4
  
  # Firebase
  firebase_core: ^2.24.2
  firebase_messaging: ^14.7.10
  firebase_analytics: ^10.8.0
  firebase_crashlytics: ^3.4.9

dev_dependencies:
  flutter_test:
    sdk: flutter
  
  # Code Generation
  build_runner: ^2.4.8
  json_serializable: ^6.7.1
  hive_generator: ^2.0.1
  
  # Linting
  flutter_lints: ^3.0.1
  
  # Testing
  mockito: ^5.4.4
  bloc_test: ^9.1.5
```

---

## Progress Tracking

**Phase 0 (Setup):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 1 (Infrastructure):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 2 (Auth):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 3 (Friends):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 4 (Messaging):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 5 (Status):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 6 (Calls):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 7 (Advanced):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 8 (Polish):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 9 (Testing):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete  
**Phase 10 (Release):** ░░░░░░░░░░░░░░░░░░░░ 0% Complete

**Overall Progress:** ░░░░░░░░░░░░░░░░░░░░ 0% Complete

---

## Timeline Estimate

### Aggressive Timeline (1 Developer)
- **Phase 0:** 1 week
- **Phase 1:** 2 weeks
- **Phase 2:** 2 weeks
- **Phase 3:** 2 weeks
- **Phase 4:** 3 weeks
- **Phase 5:** 2 weeks
- **Phase 6:** 3 weeks
- **Phase 7:** 2 weeks
- **Phase 8:** 2 weeks
- **Phase 9:** 2 weeks
- **Phase 10:** 1 week

**Total:** ~22 weeks (5.5 months)

### Realistic Timeline (1 Developer)
- **Phase 0:** 1-2 weeks
- **Phase 1:** 2-3 weeks
- **Phase 2:** 2-3 weeks
- **Phase 3:** 2-3 weeks
- **Phase 4:** 4-5 weeks
- **Phase 5:** 2-3 weeks
- **Phase 6:** 4-5 weeks
- **Phase 7:** 3-4 weeks
- **Phase 8:** 3-4 weeks
- **Phase 9:** 3-4 weeks
- **Phase 10:** 1-2 weeks

**Total:** ~27-38 weeks (7-9.5 months)

### Team Timeline (2-3 Developers)
**Total:** ~15-20 weeks (4-5 months)

---

## Key Decisions Needed

1. **State Management:** BLoC, Provider, Riverpod, or GetX?
2. **WebRTC Library:** Agora, flutter_webrtc, or Jitsi Meet?
3. **Local Database:** SQLite (sqflite), Hive, or Isar?
4. **Backend Integration:** Use existing backend or create mobile-specific endpoints?
5. **Monorepo:** Integrate Flutter app into existing repo or separate repo?
6. **CI/CD:** GitHub Actions, Codemagic, or Bitrise?
7. **Analytics:** Firebase Analytics, Mixpanel, or Amplitude?

---

## Resources & References

### Documentation
- [Flutter Documentation](https://docs.flutter.dev/)
- [Dart Documentation](https://dart.dev/guides)
- [Material Design Guidelines](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### Backend APIs
- See existing backend documentation in `/backend` folder
- API Base URL: TBD
- WebSocket URL: TBD

### Design Assets
- Brand Kit: `Documents/brandkit/vibesync-brand-kit.json`
- Logos: `Documents/brandkit/logos/`

### Existing Documentation
- PRD: `Documents/vibesync-prd.md`
- Tech Rules: `Documents/vibesync-tech-rules.md`
- Main Todo: `Documents/todo.md`

---

## Notes

### Differences from Web App
- **Navigation:** Bottom navigation instead of sidebar
- **Gestures:** Swipe gestures for navigation and actions
- **Permissions:** Camera, microphone, storage, notifications
- **Platform-specific:** iOS and Android specific UI patterns
- **Offline:** More robust offline support needed
- **Push Notifications:** FCM integration required
- **App Lifecycle:** Handle background/foreground states
- **Deep Linking:** Handle app links and universal links

### Advantages of Flutter
- **Single Codebase:** iOS and Android from one codebase
- **Hot Reload:** Fast development iteration
- **Performance:** Near-native performance
- **UI Consistency:** Consistent UI across platforms
- **Rich Ecosystem:** Large package ecosystem
- **Backend Reuse:** Leverage existing backend infrastructure

### Challenges to Consider
- **Platform Differences:** iOS vs Android specific behaviors
- **WebRTC Complexity:** Call implementation can be complex
- **App Store Reviews:** Both Apple and Google review processes
- **Push Notifications:** Platform-specific setup required
- **Testing:** Need to test on multiple devices and OS versions
- **Maintenance:** Keep up with Flutter and platform updates

---

**Last Review:** February 10, 2026  
**Next Review:** After Phase 0 completion

---

*This todo list is a living document. Update regularly as you complete tasks and discover new requirements. Refer to the main project documentation for overall context and backend integration details.*
