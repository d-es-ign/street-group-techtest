import { waitFor } from "@testing-library/react-native";
import { act } from "react";

import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { render } from "@/test-utils";

import { BankHolidaysBootstrap } from "./index";

describe("GIVEN BankHolidaysBootstrap", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-15T00:00:00.000Z"));
    act(() => {
      useBankHolidaysStore.setState({ bankHolidays: [] });
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.resetAllMocks();
    jest.useRealTimers();
    act(() => {
      useBankHolidaysStore.setState({ bankHolidays: [] });
    });
  });

  it("SHOULD fetch and store bank holidays when state is empty", async () => {
    const fetchResponse = Promise.resolve({
      ok: true,
      json: jest.fn().mockResolvedValue({
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
              date: "2026-03-30",
              notes: "",
              bunting: true,
            },
          ],
        },
      }),
    });

    globalThis.fetch = jest
      .fn()
      .mockReturnValue(fetchResponse) as unknown as typeof fetch;

    render(<BankHolidaysBootstrap />);

    await act(async () => {
      await fetchResponse;
    });

    await waitFor(() => {
      expect(useBankHolidaysStore.getState().bankHolidays).toEqual([
        {
          id: "0",
          title: "St Andrew's Day",
          date: "2026-03-30",
          notes: "",
          bunting: true,
        },
      ]);
    });
  });

  it("SHOULD not fetch when state already contains bank holidays", async () => {
    act(() => {
      useBankHolidaysStore.setState({
        bankHolidays: [
          {
            id: "0",
            title: "Early May bank holiday",
            date: "2026-05-04",
            notes: "",
            bunting: true,
          },
        ],
      });
    });

    globalThis.fetch = jest.fn() as unknown as typeof fetch;

    render(<BankHolidaysBootstrap />);

    await waitFor(() => {
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });
  });
});
