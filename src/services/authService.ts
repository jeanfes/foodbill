import { UserRole } from "@/interfaces/role";
import type { User } from "@/interfaces/user";

interface LoginCredentials {
  username: string;
  password: string;
  dependencia?: string;
}

const MOCK_ADMIN: User = {
  id: "admin-001",
  profile: {
    id: 1,
    identification_type: "CC",
    name: "Administrador",
    last_name: "Sistema",
    phone_number: "+57 300 1234567",
    email: "admin@foodbill.com",
    role: {
      id: 1,
      name: UserRole.ADMIN,
    },
    photo: "",
    privacy_policy: true,
    data_treatment: true,
  },
  token: "mock-admin-token-12345",
  identification_number: "admin",
};

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    data?: User;
    message?: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (credentials.username === "admin" && credentials.password === "1234") {
      return {
        success: true,
        data: MOCK_ADMIN,
        message: "Inicio de sesión exitoso",
      };
    }

    return {
      success: false,
      message: "Usuario o contraseña incorrectos",
    };
  }

  static async verifyToken(token: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return token === MOCK_ADMIN.token;
  }

  static async refreshToken(token: string): Promise<{
    success: boolean;
    token?: string;
  }> {
    const isValid = await this.verifyToken(token);
    
    if (isValid) {
      return {
        success: true,
        token: token,
      };
    }

    return {
      success: false,
    };
  }
}
