import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Animated, Modal } from "react-native";

import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";

import {
  StyledButton,
  StyledButtonContainer,
  StyledButtonLabel,
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
  const [isValidationMessageVisible, setIsValidationMessageVisible] =
    useState(false);
  const [validationMessageOpacity] = useState(() => new Animated.Value(0));
  const isTitleEmpty = title.trim().length === 0;

  const showValidationMessage = () => {
    setIsValidationMessageVisible(true);

    Animated.timing(validationMessageOpacity, {
      duration: 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const hideValidationMessage = () => {
    Animated.timing(validationMessageOpacity, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setIsValidationMessageVisible(false);
    });
  };

  const handleConfirmSave = () => {
    const updatedBankHoliday: BankHolidayStateEvent = {
      id,
      title: title.trim(),
      date: formatLocalDate(date),
      notes,
      bunting,
    };

    setIsSaveConfirmationVisible(false);
    updateBankHoliday(updatedBankHoliday);
    handleBack();
  };

  const handleSave = () => {
    if (isTitleEmpty) {
      showValidationMessage();

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

  const handleTitleFocus = () => {
    if (isValidationMessageVisible) {
      hideValidationMessage();
    }
  };

  const handleTitleBlur = () => {
    if (isTitleEmpty) {
      showValidationMessage();
    }
  };

  return (
    <StyledScreen>
      <StyledTitle>Edit bank holiday</StyledTitle>

      <StyledFieldLabel>Title</StyledFieldLabel>
      <StyledTextInput
        onBlur={handleTitleBlur}
        onChangeText={setTitle}
        onFocus={handleTitleFocus}
        value={title}
      />
      {isValidationMessageVisible ? (
        <Animated.View style={{ opacity: validationMessageOpacity }}>
          <StyledValidationMessage>Title can&apos;t be empty.</StyledValidationMessage>
        </Animated.View>
      ) : null}

      <StyledFieldLabel>Date</StyledFieldLabel>
      <DateTimePicker
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
      <StyledButtonContainer>
        <StyledButton disabled={isTitleEmpty} variant="success" onPress={handleSave}>
          <StyledButtonLabel>Save</StyledButtonLabel>
        </StyledButton>
        <StyledButton variant="accent" onPress={handleBack}>
          <StyledButtonLabel>Back</StyledButtonLabel>
        </StyledButton>
      </StyledButtonContainer>

      <Modal
        animationType="fade"
        transparent
        visible={isSaveConfirmationVisible}
      >
        <StyledModalBackdrop>
          <StyledModalCard>
            <StyledTitle>Save changes?</StyledTitle>
            <StyledModalBody>
              Save your changes to this bank holiday before going back.
            </StyledModalBody>
            <StyledModalButtonContainer>
              <StyledButton variant="accent" onPress={handleCancelSave}>
                <StyledButtonLabel>Cancel</StyledButtonLabel>
              </StyledButton>
              <StyledButton variant="success" onPress={handleConfirmSave}>
                <StyledButtonLabel>Confirm</StyledButtonLabel>
              </StyledButton>
            </StyledModalButtonContainer>
          </StyledModalCard>
        </StyledModalBackdrop>
      </Modal>
    </StyledScreen>
  );
};
