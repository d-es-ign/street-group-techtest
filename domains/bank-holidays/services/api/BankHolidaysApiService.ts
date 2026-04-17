import {
  BankHolidayEvent,
  BankHolidaysResponse,
} from "@/domains/bank-holidays/types";

const BANK_HOLIDAYS_URL = "https://www.gov.uk/bank-holidays.json";

export default class BankHolidaysApiService {
  public async getBankHolidays(): Promise<BankHolidayEvent[]> {
    const response = await fetch(BANK_HOLIDAYS_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch bank holidays");
    }

    const rawBankHolidays = (await response.json()) as BankHolidaysResponse;
    const today = new Date().toISOString().slice(0, 10);
    const sixMonthsFromToday = new Date();
    sixMonthsFromToday.setMonth(sixMonthsFromToday.getMonth() + 6);
    const sixMonthsFromTodayStr = sixMonthsFromToday.toISOString().slice(0, 10);

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
