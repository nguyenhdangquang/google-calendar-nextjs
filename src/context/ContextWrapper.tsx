import React, { useState, useEffect, useReducer, useMemo } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

function savedEventsReducer(state: any[], { type, payload }: any) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt: { id: any }) =>
        evt.id === payload.id ? payload : evt,
      );
    case "delete":
      return state.filter((evt: { id: any }) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}
function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

export default function ContextWrapper(props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState<any>([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents,
  );

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt: { label: any }) =>
      labels
        .filter((lbl: { checked: any }) => lbl.checked)
        .map((lbl: { label: any }) => lbl.label)
        .includes(evt.label),
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels: { checked: any; find: any; label: any }) => {
      return [...savedEvents.map((evt: { label: any }) => evt.label)].map(
        (label) => {
          const currentLabel = prevLabels.find(
            (lbl: { label: any }) => lbl.label === label,
          );
          return {
            label,
            checked: currentLabel ? currentLabel.checked : true,
          };
        },
      );
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label: { label: any }) {
    setLabels(
      labels.map((lbl: { label: any }) =>
        lbl.label === label.label ? label : lbl,
      ),
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
