import http from "../../services/http-common";
import {
  ConnectGoogleCalendarBody,
  DisconnectGoogleCalendar,
  ReconnectGoogleCalendarBody,
  UpdateCalendarBody,
  CreateEventBody,
  UpdateEventBody,
} from "./models";

export default class Calendar {
  static connectGoogleCalendar(body: ConnectGoogleCalendarBody) {
    return http.post("/calendar/connect/google", body);
  }

  static disconnectGoogleCalendar(body: DisconnectGoogleCalendar) {
    return http.post("/calendar/disconnect/google", body);
  }

  static reconnectGoogleCalendar(body: ReconnectGoogleCalendarBody) {
    return http.post("/calendar/reconnect/google", body);
  }

  static listingCalendar() {
    return http.get("/calendar/listing");
  }

  static fetchEvents(calendarId: number) {
    return http.get(`/calendar/${calendarId}/events`);
  }

  static fetchEventsByDate(
    calendarUniqueByName: string,
    userUniqueByName: string,
    rangeStart: Date | string,
    rangeEnd: Date | string,
  ) {
    return http.get(`/calendar/${calendarUniqueByName}/events-by-date`, {
      user_unique_name: userUniqueByName,
      range_start: rangeStart,
      range_end: rangeEnd,
    });
  }

  static updateCalendar(calendarId: number | any, body: UpdateCalendarBody) {
    return http.put(`/calendar/${calendarId}`, body);
  }

  static createEvent(calendarNameUnique: string, body: CreateEventBody) {
    return http.post(`/calendar/${calendarNameUnique}/events`, body);
  }

  static updateEvent(
    calendarId: number,
    eventId: number,
    body: UpdateEventBody,
  ) {
    return http.put(`/calendar/${calendarId}/events/${eventId}`, body);
  }
}
