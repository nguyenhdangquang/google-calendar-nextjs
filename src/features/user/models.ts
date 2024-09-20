export type BodyLogin = {
  email: string;
  password: string;
};

export type SignUpBody = {
  firstName: string;
  lastName: string;
  password: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  dob: Date | null;
  usernameUnique: string;
};

export type ResendConfirmEmailBody = {
  email: string;
};

export type ForgotPasswordBody = {
  email: string;
};

export type ResetPasswordBody = {
  newPassword: string;
  token: string;
};

export type GoogleLoginBody = {
  code: string;
};

export type ChangePasswordDto = {
  password: string;
  newPassword: string;
};

export type UpdateProfileBody = {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

export type UploadResponse = {
  originalName: string;
  fileName: string;
  url: string;
};
