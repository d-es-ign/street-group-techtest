import { act } from "react";

import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { renderHook } from "@/test-utils";

import { useBankHolidaysQuery } from "./queries/use-bank-holidays-query";
import { useBankHolidays } from "./use-bank-holidays";

jest.mock("./queries/use-bank-holidays-query", () => ({
  useBankHolidaysQuery: jest.fn(),
}));

describe("GIVEN useBankHolidays", () => {
  const mockedUseBankHolidaysQuery = jest.mocked(useBankHolidaysQuery);

  beforeEach(() => {
    act(() => {
      useBankHolidaysStore.setState({ bankHolidays: [] });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    act(() => {
      useBankHolidaysStore.setState({ bankHolidays: [] });
    });
  });

  it("SHOULD reset local bank holiday state from refreshed query data", async () => {
    const queryData = [
      {
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
    ];

    const refetch = jest.fn().mockResolvedValue({
      data: queryData,
      error: null,
      isError: false,
      status: "success",
    });

    mockedUseBankHolidaysQuery.mockReturnValue({
      data: queryData,
      isError: false,
      isLoading: false,
      isRefetching: false,
      refetch,
    } as unknown as ReturnType<typeof useBankHolidaysQuery>);

    const { result } = renderHook(() => useBankHolidays());

    act(() => {
      useBankHolidaysStore.getState().updateBankHoliday({
        id: "0",
        title: "Edited title",
        date: "2026-01-02",
        notes: "Edited notes",
        bunting: false,
      });
    });

    await act(async () => {
      await result.current.refreshBankHolidays();
    });

    expect(useBankHolidaysStore.getState().bankHolidays).toEqual([
      {
        id: "0",
        title: "New Year's Day",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
    ]);
  });

  it("SHOULD keep local bank holiday state when cached query data exists", () => {
    const queryData = [
      {
        title: "Fetched title",
        date: "2026-01-01",
        notes: "",
        bunting: true,
      },
    ];

    act(() => {
      useBankHolidaysStore.setState({
        bankHolidays: [
          {
            id: "0",
            title: "Persisted title",
            date: "2026-01-02",
            notes: "Persisted notes",
            bunting: false,
          },
        ],
      });
    });

    mockedUseBankHolidaysQuery.mockReturnValue({
      data: queryData,
      isError: false,
      isLoading: false,
      isRefetching: false,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useBankHolidaysQuery>);

    renderHook(() => useBankHolidays());

    expect(useBankHolidaysStore.getState().bankHolidays).toEqual([
      {
        id: "0",
        title: "Persisted title",
        date: "2026-01-02",
        notes: "Persisted notes",
        bunting: false,
      },
    ]);
  });
});
