import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../../core/constants/api_constants.dart';

/// WebSocket service for real-time communication using Socket.IO
/// Handles connection, authentication, and event management
class SocketService {
  io.Socket? _socket;
  String? _authToken;
  bool _isConnected = false;
  
  // Event listeners
  final Map<String, List<Function>> _eventListeners = {};

  /// Get connection status
  bool get isConnected => _isConnected;

  /// Initialize and connect to Socket.IO server
  Future<void> connect({String? token}) async {
    if (_socket != null && _isConnected) {
      debugPrint('SocketService: Already connected');
      return;
    }

    _authToken = token;

    try {
      _socket = io.io(
        ApiConstants.socketUrl,
        io.OptionBuilder()
            .setTransports(['websocket'])
            .disableAutoConnect()
            .setAuth(token != null ? {'token': token} : {})
            .setReconnectionAttempts(5)
            .setReconnectionDelay(1000)
            .setReconnectionDelayMax(5000)
            .setTimeout(20000)
            .build(),
      );

      _setupEventHandlers();
      _socket!.connect();
      
      debugPrint('SocketService: Connecting to ${ApiConstants.socketUrl}');
    } catch (e) {
      debugPrint('SocketService: Connection error: $e');
      rethrow;
    }
  }

  /// Setup default event handlers
  void _setupEventHandlers() {
    _socket!.onConnect((_) {
      _isConnected = true;
      debugPrint('SocketService: Connected');
      _notifyListeners(ApiConstants.socketConnect, null);
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
      debugPrint('SocketService: Disconnected');
      _notifyListeners(ApiConstants.socketDisconnect, null);
    });

    _socket!.onConnectError((error) {
      debugPrint('SocketService: Connection error: $error');
      _notifyListeners(ApiConstants.socketError, error);
    });

    _socket!.onError((error) {
      debugPrint('SocketService: Error: $error');
      _notifyListeners(ApiConstants.socketError, error);
    });

    // Setup reconnection handlers
    _socket!.on('reconnect', (_) {
      debugPrint('SocketService: Reconnected');
    });

    _socket!.on('reconnect_attempt', (attempt) {
      debugPrint('SocketService: Reconnection attempt: $attempt');
    });

    _socket!.on('reconnect_failed', (_) {
      debugPrint('SocketService: Reconnection failed');
    });
  }

  /// Disconnect from Socket.IO server
  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket!.dispose();
      _socket = null;
      _isConnected = false;
      _eventListeners.clear();
      debugPrint('SocketService: Disconnected and disposed');
    }
  }

  /// Emit an event to the server
  void emit(String event, dynamic data) {
    if (_socket != null && _isConnected) {
      _socket!.emit(event, data);
      debugPrint('SocketService: Emitted event: $event');
    } else {
      debugPrint('SocketService: Cannot emit, not connected');
    }
  }

  /// Listen to an event from the server
  void on(String event, Function(dynamic) callback) {
    // Register with socket only if it's the first listener for this event
    if (!_eventListeners.containsKey(event)) {
      _eventListeners[event] = [];
      _socket?.on(event, (data) {
        debugPrint('SocketService: Received event: $event');
        _notifyListeners(event, data);
      });
    }
    
    _eventListeners[event]!.add(callback);
  }

  /// Remove a specific event listener
  void off(String event, [Function? callback]) {
    if (callback != null) {
      if (_eventListeners.containsKey(event)) {
        _eventListeners[event]?.remove(callback);
        if (_eventListeners[event]?.isEmpty ?? true) {
          _eventListeners.remove(event);
          _socket?.off(event);
        }
      }
    } else {
      _eventListeners.remove(event);
      _socket?.off(event);
    }
  }

  /// Notify all listeners for an event
  void _notifyListeners(String event, dynamic data) {
    final listeners = _eventListeners[event];
    if (listeners != null) {
      for (final listener in listeners) {
        listener(data);
      }
    }
  }

  /// Update authentication token and reconnect preserving listeners
  void updateAuthToken(String token) {
    _authToken = token;
    
    // Snapshot current listeners
    final savedListeners = Map<String, List<Function>>.from(_eventListeners);
    
    // Disconnect (clears _eventListeners)
    disconnect();
    
    // Restore listeners to map
    _eventListeners.addAll(savedListeners);
    
    // Reconnect
    connect(token: token).then((_) {
      // Re-register event handlers on the new socket
      savedListeners.keys.forEach((event) {
        _socket?.on(event, (data) {
          debugPrint('SocketService: Received event: $event');
          _notifyListeners(event, data);
        });
      });
    });
  }

  // ============================================================================
  // MESSAGE EVENTS
  // ============================================================================

  /// Send a message
  void sendMessage(Map<String, dynamic> messageData) {
    emit(ApiConstants.messageSend, messageData);
  }

  /// Listen for new messages
  void onNewMessage(Function(dynamic) callback) {
    on(ApiConstants.messageNew, callback);
  }

  /// Listen for message read events
  void onMessageRead(Function(dynamic) callback) {
    on(ApiConstants.messageRead, callback);
  }

  // ============================================================================
  // TYPING EVENTS
  // ============================================================================

  /// Emit typing start event
  void startTyping(String conversationId) {
    emit(ApiConstants.typingStart, {'conversationId': conversationId});
  }

  /// Emit typing stop event
  void stopTyping(String conversationId) {
    emit(ApiConstants.typingStop, {'conversationId': conversationId});
  }

  /// Listen for typing start events
  void onTypingStart(Function(dynamic) callback) {
    on(ApiConstants.typingStart, callback);
  }

  /// Listen for typing stop events
  void onTypingStop(Function(dynamic) callback) {
    on(ApiConstants.typingStop, callback);
  }

  // ============================================================================
  // PRESENCE EVENTS
  // ============================================================================

  /// Listen for user online events
  void onUserOnline(Function(dynamic) callback) {
    on(ApiConstants.userOnline, callback);
  }

  /// Listen for user offline events
  void onUserOffline(Function(dynamic) callback) {
    on(ApiConstants.userOffline, callback);
  }

  // ============================================================================
  // CALL EVENTS
  // ============================================================================

  /// Initiate a call
  void initiateCall(Map<String, dynamic> callData) {
    emit(ApiConstants.callInitiate, callData);
  }

  /// Accept a call
  void acceptCall(Map<String, dynamic> callData) {
    emit(ApiConstants.callAccept, callData);
  }

  /// Reject a call
  void rejectCall(Map<String, dynamic> callData) {
    emit(ApiConstants.callReject, callData);
  }

  /// End a call
  void endCall(Map<String, dynamic> callData) {
    emit(ApiConstants.callEnd, callData);
  }

  /// Listen for incoming calls
  void onCallInitiate(Function(dynamic) callback) {
    on(ApiConstants.callInitiate, callback);
  }

  /// Listen for call acceptance
  void onCallAccept(Function(dynamic) callback) {
    on(ApiConstants.callAccept, callback);
  }

  /// Listen for call rejection
  void onCallReject(Function(dynamic) callback) {
    on(ApiConstants.callReject, callback);
  }

  /// Listen for call end
  void onCallEnd(Function(dynamic) callback) {
    on(ApiConstants.callEnd, callback);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /// Check if socket is initialized
  bool get isInitialized => _socket != null;

  /// Get current auth token
  String? get authToken => _authToken;

  /// Force reconnection
  void reconnect() {
    if (_socket != null) {
      _socket!.connect();
    }
  }
}
