import React from "react";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

import UnAuthLayout from "@/layouts/UnAuth";
import { login, authWithGoogle } from "@/features/user/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
  selectJwtAccessToken,
  selectAuthLoadingState,
} from "@/features/user/authSlice";
import { environment_config } from "@/services/env-variables";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector(selectJwtAccessToken);
  const loginState = useSelector(selectAuthLoadingState);
  const selectorAuthError = useSelector(
    (state: RootState) => state.authReducer?.error,
  );

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (accessToken) {
      Router.push("/");
    }

    if (loginState === "rejected") {
      const errMsg = selectorAuthError?.message;
      toast.error(errMsg as string);
    }
  }, [accessToken, loginState, selectorAuthError]);

  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    const body = {
      email: data.email,
      password: data.password,
    };
    dispatch(login(body)).then(() => {
      setLoading(false);
    });
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const code = codeResponse?.code;
      dispatch(authWithGoogle({ code }));
    },
    flow: "auth-code",
    scope: environment_config.AUTH_GOOGLE_SCOPE,
  });

  return (
    <UnAuthLayout>
      <div className="w-3/4 md:w-1/2 flex flex-col items-center lg:items-start justify-center space-y-2">
        <h3 className="text-xl lg:text-2xl font-bold text-zenith-black mb-6">
          Log in to Zenith Calendar
        </h3>

        <button
          onClick={googleLogin}
          className="h-10 flex flex-row justify-center items-stretch bg-google-blue border border-google-blue rounded-sm hover:cursor-pointer"
        >
          <div className="p-2 flex flex-row justify-center items-center bg-white">
            <Image
              width={26}
              height={26}
              src={`${router.basePath}/assets/images/google-logo.svg`}
              alt="google"
            />
          </div>

          <div className="px-3 py-1 flex flex-row justify-center items-center">
            <span className="text-xs lg:text-sm font-bold text-white font-roboto">
              Sign in with Google
            </span>
          </div>
        </button>
      </div>

      <div className="w-3/4 md:w-1/2 relative flex items-center">
        <div className="flex-grow border-t border-zenith-gray"></div>
        <span className="flex-shrink mx-6 text-black text-sm">Or</span>
        <div className="flex-grow border-t border-zenith-gray"></div>
      </div>

      <form className="w-3/4 md:w-1/2" onSubmit={onSubmit}>
        <div className="grid grid-rows-1 shadow-sm gap-4 mb-2">
          <div>
            <label htmlFor="email" className="text-sm">
              E-mail address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              {...register("email")}
              className="appearance-none rounded relative block w-full px-3 py-2 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black focus:z-10 sm:text-sm"
              placeholder=""
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                {...register("password")}
                className="appearance-none rounded relative block w-full px-3 py-2 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black focus:z-10 sm:text-sm"
                placeholder=""
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Link href={"/forgot-password"} passHref={true}>
            <span className="text-xs font-medium text-zenith-black hover:cursor-pointer">
              Forgot your password?{" "}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 mb-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-850 hover:bg-red-900 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-red-900"
          >
            {!loading && "Log in to Zenith Calendar"}
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1">
          <p className="text-sm text-zenith-black">
            You don&apos;t have an account?{" "}
            <Link href={"/signup"} passHref={true}>
              <span className="font-bold underline underline-offset-1 hover:cursor-pointer">
                Sign up here!
              </span>
            </Link>
          </p>
        </div>
      </form>
    </UnAuthLayout>
  );
};

Login.public = true;

export default Login;
