const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

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

    // ✅ STORE TOKEN & USER (THIS WAS MISSING)
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    return result;
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

  // 🔓 OPTIONAL HELPERS
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
