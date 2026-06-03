import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserProfile() {
  const { email, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial = email ? email.charAt(0).toUpperCase() : '?';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-navy text-brand-bg font-serif text-lg hover:bg-brand-orange transition-colors"
      >
        {initial}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-brand-navy/10 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-brand-navy/5 bg-gray-50/50">
              <p className="text-xs font-medium text-brand-navy/50 uppercase tracking-wider mb-1">Signed in as</p>
              <p className="text-sm font-bold text-brand-navy truncate" title={email || ''}>{email}</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
