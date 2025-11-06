import { useAlertStore } from "@/store/alertStore";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

const env = import.meta.env.VITE_PRIZMA_API as string;

interface FetchParams<TBody> {
    baseURL?: string;
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    formdata?: boolean;
    body?: TBody;
    ignoreToken?: boolean;
}

export interface ApiResponse<TData> {
    success: boolean;
    status: number;
    message: string;
    data: TData;
    results: TData;
}

export const useFetch = <TData, TBody = any>() => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuthStore();
    const { showAlert } = useAlertStore();
    const token = user?.token;

    const fetchData = async ({ baseURL = env, endpoint, method = "GET", body, formdata = false, ignoreToken = false }: FetchParams<TBody>) => {
        setLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = formdata
                ? {}
                : { "Content-Type": "application/json", Accept: "application/json" };
            if (!ignoreToken && token) {
                headers.Authorization = `Bearer ${token}`;
            }
            const response = await fetch(`${baseURL}/v1/${endpoint}`, {
                method,
                headers,
                body: formdata ? (body as BodyInit) : JSON.stringify(body),
            });
            const data = await response.json();
            if (data?.code === "token_not_valid" && !ignoreToken) {
                showAlert({
                    type: "error",
                    message: "Sesión expirada",
                });
                logout();
                return { success: false, status: 401, message: "Sesión expirada", data: null } as ApiResponse<TData>;
            }
            if (!response.ok) {
                throw new Error(data.message || `Error: ${response.status}`);
            }
            return data as ApiResponse<TData>;
        } catch (err: any) {
            const errorMessage = err.message || "Error desconocido";
            setError(errorMessage);
            return { success: false, status: 500, message: errorMessage, data: null } as ApiResponse<TData>;
        } finally {
            setLoading(false);
        }
    };

    return { fetchData, loading, error };
};