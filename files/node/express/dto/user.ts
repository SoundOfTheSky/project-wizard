export type RegisterDTO = {
  login: string;
  password: string;
  email: string;
};
export type LoginDTO = {
  login?: string;
  email?: string;
  password: string;
};
export type ChangePasswordDTO = {
  login?: string;
  email?: string;
  oldPassword: string;
  newPassword: string;
};
