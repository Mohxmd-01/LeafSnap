// src/utils/auth.ts

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

const TOKEN_KEY = 'apple_disease_auth_token';
const USER_KEY = 'apple_disease_auth_user';

/* ========================
   TOKEN HELPERS
======================== */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/* ========================
   USER HELPERS
======================== */
export const setUser = (user: AuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): AuthUser | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

/* ========================
   COMBINED LOGIN HELPER
======================== */
export const setAuth = (token: string, user: AuthUser): void => {
  setToken(token);
  setUser(user);
};

/* ========================
   AUTH CHECK
======================== */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  } catch {
    return false;
  }
};

/* ========================
   LOGOUT
======================== */
export const logout = (): void => {
  removeToken();
  removeUser();
  window.location.href = '/login';
};
