import { useRef, useEffect } from "react";
import { Avatar } from "../ui/avatar";
import DOMPurify from "dompurify";

interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  timestamp: string;
  avatar?: string;
  senderName?: string;
  type?: string;
}

interface MessageAreaProps {
  contactName: string;
  contactAvatar?: string;
  contactOnline: boolean;
  messages: Message[];
  onBack?: () => void;
  showBackButton?: boolean;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

export function MessageArea({
  contactName,
  contactAvatar,
  contactOnline,
  messages,
  onBack,
  showBackButton = false,
  onVoiceCall,
  onVideoCall,
}: MessageAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200 dark:border-white/10 glass-dark bg-opacity-95 backdrop-blur-md">
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
            <button 
              onClick={onVoiceCall}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-purple-400 hover:text-purple-300"
              title="Voice Call"
            >
              <svg
                className="w-5 h-5"
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
            <button 
              onClick={onVideoCall}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-purple-400 hover:text-purple-300"
              title="Video Call"
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
          if (message.type === 'system') {
            return (
              <div key={message.id} className="flex justify-center my-4">
                <span className="bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs py-1 px-3 rounded-full flex items-center gap-1.5">
                   {message.text.includes('started') && (
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   )}
                   {message.text.includes('ended') && (
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21L8.228 3.683A1 1 0 007.28 3H5z" /></svg>
                   )}
                   {message.text.includes('declined') && (
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   )}
                   {message.text} • {message.timestamp}
                </span>
              </div>
            );
          }

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
                  } max-w-none text-sm break-words message-content shadow-sm`}
                >
                    {/* Render HTML safely-ish */}
                    <div 
                        dangerouslySetInnerHTML={{ 
                          __html: typeof window !== 'undefined' ? DOMPurify.sanitize(message.text) : message.text 
                        }}
                        className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
                    />
                </div>
                <span className="text-xs text-gray-500 px-2 opacity-70">
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
