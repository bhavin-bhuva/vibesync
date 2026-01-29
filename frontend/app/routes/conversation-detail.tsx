import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import type { Route } from "./+types/conversation-detail";
import { ConversationList, type Conversation, type CurrentUser } from "../components/chat/conversation-list";
import { MessageArea } from "../components/chat/message-area";
import { MessageInput } from "../components/chat/message-input";
import * as userService from "../services/user.service";
import * as conversationService from "../services/conversation.service";
import * as messageService from "../services/message.service";
import { initSocket } from "../socket";
import { LoadingOverlay } from "../components/ui/loading-overlay";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Chat - VibeSync` },
    { name: "description", content: "Chat on VibeSync" },
  ];
}

export default function ConversationDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const conversationId = params.conversationId;

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper functions defined before usage to avoid closure issues, or defined inside component scope
  const formatLastSeen = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 60000) return "Just now";
    return date.toLocaleDateString();
  };

  const mapConversation = (conv: any): Conversation => ({
    id: conv.id,
    name: conv.displayName || "Unknown",
    avatar: conv.displayAvatar,
    lastMessage: typeof conv.lastMessage === 'string' 
        ? conv.lastMessage 
        : conv.lastMessage?.content || "No messages yet",
    timestamp: formatLastSeen(conv.updatedAt),
    unread: conv.unread || 0,
    online: conv.online || false,
    isGroup: conv.isGroup,
  });

  const formatTime = (dateString: string): string => {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const mapMessage = (msg: any, user: CurrentUser | null) => ({
      id: msg.id,
      senderId: msg.senderId,
      sender: msg.senderId === user?.id ? "me" as const : "other" as const,
      text: msg.content,
      timestamp: formatTime(msg.createdAt),
      senderName: msg.senderId === user?.id ? "You" : "Friend",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Load User
      const user = await userService.getCurrentUser();
      const mappedUser = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        online: user.online,
        friendCode: user.friendCode,
      };
      setCurrentUser(mappedUser);

      // 2. Load Conversation List
      const apiConversations = await conversationService.getConversations();
      const mappedConversations = apiConversations.map(mapConversation);
      setConversations(mappedConversations);

      // 3. Load Active Conversation Details
      if (conversationId) {
        let active = mappedConversations.find(c => c.id === conversationId);
        
        if (!active) {
            try {
                const apiConv = await conversationService.getConversation(conversationId);
                active = mapConversation(apiConv);
                setConversations(prev => [active!, ...prev]);
            } catch (err) {
                console.error("Failed to fetch active conversation", err);
            }
        }
        setActiveConversation(active || null);

        // 4. Load Messages
        if (active) {
            // Mark as read immediately & optimistically clear unread count
            conversationService.markAsRead(conversationId).catch(err => console.error("Failed to mark read:", err));
            
            setConversations(prev => prev.map(c => 
                c.id === conversationId ? { ...c, unread: 0 } : c
            ));
            
            const apiMessages = await messageService.getMessages(conversationId);
            setMessages(apiMessages.map(msg => mapMessage(msg, mappedUser)).reverse());
        }
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Initial Data Load
  useEffect(() => {
    loadData();
  }, [conversationId]);
  
  // Socket Connection Handling
  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const token = localStorage.getItem('vibesync_access_token');
    if (!token) return;

    const socket = initSocket(token);

    socket.emit('join_conversation', conversationId);

    const handleNewMessage = (message: any) => {
        if (message.senderId === currentUser?.id) return;

        // Mark as read immediately since we are viewing the conversation
        conversationService.markAsRead(conversationId).catch(err => console.error("Failed to mark read:", err));

        setMessages(prev => {
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, mapMessage(message, currentUser)];
        });
    };

    socket.on('new_message', handleNewMessage);

    return () => {
        socket.emit('leave_conversation', conversationId);
        socket.off('new_message', handleNewMessage);
    };
  }, [currentUser?.id, conversationId]);

  const handleConversationSelect = (id: string) => {
    navigate(`/conversations/${id}`);
  };

  const handleBackToList = () => {
    navigate("/conversations");
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUser || !conversationId) return;

    // Optimistic UI update
    const tempId = Date.now().toString(); // use string for temp ID to match type
    const optimisticMsg = {
        id: tempId,
        sender: "me" as const,
        senderId: currentUser.id,
        text,
        timestamp: "Sending...",
        senderName: "You"
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
        const newMsg = await messageService.sendMessage(conversationId, text);
        setMessages(prev => prev.map(m => m.id === tempId ? mapMessage(newMsg, currentUser) : m));
    } catch (error) {
        console.error("Failed to send message", error);
        setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (!loading && !activeConversation) {
    return (
      <div className="flex-1 h-full flex items-center justify-center glass-dark">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Conversation not found</h2>
            <button onClick={handleBackToList} className="text-purple-400 hover:text-purple-300">Back to conversations</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full relative">
      {(loading || !currentUser) && <LoadingOverlay />}

      {/* Chat View */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {activeConversation ? (
            <>
                <MessageArea
                contactName={activeConversation.name}
                contactAvatar={activeConversation.avatar}
                contactOnline={activeConversation.online}
                messages={messages} 
                onBack={handleBackToList}
                showBackButton={true}
                />
                <MessageInput onSendMessage={handleSendMessage} />
            </>
        ) : (
            // Chat Skeleton
            <div className="flex-1 flex flex-col h-full animate-pulse">
                <div className="h-16 border-b border-gray-700/20 glass-dark" />
                <div className="flex-1 bg-white/5" />
                <div className="h-20 border-t border-gray-700/20 glass-dark" />
            </div>
        )}
      </div>

      {/* Conversation List */}
      <div className="hidden lg:block lg:w-96 h-full">
        {currentUser ? (
            <ConversationList
            conversations={conversations}
            activeConversationId={conversationId} 
            onConversationSelect={handleConversationSelect}
            currentUser={currentUser}
            onStatusClick={() => navigate("/status")}
            />
        ) : (
             <div className="h-full w-full bg-white/5 animate-pulse" />
        )}
      </div>
    </div>
  );
}
