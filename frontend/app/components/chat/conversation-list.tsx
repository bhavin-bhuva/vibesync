import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Avatar } from "../ui/avatar";
import { BottomNav } from "./bottom-nav";
import { StatusList } from "./status-list";
import { CallHistoryList } from "./call-history-list";
import { SettingsList } from "./settings-list";

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  avatar?: string;
  status: string;
  online: boolean;
  friendCode: string;
}

// ... (omitting irrelevant parts, but since replace_file_content replaces a block, I must be careful)
// I will target the INTERFACE only first, then the JSX separately if needed or together if contiguous.
// They are not contiguous. I will use multi_replace.
interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null | undefined;
  onConversationSelect: (id: string) => void;
  currentUser: CurrentUser;
  onBack?: () => void;
  showBackButton?: boolean;
  onStatusClick?: () => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onConversationSelect,
  currentUser,
  onBack,
  showBackButton = false,
  onStatusClick,
}: ConversationListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get active tab from URL search params, default to "chats"
  const activeTab = (searchParams.get("tab") as "chats" | "status" | "calls" | "settings") || "chats";

  const filteredConversations = conversations
    .filter((conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by unread status first (unread conversations at top)
      if (a.unread > 0 && b.unread === 0) return -1;
      if (a.unread === 0 && b.unread > 0) return 1;
      // If both have unread or both don't, maintain original order
      return 0;
    });

  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <svg
                  className="w-16 h-16 mb-4 opacity-50"
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
                <p className="text-center">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-l-2 ${
                    activeConversationId === conversation.id
                      ? "bg-gray-100 dark:bg-white/5 border-purple-500"
                      : "border-transparent"
                  }`}
                >
                  <Avatar
                    src={conversation.avatar}
                    alt={conversation.name}
                    size="md"
                    online={conversation.isGroup ? undefined : conversation.online}
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversation.name}
                      </h4>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage.replace(/<[^>]*>?/gm, '')}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center px-1.5">
                          {conversation.unread > 99
                            ? "99+"
                            : conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        );
      case "status":
        return <StatusList />;
      case "calls":
        return <CallHistoryList />;
      case "settings":
        return <SettingsList currentUser={currentUser} />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "chats":
        return "Messages";
      case "status":
        return "Status";
      case "calls":
        return "Calls";
      case "settings":
        return "Settings";
    }
  };

  return (
    <div className="h-screen flex flex-col glass-dark border-l border-gray-200 dark:border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            >
              <svg
                className="w-5 h-5 text-gray-900 dark:text-white"
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
          )}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            {getHeaderTitle()}
          </h2>
          {activeTab === "chats" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/friend-requests")}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Friend requests"
              >
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {/* Notification badge - you can add state to show count */}
                {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span> */}
              </button>
              <button
                onClick={() => navigate("/add-friend")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Add friend"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Search Bar - Only show for chats */}
        {activeTab === "chats" && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <svg
              className="w-5 h-5 text-gray-500 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Render Content based on active tab */}
      {renderContent()}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setSearchParams({ tab })} />
    </div>
  );
}
