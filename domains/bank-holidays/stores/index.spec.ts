import { act } from "react";

import { BankHolidayEvent } from "@/domains/bank-holidays/types";

import { useBankHolidaysStore } from "./index";

describe("GIVEN useBankHolidaysStore", () => {
  beforeEach(() => {
    act(() => {
      useBankHolidaysStore.setState({ bankHolidays: [] });
    });
  });

  it("SHOULD initialise with an empty bank holidays list", () => {
    expect(useBankHolidaysStore.getState().bankHolidays).toEqual([]);
  });

  it("SHOULD store bank holiday events", () => {
    const bankHolidays: BankHolidayEvent[] = [
      {
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
    ];

    useBankHolidaysStore.getState().setBankHolidays(bankHolidays);

    expect(useBankHolidaysStore.getState().bankHolidays).toEqual([
      {
        id: 0,
        ...bankHolidays[0],
      },
    ]);
  });

  it("SHOULD assign sequential ids when storing multiple bank holiday events", () => {
    const bankHolidays: BankHolidayEvent[] = [
      {
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
      {
        title: "Early May bank holiday",
        date: "2026-05-04",
        notes: "",
        bunting: true,
      },
    ];

    useBankHolidaysStore.getState().setBankHolidays(bankHolidays);

    expect(useBankHolidaysStore.getState().bankHolidays).toEqual([
      {
        id: 0,
        ...bankHolidays[0],
      },
      {
        id: 1,
        ...bankHolidays[1],
      },
    ]);
  });

  it("SHOULD update an existing bank holiday by id", () => {
    useBankHolidaysStore.setState({
      bankHolidays: [
        {
          id: 0,
          title: "New Year's Day",
          date: "2026-01-01",
          notes: "",
          bunting: true,
        },
        {
          id: 1,
          title: "Early May bank holiday",
          date: "2026-05-04",
          notes: "",
          bunting: true,
        },
      ],
    });

    useBankHolidaysStore.getState().updateBankHoliday({
      id: 1,
      title: "Updated bank holiday",
      date: "2026-05-05",
      notes: "Moved date",
      bunting: false,
    });

    expect(useBankHolidaysStore.getState().bankHolidays).toEqual([
      {
        id: 0,
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
      {
        id: 1,
        title: "Updated bank holiday",
        date: "2026-05-05",
        notes: "Moved date",
        bunting: false,
      },
    ]);
  });

  it("SHOULD leave bank holidays unchanged when updating an unknown id", () => {
    const existingBankHolidays = [
      {
        id: 0,
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
    ];

    useBankHolidaysStore.setState({
      bankHolidays: existingBankHolidays,
    });

    useBankHolidaysStore.getState().updateBankHoliday({
      id: 99,
      title: "Non-existent bank holiday",
      date: "2026-12-25",
      notes: "",
      bunting: false,
    });

    expect(useBankHolidaysStore.getState().bankHolidays).toEqual(
      existingBankHolidays,
    );
  });
});
