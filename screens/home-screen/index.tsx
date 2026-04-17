import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import { useBankHolidays } from "@/domains/bank-holidays/hooks/use-bank-holidays";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";

import { SwipeableItem } from "../../domains/bank-holidays/components/swipable-item";
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
  const shouldShowError = isError && bankHolidays.length === 0;

  const handleEdit = (bankHoliday: BankHolidayStateEvent) => {
    router.push(`/edit/${bankHoliday.id}`);
  };

  const handleDelete = (bankHoliday: BankHolidayStateEvent) => {
    // Handle delete action (e.g., show a confirmation dialog)
  };

  const handleSave = (bankHoliday: BankHolidayStateEvent) => {
    // Add to the user's native calendar (e.g., using react-native-calendar-events)
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
