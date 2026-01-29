import { useEffect, useState } from "react";
import { Avatar } from "../ui/avatar";

export interface FriendRequest {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
}

interface FriendRequestNotificationProps {
  request: FriendRequest;
  onAccept: (requestId: number) => void;
  onDecline: (requestId: number) => void;
  onDismiss: (requestId: number) => void;
  autoDismissMs?: number;
}

export function FriendRequestNotification({
  request,
  onAccept,
  onDecline,
  onDismiss,
  autoDismissMs = 10000,
}: FriendRequestNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleDismiss();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(request.id), 300);
  };

  const handleAccept = () => {
    onAccept(request.id);
    handleDismiss();
  };

  const handleDecline = () => {
    onDecline(request.id);
    handleDismiss();
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="glass-dark rounded-xl p-4 border border-purple-500/50 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <Avatar
            src={request.userAvatar}
            alt={request.userName}
            size="md"
            online={false}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">
              {request.userName}
            </h4>
            <p className="text-sm text-gray-400">wants to add you as a friend</p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
