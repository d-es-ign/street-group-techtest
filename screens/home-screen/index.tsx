import { FlashList } from "@shopify/flash-list";

import { useBankHolidaysQuery } from "@/domains/bank-holidays/hooks/queries/use-bank-holidays-query";
import { BankHolidayEvent } from "@/domains/bank-holidays/types";

import {
  StyledBody,
  StyledCard,
  StyledContainer,
  StyledListContent,
  StyledListItem,
  StyledListItemMeta,
  StyledListItemTitle,
  StyledTitle,
} from "./home-screen.styles";

export default function HomeScreen() {
  const { data, isError, isLoading } = useBankHolidaysQuery();
  const bankHolidayItems: BankHolidayEvent[] = data ?? [];

  return (
    <StyledContainer>
      <StyledCard>
        <StyledTitle accessibilityRole="header">
          Street Group Tech Test
        </StyledTitle>
        <StyledBody>UK bank holidays from GOV.UK.</StyledBody>

        {isLoading ? <StyledBody>Loading bank holidays...</StyledBody> : null}
        {isError ? (
          <StyledBody>Could not load bank holidays.</StyledBody>
        ) : null}

        {!isLoading && !isError ? (
          <FlashList
            contentContainerStyle={StyledListContent}
            data={bankHolidayItems}
            keyExtractor={(item) => item.title + item.date}
            renderItem={({ item }) => {
              return (
                <StyledListItem>
                  <StyledListItemTitle>{item.title}</StyledListItemTitle>
                  <StyledListItemMeta>{item.date}</StyledListItemMeta>
                </StyledListItem>
              );
            }}
          />
        ) : null}
      </StyledCard>
    </StyledContainer>
  );
}
