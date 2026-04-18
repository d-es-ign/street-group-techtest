import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

import {
  BankHolidayEvent,
  BankHolidayStateEvent,
} from "@/domains/bank-holidays/types";

export interface BankHolidaysState {
  bankHolidays: BankHolidayStateEvent[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setBankHolidays: (bankHolidays: BankHolidayEvent[]) => void;
  updateBankHoliday: (updatedEvent: BankHolidayStateEvent) => void;
  deleteBankHoliday: (id: string) => void;
}

const createBankHolidayState = (set: (partial: Partial<BankHolidaysState> | ((state: BankHolidaysState) => Partial<BankHolidaysState>)) => void): BankHolidaysState => ({
  bankHolidays: [],
  hasHydrated: false,
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
  setBankHolidays: (bankHolidays) =>
    set({
      bankHolidays: bankHolidays.map((event, index) => ({
        id: index.toString(),
        ...event,
      })),
    }),
  updateBankHoliday: (updatedEvent) =>
    set((state) => ({
      bankHolidays: state.bankHolidays.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    })),
  deleteBankHoliday: (id) =>
    set((state) => ({
      bankHolidays: state.bankHolidays.filter((event) => event.id !== id),
    })),
});

export const createBankHolidaysStore = (storage: StateStorage = AsyncStorage) => {
  return create<BankHolidaysState>()(
    persist(createBankHolidayState, {
      name: "bank-holidays-store",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ bankHolidays: state.bankHolidays }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }),
  );
};

export const useBankHolidaysStore = createBankHolidaysStore();
