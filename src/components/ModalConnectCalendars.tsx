/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";

import { RootState, AppDispatch } from "@/store/store";
import {
  connectGoogleCalendar,
  fetchCalendars,
  fetchEvents,
} from "@/features/calendar/calendarSlice";
import { Calendar } from "@/features/calendar/models";
import { environment_config } from "@/services/env-variables";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function ModalConnectCalendars(props: ModalProps) {
  const { isOpen, setIsOpen } = props;
  const dispatch = useDispatch<AppDispatch>();

  // Selector
  const selectorConnGoogleCalendarError = useSelector(
    (state: RootState) => state.calendarReducer.connectGoogleCalendar.error,
  );
  const selectorConnGoogleCalendarLoadingState = useSelector(
    (state: RootState) => state.calendarReducer.connectGoogleCalendar.loading,
  );
  const selectorListCalendars = useSelector(
    (state: RootState) => state.calendarReducer.listingCalendar.calendars,
  );

  const availableCalendars = selectorListCalendars.filter((c) => !c.isDisabled);

  let description = "";

  switch (Number(availableCalendars.length)) {
    case 0:
      description =
        "In order to start using Zenith and see all benefits of it, you need to connect at least two of your calendars to Zenith.";
      break;
    case 1:
      description =
        "First calendar connected! Add at least one more to be able to enjoy Zenith!";
      break;
    case 2:
      description =
        "Two calendars added! Keeping adding or start using Zenith now!";
      break;
    default:
      description = "Keeping adding or start using Zenith now!";
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (selectorConnGoogleCalendarLoadingState === "rejected") {
      const errMsg =
        selectorConnGoogleCalendarError?.message ||
        "An error occurred please try again later";
      toast.error(errMsg);
    }
  }, [selectorConnGoogleCalendarError, selectorConnGoogleCalendarLoadingState]);

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

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => null}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto shadow-sm">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-zenith-black"
                  >
                    Connect your calendars
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-zenith-black">{description}</p>
                  </div>

                  <div className="mt-4 flex flex-col space-y-4">
                    {availableCalendars.length > 0 &&
                      availableCalendars.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="inline-flex justify-between items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none w-full"
                        >
                          <span className="inline-flex justify-center items-center">
                            <img
                              className="w-7 h-7"
                              src={`/assets/images/google-calendar-logo.svg`}
                              alt="Google Calendar"
                            />

                            <div className="flex flex-col items-start justify-between">
                              <span className="text-zenith-black text-md font-semibold px-4">
                                Google Calendar
                              </span>

                              <span className="text-zenith-black text-xs font-light px-4">
                                {c.email}
                              </span>
                            </div>
                          </span>

                          <span className="text-zenith-emerald text-md font-semibold">
                            Connected!
                          </span>
                        </button>
                      ))}
                    <button
                      type="button"
                      className="inline-flex justify-between items-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none w-full"
                      onClick={googleLogin}
                    >
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

                      <span className="text-zenith-black text-md font-semibold underline underline-offset-1">
                        Connect
                      </span>
                    </button>

                    <button
                      type="button"
                      className="inline-flex justify-between items-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none w-full"
                      onClick={closeModal}
                    >
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

                      <span className="text-zenith-black text-md font-semibold underline underline-offset-1">
                        Connect
                      </span>
                    </button>

                    <button
                      type="button"
                      className="inline-flex justify-between items-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none w-full"
                      onClick={closeModal}
                    >
                      <span className="inline-flex justify-center items-center">
                        <span className="w-7 h-7 invisible"></span>
                        <span className="text-zenith-black text-md font-semibold px-4">
                          Calendar
                        </span>
                      </span>

                      <span className="text-zenith-black text-md font-semibold underline underline-offset-1">
                        Connect
                      </span>
                    </button>
                  </div>

                  {availableCalendars.length < 3 && (
                    <div className="mt-14 flex flex-col justify-center items-center">
                      <button
                        type="button"
                        className="w-24 h-6"
                        onClick={closeModal}
                      >
                        <span className="text-zenith-black text-sm font-semibold underline underline-offset-1">
                          Skip it for now
                        </span>
                      </button>
                    </div>
                  )}

                  {availableCalendars.length >= 3 && (
                    <div className="mt-14 flex flex-col justify-center items-center">
                      <button
                        type="button"
                        className="w-3/4 h-10 bg-red-850 text-white font-semibold rounded-md"
                        onClick={closeModal}
                      >
                        Start using Zenith!
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Toaster />
    </>
  );
}
