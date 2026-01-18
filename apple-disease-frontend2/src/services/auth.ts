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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Login failed. Please check your credentials.';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const result: LoginResponse = await response.json();

    setAuth(result.token, result.user);

    return result;
  },

  async signup(data: SignupRequest): Promise<SignupResponse> {
    console.log('Sending signup request:', data);
    console.log('API URL:', `${API_BASE_URL}/auth/signup`);
    
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Accept': 'application/json', 
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      let errorMessage = 'Signup failed. Please try again.';
      try {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};
