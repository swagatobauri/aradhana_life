'use client'

import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BirthForm() {
  const router = useRouter();
  const { birthDetails, setBirthDetails, resetSession, setHasInitialChart, setMessages } = useChatStore();
  const { token, userId, setAuthModalOpen } = useAuthStore();
  const [hasServerProfile, setHasServerProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // If the user logs in on this page, fetch their profile if we don't have one locally
  useEffect(() => {
    if (token && userId) {
      if (birthDetails) {
        setHasServerProfile(true);
      } else {
        setIsLoadingProfile(true);
        fetch(`${API_URL}/api/profile/${userId}`)
          .then(res => res.json())
          .then(data => {
            if (data.profile && data.profile.birth_details) {
              setBirthDetails(data.profile.birth_details);
              setHasInitialChart(true);
              setHasServerProfile(true);
            }
          })
          .catch(e => console.error(e))
          .finally(() => setIsLoadingProfile(false));
      }
    } else {
      setHasServerProfile(false);
    }
  }, [token, userId, birthDetails, setBirthDetails, setHasInitialChart]);

  const handleContinue = async () => {
    if (userId) {
      try {
        const res = await fetch(`${API_URL}/api/chat/history/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages) {
            setMessages(data.messages);
          }
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    router.push('/chat');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Completely wipe old chat messages and IDs, and reset flags
    resetSession();
    
    setBirthDetails({
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      place: formData.get('place') as string,
    });
    
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    
    router.push('/chat');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full"
    >
      <div className="w-full max-w-lg p-10 md:p-14 bg-[#FDFBF7] shadow-2xl rounded-2xl border border-gray-100 relative overflow-hidden group">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-brand-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 m-4" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-brand-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 m-4" />

        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-brand-navy mb-3">Your Cosmic Blueprint</h2>
          <p className="text-sm text-gray-500 font-light">Enter your details exactly as they appear on your birth certificate.</p>
        </div>

        {isLoadingProfile ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : hasServerProfile && token ? (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-center">
              <p className="text-lg text-brand-navy font-medium mb-1">Welcome back, Seeker.</p>
              <p className="text-sm text-gray-500">We have your birth profile ready.</p>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-5 bg-brand-navy text-brand-bg text-xs uppercase tracking-[0.2em] hover:bg-brand-navy/90 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Continue Journey</span>
              <div className="absolute inset-0 bg-brand-gold/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
            </button>
            <button 
              onClick={() => {
                setHasServerProfile(false);
                resetSession();
              }}
              className="text-xs text-gray-400 hover:text-brand-orange transition-colors uppercase tracking-widest"
            >
              Start New Reading
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="relative">
              <input
                name="date"
                type="date"
                required
                className="peer w-full border-b border-gray-300 py-3 bg-transparent text-brand-navy focus:outline-none focus:border-brand-navy transition-colors text-lg"
              />
              <label className="absolute left-0 -top-5 text-xs uppercase tracking-widest text-gray-400 font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-brand-navy">
                Date of Birth
              </label>
            </div>

            <div className="relative">
              <input
                name="time"
                type="time"
                required
                className="peer w-full border-b border-gray-300 py-3 bg-transparent text-brand-navy focus:outline-none focus:border-brand-navy transition-colors text-lg"
              />
              <label className="absolute left-0 -top-5 text-xs uppercase tracking-widest text-gray-400 font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-brand-navy">
                Time of Birth
              </label>
            </div>

            <div className="relative">
              <input
                name="place"
                type="text"
                placeholder="e.g. Mumbai, India"
                required
                className="peer w-full border-b border-gray-300 py-3 bg-transparent text-brand-navy placeholder-transparent focus:outline-none focus:border-brand-navy transition-colors text-lg"
              />
              <label className="absolute left-0 -top-5 text-xs uppercase tracking-widest text-gray-400 font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-brand-navy">
                City of Birth
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-5 bg-brand-navy text-brand-bg text-xs uppercase tracking-[0.2em] hover:bg-brand-navy/90 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Generate Chart</span>
              <div className="absolute inset-0 bg-brand-gold/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
