export type ConnectGoogleCalendarBody = {
  code: string;
};

export type DisconnectGoogleCalendar = {
  calendarId: number;
};

export type ReconnectGoogleCalendarBody = {
  calendarId: number;
  code: string;
};

export type Calendar = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  email: string;
  providerType: string;
  authenticatorId: number;
  name: string;
  colour?: string;
  profilePictureUrl?: string;
  backgroundPictureUrl?: string;
  logoUrl?: string;
  availableStartTime?: Date | string;
  availableEndTime?: Date | string;
  availableWeekDays: number;
  isDisabled: boolean;
  availableWeekDaysPretty?: AvailableCalendarWeekdays;
  calendarNameUnique: string;
  sourceCalendarVisibility?: CalendarVisibility;
  targetCalendarVisibility?: CalendarVisibility[];
};

export interface CalendarVisibility {
  id: number | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  userId: number;
  sourceId: number;
  targetId: number;
  showAs?: string;
}

export type Event = {
  id: number | string;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
  from: Date;
  to: Date;
  title?: string;
  details?: string;
  creatorEmail?: string;
  creatorDisplayName?: string;
  createdById?: number | string;
  eventLink?: string;
  metadata?: any;
  calendar?: Calendar;
  zenithEventId?: string | number;
  gEventId?: string | number;
  isBlockWholeDayFromGG?: boolean;
};

export type UpdateCalendarBody = {
  name: string;
  colour?: string;
  profilePictureUrl?: string;
  backgroundPictureUrl?: string;
  logoUrl?: string;
  availableStartTime?: string;
  availableEndTime?: string;
  availableWeekDaysPretty?: AvailableCalendarWeekdays;
  visibilities: UpdateCalendarVisibilityDto[];
};

export interface AvailableCalendarWeekdays {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
}

export interface UpdateCalendarVisibilityDto {
  calendarId?: number;
  showAs?: string;
}

export interface UpdateCalendarThunkPayload {
  calendarId?: number;
  body: UpdateCalendarBody;
}

export type CreateEventBody = {
  from: Date | string;
  to: Date | string;
  title: string;
  attendee: string;
  usernameUnique: string;
};

export interface CreateEventPayload {
  calendarNameUnique: string;
  body: CreateEventBody;
}

export interface EventResponse {
  calendarId: number;
  from: Date | string;
  to: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdById: number;
  title?: string;
  details?: string;
  eventLink?: string;
  id: number;
  repeatBy: string;
}

export interface UpdateEventPayload {
  calendarId: number;
  eventId: number;
  body: UpdateEventBody;
}

export type UpdateEventBody = {
  gEventId?: string;
  from?: Date;
  to?: Date;
  title?: string;
  details?: string;
  provider: string;
};

export type EventsByDateBody = {
  calendarUniqueByName: string;
  userUniqueByName: string;
  rangeStart: Date | string;
  rangeEnd: Date | string;
};
