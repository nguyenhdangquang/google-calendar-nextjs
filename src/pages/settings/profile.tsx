import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "react-avatar";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { RootState, AppDispatch } from "@/store/store";
import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";
import {
  uploadAvatar,
  updateProfile,
  getUserProfile,
  logout,
} from "@/features/user/authSlice";
import { UpdateProfileBody, UploadResponse } from "@/features/user/models";

const schema = yup
  .object({
    displayName: yup.string().optional(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  })
  .required();

const ProfileSettings = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFileBase64, setSelectedFileBase64] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string | Blob>("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Selector
  const selectorUserInfo = useSelector(
    (state: RootState) => state.authReducer?.profile.data,
  );

  const { register, handleSubmit, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(getUserProfile()).then((data) => {
      reset((data as any).payload);
    });
  }, [dispatch, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setUpdatingProfile(true);
    const body: UpdateProfileBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName as string,
    };

    if (selectedFileBase64) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadAvatarReq = await dispatch(uploadAvatar(formData));
      if (uploadAvatarReq.meta?.requestStatus === "rejected") {
        setUpdatingProfile(false);
        const errMsg =
          (data as any)?.payload?.message ||
          "An error occurred please try again later";
        return toast.error(errMsg as string);
      }

      const avatarUrl = (uploadAvatarReq.payload as UploadResponse).url;
      body.avatarUrl = avatarUrl;
    }

    return dispatch(updateProfile(body)).then((data) => {
      setUpdatingProfile(false);
      if (data.meta?.requestStatus === "rejected") {
        const errMsg =
          (data as any)?.payload?.message ||
          "An error occurred please try again later";
        toast.error(errMsg as string);
      } else {
        dispatch(getUserProfile()).then((data) => {
          if ((data as any).payload?.statusCode === 401) {
            dispatch(logout());
          }
        });
        toast.success("Update profile succesful");
      }
    });
  });

  const handleFileInput = async (e: React.ChangeEvent) => {
    // handle validations
    const target = e.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    setSelectedFile(file as Blob);
    const base64 = await toBase64(file as Blob);
    setSelectedFileBase64(base64 as string);
  };

  const toBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Main meta={<Meta title="Zenith" description="Zenith calendar." />}>
      <div className="h-screen">
        <div className="h-11 invisible"></div>
        <div className="flex flex-col content-between px-4 pt-11">
          <h4 className="pb-4 text-zenith-black font-semibold">Edit Profile</h4>

          <div className="flex -space-x-1 overflow-hidden items-center">
            <Avatar
              size="40"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              src={selectedFileBase64 || selectorUserInfo?.avatarUrl}
              name={`${selectorUserInfo?.firstName} ${selectorUserInfo?.lastName}`}
            />

            <div className="flex flex-col items-start pl-6">
              <button
                disabled={updatingProfile}
                onClick={() => fileInput.current && fileInput.current?.click()}
              >
                <p className="text-zenith-black text-sm font-semibold underline underline-offset-1 hover:cursor-pointer">
                  Change Photo
                </p>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInput}
                className="hidden"
                onChange={handleFileInput}
              />
              <span className="text-zenith-black font-light text-sm">
                256px x 256 px PNG or JPG
              </span>
            </div>
          </div>

          <form className="w-3/4 md:w-1/2 space-y-4 pt-10" onSubmit={onSubmit}>
            <div className="grid grid-rows-1 gap-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="text-zenith-black text-sm"
                >
                  Display name
                </label>
                <input
                  id="displayName"
                  type="displayName"
                  autoComplete="displayName"
                  {...register("displayName")}
                  className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black font-semibold focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                  placeholder=""
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="text-zenith-black text-sm"
                  >
                    First Name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    required
                    {...register("firstName")}
                    className="appearance-none rounded relative block w-full px-3 py-2 border bg-neutral-50 placeholder-neutral-50 text-zenith-black font-semibold focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                    placeholder=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="text-zenith-black text-sm"
                  >
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    required
                    {...register("lastName")}
                    className="appearance-none rounded relative block w-full px-3 py-2 border bg-neutral-50 placeholder-neutral-50 text-zenith-black font-semibold focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
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
                  disabled
                  {...register("email")}
                  className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black font-semibold focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid grid-cols-1">
              <button
                type="submit"
                disabled={updatingProfile}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-850 hover:bg-red-600 transition ease-in-out duration-150 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-red-900"
              >
                {!updatingProfile && <span>Save changes</span>}
                {updatingProfile && (
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

          {/* <div className="mt-60">
            <button className="text-sm text-red-850 font-semibold underline underline-offset-1">
              Delete account
            </button>
          </div> */}
        </div>
      </div>
    </Main>
  );
};

export default ProfileSettings;
