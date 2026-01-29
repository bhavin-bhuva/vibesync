import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Avatar } from "../components/ui/avatar";
import * as friendService from "../services/friend.service";

export function meta() {
  return [
    { title: "Friend Requests - VibeSync" },
    { name: "description", content: "Manage your friend requests" },
  ];
}

interface FriendRequest {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  senderFriendCode: string;
  createdAt: string;
}

export default function FriendRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await friendService.getPendingFriendRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load friend requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: number) => {
    setProcessingId(requestId);
    try {
      await friendService.acceptFriendRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
      showToast("Friend request accepted!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to accept request", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: number) => {
    setProcessingId(requestId);
    try {
      await friendService.declineFriendRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
      showToast("Friend request declined", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to decline request", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    // Simple toast implementation - you can enhance this
    console.log(`${type}: ${message}`);
  };

  const handleBack = () => {
    navigate("/conversations");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
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
            Friend Requests {requests.length > 0 && `(${requests.length})`}
          </h2>
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
              onClick={loadRequests}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : requests.length === 0 ? (
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
              No pending requests
            </h3>
            <p className="text-gray-400 mb-6">
              You don't have any friend requests at the moment
            </p>
            <button
              onClick={() => navigate("/add-friend")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
            >
              Add Friends
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={request.senderAvatar}
                    alt={request.senderName}
                    size="lg"
                    online={false}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {request.senderName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {request.senderFriendCode}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(request.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={processingId === request.id}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {processingId === request.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Accept"
                    )}
                  </button>
                  <button
                    onClick={() => handleDecline(request.id)}
                    disabled={processingId === request.id}
                    className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
