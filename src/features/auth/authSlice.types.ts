export type UserData = {
  id: User['id'];
  name: User['name'];
  avatar_name: User['avatar_name'];
  avatar_url: User['avatar_url'];
  email: string;
  is_active?: 1 | 0;
  profile_visibility: 'private' | 'friends' | 'public';
  profile: UserProfile;
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
  name: string;
  description: string | null;
  tag: string | null;
  image_url: string | null;
  created_by: User;
}

export type FetchClientResult = UserData | ErrorMessage

export type LoginResult = { token: string, user: UserData } | ErrorMessage

export type LoginArg = { email?: string, password?: string } | ErrorMessage

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
}
