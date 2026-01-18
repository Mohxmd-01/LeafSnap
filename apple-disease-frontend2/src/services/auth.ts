import { setAuth } from '@/utils/auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // this is "/api"


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthError {
  message: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: AuthError = await response.json().catch(() => ({
        message: 'Login failed. Please check your credentials.',
      }));
      throw new Error(error.message);
    }

    const result: LoginResponse = await response.json();

    setAuth(result.token, result.user);

    return result;
  },

  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Accept': 'application/json', 
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: AuthError = await response.json().catch(() => ({
        message: 'Signup failed. Please try again.',
      }));
      throw new Error(error.message);
    }

    return response.json();
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};
