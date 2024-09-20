import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Calendar, Views, dateFnsLocalizer, Event } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import toast from "react-hot-toast";

import "./Calendar.module.scss";

import { AppDispatch } from "@/store/store";
import CalendarToolbar from "./CalendarToolbar";
import ModalAlert from "@/components/ModalAlert";
import ModalEventDetails from "@/components/ModalEventDetails";

import { updateEvent } from "@/features/calendar/calendarSlice";
import { UpdateEventBody } from "@/features/calendar/models";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type stringOrDate = string | Date;

interface CalendarProps<TEvent extends object = Event> {
  events: TEvent[];
}

type EventActionCallback<TEvent extends object = Event> = ({
  event,
  start,
  end,
  isAllDay,
}: {
  event: TEvent;
  start: stringOrDate;
  end: stringOrDate;
  isAllDay: boolean;
}) => void | undefined;

const DnDCalendar = withDragAndDrop(Calendar);

const Header = ({ date }: { label: string; date: Date }) => {
  return (
    <div className="flex flex-col z-10 pl-2">
      <div className="text-red-850 font-semibold">{format(date, "eee")}</div>
      <div className="text-zenith-black font-semibold text-xl">
        {format(date, "dd")}
      </div>
    </div>
  );
};

const CalendarSchedule = (props: CalendarProps) => {
  const { events } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [myEvents, setMyEvents] = useState<Event[] | object[]>(events);
  const [isUpdatingEvent, setUpdatingEvent] = useState(false);
  const [showModalAlert, toogleModalAlert] = useState(false);
  const [showModalEventDetails, toogleModalEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [changedEvent, setChangeEventTime] = useState<Event | object>();

  useEffect(() => {
    setMyEvents(events);
  }, [events]);

  const moveEvent = useCallback<EventActionCallback>(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }

      toogleModalAlert(true);
      setChangeEventTime({ ...event, start, end, allDay });
    },
    [],
  );

  const resizeEvent = useCallback<EventActionCallback>(
    ({ event, start, end }) => {
      setChangeEventTime({ ...event, start, end });
      toogleModalAlert(true);
    },
    [],
  );

  const onConfirmChangeEventTime = () => {
    if (changedEvent) {
      toogleModalAlert(false);
      handleUpdateEvent(changedEvent);
    }
  };

  const handleUpdateEvent = (event: Event) => {
    setUpdatingEvent(true);
    const body: UpdateEventBody = {
      from: event.start,
      to: event.end,
      gEventId: event?.resource?.gEventId,
      title: event?.title as string,
      details: event?.resource?.description,
      provider: event?.resource?.provider || "GOOGLE",
    };
    dispatch(
      updateEvent({
        calendarId: event?.resource?.calendar?.id,
        eventId: event?.resource?.eventId,
        body,
      }),
    ).then((data) => {
      setUpdatingEvent(false);
      if (data.meta?.requestStatus === "rejected") {
        const errMsg =
          (data as any)?.payload?.message ||
          "An error occurred please try again later";
        toast.error(errMsg as string);
      } else {
        toogleModalEventDetails(false);
        setMyEvents((prev) => {
          const existing =
            prev?.find((ev) => (ev as any).id === (event as any).id) ?? {};
          const filtered = prev?.filter(
            (ev) => (ev as any).id !== (event as any).id,
          );
          return [...filtered, { ...existing, ...event }];
        });
      }
    });
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    toogleModalEventDetails(true);
  };

  const eventPropGetter = useCallback((event: Event) => {
    const style = event?.resource.style;
    return { style, className: (event as any)?.id };
  }, []);

  const defaultDate = useMemo(() => new Date(), []);

  const { components } = useMemo(
    () => ({
      components: {
        toolbar: CalendarToolbar,
        day: { header: Header },
        week: { header: Header },
        month: { header: Header },
      },
    }),
    [],
  );

  return (
    <>
      <DnDCalendar
        defaultDate={defaultDate}
        defaultView={Views.WEEK}
        events={myEvents}
        localizer={localizer}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onSelectEvent={handleEventSelect}
        popup
        resizable
        views={["week"]}
        components={components}
        eventPropGetter={eventPropGetter}
      />

      <ModalAlert
        title="Change event time"
        content="Are you sure you want to change time of this event?"
        isOpen={showModalAlert}
        setIsOpen={toogleModalAlert}
        loading={false}
        onClickConfirm={onConfirmChangeEventTime}
      />

      <ModalEventDetails
        isOpen={showModalEventDetails}
        event={selectedEvent}
        loading={isUpdatingEvent}
        setIsOpen={toogleModalEventDetails}
        onSave={handleUpdateEvent}
      />
    </>
  );
};

export default CalendarSchedule;
