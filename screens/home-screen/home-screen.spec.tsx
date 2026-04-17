import { useBankHolidaysQuery } from "@/domains/bank-holidays/hooks/queries/use-bank-holidays-query";
import { render, screen } from "@/test-utils";

import HomeScreen from "./index";

jest.mock("@shopify/flash-list", () => ({
  FlashList: ({
    data,
    renderItem,
  }: {
    data: unknown[];
    renderItem: ({ item }: { item: unknown }) => React.JSX.Element;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");

    return data.map((item, index) => (
      <React.Fragment key={index}>{renderItem({ item })}</React.Fragment>
    ));
  },
}));

jest.mock(
  "@/domains/bank-holidays/hooks/queries/use-bank-holidays-query",
  () => ({
    useBankHolidaysQuery: jest.fn(),
  }),
);

const mockedUseBankHolidaysQuery = jest.mocked(useBankHolidaysQuery);

const createBankHolidaysQueryResult = (
  overrides: Partial<ReturnType<typeof useBankHolidaysQuery>>,
) => {
  return {
    data: undefined,
    isError: false,
    isLoading: false,
    ...overrides,
  } as unknown as ReturnType<typeof useBankHolidaysQuery>;
};

describe("GIVEN HomeScreen", () => {
  it("SHOULD render a loading state", () => {
    mockedUseBankHolidaysQuery.mockReturnValue(
      createBankHolidaysQueryResult({ isLoading: true }),
    );

    render(<HomeScreen />);

    expect(
      screen.getByRole("header", { name: "Street Group Tech Test" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("Loading bank holidays...")).toBeOnTheScreen();
  });

  it("SHOULD render bank holidays in a list", () => {
    mockedUseBankHolidaysQuery.mockReturnValue(
      createBankHolidaysQueryResult({
        data: [
          {
            title: "New Year's Day",
            date: "2026-01-01",
            notes: "",
            bunting: true,
          },
        ],
      }),
    );

    render(<HomeScreen />);

    expect(screen.getByText("New Year's Day")).toBeOnTheScreen();
    expect(screen.getByText("2026-01-01")).toBeOnTheScreen();
  });
});
