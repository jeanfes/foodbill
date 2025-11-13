import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/services/authService";
import { useState } from "react";

interface LoginValues {
    identification_number: string;
    password: string;
    dependencia?: string;
}

export const useLogin = () => {
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = async (values: LoginValues) => {
        setLoading(true);
        setError(null);

        try {

            const response = await AuthService.login({
                username: values.identification_number,
                password: values.password,
                dependencia: values.dependencia,
            });

            if (response.success && response.data) {
                login(response.data);
                return { success: true, message: response.message };
            } else {
                setError(response.message || "Error en el inicio de sesión");
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error("Error en el login", error);
            const errorMessage = "Error al procesar la solicitud";
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, loading, error };
};
