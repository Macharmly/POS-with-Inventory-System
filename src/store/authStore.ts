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

  login: (
    user: User,
    token: string
  ) => void;

  logout: () => void;

}

export const useAuthStore = create<AuthState>((set) => ({

  // Load persisted user immediately
  user: JSON.parse(
    localStorage.getItem('user') || 'null'
  ),

  login: (
    user,
    token
  ) => {

    // Save user
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    // Save user token
    localStorage.setItem(
      'token',
      token
    );

    // Save business ID
    localStorage.setItem(
      'business_id',
      user.business_id.toString()
    );

    set({ user });

  },

  logout: () => {

    localStorage.removeItem('user');

    localStorage.removeItem('token');

    set({ user: null });

  }

}));