import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';

  toggleTheme: () => void;
}

const savedTheme =
  localStorage.getItem('theme');

export const useThemeStore =
  create<ThemeState>((set) => ({

    theme:
      savedTheme === 'dark'
        ? 'dark'
        : 'light',

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

        return {
          theme: nextTheme
        };
      });
    }

  }));