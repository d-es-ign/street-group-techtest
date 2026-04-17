import { Platform } from "react-native";

export const createLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export const formatDateWithOffset = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  const seconds = String(value.getSeconds()).padStart(2, "0");
  const milliseconds = String(value.getMilliseconds()).padStart(3, "0");
  const timezoneOffset = -value.getTimezoneOffset();
  const timezoneSign = timezoneOffset >= 0 ? "+" : "-";
  const timezoneHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(
    2,
    "0",
  );
  const timezoneMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneHours}:${timezoneMinutes}`;
};

export const createCalendarEventDetails = (date: string) => {
  const startDate = createLocalDate(date);
  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + 1);

  if (Platform.OS === "android") {
    return {
      allDay: true,
      endDate: endDate.getTime(),
      skipAndroidTimezone: true,
      startDate: startDate.getTime(),
    };
  }

  return {
    allDay: true,
    endDate: formatDateWithOffset(endDate),
    startDate: formatDateWithOffset(startDate),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};
