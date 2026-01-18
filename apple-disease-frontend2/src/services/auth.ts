const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
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
        message: 'Login failed. Please check your credentials.' 
      }));
      throw new Error(error.message || 'Login failed. Please try again.');
    }

    return response.json();
  },

  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: AuthError = await response.json().catch(() => ({ 
        message: 'Signup failed. Please try again.' 
      }));
      throw new Error(error.message || 'Signup failed. Please try again.');
    }

    return response.json();
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Always return success to prevent email enumeration
    if (!response.ok) {
      // Log error internally but don't expose to user
      console.error('Forgot password request failed');
    }
  },
};
