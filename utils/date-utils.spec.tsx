import { Platform } from "react-native";

import {
  createCalendarEventDetails,
  createLocalDate,
  formatDateWithOffset,
} from "./date-utils";

describe("GIVEN date utils", () => {
  const originalPlatform = Platform.OS;
  const originalIntl = Intl.DateTimeFormat;

  afterEach(() => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: originalPlatform,
    });

    Intl.DateTimeFormat = originalIntl;
  });

  it("SHOULD create a local date from a yyyy-mm-dd string", () => {
    const result = createLocalDate("2026-01-01");

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it("SHOULD format a date with its local timezone offset", () => {
    const result = formatDateWithOffset(new Date(2026, 0, 1, 0, 0, 0, 0));

    expect(result).toMatch(/^2026-01-01T00:00:00\.000[+-]\d{2}:\d{2}$/);
  });

  it("SHOULD create android calendar event details using local timestamps", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "android",
    });

    const result = createCalendarEventDetails("2026-01-01");

    expect(result).toEqual({
      allDay: true,
      endDate: new Date(2026, 0, 2).getTime(),
      skipAndroidTimezone: true,
      startDate: new Date(2026, 0, 1).getTime(),
    });
  });

  it("SHOULD create ios calendar event details using offset-aware strings", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: "ios",
    });

    Intl.DateTimeFormat = jest.fn(() => ({
      resolvedOptions: () => ({ timeZone: "Europe/London" }),
    })) as unknown as typeof Intl.DateTimeFormat;

    const result = createCalendarEventDetails("2026-01-01");

    expect(result).toEqual({
      allDay: true,
      endDate: formatDateWithOffset(new Date(2026, 0, 2)),
      startDate: formatDateWithOffset(new Date(2026, 0, 1)),
      timeZone: "Europe/London",
    });
  });
});
