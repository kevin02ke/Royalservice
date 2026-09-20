import { UserProfile } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  referredByCode?: string;
}

export interface LoginPayload {
  identifier: string; // email or phone
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: UserProfile;
  token?: string;
  message?: string;
}

export interface NeonStatusResponse {
  isNeonConnected: boolean;
  projectId: string;
  databaseUrlConfigured: boolean;
  totalUsers: number;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register account');
    }
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid email/phone or password');
    }
    return data;
  },

  async getMe(userId: string): Promise<UserProfile> {
    const res = await fetch(`/api/auth/me?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch user');
    }
    return data.user;
  },

  async getNeonStatus(): Promise<NeonStatusResponse> {
    const res = await fetch('/api/neon/status');
    if (!res.ok) {
      return {
        isNeonConnected: false,
        projectId: 'orange-rain-40840610',
        databaseUrlConfigured: false,
        totalUsers: 0,
      };
    }
    return await res.json();
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const res = await fetch('/api/auth/users');
    if (!res.ok) return [];
    const data = await res.json();
    return data.users || [];
  },
};
