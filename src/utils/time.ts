import dayjs from "dayjs";
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;

export function isSameDate(a: Date, b?: Date) {
  if (!b) {
    return false;
  }
  return a.toLocaleDateString() === b.toLocaleDateString();
}

export function startOfWeek(timestamp: number) {
  const res = timestamp - (timestamp % ONE_WEEK) - 3 * ONE_DAY;
  return res + ONE_WEEK > timestamp ? res : res + ONE_WEEK;
}

export function endOfWeek(timestamp: number) {
  return endOfDay(startOfWeek(timestamp) + ONE_WEEK - ONE_DAY);
}

export function startOfDay(timestamp: number) {
  return timestamp - (timestamp % ONE_DAY);
}

export function isBeforeYesterday(timestamp: number) {
  return timestamp < startOfDay(Date.now() - ONE_DAY);
}

export function endOfDay(timestamp: number) {
  return startOfDay(timestamp) + ONE_DAY - ONE_SECOND;
}

export function firstDayOfMonth(timestamp: number) {
  const date = new Date(startOfDay(timestamp));
  date.setUTCDate(1);
  return date.getTime();
}

export function lastDayOfMonth(timestamp: number) {
  let date = new Date(startOfDay(timestamp));
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(1);
  date = new Date(date.getTime() - ONE_SECOND);
  return date.getTime();
}

export function firstMonday(timestamp: number) {
  return startOfWeek(firstDayOfMonth(timestamp));
}

export function lastSunday(timestamp: number) {
  return startOfWeek(lastDayOfMonth(timestamp)) + ONE_WEEK - ONE_DAY;
}

export function formatTime(
  dateTime?: number | string | Date,
  format = "DD/MM/YYYY HH:mm",
) {
  return dateTime ? dayjs(dateTime).format(format) : "-";
}

export function getDateTime(date: number, time: string) {
  const _date = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  _date.setHours(hours);
  _date.setMinutes(minutes);
  _date.setSeconds(0);
  return _date;
}
