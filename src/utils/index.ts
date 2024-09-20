import dayjs from "dayjs";

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 1 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export const parseMinutesToString = (minutes: number) => {
  const hourInt = Math.floor(minutes / 60);
  const minInt = minutes - hourInt * 60;
  const result = `${hourInt <= 9 ? `0${hourInt}` : `${hourInt}`}:${
    minInt <= 9 ? `0${minInt}` : `${minInt}`
  }`;
  return result as string;
};
