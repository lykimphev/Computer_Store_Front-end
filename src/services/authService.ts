import apiClient from "../apis/apiClient";
import type { ApiResponse } from "../apis/apiResponse";
import type { User } from "../model/User";

const STORAGE_KEY_USER = "kp_computer_user_session";
const STORAGE_KEY_TOKEN = "token";
const STORAGE_KEY_AVATARS = "kp_user_persistent_avatars";

// Safe LocalStorage setter with quota protection
const safeSetLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (err: any) {
    console.warn(`LocalStorage quota warning on '${key}'. Purging heavy caches...`, err);
    try {
      // 1. First remove heavy avatar maps
      localStorage.removeItem(STORAGE_KEY_AVATARS);
      localStorage.setItem(key, value);
    } catch {
      // 2. If key is user session, strip avatar and save essential data only
      if (key === STORAGE_KEY_USER) {
        try {
          const parsed = JSON.parse(value);
          delete parsed.avatar;
          localStorage.setItem(key, JSON.stringify(parsed));
          return;
        } catch {}
      }
      // 3. Fallback: preserve token and retry
      try {
        const token = localStorage.getItem(STORAGE_KEY_TOKEN);
        localStorage.clear();
        if (token) localStorage.setItem(STORAGE_KEY_TOKEN, token);
        localStorage.setItem(key, value);
      } catch {}
    }
  }
};

const getStoredAvatar = (email: string): string | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AVATARS);
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[email.toLowerCase()] || null;
  } catch {
    return null;
  }
};

const setStoredAvatar = (email: string, avatar: string): void => {
  try {
    // Only store reasonably sized avatar strings (under 200KB)
    if (avatar && avatar.length > 200000) {
      console.warn("Avatar too large to cache in LocalStorage. Skipping raw cache.");
      return;
    }
    const raw = localStorage.getItem(STORAGE_KEY_AVATARS);
    const map = raw ? JSON.parse(raw) : {};
    map[email.toLowerCase()] = avatar;
    safeSetLocalStorage(STORAGE_KEY_AVATARS, JSON.stringify(map));
  } catch {}
};

export interface AuthLogin {
  email: string;
  password?: string;
}

export interface AuthRegister {
  fullName: string;
  email: string;
  password?: string;
}

/**
 * AUTHENTICATION SERVICE LAYER
 * ============================
 * Manages user login, registration, token persistence, and logout with quota safety.
 */
export const AuthService = {
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (!data) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        return null;
      }
      const user: User = JSON.parse(data);

      // Re-attach persistent avatar if available
      if (user.email && !user.avatar) {
        const savedAvatar = getStoredAvatar(user.email);
        if (savedAvatar) {
          user.avatar = savedAvatar;
        }
      }

      return user;
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY_USER);
  },

  saveUser: (user: User): void => {
    try {
      if (user.avatar && user.email) {
        setStoredAvatar(user.email, user.avatar);
      }
      // If avatar is excessively large, strip from session payload
      let sessionUser = { ...user };
      if (sessionUser.avatar && sessionUser.avatar.length > 150000) {
        sessionUser = { ...sessionUser, avatar: undefined };
      }
      safeSetLocalStorage(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    } catch (e) {
      console.warn("Failed to persist user session:", e);
    }
  },

  login: async (payload: AuthLogin | string, passwordParam?: string): Promise<ApiResponse<User>> => {
    const emailVal = typeof payload === "string" ? payload : payload.email;
    const passVal = typeof payload === "string" ? passwordParam : payload.password;

    // Call backend API - no fallback, must be valid registered user
    const response = await apiClient.post("/auth/login", {
      email: emailVal,
      password: passVal,
    });

    const resData = response.data?.data || response.data || response;
    const rawUser = resData.user || resData;
    const token = resData.token || rawUser.token;

    if (!token) {
      throw new Error("Invalid email or password. Please register first.");
    }

    const user: User = {
      id: rawUser.id,
      fullName: rawUser.name || rawUser.fullName || emailVal.split("@")[0],
      email: rawUser.email || emailVal,
      role: rawUser.role,
      role_id: rawUser.role_id,
      token,
    };

    const savedAvatar = getStoredAvatar(user.email);
    if (savedAvatar) {
      user.avatar = savedAvatar;
    }

    safeSetLocalStorage(STORAGE_KEY_TOKEN, token);
    AuthService.saveUser(user);

    return {
      success: true,
      statuscode: 200,
      message: "Login successful",
      data: user,
    };
  },

  register: async (payload: AuthRegister | string, emailParam?: string, passwordParam?: string): Promise<ApiResponse<User>> => {
    const nameVal = typeof payload === "string" ? payload : payload.fullName;
    const emailVal = typeof payload === "string" ? emailParam || "" : payload.email;
    const passVal = typeof payload === "string" ? passwordParam : payload.password;

    try {
      const response = await apiClient.post("/auth/register", {
        name: nameVal,
        fullName: nameVal,
        email: emailVal,
        password: passVal,
        password_confirmation: passVal,
      });
      const resData = response.data?.data || response.data || response;
      const rawUser = resData.user || resData;
      const token = resData.token || rawUser.token;

      const user: User = {
        id: rawUser.id || `user-${Date.now()}`,
        fullName: rawUser.name || rawUser.fullName || nameVal,
        email: rawUser.email || emailVal,
        role: rawUser.role,
        role_id: rawUser.role_id,
        token,
      };

      const savedAvatar = getStoredAvatar(user.email);
      if (savedAvatar) {
        user.avatar = savedAvatar;
      }

      if (token) {
        safeSetLocalStorage(STORAGE_KEY_TOKEN, token);
      }
      AuthService.saveUser(user);

      return {
        success: true,
        statuscode: 200,
        message: "Registration successful",
        data: user,
      };
    } catch (err: any) {
      // Extract meaningful error from backend response
      const backendMsg = err?.response?.data?.message
        || err?.response?.data?.errors?.email?.[0]
        || err?.response?.data?.errors?.password?.[0];

      if (backendMsg) {
        throw new Error(backendMsg);
      }

      // Network error = server sleeping or unreachable
      if (!err?.response) {
        throw new Error("Cannot connect to server. Please wait 30 seconds and try again (server may be starting up).");
      }

      throw new Error("Registration failed. Please try again.");
    }
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem("kp_computer_cart_items");
    window.dispatchEvent(new Event("cart-updated"));
  },
};

export const authService = AuthService;
export default AuthService;
