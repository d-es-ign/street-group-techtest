import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Alert } from "react-native";
import RNCalendarEvents from "react-native-calendar-events";

import { SwipeableItem } from "@/domains/bank-holidays/components/swipeable-item";
import { useBankHolidays } from "@/domains/bank-holidays/hooks/use-bank-holidays";
import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";
import { createCalendarEventDetails } from "@/utils/date-utils";

import {
  StyledBody,
  StyledContainer,
  StyledListContent,
  StyledTitle,
} from "./home-screen.styles";

export default function HomeScreen() {
  const {
    bankHolidays,
    isError,
    isLoading,
    isRefreshing,
    refreshBankHolidays,
  } = useBankHolidays();
  const deleteBankHoliday = useBankHolidaysStore(
    (state) => state.deleteBankHoliday,
  );
  const shouldShowError = isError && bankHolidays.length === 0;

  const handleEdit = (bankHoliday: BankHolidayStateEvent) => {
    router.push(`/edit/${bankHoliday.id}`);
  };

  const handleDelete = (bankHoliday: BankHolidayStateEvent) => {
    deleteBankHoliday(bankHoliday.id);
  };

  const handleSave = async (bankHoliday: BankHolidayStateEvent) => {
    try {
      const permissionStatus = await RNCalendarEvents.requestPermissions();

      if (permissionStatus !== "authorized") {
        Alert.alert(
          "Calendar access needed",
          "Allow calendar access to add events.",
        );

        return;
      }

      await RNCalendarEvents.saveEvent(
        bankHoliday.title,
        createCalendarEventDetails(bankHoliday.date) as Parameters<
          typeof RNCalendarEvents.saveEvent
        >[1],
      );

      Alert.alert(
        "Event saved",
        `${bankHoliday.title} has been added to your calendar.`,
      );
    } catch {
      Alert.alert("Could not save event", "Try again in a moment.");
    }
  };

  return (
    <StyledContainer>
      <StyledTitle accessibilityRole="header">
        Street Group Tech Test
      </StyledTitle>
      <StyledBody>UK bank holidays from GOV.UK.</StyledBody>

      {isLoading ? <StyledBody>Loading bank holidays...</StyledBody> : null}
      {shouldShowError ? (
        <StyledBody>Could not load bank holidays.</StyledBody>
      ) : null}

      {!isLoading && !shouldShowError ? (
        <FlashList<BankHolidayStateEvent>
          contentContainerStyle={StyledListContent}
          data={bankHolidays}
          keyExtractor={(item) => `${item.date}-${item.title}`}
          onRefresh={refreshBankHolidays}
          renderItem={({ item }) => {
            return (
              <SwipeableItem
                bankHoliday={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSave={handleSave}
              />
            );
          }}
          refreshing={isRefreshing}
        />
      ) : null}

      <StyledBody>Pull to refresh.</StyledBody>
    </StyledContainer>
  );
}
