import {
  BankHolidayEvent,
  BankHolidaysResponse,
} from "@/domains/bank-holidays/types";

const BANK_HOLIDAYS_URL = "https://www.gov.uk/bank-holidays.json";

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default class BankHolidaysApiService {
  public async getBankHolidays(): Promise<BankHolidayEvent[]> {
    const response = await fetch(BANK_HOLIDAYS_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch bank holidays");
    }

    const rawBankHolidays = (await response.json()) as BankHolidaysResponse;
    const today = formatLocalDate(new Date());
    const sixMonthsFromToday = new Date();
    sixMonthsFromToday.setMonth(sixMonthsFromToday.getMonth() + 6);
    const sixMonthsFromTodayStr = formatLocalDate(sixMonthsFromToday);

    const uniqueEvents = new Map<string, BankHolidayEvent>();

    for (const [_, division] of Object.entries(rawBankHolidays)) {
      for (const event of division.events) {
        if (event.date <= today || event.date > sixMonthsFromTodayStr) {
          continue;
        }

        const id = `${event.date}-${event.title}`;

        if (uniqueEvents.has(id)) {
          continue;
        }

        uniqueEvents.set(id, event);
      }
    }

    return Array.from(uniqueEvents.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }
}
