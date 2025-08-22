import { toZonedTime, fromZonedTime } from "date-fns-tz";

export const formatDate = (inputDate: undefined | Date) => {
  const date = new Date(inputDate || "");

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year}`; //  - ${hours}:${minutes}
};

export const formatDateHours = (
  start: undefined | string,
  end: undefined | string
) => {
  if (!start || !end) return "";
  const timezone = "Europe/Oslo";

  const startDate = new Date(Date.parse(start));

  // Stored times suggest they are UTC (due to +00:00) even though they are actually local
  // The offset is thus removed, and time is manually converted to UTC and then back to local
  const cleanStart = start.replace("+00:00", "")
  const cleanEnd = end.replace("+00:00", "")

  const startUtc = fromZonedTime(cleanStart, timezone);
  const endUtc = fromZonedTime(cleanEnd, timezone);

  const startHour = toZonedTime(startUtc, timezone).getHours().toString().padStart(2, "0") || "00";
  const startMinute = toZonedTime(startUtc, timezone).getMinutes().toString().padStart(2, "0") || "00";
  const endHour = toZonedTime(endUtc, timezone).getHours().toString().padStart(2, "0") || "00";
  const endMinute = toZonedTime(endUtc, timezone).getMinutes().toString().padStart(2, "0") || "00";

  return `${formatDateNorwegian(
    startDate
  )}, ${startHour}:${startMinute} til ${endHour}:${endMinute}`;
};

export const formatDateNorwegian = (inputDate?: Date | string) => {
  if (!inputDate) return "";

  let date: Date;
  if (inputDate instanceof Date) {
    date = inputDate;
  } else {
    date = new Date(inputDate);
  }

  const day = date.getUTCDate().toString().padStart(2, "0");
  const monthsNorwegian = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mai",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ];
  const month = monthsNorwegian[date.getUTCMonth()];

  return `${day}. ${month}`;
};
