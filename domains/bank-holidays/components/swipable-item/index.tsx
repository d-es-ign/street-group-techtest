import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import CalendarIcon from "@/assets/svg/calendar.svg";
import DeleteIcon from "@/assets/svg/delete.svg";
import EditIcon from "@/assets/svg/edit.svg";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";

import {
  StyledActionButton,
  StyledActionButtonLabel,
  StyledActionButtons,
  StyledActionContent,
  StyledListItem,
  StyledListItemDate,
  StyledListItemTitle,
} from "./swipeable-item.styles";

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
  return (
    <Swipeable
      renderRightActions={() => {
        return (
          <StyledActionButtons>
            <StyledActionButton onPress={() => onEdit(bankHoliday)}>
              <StyledActionContent>
                <EditIcon color="white" height={20} testID="edit-icon" width={20} />
                <StyledActionButtonLabel>Edit</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
            <StyledActionButton
              variant="error"
              onPress={() => onDelete(bankHoliday)}
            >
              <StyledActionContent>
                <DeleteIcon color="white" height={20} testID="delete-icon" width={20} />
                <StyledActionButtonLabel>Delete</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
            <StyledActionButton
              variant="success"
              onPress={() => onSave(bankHoliday)}
            >
              <StyledActionContent>
                <CalendarIcon
                  color="white"
                  height={20}
                  testID="calendar-icon"
                  width={20}
                />
                <StyledActionButtonLabel>Save</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
          </StyledActionButtons>
        );
      }}
    >
      <StyledListItem>
        <StyledListItemTitle>{bankHoliday.title}</StyledListItemTitle>
        <StyledListItemDate>{bankHoliday.date}</StyledListItemDate>
      </StyledListItem>
    </Swipeable>
  );
};
