import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import Calendar from "./api";
import {
  ConnectGoogleCalendarBody,
  Calendar as CalendarType,
  Event,
  UpdateCalendarThunkPayload,
  DisconnectGoogleCalendar,
  CreateEventPayload,
  EventResponse,
  UpdateEventPayload,
  ReconnectGoogleCalendarBody,
  EventsByDateBody,
} from "./models";
import { RootState } from "../../store/store";
import { User as UserInterface } from "@/features/user/models";

type RequestState = "pending" | "fulfilled" | "rejected";
type Error = {
  message: string;
  status: number | null;
  detail?: string;
};

export interface CalendarState {
  showConnectCalendarsFirstTime: boolean;
  connectGoogleCalendar: {
    error?: Error;
    loading?: RequestState;
  };
  disconnectGoogleCalendar: {
    error?: Error;
    loading?: RequestState;
  };
  reconnectGoogleCalendar: {
    error?: Error;
    loading?: RequestState;
  };
  listingCalendar: {
    error?: Error;
    loading?: RequestState;
    calendars: [CalendarType] | [];
  };
  listingEvents: {
    error?: Error;
    loading?: RequestState;
    events: [Event] | [];
  };
  updateCalendar: {
    error?: Error;
    loading?: RequestState;
    calendar: CalendarType | null;
  };
  createEvent: {
    error?: Error;
    loading?: RequestState;
    event: EventResponse | null;
  };
  updateEvent: {
    error?: Error;
    loading?: RequestState;
    event: EventResponse | null;
  };
  eventsByDate: {
    error?: Error;
    loading?: RequestState;
    data: {
      events: Event[];
      userInfo: UserInterface | null;
    } | null;
  };
}

export const initialState: CalendarState = {
  showConnectCalendarsFirstTime: true,
  connectGoogleCalendar: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  disconnectGoogleCalendar: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  reconnectGoogleCalendar: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
  },
  listingCalendar: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    calendars: [],
  },
  listingEvents: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    events: [],
  },
  updateCalendar: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    calendar: null,
  },
  createEvent: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    event: null,
  },
  updateEvent: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    event: null,
  },
  eventsByDate: {
    error: {
      message: "",
      status: null,
    },
    loading: "pending",
    data: null,
  },
};

export const connectGoogleCalendar = createAsyncThunk(
  "/calendar/connect/google",
  async (body: ConnectGoogleCalendarBody, { rejectWithValue }) => {
    try {
      const res = await Calendar.connectGoogleCalendar(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const disconnectGoogleCalendar = createAsyncThunk(
  "/calendar/disconnect/google",
  async (body: DisconnectGoogleCalendar, { rejectWithValue }) => {
    try {
      const res = await Calendar.disconnectGoogleCalendar(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const reconnectGoogleCalendar = createAsyncThunk(
  "/calendar/reconnect/google",
  async (body: ReconnectGoogleCalendarBody, { rejectWithValue }) => {
    try {
      const res = await Calendar.reconnectGoogleCalendar(body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const fetchCalendars = createAsyncThunk(
  "/calendar/listing",
  async ({}, { rejectWithValue }) => {
    try {
      const res = await Calendar.listingCalendar();
      return res || [];
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const fetchEvents = createAsyncThunk(
  "/calendar/:calendarId/events",
  async (calendarId: number, { rejectWithValue }) => {
    try {
      const res = await Calendar.fetchEvents(calendarId);
      return res || [];
    } catch (error: any) {
      const errorPayload = {
        message: error?.data.message,
        status: error?.status,
        detail: error?.data || error?.response,
      };
      return rejectWithValue(errorPayload);
    }
  },
);

export const fetchEventsByDate = createAsyncThunk(
  "/calendar/:calendarId/events-date-range",
  async (
    {
      calendarUniqueByName,
      userUniqueByName,
      rangeStart,
      rangeEnd,
    }: EventsByDateBody,
    { rejectWithValue },
  ) => {
    try {
      const res = await Calendar.fetchEventsByDate(
        calendarUniqueByName,
        userUniqueByName,
        rangeStart,
        rangeEnd,
      );
      return res;
    } catch (error: any) {
      const errorPayload = {
        message: error?.data.message,
        status: error?.status,
        detail: error?.data || error?.response,
      };
      return rejectWithValue(errorPayload);
    }
  },
);

export const updateCalendar = createAsyncThunk(
  "/calendar/:calendarId",
  async (data: UpdateCalendarThunkPayload, { rejectWithValue }) => {
    const { calendarId, body } = data;
    try {
      const res = await Calendar.updateCalendar(calendarId, body);
      return res || [];
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const setShowConnectCalendarsFirstTime = createAction<boolean>(
  "calendar/showConnectCalendarsFirstTime",
);

export const createEvent = createAsyncThunk(
  "/calendar/:calendarNameUnique/event",
  async (data: CreateEventPayload, { rejectWithValue }) => {
    const { calendarNameUnique, body } = data;
    try {
      const res = await Calendar.createEvent(calendarNameUnique, body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

export const updateEvent = createAsyncThunk(
  "/calendar/:calendarId/event/:eventId",
  async (data: UpdateEventPayload, { rejectWithValue }) => {
    const { calendarId, eventId, body } = data;
    try {
      const res = await Calendar.updateEvent(calendarId, eventId, body);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.data || error?.response);
    }
  },
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connectGoogleCalendar.rejected, (state, action) => {
      state.connectGoogleCalendar.loading = "rejected";
      state.connectGoogleCalendar.error = action.payload as Error;
    });
    builder.addCase(connectGoogleCalendar.pending, (state) => {
      state.connectGoogleCalendar.loading = "pending";
    });
    builder.addCase(connectGoogleCalendar.fulfilled, (state) => {
      state.connectGoogleCalendar.loading = "fulfilled";
      state.connectGoogleCalendar.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(disconnectGoogleCalendar.rejected, (state, action) => {
      state.disconnectGoogleCalendar.loading = "rejected";
      state.disconnectGoogleCalendar.error = action.payload as Error;
    });
    builder.addCase(disconnectGoogleCalendar.pending, (state) => {
      state.disconnectGoogleCalendar.loading = "pending";
    });
    builder.addCase(disconnectGoogleCalendar.fulfilled, (state) => {
      state.disconnectGoogleCalendar.loading = "fulfilled";
      state.disconnectGoogleCalendar.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(reconnectGoogleCalendar.rejected, (state, action) => {
      state.reconnectGoogleCalendar.loading = "rejected";
      state.reconnectGoogleCalendar.error = action.payload as Error;
    });
    builder.addCase(reconnectGoogleCalendar.pending, (state) => {
      state.reconnectGoogleCalendar.loading = "pending";
    });
    builder.addCase(reconnectGoogleCalendar.fulfilled, (state) => {
      state.reconnectGoogleCalendar.loading = "fulfilled";
      state.reconnectGoogleCalendar.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(fetchCalendars.rejected, (state, action) => {
      state.listingCalendar.loading = "rejected";
      state.listingCalendar.error = action.payload as Error;
    });
    builder.addCase(fetchCalendars.pending, (state) => {
      state.listingCalendar.loading = "pending";
    });
    builder.addCase(fetchCalendars.fulfilled, (state, action) => {
      state.listingCalendar.loading = "fulfilled";
      state.listingCalendar.calendars = (action as any).payload;
      state.listingCalendar.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.listingEvents.loading = "rejected";
      state.listingEvents.error = action.payload as Error;
    });
    builder.addCase(fetchEvents.pending, (state) => {
      state.listingEvents.loading = "pending";
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.listingEvents.loading = "fulfilled";
      (state as any).listingEvents.events = uniqBy(
        [...state.listingEvents.events, ...(action as any).payload],
        "id",
      );
      state.listingEvents.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(updateCalendar.rejected, (state, action) => {
      state.updateCalendar.loading = "rejected";
      state.updateCalendar.error = action.payload as Error;
    });
    builder.addCase(updateCalendar.pending, (state) => {
      state.updateCalendar.loading = "pending";
      state.updateCalendar.calendar = null;
      state.updateCalendar.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(updateCalendar.fulfilled, (state, action) => {
      state.updateCalendar.loading = "fulfilled";
      (state as any).updateCalendar = action.payload;
      state.updateCalendar.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(setShowConnectCalendarsFirstTime, (state, action) => {
      state.showConnectCalendarsFirstTime = action.payload;
    });

    builder.addCase(createEvent.rejected, (state, action) => {
      state.createEvent.loading = "rejected";
      state.createEvent.error = action.payload as Error;
    });
    builder.addCase(createEvent.pending, (state) => {
      state.createEvent.loading = "pending";
      state.createEvent.event = null;
      state.createEvent.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.createEvent.loading = "fulfilled";
      (state as any).createEvent = action.payload;
      state.createEvent.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(updateEvent.rejected, (state, action) => {
      state.updateEvent.loading = "rejected";
      state.updateEvent.error = action.payload as Error;
    });
    builder.addCase(updateEvent.pending, (state) => {
      state.updateEvent.loading = "pending";
      state.updateEvent.event = null;
      state.updateEvent.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      state.updateEvent.loading = "fulfilled";
      (state as any).updateEvent.event = action.payload;
      state.updateEvent.error = {
        message: "",
        status: null,
      };
    });

    builder.addCase(fetchEventsByDate.rejected, (state, action) => {
      state.eventsByDate.loading = "rejected";
      state.eventsByDate.error = action.payload as Error;
    });
    builder.addCase(fetchEventsByDate.pending, (state) => {
      state.eventsByDate.loading = "pending";
      state.eventsByDate.data = null;
      state.eventsByDate.error = {
        message: "",
        status: null,
      };
    });
    builder.addCase(fetchEventsByDate.fulfilled, (state, action) => {
      state.eventsByDate.loading = "fulfilled";
      (state as any).eventsByDate.data = action.payload;
      state.eventsByDate.error = {
        message: "",
        status: null,
      };
    });
  },
});
export const selectCreateEventSuccess = (state: RootState) =>
  state.calendarReducer.createEvent;

export const selectEvents = (state: RootState) =>
  state.calendarReducer.listingEvents;

export const selectEventsByDate = (state: RootState) =>
  state.calendarReducer.eventsByDate;

export default calendarSlice.reducer;
