import { waitFor } from "@testing-library/react-native";

import { createQueryWrapper, renderHook } from "@/test-utils";

import { useBankHolidaysQuery } from "./use-bank-holidays-query";

describe("GIVEN useBankHolidaysQuery", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-15T00:00:00.000Z"));
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("SHOULD fetch bank holidays data", async () => {
    const data = {
      scotland: {
        division: "Scotland",
        events: [
          {
            title: "New Year's Day",
            date: "2026-01-01",
            notes: "",
            bunting: true,
          },
          {
            title: "St Andrew's Day",
            date: "2026-11-30",
            notes: "",
            bunting: true,
          },
        ],
      },
    };

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(data),
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useBankHolidaysQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([
      {
        id: "2026-11-30-St Andrew's Day",
        title: "St Andrew's Day",
        date: "2026-11-30",
        division: "Scotland",
      },
    ]);
  });
});
