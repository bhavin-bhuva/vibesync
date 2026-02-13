// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'conversation_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Conversation _$ConversationFromJson(Map<String, dynamic> json) => Conversation(
      id: json['id'] as String,
      isGroup: json['isGroup'] as bool,
      name: json['name'] as String?,
      displayName: json['displayName'] as String?,
      displayAvatar: json['displayAvatar'] as String?,
      online: json['online'] as bool?,
      lastMessage: json['lastMessage'] as String?,
      unread: (json['unread'] as num?)?.toInt(),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      participants: (json['participants'] as List<dynamic>)
          .map((e) => Participant.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ConversationToJson(Conversation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'isGroup': instance.isGroup,
      'name': instance.name,
      'displayName': instance.displayName,
      'displayAvatar': instance.displayAvatar,
      'online': instance.online,
      'lastMessage': instance.lastMessage,
      'unread': instance.unread,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'participants': instance.participants,
    };

Participant _$ParticipantFromJson(Map<String, dynamic> json) => Participant(
      id: json['id'] as String,
      name: json['name'] as String,
      avatar: json['avatar'] as String?,
      online: json['online'] as bool,
    );

Map<String, dynamic> _$ParticipantToJson(Participant instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'avatar': instance.avatar,
      'online': instance.online,
    };
