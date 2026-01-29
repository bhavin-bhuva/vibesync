import { useState } from "react";

interface FriendCodeInputProps {
  onSubmit: (friendCode: string) => void;
}

export function FriendCodeInput({ onSubmit }: FriendCodeInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Format: XXXXX-XXXXX-XXXXX (15 alphanumeric characters)
  const validateFriendCode = (input: string): boolean => {
    const pattern = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
    return pattern.test(input);
  };

  const formatInput = (input: string): string => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = input.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    
    // Add hyphens at appropriate positions
    const parts = [];
    for (let i = 0; i < cleaned.length && i < 15; i += 5) {
      parts.push(cleaned.slice(i, i + 5));
    }
    
    return parts.join("-");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInput(e.target.value);
    setCode(formatted);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      setError("Please enter a friend code");
      return;
    }

    if (!validateFriendCode(code)) {
      setError("Invalid friend code format. Use XXXXX-XXXXX-XXXXX");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      onSubmit(code);
    }, 500);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="friend-code" className="block text-sm font-medium text-gray-300 mb-2">
            Enter Friend Code
          </label>
          <input
            id="friend-code"
            type="text"
            value={code}
            onChange={handleInputChange}
            placeholder="XXXXX-XXXXX-XXXXX"
            maxLength={17} // 15 characters + 2 hyphens
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors font-mono text-center text-lg tracking-wider ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-purple-500"
            }`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
              <svg
                className="w-4 h-4"
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
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !code}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </>
          ) : (
            <>
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Add Friend
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 glass-dark rounded-lg border border-white/10">
        <p className="text-xs text-gray-400 text-center">
          Friend codes are case-insensitive and contain 15 alphanumeric characters
        </p>
      </div>
    </div>
  );
}
