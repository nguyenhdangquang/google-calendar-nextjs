import { useState, useEffect } from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  EyeOffIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import YupPassword from "yup-password";
import toast from "react-hot-toast";

import UnAuthLayout from "@/layouts/UnAuth";

import { resetPassword } from "@/features/user/authSlice";
import { AppDispatch, RootState } from "@/store/store";

// extend yup
YupPassword(yup);

const schema = yup
  .object({
    password: yup
      .string()
      .password()
      .min(8)
      .max(64)
      .minLowercase(1)
      .minUppercase(1)
      .minNumbers(1)
      .minSymbols(0),
    confirmPassword: yup
      .string()
      .password()
      .min(8)
      .max(64)
      .minLowercase(1)
      .minUppercase(1)
      .minNumbers(1)
      .minSymbols(0)
      .oneOf([yup.ref("password"), null], "Password does not match"),
  })
  .required();

const CreateNewPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const token = router.query?.token;

  // Selector
  const selectorResetPassLoadingState = useSelector(
    (state: RootState) => state.authReducer?.resetPassword.loading,
  );

  const selectorResetPassError = useSelector(
    (state: RootState) => state.authReducer?.resetPassword.error,
  );

  // Side Efffect
  useEffect(() => {
    if (selectorResetPassLoadingState === "fulfilled") {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-zenith-emerald shadow-sm rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <p className="text-sm text-white font-bold">Password changed!</p>
              <p className="text-xs text-white">
                You can now log in using your new password.
              </p>
            </div>
            <div className="flex items-start">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none"
              >
                <XIcon className="h-4 w-4 text-white"></XIcon>
              </button>
            </div>
          </div>
        ),
        { duration: 3000 },
      );

      setTimeout(() => {
        router.push("/login");
      }, 5000);
    }

    if (selectorResetPassLoadingState === "rejected") {
      const message =
        selectorResetPassError?.message ||
        "An error occurred please try again later";
      toast.error(message as string);
    }
  }, [selectorResetPassLoadingState, selectorResetPassError, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const password: string = watch("password") || "";
  const confirmPassword: string = watch("confirmPassword");
  const isLengthError = !(
    password &&
    password.length >= 8 &&
    password.length <= 64
  );
  const isMinUppercaseError = !(
    password && (password.match(/[A-Z]/g) || []).length >= 1
  );
  const isMinLowercaseError = !(
    password && (password.match(/[a-z]/g) || []).length >= 1
  );
  const isMinNumberError = !(
    password && (password.match(/[0-9]/g) || []).length >= 1
  );
  const isConfirmPasswordError =
    confirmPassword && errors?.confirmPassword?.type?.toString() === "oneOf";
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const togglePassword = (field: string) => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    if (field === "password") {
      setPasswordShown(!passwordShown);
    } else {
      setConfirmPasswordShown(!confirmPasswordShown);
    }
  };

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    const body = {
      token: token as string,
      newPassword: data.password,
    };
    dispatch(resetPassword(body)).then(() => {
      setLoading(false);
    });
  });

  return (
    <UnAuthLayout>
      <div className="w-3/4 md:w-1/2 flex flex-col items-center lg:items-start justify-center space-y-2">
        <h3 className="text-xl lg:text-2xl font-bold text-zenith-black">
          Create new password
        </h3>

        <p className="text-sm text-zenith-black">New password</p>

        <div className="flex flex-row space-x-1">
          <CheckCircleIcon
            className={`h-4 w-4 ${
              isLengthError ? "text-zenith-gray-50" : "text-zenith-black"
            }`}
          ></CheckCircleIcon>
          <span className="text-xs text-zenith-black">
            Between 8 and 64 characters
          </span>
        </div>

        <div className="flex flex-row space-x-1">
          <CheckCircleIcon
            className={`h-4 w-4 ${
              isMinUppercaseError || !isDirty
                ? "text-zenith-gray-50"
                : "text-zenith-black"
            }`}
          ></CheckCircleIcon>
          <span className="text-xs text-zenith-black">An uppercase letter</span>
        </div>

        <div className="flex flex-row space-x-1">
          <CheckCircleIcon
            className={`h-4 w-4 ${
              isMinLowercaseError || !isDirty
                ? "text-zenith-gray-50"
                : "text-zenith-black"
            }`}
          ></CheckCircleIcon>
          <span className="text-xs text-zenith-black">A lowercase letter</span>
        </div>

        <div className="flex flex-row space-x-1">
          <CheckCircleIcon
            className={`h-4 w-4 ${
              isMinNumberError || !isDirty
                ? "text-zenith-gray-50"
                : "text-zenith-black"
            }`}
          ></CheckCircleIcon>
          <span className="text-xs text-zenith-black">A number</span>
        </div>
      </div>

      <form className="w-3/4 md:w-1/2 space-y-6" action="#" onSubmit={onSubmit}>
        <div>
          <div className="relative">
            <input
              id="password"
              type={passwordShown ? "text" : "password"}
              autoComplete="current-password"
              required
              {...register("password")}
              className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
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
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className={`text-sm ${
              isConfirmPasswordError ? "text-red-800" : "text-zenith-black"
            }`}
          >
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={confirmPasswordShown ? "text" : "password"}
              autoComplete="current-password"
              required
              {...register("confirmPassword")}
              className={`appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm ${
                isConfirmPasswordError ? "border-red-800" : ""
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
        </div>

        <div className="grid grid-cols-1">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-850 hover:bg-red-900 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-red-900"
          >
            {!loading && <span>Create new password</span>}
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
      </form>
    </UnAuthLayout>
  );
};

CreateNewPassword.public = true;

export default CreateNewPassword;
