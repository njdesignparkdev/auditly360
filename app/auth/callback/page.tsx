"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Verifying your session...",
  );
  const { isAuthenticated, isEmailConfirmed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 30; // 3 seconds total (checking every 100ms)

    const checkAuth = setInterval(() => {
      checkCount++;

      if (isAuthenticated) {
        clearInterval(checkAuth);
        setStatusMessage("Session verified! Redirecting...");

        // Small delay to ensure state is settled
        setTimeout(() => {
          if (isEmailConfirmed) {
            router.push("/dashboard");
          } else {
            router.push(
              "/login?message=Please confirm your email before signing in",
            );
          }
        }, 500);
      } else if (checkCount >= maxChecks) {
        clearInterval(checkAuth);
        // Fallback: Check local storage manually or suggest retry
        const hasSession = localStorage.getItem(
          "sb-iycanrokdyodkhfnkrrs-auth-token",
        );
        if (hasSession) {
          // If we have a token but context hasn't updated, let's reload to force refresh
          setStatusMessage("Refreshing session...");
          window.location.reload();
        } else {
          setError("Authentication timed out. Please try signing in again.");
          setLoading(false);
        }
      }
    }, 100);

    return () => clearInterval(checkAuth);
  }, [isAuthenticated, isEmailConfirmed, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4B01] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {statusMessage}
          </h2>
          <p className="text-gray-600">Please do not close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg
            className="h-6 w-6 text-red-600"
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
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-[#FF4B01] hover:bg-[#e66000] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
