import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Avatar } from "../components/ui/avatar";
import * as friendService from "../services/friend.service";
import type { Friend } from "../services/friend.service";
import * as conversationService from "../services/conversation.service";

export function meta() {
  return [
    { title: "Friends - VibeSync" },
    { name: "description", content: "Your friends on VibeSync" },
  ];
}

export default function Friends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const friendsList = await friendService.getFriends();
      setFriends(friendsList);
    } catch (err: any) {
      setError(err.message || "Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/conversations");
  };

  const handleAddFriend = () => {
    navigate("/add-friend");
  };

  const handleStartConversation = async (friendId: string) => {
    try {
      // Create or get existing conversation
      const conversation = await conversationService.createConversation(friendId);
      navigate(`/conversations/${conversation.id}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      // We could set an error state here or show a toast
    }
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return "Never";
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-[100dvh] flex flex-col glass-dark overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Back to conversations"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-white">
              Friends ({friends.length})
            </h2>
          </div>
          <button
            onClick={handleAddFriend}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Add friend"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg
              className="w-16 h-16 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={loadFriends}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg
              className="w-20 h-20 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              No friends yet
            </h3>
            <p className="text-gray-400 mb-6">
              Add friends to start chatting and sharing moments
            </p>
            <button
              onClick={handleAddFriend}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              Add Your First Friend
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => handleStartConversation(friend.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={friend.avatar}
                    alt={friend.name}
                    size="lg"
                    online={friend.online}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">
                        {friend.name}
                      </h3>
                      {friend.online && (
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {friend.status}
                    </p>
                    {!friend.online && (
                      <p className="text-xs text-gray-500">
                        Last seen {formatLastSeen(friend.lastSeen)}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
