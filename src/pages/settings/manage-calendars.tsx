/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Transition } from "@headlessui/react";
import { compact, flatten, isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

import { RootState, AppDispatch } from "@/store/store";
import {
  fetchCalendars,
  fetchEvents,
  connectGoogleCalendar,
  reconnectGoogleCalendar,
} from "@/features/calendar/calendarSlice";
import {
  Calendar,
  UpdateCalendarBody,
  UpdateCalendarVisibilityDto,
} from "@/features/calendar/models";
import {
  updateCalendar,
  disconnectGoogleCalendar,
} from "@/features/calendar/calendarSlice";

// import ListBox from "@/components/Listbox";
import ModalAlert from "@/components/ModalAlert";
import DropdownColorPicker from "@/components/DropdownColorPicker";
import { environment_config } from "@/services/env-variables";

import { Main } from "@/templates/Main";
import { Meta } from "@/layouts/Meta";

// const showAsOptions = [{ id: 1, name: "Blocked", value: "blocked" }];

const schema = yup
  .object({
    showAs: yup.string().optional(),
    calendarName: yup.string().required(),
    calendarColour: yup.string().required(),
  })
  .required();

const ManageCalendar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const ggButtonRef = useRef<HTMLButtonElement>(null);

  const [calendarListing, setCalendars] = useState<Calendar[] | []>([]);
  const [selectedCalendar, setSelectCalendar] = useState<Calendar | null>(null);
  const [savingCalendarSetting, setSavingCalendarSetting] = useState(false);
  const [visibilityCalendars, setVisibilityCalendars] = useState<
    UpdateCalendarVisibilityDto[] | []
  >([]);
  const [selectedDisonnectCalendar, setSelectDisconnectCalendar] =
    useState<number>(0);
  const [showModalAlert, toogleModalAlert] = useState(false);
  const [disconnectingGoogleCalendar, setDisconnectingGoogleCalendar] =
    useState(false);
  const [expiredCalendarIds, setExpiredCalendarId] = useState<number[]>([]);
  const [selectedReconnCalendarId, setSelectReconnCalendarId] =
    useState<number>(0);

  // Selector
  const selectorListCalendars = useSelector(
    (state: RootState) => state.calendarReducer.listingCalendar.calendars,
  );
  const selectorConnGoogleCalendarError = useSelector(
    (state: RootState) => state.calendarReducer.connectGoogleCalendar.error,
  );
  const selectorConnGoogleCalendarLoadingState = useSelector(
    (state: RootState) => state.calendarReducer.connectGoogleCalendar.loading,
  );

  const availableCalendars = selectorListCalendars.filter((c) => !c.isDisabled);

  useEffect(() => {
    dispatch(fetchCalendars()).then(async (data) => {
      const reqStatus = data.meta?.requestStatus;
      if (reqStatus === "fulfilled") {
        const calendars = data?.payload;
        setCalendars(calendars as Calendar[]);
        const calendarIds = await Promise.all(
          (calendars as Calendar[]).map((item: Calendar) => {
            return dispatch(fetchEvents(item?.id)).then((data) => {
              const fetchEventState = data.meta?.requestStatus;
              if (
                fetchEventState === "rejected" &&
                (data as any).payload?.status === 401
              ) {
                return item.id;
              }

              return false;
            });
          }),
        );

        if (calendarIds.length) {
          setExpiredCalendarId(compact(calendarIds));
        }
      }
    });

    if (selectorConnGoogleCalendarLoadingState === "rejected") {
      const errMsg =
        selectorConnGoogleCalendarError?.message ||
        "An error occurred please try again later";
      toast.error(errMsg);
    }
  }, [
    dispatch,
    selectorConnGoogleCalendarLoadingState,
    selectorConnGoogleCalendarError,
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    // formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const colour = getValues("calendarColour");

  const onSelectCalendar = (calendar: Calendar) => {
    setSelectCalendar(calendar);
    setValue("calendarName", calendar.name);
    setValue("calendarColour", calendar.colour);
    const sourceCalendarsVisibility = flatten(
      calendarListing
        ?.filter((c) => c?.id !== calendar?.id)
        .map((c) =>
          c.targetCalendarVisibility?.filter(
            (i) => i.sourceId === calendar?.id,
          ),
        ),
    );

    const calendarsVisibility =
      sourceCalendarsVisibility?.map((item) => {
        return { calendarId: item?.targetId, showAs: item?.showAs };
      }) || [];
    setVisibilityCalendars(
      calendarsVisibility as UpdateCalendarVisibilityDto[],
    );
  };

  const onChangeCalendarColour = (color: string) => {
    setValue("calendarColour", color);
  };

  const onChangeVisibilityCalendars = (calendarId: number, value: boolean) => {
    let newVisibility;
    if (value) {
      const selectedCalendarVisible = visibilityCalendars.find(
        (item) => item.calendarId === calendarId,
      );
      newVisibility = [
        ...visibilityCalendars,
        { calendarId, showAs: selectedCalendarVisible?.showAs ?? "" },
      ];
    } else {
      newVisibility = visibilityCalendars.filter(
        (item) => item.calendarId !== calendarId,
      );
    }

    setVisibilityCalendars(newVisibility);
  };

  const onSubmit = handleSubmit((data) => {
    setSavingCalendarSetting(true);
    const body: UpdateCalendarBody = {
      name: data.calendarName,
      colour: data.calendarColour,
      availableWeekDaysPretty: { monday: true },
      visibilities: visibilityCalendars.length ? visibilityCalendars : [],
    };

    dispatch(updateCalendar({ body, calendarId: selectedCalendar?.id })).then(
      (data) => {
        setSavingCalendarSetting(false);
        if (data.meta?.requestStatus === "rejected") {
          const errMsg =
            (data as any)?.payload?.message ||
            "An error occurred please try again later";
          toast.error(errMsg as string);
        } else {
          toast.success("Update calendar succesful");
        }
      },
    );
  });

  const handleGoBackToListCalendars = () => {
    setSelectCalendar(null);
    dispatch(fetchCalendars()).then((data) => {
      const reqStatus = data.meta?.requestStatus;
      if (reqStatus === "fulfilled") {
        const calendars = data?.payload;
        setCalendars(calendars as Calendar[]);
      }
    });
  };

  const handleShowModalAlertDisconnectCalendar = (calendarId: number) => {
    setSelectDisconnectCalendar(calendarId);
    toogleModalAlert(true);
  };

  const handleDisconnectGoogleCalendar = () => {
    setDisconnectingGoogleCalendar(true);
    dispatch(
      disconnectGoogleCalendar({ calendarId: selectedDisonnectCalendar }),
    ).then((data) => {
      setDisconnectingGoogleCalendar(false);
      if (data.meta?.requestStatus === "rejected") {
        const errMsg =
          (data as any)?.payload?.message ||
          "An error occurred please try again later";
        toast.error(errMsg as string);
      } else {
        toast.success("Disconnect calendar succesful");
        handleTooggleModalAlert(false);
        dispatch(fetchCalendars());
      }
    });
  };

  const handleTooggleModalAlert = (value: boolean) => {
    if (!value) {
      setSelectDisconnectCalendar(0);
    }

    toogleModalAlert(value);
  };

  const handleReconnectGoogleCalendar = (c: Calendar) => {
    setSelectReconnCalendarId(c.id);
    ggButtonRef.current?.click();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const code = codeResponse?.code;
      dispatch(
        reconnectGoogleCalendar({ code, calendarId: selectedReconnCalendarId }),
      ).then(() => {
        dispatch(fetchCalendars());
      });
    },
    flow: "auth-code",
    scope: environment_config.AUTH_GOOGLE_SCOPE,
  });

  const handleConnectGoogleCalendar = useGoogleLogin({
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

  const hanleChangeShowAs = (e: any, calendarId: number) => {
    const selectedCalendarVisible = visibilityCalendars.find(
      (item) => item.calendarId === calendarId,
    );
    const newValue = {
      ...selectedCalendarVisible,
      showAs: e?.target?.value,
    };
    const newVisibility = visibilityCalendars.filter(
      (item) => item.calendarId !== calendarId,
    );
    setVisibilityCalendars([...newVisibility, newValue]);
  };

  return (
    <Main meta={<Meta title="Zenith" description="Zenith calendar." />}>
      <div className="h-screen">
        <div className="h-11 invisible"></div>

        <div className="flex flex-col px-4 pt-11">
          <Transition show={isEmpty(selectedCalendar)}>
            <h4 className="pb-4 text-zenith-black font-semibold">
              Connect calendar
            </h4>

            <div className="mt-4 flex flex-col space-y-4 mb-8">
              <div className="inline-flex justify-between items-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-zenith-stone-100 focus:outline-none md:w-full xl:w-4/5">
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
                  onClick={handleConnectGoogleCalendar}
                  className="bg-red-850 rounded-md border border-transparent px-5 py-1 text-white text-md font-semibold"
                >
                  Connect
                </button>
              </div>

              <div className="inline-flex justify-between items-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-zenith-stone-100 focus:outline-none md:w-full xl:w-4/5">
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

            <h4 className="pb-4 text-zenith-black font-semibold">
              Manage calendars
            </h4>

            <div className="mt-4 flex flex-col space-y-4">
              {availableCalendars.length > 0 &&
                availableCalendars.map((c) => (
                  <div
                    key={c.id}
                    className="inline-flex justify-between items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900 bg-neutral-50 hover:bg-blue-200 focus:outline-none md:w-full xl:w-4/5"
                  >
                    <span className="inline-flex justify-center items-center">
                      <img
                        className="w-7 h-7"
                        src={`${
                          c.providerType === "google"
                            ? "/assets/images/google-calendar-logo.svg"
                            : "/assets/images/outlook-calendar-logo.svg"
                        }`}
                        alt={`${
                          c.providerType === "google"
                            ? "Google Calendar"
                            : "Outlook Calendar"
                        }`}
                      />

                      <div className="flex flex-col items-start justify-between">
                        <span className="text-zenith-black text-md font-semibold px-4">
                          {c.name}
                        </span>

                        <span className="text-zenith-black text-xs font-light px-4">
                          {c.email}
                        </span>
                      </div>
                    </span>

                    <div className="flex flex-row justify-between space-x-6">
                      <button
                        onClick={() => onSelectCalendar(c)}
                        className="text-zenith-black text-md font-semibold"
                      >
                        <span className="underline underline-offset-1">
                          Edit
                        </span>
                      </button>

                      {expiredCalendarIds.includes(c.id) && (
                        <button
                          onClick={() => handleReconnectGoogleCalendar(c)}
                          className="text-zenith-black text-md font-semibold"
                        >
                          <span className="underline underline-offset-1">
                            Reconnect
                          </span>
                        </button>
                      )}

                      <button
                        ref={ggButtonRef}
                        onClick={googleLogin}
                        className="text-zenith-black text-md font-semibold hidden"
                      >
                        <span className="underline underline-offset-1">
                          Reconnect
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          handleShowModalAlertDisconnectCalendar(c.id)
                        }
                        className="text-red-850 text-md font-semibold"
                      >
                        <span className="underline underline-offset-1">
                          Disconnect
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </Transition>

          <Transition show={!isEmpty(selectedCalendar)}>
            <button
              disabled={savingCalendarSetting}
              onClick={handleGoBackToListCalendars}
              className="text-zenith-black text-sm font-semibold pb-4"
            >
              <span className="underline underline-offset-1">
                Go back to all calendars
              </span>
            </button>

            <h4 className="pb-4 text-zenith-black text-md font-semibold">
              {selectedCalendar?.name} edit
            </h4>

            <div className="space-y-6">
              <p className="text-zenith-black text-sm">
                Visibility in other calendars
              </p>

              <div className="w-1/2">
                <p className="text-zenith-black text-xs">
                  If events are scheduled on this calendar, then choose the
                  calendars which will be blocked for the same time slot i.e.
                  other people will not be able to create events on those
                  calendars. Also enter the text that you would like to be
                  displayed on the other calendars
                </p>
              </div>

              <form
                className="grid grid-cols-1 items-center justify-between space-y-6"
                onSubmit={onSubmit}
              >
                {availableCalendars
                  .filter((item) => item.id !== selectedCalendar?.id)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-col items-start space-y-3"
                    >
                      <div className="flex flex-row items-start">
                        <input
                          id="calendar"
                          name="calendar"
                          type="checkbox"
                          defaultChecked={false}
                          onChange={(e) =>
                            onChangeVisibilityCalendars(c.id, e.target?.checked)
                          }
                          className="h-4 w-4 text-zenith-black focus:ring-zenith-black border-zenith-black focus:bg-zenith-black rounded accent-zenith-black"
                        />
                        <label
                          htmlFor="calendar"
                          className="ml-2 block text-sm text-zenith-black font-semibold leading-4"
                        >
                          {c.name} <br></br>
                          <span className="text-xs text-zenith-black font-thin">
                            {c.email}
                          </span>
                        </label>
                      </div>

                      <div className="w-1/3 pl-6 space-y-1">
                        <label
                          htmlFor="calendar-show-as"
                          className="text-sm text-zenith-black"
                        >
                          Show as
                        </label>
                        <div className="relative">
                          <input
                            id="calendar-show-as"
                            type="text"
                            disabled={
                              !visibilityCalendars.find(
                                (item) => item.calendarId === c.id,
                              )
                            }
                            value={
                              visibilityCalendars.find(
                                (item) => item.calendarId === c.id,
                              )?.showAs ?? ""
                            }
                            onChange={(e) => hanleChangeShowAs(e, c.id)}
                            className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black font-semibold focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                {/* <div className="flex items-start">
                  <input
                    id="calendar"
                    name="calendar"
                    type="checkbox"
                    defaultChecked={true}
                    className="h-4 w-4 text-zenith-black focus:ring-zenith-black border-zenith-black focus:bg-zenith-black rounded accent-zenith-black"
                  />
                  <label
                    htmlFor="calendar"
                    className="ml-2 block text-sm text-zenith-black font-semibold leading-4"
                  >
                    Office Calendar <br></br>
                    <span className="text-xs text-zenith-black font-thin">
                      thomasjackson@companyname.com
                    </span>
                  </label>
                </div> */}

                {/* <div className="flex items-start">
                  <input
                    id="calendar"
                    name="calendar"
                    type="checkbox"
                    defaultChecked={true}
                    className="h-4 w-4 text-zenith-black focus:ring-zenith-black border-zenith-black focus:bg-zenith-black rounded accent-zenith-black"
                  />
                  <label
                    htmlFor="calendar"
                    className="ml-2 block text-sm text-zenith-black font-semibold leading-4"
                  >
                    Office Calendar <br></br>
                    <span className="text-xs text-zenith-black font-thin">
                      thomasjackson@companyname.com
                    </span>
                  </label>
                </div> */}

                {/* <div className="w-1/3 pl-6">
                  <ListBox zIndex={20} data={showAsOptions} label="Show as" />
                </div> */}

                {/* <div className="w-1/3 pl-6 space-y-1">
                  <label
                    htmlFor="calendar-name"
                    className="text-sm text-zenith-black"
                  >
                    Show as
                  </label>
                  <div className="relative">
                    <input
                      id="calendar-name"
                      type="text"
                      disabled
                      value={showAsOptions[0]?.name}
                      className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black font-semibold focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                    />
                  </div>
                </div> */}

                <div className="w-1/3 space-y-1">
                  <label
                    htmlFor="calendar-name"
                    className="text-sm text-zenith-black"
                  >
                    Calendar name
                  </label>
                  <div className="relative">
                    <input
                      id="calendar-name"
                      type="text"
                      required
                      {...register("calendarName")}
                      className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black font-semibold focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                    />
                  </div>
                </div>

                <div className="w-1/3">
                  <DropdownColorPicker
                    color={colour}
                    onChangeValue={onChangeCalendarColour}
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingCalendarSetting}
                  className="group relative w-1/3 flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-850 hover:bg-red-600 transition ease-in-out duration-150 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-red-900"
                >
                  {!savingCalendarSetting && <span>Save changes</span>}
                  {savingCalendarSetting && (
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
              </form>
            </div>
          </Transition>
        </div>
      </div>

      <ModalAlert
        title="Disconnect calendar"
        content="Are you sure you want to disconnect this calendar?"
        isOpen={showModalAlert}
        setIsOpen={handleTooggleModalAlert}
        loading={disconnectingGoogleCalendar}
        onClickConfirm={handleDisconnectGoogleCalendar}
      />
    </Main>
  );
};

export default ManageCalendar;
