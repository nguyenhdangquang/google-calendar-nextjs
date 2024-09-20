import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "@/utils";
import { DATE_TIME_FORMAT } from "@/utils/constant";
import "./Calendar.module.scss";
import LoadingPage from "@/components/LoadingPage";
import { v4 } from "uuid";

interface SmallCalendarProps {
  dateSelection: any;
  isLoading: boolean;
  handleSelectDate: (date: any) => void;
}

export default function SmallCalendar({
  dateSelection,
  isLoading,
  handleSelectDate,
}: SmallCalendarProps) {
  const router = useRouter();
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const { monthIndex, setSmallCalendarMonth, daySelected, setMonthIndex } =
    useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
    setMonthIndex(currentMonthIdx - 1);
  }

  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
    setMonthIndex(currentMonthIdx + 1);
  }

  function getDayClass(day: any) {
    const currDay = day && day.format(DATE_TIME_FORMAT);
    const slcDay = daySelected && dayjs(daySelected).format(DATE_TIME_FORMAT);
    const prevDate = day && dayjs(day, "date").isBefore(dayjs(), "date");
    const dateTimeslotAvailable = dateSelection?.get(currDay);

    if (prevDate) {
      return "bg-white rounded-full text-black";
    }
    if (currDay === slcDay && dateTimeslotAvailable?.length > 0) {
      return "bg-red-900 rounded-full text-white";
    }
    if (dateTimeslotAvailable?.length > 0) {
      return "bg-red-200 rounded-full text-black";
    }
    return "bg-white rounded-full text-black";
  }

  return (
    <>
      {isLoading && daySelected ? (
        <LoadingPage />
      ) : (
        <div className="w-full">
          <header className="flex justify-between">
            <div className="w-full">
              <p className="text-zenith-black">Select date</p>
              <div className="flex justify-between w-full">
                <p className="text-zenith-black font-semibold">
                  {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
                    "MMMM YYYY",
                  )}
                </p>
                <div>
                  <button onClick={handlePrevMonth}>
                    <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                      <Image
                        width={15}
                        height={15}
                        src={`${router.basePath}/assets/images/left-icon.svg`}
                        alt="google"
                      />
                    </span>
                  </button>
                  <button onClick={handleNextMonth}>
                    <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
                      <Image
                        width={15}
                        height={15}
                        src={`${router.basePath}/assets/images/right-icon.svg`}
                        alt="google"
                      />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          {isLoading ? (
            <LoadingPage />
          ) : (
            <div className="grid grid-cols-7 grid-rows-6 py-10">
              {currentMonth?.length > 0 &&
                currentMonth[0] &&
                currentMonth[0].length > 0 &&
                currentMonth[0].map((day, i) => (
                  <span
                    key={`${i}-${v4()}`}
                    className="text-sm py-1 text-center font-semibold"
                  >
                    {day.format("dd")}
                  </span>
                ))}
              {currentMonth.map((row, i) => (
                <React.Fragment key={`${i}-${v4()}`}>
                  {row.map((day, idx) => {
                    const isTheSameDate =
                      day &&
                      day.format(DATE_TIME_FORMAT) ===
                        dayjs().format(DATE_TIME_FORMAT);

                    return (
                      <div
                        key={`${idx}-${day.format(DATE_TIME_FORMAT)}-${v4()}`}
                        className="flex items-center justify-center py-1 w-full"
                      >
                        <button
                          onClick={() => {
                            setSmallCalendarMonth(currentMonthIdx);
                            handleSelectDate(day.toString());
                          }}
                          disabled={
                            !(
                              dateSelection?.get(
                                dayjs(day).format(DATE_TIME_FORMAT),
                              )?.length > 0
                            ) || dayjs(day, "date").isBefore(dayjs(), "date")
                          }
                          className={`flex items-center justify-center flex-col w-[30px] h-[30px] ${getDayClass(
                            day,
                          )}`}
                        >
                          <span className="text-sm">
                            {(day && day.format("D")) ?? ""}
                          </span>
                          {isTheSameDate && (
                            <div className="w-[4px] h-[4px] bg-black rounded-[50%]" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
