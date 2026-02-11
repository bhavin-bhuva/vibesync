import 'package:equatable/equatable.dart';

/// Base class for all BLoC events
/// Uses Equatable for value equality comparison
abstract class BaseEvent extends Equatable {
  const BaseEvent();

  @override
  List<Object?> get props => [];
}
