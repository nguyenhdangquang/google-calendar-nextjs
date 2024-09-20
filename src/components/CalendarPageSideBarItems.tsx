import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DuplicateIcon } from "@heroicons/react/outline";

import ListBox from "@/components/Listbox";
import { Calendar } from "@/features/calendar/models";
import { RootState } from "@/store/store";
import { environment_config } from "@/services/env-variables";

const meetingTimes = [
  { id: 1, name: "15 minutes", value: 15 },
  { id: 2, name: "30 minutes", value: 30 },
  { id: 3, name: "1 hour", value: 60 },
];

const CalendarPageSideBarItems = () => {
  const selectorListCalendars = useSelector(
    (state: RootState) => state.calendarReducer.listingCalendar.calendars,
  );

  const selectorUserProfile = useSelector(
    (state: RootState) => state.authReducer?.profile,
  );

  const [selectedCalendar, setSelectCalendar] = useState<Calendar | null>(null);
  const [selectedTime, setSelectTime] = useState<any>();

  const shareLink = React.useMemo(() => {
    const username = selectorUserProfile?.data?.usernameUnique ?? "";
    const calendarName = selectedCalendar?.calendarNameUnique ?? "";
    return (
      username &&
      calendarName &&
      `${environment_config.FRONT_END_HOST}/${username}/${calendarName}/${selectedTime?.value}mins`
    );
  }, [
    selectedTime,
    selectedCalendar,
    selectorUserProfile?.data?.usernameUnique,
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const handleSelectTime = (value: any) => {
    setSelectTime(value);
  };

  useEffect(() => {
    if (selectorListCalendars.length === 1) {
      setSelectCalendar(selectorListCalendars[0]);
    }
  }, [selectorListCalendars]);
  const availableCalendars = selectorListCalendars.filter((c) => !c.isDisabled);

  return (
    <div className="flex flex-col py-10">
      <span className="text-lg text-zenith-black font-semibold">
        Share 1:1 meeting invite
      </span>

      <div className="pt-4">
        {availableCalendars.length === 0 && (
          <p className="text-zenith-black text-sm font-normal">
            All events will be created only on Zenith calendar from now
          </p>
        )}
        {availableCalendars.length > 0 && (
          <div className="py-2">
            <ListBox
              zIndex={2}
              data={availableCalendars}
              label="Select invite calendar"
              onChangeValue={(value: any) => setSelectCalendar(value)}
              defaultData={selectedCalendar}
            />
          </div>
        )}
        <div className="py-2">
          <ListBox
            zIndex={1}
            data={meetingTimes}
            label="Select meeting time (optional)"
            onChangeValue={handleSelectTime}
            defaultData={selectedTime}
          />
        </div>

        <div className="flex flex-col py-4">
          <div className="relative">
            <input
              value={shareLink}
              className="text-zenith-black focus:outline-none  bg-white font-normal w-full h-10 flex items-center pl-3 pr-16 text-sm rounded-md border"
              placeholder="Calendar link"
            />
            <button
              onClick={copyToClipboard}
              className="absolute right-0 top-0 text-white flex items-center px-4 border-l h-full bg-zinc-100 rounded-l rounded-lg cursor-pointer focus:outline-none active:bg-zinc-300"
            >
              <DuplicateIcon className="h-5 w-5 text-zenith-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPageSideBarItems;
