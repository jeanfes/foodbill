import { createJSONStorage, persist } from "zustand/middleware";
import type { StateCreator } from "zustand/vanilla";
import { create } from "zustand";

type SetState<T> = Parameters<StateCreator<T>>[0];
import type { User } from "../interfaces/user";

interface AuthStore {
    user: User | null;
    isAuth: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateProfile: (updatedUser: Partial<User>) => void;
}

const initializer = ((set: SetState<AuthStore>) => {
    return {
        user: null,
        isAuth: false,
        login: (user: User) => {
            set({
                user,
                isAuth: user?.token ? true : false,
            });
        },
        logout: () => {
            set({ user: null, isAuth: false });
            sessionStorage.removeItem("auth-storage");
            localStorage.removeItem("remember-user");
        },
        updateProfile: (updatedUser: Partial<User>) => {
            set((state: AuthStore) => ({
                user: state.user ? { ...state.user, ...updatedUser } : null,
            }));
        }
    };
}) as StateCreator<AuthStore>;

export const useAuthStore = create<AuthStore>()(
    persist<AuthStore>(initializer, {
        name: "auth-storage",
        storage: createJSONStorage(() => sessionStorage),
    })
);
