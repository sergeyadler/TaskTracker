import axiosInstance from "../../../lib/axiosInstance";
import type {Credentials, UserRegistrationDto} from "../types";

// we already added  prefix /api in axios config

const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/users/register";
const FORGOT_PASSWORD_PATH = "/password/forgot";
const RESET_PASSWORD_PATH = "/password/reset";


export const fetchLogin = async (credentials: Credentials) => {
  const res = await axiosInstance.post(LOGIN_PATH, credentials);
  return res.data;
};


export const fetchRegister = async (credentials: UserRegistrationDto) => {
  const res = await axiosInstance.post(REGISTER_PATH, credentials);
  return res.data;
};

export interface ForgotPasswordPayload {
  email: string;
}

export const requestPasswordReset = async (data: ForgotPasswordPayload) => {
  const res = await axiosInstance.post(FORGOT_PASSWORD_PATH, data);
  return res.data;
};

export interface ResetPasswordPayload {
  //email: string;
  newPassword: string;
  token: string;
}
 export const resetPassword=async (data: ResetPasswordPayload) => {
  const res = await axiosInstance.post(RESET_PASSWORD_PATH, data);
  return res.data;
 }

export async function confirmRegistration(code: string): Promise<void> {
  await axiosInstance.get(`/users/confirm/${encodeURIComponent(code)}`);
}