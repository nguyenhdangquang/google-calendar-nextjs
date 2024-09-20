import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { AppDispatch, RootState } from "@/store/store";
import tinycolor from "tinycolor2";
import { compact, join } from "lodash";
import dayjs from "dayjs";

import ModalAlert from "@/components/ModalAlert";
import CalendarSchedule from "@/components/Calendar";
import ModalConnectCalendars from "@/components/ModalConnectCalendars";
import { Event } from "@/features/calendar/models";
import { environment_config } from "@/services/env-variables";

import { Calendar } from "@/features/calendar/models";
import {
  fetchEvents,
  fetchCalendars,
  setShowConnectCalendarsFirstTime,
} from "@/features/calendar/calendarSlice";

interface EventType {
  id: string | number;
  allDay: boolean;
  title: string;
  start: Date;
  end: Date;
  resource: any;
}

const generateEventTitle = (event: Event): string => {
  const summary = event.metadata?.summary || event.title || "(Untitled)";
  // const attendees = event.metadata?.attendees;
  // const attendeEmail = get(attendees, "0.email", "");
  // const title = join([attendeEmail, summary], " - ");

  return summary;
};

const aggregateEvents = (events: Event[]) => {
  const aggEvents: EventType[] = events.map((e) => {
    const backgroundColor =
      e.calendar?.colour || environment_config.DEFAULT_EVENT_BACKGROUND_COLOR;
    const textColor = tinycolor(backgroundColor).isDark()
      ? tinycolor(backgroundColor).lighten(90).toHexString()
      : tinycolor(backgroundColor).darken(90).toHexString();
    return {
      id: e.id,
      allDay: e.metadata?.start?.date,
      title: generateEventTitle(e),
      start: e.metadata?.start?.date
        ? new Date(e.metadata?.start?.date)
        : new Date(e.from),
      end: e.metadata?.end?.date
        ? new Date(dayjs(e.metadata?.end?.date).startOf("day") as any)
        : new Date(e.to),
      resource: {
        eventId: e.id,
        title: e.title,
        description: e.metadata?.description,
        attendees: e.metadata?.attendees,
        calendar: e.calendar,
        zenithEventId: e.zenithEventId,
        gEventId: e.gEventId,
        provider: e.provider,
        style: {
          color: textColor,
          backgroundColor,
        },
      },
    };
  });

  return aggEvents;
};

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showModalConnCalendar, setShowModalConnCalendar] = useState(false);
  const [showModalAlertReconnCalendar, toogleModalAlertReconnCalendar] =
    useState(false);
  const [reconnAlertTitle, setReconnAlertTitle] = useState("");

  // Selector
  const eventsSelector = useSelector(
    (state: RootState) => state.calendarReducer?.listingEvents.events,
  );
  const showConnectCalendarFirstTime = useSelector(
    (state: RootState) => state.calendarReducer?.showConnectCalendarsFirstTime,
  );
  const selectorListCalendars = useSelector(
    (state: RootState) => state.calendarReducer.listingCalendar.calendars,
  );
  const selectorUserInfo = useSelector(
    (state: RootState) => state.authReducer?.user,
  );

  const availableCalendars = selectorListCalendars.filter((c) => !c.isDisabled);
  const events = aggregateEvents(eventsSelector);

  useEffect(() => {
    // Fetch all events of all calendar include calendar which is disable
    dispatch(fetchCalendars()).then(async (data) => {
      const reqStatus = data.meta?.requestStatus;
      if (reqStatus === "fulfilled") {
        const calendars = data?.payload;
        const checkCalendarExpired = await Promise.all(
          (calendars as Calendar[]).map((item: Calendar) => {
            return dispatch(fetchEvents(item?.id)).then((data) => {
              const fetchEventState = data.meta?.requestStatus;
              if (
                fetchEventState === "rejected" &&
                (data as any).payload?.status === 401
              ) {
                return item.name;
              }

              return false;
            });
          }),
        );

        if (checkCalendarExpired.some((item) => item)) {
          setReconnAlertTitle(join(compact(checkCalendarExpired), ", "));
          toogleModalAlertReconnCalendar(true);
        }
      }
    });
  }, [dispatch]);

  useEffect(() => {
    // Only select available calendar
    const isSameGoogleEmail =
      selectorUserInfo?.email === availableCalendars[0]?.email &&
      availableCalendars[0]?.providerType === "google";
    if (showConnectCalendarFirstTime && !isSameGoogleEmail) {
      setTimeout(() => {
        setShowModalConnCalendar(true);
      }, 1500);
    }
  }, [showConnectCalendarFirstTime, selectorUserInfo, availableCalendars]);

  const toogleModalConnectCalendar = (value: boolean) => {
    setShowModalConnCalendar(value);
    if (!value) {
      dispatch(setShowConnectCalendarsFirstTime(false));
    }
  };

  const handleReconnectGoogleCalendar = () => {
    router.push("/settings/manage-calendars");
  };

  return (
    <Main meta={<Meta title="Zenith" description="Zenith calendar." />}>
      <CalendarSchedule events={events} />
      <ModalConnectCalendars
        isOpen={showModalConnCalendar}
        setIsOpen={toogleModalConnectCalendar}
      />

      <ModalAlert
        title="Reconnect calendars"
        content={`Calendars ${reconnAlertTitle} need to reconnect`}
        isOpen={showModalAlertReconnCalendar}
        setIsOpen={toogleModalAlertReconnCalendar}
        loading={false}
        onClickConfirm={handleReconnectGoogleCalendar}
      />
    </Main>
  );
};

export default Index;
