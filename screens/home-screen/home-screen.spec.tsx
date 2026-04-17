import { fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { useBankHolidays } from "@/domains/bank-holidays/hooks/use-bank-holidays";
import { render, screen } from "@/test-utils";

import HomeScreen from "./index";

jest.mock("@shopify/flash-list", () => ({
  FlashList: ({
    data,
    onRefresh,
    renderItem,
    refreshing,
  }: {
    data: unknown[];
    onRefresh?: () => void;
    renderItem: ({ item }: { item: unknown }) => React.JSX.Element;
    refreshing?: boolean;
  }) => {
    const React = jest.requireActual("react") as typeof import("react");
    const { Pressable, Text } = jest.requireActual(
      "react-native",
    ) as typeof import("react-native");

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Pressable,
        { testID: "refresh-list", onPress: onRefresh },
        React.createElement(Text, null, refreshing ? "refreshing" : "idle"),
      ),
      ...data.map((item, index) =>
        React.createElement(
          React.Fragment,
          { key: index },
          renderItem({ item }),
        ),
      ),
    );
  },
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@/assets/svg/edit.svg", () => "SvgEditIcon");
jest.mock("@/assets/svg/delete.svg", () => "SvgDeleteIcon");
jest.mock("@/assets/svg/calendar.svg", () => "SvgCalendarIcon");

jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => ({
  __esModule: true,
  default: ({
    children,
    renderRightActions,
  }: {
    children: React.JSX.Element;
    renderRightActions?: () => React.JSX.Element;
  }) => {
    const React = jest.requireActual("react") as typeof import("react");

    return React.createElement(
      React.Fragment,
      null,
      children,
      renderRightActions ? renderRightActions() : null,
    );
  },
}));

jest.mock("@/domains/bank-holidays/hooks/use-bank-holidays", () => ({
  useBankHolidays: jest.fn(),
}));

const mockedUseBankHolidays = jest.mocked(useBankHolidays);

const createBankHolidaysResult = (
  overrides: Partial<ReturnType<typeof useBankHolidays>>,
) => {
  return {
    bankHolidays: [],
    isError: false,
    isLoading: false,
    isRefreshing: false,
    refreshBankHolidays: jest.fn(),
    toggleBankHolidayBunting: jest.fn(),
    toggleBankHolidayNotes: jest.fn(),
    ...overrides,
  } as ReturnType<typeof useBankHolidays>;
};

describe("GIVEN HomeScreen", () => {
  it("SHOULD render a loading state", () => {
    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({ isLoading: true }),
    );

    render(<HomeScreen />);

    expect(
      screen.getByRole("header", { name: "Street Group Tech Test" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("Loading bank holidays...")).toBeOnTheScreen();
  });

  it("SHOULD render an error state", () => {
    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({ isError: true }),
    );

    render(<HomeScreen />);

    expect(
      screen.getByRole("header", { name: "Street Group Tech Test" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("Could not load bank holidays.")).toBeOnTheScreen();
  });

  it("SHOULD keep rendering bank holidays when refresh fails", () => {
    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({
        bankHolidays: [
          {
            id: "0",
            title: "New Year's Day",
            date: "2026-01-01",
            notes: "",
            bunting: true,
          },
        ],
        isError: true,
      }),
    );

    render(<HomeScreen />);

    expect(screen.getByText("New Year's Day")).toBeOnTheScreen();
    expect(
      screen.queryByText("Could not load bank holidays."),
    ).not.toBeOnTheScreen();
  });

  it("SHOULD render bank holidays in a list", () => {
    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({
        bankHolidays: [
          {
            id: "0",
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
    expect(screen.getByText("Edit")).toBeOnTheScreen();
    expect(screen.getByText("Delete")).toBeOnTheScreen();
    expect(screen.getByText("Save")).toBeOnTheScreen();
    expect(screen.getByTestId("edit-icon")).toBeOnTheScreen();
    expect(screen.getByTestId("delete-icon")).toBeOnTheScreen();
    expect(screen.getByTestId("calendar-icon")).toBeOnTheScreen();
  });

  it("SHOULD trigger swipe actions", () => {
    const push = jest.mocked(router.push);

    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({
        bankHolidays: [
          {
            id: "0",
            title: "New Year's Day",
            date: "2026-01-01",
            notes: "",
            bunting: true,
          },
        ],
      }),
    );

    render(<HomeScreen />);

    fireEvent.press(screen.getByText("Edit"));

    expect(push).toHaveBeenCalledWith("/edit/0");
  });

  it("SHOULD refetch bank holidays when the list is pulled to refresh", () => {
    const refreshBankHolidays = jest.fn();

    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({
        bankHolidays: [
          {
            id: "0",
            title: "New Year's Day",
            date: "2026-01-01",
            notes: "",
            bunting: true,
          },
        ],
        refreshBankHolidays,
      }),
    );

    render(<HomeScreen />);

    fireEvent.press(screen.getByTestId("refresh-list"));

    expect(refreshBankHolidays).toHaveBeenCalledTimes(1);
  });
});
