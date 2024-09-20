import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import UnAuthLayout from "@/layouts/UnAuth";
import toast from "react-hot-toast";

import {
  forgotPassword,
  resendForgotPassword,
} from "@/features/user/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import Router from "next/router";

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [requestingForgotPassword, setRequestingForgotPassword] =
    useState(false);

  // Selector
  const selectorForgotPassLoadingState = useSelector(
    (state: RootState) => state.authReducer?.forgotPassword.loading,
  );

  const selectorResendForgotPassLoadingState = useSelector(
    (state: RootState) => state.authReducer?.resendForgotPassword.loading,
  );

  // Side Efffect
  useEffect(() => {
    if (selectorResendForgotPassLoadingState === "fulfilled") {
      toast.success(
        "We sent a reset password e-mail to you. Please check your inbox",
      );
    }

    if (selectorResendForgotPassLoadingState === "rejected") {
      toast.error("An error occurred please try again later");
    }

    if (selectorForgotPassLoadingState === "fulfilled") {
      setShowCheckEmail(true);
    }

    if (selectorForgotPassLoadingState === "rejected") {
      toast.error("An error occurred please try again later");
    }
  }, [selectorResendForgotPassLoadingState, selectorForgotPassLoadingState]);

  const { register, getValues, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const email = getValues("email");
  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    const body = {
      email: data.email,
    };
    dispatch(forgotPassword(body)).then(() => {
      setLoading(false);
    });
  });

  const handleResendForgotPassword = () => {
    const body = {
      email,
    };
    setRequestingForgotPassword(true);
    const toastId = toast.loading("Sending...");

    dispatch(resendForgotPassword(body)).then(() => {
      setRequestingForgotPassword(false);
      toast.dismiss(toastId);
    });
  };

  const handleRouteToLoginPage = () => {
    Router.push("/login");
  };

  if (showCheckEmail) {
    return (
      <UnAuthLayout>
        <div className="w-3/4 md:w-1/2 flex flex-col items-center lg:items-start justify-center space-y-4">
          <h3 className="text-xl lg:text-2xl font-bold text-zenith-black">
            Check your email!
          </h3>

          <p className="text-xs text-zenith-black">
            You should receive an e-mail from Zenith Calendar with the
            instruction how to reset your password in next 15 minutes.
          </p>

          <button
            type="button"
            onClick={handleRouteToLoginPage}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-zenith-black focus:outline-none focus:ring-0 focus:ring-offset-2"
          >
            Back to log in page
          </button>

          <div className="text-xs text-zenith-black">
            Didn’t get an e-mail?{" "}
            <button
              disabled={requestingForgotPassword}
              onClick={handleResendForgotPassword}
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
        <h3 className="text-xl lg:text-2xl font-bold text-zenith-black">
          Forgot your password?
        </h3>

        <p className="text-xs text-zenith-black">
          Please enter your e-mail address in the field below and follow the
          instructions you’ll receive on your e-mail.
        </p>
      </div>

      <form className="w-3/4 md:w-1/2 space-y-6" onSubmit={onSubmit}>
        <div className="grid grid-rows-1 shadow-sm gap-4">
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
        </div>

        <div className="grid grid-cols-1">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-850 hover:bg-red-900 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-red-900"
          >
            {!loading && <span>Reset my password</span>}
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
          <Link href={"/login"}>
            <p className="text-sm text-zenith-black font-bold underline underline-offset-1 hover:cursor-pointer">
              Go back to log in
            </p>
          </Link>
        </div>
      </form>
    </UnAuthLayout>
  );
};

ForgotPassword.public = true;

export default ForgotPassword;
