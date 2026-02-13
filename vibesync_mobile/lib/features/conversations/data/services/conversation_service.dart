import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:vibesync_mobile/core/network/api_client.dart';
import 'package:vibesync_mobile/features/conversations/data/models/conversation_model.dart';
import 'package:vibesync_mobile/shared/services/local_storage_service.dart';
import 'package:vibesync_mobile/core/constants/storage_keys.dart';

/// Service for handling conversation-related API calls
class ConversationService {
  final ApiClient _apiClient;
  final LocalStorageService? _localStorage;

  ConversationService({
    required ApiClient apiClient,
    LocalStorageService? localStorage,
  })  : _apiClient = apiClient,
        _localStorage = localStorage;

  /// Get cached messages for a conversation
  List<Map<String, dynamic>> getCachedMessages(String conversationId) {
    if (_localStorage == null) return [];
    try {
      final key = '${StorageKeys.cachedMessagesPrefix}$conversationId';
      final jsonString = _localStorage!.getString(key);
      if (jsonString != null && jsonString.isNotEmpty) {
        final List<dynamic> jsonList = jsonDecode(jsonString);
        return jsonList.cast<Map<String, dynamic>>();
      }
    } catch (e) {
      // Ignore cache errors
    }
    return [];
  }

  /// Cache messages for a conversation
  Future<void> cacheMessages(String conversationId, List<Map<String, dynamic>> messages) async {
    if (_localStorage == null) return;
    try {
      final key = '${StorageKeys.cachedMessagesPrefix}$conversationId';
      // Store only last 50 messages to save space
      final messagesToStore = messages.length > 50 ? messages.sublist(0, 50) : messages;
      await _localStorage!.setString(key, jsonEncode(messagesToStore));
    } catch (e) {
      // Ignore cache errors
    }
  }

  /// Get all conversations for the current user
  Future<List<Conversation>> getConversations() async {
    try {
      final response = await _apiClient.get('/conversations');

      if (response.statusCode == 200) {
        final data = response.data['data'] as List;
        return data.map((json) => Conversation.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load conversations');
      }
    } on DioException catch (e) {
      throw Exception('Failed to load conversations: ${e.message}');
    }
  }

  /// Get a specific conversation by ID
  Future<Conversation> getConversation(String conversationId) async {
    try {
      final response = await _apiClient.get('/conversations/$conversationId');

      if (response.statusCode == 200) {
        final data = response.data['data'];
        return Conversation.fromJson(data);
      } else {
        throw Exception('Failed to load conversation');
      }
    } on DioException catch (e) {
      throw Exception('Failed to load conversation: ${e.message}');
    }
  }

  /// Create a new conversation with a user
  Future<Conversation> createConversation(String userId) async {
    try {
      final response = await _apiClient.post(
        '/conversations',
        data: {'userId': userId},
      );

      if (response.statusCode == 200) {
        final data = response.data['data'];
        return Conversation.fromJson(data);
      } else {
        throw Exception('Failed to create conversation');
      }
    } on DioException catch (e) {
      throw Exception('Failed to create conversation: ${e.message}');
    }
  }

  /// Mark a conversation as read
  Future<void> markAsRead(String conversationId) async {
    try {
      await _apiClient.put('/conversations/$conversationId/read');
    } on DioException catch (e) {
      throw Exception('Failed to mark conversation as read: ${e.message}');
    }
  }

  /// Get call history
  Future<List<Map<String, dynamic>>> getCallHistory() async {
    try {
      final response = await _apiClient.get('/conversations/calls');

      if (response.statusCode == 200) {
        final data = response.data['data'] as List;
        return data.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Failed to load call history');
      }
    } on DioException catch (e) {
      throw Exception('Failed to load call history: ${e.message}');
    }
  }

  /// Get messages for a conversation
  Future<List<Map<String, dynamic>>> getMessages(
    String conversationId, {
    int limit = 50,
    int offset = 0,
  }) async {
    try {
      final response = await _apiClient.get(
        '/conversations/$conversationId/messages',
        queryParameters: {
          'limit': limit,
          'offset': offset,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data['data'] as List;
        return data.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Failed to load messages');
      }
    } on DioException catch (e) {
      throw Exception('Failed to load messages: ${e.message}');
    }
  }

  /// Send a message to a conversation
  Future<Map<String, dynamic>> sendMessage(
    String conversationId,
    String content, {
    String type = 'text',
  }) async {
    try {
      final response = await _apiClient.post(
        '/conversations/$conversationId/messages',
        data: {
          'content': content,
          'type': type,
        },
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return response.data['data'] as Map<String, dynamic>;
      } else {
        throw Exception('Failed to send message');
      }
    } on DioException catch (e) {
      throw Exception('Failed to send message: ${e.message}');
    }
  }
}
