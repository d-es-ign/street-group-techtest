import { fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { type AccessibilityRole } from "react-native";
import { AccessibilityInfo, Alert, Linking } from "react-native";
import RNCalendarEvents from "react-native-calendar-events";

import { useBankHolidays } from "@/domains/bank-holidays/hooks/use-bank-holidays";
import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { render, screen } from "@/test-utils";
import { createCalendarEventDetails } from "@/utils/date-utils";

import HomeScreen from "./index";

jest.mock("@shopify/flash-list", () => ({
  FlashList: ({
    accessibilityLabel,
    accessibilityRole,
    data,
    onRefresh,
    renderItem,
    refreshing,
  }: {
    accessibilityLabel?: string;
    accessibilityRole?: AccessibilityRole;
    data: unknown[];
    onRefresh?: () => void;
    renderItem: ({ item }: { item: unknown }) => React.JSX.Element;
    refreshing?: boolean;
  }) => {
    const React = jest.requireActual("react") as typeof import("react");
    const { Pressable, Text, View } = jest.requireActual(
      "react-native",
    ) as typeof import("react-native");

    return React.createElement(
      View,
      { accessibilityLabel, accessibilityRole },
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

jest.mock("@/domains/bank-holidays/stores", () => ({
  useBankHolidaysStore: jest.fn(),
}));

jest.mock("react-native-calendar-events", () => ({
  __esModule: true,
  default: {
    requestPermissions: jest.fn(),
    saveEvent: jest.fn(),
  },
}));

const mockedUseBankHolidays = jest.mocked(useBankHolidays);
const mockedUseBankHolidaysStore = jest.mocked(useBankHolidaysStore);
const mockedCalendarEvents = jest.mocked(RNCalendarEvents);
const deleteBankHoliday = jest.fn();

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
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
  const announceForAccessibilitySpy = jest
    .spyOn(AccessibilityInfo, "announceForAccessibility")
    .mockImplementation(jest.fn());
  const openSettingsSpy = jest
    .spyOn(Linking, "openSettings")
    .mockResolvedValue();

  beforeEach(() => {
    deleteBankHoliday.mockReset();
    alertSpy.mockReset();
    announceForAccessibilitySpy.mockReset();
    openSettingsSpy.mockClear();
    mockedCalendarEvents.requestPermissions.mockReset();
    mockedCalendarEvents.saveEvent.mockReset();
    mockedUseBankHolidaysStore.mockImplementation((selector) =>
      selector({
        bankHolidays: [],
        hasHydrated: true,
        deleteBankHoliday,
        setHasHydrated: jest.fn(),
        setBankHolidays: jest.fn(),
        updateBankHoliday: jest.fn(),
      }),
    );
  });

  it("SHOULD render a loading state", () => {
    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({ isLoading: true }),
    );

    render(<HomeScreen />);

    expect(
      screen.getByRole("header", { name: "Street Group Tech Test" }),
    ).toBeOnTheScreen();
    expect(screen.getByRole("alert")).toHaveTextContent("Loading bank holidays...");
  });

  it("SHOULD render an error state", () => {
    mockedUseBankHolidays.mockReturnValue(
      createBankHolidaysResult({ isError: true }),
    );

    render(<HomeScreen />);

    expect(
      screen.getByRole("header", { name: "Street Group Tech Test" }),
    ).toBeOnTheScreen();
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load bank holidays.");
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
    expect(screen.getByLabelText("Bank holidays, 1 items")).toBeOnTheScreen();
    expect(screen.getByLabelText("Show actions for New Year's Day")).toBeOnTheScreen();

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));

    expect(screen.getByLabelText("Edit New Year's Day")).toBeOnTheScreen();
    expect(screen.getByLabelText("Delete New Year's Day")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add New Year's Day to calendar")).toBeOnTheScreen();
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

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));
    fireEvent.press(screen.getByLabelText("Edit New Year's Day"));

    expect(push).toHaveBeenCalledWith("/edit/0");
  });

  it("SHOULD delete a bank holiday when delete is pressed", () => {
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

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));
    fireEvent.press(screen.getByLabelText("Delete New Year's Day"));

    expect(deleteBankHoliday).toHaveBeenCalledWith("0");
    expect(announceForAccessibilitySpy).toHaveBeenCalledWith(
      "New Year's Day deleted from the list.",
    );
  });

  it("SHOULD save a bank holiday to the native calendar when save is pressed", async () => {
    mockedCalendarEvents.requestPermissions.mockResolvedValue("authorized");
    mockedCalendarEvents.saveEvent.mockResolvedValue("calendar-event-id");

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

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));
    fireEvent.press(screen.getByLabelText("Add New Year's Day to calendar"));

    await waitFor(() => {
      expect(mockedCalendarEvents.requestPermissions).toHaveBeenCalledTimes(1);
      expect(mockedCalendarEvents.saveEvent).toHaveBeenCalledWith(
        "New Year's Day",
        createCalendarEventDetails("2026-01-01"),
      );
      expect(announceForAccessibilitySpy).toHaveBeenCalledWith(
        "New Year's Day has been added to your calendar.",
      );
      expect(alertSpy).toHaveBeenCalledWith(
        "Event saved",
        "New Year's Day has been added to your calendar.",
      );
    });
  });

  it("SHOULD show feedback when calendar permission is denied", async () => {
    mockedCalendarEvents.requestPermissions.mockResolvedValue("denied");

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

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));
    fireEvent.press(screen.getByLabelText("Add New Year's Day to calendar"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Calendar access needed",
        "Allow calendar access to add events.",
      );
      expect(announceForAccessibilitySpy).toHaveBeenCalledWith(
        "Calendar access needed. Allow calendar access to add events.",
      );
      expect(mockedCalendarEvents.saveEvent).not.toHaveBeenCalled();
    });
  });

  it("SHOULD offer opening settings after calendar permission was already denied", async () => {
    mockedCalendarEvents.requestPermissions.mockResolvedValue("denied");

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

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));
    fireEvent.press(screen.getByLabelText("Add New Year's Day to calendar"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenNthCalledWith(
        1,
        "Calendar access needed",
        "Allow calendar access to add events.",
      );
    });

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));
    fireEvent.press(screen.getByLabelText("Add New Year's Day to calendar"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenNthCalledWith(
        2,
        "Calendar access needed",
        "Allow calendar access in Settings to add events.",
        expect.arrayContaining([
          expect.objectContaining({ text: "Cancel" }),
          expect.objectContaining({ text: "Open Settings" }),
        ]),
      );
      expect(announceForAccessibilitySpy).toHaveBeenLastCalledWith(
        "Calendar access needed. Allow calendar access in Settings to add events.",
      );
    });

    const settingsButton = alertSpy.mock.calls[1]?.[2]?.find(
      (button) => button.text === "Open Settings",
    );

    settingsButton?.onPress?.();

    expect(openSettingsSpy).toHaveBeenCalledTimes(1);
    expect(mockedCalendarEvents.saveEvent).not.toHaveBeenCalled();
  });

  it("SHOULD show feedback when saving the event fails", async () => {
    mockedCalendarEvents.requestPermissions.mockResolvedValue("authorized");
    mockedCalendarEvents.saveEvent.mockRejectedValue(new Error("Save failed"));

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

    fireEvent.press(screen.getByLabelText("Show actions for New Year's Day"));
    fireEvent.press(screen.getByLabelText("Add New Year's Day to calendar"));

    await waitFor(() => {
      expect(announceForAccessibilitySpy).toHaveBeenCalledWith(
        "Could not save event. Try again in a moment.",
      );
      expect(alertSpy).toHaveBeenCalledWith(
        "Could not save event",
        "Try again in a moment.",
      );
    });
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
