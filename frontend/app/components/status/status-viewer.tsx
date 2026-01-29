import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "../ui/avatar";

export interface StatusContent {
  id: number | string;
  type: "image" | "video";
  url?: string;
  backgroundColor: string;
  timestamp: string;
}

export interface StatusViewerProps {
  userName: string;
  userAvatar?: string;
  content: StatusContent[];
  onClose: () => void;
  onComplete?: () => void;
}

export function StatusViewer({
  userName,
  userAvatar,
  content,
  onClose,
  onComplete,
}: StatusViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const DURATION = 5000; // 5 seconds per status
  const INTERVAL = 50; // Update every 50ms

  const lastIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (isPaused) return;

    // Reset progress only when index actually changes
    if (lastIndexRef.current !== currentIndex) {
      setProgress(0);
      lastIndexRef.current = currentIndex;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = (INTERVAL / DURATION) * 100;
        const newProgress = prev + increment;

        if (newProgress >= 100) {
          // Move to next status
          if (currentIndex < content.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            return 0;
          } else {
            // All statuses viewed for this user - defer onComplete to avoid React warning
            setTimeout(() => {
              onComplete?.();
            }, 0);
            return 100;
          }
        }

        return newProgress;
      });
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [currentIndex, content.length, isPaused, onComplete]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 3) {
      handlePrevious();
    } else if (clickX > (width * 2) / 3) {
      handleNext();
    }
  };

  // Safety check for content
  if (!content || content.length === 0) {
    onClose();
    return null;
  }

  const currentContent = content[currentIndex];

  // Safety check for currentContent
  if (!currentContent) {
    onClose();
    return null;
  }


  return createPortal(
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
        {content.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={userAvatar} alt={userName} size="sm" />
            <div>
              <h3 className="text-white font-medium">{userName}</h3>
              <p className="text-white/70 text-xs">
                {currentContent.timestamp}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-white"
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
      </div>

      {/* Status content */}
      <div
        className="flex-1 flex items-center justify-center cursor-pointer"
        onClick={handleAreaClick}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Placeholder content with background color */}
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: currentContent.backgroundColor }}
        >
          {currentContent.type === "image" ? (
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-white/70 text-sm">Status Image {currentIndex + 1}</p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-white/70 text-sm">Status Video {currentIndex + 1}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/50 text-sm">
          Tap left or right to navigate • Hold to pause
        </p>
      </div>
    </div>,
    document.body
  );
}
