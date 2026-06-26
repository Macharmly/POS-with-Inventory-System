import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  business_id: number;
  role: string;
  profile_picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),

  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('business_id', String(user.business_id));

    set({
      user,
      token
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('business_id');

    set({
      user: null,
      token: null
    });
  }
}));