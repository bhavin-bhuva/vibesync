import { useState } from "react";
import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  userId: number;
  userName: string;
  friendCode: string;
}

export function QRCodeDisplay({ userId, userName, friendCode }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  // Encode user data as JSON for QR code
  const qrData = JSON.stringify({
    type: "vibesync_friend",
    userId,
    friendCode,
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(friendCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* QR Code Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl" />
        <div className="relative glass-dark p-6 rounded-3xl border-2 border-white/20">
          <QRCode
            value={qrData}
            size={256}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ borderRadius: "0.75rem" }}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{userName}</h3>
        <p className="text-sm text-gray-400">Scan this code to add me as a friend</p>
      </div>

      {/* Friend Code Display */}
      <div className="w-full max-w-sm">
        <div className="glass-dark rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Your Friend Code</p>
              <p className="text-lg font-mono font-semibold text-white tracking-wider">
                {friendCode}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Copy friend code"
            >
              {copied ? (
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
