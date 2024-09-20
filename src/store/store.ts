import {
  Action,
  configureStore,
  ThunkAction,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import authReducer from "../features/user/authSlice";
import calendarReducer from "../features/calendar/calendarSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
  isSerializable: false,
});
const persistAuthConfig = {
  key: "auth",
  version: 1,
  storage,
  whitelist: ["accessToken", "user"],
};

const persistCalendarConfig = {
  key: "calendar",
  version: 1,
  storage,
  whitelist: ["showConnectCalendarsFirstTime"],
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedCalendarReducer = persistReducer(
  persistCalendarConfig,
  calendarReducer,
);
export const store = configureStore({
  reducer: {
    authReducer: persistedAuthReducer,
    calendarReducer: persistedCalendarReducer,
  },
  middleware: customizedMiddleware,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
