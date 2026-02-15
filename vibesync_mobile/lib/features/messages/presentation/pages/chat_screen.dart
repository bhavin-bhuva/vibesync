import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:vibesync_mobile/core/theme/design_tokens.dart';
import 'package:vibesync_mobile/features/conversations/data/services/conversation_service.dart';
import 'package:vibesync_mobile/features/conversations/data/models/conversation_model.dart';
import 'package:vibesync_mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:intl/intl.dart';
import 'dart:async';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import '../../../../shared/services/socket_service.dart'; // For context.read
import 'package:vibesync_mobile/core/constants/api_constants.dart'; // Assuming ApiConstants is here
import '../../../../shared/services/local_storage_service.dart';
import 'package:vibesync_mobile/core/constants/storage_keys.dart';

/// Chat screen for viewing and sending messages in a conversation
class ChatScreen extends StatefulWidget {
  final String conversationId;
  final Conversation? conversation;

  const ChatScreen({
    super.key,
    required this.conversationId,
    this.conversation,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> with SingleTickerProviderStateMixin {
  late ConversationService _conversationService;
  late AnimationController _dragController;
  SocketService? _socketService; // Made nullable for safety
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<Map<String, dynamic>> _messages = [];
  Conversation? _conversation;
  bool _isLoading = false; // Start as false, set true in _loadData
  bool _isSending = false;
  String? _error;
  String? _currentUserId;
  StreamSubscription? _authSubscription;

  @override
  void initState() {
    super.initState();
    _dragController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    if (widget.conversation != null) {
      _conversation = widget.conversation;
    }
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeScreen();
    });
  }

  Future<void> _initializeScreen() async {
    try {
      final authBloc = context.read<AuthBloc>();
      final localStorage = context.read<LocalStorageService>();
      
      _conversationService = ConversationService(
        apiClient: authBloc.apiClient,
        localStorage: localStorage,
      );
      
      // 1. Try AuthBloc
      if (authBloc.state is Authenticated) {
        final authState = authBloc.state as Authenticated;
        _currentUserId = authState.user['id'] ?? authState.user['_id'];
      }
      
      // 2. Try LocalStorage
      if (_currentUserId == null || _currentUserId!.isEmpty) {
        _currentUserId = localStorage.getString(StorageKeys.userId);
      }
      
      // 3. Try API directly if still missing
      if (_currentUserId == null || _currentUserId!.isEmpty) {
        try {
          final response = await authBloc.apiClient.get('/users/me');
          if (response.statusCode == 200) {
            final data = response.data['data'] ?? response.data;
            _currentUserId = data['id'] ?? data['_id'];
            // Update local storage too
            if (_currentUserId != null) {
              localStorage.setString(StorageKeys.userId, _currentUserId!);
            }
          }
        } catch (e) {
          debugPrint('Failed to fetch user me: $e');
        }
      }
      
      debugPrint('ChatScreen: Final Current User ID: $_currentUserId');

      if (_currentUserId != null && _currentUserId!.isNotEmpty) {
        if (mounted) {
           // Set state to update UI with currentUserId (affects bubbles immediately)
           setState(() {}); 
           _loadData();
           _setupSocketListeners();
        }
      } else {
        // 4. Last resort: Wait for AuthBloc stream
        _authSubscription = authBloc.stream.listen((state) {
          if (state is Authenticated) {
            if (mounted) {
              setState(() {
                _currentUserId = state.user['id'] ?? state.user['_id'];
              });
              _loadData();
              _setupSocketListeners();
              _authSubscription?.cancel();
            }
          }
        });
      }
    } catch (e) {
      debugPrint('Error initializing chat screen: $e');
      if (mounted) {
        setState(() {
          _error = 'Failed to initialize chat: $e';
        });
      }
    }
  }

  @override
  void dispose() {
    _dragController.dispose();
    _authSubscription?.cancel();
    if (mounted && _socketService != null) {
      try {
        // Leave the conversation room
        _socketService!.emit(ApiConstants.leaveConversation, widget.conversationId);
        _socketService!.off(ApiConstants.messageNew, _handleNewSocketMessage);
      } catch (e) {
        // Ignore
      }
    }
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _setupSocketListeners() {
    try {
      _socketService = context.read<SocketService>();
      
      // Join the conversation room to receive updates
      _socketService?.emit(ApiConstants.joinConversation, widget.conversationId);
      
      _socketService?.onNewMessage(_handleNewSocketMessage);
    } catch (e) {
      debugPrint('Error setting up socket listeners: $e');
    }
  }

  void _handleNewSocketMessage(dynamic data) {
    if (!mounted) return;
    
    // Safety check for data
    if (data == null || data is! Map) return;

    // Verify it's for this conversation
    if (data['conversationId'] != widget.conversationId) return;
    
    // Check if we already have this message (deduplication)
    final existingIndex = _messages.indexWhere((m) => m['id'] == data['id']);
    
    // Also check temporary IDs
    final tempIndex = _messages.indexWhere((m) => 
      m['id'].toString().startsWith('temp_') && m['content'] == data['content']
    );

    setState(() {
      if (existingIndex != -1) {
        _messages[existingIndex] = Map<String, dynamic>.from(data);
      } else if (tempIndex != -1) {
        _messages[tempIndex] = Map<String, dynamic>.from(data);
      } else {
        // Prepend to start of list
        _messages.insert(0, Map<String, dynamic>.from(data));
      }
    });

    // Update cache with new message
    _conversationService.cacheMessages(widget.conversationId, _messages);

    _scrollToBottom();
  }

  Future<void> _loadData() async {
    // Load cache first
    try {
      final cached = _conversationService.getCachedMessages(widget.conversationId);
      if (cached.isNotEmpty && mounted) {
        setState(() {
          _messages = cached;
          if (_messages.isNotEmpty) {
             // Scroll to bottom after frame
             _scrollToBottom();
          }
        });
      }
    } catch (e) {
      debugPrint('Error loading cache: $e');
    }

    setState(() {
      _isLoading = _messages.isEmpty; // Only show loader if no messages
      _error = null;
    });

    try {
      // Load conversation details
      final conversation = await _conversationService.getConversation(widget.conversationId);
      
      // Load messages
      final messages = await _conversationService.getMessages(widget.conversationId);
      
      // Mark as read
      await _conversationService.markAsRead(widget.conversationId);

      if (mounted) {
        setState(() {
          _conversation = conversation;
          _messages = messages; // No reverse needed for reverse: true ListView
          _isLoading = false;
        });
        
        // Cache the updated list
        _conversationService.cacheMessages(widget.conversationId, _messages);

        // Scroll to bottom
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          // If we have cached messages, don't show full screen error, maybe snackbar?
          // But here we set _error which _buildMessageArea uses.
          // If _messages is not empty, we might want to just show snackbar.
          if (_messages.isEmpty) {
            _error = e.toString();
          } else {
             debugPrint('Error refreshing data: $e');
             // Optional: Show snackbar
          }
          _isLoading = false;
        });
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          0.0, // Bottom of reversed list
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty || _isSending) return;

    setState(() {
      _isSending = true;
    });

    // Basic HTML wrapping to ensure compatibility with web view
    final htmlContent = text.contains('<') && text.contains('>') 
        ? text 
        : '<p>${text.replaceAll('\n', '<br>')}</p>';

    // Optimistic UI update
    final tempMessage = {
      'id': 'temp_${DateTime.now().millisecondsSinceEpoch}',
      'senderId': _currentUserId,
      'content': htmlContent,
      'messageType': 'text',
      'createdAt': DateTime.now().toIso8601String(),
      'updatedAt': DateTime.now().toIso8601String(),
    };

    setState(() {
      _messages.insert(0, tempMessage);
    });

    _messageController.clear();
    _scrollToBottom();

    try {
      final newMessage = await _conversationService.sendMessage(
        widget.conversationId,
        htmlContent,
      );

      setState(() {
        _messages = _messages.map((msg) {
          if (msg['id'] == tempMessage['id']) {
            return newMessage;
          }
          return msg;
        }).toList();
        _isSending = false;
      });
      
      // Update cache with sent message
      _conversationService.cacheMessages(widget.conversationId, _messages);
    } catch (e) {
      // Remove optimistic message on error
      setState(() {
        _messages.removeWhere((msg) => msg['id'] == tempMessage['id']);
        _isSending = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to send message: ${e.toString()}'),
            backgroundColor: const Color(0xFFEF4444),
          ),
        );
      }
    }
  }

  String _formatTime(String dateString) {
    final date = DateTime.parse(dateString);
    return DateFormat('HH:mm').format(date);
  }

  String _getDisplayName() {
    if (_conversation == null) return 'Loading...';
    if (_conversation!.displayName != null) return _conversation!.displayName!;
    
    if (_conversation!.isGroup) return _conversation!.name ?? 'Group Chat';
    
    if (_currentUserId != null) {
      final other = _conversation!.participants.firstWhere(
        (p) => p.id != _currentUserId,
        orElse: () => _conversation!.participants.first,
      );
      return other.name;
    }
    
    return 'Unknown';
  }

  String? _getDisplayAvatar() {
    if (_conversation == null) return null;
    if (_conversation!.displayAvatar != null) return _conversation!.displayAvatar;
    
    if (_conversation!.isGroup) return null; // Or group avatar logic
    
    if (_currentUserId != null) {
      try {
        final other = _conversation!.participants.firstWhere(
          (p) => p.id != _currentUserId,
        );
        return other.avatar;
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  bool _getOnlineStatus() {
    if (_conversation == null) return false;
    if (_conversation!.online != null) return _conversation!.online!;
    
    if (_conversation!.isGroup) return false;
    
    if (_currentUserId != null) {
      try {
        final other = _conversation!.participants.firstWhere(
          (p) => p.id != _currentUserId,
        );
        return other.online;
      } catch (_) {
        return false;
      }
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      appBar: _buildAppBar(),
      body: Column(
        children: [
          // Messages area
          Expanded(
            child: _buildMessageArea(),
          ),
          // Message input
          _buildMessageInput(),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: const Color(0xFF1A1A24),
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: Colors.white),
        onPressed: () => context.pop(),
      ),
      title: _conversation != null
          ? Row(
              children: [
                // Avatar
                Stack(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundColor: DesignTokens.primaryPurple,
                      foregroundImage: _getDisplayAvatar() != null
                          ? NetworkImage(_getDisplayAvatar()!)
                          : null,
                      onForegroundImageError: (_, __) {},
                      child: Text(
                              (_getDisplayName().isEmpty ? '?' : _getDisplayName()[0].toUpperCase()),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                    if (_getOnlineStatus())
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFF1A1A24),
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 12),
                // Name and status
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _getDisplayName(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        _getOnlineStatus() ? 'Active now' : 'Offline',
                        style: const TextStyle(
                          color: Color(0xFF9CA3AF),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            )
          : const Text(
              'Loading...',
              style: TextStyle(color: Colors.white),
            ),
      actions: [
        IconButton(
          icon: const Icon(Icons.phone, color: Color(0xFF9333EA)),
          onPressed: () {
            // TODO: Implement voice call
          },
        ),
        IconButton(
          icon: const Icon(Icons.videocam, color: Color(0xFF9333EA)),
          onPressed: () {
            // TODO: Implement video call
          },
        ),
        IconButton(
          icon: const Icon(Icons.more_vert, color: Color(0xFF9CA3AF)),
          onPressed: () {
            // TODO: Show more options
          },
        ),
      ],
    );
  }

  Widget _buildMessageArea() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Color(0xFF9333EA),
        ),
      );
    }

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
              'Failed to load messages',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: _loadData,
              child: const Text(
                'Retry',
                style: TextStyle(color: Color(0xFF9333EA)),
              ),
            ),
          ],
        ),
      );
    }

    if (_messages.isEmpty) {
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
              'No messages yet',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Start the conversation!',
              style: TextStyle(
                color: Colors.white.withOpacity(0.3),
                fontSize: 14,
              ),
            ),
          ],
        ),
      );
    }

    return GestureDetector(
      onHorizontalDragUpdate: (details) {
        // Dragging left (negative delta) increases the controller value
        _dragController.value -= details.primaryDelta! / 70.0;
      },
      onHorizontalDragEnd: (details) {
        if (_dragController.value > 0.5) {
             // Optional: Snap open? usually just snaps back for "peek"
             _dragController.reverse();
        } else {
             _dragController.reverse();
        }
      },
      child: ListView.builder(
        reverse: true,
        controller: _scrollController,
        padding: const EdgeInsets.all(16),
        itemCount: _messages.length,
        itemBuilder: (context, index) {
          final message = _messages[index];
          final isMe = message['senderId'] == _currentUserId;
          final messageType = message['messageType'] ?? 'text';

          // Date Header Logic (Reversed List)
          Widget? dateHeader;
          if (index == _messages.length - 1) {
            // Oldest message gets header
            dateHeader = _buildDateHeader(message['createdAt']);
          } else {
            // Check if previous message (in time, which is handle index+1 in list) is different day
            final previousMessage = _messages[index + 1];
            if (!_isSameDay(message['createdAt'], previousMessage['createdAt'])) {
              dateHeader = _buildDateHeader(message['createdAt']);
            }
          }

          // System message content
          Widget content;
          if (messageType == 'system') {
            content = Column(
              children: [
                if (dateHeader != null) dateHeader,
                _buildSystemMessage(message),
              ],
            );
          } else {
            // Avatar Logic
            final showAvatar = !isMe && (_conversation?.isGroup ?? false);

            // Regular message content
            content = Column(
              children: [
                if (dateHeader != null) dateHeader,
                _buildMessage(message, isMe, showAvatar: showAvatar),
              ],
            );
          }

          // Wrap with Swipe Animation
          return AnimatedBuilder(
            animation: _dragController,
            builder: (context, child) {
              final offset = _dragController.value * 70.0;
              return Stack(
                children: [
                  // Time Text (Sliding in from right)
                  Positioned(
                    right: -70 + offset, // Start offscreen (-70), slide in to 0
                    top: 0,
                    bottom: 0, // Fill height to center vertically if needed
                    width: 70,
                    child: Center(
                      child: Text(
                        _formatTime(message['createdAt']),
                        style: const TextStyle(
                          color: Color(0xFF6B7280),
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  // Message Content
                  Transform.translate(
                    offset: Offset(-offset, 0),
                    child: child!,
                  ),
                ],
              );
            },
            child: content,
          );
        },
      ),
    );
  }

  bool _isSameDay(dynamic date1, dynamic date2) {
    if (date1 == null || date2 == null) return false;
    final d1 = DateTime.tryParse(date1.toString())?.toLocal();
    final d2 = DateTime.tryParse(date2.toString())?.toLocal();
    if (d1 == null || d2 == null) return false;
    return d1.year == d2.year && d1.month == d2.month && d1.day == d2.day;
  }

  Widget _buildDateHeader(dynamic dateString) {
    if (dateString == null) return const SizedBox.shrink();
    final date = DateTime.tryParse(dateString.toString())?.toLocal();
    if (date == null) return const SizedBox.shrink();

    final now = DateTime.now();
    String text;
    if (date.year == now.year && date.month == now.month && date.day == now.day) {
      text = 'Today';
    } else if (date.year == now.year && date.month == now.month && date.day == now.day - 1) {
      text = 'Yesterday';
    } else {
      text = DateFormat('MMMM d, y').format(date);
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A24),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF2A2A3C)),
          ),
          child: Text(
            text,
            style: const TextStyle(
              color: Color(0xFF9CA3AF),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSystemMessage(Map<String, dynamic> message) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF2A2A3C),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            message['content'],
            style: const TextStyle(
              color: Color(0xFF9CA3AF),
              fontSize: 12,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }

  Widget _buildMessage(Map<String, dynamic> message, bool isMe, {bool showAvatar = true}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isMe) ...[
            if (showAvatar) ...[
              // Avatar for other user
              CircleAvatar(
                radius: 16,
                backgroundColor: DesignTokens.primaryPurple,
                foregroundImage: _getDisplayAvatar() != null
                    ? NetworkImage(_getDisplayAvatar()!)
                    : null,
                onForegroundImageError: (_, __) {},
                child: Text(
                        (_getDisplayName().isEmpty ? '?' : _getDisplayName()[0].toUpperCase()),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
              const SizedBox(width: 8),
            ],
          ],

          // Message bubble
          Flexible(
            child: Column(
              crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    gradient: isMe
                        ? const LinearGradient(
                            colors: [Color(0xFF9333EA), Color(0xFF3B82F6)],
                          )
                        : null,
                    color: isMe ? null : const Color(0xFF2A2A3C),
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(16),
                      topRight: const Radius.circular(16),
                      bottomLeft: Radius.circular(isMe ? 16 : 4),
                      bottomRight: Radius.circular(isMe ? 4 : 16),
                    ),
                  ),
                  child: HtmlWidget(
                    message['content'],
                    textStyle: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                    ),
                    customStylesBuilder: (element) {
                      if (element.localName == 'p') {
                        return {'margin': '0', 'padding': '0', 'display': 'inline'};
                      }
                      if (element.localName == 'body') {
                         return {'margin': '0', 'padding': '0'};
                      }
                      if (element.localName == 'a') {
                        return {'color': '#60A5FA', 'text-decoration': 'underline'};
                      }
                      return null;
                    },
                  ),
                ),
                // REMOVED TIME TEXT
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.only(top: 12, left: 16, right: 16, bottom: 0),
      decoration: const BoxDecoration(
        color: Color(0xFF1A1A24),
        border: Border(
          top: BorderSide(
            color: Color(0xFF2A2A3C),
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        minimum: const EdgeInsets.only(bottom: 8),
        child: Row(
          children: [
            // Attachment button
            IconButton(
              icon: const Icon(Icons.add_circle_outline, color: Color(0xFF9CA3AF)),
              onPressed: () {
                // TODO: Implement attachments
              },
            ),
            // Text input
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFF2A2A3C),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: TextField(
                  controller: _messageController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    hintText: 'Start Typing...',
                    hintStyle: TextStyle(color: Color(0xFF6B7280)),
                    border: InputBorder.none,
                  ),
                  maxLines: null,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Send button
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF9333EA), Color(0xFF3B82F6)],
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: IconButton(
                icon: _isSending
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Icon(Icons.send, color: Colors.white),
                onPressed: _isSending ? null : _sendMessage,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
