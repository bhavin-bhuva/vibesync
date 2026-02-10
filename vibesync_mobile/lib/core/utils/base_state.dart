import 'package:equatable/equatable.dart';

/// Base class for all BLoC states
/// Uses Equatable for value equality comparison
abstract class BaseState extends Equatable {
  const BaseState();

  @override
  List<Object?> get props => [];
}

/// Initial state - used when BLoC is first created
class InitialState extends BaseState {
  const InitialState();
}

/// Loading state - used when an operation is in progress
class LoadingState extends BaseState {
  final String? message;

  const LoadingState({this.message});

  @override
  List<Object?> get props => [message];
}

/// Success state - used when an operation completes successfully
class SuccessState<T> extends BaseState {
  final T? data;
  final String? message;

  const SuccessState({this.data, this.message});

  @override
  List<Object?> get props => [data, message];
}

/// Error state - used when an operation fails
class ErrorState extends BaseState {
  final String message;
  final dynamic error;
  final StackTrace? stackTrace;

  const ErrorState({
    required this.message,
    this.error,
    this.stackTrace,
  });

  @override
  List<Object?> get props => [message, error, stackTrace];
}

/// Empty state - used when there's no data to display
class EmptyState extends BaseState {
  final String? message;

  const EmptyState({this.message});

  @override
  List<Object?> get props => [message];
}
