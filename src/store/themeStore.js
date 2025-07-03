import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: true,
      toggleTheme: () => set({ isDarkMode: !get().isDarkMode }),
      setTheme: (isDark) => set({ isDarkMode: isDark }),
    }),
    {
      name: 'theme-storage',
    }
  )
)