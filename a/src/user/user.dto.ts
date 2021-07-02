export interface RegisterDTO {
  login: string;
  password: string;
  email: string;
}
export interface LoginDTO {
  login?: string;
  email?: string;
  password: string;
}
export interface ChangePasswordDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
}
