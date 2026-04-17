import BankHolidaysApiService from "./BankHolidaysApiService";

describe("GIVEN BankHolidaysApiService", () => {
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

  it("SHOULD return a flat list of future bank holidays", async () => {
    const data = {
      "england-and-wales": {
        division: "England and Wales",
        events: [
          {
            title: "New Year’s Day",
            date: "2026-01-01",
            notes: "",
            bunting: true,
          },
          {
            title: "Good Friday",
            date: "2026-04-03",
            notes: "",
            bunting: true,
          },
        ],
      },
      scotland: {
        division: "Scotland",
        events: [
          {
            title: "Early May bank holiday",
            date: "2026-05-04",
            notes: "",
            bunting: true,
          },
          {
            title: "Good Friday",
            date: "2026-04-03",
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

    const service = new BankHolidaysApiService();

    await expect(service.getBankHolidays()).resolves.toEqual([
      {
        title: "Good Friday",
        date: "2026-04-03",
        notes: "",
        bunting: true,
      },
      {
        bunting: true,
        date: "2026-05-04",
        notes: "",
        title: "Early May bank holiday",
      },
    ]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://www.gov.uk/bank-holidays.json",
    );
  });

  it("SHOULD throw when the request fails", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
    }) as unknown as typeof fetch;

    const service = new BankHolidaysApiService();

    await expect(service.getBankHolidays()).rejects.toThrow(
      "Failed to fetch bank holidays",
    );
  });
});
