/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";
import { RootState, AppDispatch } from "@/store/store";
import {
  connectGoogleCalendar,
  fetchCalendars,
  fetchEvents,
} from "@/features/calendar/calendarSlice";
import { Calendar } from "@/features/calendar/models";

import { environment_config } from "@/services/env-variables";

const ConnectCalendar = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selector
  const selectorConnGoogleCalendarError = useSelector(
    (state: RootState) => state.calendarReducer.connectGoogleCalendar.error,
  );
  const selectorConnGoogleCalendarLoadingState = useSelector(
    (state: RootState) => state.calendarReducer.connectGoogleCalendar.loading,
  );

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const code = codeResponse?.code;
      dispatch(connectGoogleCalendar({ code })).then(() => {
        dispatch(fetchCalendars()).then(async (data) => {
          const reqStatus = data.meta?.requestStatus;
          if (reqStatus === "fulfilled") {
            const calendars = data?.payload;
            await Promise.all(
              (calendars as Calendar[]).map((item: Calendar) => {
                dispatch(fetchEvents(item?.id));
              }),
            );
          }
        });
      });
    },
    flow: "auth-code",
    scope: environment_config.AUTH_GOOGLE_SCOPE,
  });

  useEffect(() => {
    if (selectorConnGoogleCalendarLoadingState === "rejected") {
      const errMsg =
        selectorConnGoogleCalendarError?.message ||
        "An error occurred please try again later";
      toast.error(errMsg);
    }
  }, [selectorConnGoogleCalendarError, selectorConnGoogleCalendarLoadingState]);

  return (
    <Main meta={<Meta title="Zenith" description="Zenith calendar." />}>
      <div className="h-screen">
        <div className="h-11 invisible"></div>
        <div className="flex flex-col content-between px-4 pt-11">
          <h4 className="pb-4 text-zenith-black font-semibold">
            Connect calendar
          </h4>

          <div className="mt-4 flex flex-col space-y-4">
            <div className="inline-flex justify-between items-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-zenith-stone-100 focus:outline-none w-full">
              <span className="inline-flex justify-center items-center">
                <img
                  className="w-7 h-7"
                  src={`/assets/images/google-calendar-logo.svg`}
                  alt="Google Calendar"
                />
                <span className="text-zenith-black text-md font-semibold px-4">
                  Google Calendar
                </span>
              </span>

              <button
                onClick={googleLogin}
                className="bg-red-850 rounded-md border border-transparent px-5 py-1 text-white text-md font-semibold"
              >
                Connect
              </button>
            </div>

            <div className="inline-flex justify-between items-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-zenith-stone-100 focus:outline-none w-full">
              <span className="inline-flex justify-center items-center">
                <img
                  className="w-7 h-7"
                  src={`/assets/images/outlook-calendar-logo.svg`}
                  alt="Outlook Calendar"
                />
                <span className="text-zenith-black text-md font-semibold px-4">
                  Outlook Calendar
                </span>
              </span>

              <button className="bg-red-850 rounded-md border border-transparent px-5 py-1 text-white text-md font-semibold">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default ConnectCalendar;
