import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../constants/api_constants.dart';

/// API client for making HTTP requests to the VibeSync backend
/// Uses Dio for HTTP communication with interceptors for auth and logging
class ApiClient {
  late final Dio _dio;
  String? _authToken;

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: ApiConstants.connectTimeout,
        receiveTimeout: ApiConstants.receiveTimeout,
        sendTimeout: ApiConstants.sendTimeout,
        headers: {
          ApiConstants.contentTypeHeader: ApiConstants.applicationJson,
          ApiConstants.acceptHeader: ApiConstants.applicationJson,
        },
      ),
    );

    // Add interceptors
    _dio.interceptors.add(_AuthInterceptor(this));
    
    // Add logging interceptor only in debug mode
    if (kDebugMode) {
      _dio.interceptors.add(LogInterceptor(
        request: true,
        requestHeader: true,
        requestBody: true,
        responseHeader: true,
        responseBody: true,
        error: true,
        logPrint: (obj) => debugPrint(obj.toString()),
      ));
    }
  }

  /// Set the authentication token
  void setAuthToken(String token) {
    _authToken = token;
  }

  /// Clear the authentication token
  void clearAuthToken() {
    _authToken = null;
  }

  /// Get the current authentication token
  String? get authToken => _authToken;

  /// GET request
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// POST request
  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// PUT request
  Future<Response> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// PATCH request
  Future<Response> patch(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.patch(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// DELETE request
  Future<Response> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.delete(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Upload file with multipart/form-data
  Future<Response> uploadFile(
    String path,
    String filePath,
    String fieldName, {
    Map<String, dynamic>? data,
    ProgressCallback? onSendProgress,
  }) async {
    try {
      final formData = FormData.fromMap({
        fieldName: await MultipartFile.fromFile(filePath),
        if (data != null) ...data,
      });

      return await _dio.post(
        path,
        data: formData,
        options: Options(
          contentType: ApiConstants.multipartFormData,
        ),
        onSendProgress: onSendProgress,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Handle Dio errors and convert to app-specific exceptions
  Exception _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return ApiException(
          message: 'Connection timeout. Please check your internet connection.',
          statusCode: 408,
        );

      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode ?? 0;
        final data = error.response?.data;
        
        String message = 'An error occurred';
        if (data is Map<String, dynamic>) {
          message = data['message'] ?? data['error'] ?? message;
        } else if (data != null) {
          message = data.toString();
        }
        
        return ApiException(
          message: message,
          statusCode: statusCode,
          data: data,
        );

      case DioExceptionType.cancel:
        return ApiException(
          message: 'Request cancelled',
          statusCode: 0,
        );

      case DioExceptionType.connectionError:
        return ApiException(
          message: 'No internet connection. Please check your network.',
          statusCode: 0,
        );

      case DioExceptionType.badCertificate:
        return ApiException(
          message: 'Security certificate error',
          statusCode: 0,
        );

      case DioExceptionType.unknown:
      default:
        return ApiException(
          message: error.message ?? 'An unexpected error occurred',
          statusCode: 0,
        );
    }
  }
}

/// Authentication interceptor to add JWT token to requests
class _AuthInterceptor extends Interceptor {
  final ApiClient _apiClient;

  _AuthInterceptor(this._apiClient);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Add auth token to headers if available
    if (_apiClient.authToken != null) {
      options.headers[ApiConstants.authorizationHeader] = 
          'Bearer ${_apiClient.authToken}';
    }
    
    super.onRequest(options, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Handle 401 Unauthorized - token expired or invalid
    if (err.response?.statusCode == 401) {
      // Clear the token
      _apiClient.clearAuthToken();
      
      // TODO: Trigger logout or token refresh
      // This will be implemented when we add authentication state management
    }
    
    super.onError(err, handler);
  }
}

/// Custom API exception class
class ApiException implements Exception {
  final String message;
  final int statusCode;
  final dynamic data;

  ApiException({
    required this.message,
    required this.statusCode,
    this.data,
  });

  @override
  String toString() => 'ApiException: $message (Status: $statusCode)';

  /// Check if this is a network error
  bool get isNetworkError => statusCode == 0;

  /// Check if this is a server error (5xx)
  bool get isServerError => statusCode >= 500 && statusCode < 600;

  /// Check if this is a client error (4xx)
  bool get isClientError => statusCode >= 400 && statusCode < 500;

  /// Check if this is unauthorized (401)
  bool get isUnauthorized => statusCode == 401;

  /// Check if this is forbidden (403)
  bool get isForbidden => statusCode == 403;

  /// Check if this is not found (404)
  bool get isNotFound => statusCode == 404;
}
