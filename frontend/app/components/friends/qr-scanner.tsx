import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (data: { userId: number; userName: string; friendCode: string }) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false); // Prevent multiple initializations
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    // Prevent multiple scanner initializations
    if (isStartingRef.current) return;
    
    let isMounted = true;
    
    const startScanner = async () => {
      // Small delay to ensure previous cleanup is done
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isMounted) return;
      
      isStartingRef.current = true;
      
      try {
        // Clear any existing instance first
        try {
            await new Html5Qrcode(qrCodeRegionId).clear();
        } catch (e) {
            // Ignore clear errors
        }

        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (isMounted) handleScan(decodedText);
          },
          (errorMessage) => {
            // Ignore scan errors
          }
        );
      } catch (err: any) {
        console.error("Scanner error:", err);
        if (isMounted) {
            if (err?.name === "NotAllowedError") {
              setError("Camera permission denied. Please allow camera access to scan QR codes.");
            } else if (err?.name === "NotFoundError") {
              setError("No camera found. Please ensure your device has a camera.");
            } else {
              setError("Failed to access camera. Please try again.");
            }
        }
      } finally {
        isStartingRef.current = false;
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      isStartingRef.current = false;
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        try {
          // Check if scanner is actually running before trying to stop
          // State 2 is SCANNING, 1 is PAUSED
          if (scanner.getState && scanner.getState() === 2) {
            scanner
              .stop()
              .then(() => scanner.clear())
              .catch((err) => {
                console.debug("Failed to stop scanner on cleanup:", err);
                scanner.clear();
              });
          } else {
            scanner.clear();
          }
        } catch (e) {
          console.debug("Error during scanner cleanup:", e);
        }
        scannerRef.current = null;
      }
    };
  }, []);

  const handleScan = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);

      // Validate that this is a VibeSync friend QR code
      if (data.type === "vibesync_friend" && data.userId && data.userName && data.friendCode) {
        setScanning(false);
        if (scannerRef.current) {
          const scanner = scannerRef.current;
          // Only stop if scanner is running
          if (scanner.getState && scanner.getState() === 2) {
            scanner.stop().catch((err) => {
              console.debug("Error stopping scanner after scan:", err);
            });
          }
        }
        onScanSuccess({
          userId: data.userId,
          userName: data.userName,
          friendCode: data.friendCode,
        });
      } else {
        setError("Invalid QR code. Please scan a VibeSync friend code.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("Invalid QR code format. Please scan a VibeSync friend code.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleClose = () => {
    if (scannerRef.current) {
      const scanner = scannerRef.current;
      // Only stop if scanner is actually running
      if (scanner.getState && scanner.getState() === 2) {
        scanner.stop().catch((err) => {
          console.debug("Error stopping scanner on close:", err);
        });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden">
      <style>{`
        #qr-reader {
          border: none !important;
        }
        #qr-reader video {
          object-fit: cover;
          border-radius: 0.75rem;
          /* Force no mirror and correct orientation */
          transform: none !important;
          -webkit-transform: none !important;
        }
      `}</style>

      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-4 flex items-center justify-between glass-dark border-b border-gray-200 dark:border-white/10 z-20 relative text-gray-900 dark:text-white">
        <h2 className="text-xl font-bold">Scan QR Code</h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close scanner"
        >
          <svg
            className="w-6 h-6"
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

      {/* Scanner Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 bg-black">
        {scanning && (
          <div className="relative w-full max-w-sm aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Scanner Container */}
            <div id={qrCodeRegionId} className="w-full h-full" />

            {/* Scanning Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Corner borders */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-500 rounded-tl-2xl opacity-80" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-purple-500 rounded-tr-2xl opacity-80" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-purple-500 rounded-bl-2xl opacity-80" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-500 rounded-br-2xl opacity-80" />
              
              {/* Scanning Laser Animation */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 shadow-[0_0_15px_2px_rgba(168,85,247,0.6)] animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            
            {/* Guide Text inside camera view */}
            <div className="absolute bottom-6 left-0 right-0 text-center z-10">
              <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs text-white/80">
                Align QR code within frame
              </span>
            </div>
          </div>
        )}

        {/* Success State */}
        {!scanning && !error && (
          <div className="text-center p-8 glass-dark rounded-2xl border border-white/10 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center ring-4 ring-green-500/10">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-white text-xl font-bold mb-2">Scanned Successfully!</p>
            <p className="text-gray-400 text-sm">Redirecting...</p>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-8 glass-dark border-t border-white/10 z-10 text-center">
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Place the QR code inside the square area to scan it automatically.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-32 left-4 right-4 z-50 animate-fade-in mx-auto max-w-md">
          <div className="glass-dark border border-red-500/30 bg-red-500/10 backdrop-blur-xl rounded-xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500/20 rounded-full shrink-0">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className="text-white font-medium text-sm">Scanner Error</h4>
                <p className="text-red-200 text-sm mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
