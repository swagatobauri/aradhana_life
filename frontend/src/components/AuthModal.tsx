"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, setAuth } = useAuthStore();
  const { birthDetails } = useChatStore();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      setAuth(data.token, data.user_id, data.email);
      setAuthModalOpen(false);
      
      // Always get the freshest state, bypass React closure staleness
      const currentBirthDetails = useChatStore.getState().birthDetails;
      
      // If we don't have birthDetails locally, fetch them from the backend
      let hasProfile = !!currentBirthDetails;
      if (!currentBirthDetails) {
        try {
          const profileRes = await fetch(`${API_URL}/api/profile/${data.user_id}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.profile && profileData.profile.birth_details) {
              useChatStore.getState().setBirthDetails(profileData.profile.birth_details);
              useChatStore.getState().setHasInitialChart(true);
              hasProfile = true;
            }
          }
        } catch (e) {
          console.error("Failed to fetch profile", e);
        }
      } else {
        // Save local birth profile to DB
        await fetch(`${API_URL}/api/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: data.user_id,
            birth_details: currentBirthDetails
          })
        }).catch(err => console.error("Failed to sync profile:", err));
      }
      
      // Fetch chat history
      try {
        const historyRes = await fetch(`${API_URL}/api/chat/history/${data.user_id}`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          if (historyData.messages && historyData.messages.length > 0) {
            useChatStore.getState().setMessages(historyData.messages);
          }
        }
      } catch (e) {
        console.error("Failed to fetch history", e);
      }
      
      if (hasProfile) {
        router.push('/chat');
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md p-8 bg-brand-bg rounded-2xl shadow-2xl border border-brand-navy/10"
        >
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-brand-navy/50 hover:text-brand-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-brand-navy mb-2">
              {isLogin ? "Welcome Back" : "Begin Your Journey"}
            </h2>
            <p className="text-sm text-brand-navy/60">
              {isLogin
                ? "Enter your details to access your cosmic blueprint."
                : "Create an account to save your astrological readings."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-brand-navy/70 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-brand-navy/20 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                placeholder="seeker@cosmos.com"
              />
            </div>
            
            <div className="relative">
              <label className="block text-xs font-medium uppercase tracking-wider text-brand-navy/70 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-brand-navy/20 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-brand-navy/50 hover:text-brand-navy transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-md border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-brand-navy text-brand-bg text-sm font-medium tracking-widest uppercase hover:bg-brand-orange transition-colors rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Aligning Stars..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-brand-navy/60 hover:text-brand-orange transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
