/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import User from "./api";
import {
  BodyLogin,
  SignUpBody,
  User as UserInterface,
  ResendConfirmEmailBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  GoogleLoginBody,
  ChangePasswordDto,
  UpdateProfileBody,
  UploadResponse,
} from "./models";
import storage from "redux-persist/lib/storage";
import { RootState } from "../../store/store";
import http from "../../services/http-common";

type RequestState = "pending" | "fulfilled" | "rejected";
type Error = {
  message: string;
  status: number | null;
  detail?: string;
};

export interface AuthState {
  loading?: RequestState;
  error?: Error;
  accessToken?: string;
  user?: UserInterface | null;
  signUpStatus: string;
  resendConfirmEmail: {
    error?: Error;
    loading?: RequestState;
  };
  forgotPassword: {
    error?: Error;
    loading?: RequestState;
  };
  resendForgotPassword: {
    error?: Error;
    loading?: RequestState;
  };
  resetPassword: {
    error?: Error;
    loading?: RequestState;
  };
  changePassword: {
    error?: Error;
    loading?: RequestState;
  };
  profile: {
    error?: Error;
    loading?: RequestState;
    data: UserInterface | null;
  };
  updateProfile: {
    error?: Error;
    loading?: RequestState;
  };
  uploadAvatar: {
    error?: Error;
    loading?: RequestState;
    avatar?: UploadResponse | null;
  };
}

export const initialState: AuthState = {
  accessToken: "",
  loading: "pending",
  error: {
    message: "",
    status: null,
  },
  user: null,
  signUpStatus: "",
  resendConfirmEmail: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  forgotPassword: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  resendForgotPassword: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  resetPassword: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  changePassword: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  updateProfile: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  uploadAvatar: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    avatar: null,
  },
  profile: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    data: null,
  },
};

export const login = createAsyncThunk(
  "/user/login",
  async (body: BodyLogin, { rejectWithValue }) => {
    try {
      const { data } = await User.login(body);
      if (data?.jwtAccessToken) {
        http.setAuthorizationHeader(data.jwtAccessToken);
        return {
          jwtAccessToken: data.jwtAccessToken,
          user: {
            ...data?.userInfo,
          },
        };
      }
      return rejectWithValue({
        message: "username/password in incorrect",
        status: data?.status,
      });
    } catch (error: any) {
      return rejectWithValue(error.data || error?.response);
    }
  },
);

export const signUp = createAsyncThunk(
  "/user/register",
  async (body: SignUpBody, { rejectWithValue }) => {
    try {
      const res = await User.signUp(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const resendConfirmEmail = createAsyncThunk(
  "/auth/resend-confirmation",
  async (body: ResendConfirmEmailBody, { rejectWithValue }) => {
    try {
      const res = await User.resendConfirmEmail(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "/auth/forgot-password",
  async (body: ForgotPasswordBody, { rejectWithValue }) => {
    try {
      const res = await User.forgotPassword(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const resendForgotPassword = createAsyncThunk(
  "/auth/resend-forgot-password",
  async (body: ForgotPasswordBody, { rejectWithValue }) => {
    try {
      const res = await User.forgotPassword(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async (body: ResetPasswordBody, { rejectWithValue }) => {
    try {
      const res = await User.resetPassword(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const authWithGoogle = createAsyncThunk(
  "/auth/google/authorize",
  async (body: GoogleLoginBody, { rejectWithValue }) => {
    try {
      const res = await User.googleLogin(body);
      if ((res as any)?.jwtAccessToken) {
        http.setAuthorizationHeader((res as any)?.jwtAccessToken);
        return {
          jwtAccessToken: (res as any)?.jwtAccessToken,
          user: {
            ...(res as any)?.userInfo,
          },
        };
      }
      return rejectWithValue({
        error: {
          message: "username/password in incorrect",
          status: (res as any)?.status,
        },
      });
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const changePassword = createAsyncThunk(
  "/auth/change-password",
  async (body: ChangePasswordDto, { rejectWithValue }) => {
    try {
      const res = await User.changePassword(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const getUserProfile = createAsyncThunk(
  "GET /user/me/profile",
  async ({}, { rejectWithValue }) => {
    try {
      const res = await User.getUserProfile();
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "/user/me/profile",
  async (body: UpdateProfileBody, { rejectWithValue }) => {
    try {
      const res = await User.updateProfile(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  "/upload",
  async (body: FormData, { rejectWithValue }) => {
    try {
      const res = await User.uploadAvatar(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      storage.removeItem("persist:root");
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.accessToken = action.payload.jwtAccessToken;
      state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = "rejected";
      state.accessToken = "";
      state.error = action.payload as Error;
    });
    builder.addCase(signUp.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(signUp.fulfilled, (state) => {
      state.loading = "fulfilled";
      state.signUpStatus = "success";
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = "rejected";
      state.accessToken = "";
      state.error = action.payload as Error;
    });
    builder.addCase(resendConfirmEmail.pending, (state) => {
      state.resendConfirmEmail.loading = "pending";
    });
    builder.addCase(resendConfirmEmail.fulfilled, (state) => {
      state.resendConfirmEmail.loading = "fulfilled";
      state.resendConfirmEmail.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(resendConfirmEmail.rejected, (state, action) => {
      state.resendConfirmEmail.loading = "rejected";
      state.resendConfirmEmail.error = action.payload as Error;
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.forgotPassword.loading = "pending";
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.forgotPassword.loading = "fulfilled";
      state.forgotPassword.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.forgotPassword.loading = "rejected";
      state.forgotPassword.error = action.payload as Error;
    });
    builder.addCase(resendForgotPassword.pending, (state) => {
      state.resendForgotPassword.loading = "pending";
    });
    builder.addCase(resendForgotPassword.fulfilled, (state) => {
      state.resendForgotPassword.loading = "fulfilled";
      state.resendForgotPassword.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(resendForgotPassword.rejected, (state, action) => {
      state.resendForgotPassword.loading = "rejected";
      state.resendForgotPassword.error = action.payload as Error;
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.resetPassword.loading = "pending";
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.resetPassword.loading = "fulfilled";
      state.resetPassword.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.resetPassword.loading = "rejected";
      state.resetPassword.error = action.payload as Error;
    });

    builder.addCase(authWithGoogle.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(authWithGoogle.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.accessToken = action.payload.jwtAccessToken;
      state.user = action.payload.user;
    });
    builder.addCase(authWithGoogle.rejected, (state, action) => {
      state.loading = "rejected";
      state.accessToken = "";
      state.error = action.payload as Error;
    });

    builder.addCase(changePassword.pending, (state) => {
      state.changePassword.loading = "pending";
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.changePassword.loading = "fulfilled";
      state.changePassword.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.changePassword.loading = "rejected";
      state.changePassword.error = action.payload as Error;
    });

    builder.addCase(getUserProfile.pending, (state) => {
      state.profile.loading = "pending";
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.profile.loading = "fulfilled";
      state.profile.error = {
        message: "",
        status: null,
      };
      state.profile.data = (action as any).payload;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.profile.loading = "rejected";
      state.profile.error = action.payload as Error;
    });

    builder.addCase(updateProfile.pending, (state) => {
      state.updateProfile.loading = "pending";
    });
    builder.addCase(updateProfile.fulfilled, (state) => {
      state.updateProfile.loading = "fulfilled";
      state.updateProfile.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.updateProfile.loading = "rejected";
      state.updateProfile.error = action.payload as Error;
    });

    builder.addCase(uploadAvatar.pending, (state) => {
      state.uploadAvatar.loading = "pending";
    });
    builder.addCase(uploadAvatar.fulfilled, (state, action) => {
      state.uploadAvatar.loading = "fulfilled";
      state.uploadAvatar.error = {
        message: "",
        status: null,
      };
      state.uploadAvatar.avatar = (action as any).payload;
    });
    builder.addCase(uploadAvatar.rejected, (state, action) => {
      state.uploadAvatar.loading = "rejected";
      state.uploadAvatar.error = action.payload as Error;
    });
  },
});

export const selectJwtAccessToken = (state: RootState) =>
  state.authReducer.accessToken;
export const selectUserInfo = (state: RootState) => state.authReducer.user;
export const selectAuthLoadingState = (state: RootState) =>
  state.authReducer.loading;
export const { logout } = userSlice.actions;
export default userSlice.reducer;
