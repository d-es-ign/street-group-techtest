import { ComponentRef, ComponentType, createElement, useRef, useState } from "react";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SvgProps } from "react-native-svg";

import CalendarIcon from "@/assets/svg/calendar.svg";
import ChevronRightIcon from "@/assets/svg/chevron-right.svg";
import DeleteIcon from "@/assets/svg/delete.svg";
import EditIcon from "@/assets/svg/edit.svg";
import MenuIcon from "@/assets/svg/menu.svg";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";

import {
  StyledActionButton,
  StyledActionButtonLabel,
  StyledActionButtons,
  StyledActionContent,
  StyledListItem,
  StyledListItemContent,
  StyledListItemDate,
  StyledListItemTitle,
} from "./swipeable-item.styles";

const SvgMockFallback = (props: SvgProps) => {
  return createElement("SvgMock", props);
};

const getSvgComponent = (icon: unknown) => {
  const resolvedIcon = icon as
    | ComponentType<SvgProps>
    | {
        default?: ComponentType<SvgProps>;
      };

  if (typeof resolvedIcon === "function") {
    return resolvedIcon;
  }

  if (typeof resolvedIcon.default === "function") {
    return resolvedIcon.default;
  }

  return SvgMockFallback;
};

const CalendarSvg = getSvgComponent(CalendarIcon);
const ChevronRightSvg = getSvgComponent(ChevronRightIcon);
const DeleteSvg = getSvgComponent(DeleteIcon);
const EditSvg = getSvgComponent(EditIcon);
const MenuSvg = getSvgComponent(MenuIcon);

interface SwipeableItemProps {
  bankHoliday: BankHolidayStateEvent;
  onEdit: (bankHoliday: BankHolidayStateEvent) => void;
  onDelete: (bankHoliday: BankHolidayStateEvent) => void;
  onSave: (bankHoliday: BankHolidayStateEvent) => void;
}

export const SwipeableItem = ({
  bankHoliday,
  onEdit,
  onDelete,
  onSave,
}: SwipeableItemProps) => {
  const [isShowingActions, setIsShowingActions] = useState(false);
  const swipeableRef = useRef<ComponentRef<typeof Swipeable>>(null);

  const handleActionPress = (action: (bankHoliday: BankHolidayStateEvent) => void) => {
    swipeableRef.current?.close?.();
    setIsShowingActions(false);
    action(bankHoliday);
  };

  return (
    <Swipeable
      ref={swipeableRef}
      onSwipeableClose={() => setIsShowingActions(false)}
      onSwipeableOpen={() => setIsShowingActions(true)}
      renderRightActions={() => {
        return (
          <StyledActionButtons>
            <StyledActionButton
              variant="success"
              onPress={() => handleActionPress(onSave)}
            >
              <StyledActionContent>
                <CalendarSvg
                  fill="white"
                  height={20}
                  testID="calendar-icon"
                  width={20}
                />
                <StyledActionButtonLabel>Save</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
            <StyledActionButton onPress={() => handleActionPress(onEdit)}>
              <StyledActionContent>
                <EditSvg
                  fill="white"
                  height={20}
                  testID="edit-icon"
                  width={20}
                />
                <StyledActionButtonLabel>Edit</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
            <StyledActionButton
              variant="error"
              onPress={() => handleActionPress(onDelete)}
            >
              <StyledActionContent>
                <DeleteSvg
                  fill="white"
                  height={20}
                  testID="delete-icon"
                  width={20}
                />
                <StyledActionButtonLabel>Delete</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
          </StyledActionButtons>
        );
      }}
    >
      <StyledListItem>
        <StyledListItemContent>
          <StyledListItemTitle>{bankHoliday.title}</StyledListItemTitle>
          <StyledListItemDate>{bankHoliday.date}</StyledListItemDate>
        </StyledListItemContent>
        {isShowingActions ? (
          <ChevronRightSvg
            fill="black"
            height={24}
            testID="chevron-right-icon"
            width={24}
          />
        ) : (
          <MenuSvg fill="black" height={24} testID="menu-icon" width={24} />
        )}
      </StyledListItem>
    </Swipeable>
  );
};
