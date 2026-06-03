"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import UserProfile from "@/components/UserProfile";
import { useEffect, useState } from "react";

export default function Hero() {
  const { token, setAuthModalOpen } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = () => {
    const formSection = document.getElementById("birth-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-sacred-pattern px-6 overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-[0.6rem]"
        >
          <img src="/logo.png" alt="Aradhana Logo" className="h-10 w-auto object-contain" />
          <span className="font-display font-bold text-brand-orange leading-none tracking-normal" style={{ fontSize: '26px', paddingTop: '2px' }}>
            Aradhana
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-brand-navy/60 font-medium"
        >
          <a href="https://aradhana.life/" className="hover:text-brand-orange transition-colors">Natal Chart</a>
          <a href="https://aradhana.life/" className="hover:text-brand-orange transition-colors">Daily Insights</a>
          <a href="https://aradhana.life/" className="hover:text-brand-orange transition-colors">Philosophy</a>
          <div className="w-px h-4 bg-gray-300"></div>
          {mounted ? (
            token ? (
              <UserProfile />
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="hover:text-brand-orange transition-colors text-brand-navy font-bold uppercase tracking-[0.2em] text-xs">Get Started</button>
            )
          ) : (
            <div className="w-16 h-4"></div>
          )}
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="text-center z-10 max-w-3xl mx-auto mt-20">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-6xl md:text-8xl lg:text-9xl mb-8 tracking-tighter text-brand-navy"
        >
          Aradhana.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed"
        >
          The spiritual companion that deciphers the mystery of your karma through ancient Vedic astrology, illuminating your true life path.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <button
            onClick={handleScroll}
            className="group px-8 py-4 border border-brand-navy text-xs tracking-[0.2em] uppercase hover:bg-brand-navy hover:text-brand-bg transition-all duration-300 flex items-center gap-3"
          >
            Discover Your Path
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Sacred Geometry Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sacred-lines opacity-10 pointer-events-none rounded-full rotate-45" />
    </section>
  );
}
