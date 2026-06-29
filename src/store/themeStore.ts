import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const savedTheme =
  (localStorage.getItem('theme') as 'light' | 'dark') ||
  'light';

// Apply the saved theme immediately
document.documentElement.classList.toggle(
  'dark',
  savedTheme === 'dark'
);

export const useThemeStore =
  create<ThemeState>((set) => ({

    theme: savedTheme,

    toggleTheme: () => {

      set((state) => {

        const nextTheme =
          state.theme === 'light'
            ? 'dark'
            : 'light';

        localStorage.setItem(
          'theme',
          nextTheme
        );

        document.documentElement.classList.toggle(
          'dark',
          nextTheme === 'dark'
        );

        return {
          theme: nextTheme
        };

      });

    }

  }));