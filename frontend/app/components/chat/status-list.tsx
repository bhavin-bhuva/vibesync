import { useState } from "react";
import { StatusViewer, type StatusContent } from "../status/status-viewer";

interface StatusItem {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  viewed: boolean;
  statusCount: number;
  content: StatusContent[];
}

const mockStatuses: StatusItem[] = [
  {
    id: 1,
    userId: 1,
    userName: "Sarah Johnson",
    timestamp: "30m ago",
    viewed: false,
    statusCount: 3,
    content: [
      {
        id: 1,
        type: "image",
        backgroundColor: "#8B5CF6",
        timestamp: "30m ago",
      },
      {
        id: 2,
        type: "image",
        backgroundColor: "#EC4899",
        timestamp: "28m ago",
      },
      {
        id: 3,
        type: "video",
        backgroundColor: "#3B82F6",
        timestamp: "25m ago",
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    userName: "Mike Chen",
    timestamp: "2h ago",
    viewed: false,
    statusCount: 2,
    content: [
      {
        id: 4,
        type: "image",
        backgroundColor: "#10B981",
        timestamp: "2h ago",
      },
      {
        id: 5,
        type: "video",
        backgroundColor: "#F59E0B",
        timestamp: "2h ago",
      },
    ],
  },
  {
    id: 3,
    userId: 3,
    userName: "Emma Wilson",
    timestamp: "5h ago",
    viewed: true,
    statusCount: 1,
    content: [
      {
        id: 6,
        type: "image",
        backgroundColor: "#EF4444",
        timestamp: "5h ago",
      },
    ],
  },
  {
    id: 4,
    userId: 4,
    userName: "Alex Rodriguez",
    timestamp: "Yesterday",
    viewed: true,
    statusCount: 2,
    content: [
      {
        id: 7,
        type: "video",
        backgroundColor: "#6366F1",
        timestamp: "Yesterday",
      },
      {
        id: 8,
        type: "image",
        backgroundColor: "#14B8A6",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: 5,
    userId: 5,
    userName: "Lisa Anderson",
    timestamp: "Yesterday",
    viewed: false,
    statusCount: 3,
    content: [
      {
        id: 9,
        type: "image",
        backgroundColor: "#F97316",
        timestamp: "Yesterday",
      },
      {
        id: 10,
        type: "image",
        backgroundColor: "#A855F7",
        timestamp: "Yesterday",
      },
      {
        id: 11,
        type: "video",
        backgroundColor: "#06B6D4",
        timestamp: "Yesterday",
      },
    ],
  },
];

export function StatusList() {
  const [viewingStatus, setViewingStatus] = useState<StatusItem | null>(null);
  const [statuses, setStatuses] = useState(mockStatuses);

  const recentStatuses = statuses.filter((s) => !s.viewed);
  const viewedStatuses = statuses.filter((s) => s.viewed);

  const handleStatusClick = (status: StatusItem) => {
    setViewingStatus(status);
  };

  const handleCloseViewer = () => {
    setViewingStatus(null);
  };

  const handleStatusComplete = () => {
    if (viewingStatus) {
      // Mark current status as viewed
      setStatuses((prev) =>
        prev.map((s) =>
          s.id === viewingStatus.id ? { ...s, viewed: true } : s
        )
      );

      // Find the next unviewed status or the next status in the list
      const currentIndex = statuses.findIndex((s) => s.id === viewingStatus.id);
      const nextStatus = statuses[currentIndex + 1];

      if (nextStatus) {
        // Move to next user's status
        setViewingStatus(nextStatus);
      } else {
        // No more statuses, close the viewer
        setViewingStatus(null);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* My Status */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">My Status</h3>
        <button className="w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-lg transition-colors">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold ring-2 ring-white/20">
              JD
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-gray-900">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-medium text-gray-900 dark:text-white">My Status</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tap to add status update</p>
          </div>
        </button>
      </div>

      {/* Recent Updates */}
      {recentStatuses.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent</h3>
          <div className="space-y-2">
            {recentStatuses.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusClick(status)}
                className="w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-lg transition-colors"
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold ring-2 ${
                      status.viewed ? "ring-gray-600" : "ring-green-500"
                    }`}
                  >
                    {status.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {status.userName}
                  </h4>
                  <p className="text-sm text-gray-400">{status.timestamp}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Viewed Updates */}
      {viewedStatuses.length > 0 && (
        <div className="p-4 pt-0">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Viewed</h3>
          <div className="space-y-2">
            {viewedStatuses.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusClick(status)}
                className="w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-lg transition-colors opacity-75"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold ring-2 ring-gray-600">
                    {status.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {status.userName}
                  </h4>
                  <p className="text-sm text-gray-400">{status.timestamp}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for no statuses */}
      {statuses.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
          <svg
            className="w-24 h-24 mb-4 opacity-50"
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No status updates yet
          </h3>
          <p className="text-center text-gray-400">
            Share photos and videos with your contacts
          </p>
        </div>
      )}

      {/* Status Viewer */}
      {viewingStatus && (
        <StatusViewer
          userName={viewingStatus.userName}
          userAvatar={viewingStatus.userAvatar}
          content={viewingStatus.content}
          onClose={handleCloseViewer}
          onComplete={handleStatusComplete}
        />
      )}
    </div>
  );
}
