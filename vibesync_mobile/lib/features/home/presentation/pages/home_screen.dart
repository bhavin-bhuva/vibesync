import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:vibesync_mobile/core/theme/design_tokens.dart';
import 'package:vibesync_mobile/core/constants/route_constants.dart';
import 'package:vibesync_mobile/shared/widgets/bottom_nav_bar.dart';
import 'package:vibesync_mobile/core/constants/api_constants.dart';
import 'package:vibesync_mobile/shared/services/socket_service.dart';
import 'package:vibesync_mobile/features/conversations/data/services/conversation_service.dart';
import 'package:vibesync_mobile/features/conversations/data/models/conversation_model.dart';
import 'package:vibesync_mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibesync_mobile/features/settings/presentation/pages/settings_screen.dart';
import 'package:vibesync_mobile/shared/services/local_storage_service.dart';

/// Home screen with conversation list and bottom navigation
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _activeTab = 'chats';
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  bool _isSearchVisible = false;
  late ConversationService _conversationService;
  SocketService? _socketService;
  
  List<Conversation> _conversations = [];
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Get ApiClient from AuthBloc and initialize ConversationService
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authBloc = context.read<AuthBloc>();
      final localStorage = context.read<LocalStorageService>();
      _conversationService = ConversationService(
        apiClient: authBloc.apiClient,
        localStorage: localStorage,
      );
      _setupSocketListeners();
      _loadConversations();
    });
  }

  @override
  void dispose() {
    if (_socketService != null) {
      _socketService!.off(ApiConstants.conversationUpdated, _handleConversationUpdate);
      _socketService!.off(ApiConstants.userStatus, _handleUserStatus);
    }
    _searchController.dispose();
    super.dispose();
  }

  void _setupSocketListeners() {
    try {
      _socketService = context.read<SocketService>();
      _socketService?.on(ApiConstants.conversationUpdated, _handleConversationUpdate);
      _socketService?.on(ApiConstants.userStatus, _handleUserStatus);
    } catch (e) {
      debugPrint('Error setting up socket listeners: $e');
    }
  }

  void _handleConversationUpdate(dynamic data) {
    if (data == null || data is! Map) return;
    final conversationId = data['conversationId'];
    if (conversationId == null) return;

    if (mounted) {
       setState(() {
         final index = _conversations.indexWhere((c) => c.id == conversationId);
         if (index != -1) {
           // Move to top and update fields
           final old = _conversations[index];
           final updated = Conversation(
             id: old.id,
             isGroup: old.isGroup,
             name: old.name,
             displayName: old.displayName,
             displayAvatar: old.displayAvatar,
             online: old.online,
             lastMessage: data['lastMessage'] != null && data['lastMessage']['content'] != null 
                 ? data['lastMessage']['content'] 
                 : old.lastMessage,
             unread: (old.unread ?? 0) + 1,
             updatedAt: DateTime.now(), // Just now
             participants: old.participants,
           );
           
           _conversations.removeAt(index);
           _conversations.insert(0, updated);
         } else {
           // New or not in list - reload
           _loadConversations();
         }
       });
       // Update cache
       _conversationService.cacheConversations(_conversations);
    }
  }

  void _handleUserStatus(dynamic data) {
    if (data == null || data is! Map) return;
    final userId = data['userId'];
    final online = data['online'] ?? false;
    
    if (userId == null) return;

    if (mounted) {
      setState(() {
        _conversations = _conversations.map((c) {
          // Check if participant match (for P2P mostly)
          final hasParticipant = c.participants.any((p) => p.id == userId);
          if (hasParticipant && c.participants.length == 2 && !c.isGroup) {
             // Update conversation online status
             return Conversation(
               id: c.id,
               isGroup: c.isGroup,
               name: c.name,
               displayName: c.displayName,
               displayAvatar: c.displayAvatar,
               online: online,
               lastMessage: c.lastMessage,
               unread: c.unread,
               updatedAt: c.updatedAt,
               participants: c.participants.map((p) {
                 if (p.id == userId) {
                   return Participant(
                     id: p.id,
                     name: p.name,
                     avatar: p.avatar,
                     online: online,
                   );
                 }
                 return p;
               }).toList(),
             );
          }
          return c;
        }).toList();
      });
      // Update cache
      _conversationService.cacheConversations(_conversations);
    }
  }

  Future<void> _loadConversations() async {
    // Load cache first
    try {
      final cached = _conversationService.getCachedConversations();
      if (cached.isNotEmpty && mounted) {
        setState(() {
          _conversations = cached;
        });
      }
    } catch (e) {
      debugPrint('Error loading cached conversations: $e');
    }

    setState(() {
      _isLoading = _conversations.isEmpty;
      _error = null;
    });

    try {
      final conversations = await _conversationService.getConversations();
      if (mounted) {
        setState(() {
          _conversations = conversations;
          _isLoading = false;
        });
        // Cache the new list
        _conversationService.cacheConversations(conversations);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          if (_conversations.isEmpty) {
             _error = e.toString();
          }
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1A24), // Match nav bar color so bottom edge is seamless
      body: Column(
        children: [
          // Top safe area for status bar only
          SafeArea(
            bottom: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildHeader(),
                if (_activeTab == 'chats' && _isSearchVisible) _buildSearchBar(),
              ],
            ),
          ),
          // Content area with its own dark background
          Expanded(
            child: Container(
              color: const Color(0xFF0A0A0F),
              child: _buildContent(),
            ),
          ),
          // Bottom Navigation (handles its own bottom padding via viewPadding)
          BottomNavBar(
            activeTab: _activeTab,
            onTabChange: (tab) {
              setState(() {
                _activeTab = tab;
                _searchQuery = '';
                _searchController.clear();
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Color(0xFF2A2A3C),
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              _getHeaderTitle(),
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          if (_activeTab == 'chats') ...[
            // Search Toggle Button
            IconButton(
              onPressed: () {
                setState(() {
                  _isSearchVisible = !_isSearchVisible;
                  if (!_isSearchVisible) {
                    _searchQuery = '';
                    _searchController.clear();
                  }
                });
              },
              icon: Icon(
                _isSearchVisible ? Icons.search_off : Icons.search,
                color: const Color(0xFF9CA3AF),
                size: 24,
              ),
              tooltip: _isSearchVisible ? 'Hide Search' : 'Search',
            ),
            const SizedBox(width: 4),
            // Manage Requests Button
            IconButton(
              onPressed: () {
                context.push(RoutePaths.friendRequests);
              },
              icon: const Icon(
                Icons.group_outlined,
                color: Color(0xFF9CA3AF),
                size: 24,
              ),
              tooltip: 'Friend Requests',
            ),
            const SizedBox(width: 4),
            // Add Friend Button
            IconButton(
              onPressed: () {
                context.push(RoutePaths.addFriend);
              },
              icon: const Icon(
                Icons.person_add_outlined,
                color: Color(0xFF9CA3AF),
                size: 24,
              ),
              tooltip: 'Add Friend',
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: TextField(
        controller: _searchController,
        onChanged: (value) {
          setState(() {
            _searchQuery = value;
          });
        },
        style: const TextStyle(
          color: Colors.white,
          fontSize: 14, // Smaller font
        ),
        decoration: InputDecoration(
          isDense: true, // Reduces height
          contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
          hintText: 'Search conversations...',
          hintStyle: const TextStyle(
            color: Color(0xFF6B7280),
            fontSize: 14,
          ),
          prefixIcon: const Icon(
            Icons.search,
            color: Color(0xFF6B7280),
            size: 20, // Smaller icon
          ),
          suffixIcon: _searchQuery.isNotEmpty
              ? IconButton(
                  icon: const Icon(
                    Icons.clear,
                    color: Color(0xFF6B7280),
                  ),
                  onPressed: () {
                    setState(() {
                      _searchQuery = '';
                      _searchController.clear();
                    });
                  },
                )
              : null,
          filled: true,
          fillColor: const Color(0xFF1A1A24),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(
              color: Color(0xFF2A2A3C),
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(
              color: Color(0xFF2A2A3C),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(
              color: Color(0xFF9333EA),
              width: 2,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    switch (_activeTab) {
      case 'chats':
        return _buildConversationList();
      case 'status':
        return _buildStatusList();
      case 'calls':
        return _buildCallHistoryList();
      case 'settings':
        return _buildSettingsList();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildConversationList() {
    // Show loading state
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Color(0xFF9333EA),
        ),
      );
    }

    // Show error state
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.white.withOpacity(0.3),
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load conversations',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: _loadConversations,
              child: const Text(
                'Retry',
                style: TextStyle(color: Color(0xFF9333EA)),
              ),
            ),
          ],
        ),
      );
    }

    // Filter conversations based on search query
    final filteredConversations = _conversations.where((conv) {
      return (conv.displayName ?? '')
          .toLowerCase()
          .contains(_searchQuery.toLowerCase());
    }).toList();

    // Show empty state
    if (filteredConversations.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble_outline,
              size: 64,
              color: Colors.white.withOpacity(0.3),
            ),
            const SizedBox(height: 16),
            Text(
              _conversations.isEmpty
                  ? 'No conversations yet'
                  : 'No conversations found',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 16,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadConversations,
      color: const Color(0xFF9333EA),
      backgroundColor: const Color(0xFF1A1A24),
      child: ListView.builder(
        padding: EdgeInsets.zero,
        itemCount: filteredConversations.length,
        itemBuilder: (context, index) {
          final conversation = filteredConversations[index];
          return _buildConversationItemFromModel(conversation);
        },
      ),
    );
  }

  Widget _buildConversationItemFromModel(Conversation conversation) {
    return InkWell(
      onTap: () async {
        // Navigate to conversation detail and wait for return
        await context.push('/chat/${conversation.id}', extra: conversation);
        // Reload conversations to update unread status
        _loadConversations();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: const BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: Color(0xFF2A2A3C),
              width: 0.5,
            ),
          ),
        ),
        child: Row(
          children: [
            // Avatar
            Stack(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: DesignTokens.primaryPurple,
                  foregroundImage: conversation.displayAvatar != null
                      ? NetworkImage(conversation.displayAvatar!)
                      : null,
                  onForegroundImageError: (_, __) {},
                  child: Text(
                    (conversation.displayName ?? '?')[0].toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (conversation.online ?? false)
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFF0A0A0F),
                          width: 2,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 12),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          conversation.displayName ?? 'Unknown',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Text(
                        _formatTimestamp(conversation.updatedAt),
                        style: const TextStyle(
                          color: Color(0xFF6B7280),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          (conversation.lastMessage?.replaceAll(RegExp(r'<[^>]*>'), '') ?? 'No messages yet'),
                          style: const TextStyle(
                            color: Color(0xFF9CA3AF),
                            fontSize: 14,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if ((conversation.unread ?? 0) > 0)
                        Container(
                          margin: const EdgeInsets.only(left: 8),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: DesignTokens.primaryPurple,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            (conversation.unread ?? 0) > 99
                                ? '99+'
                                : (conversation.unread ?? 0).toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
    }
  }

  Widget _buildStatusList() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.radio_button_checked,
            size: 64,
            color: Colors.white.withOpacity(0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'Status feature coming soon',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCallHistoryList() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.phone,
            size: 64,
            color: Colors.white.withOpacity(0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'Call history coming soon',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsList() {
    return const SettingsScreen();
  }

  String _getHeaderTitle() {
    switch (_activeTab) {
      case 'chats':
        return 'Messages';
      case 'status':
        return 'Status';
      case 'calls':
        return 'Calls';
      case 'settings':
        return 'Settings';
      default:
        return 'VibeSync';
    }
  }
}
