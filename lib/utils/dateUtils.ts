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
  start: string,
  end: string
) => {
  const startDate = new Date(Date.parse(start));

  const startTime = start.split("T")[1].slice(0, 5);
  const endTime = end.split("T")[1].slice(0, 5);

  return `${formatDateNorwegian(
    startDate
  )}, ${startTime} til ${endTime}`;
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
