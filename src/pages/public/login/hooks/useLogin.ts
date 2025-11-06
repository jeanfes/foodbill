import { endpointsPrizma } from "@/utilities/endpoints";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/interfaces/user";
import { useFetch } from "@/hooks/useFetch";

const loginActive = import.meta.env.VITE_LOGIN_ACTIVE as string;

export const useLogin = () => {
    const { login } = useAuthStore();
    const { fetchData, loading } = useFetch<User>();

    const loginUser = async (values: any) => {
        if (loginActive === "false") {
            login({
                id: "abc123",
                profile: {
                    id: 1,
                    identification_type: "passport",
                    name: "Juan",
                    last_name: "Pérez",
                    phone_number: "+34123456789",
                    email: "juan.perez@example.com",
                    role: {
                        id: 1,
                        name: "ESTUDIANTE",
                    },
                    photo: "",
                    privacy_policy: true,
                    data_treatment: true,
                },
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                identification_number: "12345678A",
            });
            return;
        }
        try {
            const body: any = {
                identification_number: values.identification_number,
                password: values.password,
            };
            const response = await fetchData({
                endpoint: endpointsPrizma.auth.login,
                method: "POST",
                body,
            });
            if (response?.success) {
                login(response?.data);
            } else {
                alert(response?.message);
            }
        } catch (error) {
            console.error("Error en el login", error);
        }
    };

    return { loginUser, loading };
};
