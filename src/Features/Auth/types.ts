export type AuthStateValue = {
  accessToken: null | string;
  user: null | User;
};

export type AuthContextValue = AuthStateValue & {
  login: (value: AuthResponse) => void;
  logout: () => void;
};

export type AuthResponse = {
  [K in keyof AuthStateValue]: NonNullable<AuthStateValue[K]>;
};

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  id: number;
};
