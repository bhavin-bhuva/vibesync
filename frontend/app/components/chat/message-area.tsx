import { useRef, useEffect } from "react";
import { Avatar } from "../ui/avatar";

interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  timestamp: string;
  avatar?: string;
  senderName?: string;
}

interface MessageAreaProps {
  contactName: string;
  contactAvatar?: string;
  contactOnline: boolean;
  messages: Message[];
  onBack?: () => void;
  showBackButton?: boolean;
}

export function MessageArea({
  contactName,
  contactAvatar,
  contactOnline,
  messages,
  onBack,
  showBackButton = false,
}: MessageAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10 glass-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
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
            <Avatar
              src={contactAvatar}
              alt={contactName}
              size="md"
              online={contactOnline}
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{contactName}</h3>
              <p className="text-sm text-gray-400">
                {contactOnline ? "Active now" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const showAvatar =
            message.sender === "other" &&
            (index === 0 || messages[index - 1].sender !== "other");

          return (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "other" && (
                <div className="flex-shrink-0">
                  {showAvatar ? (
                    <Avatar
                      src={message.avatar}
                      alt={message.senderName || "User"}
                      size="sm"
                    />
                  ) : (
                    <div className="w-8" />
                  )}
                </div>
              )}
              <div
                className={`max-w-md ${
                  message.sender === "me" ? "items-end" : "items-start"
                } flex flex-col gap-1`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.sender === "me"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm prose-invert"
                      : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-bl-sm"
                  } max-w-none text-sm break-words message-content`}
                >
                    {/* Render HTML safely-ish */}
                    <div 
                        dangerouslySetInnerHTML={{ __html: message.text }}
                        className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
                    />
                </div>
                <span className="text-xs text-gray-500 px-2">
                  {message.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        {/* Helper div for scrolling */}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
