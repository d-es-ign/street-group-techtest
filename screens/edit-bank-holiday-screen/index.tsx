import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Modal } from "react-native";

import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";

import {
  StyledButton,
  StyledButtonContainer,
  StyledButtonLabel,
  StyledDatePickerContainer,
  StyledFieldLabel,
  StyledModalBackdrop,
  StyledModalBody,
  StyledModalButtonContainer,
  StyledModalCard,
  StyledScreen,
  StyledTextInput,
  StyledTitle,
  StyledValidationMessage,
} from "./edit-bank-holiday-screen.styles";

interface EditBankHolidayScreenProps {
  bankHoliday: BankHolidayStateEvent;
}

const createDateFromValue = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const createMaximumDate = (today: Date) => {
  const maximumDate = new Date(today);

  maximumDate.setMonth(maximumDate.getMonth() + 6);

  return maximumDate;
};

const formatLocalDate = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const EditBankHolidayScreen = ({
  bankHoliday,
}: EditBankHolidayScreenProps) => {
  const { id, notes, bunting } = bankHoliday;
  const updateBankHoliday = useBankHolidaysStore(
    (state) => state.updateBankHoliday,
  );

  const today = useMemo(() => new Date(), []);

  const maximumDate = useMemo(() => createMaximumDate(today), [today]);
  const [title, setTitle] = useState(bankHoliday.title);
  const [date, setDate] = useState(() => createDateFromValue(bankHoliday.date));
  const [isSaveConfirmationVisible, setIsSaveConfirmationVisible] =
    useState(false);
  const isTitleEmpty = title.trim().length === 0;
  const [isValidationMessageRendered, setIsValidationMessageRendered] =
    useState(isTitleEmpty);
  const [validationMessageOpacity] = useState(
    () => new Animated.Value(isTitleEmpty ? 1 : 0),
  );
  const isNextValidationMessageVisibleRef = useRef(isTitleEmpty);

  const fadeInValidationMessage = () => {
    isNextValidationMessageVisibleRef.current = true;
    setIsValidationMessageRendered(true);
    validationMessageOpacity.stopAnimation();

    Animated.timing(validationMessageOpacity, {
      duration: 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutValidationMessage = () => {
    isNextValidationMessageVisibleRef.current = false;
    validationMessageOpacity.stopAnimation();

    Animated.timing(validationMessageOpacity, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      if (!isNextValidationMessageVisibleRef.current) {
        setIsValidationMessageRendered(false);
      }
    });
  };

  const handleConfirmSave = () => {
    const trimmedTitle = title.trim();
    const updatedBankHoliday: BankHolidayStateEvent = {
      id,
      title: trimmedTitle,
      date: formatLocalDate(date),
      notes,
      bunting,
    };

    setIsSaveConfirmationVisible(false);
    updateBankHoliday(updatedBankHoliday);
    AccessibilityInfo.announceForAccessibility(
      `${trimmedTitle} saved successfully.`,
    );
    handleBack();
  };

  const handleSave = () => {
    if (isTitleEmpty) {
      AccessibilityInfo.announceForAccessibility("Title can't be empty.");
      return;
    }

    setIsSaveConfirmationVisible(true);
  };

  const handleCancelSave = () => {
    setIsSaveConfirmationVisible(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleTitleChange = (value: string) => {
    const isNextTitleEmpty = value.trim().length === 0;

    if (isNextTitleEmpty) {
      fadeInValidationMessage();
    }

    if (!isNextTitleEmpty && isValidationMessageRendered) {
      fadeOutValidationMessage();
    }

    setTitle(value);
  };

  return (
    <StyledScreen>
      <StyledTitle accessibilityRole="header">Edit bank holiday</StyledTitle>

      <StyledFieldLabel>Title (required)</StyledFieldLabel>
      <StyledTextInput
        accessibilityHint="Enter a title for this bank holiday"
        accessibilityLabel="Bank holiday title"
        onChangeText={handleTitleChange}
        value={title}
      />
      {isValidationMessageRendered ? (
        <Animated.View style={{ opacity: validationMessageOpacity }}>
          <StyledValidationMessage accessibilityLiveRegion="assertive" accessibilityRole="alert">
            Title can&apos;t be empty.
          </StyledValidationMessage>
        </Animated.View>
      ) : null}

      <StyledFieldLabel>
        Date (must be within the next 6 months)
      </StyledFieldLabel>
      <StyledDatePickerContainer>
        <DateTimePicker
          accessibilityHint="Choose a date within the next 6 months"
          accessibilityLabel="Bank holiday date"
          maximumDate={maximumDate}
          minimumDate={today}
          mode="date"
          onChange={(_event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          value={date}
        />
      </StyledDatePickerContainer>
      <StyledButtonContainer>
        <StyledButton
          accessibilityHint="Saves your changes after confirmation"
          accessibilityLabel="Save changes"
          accessibilityRole="button"
          accessibilityState={{ disabled: isTitleEmpty }}
          disabled={isTitleEmpty}
          variant="success"
          onPress={handleSave}
        >
          <StyledButtonLabel>Save</StyledButtonLabel>
        </StyledButton>
        <StyledButton
          accessibilityHint="Returns to the previous screen without saving"
          accessibilityLabel="Go back"
          accessibilityRole="button"
          variant="accent"
          onPress={handleBack}
        >
          <StyledButtonLabel>Back</StyledButtonLabel>
        </StyledButton>
      </StyledButtonContainer>

      <Modal
        animationType="fade"
        onRequestClose={handleCancelSave}
        transparent
        visible={isSaveConfirmationVisible}
      >
        <StyledModalBackdrop>
          <StyledModalCard accessibilityRole="alert" accessibilityViewIsModal>
            <StyledTitle accessibilityRole="header">Save changes?</StyledTitle>
            <StyledModalBody>
              Save your changes to this bank holiday before going back.
            </StyledModalBody>
            <StyledModalButtonContainer>
              <StyledButton
                accessibilityHint="Closes the confirmation dialog"
                accessibilityLabel="Cancel save changes"
                accessibilityRole="button"
                variant="accent"
                onPress={handleCancelSave}
              >
                <StyledButtonLabel>Cancel</StyledButtonLabel>
              </StyledButton>
              <StyledButton
                accessibilityHint="Confirms and saves your changes"
                accessibilityLabel="Confirm save changes"
                accessibilityRole="button"
                variant="success"
                onPress={handleConfirmSave}
              >
                <StyledButtonLabel>Confirm</StyledButtonLabel>
              </StyledButton>
            </StyledModalButtonContainer>
          </StyledModalCard>
        </StyledModalBackdrop>
      </Modal>
    </StyledScreen>
  );
};
