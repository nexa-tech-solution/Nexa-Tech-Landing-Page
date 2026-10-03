export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export type AdminUser = {
  userId: number;
  email: string;
  displayName: string;
  role: AdminRole;
  lastLoginAt: number | null; // epoch ms
};

export type AuthTokens = {
  tokenType: "Bearer";
  accessToken: string;
  accessTokenExpiresIn: number; // seconds
  refreshToken: string;
  refreshTokenExpiresIn: number; // seconds
  user: AdminUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type LogoutRequest = RefreshRequest;
