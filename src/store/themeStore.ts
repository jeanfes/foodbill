import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark";
    updateResolvedTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: "system",
            resolvedTheme: "light",
            setTheme: (theme: Theme) => {
                set({ theme });
                get().updateResolvedTheme();
            },
            updateResolvedTheme: () => {
                const { theme } = get();
                let resolved: "light" | "dark" = "light";

                if (theme === "system") {
                    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "light";
                } else {
                    resolved = theme;
                }

                set({ resolvedTheme: resolved });

                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(resolved);
            },
        }),
        {
            name: "theme-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.updateResolvedTheme();
                }
            },
        }
    )
);
