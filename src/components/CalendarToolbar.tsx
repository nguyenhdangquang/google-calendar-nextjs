/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Navigate as navigate, ToolbarProps } from "react-big-calendar";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import format from "date-fns/format";

export default function CalendarToolbar({
  date,
  label,
  localizer: { messages },
  onNavigate,
}: ToolbarProps) {
  return (
    <div className="rbc-toolbar">
      <span className="flex-grow text-xl text-left font-bold text-zenith-black">
        {label} {format(date, "yyy")}
      </span>

      <span className="rbc-btn-group space-x-2">
        <button
          type="button"
          onClick={() => onNavigate(navigate.PREVIOUS)}
          aria-label={messages.previous}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-400"></ChevronLeftIcon>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(navigate.NEXT)}
          aria-label={messages.next}
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-400"></ChevronRightIcon>
        </button>
      </span>
    </div>
  );
}
