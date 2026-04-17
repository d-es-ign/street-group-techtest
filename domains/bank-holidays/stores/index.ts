import { create } from "zustand";

import {
  BankHolidayEvent,
  BankHolidayStateEvent,
} from "@/domains/bank-holidays/types";

interface BankHolidaysState {
  bankHolidays: BankHolidayStateEvent[];
  setBankHolidays: (bankHolidays: BankHolidayEvent[]) => void;
  updateBankHoliday: (updatedEvent: BankHolidayStateEvent) => void;
}

export const useBankHolidaysStore = create<BankHolidaysState>((set) => ({
  bankHolidays: [],
  setBankHolidays: (bankHolidays) =>
    set({
      bankHolidays: bankHolidays.map((event, index) => ({
        id: index.toString(),
        ...event,
      })),
    }),
  updateBankHoliday: (updatedEvent: BankHolidayStateEvent) =>
    set((state) => ({
      bankHolidays: state.bankHolidays.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    })),
}));
