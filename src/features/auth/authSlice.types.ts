export type UserData = User & {
  email: string;
  is_active?: 1 | 0;
  profile_visibility: 'private' | 'friends' | 'public';
  profile: UserProfile| null;
  skills: Skill[];
}

export type User = {
  id: number;
  name: string;
  avatar_name: null | string;
  avatar_url: null | string;
}

export type UserProfile = {
  age: string | null;
  description: string | null;
  telephone: string | null;
  address: string | null;
  nationality: string | null;
}

export type Skill = {
  id: number;
  name: string;
  tag: string;
  description: string | null;
  icon_url: string | null;
  created_by: User;
}

export type FetchClientResult = UserData

export type LoginResult = { token: string, user: UserData }

export type LoginArg = { email?: string, password?: string }

export type RegisterResult = { token: string, user: UserData }

export type RegisterArg = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type LogoutResult = { message: string }

export type ForgotPasswordResult = { status: string }

export type ForgotPasswordArg = { email: string }

export type GetUserResult = UserData

export type GetUserArg = { id: number };

export type UpdateUserArg = { formData: FormData; }

export type AuthState = {
  token: null | string;
  data: null | UserData;
  profile: {
    id: null | number;
    edit: null | number;
    quill: string;
  }
}
