import { useState, useEffect } from "react";
import { Avatar } from "../ui/avatar";
import { type CurrentUser } from "./conversation-list";
import { useTheme } from "../../contexts/theme-context";

interface SettingsListProps {
  currentUser: CurrentUser;
}

export function SettingsList({ currentUser }: SettingsListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [status, setStatus] = useState(currentUser.status);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const [Components, setComponents] = useState<{ QRCodeDisplay: any } | null>(
    null
  );

  useEffect(() => {
    // Load components client-side
    import("../friends/qr-code-display").then((mod) => {
      setComponents({
        QRCodeDisplay: mod.QRCodeDisplay,
      });
    });
  }, []);

  const handleSave = () => {
    // In a real app, we would make an API call here
    console.log("Saving profile:", { name, status, avatar });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <Avatar src={avatar} alt={name} size="xl" />
            {isEditing && (
              <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}
          </div>
          
          {!isEditing ? (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
              <p className="text-gray-400 mt-1">{status}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="mt-6 w-full space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Options */}
        <div className="space-y-1">
          <button
            onClick={() => setShowQRModal(true)}
            className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
          >
            <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
              <svg
                className="w-5 h-5"
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
            <span className="font-medium">My QR Code</span>
            <svg
              className="w-4 h-4 ml-auto text-gray-500 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          
          <SettingsItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
            label="Notifications"
          />
          <SettingsItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            label="Privacy"
          />
          <div className="relative">
            <button
              onClick={() => setShowThemeModal(true)}
              className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
            >
              <div className="text-gray-600 dark:text-gray-400 group-hover:text-purple-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <span className="font-medium flex-1 text-left">Appearance</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{theme}</span>
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Theme Selection Modal/Popup */}
            {showThemeModal && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  onClick={() => setShowThemeModal(false)}
                />
                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 space-y-1">
                    {[
                      { id: "light", label: "Light", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
                      { id: "dark", label: "Dark", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
                      { id: "system", label: "System Default", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setTheme(option.id as "light" | "dark" | "system");
                          setShowThemeModal(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          theme === option.id 
                            ? "bg-purple-600/20 text-purple-400" 
                            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                        </svg>
                        <span className="font-medium">{option.label}</span>
                        {theme === option.id && (
                          <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <SettingsItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Help"
          />
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-white/10">
          <button 
            onClick={() => {
              // Clear tokens
              localStorage.removeItem('vibesync_access_token');
              localStorage.removeItem('vibesync_refresh_token');
              // Redirect to login
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && Components && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowQRModal(false)}
          />
          <div className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <h3 className="text-lg font-bold text-white">My QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-white"
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
            <Components.QRCodeDisplay
              userId={currentUser.id}
              userName={name}
              friendCode={currentUser.friendCode}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
      <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      <svg
        className="w-4 h-4 ml-auto text-gray-500 group-hover:text-white transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
