export interface BankHolidayEvent {
  title: string;
  date: string;
  notes: string;
  bunting: boolean;
}

export interface BankHolidayDivision {
  division: string;
  events: BankHolidayEvent[];
}

export type BankHolidaysResponse = Record<string, BankHolidayDivision>;
