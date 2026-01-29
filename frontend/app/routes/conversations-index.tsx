import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/conversations-index";
import { ConversationList, type Conversation, type CurrentUser } from "../components/chat/conversation-list";
import * as userService from "../services/user.service";
import * as conversationService from "../services/conversation.service";
import * as friendService from "../services/friend.service";
import { initSocket } from "../socket";

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
                // New conversation? We should probably reload or try to fetch it partially
                // For simplicity, just reload data if we don't have it
                loadData(); 
                return prev;
            }

            const updated = [...prev];
            // Move to top and update last message
            const convo = { ...updated[index] };
            convo.lastMessage = data.lastMessage.content; // Use content from message object
            convo.timestamp = "Just now";
            
            // Only increment unread if we aren't viewing it (handled by filtering usually, but here we are in index view)
            // Ideally we'd know if it's read or not. For index view, assume unread update implies unread++
            convo.unread = (convo.unread || 0) + 1;
            
            // Remove from old position and unshift to top
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

// ...

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      const user = await userService.getCurrentUser();
      setCurrentUser({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        online: user.online,
        friendCode: user.friendCode,
      });

      // Load BOTH conversations AND friends
      const [apiConversations, friends] = await Promise.all([
        conversationService.getConversations(),
        friendService.getFriends()
      ]);
      
      const conversationsMap = new Map();
      
      // 1. Add existing conversations
      apiConversations.forEach((conv: any) => {
        conversationsMap.set(conv.id, { // Note: ID key here is conversation ID
             id: conv.id,
             name: conv.displayName || "Unknown",
             avatar: conv.displayAvatar,
             lastMessage: conv.lastMessage || "No messages yet",
             timestamp: formatLastSeen(conv.updatedAt),
             unread: conv.unread || 0,
             online: conv.online || false,
             friendId: conv.participants.find((p: any) => p.id !== user.id)?.id // Store friendId to dedup
        });
      });

      // 2. Add friends who DON'T have a conversation yet
      // We need to create "fake" conversation objects for them that will trigger a create/get on click
      // BUT, checking if we already have a conversation with them is tricky without friendId in the conversation object
      // Let's assume we want to show ALL friends. If they have a conversation, use that. If not, show friend.
      
      // Since Conversations API didn't return friendId explicitly in the top level (it's in participants), 
      // we need to be careful. The `apiConversations` includes participants.
      
      const mergedList: Conversation[] = [...conversationsMap.values()];

      for (const friend of friends) {
          // Check if we already have a conversation with this friend
          const existingConvo = mergedList.find((c: any) => c.friendId === friend.id);
          
          if (!existingConvo) {
              // Create a placeholder conversation
              // We'll use a negative ID or a special flag to indicate it's not a real conversation yet
              // OR better: we keep the ID as friend ID but the onClick handler needs to know.
              // Actually, simply using the friend ID as a 'potential' conversation ID works 
              // IF the routing handles it. But routing expects conversation ID.
              // So, we should probably fetch/create the conversation ID on click from the friends list.
              // But here we want them IN the conversation list.
              
              // TRADEOFF: To make this seamless, let's just create conversations for all friends on the backend? 
              // No, that's spammy.
              
              // SOLUTION: We'll list them. When clicked, we route to `/conversations/friend:<friendId>` 
              // OR we just assume the user will go to "Friends" tab to start new chats.
              
              // BUT the user asked for friends to show up here. 
              // Let's add them with a special property. 
              // However, `ConversationList` expects `id` to be conversation ID.
              // If we pass `id: -friend.id`, we can detect it.
              
              mergedList.push({
                  id: -friend.id, // Negative ID indicates "Friend ID that needs conversation"
                  name: friend.name,
                  avatar: friend.avatar,
                  lastMessage: "Start a conversation",
                  timestamp: "", 
                  unread: 0,
                  online: friend.online,
              });
          }
      }
      
      // Sort: Real conversations (recent) first, then friends (alphabetical or standard)
      // Actually updated at is nice. Friends without convos can go at bottom.
      
      // setConversations(mergedList); -> We can't simplisticly sort.
      // Let's sort: real convos by timestamp desc, then friends by name
      
      const realConvos = mergedList.filter(c => c.id > 0);
      const potentialConvos = mergedList.filter(c => c.id < 0);
      
      setConversations([...realConvos, ...potentialConvos]);

    } catch (error) {
      console.error('Failed to load data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 60000) return "Just now";
    return date.toLocaleDateString();
  };

  const handleConversationSelect = async (id: number) => {
    // If ID is negative, it's a friend without a conversation yet
    if (id < 0) {
        try {
            const friendId = -id;
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

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen glass-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Placeholder for desktop - Hidden on mobile, LEFT side on desktop */}
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
              onClick={() => navigate("/add-friend")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              Find Friends
            </button>
          )}
        </div>
      </div>

      {/* Conversation List - Shows on mobile, RIGHT side on desktop */}
      <div className="w-full lg:w-96 h-full">
        <ConversationList
          conversations={conversations}
          activeConversationId={null}
          onConversationSelect={handleConversationSelect}
          currentUser={currentUser}
          onStatusClick={() => navigate("/status")}
        />
      </div>
    </>
  );
}
