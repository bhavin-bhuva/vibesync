import { useEffect, useState } from "react";

interface QRScannerWrapperProps {
  onScanSuccess: (data: { userId: number; userName: string; friendCode: string }) => void;
  onClose: () => void;
}

/**
 * Client-side only wrapper for QR Scanner to prevent SSR issues
 * This component dynamically imports the scanner only on the client
 */
export function QRScannerWrapper({ onScanSuccess, onClose }: QRScannerWrapperProps) {
  const [Scanner, setScanner] = useState<any>(null);
  
  useEffect(() => {
    // Only import scanner on client-side
    import("./qr-scanner").then((mod) => {
      setScanner(() => mod.QRScanner);
    });
  }, []);
  
  // Show loading state while scanner is being loaded
  if (!Scanner) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading scanner...</p>
        </div>
      </div>
    );
  }
  
  return <Scanner onScanSuccess={onScanSuccess} onClose={onClose} />;
}
