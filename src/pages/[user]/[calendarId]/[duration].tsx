import React, { useContext } from "react";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import GlobalContext from "@/context/GlobalContext";
import SmallCalendar from "@/components/SmallCalendar";
import {
  createEvent,
  fetchEventsByDate,
} from "@/features/calendar/calendarSlice";
import Avatar from "react-avatar";
import { chain, map } from "lodash";
import {
  DATE_TIME_FORMAT,
  TIME_FORMAT,
  TIME_ON_SELECT_FORMAT,
} from "@/utils/constant";
import { getMonth, parseMinutesToString } from "@/utils";
import { v4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import {
  CreateEventPayload,
  Event,
  EventResponse,
  EventsByDateBody,
} from "@/features/calendar/models";
import LoadingComponent from "@/components/Loading";
import Image from "next/image";
import { User as UserInterface } from "@/features/user/models";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const durationSelection = [
  {
    key: 0,
    value: 15,
    detail: "Consultancy appointments",
  },
  {
    key: 1,
    value: 30,
    detail: "Studio Introduction",
  },
  {
    key: 2,
    value: 60,
    detail: "Consultancy appointments",
  },
];

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    meetingName: yup.string().required(),
  })
  .required();

const MeetingDetail = () => {
  const [time, setTime] = React.useState<null | string | number>(null);
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [dataCreateBookingStep, setDataCreateBookingStep] =
    React.useState<CreateEventPayload | null>(null);
  const [timeSelection, setTimeSelection] = React.useState<
    {
      key: string;
      value: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingEvent, setIsLoadingEvent] = React.useState<boolean>(false);
  const [listEvents, setListEvents] = React.useState<Event[]>([]);
  const [eventCreated, setEventCreated] = React.useState<EventResponse | null>(
    null,
  );
  const [duration, setDuration] = React.useState<number>(15);
  const [dateSelection, setDateSelection] = React.useState<any>(null);
  const [userInfoState, setUserInfoState] = React.useState<any>(null);
  const { daySelected, monthIndex, setDaySelected } = useContext(GlobalContext);
  const route = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const generateTimeSelection = (
    hourStart: number,
    hourEnd: number,
    duration: number,
  ) => {
    let minStart = hourStart * 60;
    const minEnd = hourEnd * 60;
    let minDuration = minStart;
    const rangeTimeSelection = [];
    while (minDuration <= minEnd && minDuration >= minStart) {
      rangeTimeSelection.push({
        key: v4(),
        value: minDuration,
      });
      minStart = minDuration;
      minDuration = minStart + duration;
    }
    return rangeTimeSelection;
  };
  const setTimeSlotForDate = (timeSelectionFollowByDatePicking: any) => {
    const mapTimeSelection = timeSelectionFollowByDatePicking.map(
      (timeMp: number) => {
        return {
          key: v4(),
          value: timeMp,
        };
      },
    );
    const timeSelectionMapping =
      timeSelectionFollowByDatePicking?.length > 0 ? mapTimeSelection : [];

    setTime(timeSelectionMapping[0]?.value);
    setTimeSelection(timeSelectionMapping ?? []);
  };
  /**
   * Set Initial Time Slot To Selection
   */
  React.useEffect(() => {
    const query = route.query;
    const { duration } = query;

    const timeline = duration && duration.toString().split("mins");
    const timelineValue = timeline && timeline[0] && Number(timeline[0]);
    timelineValue && setDuration(timelineValue);

    const timeSelections = generateTimeSelection(9, 17, Number(timelineValue));
    if (timeSelections?.length > 0 && timeSelections[0]) {
      setTimeSelection(timeSelections);
      setTime(timeSelections[0]?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.query?.duration]);

  /**
   * Fetching event follow by date start and end
   */
  React.useEffect(() => {
    const { calendarId, user } = route.query;
    if (calendarId) {
      const date = dayjs(new Date(dayjs().year(), monthIndex));
      const dateStart = dayjs(date).subtract(30, "day").format();
      const dateEnd = dayjs(date).add(60, "day").format();
      const params = {
        calendarUniqueByName: calendarId,
        userUniqueByName: user,
        rangeStart: dateStart,
        rangeEnd: dateEnd,
      } as EventsByDateBody;
      setIsLoadingEvent(true);
      dispatch(fetchEventsByDate(params))
        .then((res) => {
          setIsLoadingEvent(false);
          const result = res?.payload as {
            events: Event[];
            userInfo: UserInterface | null;
          };
          if (result) {
            setListEvents(result?.events ?? []);
            setUserInfoState(result?.userInfo ?? null);
          }
        })
        .catch((err) => {
          setIsLoadingEvent(false);
          const message =
            (err as Error)?.message ||
            "An error occurred please try again later";
          toast.error(message as string);
        });
    }
  }, [dispatch, monthIndex, route.query?.calendarId, route.query]);
  /**
   * Calculated the date available
   */
  React.useEffect(() => {
    const getDateOfMonth = getMonth(monthIndex);
    let getDateMapping = [] as any;
    getDateOfMonth.forEach((date) => getDateMapping.push(...date));
    getDateMapping = getDateMapping.map((item: any) =>
      dayjs(item).format(DATE_TIME_FORMAT),
    );

    const dateAvailable = new Map();
    if (listEvents?.length > 0) {
      const dateEvents = chain(listEvents)
        .groupBy((event: any) => {
          return dayjs(event?.from).format(DATE_TIME_FORMAT);
        })
        .value();
      if (dateEvents && Object.keys(dateEvents)?.length > 0) {
        const timeSelections = generateTimeSelection(9, 17, Number(duration));
        Object.keys(dateEvents).forEach((key) => {
          let timeMapping = timeSelections.map((time) => time?.value);
          if (dateEvents && dateEvents[key]) {
            map(dateEvents[key], (dtEvent) => {
              if (!!dtEvent?.isBlockWholeDayFromGG) {
                timeMapping = [];
              } else {
                const timeslotMinutesFrom =
                  dayjs(dayjs(dtEvent?.from).format()).hour() * 60 +
                  dayjs(dayjs(dtEvent?.from).format()).minute();
                const timeslotMinutesTo =
                  dayjs(dayjs(dtEvent?.to).format()).hour() * 60 +
                  dayjs(dayjs(dtEvent?.to).format()).minute();
                timeMapping.filter(
                  (timing: number) =>
                    Number(timing) > Number(timeslotMinutesTo) ||
                    Number(timing) < Number(timeslotMinutesFrom),
                );
              }
            });
          }
          dateAvailable.set(key, timeMapping);
        });
      }
    }

    if (getDateMapping?.length > 0) {
      getDateMapping.forEach((dateE: string) => {
        const dateHasEvents = dateAvailable.get(dateE);
        if (!dateHasEvents) {
          const timeGenerate = generateTimeSelection(9, 17, Number(duration));
          dateAvailable.set(
            dateE,
            timeGenerate.map((time) => time?.value),
          );
        }
      });
    }

    /**
     * Remove all timeslot not available today
     */
    const timeslotToday = dateAvailable.get(dayjs().format(DATE_TIME_FORMAT));
    if (timeslotToday) {
      const timeslotValidInWorkingHours = timeslotToday.filter(
        (time: number) =>
          time >= Number(dayjs().hour()) * 60 + Number(dayjs().minute()),
      );
      const filterTodayTimeslot = dateAvailable.set(
        dayjs().format(DATE_TIME_FORMAT),
        timeslotToday.filter(
          (time: number) =>
            time >= Number(dayjs().hour()) * 60 + Number(dayjs().minute()),
        ),
      );
      timeslotValidInWorkingHours.length > 0
        ? filterTodayTimeslot
        : dateAvailable.delete(dayjs().format(DATE_TIME_FORMAT));
    }

    if (dateAvailable) {
      setDateSelection(dateAvailable);
      let dateCountingFromToday = dayjs();
      // this loop for set time if today doesnt have timeslot
      for (let i = 0; i < 30; i++) {
        if (dateAvailable.get(dateCountingFromToday.format(DATE_TIME_FORMAT))) {
          const timeSelectionFollowByDatePicking = dateAvailable.get(
            dayjs(dateCountingFromToday).format(DATE_TIME_FORMAT),
          );
          setTimeSlotForDate(timeSelectionFollowByDatePicking);
          break;
        }
        dateCountingFromToday = dateCountingFromToday.add(1, "d");
      }
      setDaySelected(dateCountingFromToday);
    }
  }, [
    listEvents?.length,
    setTimeSelection,
    setTime,
    setDateSelection,
    route.query?.calendarId,
    duration,
    monthIndex,
    route.query,
    listEvents,
    setDaySelected,
  ]);

  const handleMovingConfirmStep = () => {
    const { calendarId: calendarNameUnique, user: usernameUnique } =
      route.query;
    const hour = Math.floor(Number(time) / 60);
    const min = Number(time) - hour * 60;
    const dateFrom = dayjs(daySelected).set("hour", hour).set("minute", min);
    const dateTo = dayjs(dateFrom).add(duration ?? 0, "minute");
    const data = {
      calendarNameUnique: `${calendarNameUnique}`.trim() ?? "",
      body: {
        from: dayjs(dateFrom).format(),
        to: dayjs(dateTo).format(),
        title: "",
        attendee: "",
        usernameUnique: `${usernameUnique}`.trim() ?? "",
      },
    };
    if (data) {
      setCurrentStep(currentStep + 1);
      setDataCreateBookingStep(data);
    }
  };

  const handleSelectTime = (timing: any) => () => {
    setTime(timing.value);
  };

  const handleSelectDuration = (duration: any) => () => {
    setDuration(Number(duration.value));
    const timeSelections = generateTimeSelection(
      9,
      17,
      Number(duration?.value),
    );
    if (timeSelections?.length > 0 && timeSelections[0]) {
      setTime(timeSelections[0]?.value);
      setTimeSelection(timeSelections);
    }
  };

  function durationClass(
    type: string,
    durationState: number,
    duration: number,
  ) {
    let classActive = "";
    switch (type) {
      case "timeline":
        classActive =
          durationState === duration
            ? "timeline-box my-2 rounded-[4px] cursor-pointer text-white bg-red-900"
            : "timeline-box my-2 rounded-[4px] cursor-pointer hover:bg-red-200";
        break;
      case "detail":
        classActive =
          durationState === duration
            ? "text-white font-semibold"
            : "text-zenith-black font-semibold";
        break;
      default:
        break;
    }
    return classActive;
  }

  function timelineClass(
    type: string,
    timelineState: string | number,
    timeline: string | number | null,
  ) {
    let classActive = "";
    switch (type) {
      case "timeline":
        classActive =
          timelineState === timeline
            ? "timeline-box my-2 rounded-[4px] cursor-pointer bg-red-900"
            : "timeline-box my-2 rounded-[4px] cursor-pointer hover:bg-red-200";

        break;
      case "detail":
        classActive =
          timelineState === timeline
            ? "text-white font-semibold"
            : "text-zenith-black font-semibold";
        break;
      default:
        break;
    }
    return classActive;
  }

  const handleNavigateHomepage = () => {
    route.push("/");
  };

  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit((data: any) => {
    setIsLoading(true);
    let payloadRequest = null;
    if (dataCreateBookingStep) {
      payloadRequest = {
        calendarNameUnique: dataCreateBookingStep.calendarNameUnique,
        body: {
          usernameUnique: dataCreateBookingStep?.body?.usernameUnique,
          from: dataCreateBookingStep.body.from,
          to: dataCreateBookingStep.body.to,
          title: data?.meetingName ?? "",
          attendee: data?.email,
        },
      };
    }

    if (payloadRequest) {
      dispatch(createEvent(payloadRequest)).then((res: any) => {
        setIsLoading(false);
        const status = res?.meta?.requestStatus;
        if (status === "fulfilled") {
          const eventCreated = res?.payload as EventResponse;
          setEventCreated(eventCreated ?? null);
        }
        if (status === "rejected") {
          const errorMessage = res?.payload as { message: string };
          const message =
            errorMessage?.message || "An error occurred please try again later";
          toast.error(message as string);
        }
      });
    }
  });

  const handleSelectDate = (date: any) => {
    const timeSelectionFollowByDatePicking = dateSelection.get(
      dayjs(date).format(DATE_TIME_FORMAT),
    );
    setTimeSlotForDate(timeSelectionFollowByDatePicking);
    setDaySelected(date);
  };
  return (
    <>
      {/*step initial create booking*/}
      {!eventCreated && currentStep === 1 && (
        <div className="grid grid-cols-3 pt-[10%]">
          <div className="py-6 px-6">
            <div className="flex -space-x-1 overflow-hidden items-center">
              {userInfoState?.avatarUrl && (
                <Avatar
                  size="40"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                  src={userInfoState?.avatarUrl}
                  name={`${userInfoState?.firstName ?? ""} ${
                    userInfoState?.lastName ?? ""
                  }`}
                />
              )}

              <div className="flex flex-col items-start pl-6">
                <p className="text-zenith-black">Meeting with</p>
                <p className="text-zenith-black font-semibold">
                  {userInfoState?.firstName ?? ""}{" "}
                  {userInfoState?.lastName ?? ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col py-10">
              {durationSelection?.length > 0 &&
                durationSelection.map(
                  (durationState: {
                    key: number;
                    value: number;
                    detail: string;
                  }) => {
                    return (
                      <div
                        key={durationState.key}
                        className={durationClass(
                          "timeline",
                          durationState.value,
                          duration,
                        )}
                        onClick={handleSelectDuration(durationState)}
                      >
                        <p
                          className={durationClass(
                            "detail",
                            durationState.value,
                            duration,
                          )}
                        >{`${durationState?.value} min meeting`}</p>
                        <p>{durationState?.detail}</p>
                      </div>
                    );
                  },
                )}
            </div>
          </div>
          <div className="py-6 px-6">
            <div className="flex -space-x-1 overflow-hidden items-center">
              {dateSelection && (
                <SmallCalendar
                  dateSelection={dateSelection}
                  isLoading={isLoadingEvent}
                  handleSelectDate={handleSelectDate}
                />
              )}
            </div>
          </div>

          <div className="py-6 px-6 flex flex-col">
            <div className="flex -space-x-1 overflow-hidden items-center">
              <p>
                {`Select time on ${dayjs(daySelected).format(
                  TIME_ON_SELECT_FORMAT,
                )}`}{" "}
              </p>
            </div>

            <div className="flex flex-col py-10 max-h-[420px] overflow-auto scrollable-element">
              {timeSelection &&
                timeSelection.map((timelineState) => (
                  <div
                    key={timelineState.key}
                    className={timelineClass(
                      "timeline",
                      timelineState.value,
                      time,
                    )}
                    onClick={handleSelectTime(timelineState)}
                  >
                    <p
                      className={timelineClass(
                        "detail",
                        timelineState.value,
                        time,
                      )}
                    >{`${parseMinutesToString(timelineState.value)}`}</p>
                  </div>
                ))}
            </div>
            <button
              className="bg-red-900 px-10 py-4 rounded-[4px] ml-auto mr-3 min-w-[200px] flex items-center justify-center"
              onClick={handleMovingConfirmStep}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingComponent />
              ) : (
                <p className="text-white font-semibold">
                  Select meeting details
                </p>
              )}
            </button>
          </div>
        </div>
      )}

      {/*step confirm booking with fill email*/}
      {!eventCreated && currentStep === 2 && (
        <div className="w-11/12 flex flex-row pt-[10%]">
          <div className="w-2/5 py-6 px-6">
            <div className="space-y-6">
              <div className="flex flex-col items-start pl-6">
                <p className="text-sm text-zenith-black font-light">
                  Meet with
                </p>
                <p className="text-sm text-zenith-black font-semibold">
                  {userInfoState?.firstName ?? ""}{" "}
                  {userInfoState?.lastName ?? ""}
                </p>
                {/* <p className="text-sm text-zenith-black font-semibold">
                  Interio Studio
                </p> */}
              </div>

              <div className="flex flex-col items-start pl-6">
                <p className="text-sm text-zenith-black font-light">Date:</p>
                <p className="text-sm text-zenith-black font-semibold">
                  {dayjs(dataCreateBookingStep?.body?.from).format(
                    "MMMM DD, YYYY",
                  )}
                </p>
              </div>

              <div className="flex flex-col items-start pl-6">
                <p className="text-sm text-zenith-black font-light">Time:</p>
                <p className="text-sm text-zenith-black font-semibold">
                  {dayjs(dataCreateBookingStep?.body?.from).format(TIME_FORMAT)}
                </p>
              </div>
            </div>

            <div className="flex flex-col py-10"></div>
          </div>

          <div className="w-3/5 py-6 px-6 flex flex-col">
            <form className="w-full space-y-28" onSubmit={onSubmit}>
              <div className="w-3/5 space-y-6">
                <p className="text-zenith-black text-sm">
                  Adding your details:
                </p>
                <div>
                  <label
                    htmlFor="name"
                    className={`text-sm text-zenith-black after:content-['*']`}
                  >
                    Your name:
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      required
                      {...register("name")}
                      className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                      placeholder=""
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`text-sm text-zenith-black after:content-['*']`}
                  >
                    Email:
                  </label>

                  <div className="relative">
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
                </div>

                <div>
                  <label
                    htmlFor="meeting-name"
                    className={`text-sm text-zenith-black after:content-['*']`}
                  >
                    Meeting name:
                  </label>
                  <div className="relative">
                    <input
                      id="meeting-name"
                      type="text"
                      required
                      {...register("meetingName")}
                      className="appearance-none rounded relative block w-full px-3 py-2 pr-12 border bg-neutral-50 placeholder-neutral-50 text-zenith-black focus:outline-none focus:ring-zenith-black focus:border-zenith-black sm:text-sm"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row space-x-4 justify-end mr-[5%]">
                <button
                  className="w-56 py-2 px-4 border border-red-850 text-sm font-bold rounded-md text-white bg-white focus:outline-none focus:ring-0 focus:ring-offset-2"
                  onClick={() => setCurrentStep(1)}
                >
                  <span className="text-red-850">Back to meeting detail</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-900 px-10 py-4 rounded-[4px] ml-auto mr-3 min-w-[200px] flex items-center justify-center"
                >
                  {isLoading ? (
                    <LoadingComponent />
                  ) : (
                    <p className="text-white font-semibold">Confirm meeting</p>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*step booking successfully*/}
      {eventCreated && (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          {userInfoState?.avatarUrl && (
            <Avatar
              size="100"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white mb-8"
              src={userInfoState?.avatarUrl}
              name={`${userInfoState?.firstName ?? ""} ${
                userInfoState?.lastName ?? ""
              }`}
            />
          )}

          <p className="text-xl">{`Your meeting with ${
            userInfoState?.firstName ?? ""
          } was successfully scheduled!`}</p>
          <p className="text-base font-bold">
            {`You’ll meet on ${dayjs(eventCreated?.from).format(
              "MMMM DD, YYYY",
            )} at ${dayjs(eventCreated?.from).format(TIME_FORMAT)}!`}
          </p>
          <Image
            width={120}
            height={100}
            src={`/assets/images/logo.svg`}
            alt="Zenith"
          />
          <p className="text-xl">
            Did you like how easy and fast Zenith is to use?
          </p>
          <p
            className="text-base font-bold decoration-solid cursor-pointer hover:underline"
            onClick={handleNavigateHomepage}
          >
            Try it yourself here!
          </p>
        </div>
      )}
      <Toaster />
    </>
  );
};
MeetingDetail.public = true;
export default MeetingDetail;
