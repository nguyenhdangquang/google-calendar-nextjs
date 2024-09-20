/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import dayjs from "dayjs";

type ContextData = {
  monthIndex: number;
  setMonthIndex: (index: number) => void;
  smallCalendarMonth: any;
  setSmallCalendarMonth: (index: any) => void;
  daySelected: any;
  setDaySelected: (day: any) => void;
  showEventModal: boolean;
  setShowEventModal: (value: any) => void;
  dispatchCalEvent: ({}: any) => void;
  savedEvents: any[];
  selectedEvent: any;
  setSelectedEvent: (value: any) => void;
  setLabels: (value: any) => void;
  labels: any[];
  updateLabel: (value: any) => void;
  filteredEvents: any[];
};

const GlobalContext = React.createContext<ContextData>({
  monthIndex: dayjs().month(),
  setMonthIndex: (_index: number) => {
    //do nothing
  },
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (_index: number) => {
    //do nothing
  },
  daySelected: dayjs(),
  setDaySelected: (_day: Date | string | null) => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: ({}) => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  setLabels: () => {},
  labels: [],
  updateLabel: () => {
    //do nothing
  },
  filteredEvents: [],
});

export default GlobalContext;
