import http from "../../services/http-common";
import {
  BodyLogin,
  SignUpBody,
  ResendConfirmEmailBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  GoogleLoginBody,
  ChangePasswordDto,
  UpdateProfileBody,
} from "./models";

export default class User {
  static login(body: BodyLogin) {
    return http.post("/user/login", body);
  }

  static signUp(body: SignUpBody) {
    return http.post("/user/register", body);
  }

  static resendConfirmEmail(body: ResendConfirmEmailBody) {
    return http.post("/auth/resend-confirmation", body);
  }

  static forgotPassword(body: ForgotPasswordBody) {
    return http.post("/auth/forgot-password", body);
  }

  static resetPassword(body: ResetPasswordBody) {
    return http.post("/auth/reset-password", body);
  }

  static googleLogin(body: GoogleLoginBody) {
    return http.post("/auth/google/authorize", body);
  }

  static changePassword(body: ChangePasswordDto) {
    return http.post("/auth/change-password", body);
  }

  static getUserProfile() {
    return http.get("/user/me/profile");
  }

  static updateProfile(body: UpdateProfileBody) {
    return http.put("/user/me/profile", body);
  }

  static uploadAvatar(body: FormData) {
    return http.post("/upload", body);
  }
}
