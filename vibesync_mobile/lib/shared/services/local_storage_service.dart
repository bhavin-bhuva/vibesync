import 'package:shared_preferences/shared_preferences.dart';

/// Service for managing local storage using SharedPreferences
/// Used for non-sensitive data like settings, preferences, cache
class LocalStorageService {
  SharedPreferences? _prefs;

  /// Initialize the storage service
  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  /// Ensure preferences are initialized
  SharedPreferences get _preferences {
    if (_prefs == null) {
      throw Exception('LocalStorageService not initialized. Call init() first.');
    }
    return _prefs!;
  }

  // ============================================================================
  // STRING OPERATIONS
  // ============================================================================

  /// Save a string value
  Future<bool> setString(String key, String value) async {
    return await _preferences.setString(key, value);
  }

  /// Get a string value
  String? getString(String key) {
    return _preferences.getString(key);
  }

  // ============================================================================
  // BOOLEAN OPERATIONS
  // ============================================================================

  /// Save a boolean value
  Future<bool> setBool(String key, bool value) async {
    return await _preferences.setBool(key, value);
  }

  /// Get a boolean value
  bool? getBool(String key) {
    return _preferences.getBool(key);
  }

  // ============================================================================
  // INTEGER OPERATIONS
  // ============================================================================

  /// Save an integer value
  Future<bool> setInt(String key, int value) async {
    return await _preferences.setInt(key, value);
  }

  /// Get an integer value
  int? getInt(String key) {
    return _preferences.getInt(key);
  }

  // ============================================================================
  // DOUBLE OPERATIONS
  // ============================================================================

  /// Save a double value
  Future<bool> setDouble(String key, double value) async {
    return await _preferences.setDouble(key, value);
  }

  /// Get a double value
  double? getDouble(String key) {
    return _preferences.getDouble(key);
  }

  // ============================================================================
  // LIST OPERATIONS
  // ============================================================================

  /// Save a list of strings
  Future<bool> setStringList(String key, List<String> value) async {
    return await _preferences.setStringList(key, value);
  }

  /// Get a list of strings
  List<String>? getStringList(String key) {
    return _preferences.getStringList(key);
  }

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  /// Check if a key exists
  bool containsKey(String key) {
    return _preferences.containsKey(key);
  }

  /// Remove a specific key
  Future<bool> remove(String key) async {
    return await _preferences.remove(key);
  }

  /// Clear all data
  Future<bool> clear() async {
    return await _preferences.clear();
  }

  /// Get all keys
  Set<String> getKeys() {
    return _preferences.getKeys();
  }

  /// Reload preferences from disk
  Future<void> reload() async {
    await _preferences.reload();
  }
}
