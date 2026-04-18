import { act, fireEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import { AccessibilityInfo } from "react-native";

import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";
import { render, screen } from "@/test-utils";

import { EditBankHolidayScreen } from "./index";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock("@/domains/bank-holidays/stores", () => ({
  useBankHolidaysStore: jest.fn(),
}));

jest.mock("@react-native-community/datetimepicker", () => {
  const React = jest.requireActual("react") as typeof import("react");
  const { Pressable, Text } = jest.requireActual(
    "react-native",
  ) as typeof import("react-native");

  const formatLocalDate = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const MockDateTimePicker = ({
    maximumDate,
    minimumDate,
    onChange,
    value,
  }: {
    maximumDate: Date;
    minimumDate: Date;
    onChange: (_event: unknown, selectedDate?: Date) => void;
    value: Date;
  }) => {
    return React.createElement(
      Pressable,
      {
        onPress: () => onChange(undefined, new Date(2026, 2, 20)),
        testID: "bank-holiday-date-input",
      },
      React.createElement(Text, null, formatLocalDate(value)),
      React.createElement(Text, null, formatLocalDate(minimumDate)),
      React.createElement(Text, null, formatLocalDate(maximumDate)),
    );
  };

  MockDateTimePicker.displayName = "MockDateTimePicker";

  return MockDateTimePicker;
});

describe("GIVEN EditBankHolidayScreen", () => {
  const announceForAccessibilitySpy = jest
    .spyOn(AccessibilityInfo, "announceForAccessibility")
    .mockImplementation(jest.fn());
  const updateBankHoliday = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 0, 15));
    announceForAccessibilitySpy.mockReset();
    updateBankHoliday.mockReset();

    jest.mocked(useBankHolidaysStore).mockImplementation((selector) =>
      selector({
        bankHolidays: [],
        deleteBankHoliday: jest.fn(),
        hasHydrated: true,
        setBankHolidays: jest.fn(),
        setHasHydrated: jest.fn(),
        updateBankHoliday,
      }),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const bankHoliday: BankHolidayStateEvent = {
    id: "1",
    title: "Good Friday",
    date: "2026-04-03",
    notes: "",
    bunting: true,
  };

  it("SHOULD prefill the title and date from the bank holiday", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    expect(screen.getByLabelText("Bank holiday title")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("Good Friday")).toBeOnTheScreen();
    expect(screen.getByText("2026-04-03")).toBeOnTheScreen();
  });

  it("SHOULD pass a valid date range from today to six months ahead", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    expect(screen.getByText("2026-01-15")).toBeOnTheScreen();
    expect(screen.getByText("2026-07-15")).toBeOnTheScreen();
  });

  it("SHOULD update the title and date inputs", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    fireEvent.changeText(
      screen.getByDisplayValue("Good Friday"),
      "Updated holiday",
    );
    fireEvent.press(screen.getByTestId("bank-holiday-date-input"));

    expect(screen.getByDisplayValue("Updated holiday")).toBeOnTheScreen();
    expect(screen.getByText("2026-03-20")).toBeOnTheScreen();
  });

  it("SHOULD disable save and show a validation message when title is empty", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    const titleInput = screen.getByDisplayValue("Good Friday");

    fireEvent.changeText(titleInput, "");
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.press(screen.getByText("Save"));

    expect(screen.getByRole("alert")).toHaveTextContent("Title can't be empty.");
    expect(screen.getByLabelText("Save changes")).toBeDisabled();
    expect(screen.queryByText("Save changes?")).not.toBeOnTheScreen();
  });

  it("SHOULD keep the validation message visible while the title is empty", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    const titleInput = screen.getByDisplayValue("Good Friday");

    fireEvent.changeText(titleInput, "");
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText("Title can't be empty.")).toBeOnTheScreen();

    fireEvent(titleInput, "focus");
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Title can't be empty.")).toBeOnTheScreen();
  });

  it("SHOULD show the validation message when tapping the date picker with an empty title", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    fireEvent.changeText(screen.getByDisplayValue("Good Friday"), "");
    fireEvent.press(screen.getByTestId("bank-holiday-date-input"));
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Title can't be empty.")).toBeOnTheScreen();
  });

  it("SHOULD hide the validation message when the title becomes valid", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    const titleInput = screen.getByDisplayValue("Good Friday");

    fireEvent.changeText(titleInput, "");
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Title can't be empty.")).toBeOnTheScreen();

    fireEvent.changeText(titleInput, "Updated holiday");
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByText("Title can't be empty.")).not.toBeOnTheScreen();
  });

  it("SHOULD keep the validation message visible after rapid empty text toggles", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    const titleInput = screen.getByDisplayValue("Good Friday");

    fireEvent.changeText(titleInput, "");
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.changeText(titleInput, "Updated holiday");
    fireEvent.changeText(titleInput, "");
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Title can't be empty.")).toBeOnTheScreen();
  });

  it("SHOULD show a confirmation modal before saving changes", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    fireEvent.press(screen.getByText("Save"));

    expect(screen.getByText("Save changes?")).toBeOnTheScreen();
    expect(screen.getByLabelText("Cancel save changes")).toBeOnTheScreen();
    expect(screen.getByLabelText("Confirm save changes")).toBeOnTheScreen();
    expect(updateBankHoliday).not.toHaveBeenCalled();
  });

  it("SHOULD save changes after confirmation", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    fireEvent.changeText(screen.getByDisplayValue("Good Friday"), "Updated holiday");
    fireEvent.press(screen.getByTestId("bank-holiday-date-input"));
    fireEvent.press(screen.getByText("Save"));
    fireEvent.press(screen.getByText("Confirm"));

    expect(updateBankHoliday).toHaveBeenCalledWith({
      bunting: true,
      date: "2026-03-20",
      id: "1",
      notes: "",
      title: "Updated holiday",
    });
    expect(announceForAccessibilitySpy).toHaveBeenCalledWith(
      "Updated holiday saved successfully.",
    );
    expect(jest.mocked(router.back)).toHaveBeenCalledTimes(1);
  });

  it("SHOULD close the confirmation modal without saving when cancelled", () => {
    render(<EditBankHolidayScreen bankHoliday={bankHoliday} />);

    fireEvent.press(screen.getByText("Save"));
    fireEvent.press(screen.getByText("Cancel"));

    expect(screen.queryByText("Save changes?")).not.toBeOnTheScreen();
    expect(updateBankHoliday).not.toHaveBeenCalled();
  });
});
