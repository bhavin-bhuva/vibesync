import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/conversations-index";
import { ConversationList, type Conversation, type CurrentUser } from "../components/chat/conversation-list";
import * as userService from "../services/user.service";
import * as conversationService from "../services/conversation.service";
import * as friendService from "../services/friend.service";
import { initSocket } from "../socket";
import { LoadingOverlay } from "../components/ui/loading-overlay";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conversations - VibeSync" },
    { name: "description", content: "Your conversations on VibeSync" },
  ];
}

export default function ConversationsIndex() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    loadData();
  }, []);

  // Socket Listener for Updates
  useEffect(() => {
    const token = localStorage.getItem('vibesync_access_token');
    if (!token) return;

    const socket = initSocket(token);

    const handleConversationUpdate = (data: any) => {
        setConversations(prev => {
            const index = prev.findIndex(c => c.id === data.conversationId);
            if (index === -1) {
                // New conversation or not in list - reload to be safe
                loadData(); 
                return prev;
            }

            const updated = [...prev];
            // Move to top and update last message
            const convo = { ...updated[index] };
            convo.lastMessage = data.lastMessage.content;
            convo.timestamp = "Just now";
            convo.unread = (convo.unread || 0) + 1;
            
            updated.splice(index, 1);
            updated.unshift(convo);
            
            return updated;
        });
    };

    socket.on('conversation_updated', handleConversationUpdate);

    return () => {
        socket.off('conversation_updated', handleConversationUpdate);
    };
  }, []);

  const formatLastSeen = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 60000) return "Just now";
    return date.toLocaleDateString();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      const user = await userService.getCurrentUser();
      setCurrentUser({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        online: user.online,
        friendCode: user.friendCode,
      });

      const [apiConversations, friends] = await Promise.all([
        conversationService.getConversations(),
        friendService.getFriends()
      ]);
      
      const conversationsMap = new Map();
      const realConversationFriendIds = new Set();
      
      apiConversations.forEach((conv: any) => {
        const friendId = conv.participants.find((p: any) => p.id !== user.id)?.id;
        if (friendId) realConversationFriendIds.add(friendId);

        conversationsMap.set(conv.id, { 
             id: conv.id,
             name: conv.displayName || "Unknown",
             avatar: conv.displayAvatar,
             lastMessage: conv.lastMessage || "No messages yet",
             timestamp: formatLastSeen(conv.updatedAt),
             unread: conv.unread || 0,
             online: conv.online || false,
        });
      });

      const mergedList: Conversation[] = [...conversationsMap.values()];

      for (const friend of friends) {
          // Check if we already have a conversation with this friend
          if (!realConversationFriendIds.has(friend.id)) {
              // Add as potential conversation
              mergedList.push({
                  id: `friend:${friend.id}`, // Prefix ID
                  name: friend.name,
                  avatar: friend.avatar,
                  lastMessage: "Start a conversation",
                  timestamp: "", 
                  unread: 0,
                  online: friend.online,
              });
          }
      }
      
      // Sort: Real conversations (without friend: prefix) first, then potential
      const realConvos = mergedList.filter(c => !c.id.startsWith("friend:"));
      const potentialConvos = mergedList.filter(c => c.id.startsWith("friend:"));
      
      setConversations([...realConvos, ...potentialConvos]);

    } catch (error) {
      console.error('Failed to load data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = async (id: string) => {
    if (id.startsWith("friend:")) {
        try {
            const friendId = id.split(":")[1];
            // Create or get existing conversation
            const conversation = await conversationService.createConversation(friendId);
            navigate(`/conversations/${conversation.id}`);
        } catch (error) {
            console.error("Failed to start conversation:", error);
        }
    } else {
        navigate(`/conversations/${id}`);
    }
  };

  return (
    <div className="flex w-full h-full relative">
      {(loading || !currentUser) && <LoadingOverlay />}

      <div className="hidden lg:flex flex-1 h-full items-center justify-center glass-dark">
        <div className="text-center max-w-md px-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-purple-400"
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
          <h3 className="text-2xl font-bold text-white mb-2">
            {conversations.length === 0 ? "No conversations yet" : "Select a conversation"}
          </h3>
          <p className="text-gray-400">
            {conversations.length === 0 
              ? "Start talking with your friends!"
              : "Choose a conversation from the list to start messaging"
            }
          </p>
          {conversations.length === 0 && (
            <button
              onClick={() => navigate("/friend-requests")} // Changed from add-friends to match nav
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              Find Friends
            </button>
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 h-full">
        {currentUser ? (
          <ConversationList
            conversations={conversations}
            activeConversationId={null}
            onConversationSelect={handleConversationSelect}
            currentUser={currentUser}
            onStatusClick={() => navigate("/status")}
          />
        ) : (
            <div className="h-full w-full bg-gray-50 dark:bg-white/5 animate-pulse" />
        )}
      </div>
    </div>
  );
}
