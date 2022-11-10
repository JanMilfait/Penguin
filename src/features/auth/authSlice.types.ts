/* eslint-disable @typescript-eslint/no-unused-vars */

type UserData = {
  id: number;
  name: string;
  email: string;
  is_active: number;
  avatar_name: null | string;
  avatar_url: null | string;
  created_at: string;
  updated_at: string;
}

type FetchClientResult = UserData | ErrorMessage

type LoginResult = { token: string, user: UserData } | ErrorMessage

type LoginArg = { email: string, password: string } | ErrorMessage

type RegisterResult = { token: string, user: UserData } | ErrorMessage

type RegisterArg = { name: string, email: string, password: string, password_confirmation: string } | ErrorMessage

type LogoutResult = { message: string } | ErrorMessage

type ForgotPasswordResult = { message: string } | ErrorMessage

type ForgotPasswordArg = { email: string } | ErrorMessage

type AuthState = {
  token: null | string;
  data: null | UserData;
}
