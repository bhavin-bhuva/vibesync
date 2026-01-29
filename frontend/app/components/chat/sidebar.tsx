import { Avatar } from "../ui/avatar";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2m ago",
    unread: 3,
    online: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    lastMessage: "Let's catch up tomorrow!",
    timestamp: "1h ago",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Emma Wilson",
    lastMessage: "Thanks for the help!",
    timestamp: "3h ago",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    lastMessage: "See you at the meeting",
    timestamp: "5h ago",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    lastMessage: "That sounds great!",
    timestamp: "1d ago",
    unread: 0,
    online: true,
  },
];

interface SidebarProps {
  currentUser: { name: string; avatar?: string };
  activeContactId: string;
  onContactSelect: (id: string) => void;
}

export function Sidebar({
  currentUser,
  activeContactId,
  onContactSelect,
}: SidebarProps) {
  return (
    <div className="w-80 glass-dark border-r border-gray-200 dark:border-white/10 flex flex-col h-full">
      {/* User Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <Avatar src={currentUser.avatar} alt={currentUser.name} size="lg" online />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{currentUser.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
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

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <svg
            className="w-5 h-5 text-gray-500 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {mockContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onContactSelect(contact.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-l-2 ${
              activeContactId === contact.id
                ? "bg-gray-100 dark:bg-white/5 border-purple-500"
                : "border-transparent"
            }`}
          >
            <Avatar
              src={contact.avatar}
              alt={contact.name}
              size="md"
              online={contact.online}
            />
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {contact.name}
                </h4>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {contact.timestamp}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {contact.lastMessage}
                </p>
                {contact.unread > 0 && (
                  <span className="flex-shrink-0 ml-2 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
