import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Service for managing secure storage using FlutterSecureStorage
/// Used for sensitive data like authentication tokens, passwords
class SecureStorageService {
  late final FlutterSecureStorage _storage;

  SecureStorageService() {
    _storage = const FlutterSecureStorage(
      aOptions: AndroidOptions(
        encryptedSharedPreferences: true,
      ),
      iOptions: IOSOptions(
        accessibility: KeychainAccessibility.first_unlock,
      ),
    );
  }

  // ============================================================================
  // WRITE OPERATIONS
  // ============================================================================

  /// Write a value to secure storage
  Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Write multiple values to secure storage
  Future<void> writeAll(Map<String, String> data) async {
    for (final entry in data.entries) {
      await write(entry.key, entry.value);
    }
  }

  // ============================================================================
  // READ OPERATIONS
  // ============================================================================

  /// Read a value from secure storage
  Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }

  /// Read all values from secure storage
  Future<Map<String, String>> readAll() async {
    return await _storage.readAll();
  }

  // ============================================================================
  // DELETE OPERATIONS
  // ============================================================================

  /// Delete a specific key from secure storage
  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }

  /// Delete all data from secure storage
  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  /// Check if a key exists in secure storage
  Future<bool> containsKey(String key) async {
    return await _storage.containsKey(key: key);
  }

  // ============================================================================
  // TOKEN MANAGEMENT (Convenience methods)
  // ============================================================================

  /// Save authentication tokens
  Future<void> saveTokens({
    required String accessToken,
    String? refreshToken,
  }) async {
    await write('access_token', accessToken);
    if (refreshToken != null) {
      await write('refresh_token', refreshToken);
    } else {
      await delete('refresh_token');
    }
  }

  /// Get access token
  Future<String?> getAccessToken() async {
    return await read('access_token');
  }

  /// Get refresh token
  Future<String?> getRefreshToken() async {
    return await read('refresh_token');
  }

  /// Delete all tokens
  Future<void> deleteTokens() async {
    await delete('access_token');
    await delete('refresh_token');
  }

  /// Check if user has valid tokens
  Future<bool> hasTokens() async {
    final accessToken = await getAccessToken();
    return accessToken != null && accessToken.isNotEmpty;
  }
}
