import { FlashList } from "@shopify/flash-list";

import { useBankHolidays } from "@/domains/bank-holidays/hooks/use-bank-holidays";
import { BankHolidayEvent } from "@/domains/bank-holidays/types";

import {
  StyledBody,
  StyledContainer,
  StyledListContent,
  StyledListItem,
  StyledListItemDate,
  StyledListItemTitle,
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
        <FlashList<BankHolidayEvent>
          contentContainerStyle={StyledListContent}
          data={bankHolidays}
          keyExtractor={(item) => `${item.date}-${item.title}`}
          onRefresh={refreshBankHolidays}
          renderItem={({ item }) => {
            return (
              <StyledListItem>
                <StyledListItemTitle>{item.title}</StyledListItemTitle>
                <StyledListItemDate>{item.date}</StyledListItemDate>
              </StyledListItem>
            );
          }}
          refreshing={isRefreshing}
        />
      ) : null}

      <StyledBody>Pull to refresh.</StyledBody>
    </StyledContainer>
  );
}
