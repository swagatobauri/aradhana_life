import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
  isAuthModalOpen: boolean;
  setAuth: (token: string, userId: string, email: string) => void;
  logout: () => void;
  setAuthModalOpen: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  userId: typeof window !== 'undefined' ? localStorage.getItem('userId') : null,
  email: typeof window !== 'undefined' ? localStorage.getItem('email') : null,
  isAuthModalOpen: false,
  
  setAuth: (token, userId, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    set({ token, userId, email, isAuthModalOpen: false });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    set({ token: null, userId: null, email: null });
  },
  
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
}));
