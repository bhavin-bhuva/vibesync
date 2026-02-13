import 'package:json_annotation/json_annotation.dart';

part 'conversation_model.g.dart';

@JsonSerializable()
class Conversation {
  final String id;
  final bool isGroup;
  final String? name;
  final String? displayName;
  final String? displayAvatar;
  final bool? online;
  final String? lastMessage;
  final int? unread;
  final DateTime updatedAt;
  final List<Participant> participants;

  Conversation({
    required this.id,
    required this.isGroup,
    this.name,
    this.displayName,
    this.displayAvatar,
    this.online,
    this.lastMessage,
    this.unread,
    required this.updatedAt,
    required this.participants,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) =>
      _$ConversationFromJson(json);

  Map<String, dynamic> toJson() => _$ConversationToJson(this);
}

@JsonSerializable()
class Participant {
  final String id;
  final String name;
  final String? avatar;
  final bool online;

  Participant({
    required this.id,
    required this.name,
    this.avatar,
    required this.online,
  });

  factory Participant.fromJson(Map<String, dynamic> json) =>
      _$ParticipantFromJson(json);

  Map<String, dynamic> toJson() => _$ParticipantToJson(this);
}
