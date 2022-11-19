export type UserData = {
  id: number;
  name: string;
  email: string;
  is_active: number;
  avatar_name: null | string;
  avatar_url: null | string;
  created_at: string;
  updated_at: string;
}

export type FetchClientResult = UserData | ErrorMessage

export type LoginResult = { token: string, user: UserData } | ErrorMessage

export type LoginArg = { email: string, password: string } | ErrorMessage

export type RegisterResult = { token: string, user: UserData } | ErrorMessage

export type RegisterArg = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
} | ErrorMessage

export type LogoutResult = { message: string } | ErrorMessage

export type ForgotPasswordResult = { message: string } | ErrorMessage

export type ForgotPasswordArg = { email: string } | ErrorMessage

export type AuthState = {
  token: null | string;
  data: null | UserData;
  userDropdownOpen: boolean;
}
