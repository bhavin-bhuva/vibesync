import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { storeTokens } from "../services/auth.service";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      storeTokens(accessToken, refreshToken);
      navigate("/conversations");
    } else {
      navigate("/login?error=Google auth failed");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-gray-400">Authenticating with Google...</p>
      </div>
    </div>
  );
}
