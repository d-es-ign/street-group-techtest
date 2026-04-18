import { fireEvent } from "@testing-library/react-native";
import { Animated } from "react-native";

import { render, screen } from "@/test-utils";

import { SwipeableItem } from ".";

jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => ({
  __esModule: true,
  default: ({
    children,
    onSwipeableClose,
    onSwipeableOpen,
    renderRightActions,
  }: {
    children: React.JSX.Element;
    onSwipeableClose?: () => void;
    onSwipeableOpen?: () => void;
    renderRightActions?: () => React.JSX.Element;
  }) => {
    const React = jest.requireActual("react") as typeof import("react");
    const { Pressable } = jest.requireActual("react-native") as typeof import("react-native");

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Pressable, {
        testID: "open-swipeable",
        onPress: onSwipeableOpen,
      }),
      React.createElement(Pressable, {
        testID: "close-swipeable",
        onPress: onSwipeableClose,
      }),
      children,
      renderRightActions ? renderRightActions() : null,
    );
  },
}));

describe("GIVEN SwipeableItem", () => {
  const bankHoliday = {
    bunting: true,
    date: "2026-01-01",
    id: "0",
    notes: "",
    title: "New Year's Day",
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("SHOULD render the menu icon before actions are shown", () => {
    render(
      <SwipeableItem
        bankHoliday={bankHoliday}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    expect(screen.getByTestId("menu-icon")).toBeOnTheScreen();
    expect(screen.queryByTestId("chevron-right-icon")).not.toBeOnTheScreen();
  });

  it("SHOULD render the chevron icon when actions are shown", () => {
    render(
      <SwipeableItem
        bankHoliday={bankHoliday}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId("open-swipeable"));

    expect(screen.getByTestId("chevron-right-icon")).toBeOnTheScreen();
    expect(screen.queryByTestId("menu-icon")).not.toBeOnTheScreen();
  });

  it("SHOULD close the actions after tapping an action item", () => {
    const onEdit = jest.fn();

    render(
      <SwipeableItem
        bankHoliday={bankHoliday}
        onDelete={jest.fn()}
        onEdit={onEdit}
        onSave={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId("open-swipeable"));
    fireEvent.press(screen.getByText("Edit"));

    expect(onEdit).toHaveBeenCalledWith(bankHoliday);
    expect(screen.getByTestId("menu-icon")).toBeOnTheScreen();
    expect(screen.queryByTestId("chevron-right-icon")).not.toBeOnTheScreen();
  });

  it("SHOULD animate the content when tapped", () => {
    const start = jest.fn();
    const stop = jest.fn();
    const reset = jest.fn();

    jest
      .spyOn(Animated, "sequence")
      .mockReturnValue({
        reset,
        start,
        stop,
      } as unknown as Animated.CompositeAnimation);

    render(
      <SwipeableItem
        bankHoliday={bankHoliday}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId("swipeable-item-content"));

    expect(Animated.sequence).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
  });

  it("SHOULD animate the content when the menu icon is tapped", () => {
    const start = jest.fn();
    const stop = jest.fn();
    const reset = jest.fn();

    jest
      .spyOn(Animated, "sequence")
      .mockReturnValue({
        reset,
        start,
        stop,
      } as unknown as Animated.CompositeAnimation);

    render(
      <SwipeableItem
        bankHoliday={bankHoliday}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId("swipeable-item-menu-button"));

    expect(Animated.sequence).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
  });

  it("SHOULD not animate the content when actions are shown", () => {
    const start = jest.fn();
    const stop = jest.fn();
    const reset = jest.fn();

    const sequenceSpy = jest
      .spyOn(Animated, "sequence")
      .mockReturnValue({
        reset,
        start,
        stop,
      } as unknown as Animated.CompositeAnimation);

    render(
      <SwipeableItem
        bankHoliday={bankHoliday}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId("open-swipeable"));
    fireEvent.press(screen.getByTestId("swipeable-item-content"));

    expect(sequenceSpy).not.toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
  });

  it("SHOULD restart the animation when tapped in quick succession", () => {
    let firstAnimationComplete: ((result: { finished: boolean }) => void) | undefined;

    const firstAnimation = {
      reset: jest.fn(),
      start: jest.fn((callback?: (result: { finished: boolean }) => void) => {
        firstAnimationComplete = callback;
      }),
      stop: jest.fn(() => {
        firstAnimationComplete?.({ finished: false });
      }),
    } as unknown as Animated.CompositeAnimation;
    const secondAnimation = {
      reset: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    } as unknown as Animated.CompositeAnimation;
    const thirdAnimation = {
      reset: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    } as unknown as Animated.CompositeAnimation;

    jest
      .spyOn(Animated, "sequence")
      .mockReturnValueOnce(firstAnimation)
      .mockReturnValueOnce(secondAnimation)
      .mockReturnValueOnce(thirdAnimation);

    render(
      <SwipeableItem
        bankHoliday={bankHoliday}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId("swipeable-item-content"));
    fireEvent.press(screen.getByTestId("swipeable-item-content"));
    fireEvent.press(screen.getByTestId("swipeable-item-content"));

    expect(firstAnimation.stop).toHaveBeenCalled();
    expect(secondAnimation.start).toHaveBeenCalled();
    expect(secondAnimation.stop).toHaveBeenCalled();
    expect(thirdAnimation.start).toHaveBeenCalled();
  });
});
