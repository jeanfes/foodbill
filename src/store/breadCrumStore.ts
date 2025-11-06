// src/stores/useBreadCrumbStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ReactNode } from "react";

interface BreadCrumbEntry {
    path: string;
    state: any;
}

interface BreadCrumbStore {
    breadCrumbButton: ReactNode | null;
    breadCrumbState: BreadCrumbEntry[];
    setBreadCrumbButton: (button: ReactNode | null) => void;
    setBreadCrumbState: (path: string, state: any) => void;
    getBreadCrumbStateByPath: (path: string) => any | null;
    reset: () => void;
}

export const useBreadCrumbStore = create<BreadCrumbStore>()(
    persist(
        (set, get) => ({
            breadCrumbButton: null,
            breadCrumbState: [],
            setBreadCrumbButton: (button: ReactNode | null) =>
                set({ breadCrumbButton: button }),
            setBreadCrumbState: (path: string, state: any) => {
                const current = get().breadCrumbState;
                const index = current.findIndex((entry) => entry.path === path);
                const updated =
                    index !== -1
                        ? [
                            ...current.slice(0, index),
                            { path, state },
                            ...current.slice(index + 1),
                        ]
                        : [...current, { path, state }];
                set({ breadCrumbState: updated });
            },
            getBreadCrumbStateByPath: (path: string) =>
                get().breadCrumbState.find((entry) => entry.path === path)?.state ||
                null,
            reset: () => set({ breadCrumbButton: null, breadCrumbState: [] }),
        }),
        {
            name: "breadcrumb-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
