export type UserRole = "OWNER" | "ADMIN" | "SUPERVISOR";

export interface AuthUserProfile {
  id: string;
  name: string;
  username: string;
  phone: string;
  role: UserRole;
  jobTitle: string;
}

export interface MeProfile extends AuthUserProfile {
  isActive: boolean;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserProfile;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  loggedOut: boolean;
}
