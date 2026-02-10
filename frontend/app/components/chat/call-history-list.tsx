

// Mock calls removed
import * as conversationService from "../../services/conversation.service";
import { useQuery } from "@tanstack/react-query";

export function CallHistoryList() {
  const { data: calls = [], isLoading: loading } = useQuery({
    queryKey: ['callHistory'],
    queryFn: conversationService.getCallHistory
  });
  
  const formatTime = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
      return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 text-center text-gray-400">Loading calls...</div>
        </div>
      );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Calls</h3>
        {calls.length === 0 ? (
             <div className="text-center text-gray-500 py-8">No call history</div>
        ) : (
            <div className="space-y-1">
            {calls.map((call) => (
                <div
                key={call.id}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group cursor-pointer"
                >
                <div className="w-12 h-12 flex-shrink-0">
                    {call.avatar ? (
                        <img src={call.avatar} alt={call.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-semibold ring-2 ring-gray-200 dark:ring-white/10">
                            {call.name.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1 text-left min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-purple-400 transition-colors">
                    {call.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    {call.type === "incoming" && (
                        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    )}
                    {call.type === "outgoing" && (
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    )}
                    {call.type === "missed" && (
                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    )}
                    <span>{formatTime(call.timestamp)}</span>
                    {/* Optional: Show duration if available in content, e.g. "Call ended • 5m" -> extract "5m" */}
                    {call.content.includes("•") && (
                        <span className="text-gray-500">({call.content.split("•")[1].trim()})</span>
                    )}
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </button>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
