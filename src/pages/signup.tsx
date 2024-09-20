import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
// import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import YupPassword from "yup-password";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

import {
  signUp,
  resendConfirmEmail,
  authWithGoogle,
} from "@/features/user/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { selectJwtAccessToken } from "@/features/user/authSlice";

import UnAuthLayout from "@/layouts/UnAuth";
import { environment_config } from "@/services/env-variables";

// extend yup
YupPassword(yup);

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .password()
      .min(8, "Password must be at least 8 characters")
      .max(64)
      .minLowercase(1, "Password must contain at least 1 lowercase letter")
      .minUppercase(1, "Password must contain at least 1 uppercase letter")
      .minNumbers(1, "Password must contain at least 1 number")
      .minSymbols(0),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password does not match"),
  })
  .required();

const SignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [acceptTerm, setAcceptTerm] = useState(false);
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const [requestingSendConfirmEmail, setRequestingSendConfirmEmail] =
    useState(false);
  const accessToken = useSelector(selectJwtAccessToken);

  // Selector
  const selectorAuthLoadingState = useSelector(
    (state: RootState) => state.authReducer?.loading,
  );
  const selectorAuthError = useSelector(
    (state: RootState) => state.authReducer?.error,
  );
  const selectorResendEmailLoadingState = useSelector(
    (state: RootState) => state.authReducer?.resendConfirmEmail?.loading,
  );

  // Side Efffect
  useEffect(() => {
    if (accessToken) {
      Router.push("/");
    }

    if (selectorAuthLoadingState === "fulfilled" && !accessToken) {
      setShowConfirmEmail(true);
    }

    if (selectorResendEmailLoadingState === "fulfilled") {
      toast.success(
        "We sent a new confirmation e-mail to you. Please check your inbox",
      );
    }

    if (selectorResendEmailLoadingState === "rejected") {
      toast.error("An error occurred please try again later");
    }
  }, [
    accessToken,
    selectorAuthLoadingState,
    selectorAuthError,
    selectorResendEmailLoadingState,
  ]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const email = getValues("email");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    const body = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };
    dispatch(signUp(body)).then((data) => {
      setLoading(false);
      if (data.meta?.requestStatus === "rejected") {
        const errMsg =
          (data as any)?.payload?.message ||
          "An error occurred please try again later";
        toast.error(errMsg as string);
      }
    });
  });

  const togglePassword = (field: string) => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    if (field === "password") {
      setPasswordShown(!passwordShown);
    } else {
      setConfirmPasswordShown(!confirmPasswordShown);
    }
  };

  const handleResendConfirmEmail = () => {
    const body = {
      email,
    };
    setRequestingSendConfirmEmail(true);
    const toastId = toast.loading("Sending...");

    dispatch(resendConfirmEmail(body)).then(() => {
      setRequestingSendConfirmEmail(false);
      toast.dismiss(toastId);
    });
  };

  const handleRouteToLogin = () => {
    toast.dismiss();
    router.push("/login");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const code = codeResponse?.code;
      dispatch(authWithGoogle({ code }));
    },
    flow: "auth-code",
    scope: environment_config.AUTH_GOOGLE_SCOPE,
  });

  if (showConfirmEmail) {
    return (
      <UnAuthLayout>
        <div className="w-3/4 md:w-1/2 flex flex-col items-center lg:items-start justify-center space-y-2">
          <h3 className="text-xl lg:text-2xl font-bold text-zenith-black mb-6">
            Confirm your e-mail!
          </h3>

          <p className="text-xs text-zenith-black">
            You’re almost done! We’ve just sent you an e-mail to{" "}
            <span className="font-bold underline underline-offset-1">
              {email}
            </span>
            , please confirm the account creation there and you’re all set!
          </p>

          <div className="text-xs text-zenith-black">
            Didn’t get an e-mail?{" "}
            <button
              disabled={requestingSendConfirmEmail}
              onClick={handleResendConfirmEmail}
              className="font-bold underline underline-offset-1 hover:cursor-pointer"
            >
              Resend
            </button>{" "}
            it here or{" "}
            <button className="font-bold underline underline-offset-1 hover:cursor-pointer">
              contact us
            </button>{" "}
            with any problems.
          </div>
        </div>
      </UnAuthLayout>
    );
  }

  return (
    <UnAuthLayout>
      <div className="w-3/4 md:w-1/2 flex flex-col items-center lg:items-start justify-center space-y-2">
        <h3 className="text-xl lg:text-2xl font-bold text-zenith-black mb-6">
          Sign up to Zenith Calendar
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

        <p className="text-xs text-zenith-black">
          Google{" "}
          <span className="font-bold underline underline-offset-1 hover:cursor-pointer">
            Privacy Policy
          </span>{" "}
          and{" "}
          <span className="font-bold underline underline-offset-1 hover:cursor-pointer">
            Terms of Service
          </span>{" "}
          apply.
        </p>
      </div>

      <div className="w-3/4 md:w-1/2 relative flex items-center">
        <div className="flex-grow border-t border-zenith-gray"></div>
        <span className="flex-shrink mx-6 text-black text-sm">Or</span>
        <div className="flex-grow border-t border-zenith-gray"></div>
      </div>

      <form className="w-3/4 md:w-1/2 space-y-4" onSubmit={onSubmit}>
        <input type="hidden" name="remember" value="true" />
        <div className="grid grid-rows-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="text-zenith-black text-sm">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                required
                {...register("firstName")}
                className="appearance-none rounded relative block w-full px-3 py-2 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black focus:z-10 sm:text-sm"
                placeholder=""
              />
            </div>
            <div>
              <label htmlFor="last-name" className="text-zenith-black text-sm">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                required
                {...register("lastName")}
                className="appearance-none rounded relative block w-full px-3 py-2 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black focus:z-10 sm:text-sm"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-zenith-black text-sm">
              E-mail address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              {...register("email")}
              className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
              placeholder=""
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`text-sm ${errors?.password ? "text-red-600" : ""}`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={passwordShown ? "text" : "password"}
                autoComplete="current-password"
                required
                {...register("password")}
                className={`appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm ${
                  errors?.password ? "border-red-600" : ""
                }`}
                placeholder=""
              />

              <div
                onClick={() => togglePassword("password")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 hover:cursor-pointer"
              >
                {passwordShown ? (
                  <EyeOffIcon className="h-5 w-5 text-zenith-black"></EyeOffIcon>
                ) : (
                  <EyeIcon className="h-5 w-5 text-zenith-black"></EyeIcon>
                )}
              </div>
            </div>

            <span
              className={`text-xs text-red-600 ${
                errors?.password ? "visible" : "invisible"
              }`}
            >
              {errors?.password?.message?.toString() ?? ""}
            </span>
          </div>

          <div>
            <label
              htmlFor="password"
              className={`text-sm ${
                errors?.confirmPassword ? "text-red-600" : ""
              }`}
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={confirmPasswordShown ? "text" : "password"}
                autoComplete="current-password"
                required
                {...register("confirmPassword")}
                className={`appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm ${
                  errors?.confirmPassword ? "border-red-600" : ""
                }`}
                placeholder=""
              />

              <div
                onClick={() => togglePassword("confirmPassword")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 hover:cursor-pointer"
              >
                {confirmPasswordShown ? (
                  <EyeOffIcon className="h-5 w-5 text-zenith-black"></EyeOffIcon>
                ) : (
                  <EyeIcon className="h-5 w-5 text-zenith-black"></EyeIcon>
                )}
              </div>
            </div>

            <span
              className={`text-xs text-red-600 ${
                errors?.confirmPassword ? "visible" : "invisible"
              }`}
            >
              {errors?.confirmPassword?.message?.toString() ?? ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center justify-between">
          <div className="flex items-start">
            <input
              id="accept-term"
              name="accept-term"
              type="checkbox"
              defaultChecked={acceptTerm}
              onChange={() => setAcceptTerm(!acceptTerm)}
              className="h-5 w-5 text-zenith-black focus:ring-zenith-black border-zenith-black focus:bg-zenith-black rounded accent-zenith-black"
            />
            <label
              htmlFor="accept-term"
              className="ml-2 block text-xs text-zenith-black"
            >
              By creating an account I agree with Zenith Calendar’s{" "}
              <span className="font-bold underline underline-offset-1 hover:cursor-pointer">
                Privacy Policy
              </span>{" "}
              and{" "}
              <span className="font-bold underline underline-offset-1 hover:cursor-pointer">
                Terms of Service
              </span>
              .
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <button
            type="submit"
            disabled={loading || !acceptTerm}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-850 hover:bg-red-600 transition ease-in-out duration-150 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-red-900 ${
              (loading || !acceptTerm) && "cursor-not-allowed"
            }`}
          >
            {!loading && <span>Sign up to Zenith Calendar</span>}
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
            Already have an account?{" "}
            <button type="button" onClick={handleRouteToLogin}>
              <span className="font-bold underline underline-offset-1 hover:cursor-pointer">
                Log in here!
              </span>
            </button>
          </p>
        </div>
      </form>
    </UnAuthLayout>
  );
};

SignUp.public = true;

export default SignUp;
