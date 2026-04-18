import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useState } from "react";
import { AccessibilityInfo, Alert, Linking } from "react-native";
import RNCalendarEvents from "react-native-calendar-events";
import { useTheme } from "styled-components/native";

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
  const theme = useTheme();
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
  const [hasDeniedCalendarPermission, setHasDeniedCalendarPermission] =
    useState(false);
  const shouldShowError = isError && bankHolidays.length === 0;
  const bankHolidayCountLabel = `Bank holidays, ${bankHolidays.length} items`;

  const handleEdit = (bankHoliday: BankHolidayStateEvent) => {
    router.push(`/edit/${bankHoliday.id}`);
  };

  const handleDelete = (bankHoliday: BankHolidayStateEvent) => {
    deleteBankHoliday(bankHoliday.id);
    AccessibilityInfo.announceForAccessibility(
      `${bankHoliday.title} deleted from the list.`,
    );
  };

  const handleSave = async (bankHoliday: BankHolidayStateEvent) => {
    try {
      const permissionStatus = await RNCalendarEvents.requestPermissions();

      if (permissionStatus !== "authorized") {
        if (hasDeniedCalendarPermission) {
          AccessibilityInfo.announceForAccessibility(
            "Calendar access needed. Allow calendar access in Settings to add events.",
          );
          Alert.alert(
            "Calendar access needed",
            "Allow calendar access in Settings to add events.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  void Linking.openSettings();
                },
              },
            ],
          );
        } else {
          AccessibilityInfo.announceForAccessibility(
            "Calendar access needed. Allow calendar access to add events.",
          );
          Alert.alert(
            "Calendar access needed",
            "Allow calendar access to add events.",
          );
        }

        setHasDeniedCalendarPermission(true);

        return;
      }

      setHasDeniedCalendarPermission(false);

      await RNCalendarEvents.saveEvent(
        bankHoliday.title,
        createCalendarEventDetails(bankHoliday.date) as Parameters<
          typeof RNCalendarEvents.saveEvent
        >[1],
      );

      AccessibilityInfo.announceForAccessibility(
        `${bankHoliday.title} has been added to your calendar.`,
      );

      Alert.alert(
        "Event saved",
        `${bankHoliday.title} has been added to your calendar.`,
      );
    } catch {
      AccessibilityInfo.announceForAccessibility(
        "Could not save event. Try again in a moment.",
      );
      Alert.alert("Could not save event", "Try again in a moment.");
    }
  };

  return (
    <StyledContainer>
      <StyledTitle accessibilityRole="header">
        Street Group Tech Test
      </StyledTitle>
      <StyledBody>Jasper van Es</StyledBody>

      {isLoading ? (
        <StyledBody accessibilityLiveRegion="polite" accessibilityRole="alert">
          Loading bank holidays...
        </StyledBody>
      ) : null}
      {shouldShowError ? (
        <StyledBody accessibilityLiveRegion="assertive" accessibilityRole="alert">
          Could not load bank holidays.
        </StyledBody>
      ) : null}

      {!isLoading && !shouldShowError ? (
        <FlashList<BankHolidayStateEvent>
          accessibilityHint="Swipe left on a holiday to reveal add, edit, and delete actions"
          accessibilityLabel={bankHolidayCountLabel}
          accessibilityRole="list"
          contentContainerStyle={StyledListContent}
          data={bankHolidays}
          keyExtractor={(item) => `${item.date}-${item.title}`}
          onRefresh={refreshBankHolidays}
          style={{
            marginTop: 24,
            marginBottom: 24,
            backgroundColor: theme.colors.background,
          }}
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

      <StyledBody accessibilityHint="Pull down on the list to refresh bank holidays">
        Pull to refresh
      </StyledBody>
    </StyledContainer>
  );
}
