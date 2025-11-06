import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { updateResolvedTheme } = useThemeStore();

    useEffect(() => {
        updateResolvedTheme();

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => updateResolvedTheme();

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [updateResolvedTheme]);

    return <>{children}</>;
}
