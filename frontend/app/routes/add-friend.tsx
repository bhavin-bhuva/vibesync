import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FriendCodeInput } from "../components/friends/friend-code-input";
import {
  FriendRequestNotification,
  type FriendRequest,
} from "../components/friends/friend-request-notification";
import * as friendService from "../services/friend.service";
import { getAccessToken } from "../services/auth.service";

export function meta() {
  return [
    { title: "Add Friend - VibeSync" },
    { name: "description", content: "Add friends on VibeSync" },
  ];
}

export default function AddFriend() {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Client-only components
  const [Components, setComponents] = useState<{
    QRScannerWrapper: any;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Load components client-side
    import("../components/friends/qr-scanner-wrapper").then((qrScannerMod) => {
      setComponents({
        QRScannerWrapper: qrScannerMod.QRScannerWrapper,
      });
    });

    // Load pending friend requests
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const requests = await friendService.getPendingFriendRequests();
      // Map API response to component type
      const mappedRequests = requests.map(req => ({
        id: req.id,
        userId: req.senderId,
        userName: req.senderName,
        userAvatar: req.senderAvatar,
        timestamp: new Date(req.createdAt),
      }));
      setFriendRequests(mappedRequests);
    } catch (error) {
      console.error("Failed to load friend requests:", error);
    }
  };

  const handleBack = () => {
    navigate("/conversations");
  };

  const handleScanSuccess = async (data: {
    userId: number;
    userName: string;
    friendCode: string;
  }) => {
    setShowScanner(false);
    await sendFriendRequestByCode(data.friendCode);
  };

  const handleManualSubmit = async (friendCode: string) => {
    await sendFriendRequestByCode(friendCode);
  };

  const sendFriendRequestByCode = async (friendCode: string) => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await friendService.sendFriendRequest(friendCode);
      showSuccess(`Friend request sent to ${result.recipient.name}!`);
    } catch (error: any) {
      showError(error.message || "Failed to send friend request");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      showSuccess("Friend request accepted!");
    } catch (error: any) {
      showError(error.message || "Failed to accept friend request");
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await friendService.declineFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      showSuccess("Friend request declined");
    } catch (error: any) {
      showError(error.message || "Failed to decline friend request");
    }
  };

  const handleDismissRequest = (requestId: number) => {
    setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
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
            <h2 className="text-xl font-bold text-white">Add Friend</h2>
          </div>
          {friendRequests.length > 0 && (
            <button
              onClick={() => navigate('/friend-requests')}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg transition-colors"
            >
              <span className="text-sm text-purple-300">Requests</span>
              <span className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                {friendRequests.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-8">


          {/* Scan QR Code Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Scan QR Code
            </h3>
            <button
              onClick={() => setShowScanner(true)}
              className="w-full py-4 px-6 glass-dark hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex items-center justify-center gap-3 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-colors">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Scan Friend's QR Code</p>
                <p className="text-sm text-gray-400">
                  Use your camera to scan
                </p>
              </div>
            </button>
          </section>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-gray-400 glass-dark">OR</span>
            </div>
          </div>

          {/* Manual Entry Section */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Enter Friend Code
            </h3>
            <FriendCodeInput onSubmit={handleManualSubmit} />
          </section>
        </div>
      </div>

      {/* QR Scanner Modal - Client-side only */}
      {showScanner && Components && (
        <Components.QRScannerWrapper
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Friend Request Notifications */}
      {friendRequests.map((request) => (
        <FriendRequestNotification
          key={request.id}
          request={request}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
          onDismiss={handleDismissRequest}
        />
      ))}

      {/* Success/Error Message */}
      {successMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="glass-dark border border-purple-500/50 rounded-lg px-6 py-3 shadow-2xl">
            <p className="text-white font-medium">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
