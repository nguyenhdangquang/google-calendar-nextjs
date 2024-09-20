import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import { EyeIcon, CheckCircleIcon, EyeOffIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";

import { AppDispatch } from "@/store/store";
import { changePassword } from "@/features/user/authSlice";

// extend yup
YupPassword(yup);

const schema = yup
  .object({
    currentPassword: yup.string().required(),
    newPassword: yup
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
      .oneOf([yup.ref("newPassword"), null], "Password does not match"),
  })
  .required();

const ChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const newPassword: string = watch("newPassword") || "";
  const confirmPassword: string = watch("confirmPassword");
  const isLengthError = !(
    newPassword &&
    newPassword.length >= 8 &&
    newPassword.length <= 64
  );
  const isMinUppercaseError = !(
    newPassword && (newPassword.match(/[A-Z]/g) || []).length >= 1
  );
  const isMinLowercaseError = !(
    newPassword && (newPassword.match(/[a-z]/g) || []).length >= 1
  );
  const isMinNumberError = !(
    newPassword && (newPassword.match(/[0-9]/g) || []).length >= 1
  );
  const isConfirmPasswordError =
    confirmPassword && errors.confirmPassword?.type?.toString() === "oneOf";
  const [currentPasswordShown, setCurrentPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const togglePassword = (field: string) => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    if (field === "currentPassword") {
      setCurrentPasswordShown(!currentPasswordShown);
    } else if (field === "newPassword") {
      setNewPasswordShown(!newPasswordShown);
    } else {
      setConfirmPasswordShown(!confirmPasswordShown);
    }
  };

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    const body = {
      password: data.currentPassword,
      newPassword: data.newPassword,
    };
    dispatch(changePassword(body)).then((data) => {
      setLoading(false);
      if (data.meta?.requestStatus === "rejected") {
        const errMsg =
          (data as any)?.payload?.message ||
          "An error occurred please try again later";
        toast.error(errMsg as string);
      } else {
        toast.success("Change password succesful");
        reset();
      }
    });
  });

  return (
    <Main meta={<Meta title="Zenith" description="Zenith calendar." />}>
      <div className="h-screen">
        <div className="h-11 invisible"></div>
        <div className="flex flex-col content-between px-4 pt-11">
          <h4 className="pb-4 text-zenith-black font-semibold">
            Change Password
          </h4>

          <form
            className="w-3/4 md:w-1/2 xl:w-2/5 space-y-6"
            action="#"
            onSubmit={onSubmit}
          >
            <div>
              <label
                htmlFor="current-password"
                className={`text-sm text-zenith-black`}
              >
                Current password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={currentPasswordShown ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  {...register("currentPassword")}
                  className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                  placeholder=""
                />

                <div
                  onClick={() => togglePassword("currentPassword")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 hover:cursor-pointer"
                >
                  {currentPasswordShown ? (
                    <EyeOffIcon className="h-5 w-5 text-zenith-black"></EyeOffIcon>
                  ) : (
                    <EyeIcon className="h-5 w-5 text-zenith-black"></EyeIcon>
                  )}
                </div>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className={`text-sm text-zenith-black`}
              >
                New password
              </label>

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
                <span className="text-xs text-zenith-black">
                  An uppercase letter
                </span>
              </div>

              <div className="flex flex-row space-x-1">
                <CheckCircleIcon
                  className={`h-4 w-4 ${
                    isMinLowercaseError || !isDirty
                      ? "text-zenith-gray-50"
                      : "text-zenith-black"
                  }`}
                ></CheckCircleIcon>
                <span className="text-xs text-zenith-black">
                  A lowercase letter
                </span>
              </div>

              <div className="flex flex-row space-x-1 mb-2">
                <CheckCircleIcon
                  className={`h-4 w-4 ${
                    isMinNumberError || !isDirty
                      ? "text-zenith-gray-50"
                      : "text-zenith-black"
                  }`}
                ></CheckCircleIcon>
                <span className="text-xs text-zenith-black">A number</span>
              </div>

              <div className="relative">
                <input
                  id="new-password"
                  type={newPasswordShown ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  {...register("newPassword")}
                  className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                  placeholder=""
                />

                <div
                  onClick={() => togglePassword("newPassword")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 hover:cursor-pointer"
                >
                  {newPasswordShown ? (
                    <EyeOffIcon className="h-5 w-5 text-zenith-black"></EyeOffIcon>
                  ) : (
                    <EyeIcon className="h-5 w-5 text-zenith-black"></EyeIcon>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label
                htmlFor="confirm-password"
                className={`text-sm ${
                  isConfirmPasswordError
                    ? "text-red-800 font-semibold"
                    : "text-zenith-black"
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
                {!loading && <span>Change password</span>}
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
        </div>
      </div>
    </Main>
  );
};

export default ChangePassword;
