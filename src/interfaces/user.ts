interface Role {
    id: number;
    name: "DOCENTE" | "ESTUDIANTE";
}

export interface User {
    id: string,
    profile: {
        id: number;
        identification_type: string;
        name: string;
        last_name: string;
        phone_number: string;
        email: string;
        role: Role;
        photo: string;
        privacy_policy: boolean;
        data_treatment: boolean;
    }
    token: string;
    identification_number: string;
}