import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/register";
import { AuthLayout } from "../components/auth-layout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { register, storeTokens } from "../services/auth.service";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Register - VibeSync" },
    { name: "description", content: "Create your VibeSync account" },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    api?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 1, label: "Weak" };
    if (password.length < 10) return { strength: 2, label: "Medium" };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password))
      return { strength: 3, label: "Strong" };
    return { strength: 2, label: "Medium" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call API
    setIsLoading(true);
    setErrors({});

    try {
      const response = await register(formData.username, formData.email, formData.password);
      storeTokens(response.tokens.accessToken, response.tokens.refreshToken);
      navigate("/conversations");
    } catch (error) {
      setErrors({ api: error instanceof Error ? error.message : "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join VibeSync and start connecting"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          label="Username"
          value={formData.username}
          onChange={(e) => {
            setFormData({ ...formData, username: e.target.value });
            setErrors({ ...errors, username: undefined });
          }}
          error={errors.username}
        />

        <Input
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            setErrors({ ...errors, email: undefined });
          }}
          error={errors.email}
        />

        <div>
          <Input
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength
                        ? passwordStrength.strength === 1
                          ? "bg-red-500"
                          : passwordStrength.strength === 2
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        : "bg-white/10"
                      }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Password strength: {passwordStrength.label}
              </p>
            </div>
          )}
        </div>

        <Input
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
            setErrors({ ...errors, confirmPassword: undefined });
          }}
          error={errors.confirmPassword}
        />

        <div>
          <label className="flex items-start gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => {
                setFormData({ ...formData, terms: e.target.checked });
                setErrors({ ...errors, terms: undefined });
              }}
              className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
          )}
        </div>

        {errors.api && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{errors.api}</p>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900/50 text-gray-400">
              Or sign up with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => {
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
              window.location.href = `${API_URL}/api/v1/auth/google`;
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
