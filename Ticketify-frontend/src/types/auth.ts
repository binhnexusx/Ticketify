export type LoginPayload = {
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
  gender?: string;
  is_active?: boolean;
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      gender: string | null;
      phone: string | null;
      address: string | null;
      is_active: boolean;
      avatar: string | null;
    };
    accessToken: string;
    refreshToken: string;
  };
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: string; 
  firstname: string;
  lastname: string;
};

export type RegisterResponse = {
  message: string;
};
export type UserData = {
  user_id: number
  name?: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  address?: string
  gender?: string
  avatar?: string
  avatar_url?: string
  role: string
  is_active?: boolean
  date_of_birth?: string
}
